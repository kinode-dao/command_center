use base64::{engine::general_purpose, Engine as _};
use std::collections::HashMap;
use std::path::Path;

use kinode_process_lib::vfs::{
    create_drive, create_file, open_dir, open_file, DirEntry, FileType, SeekFrom, VfsAction,
    VfsRequest,
};
use kinode_process_lib::{
    await_message, call_init, get_blob, http, our_capabilities, println, spawn, Address, Message,
    OnExit, Request, Response, LazyLoadBlob
};

use kinode_process_lib::http::{
    WsMessageType, send_ws_push, bind_ws_path
};

use llm_interface::openai::*;
use stt_interface::*;
use telegram_interface::*;

mod structs;
use structs::*;

mod tg_api;

use files_lib::encryption::{decrypt_data, ENCRYPTED_CHUNK_SIZE};
use files_lib::structs::{
    BackupRequestResponse, ClientRequest, ServerResponse, UiRequest, WorkerRequest, WorkerStatus,
};
use files_lib::{import_notes, read_nested_dir_light};

wit_bindgen::generate!({
    path: "target/wit",
    world: "process-v0",
});

/////////////////////////////////////////////////
// functions that fulfill HTTP requests from UI

fn fetch_backup_data(state: &mut State) -> anyhow::Result<()> {
    let backup_data = serde_json::to_vec(&serde_json::json!({
        "backups_time_map": state.backup_info.backups_time_map,
        "notes_last_backed_up_at": state.backup_info.notes_last_backed_up_at,
        "notes_backup_provider": state.backup_info.notes_backup_provider,
    }))?;
    http::send_response(
        http::StatusCode::OK,
        Some(HashMap::from([(
            "Content-Type".to_string(),
            "application/json".to_string(),
        )])),
        backup_data,
    );
    Ok(())
}

fn fetch_api_keys(state: &mut State) -> anyhow::Result<()> {
    let config = &state.api_keys;
    let response_body = serde_json::to_string(&config)?;
    http::send_response(
        http::StatusCode::OK,
        Some(HashMap::from([(
            "Content-Type".to_string(),
            "application/json".to_string(),
        )])),
        response_body.as_bytes().to_vec(),
    );
    Ok(())
}

fn fetch_notes(our_files_path: &String) -> anyhow::Result<()> {
    let dir_entry: DirEntry = DirEntry {
        path: our_files_path.to_string(),
        file_type: FileType::Directory,
    };

    let notes = files_lib::read_nested_dir(dir_entry)?;

    let response_body = serde_json::to_string(&notes)?;
    http::send_response(
        http::StatusCode::OK,
        Some(HashMap::from([(
            "Content-Type".to_string(),
            "application/json".to_string(),
        )])),
        response_body.as_bytes().to_vec(),
    );
    Ok(())
}

fn submit_api_keys(
    state: &mut State,
    pkgs: &HashMap<Pkg, Address>,
    body_bytes: &[u8],
) -> anyhow::Result<()> {
    let api_keys = serde_json::from_slice::<ApiKeys>(body_bytes)?;
    println!("Modifying api_keys to {:?}", api_keys);
    state.api_keys = api_keys;

    for (pkg, addr) in pkgs.iter() {
        println!("submit_api_keys: matching pkg: {:?}", pkg);
        match pkg {
            Pkg::LLM => {
                if let Some(openai_key) = &state.api_keys.openai_key {
                    let req = serde_json::to_vec(&LLMRequest::RegisterOpenaiApiKey(
                        RegisterApiKeyRequest {
                            api_key: openai_key.clone(),
                        },
                    ))?;
                    let _ = Request::new()
                        .target(addr.clone())
                        .body(req)
                        .send_and_await_response(5)??;
                }
                if let Some(groq_key) = &state.api_keys.groq_key {
                    let req = serde_json::to_vec(
                        &llm_interface::openai::LLMRequest::RegisterGroqApiKey(
                            RegisterApiKeyRequest {
                                api_key: groq_key.clone(),
                            },
                        ),
                    )?;
                    let _ = Request::new()
                        .target(addr.clone())
                        .body(req)
                        .send_and_await_response(5)??;
                }
            }
            Pkg::STT => {
                if let Some(openai_key) = &state.api_keys.openai_key {
                    let req = serde_json::to_vec(&STTRequest::RegisterApiKey(openai_key.clone()))?;
                    let _ = Request::new()
                        .target(addr.clone())
                        .body(req)
                        .send_and_await_response(5)??;
                }
            }
            Pkg::Telegram => {
                if let Some(telegram_key) = &state.api_keys.telegram_key {
                    let init = TgInitialize {
                        token: telegram_key.clone(),
                        params: None,
                    };
                    let req = serde_json::to_vec(&TgRequest::RegisterApiKey(init))?;
                    let _ = Request::new()
                        .target(addr.clone())
                        .body(req)
                        .send_and_await_response(5)??;
                }
            }
        }
    }
    state.save();

    http::send_response(
        http::StatusCode::OK,
        Some(HashMap::from([(
            "Content-Type".to_string(),
            "application/json".to_string(),
        )])),
        b"{\"message\": \"success\"}".to_vec(),
    );
    Ok(())
}

