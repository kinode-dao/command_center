use serde::{Deserialize, Serialize};
use std::str::FromStr;
use std::collections::HashMap;

use kinode_process_lib::{
    await_message, call_init, get_blob, http, println, Address, ProcessId, Request,
    Response, Message,
};

mod structs;
use structs::*;

wit_bindgen::generate!({
    path: "wit",
    world: "process",
});

fn handle_http_messages(message: &Message) {
    match message {
        Message::Response { .. } => {
            return;
        }
        Message::Request { ref body, .. } => {
            let Ok(server_request) = http::HttpServerRequest::from_bytes(body) else {
                return;
            };

            let Some(http_request) = server_request.request() else {
                return;
            };

            let Some(body) = get_blob() else {
                return;
            };
            let Ok(path) = http_request.path() else {
                return;
            };
            match path.as_str() {
                "/config" => {
                    config(&body.bytes);
                }
                _ => {
                    return;
                }
            }
        }
    }
}

fn config(body_bytes: &[u8]) {
    let Ok(initial_config) = serde_json::from_slice::<InitialConfig>(body_bytes) else {
        return;
    };
    http::send_response(
        http::StatusCode::OK,
        Some(HashMap::from([(
            "Content-Type".to_string(),
            "application/json".to_string(),
        )])),
        b"{\"message\": \"success\"}".to_vec(),
    );
    println!("Initial config {:?}", initial_config);
}

call_init!(init);
fn init(our: Address) {
    println!("begin");
    let _ = http::serve_ui(&our, "ui/", true, false, vec!["/", "/config"]);
    loop {
        let Ok(message) = await_message() else {
            continue;
        };
        if message.source().node != our.node {
            continue;
        }
        if message.source().process == "http_server:distro:sys" {
            let http_request_outcome = handle_http_messages(&message);
        }
    }
}
