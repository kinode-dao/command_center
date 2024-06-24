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

use files_lib::encryption::{decrypt_data, encrypt_data};
use files_lib::{
    read_nested_dir_light, WorkerRequest, WorkerRequestType::BackingUp,
    WorkerRequestType::RetrievingBackup,
};

wit_bindgen::generate!({
    path: "target/wit",
    world: "process-v0",
});

// when building, test with smaller chunk size, because most text files are less
// than this, so you won't see if it's working properly.
// const CHUNK_SIZE: u64 = 1048576; // 1MB
const CHUNK_SIZE: u64 = 1024; // 1KB
const ENCRYPTED_CHUNK_SIZE: u64 = CHUNK_SIZE + 44; // that's what encrypted chunks end up being

fn handle_message(
    our: &Address,
    files_dir: &Directory,
    encrypted_storage_dir: &Directory,
    size: &mut Option<u64>,
    password_hash_temp: &mut String,
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

                    if let Some(received_hash) = password_hash.clone() {
                        *password_hash_temp = received_hash;
                    }
                    println!("password_hash_temp: {}", password_hash_temp);

                    let chunk_size = match request_type {
                        BackingUp => CHUNK_SIZE,
                        RetrievingBackup => ENCRYPTED_CHUNK_SIZE,
                    };

                    // initialize command from main process,
                    // sets up worker, matches on if it's a sender or receiver.
                    // if target_worker = None, we are receiver, else sender.
                    match target_worker {
                        // send data to target worker
                        Some(target_worker) => {
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

                            // outputs map path contents, a flattened version of the nested dir
                            let dir = read_nested_dir_light(dir_entry)?;

                            // send each file in the folder to the server
                            for path in dir.keys() {
                                // open/create empty file
                                let mut active_file = open_file(path, false, Some(5))?;

                                // we have a target, chunk the data, and send it.
                                let size = active_file.metadata()?.len;

                                // give the receiving worker a size request so it can track it's progress!
                                Request::new()
                                    .body(serde_json::to_vec(&WorkerRequest::Size(size))?)
                                    .target(target_worker.clone())
                                    .send()?;

                                let mut file_name = String::new();
                                let _pos = active_file.seek(SeekFrom::Start(0))?;

                                match request_type {
                                    // path: e.g. command_center:appattacc.os/files/Obsidian Vault/file.md
                                    // file_name in request:
                                    // GAXPVM7gDutxI3DnsFfhYk5H8vsuYPR1HIXLjJIpFcp4Ip_iXhl7u3voPX_uerfadAldI3PAKVYr0TpPk7qTndv3adGSGWMp9GLUuxPdOLUt84zyETiFgdm2kyYA0pihtLlOiu_E3A==
                                    BackingUp => {
                                        // encrypt file name
                                        let prefix = "command_center:appattacc.os/files/";
                                        println!("password_hash_temp: {}", password_hash_temp);
                                        if path.starts_with(prefix) {
                                            let rest_of_path = &path[prefix.len()..];
                                            let encrypted_vec = &encrypt_data(
                                                rest_of_path.as_bytes(),
                                                password_hash_temp.as_str(),
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
                                match request_type {
                                    BackingUp => {
                                        println!("here?2");
                                        // have to deal with encryption change the length of buffer
                                        // hence offset needs to be accumulated and length of each chunk sent can change
                                        let mut encrypted_offset: u64 = 0;
                                        let num_chunks =
                                            (size as f64 / chunk_size as f64).ceil() as u64;

                                        println!("here?3");

                                        for i in 0..num_chunks {
                                            let offset = i * chunk_size;
                                            let length = chunk_size.min(size - offset); // size=file size
                                            let mut buffer = vec![0; length as usize];
                                            let _pos = active_file.seek(SeekFrom::Current(0))?;
                                            active_file.read_at(&mut buffer)?;
                                            let buffer =
                                                encrypt_data(&buffer, password_hash_temp.as_str());

                                            let encrypted_length = buffer.len() as u64;
                                            println!("here?4");

                                            Request::new()
                                                .body(serde_json::to_vec(&WorkerRequest::Chunk {
                                                    request_type: request_type.clone(),
                                                    file_name: file_name.clone(),
                                                    offset: encrypted_offset,
                                                    length: encrypted_length,
                                                    done: false,
                                                })?)
                                                .target(target_worker.clone())
                                                .blob_bytes(buffer.clone())
                                                .send()?;
                                            encrypted_offset += encrypted_length;
                                        }
                                    }
                                    RetrievingBackup => {
                                        // buffer size is consistent
                                        let num_chunks =
                                            (size as f64 / chunk_size as f64).ceil() as u64;

                                        for i in 0..num_chunks {
                                            let offset = i * chunk_size;
                                            let length = chunk_size.min(size - offset);

                                            let mut buffer = vec![0; length as usize];
                                            let _pos = active_file.seek(SeekFrom::Current(0))?;
                                            active_file.read_at(&mut buffer)?;

                                            Request::new()
                                                .body(serde_json::to_vec(&WorkerRequest::Chunk {
                                                    request_type: request_type.clone(),
                                                    file_name: file_name.clone(),
                                                    offset,
                                                    length,
                                                    done: false,
                                                })?)
                                                .target(target_worker.clone())
                                                .blob_bytes(buffer.clone())
                                                .send()?;
                                        }
                                    }
                                }
                            }
                            println!("worker: sent everything");
                            Request::new()
                                .body(serde_json::to_vec(&WorkerRequest::Chunk {
                                    request_type,
                                    file_name: "".to_string(),
                                    offset: 0,
                                    length: 0,
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
                                    full_path = files_dir.path.clone();
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

                            println!("starting to receive data for file: {}", full_path);

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
                    offset,
                    length,
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
                            path_to_dir = files_dir.path.clone();
                        }
                    }

                    let mut parent_path = String::new();
                    let mut file_path = String::new();
                    match request_type {
                        RetrievingBackup => {
                            let decoded_vec = general_purpose::URL_SAFE.decode(&file_name)?;
                            let decrypted_vec =
                                decrypt_data(&decoded_vec, password_hash_temp).unwrap_or_default();
                            let decrypted_path = String::from_utf8(decrypted_vec).map_err(|e| {
                                anyhow::anyhow!("Failed to convert bytes to string: {}", e)
                            })?;
                            println!("here");

                            file_path = format!("/{}/{}", path_to_dir, decrypted_path);
                            println!("decrypted full path: {}", file_path);
                            parent_path = Path::new(&file_path)
                                .parent()
                                .and_then(|p| p.to_str())
                                .unwrap_or("")
                                .to_string();

                            let request = VfsRequest {
                                path: format!("/{}", parent_path).to_string(),
                                action: VfsAction::CreateDirAll,
                            };
                            let _message = Request::new()
                                .target(("our", "vfs", "distro", "sys"))
                                .body(serde_json::to_vec(&request)?)
                                .send_and_await_response(5)?;

                            println!("here1");

                            let _dir = open_dir(&parent_path, false, Some(5))?;
                        }
                        BackingUp => {
                            println!("here?1");

                            file_path = format!("/{}/{}", path_to_dir, &file_name);
                            let _dir = open_dir(&format!("/{}", path_to_dir), false, Some(5))?;
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
                            println!("here?");
                            let mut file = open_file(&file_path, true, Some(5))?;
                            file.append(&bytes)?;
                        }
                        RetrievingBackup => {
                            let decrypted_bytes =
                                decrypt_data(&bytes, password_hash_temp).unwrap_or_default();

                            println!("here2");
                            println!("{}", parent_path);
                            // manually creating file if doesnt exist, since open_file(create:true) has an issue
                            let dir = open_dir(&parent_path, false, None)?;
                            println!("here2.5");

                            let entries = dir.read()?;
                            println!("here2.6");

                            if entries.contains(&DirEntry {
                                path: file_path[1..].to_string(),
                                file_type: FileType::File,
                            }) {
                            } else {
                                println!("here2.7");

                                let _file = create_file(&file_path, Some(5))?;
                            }

                            println!("here3");

                            let mut file = open_file(&file_path, false, Some(5))?;
                            file.append(&decrypted_bytes)?;
                        }
                    }
                }
                WorkerRequest::Size(incoming_size) => {
                    *size = Some(incoming_size);
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

    // TODO size should be a hashmap of sizes for each file
    let mut size: Option<u64> = None;
    let mut password_hash_temp: String = String::new();

    loop {
        match handle_message(
            &our,
            &files_dir,
            &encrypted_storage_dir,
            &mut size,
            &mut password_hash_temp,
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