fn import_notes_from_ui(body_bytes: &[u8], import_to: &String) -> anyhow::Result<()> {
    let directory: HashMap<String, String> =
        serde_json::from_slice::<HashMap<String, String>>(body_bytes)?;
    if import_notes(directory, import_to).is_ok() {
        http::send_response(
            http::StatusCode::OK,
            Some(HashMap::from([(
                "Content-Type".to_string(),
                "application/json".to_string(),
            )])),
            b"{\"message\": \"success\"}".to_vec(),
        );
        Ok(())
    } else {
        Err(anyhow::anyhow!("Failed to import notes"))
    }
}

/////////////////////////////////////////////////

// spawns a worker process for file transfer (whether it will be for receiving or sending)
fn initialize_worker(
    our: Address,
    current_worker_address: &mut Option<Address>,
) -> anyhow::Result<()> {
    let our_worker = spawn(
        None,
        &format!("{}/pkg/worker.wasm", our.package_id()),
        OnExit::None,
        our_capabilities(),
        vec![],
        false,
    )?;

    // temporarily stores worker address as while the worker is alive
    *current_worker_address = Some(Address {
        node: our.node.clone(),
        process: our_worker.clone(),
    });
    Ok(())
}

// for making backup related requests from the ui
// currently, terminal requests are funneled to this, as the ui requests are not built yet. see `fn handle_message`.
fn handle_ui_backup_request(
    our: &Address,
    state: &mut State,
    paths: &HashMap<&str, String>,
    current_worker_address: &mut Option<Address>,
    body: &[u8],
) -> anyhow::Result<()> {
    let deserialized = serde_json::from_slice::<UiRequest>(body)?;
    match deserialized {
        // making backup request to server
        UiRequest::BackupRequest {
            node_id,
            password_hash,
            ..
        } => {
            // need password_hash to encrypt data with. necessary for decryption later.
            // temporarily storing password_hash, as soon as we get a ServerResponse::Confirm, it's deleted
            state.backup_info.data_password_hash = Some(password_hash.clone());
            state.save();

            let backup_request = serde_json::to_vec(&ClientRequest::BackupRequest { size: 0 })?;
            let _ = Request::to(Address::new(
                node_id,
                ("main", "command_center", "appattacc.os"),
            ))
            .expects_response(5)
            .body(backup_request)
            .send();
        }
        // client making backup retrieval request to server
        UiRequest::BackupRetrieve { node_id } => {
            // spawn receiving worker
            initialize_worker(our.clone(), current_worker_address)?;

            let backup_retrieve = serde_json::to_vec(&ClientRequest::BackupRetrieve {
                worker_address: current_worker_address.clone().unwrap(),
            })?;
            let _retrieve_backup = Request::to(Address::new(
                node_id.clone(),
                ("main", "command_center", "appattacc.os"),
            ))
            .expects_response(5)
            .body(backup_retrieve)
            .send();

            // start receiving data on the worker
            let _worker_request = Request::new()
                .body(serde_json::to_vec(
                    &WorkerRequest::InitializeReceiverWorker {
                        receive_to_dir: paths
                            .get("retrieved_encrypted_backup_path")
                            .unwrap()
                            .clone(),
                    },
                )?)
                .target(&current_worker_address.clone().unwrap())
                .send()?;
        }
        // decrypt retrieved backup
        UiRequest::Decrypt { password_hash, .. } => {
            // /command_center:appattacc.os/retrieved_encrypted_backup
            // this is the folder where we retrieved the encrypted backup
            let dir_entry: DirEntry = DirEntry {
                path: paths
                    .get("retrieved_encrypted_backup_path")
                    .unwrap()
                    .clone(),
                file_type: FileType::Directory,
            };

            // remove and re-create temp_files_path so it's empty
            let request: VfsRequest = VfsRequest {
                path: paths.get("temp_files_path").unwrap().clone(),
                action: VfsAction::RemoveDirAll,
            };
            let _message = Request::new()
                .target(("our", "vfs", "distro", "sys"))
                .body(serde_json::to_vec(&request)?)
                .send_and_await_response(5)?;
            let request: VfsRequest = VfsRequest {
                path: paths.get("temp_files_path").unwrap().clone(),
                action: VfsAction::CreateDirAll,
            };
            let _message = Request::new()
                .target(("our", "vfs", "distro", "sys"))
                .body(serde_json::to_vec(&request)?)
                .send_and_await_response(5)?;

            // get all the paths, not content
            let dir = read_nested_dir_light(dir_entry)?;
            // iterate over all files, and decrypt each one
            for path in dir.keys() {
                let mut active_file = open_file(path, false, Some(5))?;
                let size = active_file.metadata()?.len;
                // make sure we start from 0th position every time,
                // there were some bugs related to files not being closed, so we would start reading from the previous location
                let _pos = active_file.seek(SeekFrom::Start(0))?;

                // the path of each encrypted file looks like so:
                // command_center:appattacc.os/retrieved_encrypted_backup/GAXPVM7g...htLlOiu_E3A
                let path = Path::new(path);
                let file_name = path
                    .file_name()
                    .unwrap_or_default()
                    .to_str()
                    .unwrap_or_default()
                    .to_string();

                // file name decryption
                //
                // base64/url_safe encoded encrypted file name -> base64 decoded (still encrypted)
                // base64 was necessary because of file names not accepting all encrypted chars
                let decoded_vec = general_purpose::URL_SAFE.decode(&file_name)?;
                // decoded, encrypted file name -> decrypted file name
                let decrypted_vec = match decrypt_data(&decoded_vec, password_hash.as_str()) {
                    Ok(vec) => vec,
                    Err(e) => {
                        println!("couldn't decrypt file name");
                        return Err(anyhow::anyhow!(e));
                    }
                };
                let decrypted_path = String::from_utf8(decrypted_vec)
                    .map_err(|e| anyhow::anyhow!("Failed to convert bytes to string: {}", e))?;
                println!("decrypting {}", decrypted_path);
                // get full file_path
                // one encrypted file name (e.g. q23ewdfvwerv) could be decrypted to a file nested in a folder (e.g. a/b/c/file.md)
                let file_path = format!(
                    "{}/{}",
                    paths.get("temp_files_path").unwrap().clone(),
                    decrypted_path
                );
                // parent path becomes e.g. a/b/c, separated out from a/b/c/file.md
                let parent_path = Path::new(&file_path)
                    .parent()
                    .and_then(|p| p.to_str())
                    .unwrap_or("")
                    .to_string();
                // creates nested parent directory (/a/b/c) all the way to the file
                let request = VfsRequest {
                    path: format!("/{}", parent_path).to_string(),
                    action: VfsAction::CreateDirAll,
                };
                let _message = Request::new()
                    .target(("our", "vfs", "distro", "sys"))
                    .body(serde_json::to_vec(&request)?)
                    .send_and_await_response(5)?;
                let _dir = open_dir(&parent_path, false, Some(5))?;

                // chunking and decrypting each file
                //
                // must be decrypted at specific encrypted chunk size.
                // encrypted chunk size = chunk size + 44, see files_lib/src/encryption.rs
                //
                // potential pitfall in the future is if we modify chunk size,
                // and try to decrypt at size non corresponding to the size at which it was encrypted.
                let num_chunks = (size as f64 / ENCRYPTED_CHUNK_SIZE as f64).ceil() as u64;

                // iterate over encrypted file
                for i in 0..num_chunks {
                    let offset = i * ENCRYPTED_CHUNK_SIZE;
                    let length = ENCRYPTED_CHUNK_SIZE.min(size - offset); // size=file size
                    let mut buffer = vec![0; length as usize];
                    let _pos = active_file.seek(SeekFrom::Current(0))?;
                    active_file.read_at(&mut buffer)?;

                    // decrypt data with password_hash
                    let decrypted_bytes = match decrypt_data(&buffer, password_hash.as_str()) {
                        Ok(vec) => vec,
                        Err(_e) => {
                            println!("couldn't decrypt file data");
                            return Err(anyhow::anyhow!("couldn't decrypt file data"));
                        }
                    };

                    let dir = open_dir(&parent_path, false, None)?;

                    // there is an issue with open_file(create: true), so we have to do it manually
                    let entries = dir.read()?;
                    if entries.contains(&DirEntry {
                        path: file_path[1..].to_string(),
                        file_type: FileType::File,
                    }) {
                    } else {
                        let _file = create_file(&file_path, Some(5))?;
                    }

                    let mut file = open_file(&file_path, false, Some(5))?;
                    file.append(&decrypted_bytes)?;
                }
            }
            // after all decryption is successful, the files are stored in the files_temp folder.
            // we remove the files folder (where our current notes are stored), and rename files_temp to files,
            // effectively overwriting files.
            let request: VfsRequest = VfsRequest {
                path: paths.get("our_files_path").unwrap().clone(),
                action: VfsAction::RemoveDirAll,
            };
            let _message = Request::new()
                .target(("our", "vfs", "distro", "sys"))
                .body(serde_json::to_vec(&request)?)
                .send_and_await_response(5)?;
            let request: VfsRequest = VfsRequest {
                path: paths.get("temp_files_path").unwrap().clone(),
                action: VfsAction::Rename {
                    new_path: paths.get("our_files_path").unwrap().clone().to_string(),
                },
            };
            let _message = Request::new()
                .target(("our", "vfs", "distro", "sys"))
                .body(serde_json::to_vec(&request)?)
                .send_and_await_response(5)?;
            // create empty files_temp for future use
            let _ = create_drive(our.package_id(), "files_temp", Some(5));
        }
    }
    println!("decryption done");
    Ok(())
}

