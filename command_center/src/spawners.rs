use kinode_process_lib::{Address, ProcessId, OnExit, spawn, our_capabilities};
use std::str::FromStr;

pub fn spawn_openai_pkg(our: Address) -> anyhow::Result<Address> {
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
