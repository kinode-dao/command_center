use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::str::FromStr;
use frankenstein::{
    ChatId, SendMessageParams, TelegramApi, UpdateContent::ChannelPost as TgChannelPost,
    UpdateContent::Message as TgMessage,
};

use kinode_process_lib::{
    await_message, call_init, get_blob, http, println, Address, Message, ProcessId, Request,
    Response,
};

mod structs;
use structs::*;

mod tg_api;
use crate::tg_api::TgResponse;

wit_bindgen::generate!({
    path: "wit",
    world: "process",
});

fn handle_http_message(our: &Address, message: &Message, state: &mut Option<State>) {
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

fn handle_telegram_message(our: &Address, message: &Message, state: &mut Option<State>) -> anyhow::Result<()> {
    let Message::Request { ref source, ref body, ..} = message else {
        return Err(anyhow::anyhow!("unexpected message: {:?}", message));
    };

    let Some(state) = state else {
        return Err(anyhow::anyhow!("State not found"));
    };

    let State {
        config,
        tg_api,
        tg_worker,
        ..
    } = state;

    let Ok(TgResponse::Update(tg_update)) = serde_json::from_slice(body) else {
        return Err(anyhow::anyhow!("unexpected response: {:?}", body));
    };
    let updates = tg_update.updates;

    // assert update is from our worker
    if source != tg_worker {
        return Err(anyhow::anyhow!(
            "unexpected source: {:?}, expected: {:?}",
            source,
            tg_worker
        ));
    }

    let Some(update) = updates.last() else {
        return Ok(());
    };

    let msg = match &update.content {
        TgMessage(msg) | TgChannelPost(msg) => msg,
        _ => return Err(anyhow::anyhow!("unexpected content: {:?}", update.content)),
    };
    let text = msg.text.clone().unwrap_or_default();
    if let Some(voice) = msg.voice.clone() {
        let get_file_params = frankenstein::GetFileParams::builder()
                    .file_id(voice.file_id)
                    .build();
        let file_response = tg_api.get_file(&get_file_params)?;
        if let Some(file_path) = file_response.result.file_path {
            let download_url = format!("https://api.telegram.org/file/bot{}/{}", config.telegram_key, file_path);
            println!("Downloading voice from {:?}", download_url);
            // TODO: Zena: download with reqwest
            /*
            let response = reqwest::blocking::get(download_url)?;
            if response.status().is_success() {
                let bytes = response.bytes()?;
                // Now you have the voice message's contents in `bytes`
                // You can save it to a file or process it as needed
            }
             */
        }
    }
    Ok(())
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
            let http_request_outcome = handle_http_message(&our, &message, &mut state);
        } else {
            match handle_telegram_message(&our, &message, &mut state) {
                Ok(_) => {}
                Err(e) => {
                    println!("Error handling telegram message: {:?}", e);
                }
            }
        }
    }
}