// handles backup related messages from another node
fn handle_backup_message(
    our: &Address,
    state: &mut State,
    paths: &HashMap<&str, String>,
    current_worker_address: &mut Option<Address>,
    message: &Message,
) -> anyhow::Result<()> {
    println!("HERE");
    match &message {
        Message::Request { body, .. } => {
            println!("HERE1");

            let deserialized: ClientRequest = serde_json::from_slice::<ClientRequest>(body)?;
            println!("HERE2");

            match deserialized {
                // server receiving backup request from client
                ClientRequest::BackupRequest { size } => {
                    println!("HERE3");

                    // TODO: add criterion here
                    // whether we want to provide backup or not.
                    // currently responds with Confirm, should respond with Confirm or Decline based on a setting

                    state
                        .backup_info
                        .backups_time_map
                        .insert(message.source().node.to_string(), chrono::Utc::now());
                    state.save();
                    println!("HERE4");

                    initialize_worker(our.clone(), current_worker_address)?;

                    let backup_response: Vec<u8> = serde_json::to_vec(
                        &ServerResponse::BackupRequestResponse(BackupRequestResponse::Confirm {
                            worker_address: current_worker_address.clone().unwrap(),
                        }),
                    )?;
                    let _resp: Result<(), anyhow::Error> =
                        Response::new().body(backup_response).send();
                    println!("HERE5");

                    // telling the worker to start receiving the backup
                    let _worker_request = Request::new()
                        .body(serde_json::to_vec(
                            &WorkerRequest::InitializeReceiverWorker {
                                receive_to_dir: format!(
                                    "{}/{}",
                                    paths.get("encrypted_storage_path").unwrap().clone(),
                                    message.source().node.clone()
                                ),
                            },
                        )?)
                        .target(&current_worker_address.clone().unwrap())
                        .send()?;
                    println!("HERE6");
                }
                // server receiving backup retrieval request from client
                ClientRequest::BackupRetrieve { worker_address } => {
                    initialize_worker(our.clone(), current_worker_address)?;

                    // telling the worker to start sending the encrypted backup to the client
                    let _worker_request = Request::new()
                        .body(serde_json::to_vec(
                            &WorkerRequest::InitializeSenderWorker {
                                target_worker: worker_address.clone(),
                                password_hash: None,
                                sending_from_dir: format!(
                                    "{}/{}",
                                    paths.get("encrypted_storage_path").unwrap(),
                                    worker_address.node()
                                ),
                            },
                        )?)
                        .target(&current_worker_address.clone().unwrap())
                        .send()?;

                    // telling the client what time the backup was from
                    let backup_response: Vec<u8> =
                        serde_json::to_vec(&ServerResponse::BackupRetrieveResponse(
                            state
                                .backup_info
                                .backups_time_map
                                .get(&message.source().node)
                                .copied(),
                        ))?;
                    let _resp: Result<(), anyhow::Error> =
                        Response::new().body(backup_response).send();
                }
            }
        }
        // receiving backup response from server
        Message::Response { body, .. } => {
            let deserialized: ServerResponse = serde_json::from_slice::<ServerResponse>(body)?;
            match deserialized {
                ServerResponse::BackupRetrieveResponse(datetime) => {
                    state.backup_info.notes_last_backed_up_at = datetime;
                    state.save()
                }
                ServerResponse::BackupRequestResponse(backup_response) => match backup_response {
                    BackupRequestResponse::Confirm { worker_address } => {
                        println!(
                            "received Confirm backup_response from {:?}",
                            message.source().node,
                        );

                        initialize_worker(our.clone(), current_worker_address)?;

                        // telling the worker to start sending the backup
                        let _worker_request = Request::new()
                            .body(serde_json::to_vec(
                                &WorkerRequest::InitializeSenderWorker {
                                    target_worker: worker_address,
                                    password_hash: state.backup_info.data_password_hash.clone(),
                                    sending_from_dir: paths.get("our_files_path").unwrap().clone(),
                                },
                            )?)
                            .target(&current_worker_address.clone().unwrap())
                            .send()?;

                        state.backup_info.notes_last_backed_up_at = Some(chrono::Utc::now());
                        state.backup_info.notes_backup_provider =
                            Some(message.source().node.clone());
                        // we dont need to store password hash any more
                        state.backup_info.data_password_hash = None;
                        state.save();
                    }
                    BackupRequestResponse::Decline { .. } => {
                        println!(
                            "received Decline backup_response from {:?}",
                            message.source().node,
                        );
                    }
                },
            }
        }
    }
    return Ok(());
}

