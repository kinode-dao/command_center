use std::collections::HashMap;

use kinode_process_lib::vfs::{create_drive, DirEntry, FileType};
use kinode_process_lib::{
    await_message, call_init, get_blob, http, our_capabilities, println, spawn, Address, Message,
    OnExit, Request, Response,
};

use llm_interface::openai::*;
use stt_interface::*;
use telegram_interface::*;

mod structs;
use structs::*;

mod tg_api;

use files_lib::{
    import_notes, BackupResponse, ClientRequest, ServerResponse, UiRequest, WorkerRequest,
    WorkerRequestType,
};

wit_bindgen::generate!({
    path: "target/wit",
    world: "process-v0",
});

fn handle_backup_message(
    our: &Address,
    message: &Message,
    data_password_hash: &mut String,
) -> anyhow::Result<()> {
    match &message {
        Message::Request { body, .. } => {
            let deserialized: ClientRequest = serde_json::from_slice::<ClientRequest>(body)?;
            match deserialized {
                // receiving backup retrieval request from client
                ClientRequest::BackupRetrieve { worker_address } => {
                    println!(
                        "got backup retrieval request from client: {:?}",
                        message.source().node,
                    );
                    let our_worker_address = initialize_worker(our.clone())?;

                    let _worker_request = Request::new()
                        .body(serde_json::to_vec(&WorkerRequest::Initialize {
                            request_type: WorkerRequestType::RetrievingBackup,
                            uploader_node: None,
                            target_worker: Some(worker_address),
                            password_hash: None,
                        })?)
                        .target(&our_worker_address)
                        .send_and_await_response(5)??;
                }
                // receiving backup request from client
                ClientRequest::BackupRequest { .. } => {
                    println!(
                        "got backup request from client: {:?}",
                        message.source().node,
                    );

                    // TODO: add criterion here
                    // whether we want to back up or not
                    let our_worker_address = initialize_worker(our.clone())?;

                    let backup_response: Vec<u8> = serde_json::to_vec(
                        &ServerResponse::BackupResponse(BackupResponse::Confirm {
                            worker_address: our_worker_address.clone(),
                        }),
                    )?;
                    let _resp: Result<(), anyhow::Error> =
                        Response::new().body(backup_response).send();

                    let _worker_request = Request::new()
                        .body(serde_json::to_vec(&WorkerRequest::Initialize {
                            request_type: WorkerRequestType::BackingUp,
                            uploader_node: Some(message.source().node.clone()),
                            target_worker: None,
                            password_hash: None,
                        })?)
                        .target(&our_worker_address)
                        .send_and_await_response(5)??;
                }
            }
        }
        // receiving backup response from server
        Message::Response { body, .. } => {
            let deserialized: ServerResponse = serde_json::from_slice::<ServerResponse>(body)?;
            match deserialized {
                ServerResponse::BackupResponse(backup_response) => {
                    if let BackupResponse::Confirm { worker_address } = backup_response {
                        println!(
                            "received Confirm backup_response from {:?}",
                            message.source().node,
                        );

                        let our_worker_address = initialize_worker(our.clone())?;

                        let _worker_request = Request::new()
                            .body(serde_json::to_vec(&WorkerRequest::Initialize {
                                request_type: WorkerRequestType::BackingUp,
                                uploader_node: None,
                                target_worker: Some(worker_address),
                                password_hash: Some(data_password_hash.clone()),
                            })?)
                            .target(&our_worker_address)
                            .send_and_await_response(5)??;
                    } else {
                        println!(
                            "received Decline backup_response from {:?}",
                            message.source().node
                        );
                    }
                }
            }
        }
    }
    return Ok(());
}

fn handle_http_message(
    our: &Address,
    message: &Message,
    state: &mut Option<State>,
    pkgs: &HashMap<Pkg, Address>,
) -> anyhow::Result<()> {
    match message {
        Message::Request { ref body, .. } => handle_http_request(our, state, body, pkgs),
        Message::Response { .. } => Ok(()),
    }
}

