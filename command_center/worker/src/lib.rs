use base64::{engine::general_purpose, Engine as _};
use serde::{Deserialize, Serialize};
use std::path::Path;
use std::str::FromStr;

use kinode_process_lib::{
    await_message, call_init, get_blob, println,
    vfs::{
        create_file, open_dir, open_file, DirEntry, Directory, FileType, SeekFrom, VfsAction,
        VfsRequest,
    },
    Address, Message, ProcessId, Request,
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

#[derive(Serialize, Deserialize, Debug)]
pub enum TransferRequest {
    ListFiles,
    Download { name: String, target: Address },
    Progress { name: String, progress: u64 },
}

fn handle_message(
    our: &Address,
    files_dir: &Directory,
    encrypted_storage_dir: &Directory,
    size: &mut Option<u64>,
) -> anyhow::Result<bool> {
    let message = await_message()?;

    match message {
        Message::Request { ref body, .. } => {
            let request = serde_json::from_slice::<WorkerRequest>(body)?;

            match request {
                WorkerRequest::Initialize {
                    request_type,
                    uploader_node,
                    target_worker,
                } => {
                    println!("file_transfer worker: got initialize request");
                    println!("uploader_node: {}", uploader_node);

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
                            println!("dir_entry: {:?}", dir_entry);
                            // outputs map path contents, a flattened version of the nested dir
                            let dir = read_nested_dir_light(dir_entry)?;

                            // send each file in the folder
                            for path in dir.keys() {
                                // open/create empty file
                                let mut active_file = open_file(path, true, Some(5))?;

                                // we have a target, chunk the data, and send it.
                                let size = active_file.metadata()?.len;

                                // give the receiving worker a size request so it can track it's progress!
                                Request::new()
                                    .body(serde_json::to_vec(&WorkerRequest::Size(size))?)
                                    .target(target_worker.clone())
                                    .send()?;

                                active_file.seek(SeekFrom::Start(0))?;

                                let mut new_path = String::new();

                                // setting the right path
                                match request_type {
                                    BackingUp => {
                                        let prefix = "command_center:appattacc.os/files/";
                                        if path.starts_with(prefix) {
                                            let extracted_path = &path[..prefix.len()];
                                            let rest_of_path = &path[prefix.len()..];
                                            println!("Extracted path: {}", extracted_path);
                                            println!("Rest of path: {}", rest_of_path);
                                            let encrypted_vec =
                                                &encrypt_data(rest_of_path.as_bytes(), "password");
                                            let rest_of_path =
                                                general_purpose::URL_SAFE.encode(&encrypted_vec);
                                            new_path =
                                                format!("{}{}", extracted_path, &rest_of_path);
                                        } else {
                                            return Err(anyhow::anyhow!(
                                                "Path does not start with the expected prefix"
                                            ));
                                        }
                                    }
                                    RetrievingBackup => {
                                        let path = Path::new(path);
                                        new_path = format!(
                                            "{}/{}",
                                            "command_center:appattacc.os/files/",
                                            path.file_name().unwrap().to_str().unwrap()
                                        );
                                        println!("new_path: {}", new_path);
                                    }
                                };

                                // chunking and sending
                                match request_type {
                                    BackingUp => {
                                        // have to deal with encryption change the length of buffer
                                        // hence offset needs to be accumulated and length of each chunk sent can change
                                        let mut encrypted_offset: u64 = 0;
                                        let num_chunks =
                                            (size as f64 / chunk_size as f64).ceil() as u64;

                                        for i in 0..num_chunks {
                                            let offset = i * chunk_size;
                                            let length = chunk_size.min(size - offset); // size=file size
                                            println!("offset: {}", offset);
                                            println!("length: {}", length);
                                            let mut buffer = vec![0; length as usize];
                                            println!("buffer: {:?}", buffer.len());
                                            active_file.read_at(&mut buffer)?;
                                            // println!("buffer: {:?}", buffer);
                                            let buffer = encrypt_data(&buffer, "password");
                                            println!(
                                                "encrypted_buffer first 5: {:?}, last 5: {:?}",
                                                &buffer[..5.min(buffer.len())],
                                                &buffer[buffer.len().saturating_sub(5)..]
                                            );
                                            let decrypted_buffer =
                                                decrypt_data(&buffer, "password");
                                            // println!("decrypted_buffer: {:?}", decrypted_buffer);
                                            let encrypted_length = buffer.len() as u64;
                                            println!("encrypted_length: {}", encrypted_length);
                                            println!("encrypted_offset: {}", encrypted_offset);

                                            Request::new()
                                                .body(serde_json::to_vec(&WorkerRequest::Chunk {
                                                    request_type: request_type.clone(),
                                                    name: new_path.clone(),
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
                                        // buffer size is consistent, so easy
                                        let num_chunks =
                                            (size as f64 / chunk_size as f64).ceil() as u64;

                                        for i in 0..num_chunks {
                                            let offset = i * chunk_size;
                                            let length = chunk_size.min(size - offset);

                                            let mut buffer = vec![0; length as usize];
                                            active_file.read_at(&mut buffer)?;
                                            println!(
                                                "encrypted_buffer first 5: {:?}, last 5: {:?}",
                                                &buffer[..5.min(buffer.len())],
                                                &buffer[buffer.len().saturating_sub(5)..]
                                            );

                                            Request::new()
                                                .body(serde_json::to_vec(&WorkerRequest::Chunk {
                                                    request_type: request_type.clone(),
                                                    name: new_path.clone(),
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
                            println!("sent everything");
                            Request::new()
                                .body(serde_json::to_vec(&WorkerRequest::Chunk {
                                    request_type,
                                    name: "".to_string(),
                                    offset: 0,
                                    length: 0,
                                    done: true,
                                })?)
                                .target(target_worker.clone())
                                .send()?;

                            println!("returning true");
                            return Ok(true);
                        }
                        // start receiving data
                        // we receive only the name of the overfolder (i.e. Obsidian Vault)
                        None => {
                            let mut full_path = String::new();
                            match request_type {
                                BackingUp => {
                                    full_path =
                                        format!("{}/{}", encrypted_storage_dir.path, uploader_node);
                                    let request: VfsRequest = VfsRequest {
                                        path: full_path.to_string(),
                                        action: VfsAction::RemoveDirAll,
                                    };
                                    let _message = Request::new()
                                        .target(("our", "vfs", "distro", "sys"))
                                        .body(serde_json::to_vec(&request)?)
                                        .send_and_await_response(5)?;
                                }
                                RetrievingBackup => {
                                    full_path = files_dir.path.clone();
                                }
                            }
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
                    name,
                    offset,
                    length,
                    done,
                } => {
                    if done == true {
                        println!("returning true");
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

                    // this feels redundant, but i had problems with open_file(create: true);
                    let path = Path::new(name.as_str());
                    let file_name = path.file_name().unwrap().to_str().unwrap();

                    let mut file_path = String::new();
                    match request_type {
                        RetrievingBackup => {
                            let decoded_vec = general_purpose::URL_SAFE.decode(&file_name)?;
                            let decrypted_vec =
                                decrypt_data(&decoded_vec, "password").unwrap_or_default();
                            let decrypted_path = String::from_utf8(decrypted_vec).map_err(|e| {
                                anyhow::anyhow!("Failed to convert bytes to string: {}", e)
                            })?;

                            file_path = format!("/{}/{}", path_to_dir, decrypted_path);
                            let parent_path = Path::new(&file_path)
                                .parent() // Get the parent directory as an Option<&Path>
                                .and_then(|p| p.to_str()) // Convert the Path to a str slice if possible
                                .unwrap_or(""); // Provide a default empty string if no parent is found
                            let file_name = Path::new(&file_path)
                                .file_name() // Get the file name as an Option<&OsStr>
                                .and_then(|f| f.to_str()) // Convert the OsStr to a str slice if possible
                                .unwrap_or(""); // Provide a default empty string if no file name is found

                            let request = VfsRequest {
                                path: format!("/{}", parent_path).to_string(),
                                action: VfsAction::CreateDirAll,
                            };
                            let _message = Request::new()
                                .target(("our", "vfs", "distro", "sys"))
                                .body(serde_json::to_vec(&request)?)
                                .send_and_await_response(5)?;

                            let dir = open_dir(&format!("/{}", parent_path), false, Some(5))?;
                            if dir.read()?.contains(&DirEntry {
                                path: file_name.to_string(),
                                file_type: FileType::File,
                            }) {
                            } else {
                                let _file = create_file(&file_path, Some(5));
                            }
                        }
                        BackingUp => {
                            file_path = format!("/{}/{}", path_to_dir, &file_name);

                            let dir = open_dir(&format!("/{}", path_to_dir), false, Some(5))?;
                            if dir.read()?.contains(&DirEntry {
                                path: name.clone(),
                                file_type: FileType::File,
                            }) {
                            } else {
                                let _file = create_file(&file_path, Some(5));
                            }
                        }
                    }

                    let mut file = open_file(&file_path, false, Some(5))?;

                    let bytes = match blob {
                        Some(blob) => blob.bytes,
                        None => {
                            return Err(anyhow::anyhow!("file_transfer: receive error: no blob"));
                        }
                    };
                    println!("bytes length: {}", bytes.len());
                    println!(
                        "bytes recieved first 5: {:?}, last 5: {:?}",
                        &bytes[..5.min(bytes.len())],
                        &bytes[bytes.len().saturating_sub(5)..]
                    );

                    // println!("bytes: {:?}", bytes);

                    println!("length: {}", length);
                    println!("offset: {}", offset);
                    let pos = file.seek(SeekFrom::Start(offset))?;

                    match request_type {
                        BackingUp => {
                            println!("backing up writing");
                            println!("offset: {}", offset);
                            println!("length: {}", length);
                            println!("pos: {}", pos);
                            println!("bytes: {:?}", bytes.len());
                            println!(
                                "bytes first 5: {:?}, last 5: {:?}",
                                &bytes[..5.min(bytes.len())],
                                &bytes[bytes.len().saturating_sub(5)..]
                            );
                            file.write_all(&bytes)?;
                            // println!("file.read(): {:?}", file.read()?);
                        }
                        RetrievingBackup => {
                            println!("bytes: {:?}", bytes.len());

                            let decrypted_bytes =
                                decrypt_data(&bytes, "password").unwrap_or_default();
                            println!("decrypted bytes: {:?}", decrypted_bytes.len());
                            file.write_all(&decrypted_bytes)?;
                        }
                    }

                    // if sender has sent us a size, give a progress update to main transfer!
                    if let Some(size) = size {
                        let progress = ((offset + length) as f64 / *size as f64 * 100.0) as u64;

                        // send update to main process
                        let main_app = Address {
                            node: our.node.clone(),
                            process: ProcessId::from_str(
                                "file_transfer:file_transfer:template.os",
                            )?,
                        };

                        Request::new()
                            .body(serde_json::to_vec(&TransferRequest::Progress {
                                name: file_path,
                                progress,
                            })?)
                            .target(&main_app)
                            .send()?;

                        if progress >= 100 {
                            return Ok(false);
                        }
                    }
                }
                WorkerRequest::Size(incoming_size) => {
                    *size = Some(incoming_size);
                }
            }
        }
        _ => {
            println!("file_transfer worker: got something else than request...");
        }
    }
    Ok(false)
}

call_init!(init);
fn init(our: Address) {
    println!("file_transfer worker: begin");
    let start = std::time::Instant::now();

    let our_files_path = format!("{}/files", our.package_id());
    let files_dir = open_dir(&our_files_path, false, Some(5)).unwrap();
    let encrypted_storage_path = format!("{}/encrypted_storage", our.package_id());
    let encrypted_storage_dir = open_dir(&encrypted_storage_path, false, Some(5)).unwrap();

    // TODO size should be a hashmap of sizes for each file
    let mut size: Option<u64> = None;

    loop {
        match handle_message(&our, &files_dir, &encrypted_storage_dir, &mut size) {
            Ok(exit) => {
                if exit {
                    println!(
                        "file_transfer worker done: exiting, took {:?}",
                        start.elapsed()
                    );
                    break;
                }
            }
            Err(e) => {
                println!("file_transfer: worker error: {:?}", e);
            }
        };
    }
}
