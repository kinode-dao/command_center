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
use files_lib::{read_nested_dir_light, WorkerRequest};

wit_bindgen::generate!({
    path: "target/wit",
    world: "process-v0",
});

// when building, test with smaller chunk size, because most text files are less
// than this, so you won't see if it's working properly.
const CHUNK_SIZE: u64 = 1048576; // 1MB

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
                    uploader_node,
                    target_worker,
                } => {
                    println!("file_transfer worker: got initialize request");
                    println!("uploader_node: {}", uploader_node);
                    // initialize command from main process,
                    // sets up worker, matches on if it's a sender or receiver.
                    // if target_worker = None, we are receiver, else sender.
                    let dir_entry: DirEntry = DirEntry {
                        path: files_dir.path.clone(), // /command_center:appattacc.os/files
                        file_type: FileType::Directory,
                    };

                    match target_worker {
                        // send data to target worker
                        Some(target_worker) => {
                            // outputs map path contents, a flattened version of the nested dir
                            let dir = read_nested_dir_light(dir_entry)?;

                            // send each file in the folder
                            for mut path in dir.keys() {
                                println!("path: {}", path);
                                // open/create empty file
                                let mut active_file = open_file(path, true, Some(5))?;

                                // we have a target, chunk the data, and send it.
                                let size = active_file.metadata()?.len;
                                let num_chunks = (size as f64 / CHUNK_SIZE as f64).ceil() as u64;

                                // give the receiving worker a size request so it can track it's progress!
                                Request::new()
                                    .body(serde_json::to_vec(&WorkerRequest::Size(size))?)
                                    .target(target_worker.clone())
                                    .send()?;

                                active_file.seek(SeekFrom::Start(0))?;

                                let mut new_path = String::new();
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
                                    new_path = format!("{}{}", extracted_path, &rest_of_path);
                                } else {
                                    return Err(anyhow::anyhow!(
                                        "Path does not start with the expected prefix"
                                    ));
                                }

                                for i in 0..num_chunks {
                                    let offset = i * CHUNK_SIZE;
                                    let length = CHUNK_SIZE.min(size - offset);

                                    let mut buffer = vec![0; length as usize];
                                    active_file.read_at(&mut buffer)?;

                                    let encrypted_buffer = encrypt_data(&buffer, "password");

                                    Request::new()
                                        .body(serde_json::to_vec(&WorkerRequest::Chunk {
                                            name: new_path.clone(),
                                            offset,
                                            length,
                                            done: false,
                                        })?)
                                        .target(target_worker.clone())
                                        .blob_bytes(encrypted_buffer.clone())
                                        .send()?;
                                }
                            }
                            println!("sent everything");
                            Request::new()
                                .body(serde_json::to_vec(&WorkerRequest::Chunk {
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
                            let full_path: String =
                                format!("/{}/{}", encrypted_storage_dir.path, uploader_node);
                            println!("starting to receive data for file: {}", full_path);
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
                    }
                }
                // someone sending a chunk to us!
                WorkerRequest::Chunk {
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

                    println!("got name: {}", name);
                    // get directory path from node name
                    let path_to_dir =
                        format!("{}/{}", encrypted_storage_dir.path, message.source().node());

                    // create directory if it doesn't exist
                    let request = VfsRequest {
                        path: format!("/{}", path_to_dir).to_string(),
                        action: VfsAction::CreateDirAll,
                    };
                    let _message = Request::new()
                        .target(("our", "vfs", "distro", "sys"))
                        .body(serde_json::to_vec(&request)?)
                        .send_and_await_response(5)?;

                    // this feels redundant, but i had problems with open_file(create: true);
                    let dir = open_dir(&format!("/{}", path_to_dir), false, Some(5))?;
                    let path = Path::new(name.as_str());
                    let file_name = path.file_name().unwrap().to_str().unwrap();

                    let file_path = format!("/{}/{}", path_to_dir, &file_name);
                    if dir.read()?.contains(&DirEntry {
                        path: name.clone(),
                        file_type: FileType::File,
                    }) {
                    } else {
                        let _file = create_file(&file_path, Some(5));
                    }

                    let mut file = open_file(&file_path, false, Some(5))?;

                    let bytes = match blob {
                        Some(blob) => blob.bytes,
                        None => {
                            return Err(anyhow::anyhow!("file_transfer: receive error: no blob"));
                        }
                    };

                    let _pos = file.seek(SeekFrom::Start(offset))?;
                    file.write_all(&bytes)?;
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
