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
    addresses.entry(Pkg::LLM).or_insert(spawn_openai_pkg(our)?);
    addresses.entry(Pkg::STT).or_insert(spawn_stt_pkg(our)?);
    addresses.entry(Pkg::Telegram).or_insert(spawn_tg_pkg(our)?);
    Ok(addresses)
}

pub fn spawn_openai_pkg(our: &Address) -> anyhow::Result<Address> {
    let openai_pkg_path = format!("{}/pkg/openai.wasm", our.package_id());
    let our_caps = our_capabilities();
    let http_client = ProcessId::from_str("http_client:distro:sys").unwrap();

    let process_id = spawn(
        None,
        &openai_pkg_path,
        OnExit::None,
        our_caps,
        vec![http_client],
        false,
    )?;

    Ok(Address {
        node: our.node.clone(),
        process: process_id.clone(),
    })
}

pub fn spawn_stt_pkg(our: &Address) -> anyhow::Result<Address> {
    let stt_pkg_path = format!("{}/pkg/speech_to_text.wasm", our.package_id());
    let our_caps = our_capabilities();
    let http_client = ProcessId::from_str("http_client:distro:sys").unwrap();

    let process_id = spawn(
        None,
        &stt_pkg_path,
        OnExit::None,
        our_caps,
        vec![http_client],
        false,
    )?;

    Ok(Address {
        node: our.node.clone(),
        process: process_id.clone(),
    })
}

pub fn spawn_tg_pkg(our: &Address) -> anyhow::Result<Address> {
    let tg_pkg_path = format!("{}/pkg/tg.wasm", our.package_id());
    let our_caps = our_capabilities();
    let http_client = ProcessId::from_str("http_client:distro:sys").unwrap();

    let process_id = spawn(
        None,
        &tg_pkg_path,
        OnExit::None,
        our_caps,
        vec![http_client],
        false,
    )?;

    Ok(Address {
        node: our.node.clone(),
        process: process_id.clone(),
    })
}