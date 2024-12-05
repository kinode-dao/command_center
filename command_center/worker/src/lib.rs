use base64::{engine::general_purpose, Engine as _};
use std::path::Path;

use kinode_process_lib::{
    await_message, call_init, get_blob, println,
    vfs::{create_file, open_dir, open_file, DirEntry, FileType, SeekFrom, VfsAction, VfsRequest},
    Address, Message, Request,
};

use files_lib::encryption::{encrypt_data, CHUNK_SIZE};
use files_lib::read_nested_dir_light;
use files_lib::structs::{WorkerRequest, WorkerStatus};

wit_bindgen::generate!({
    path: "target/wit",
    world: "process-v0",
});

fn handle_message(receive_chunks_to_dir: &mut String) -> anyhow::Result<bool> {
    let message = await_message()?;

    if let Message::Request { ref body, .. } = message {
        let request = serde_json::from_slice::<WorkerRequest>(body)?;
        match request {
            // initialized from main:command_center:appattacc.os.
            // we will be sending chunks to `target_worker`, encrypting w/ `password_hash`, from directory `sending_from_dir`
            // if password_hash is None, we will not be encrypting
            WorkerRequest::InitializeSenderWorker {
                target_worker,
                password_hash,
                sending_from_dir,
            } => {
                println!("command_center worker: got initialize request");
                let dir_entry = DirEntry {
                    path: sending_from_dir.clone(),
                    file_type: FileType::Directory,
                };

                // outputs map(path -> contents) where contents are empty, 
                // a flattened version of the nested dir
                let dir = read_nested_dir_light(dir_entry)?;

                // send each file from the folder to the server
                for path in dir.keys() {
                    let mut active_file = open_file(path, false, Some(5))?;

                    // we have a target, chunk the data, and send it.
                    let size = active_file.metadata()?.len;
                    let _pos = active_file.seek(SeekFrom::Start(0))?;
                    let file_name =
                        // encrypts file name
                        if let Some(pw_hash) = password_hash.clone() {
                            // path: e.g. command_center:appattacc.os/files/Obsidian Vault/file.md
                            // file_name in request: GAXPVM...0pihtLlOiu_E3A==
                            let prefix = sending_from_dir.clone()[1..].to_string() + "/";
                            if path.starts_with(&prefix) {
                                let rest_of_path = &path[prefix.len()..];
                                let encrypted_vec = &encrypt_data(
                                    rest_of_path.as_bytes(),
                                    pw_hash.as_str(),
                                );
                                general_purpose::URL_SAFE.encode(&encrypted_vec)
                            } else {
                                return Err(anyhow::anyhow!(
                                    "Path does not start with the expected prefix"
                                ));
                            }
                        } 
                        // doesnt encrypt file name
                        else {
                            // path: e.g. command_center:appattacc.os/encrypted_storage/node-name.os/GAXPVM7gDut...tLlOiu_E3A
                            // file_name in request: GAXP...A0pihtLlOiu_E3A==
                            let path = Path::new(path);
                            path
                                .file_name()
                                .unwrap_or_default()
                                .to_str()
                                .unwrap_or_default()
                                .to_string()
                        };

                    // chunking and sending
                    //
                    // handling the edge case if there is 0 bytes, 
                    // we still want to send one chunk to make sure the empty file is transferred
                    let num_chunks = if size != 0 {
                        (size as f64 / CHUNK_SIZE as f64).ceil() as u64
                    } else {
                        1
                    };

                    for i in 0..num_chunks {
                        let offset = i * CHUNK_SIZE;
                        let length = CHUNK_SIZE.min(size - offset); // size=file size
                        let mut buffer = vec![0; length as usize];
                        let _pos = active_file.seek(SeekFrom::Current(0))?;
                        active_file.read_at(&mut buffer)?;

                        if let Some(pw_hash) = password_hash.clone() {
                            buffer = encrypt_data(&buffer, pw_hash.as_str());
                        }

                        Request::new()
                            .body(serde_json::to_vec(&WorkerRequest::Chunk {
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
                        file_name: "".to_string(),
                        done: true,
                    })?)
                    .target(target_worker.clone())
                    .send()?;

                return Ok(true);
            }
            // initialized from main:command_center:appattacc.os.
            // we will be receivng chunks to directory `receive_to_dir`
            WorkerRequest::InitializeReceiverWorker { receive_to_dir } => {
                // start receiving data
                let full_path = receive_to_dir;
                *receive_chunks_to_dir = full_path.clone();
                
                println!("starting to receive data for dir: {}", full_path);

                // removing the dir, and creating a fresh one
                let request: VfsRequest = VfsRequest {
                    path: full_path.to_string(),
                    action: VfsAction::RemoveDirAll,
                };
                let _message = Request::new()
                    .target(("our", "vfs", "distro", "sys"))
                    .body(serde_json::to_vec(&request)?)
                    .send_and_await_response(5)?;

                let request: VfsRequest = VfsRequest {
                    path: full_path.to_string(),
                    action: VfsAction::CreateDirAll,
                };
                let _message = Request::new()
                    .target(("our", "vfs", "distro", "sys"))
                    .body(serde_json::to_vec(&request)?)
                    .send_and_await_response(5)?;
            }
            // every time we receive a chunk, append to the file
            WorkerRequest::Chunk { file_name, done } => {
                if done == true {
                    return Ok(true);
                }
                
                let blob = get_blob();

                println!("worker: received new chunk for {}", &file_name);
                
                // clunky path manipulation, probably can be cleaned up
                let path_to_dir = &receive_chunks_to_dir[1..]; // just skipping the initial '/'
                let file_path = format!("/{}/{}", path_to_dir, &file_name);
                let _dir = open_dir(&format!("/{}", path_to_dir), false, Some(5))?;

                let bytes = match blob {
                    Some(blob) => blob.bytes,
                    None => {
                        return Err(anyhow::anyhow!("command_center: receive error: no blob"));
                    }
                };

                // manually creating file if doesnt exist, since open_file(create:true) has an issue
                let dir = open_dir(&path_to_dir, false, None)?;

                let entries = dir.read()?;
                if entries.contains(&DirEntry {
                    path: file_path[1..].to_string(),
                    file_type: FileType::File,
                }) {
                } else {
                    let _file = create_file(&file_path, Some(5))?;
                }

                let mut file = open_file(&file_path, false, Some(5))?;
                file.append(&bytes)?;
            }
        }
    }
    Ok(false)
}

call_init!(init);
fn init(our: Address) {
    println!("command_center worker: begin");
    let start = std::time::Instant::now();

    // directory to which we will be storing received data
    let mut receive_chunks_to_dir = String::new();

    loop {
        match handle_message(&mut receive_chunks_to_dir) {
            Ok(exit) => {
                if exit {
                    println!(
                        "command_center worker: done: exiting, took {:?}",
                        start.elapsed()
                    );
                    let _ = Request::new()
                    .body(serde_json::to_vec(&WorkerStatus::Done).unwrap())
                    .target(
                        Address::new(
                        our.node(),
                        ("main", "command_center", "appattacc.os")))
                    .send();
                    break;
                }
            }
            Err(e) => {
                println!("command_center: worker error: {:?}", e);
            }
        };
    }
}