// handles requests from the ui
fn handle_http_request(
    our: &Address,
    state: &mut State,
    ws_channel_id: &mut Option<u32>,
    pkgs: &HashMap<Pkg, Address>,
    paths: &HashMap<&str, String>,
    current_worker_address: &mut Option<Address>,
    body: &[u8],
) -> anyhow::Result<()> {
    let http_request = http::HttpServerRequest::from_bytes(body)?;
    
    if let http::HttpServerRequest::WebSocketOpen { channel_id, .. } = http_request {
        *ws_channel_id = Some(channel_id);
        return Ok(());
    }

    let http_request = http_request
        .request()
        .ok_or_else(|| anyhow::anyhow!("Failed to parse http request"))?;
    let path = http_request.path()?;
    let bytes = get_blob()
        .ok_or_else(|| anyhow::anyhow!("Failed to get blob"))?
        .bytes;
    match path.as_str() {
        "/fetch_api_keys" => fetch_api_keys(state),
        "/fetch_backup_data" => fetch_backup_data(state),
        "/submit_api_keys" => submit_api_keys(state, pkgs, &bytes),
        "/fetch_notes" => fetch_notes(paths.get("our_files_path").unwrap()),
        "/import_notes" => import_notes_from_ui(&bytes, paths.get("our_files_path").unwrap()),
        "/backup_request" => {
            // WIP, should take BackupRequest, BackupRetrieve, and Decrypt
            // (or decrypt should be done automatically?)
            println!("got /backup_request");
            let deserialized: Result<UiRequest, _> = serde_json::from_slice(&bytes);
            match deserialized {
                Ok(value) => {
                    println!("Deserialized backup request: {:?}", value);
                    let _ = handle_ui_backup_request(our, state, paths, current_worker_address, &bytes);
                    Ok(())
                }
                Err(e) => {
                    println!("Error deserializing backup request: {:?}", e);
                    println!("Received bytes: {:?}", String::from_utf8_lossy(&bytes));
                    Err(anyhow::anyhow!(
                        "Failed to deserialize backup request: {}",
                        e
                    ))
                }
            }
        }
        _ => Ok(()),
    }
}

