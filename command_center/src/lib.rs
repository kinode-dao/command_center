use serde::{Deserialize, Serialize};
use std::str::FromStr;

use kinode_process_lib::{await_message, call_init, println, Address, ProcessId, Request, Response};

wit_bindgen::generate!({
    path: "wit",
    world: "process",
});

fn handle_message(our: &Address) -> anyhow::Result<()> {
    Ok(())
}

call_init!(init);
fn init(our: Address) {
    println!("begin");

    let mut message_archive: MessageArchive = Vec::new();

    loop {
        match handle_message(&our) {
            Ok(()) => {}
            Err(e) => {
                println!("error: {:?}", e);
            }
        };
    }
}