fn handle_http_request(
    our: &Address,
    state: &mut Option<State>,
    body: &[u8],
    pkgs: &HashMap<Pkg, Address>,
) -> anyhow::Result<()> {
    let http_request = http::HttpServerRequest::from_bytes(body)?
        .request()
        .ok_or_else(|| anyhow::anyhow!("Failed to parse http request"))?;
    let path = http_request.path()?;
    let bytes = get_blob()
        .ok_or_else(|| anyhow::anyhow!("Failed to get blob"))?
        .bytes;
    match path.as_str() {
        "/status" => {
            println!("fetching status");
            fetch_status()
        }
        "/submit_config" => submit_config(our, &bytes, state, pkgs),
        "/notes" => {
            println!("fetching notes");
            fetch_notes()
        }
        "/import_notes" => match import_notes(&bytes) {
            Ok(_) => {
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
            Err(e) => Err(e),
        },
        _ => Ok(()),
    }
}

fn fetch_status() -> anyhow::Result<()> {
    let state = State::fetch()
        .ok_or_else(|| anyhow::anyhow!("State being fetched for the first time (or failed)"))?;
    let config = &state.config;
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

fn fetch_notes() -> anyhow::Result<()> {
    let dir_entry: DirEntry = DirEntry {
        path: NOTES_PATH.to_string(),
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

// also creates state if doesn't exist
fn submit_config(
    our: &Address,
    body_bytes: &[u8],
    state: &mut Option<State>,
    pkgs: &HashMap<Pkg, Address>,
) -> anyhow::Result<()> {
    let initial_config = serde_json::from_slice::<InitialConfig>(body_bytes)?;
    match state {
        Some(state_) => {
            println!("Modifying state to {:?}", initial_config);
            state_.config = initial_config;
        }
        None => {
            println!("Creating state {:?}", initial_config);
            *state = Some(State::new(our, initial_config));
        }
    }

    if let Some(ref mut state) = state {
        for (pkg, addr) in pkgs.iter() {
            println!("submit_config: matching pkg: {:?}", pkg);
            match pkg {
                Pkg::LLM => {
                    if let Some(openai_key) = &state.config.openai_key {
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
                    if let Some(groq_key) = &state.config.groq_key {
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
                    if let Some(openai_key) = &state.config.openai_key {
                        let req =
                            serde_json::to_vec(&STTRequest::RegisterApiKey(openai_key.clone()))?;
                        let _ = Request::new()
                            .target(addr.clone())
                            .body(req)
                            .send_and_await_response(5)??;
                    }
                }
                Pkg::Telegram => {
                    if let Some(telegram_key) = &state.config.telegram_key {
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
    }
    Ok(())
}

fn initialize_worker(our: Address) -> anyhow::Result<Address> {
    let our_worker = spawn(
        None,
        &format!("{}/pkg/worker.wasm", our.package_id()),
        OnExit::None,
        our_capabilities(),
        vec![],
        false,
    )?;

    Ok(Address {
        node: our.node.clone(),
        process: our_worker,
    })
}

fn handle_message(
    our: &Address,
    state: &mut Option<State>,
    pkgs: &HashMap<Pkg, Address>,
    data_password_hash: &mut String,
) -> anyhow::Result<()> {
    let message = await_message()?;

    if message.source().node != our.node {
        handle_backup_message(our, &message, data_password_hash)?;
    }

    match message.source().process.to_string().as_str() {
        "http_server:distro:sys" | "http_client:distro:sys" => {
            handle_http_message(&our, &message, state, pkgs)
        }
        // TODO: add to handle_http_message later, when i implement the ui
        // for now, it takes inputs from the teriminal
        _ => match &message {
            Message::Request { body, .. } => {
                let deserialized = serde_json::from_slice::<UiRequest>(body)?;

                match deserialized {
                    // making backup retrieval request to server
                    UiRequest::BackupRetrieve {
                        node_id,
                        password_hash,
                    } => {
                        *data_password_hash = password_hash.clone();
                        println!("data_password_hash: {}", data_password_hash);

                        println!("sending backup retrieve request to server: {:?}", node_id);

                        let our_worker_address = initialize_worker(our.clone())?;

                        let backup_retrieve = serde_json::to_vec(&ClientRequest::BackupRetrieve {
                            worker_address: our_worker_address.clone(),
                        })?;
                        let _ = Request::to(Address::new(
                            node_id.clone(),
                            ("main", "command_center", "appattacc.os"),
                        ))
                        .expects_response(5)
                        .body(backup_retrieve)
                        .send();
                        println!("sent retrieve request to {}", node_id);

                        let _worker_request: Message = Request::new()
                            .body(serde_json::to_vec(&WorkerRequest::Initialize {
                                request_type: WorkerRequestType::RetrievingBackup,
                                uploader_node: Some(our.node.clone()),
                                target_worker: None,
                                password_hash: Some(data_password_hash.clone()),
                            })?)
                            .target(&our_worker_address)
                            .send_and_await_response(5)??;
                    }
                    // making backup request to server
                    UiRequest::BackupRequest {
                        node_id,
                        password_hash,
                        ..
                    } => {
                        *data_password_hash = password_hash.clone();
                        println!("data_password_hash: {}", data_password_hash);

                        println!("sending backup request to server: {:?}", node_id);

                        let backup_request =
                            serde_json::to_vec(&ClientRequest::BackupRequest { size: 0 })?;
                        let _ = Request::to(Address::new(
                            node_id,
                            ("main", "command_center", "appattacc.os"),
                        ))
                        .expects_response(5)
                        .body(backup_request)
                        .send();
                    }
                }
                Ok(())
            }
            _ => return Ok(()),
        },
    }
}

const ICON: &str = include_str!("icon");
const NOTES_PATH: &str = "/command_center:appattacc.os/files";
call_init!(init);
fn init(our: Address) {
    let _ = http::serve_ui(
        &our,
        "ui",
        true,
        false,
        vec!["/", "/submit_config", "/status", "/notes", "/import_notes"],
    );

    let mut state = State::fetch();

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

    // calling RegisterApiKey because it calls getUpdates (necessary every time a process is restarted)
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

    match &state.clone() {
        Some(state) => {
            if let Some(telegram_key) = &state.config.telegram_key {
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
        }
        None => {}
    }

    let _our_files_path = create_drive(our.package_id(), "files", Some(5));
    let _encrypted_storage_path = create_drive(our.package_id(), "encrypted_storage", Some(5));
    let mut data_password_hash = "".to_string();

    loop {
        match handle_message(&our, &mut state, &pkgs, &mut data_password_hash) {
            Ok(_) => {}
            Err(e) => println!("Error: {:?}", e),
        }
    }
}
