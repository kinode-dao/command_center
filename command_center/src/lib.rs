use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::str::FromStr;

use kinode_process_lib::{
    await_message, call_init, get_blob, http, println, Address, Message, ProcessId, Request,
    Response,
};

mod structs;
use structs::*;

mod tg_api;

wit_bindgen::generate!({
    path: "wit",
    world: "process",
});

fn handle_http_messages(our: &Address, message: &Message, state: &mut Option<State>) {
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
                    config(our, &body.bytes, state);
                }
                _ => {
                    return;
                }
            }
        }
    }
}

fn config(our: &Address, body_bytes: &[u8], state: &mut Option<State>) {
    let Ok(initial_config) = serde_json::from_slice::<InitialConfig>(body_bytes) else {
        return;
    };
    match state {
        Some(state_) => {
            println!("Modifying state to {:?}", initial_config);
            state_.config = initial_config;
        }
        None => {
            println!("Creating state {:?}", initial_config);
            *state = Some(State::new(our, initial_config));
        }
    }
    if let Some(ref mut state) = state {
        state.save();
        http::send_response(
            http::StatusCode::OK,
            Some(HashMap::from([(
                "Content-Type".to_string(),
                "application/json".to_string(),
            )])),
            b"{\"message\": \"success\"}".to_vec(),
        );
    }
}

call_init!(init);
fn init(our: Address) {
    println!("begin");
    let _ = http::serve_ui(&our, "ui/", true, false, vec!["/", "/config"]);
    let mut state = State::fetch();
    loop {
        let Ok(message) = await_message() else {
            continue;
        };
        if message.source().node != our.node {
            continue;
        }
        if message.source().process == "http_server:distro:sys" {
            let http_request_outcome = handle_http_messages(&our, &message, &mut state);
        }
    }
}
