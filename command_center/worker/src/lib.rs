use base64::{engine::general_purpose, Engine as _};
use std::path::Path;

use kinode_process_lib::{
    await_message, call_init, get_blob, println,
    vfs::{
        create_file, open_dir, open_file, DirEntry, Directory, FileType, SeekFrom, VfsAction,
        VfsRequest,
    },
    Address, Message, Request,
};

use files_lib::encryption::{encrypt_data, CHUNK_SIZE};
use files_lib::read_nested_dir_light;
use files_lib::structs::{
    WorkerRequest, WorkerRequestType::BackingUp, WorkerRequestType::RetrievingBackup,
};

wit_bindgen::generate!({
    path: "target/wit",
    world: "process-v0",
});

fn handle_message(
    our: &Address,
    files_dir: &Directory,
    encrypted_storage_dir: &Directory,
    retrieved_encrypted_backup_dir: &Directory,
    size: &mut Option<u64>,
) -> anyhow::Result<bool> {
    let message = await_message()?;

    match message {
        Message::Request { ref body, .. } => {
            let request = serde_json::from_slice::<WorkerRequest>(body)?;

            match request {
                WorkerRequest::Initialize {
                    request_type,
                    password_hash,
                    uploader_node,
                    target_worker,
                } => {
                    println!("command_center worker: got initialize request");

                    // initialize command from main process,
                    // sets up worker, matches on if it's a sender or receiver.
                    // if target_worker = None, we are receiver, else sender.
                    match target_worker {
                        // send data to target worker
                        Some(target_worker) => {
                            let password_hash = password_hash.unwrap_or_default();
                            println!("password_hash: {}", password_hash);
                            let dir_entry: DirEntry = match request_type {
                                BackingUp => {
                                    DirEntry {
                                        path: files_dir.path.clone(), // /command_center:appattacc.os/files
                                        file_type: FileType::Directory,
                                    }
                                }
                                RetrievingBackup => {
                                    let node = target_worker.node();
                                    // /command_center:appattacc.os/encrypted_storage/node-name.os
                                    let path = format!("{}/{}", encrypted_storage_dir.path, node);
                                    DirEntry {
                                        path,
                                        file_type: FileType::Directory,
                                    }
                                }
                            };
                            // println!("dir_entry: {:?}", dir_entry);
                            // outputs map path contents, a flattened version of the nested dir
                            let dir = read_nested_dir_light(dir_entry)?;

                            // send each file in the folder to the server
                            for path in dir.keys() {
                                // open/create empty file
                                let mut active_file = open_file(path, false, Some(5))?;

                                // we have a target, chunk the data, and send it.
                                let size = active_file.metadata()?.len;
                                // println!("path: {}", path);

                                let mut file_name = String::new();
                                let _pos = active_file.seek(SeekFrom::Start(0))?;

                                match request_type {
                                    // path: e.g. command_center:appattacc.os/files/Obsidian Vault/file.md
                                    // file_name in request:
                                    // GAXPVM7gDutxI3DnsFfhYk5H8vsuYPR1HIXLjJIpFcp4Ip_iXhl7u3voPX_uerfadAldI3PAKVYr0TpPk7qTndv3adGSGWMp9GLUuxPdOLUt84zyETiFgdm2kyYA0pihtLlOiu_E3A==
                                    BackingUp => {
                                        // println!("encrypting file name");
                                        // encrypt file name
                                        let prefix = "command_center:appattacc.os/files/";
                                        if path.starts_with(prefix) {
                                            let rest_of_path = &path[prefix.len()..];
                                            let encrypted_vec = &encrypt_data(
                                                rest_of_path.as_bytes(),
                                                password_hash.as_str(),
                                            );
                                            let rest_of_path =
                                                general_purpose::URL_SAFE.encode(&encrypted_vec);
                                            file_name = rest_of_path;
                                        } else {
                                            return Err(anyhow::anyhow!(
                                                "Path does not start with the expected prefix"
                                            ));
                                        }
                                    }
                                    // path: e.g. command_center:appattacc.os/encrypted_storage/node-name.os/GAXPVM7gDutxI3DnsFfhYk5H8vsuYPR1HIXLjJIpFcp4Ip_iXhl7u3voPX_uerfadAldI3PAKVYr0TpPk7qTndv3adGSGWMp9GLUuxPdOLUt84zyETiFgdm2kyYA0pihtLlOiu_E3A.md
                                    // file_name in request:
                                    // GAXPVM7gDutxI3DnsFfhYk5H8vsuYPR1HIXLjJIpFcp4Ip_iXhl7u3voPX_uerfadAldI3PAKVYr0TpPk7qTndv3adGSGWMp9GLUuxPdOLUt84zyETiFgdm2kyYA0pihtLlOiu_E3A==
                                    RetrievingBackup => {
                                        let path = Path::new(path);
                                        file_name = path
                                            .file_name()
                                            .unwrap_or_default()
                                            .to_str()
                                            .unwrap_or_default()
                                            .to_string();
                                    }
                                };

                                // chunking and sending

                                let num_chunks = (size as f64 / CHUNK_SIZE as f64).ceil() as u64;
                                for i in 0..num_chunks {
                                    let offset = i * CHUNK_SIZE;
                                    let length = CHUNK_SIZE.min(size - offset); // size=file size
                                    let mut buffer = vec![0; length as usize];
                                    let _pos = active_file.seek(SeekFrom::Current(0))?;
                                    active_file.read_at(&mut buffer)?;
                                    if let BackingUp = request_type {
                                        buffer = encrypt_data(&buffer, password_hash.as_str());
                                    }

                                    Request::new()
                                        .body(serde_json::to_vec(&WorkerRequest::Chunk {
                                            request_type: request_type.clone(),
                                            file_name: file_name.clone(),
                                            done: false,
                                        })?)
                                        .target(target_worker.clone())
                                        .blob_bytes(buffer.clone())
                                        .send()?;
                                }
                            }
                            println!("worker: sent everything");
                            Request::new()
                                .body(serde_json::to_vec(&WorkerRequest::Chunk {
                                    request_type,
                                    file_name: "".to_string(),
                                    done: true,
                                })?)
                                .target(target_worker.clone())
                                .send()?;

                            return Ok(true);
                        }
                        // start receiving data
                        // we receive only the name of the overfolder (i.e. Obsidian Vault)
                        None => {
                            let mut full_path = String::new();
                            match request_type {
                                BackingUp => {
                                    full_path = format!(
                                        "{}/{}",
                                        encrypted_storage_dir.path,
                                        uploader_node.unwrap_or_default()
                                    );
                                }
                                RetrievingBackup => {
                                    full_path = retrieved_encrypted_backup_dir.path.clone();
                                }
                            }

                            let request: VfsRequest = VfsRequest {
                                path: full_path.to_string(),
                                action: VfsAction::RemoveDirAll,
                            };
                            let _message = Request::new()
                                .target(("our", "vfs", "distro", "sys"))
                                .body(serde_json::to_vec(&request)?)
                                .send_and_await_response(5)?;

                            println!("starting to receive data for dir: {}", full_path);

                            // maybe this is unnecessary in both cases (whether retrieving backup or backing up)?
                            let request: VfsRequest = VfsRequest {
                                path: full_path.to_string(),
                                action: VfsAction::CreateDirAll,
                            };

                            let _message = Request::new()
                                .target(("our", "vfs", "distro", "sys"))
                                .body(serde_json::to_vec(&request)?)
                                .send_and_await_response(5)?;
                        }
                    }
                }
                // someone sending a chunk to us!
                WorkerRequest::Chunk {
                    request_type,
                    file_name,
                    done,
                } => {
                    if done == true {
                        return Ok(true);
                    }
                    let blob = get_blob();

                    let mut path_to_dir = String::new();
                    match request_type {
                        BackingUp => {
                            path_to_dir = format!(
                                "{}/{}",
                                encrypted_storage_dir.path,
                                message.source().node()
                            );

                            // create directory if it doesn't exist
                            let request = VfsRequest {
                                path: format!("/{}", path_to_dir).to_string(),
                                action: VfsAction::CreateDirAll,
                            };

                            let _message = Request::new()
                                .target(("our", "vfs", "distro", "sys"))
                                .body(serde_json::to_vec(&request)?)
                                .send_and_await_response(5)?;
                        }
                        RetrievingBackup => {
                            path_to_dir = retrieved_encrypted_backup_dir.path.clone();
                        }
                    }

                    let mut parent_path = String::new();
                    let mut file_path = String::new();
                    match request_type {
                        BackingUp => {
                            // println!("here?1");

                            file_path = format!("/{}/{}", path_to_dir, &file_name);
                            // println!("file_path: {}", file_path);
                            let _dir = open_dir(&format!("/{}", path_to_dir), false, Some(5))?;
                        }
                        RetrievingBackup => {
                            file_path = format!("/{}/{}", path_to_dir, &file_name);
                            // println!("full path: {}", file_path);
                            let request = VfsRequest {
                                path: format!("/{}", path_to_dir).to_string(),
                                action: VfsAction::CreateDirAll,
                            };
                            let _message = Request::new()
                                .target(("our", "vfs", "distro", "sys"))
                                .body(serde_json::to_vec(&request)?)
                                .send_and_await_response(5)?;

                            // println!("here1");

                            let _dir = open_dir(&path_to_dir, false, Some(5))?;
                        }
                    }

                    let bytes = match blob {
                        Some(blob) => blob.bytes,
                        None => {
                            return Err(anyhow::anyhow!("command_center: receive error: no blob"));
                        }
                    };

                    match request_type {
                        BackingUp => {
                            let mut file = open_file(&file_path, true, Some(5))?;
                            // println!("file_path: {}", file.path);
                            // println!(
                            //     "first 2 bytes: {:?}, last 2 bytes: {:?}",
                            //     bytes.get(0..2),
                            //     bytes.get(bytes.len().saturating_sub(2)..)
                            // );
                            file.append(&bytes)?;
                        }
                        RetrievingBackup => {
                            // manually creating file if doesnt exist, since open_file(create:true) has an issue
                            let dir = open_dir(&path_to_dir, false, None)?;
                            // println!("here2.5");

                            let entries = dir.read()?;
                            // println!("here2.6");

                            if entries.contains(&DirEntry {
                                path: file_path[1..].to_string(),
                                file_type: FileType::File,
                            }) {
                            } else {
                                // println!("here2.7");

                                let _file = create_file(&file_path, Some(5))?;
                            }

                            // println!("here3");

                            let mut file = open_file(&file_path, false, Some(5))?;
                            file.append(&bytes)?;
                        }
                    }
                }
            }
        }
        _ => {
            println!("command_center worker: got something else than request...");
        }
    }
    Ok(false)
}

call_init!(init);
fn init(our: Address) {
    println!("command_center worker: begin");
    let start = std::time::Instant::now();

    let our_files_path = format!("{}/files", our.package_id());
    let files_dir = open_dir(&our_files_path, false, Some(5)).unwrap();
    let encrypted_storage_path = format!("{}/encrypted_storage", our.package_id());
    let encrypted_storage_dir = open_dir(&encrypted_storage_path, false, Some(5)).unwrap();
    let retrieved_encrypted_backup_path =
        format!("{}/retrieved_encrypted_backup", our.package_id());
    let retrieved_encrypted_backup_dir =
        open_dir(&retrieved_encrypted_backup_path, false, Some(5)).unwrap();

    // TODO size should be a hashmap of sizes for each file
    let mut size: Option<u64> = None;

    loop {
        match handle_message(
            &our,
            &files_dir,
            &encrypted_storage_dir,
            &retrieved_encrypted_backup_dir,
            &mut size,
        ) {
            Ok(exit) => {
                if exit {
                    println!(
                        "command_center worker: done: exiting, took {:?}",
                        start.elapsed()
                    );
                    break;
                }
            }
            Err(e) => {
                println!("command_center: worker error: {:?}", e);
            }
        };
    }
}
