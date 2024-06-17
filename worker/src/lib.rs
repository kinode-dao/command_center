use serde::{Deserialize, Serialize};
use std::str::FromStr;

use kinode_process_lib::{
    await_message, call_init, get_blob, println,
    vfs::{
        open_dir, open_file, DirEntry, Directory, File, FileType, SeekFrom, VfsAction, VfsRequest,
    },
    Address, Message, ProcessId, Request, Response,
};

use files_lib::{import_notes, read_nested_dir_light};

wit_bindgen::generate!({
    path: "target/wit",
    world: "process-v0",
});

const CHUNK_SIZE: u64 = 1048576; // 1MB

#[derive(Serialize, Deserialize, Debug)]
pub enum WorkerRequest {
    Initialize {
        name: String,
        target_worker: Option<Address>,
    },
    Chunk {
        name: String,
        offset: u64,
        length: u64,
    },
    Size(u64),
}

#[derive(Serialize, Deserialize, Debug)]
pub enum TransferRequest {
    ListFiles,
    Download { name: String, target: Address },
    Progress { name: String, progress: u64 },
}

fn handle_message(
    our: &Address,
    files_dir: &Directory,
    size: &mut Option<u64>,
) -> anyhow::Result<bool> {
    let message = await_message()?;

    match message {
        Message::Request { ref body, .. } => {
            let request = serde_json::from_slice::<WorkerRequest>(body)?;

            match request {
                WorkerRequest::Initialize {
                    name,
                    target_worker,
                } => {
                    println!("file_transfer worker: got initialize request");
                    // initialize command from main process,
                    // sets up worker, matches on if it's a sender or receiver.
                    // target_worker = None, we are receiver, else sender.
                    let dir_entry: DirEntry = DirEntry {
                        path: files_dir.path.clone(), //command_center:appattacc.os/files
                        file_type: FileType::Directory,
                    };

                    match target_worker {
                        // send data to target worker
                        Some(target_worker) => {
                            let mut dir = read_nested_dir_light(dir_entry)?;

                            for path in dir.keys() {
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

                                for i in 0..num_chunks {
                                    let offset = i * CHUNK_SIZE;
                                    let length = CHUNK_SIZE.min(size - offset);

                                    let mut buffer = vec![0; length as usize];
                                    active_file.read_at(&mut buffer)?;

                                    Request::new()
                                        .body(serde_json::to_vec(&WorkerRequest::Chunk {
                                            name: path.clone(),
                                            offset,
                                            length,
                                        })?)
                                        .target(target_worker.clone())
                                        .blob_bytes(buffer)
                                        .send()?;
                                }
                                Response::new()
                                    .body(serde_json::to_vec(&format!("Done {}", path))?)
                                    .send()?;
                            }
                            return Ok(false);
                        }
                        // start receiving data
                        // we receive only the name of the overfolder (Google Keep)
                        None => {
                            println!("files dir path: {}", files_dir.path);
                            // OVO JE MOZDA KRIVO initial path (bude google keep)
                            println!("initial path: {}", name);
                            let full_path = format!("{}/{}", files_dir.path, name);
                            println!("Full path for file creation: {}", full_path);

                            let request = VfsRequest {
                                path: format!("/{}", full_path).to_string(),
                                action: VfsAction::CreateDirAll,
                            };
                            let _message = Request::new()
                                .target(("our", "vfs", "distro", "sys"))
                                .body(serde_json::to_vec(&request)?)
                                .send_and_await_response(5)?;

                            let mut active_file =
                                open_file(&format!("{}/{}", files_dir.path, &name), true, Some(5))?;

                            Response::new()
                                .body(serde_json::to_vec(&"Started")?)
                                .send()?;
                        }
                    }
                }
                // someone sending a chunk to us!
                WorkerRequest::Chunk {
                    name,
                    offset,
                    length,
                } => {
                    let blob = get_blob();
                    println!("receiving chunk: {}", name);
                    let mut split_path: Vec<_> = name.split("/").collect();
                    // let mut split_path: Vec<&str> = split_path.skip(2).collect();
                    let new_name = split_path.join("/");
                    split_path.pop();
                    // OVO JE: NAME I PATH TO DIR SU KRIVI
                    let path_to_dir = split_path.join("/");

                    println!("path_to_dir: {}", path_to_dir);
                    let request = VfsRequest {
                        path: format!("/{}", path_to_dir).to_string(),
                        action: VfsAction::CreateDirAll,
                    };
                    let _message = Request::new()
                        .target(("our", "vfs", "distro", "sys"))
                        .body(serde_json::to_vec(&request)?)
                        .send_and_await_response(5)?;
                    println!("we fail here?");
                    println!("{}", name);
                    let mut file = open_file(&name.to_string(), true, Some(5))?;
                    println!("or further down?");

                    let bytes = match blob {
                        Some(blob) => blob.bytes,
                        None => {
                            return Err(anyhow::anyhow!("file_transfer: receive error: no blob"));
                        }
                    };

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
                                name: new_name,
                                progress,
                            })?)
                            .target(&main_app)
                            .send()?;

                        if progress >= 100 {
                            Response::new().body(serde_json::to_vec(&"Done")?).send()?;
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

    let drive_path = format!("{}/files", our.package_id());
    let files_dir = open_dir(&drive_path, false, Some(5)).unwrap();

    let mut size: Option<u64> = None;

    loop {
        match handle_message(&our, &files_dir, &mut size) {
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