fn handle_http_message(
    our: &Address,
    state: &mut State,
    ws_channel_id: &mut Option<u32>,
    pkgs: &HashMap<Pkg, Address>,
    paths: &HashMap<&str, String>,
    current_worker_address: &mut Option<Address>,
    message: &Message,
) -> anyhow::Result<()> {
    match message {
        Message::Request { ref body, .. } => {
            handle_http_request(our, state, ws_channel_id, pkgs, paths, current_worker_address, body)
        }
        Message::Response { .. } => Ok(()),
    }
}

fn handle_message(
    our: &Address,
    state: &mut State,
    ws_channel_id: &mut Option<u32>,
    pkgs: &HashMap<Pkg, Address>,
    paths: &HashMap<&str, String>,
    current_worker_address: &mut Option<Address>,
) -> anyhow::Result<()> {
    let message = await_message()?;

    if message.source().node != our.node {
        handle_backup_message(our, state, paths, current_worker_address, &message)?;
    }

    if let "http_server:distro:sys" | "http_client:distro:sys" =
        message.source().process.to_string().as_str()
    {
        return handle_http_message(our, state, ws_channel_id, pkgs, paths, current_worker_address, &message);
    }

    // current worker finishing up
    if let Some(worker_address) = current_worker_address {
        if worker_address == message.source() {
            match serde_json::from_slice(&message.body())? {
                WorkerStatus::Done => {
                    *current_worker_address = None;

                    let blob = LazyLoadBlob {
                        mime: Some("application/json".to_string()),
                        bytes: serde_json::json!({
                            "WorkerStatus": WorkerStatus::Done
                        })
                        .to_string()
                        .as_bytes()
                            .to_vec(),
                        };

                    send_ws_push(ws_channel_id.unwrap_or(0), WsMessageType::Text, blob);

                    return Ok(());
                }
            }
        }
    }

    // helper for debugging. remove for prod.
    // it takes inputs from the teriminal
    handle_ui_backup_request(our, state, paths, current_worker_address, &message.body())
}

