use kinode_process_lib::vfs::{open_dir, open_file, DirEntry, FileType};
use kinode_process_lib::{println, Address, NodeId, Request};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Serialize, Deserialize, Debug)]
pub enum ClientRequest {
    // telling the server which data size to expect
    BackupRequest { node_id: NodeId, size: u64 },
}

#[derive(Serialize, Deserialize, Debug)]
pub enum ServerResponse {
    BackupResponse(BackupResponse),
}

#[derive(Serialize, Deserialize, Debug)]
pub enum BackupResponse {
    Confirm,
    Decline,
}

// read_file -> contents
pub fn read_file(dir: DirEntry) -> anyhow::Result<String> {
    if dir.path.ends_with(".DS_Store")
    // || dir.path.contains(".obsidian")
    // || dir.path.contains(".trash")
    {
        return Err(anyhow::Error::msg("Skipping .DS_Store"));
    }
    println!("fn read_file on: {:#?}", &dir);
    let file = open_file(&dir.path, false, Some(5));
    let contents: Vec<u8> = file?.read()?;
    let json = std::str::from_utf8(&contents).map(|s| s.to_string())?;
    // println!("json: {:#?}", &json);
    Ok(json)
}

// read files -> map path contents
pub fn read_files(dirs: Vec<DirEntry>) -> anyhow::Result<HashMap<String, String>> {
    // println!("fn read_files on: {:#?}", &dirs);
    let mut files = HashMap::new();
    for dir in dirs {
        let content = read_file(DirEntry {
            path: dir.path.to_string(),
            file_type: dir.file_type,
        });
        if let Ok(content) = content {
            files.insert(dir.path.to_string(), content);
        }
    }
    Ok(files)
}

// read dir -> list of paths
pub fn read_dir(dir: DirEntry) -> anyhow::Result<Vec<DirEntry>> {
    // println!("fn read_dir on: {:#?}", &dir);
    let dir = open_dir(&dir.path, false, Some(5));
    match dir {
        Ok(dir) => Ok(dir.read()?),
        Err(_) => Err(anyhow::Error::msg("Failed to read directory")),
    }
}

// read nested dir -> map path contents
pub fn read_nested_dir(dir: DirEntry) -> anyhow::Result<HashMap<String, String>> {
    // println!("fn read_nested_dir on: {:#?}", &dir);
    //  read dir -> list of paths
    let entries = read_dir(dir)?;
    //  split files from dirs
    let (directories, files): (Vec<DirEntry>, Vec<DirEntry>) = entries
        .into_iter()
        .partition(|entry| entry.file_type == FileType::Directory);

    let mut output: HashMap<String, String> = HashMap::new();
    //  files -> read files -> map path contents
    output.extend(read_files(files)?);

    //  dirs ->
    //    for each -> read nested dir -> accumulate map path contents
    for dir in directories {
        output.extend(read_nested_dir(dir)?);
    }

    Ok(output)
}
