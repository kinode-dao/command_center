use std::collections::HashMap;
use std::str::FromStr;

use kinode_process_lib::{await_message, call_init, println, Address, ProcessId, Request, Response};

wit_bindgen::generate!({
    path: "target/wit",
    world: "process-v0",
});

fn handle_message(_our: &Address) -> anyhow::Result<()> {
    let message = await_message()?;
    println!("message: {:?}", message);
    Ok(())
}

call_init!(init);
fn init(our: Address) {
    println!("begin");


    loop {
        match handle_message(&our) {
            Ok(()) => {}
            Err(e) => {
                println!("error: {:?}", e);
            }
        };
    }
}