const ICON: &str = include_str!("icon");
call_init!(init);
fn init(our: Address) {
    let mut ws_channel_id: Option<u32> = None;
    bind_ws_path("/", true, false).unwrap();

    let _ = http::serve_ui(
        &our,
        "ui",
        true,
        false,
        vec![
            "/",
            "/submit_api_keys",
            "/fetch_api_keys",
            "/fetch_notes",
            "/import_notes",
            "/backup_request",
            "/fetch_backup_data",
        ],
    );

    // add ourselves to the homepage
    Request::to(("our", "homepage", "homepage", "sys"))
        .body(
            serde_json::json!({
                "Add": {
                    "label": "Command Center",
                    "icon": ICON,
                    "path": "/", // just our root
                }
            })
            .to_string()
            .as_bytes()
            .to_vec(),
        )
        .send()
        .unwrap();

    let mut state = State::fetch()
        .unwrap_or_else(|| State::new(&our, ApiKeys::default(), BackupInfo::default()));

    let mut pkgs = HashMap::new();
    pkgs.insert(
        Pkg::LLM,
        Address::new(&our.node, ("openai", "command_center", "appattacc.os")),
    );
    pkgs.insert(
        Pkg::STT,
        Address::new(
            &our.node,
            ("speech_to_text", "command_center", "appattacc.os"),
        ),
    );
    pkgs.insert(
        Pkg::Telegram,
        Address::new(&our.node, ("tg", "command_center", "appattacc.os")),
    );

    // calling RegisterApiKey because it calls getUpdates (necessary every time a process is restarted)
    if let Some(telegram_key) = &state.api_keys.telegram_key {
        let init = TgInitialize {
            token: telegram_key.clone(),
            params: None,
        };
        let req = serde_json::to_vec(&TgRequest::RegisterApiKey(init));
        let _ = Request::new()
            .target(pkgs.get(&Pkg::Telegram).unwrap())
            .body(req.unwrap())
            .send_and_await_response(5);
    }

    let temp_files_path = create_drive(our.package_id(), "files_temp", Some(5)).unwrap();
    let our_files_path = create_drive(our.package_id(), "files", Some(5)).unwrap();
    let encrypted_storage_path =
        create_drive(our.package_id(), "encrypted_storage", Some(5)).unwrap();
    let retrieved_encrypted_backup_path =
        create_drive(our.package_id(), "retrieved_encrypted_backup", Some(5)).unwrap();
    let mut paths = HashMap::new();
    paths.insert("our_files_path", our_files_path);
    paths.insert("temp_files_path", temp_files_path);
    paths.insert(
        "retrieved_encrypted_backup_path",
        retrieved_encrypted_backup_path,
    );
    paths.insert("encrypted_storage_path", encrypted_storage_path);

    let mut current_worker_address: Option<Address> = None;

    loop {
        match handle_message(&our, &mut state, &mut ws_channel_id, &pkgs, &paths, &mut current_worker_address) {
            Ok(_) => {}
            Err(e) => println!("Error: {:?}", e),
        }
    }
}
