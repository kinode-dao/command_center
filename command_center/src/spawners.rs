use kinode_process_lib::{Address, ProcessId, OnExit, spawn, our_capabilities};
use std::str::FromStr;
use std::collections::HashMap;
use serde::{Serialize, Deserialize};

#[derive(Eq, Hash, PartialEq, Clone, Serialize, Deserialize)]
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

fn spawn_pkg(our: &Address, pkg_name: &str) -> anyhow::Result<Address> {
    let pkg_path = format!("{}/pkg/{}", our.package_id(), pkg_name);
    let our_caps = our_capabilities();
    let http_client = ProcessId::from_str("http_client:distro:sys").unwrap();

    let process_id = spawn(
        None,
        &pkg_path,
        OnExit::None,
        our_caps,
        vec![http_client],
        false,
    )?;

    Ok(Address {
        node: our.node.clone(),
        process: process_id,
    })
}