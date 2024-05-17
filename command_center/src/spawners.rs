use kinode_process_lib::{our_capabilities, spawn, Address, OnExit, ProcessId};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::str::FromStr;

#[derive(Debug, Eq, Hash, PartialEq, Clone, Serialize, Deserialize)]
pub enum Pkg {
    LLM,
    STT,
    Telegram,
}

pub fn spawn_pkgs(our: &Address) -> anyhow::Result<HashMap<Pkg, Address>> {
    let mut addresses = HashMap::new();
    addresses.insert(Pkg::LLM, spawn_pkg(our, "openai.wasm")?);
    addresses.insert(Pkg::STT, spawn_pkg(our, "speech_to_text.wasm")?);
    addresses.insert(Pkg::Telegram, spawn_pkg(our, "tg.wasm")?);
    Ok(addresses)
}

pub fn spawn_pkg(our: &Address, pkg_name: &str) -> anyhow::Result<Address> {
    let name = pkg_name.split('.').next();
    let pkg_path = format!("{}/pkg/{}", our.package_id(), pkg_name);
    let our_caps = our_capabilities();
    let http_client = ProcessId::from_str("http_client:distro:sys").unwrap();

    let process_id = spawn(
        name,
        &pkg_path,
        OnExit::None,
        our_caps,
        vec![http_client],
        false,
    )?;
    println!("spawn_pkg: process_id = {:?}", process_id);
    Ok(Address {
        node: our.node.clone(),
        process: process_id,
    })
}
