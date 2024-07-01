use kinode_process_lib::vfs::{open_dir, open_file, DirEntry, FileType, VfsAction, VfsRequest};
use kinode_process_lib::{println, Request};
use std::collections::HashMap;

pub mod encryption;
pub mod structs;

// read_file -> contents
pub fn read_file(dir: DirEntry) -> anyhow::Result<String> {
    if dir.path.ends_with(".DS_Store") {
        return Err(anyhow::Error::msg("Skipping .DS_Store"));
    }
    let file = open_file(&dir.path, false, Some(5));
    let contents: Vec<u8> = file?.read()?;
    let json = std::str::from_utf8(&contents).map(|s| s.to_string())?;
    Ok(json)
}

// read files -> map path contents
pub fn read_files(dirs: Vec<DirEntry>) -> anyhow::Result<HashMap<String, String>> {
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

// read files -> map path empty_contents
pub fn read_files_light(dirs: Vec<DirEntry>) -> anyhow::Result<HashMap<String, String>> {
    let mut files = HashMap::new();
    for dir in dirs {
        files.insert(dir.path.to_string(), String::from(""));
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

// read nested dir -> map path empty_contents
pub fn read_nested_dir_light(dir: DirEntry) -> anyhow::Result<HashMap<String, String>> {
    //  read dir -> list of paths
    let entries = read_dir(dir)?;
    //  split files from dirs
    let (directories, files): (Vec<DirEntry>, Vec<DirEntry>) = entries
        .into_iter()
        .partition(|entry| entry.file_type == FileType::Directory);

    let mut output: HashMap<String, String> = HashMap::new();
    //  files -> read files -> map path contents
    output.extend(read_files_light(files)?);

    //  dirs ->
    //    for each -> read nested dir -> accumulate map path contents
    for dir in directories {
        output.extend(read_nested_dir(dir)?);
    }

    Ok(output)
}

pub fn import_notes(body_bytes: &[u8]) -> anyhow::Result<()> {
    let directory: HashMap<String, String> =
        serde_json::from_slice::<HashMap<String, String>>(body_bytes)?;

    let mut dirs_created: Vec<String> = Vec::new();

    for (file_path, content) in directory.iter() {
        let drive_path: &str = "/command_center:appattacc.os/files";
        let full_file_path = format!("{}/{}", drive_path, file_path);

        let mut split_path: Vec<&str> = full_file_path
            .split("/")
            .filter(|s| !s.is_empty())
            .collect::<Vec<&str>>();
        split_path.pop();
        let dir_path = split_path.join("/");

        // not perfect, i.e. it will run create /this/dir even if /this/dir/here/ exists
        // because it doesnt check was already created when /this/dir/here was created
        if !dirs_created.contains(&dir_path) {
            // println!("creating dir: {:?}", dir_path);
            let request = VfsRequest {
                path: format!("/{}", dir_path).to_string(),
                action: VfsAction::CreateDirAll,
            };
            let _message = Request::new()
                .target(("our", "vfs", "distro", "sys"))
                .body(serde_json::to_vec(&request)?)
                .send_and_await_response(5)?;
        }

        dirs_created.push(dir_path);

        let file = open_file(&full_file_path, true, Some(5))?;

        // println!("write content to file");
        file.write(content.as_bytes())?;
    }

    println!("done importing notes");

    Ok(())
}
