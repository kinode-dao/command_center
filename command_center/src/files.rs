use kinode_process_lib::println;
use kinode_process_lib::vfs::{open_dir, open_file, DirEntry, FileType};
use std::collections::HashMap;

// read_file -> contents
pub fn read_file(dir: DirEntry) -> anyhow::Result<Vec<u8>> {
    // println!("fn read_file on: {:#?}", &dir);
    let file = open_file(&dir.path, false, Some(5));
    file?.read()
}

// read files -> map path contents
pub fn read_files(dirs: Vec<DirEntry>) -> anyhow::Result<HashMap<String, Vec<u8>>> {
    // println!("fn read_files on: {:#?}", &dirs);
    let mut files = HashMap::new();
    for dir in dirs {
        files.insert(dir.path.clone(), read_file(dir)?);
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
pub fn read_nested_dir(dir: DirEntry) -> anyhow::Result<HashMap<String, Vec<u8>>> {
    // println!("fn read_nested_dir on: {:#?}", &dir);
    //  read dir -> list of paths
    let entries = read_dir(dir)?;
    //  split files from dirs
    let (directories, files): (Vec<DirEntry>, Vec<DirEntry>) = entries
        .into_iter()
        .partition(|entry| entry.file_type == FileType::Directory);

    let mut output: HashMap<String, Vec<u8>> = HashMap::new();
    //  files -> read files -> map path contents
    output.extend(read_files(files)?);

    //  dirs ->
    //    for each -> read nested dir -> accumulate map path contents
    for dir in directories {
        output.extend(read_nested_dir(dir)?);
    }

    Ok(output)
}
