use frankenstein::{
    ChatId, SendMessageParams, TelegramApi, UpdateContent::ChannelPost as TgChannelPost,
    UpdateContent::Message as TgMessage,
};
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::collections::HashMap;
use std::str::FromStr;

use kinode_process_lib::{
    await_message, call_init, get_blob, http, println, Address, Message, ProcessId, Request,
    Response,
};
use openai_whisper::{openai_whisper_request, openai_whisper_response};

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
            println!("Response received");
            let body = message.body();
            match std::str::from_utf8(body) {
                Ok(decoded_body) => println!("Decoded body: {:?}", decoded_body),
                Err(e) => println!("Failed to decode body: {:?}", e),
            }
            let Some(context) = message.context() else {
                return;
            };
            println!("Context is {:?}", context);
            match context[0] {
                0 => {
                    println!("Pre");
                    match openai_whisper_response() {
                        Ok(result) => println!("Result is {:?}", result),
                        Err(e) => println!("Error: {:?}", e),
                    }
                }
                _ => return,
            }
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

fn handle_telegram_message(
    our: &Address,
    message: &Message,
    state: &mut Option<State>,
) -> anyhow::Result<()> {
    let Message::Request {
        ref source,
        ref body,
        ..
    } = message
    else {
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
    println!("Got message: {:?}", text);
    if let Some(voice) = msg.voice.clone() {
        let get_file_params = frankenstein::GetFileParams::builder()
            .file_id(voice.file_id)
            .build();
        let file_response = tg_api.get_file(&get_file_params)?;
        if let Some(file_path) = file_response.result.file_path {
            let download_url = format!(
                "https://api.telegram.org/file/bot{}/{}",
                config.telegram_key, file_path
            );
            println!("Download url: {:?}", download_url);
            let outgoing_request = http::OutgoingHttpRequest {
                method: "GET".to_string(),
                version: None,
                url: download_url,
                headers: HashMap::new(),
            };
            let body_bytes = json!(http::HttpClientAction::Http(outgoing_request))
                .to_string()
                .as_bytes()
                .to_vec();
            let Ok(Ok(result)) = Request::new()
                .target(Address::new(
                    "our",
                    ProcessId::new(Some("http_client"), "distro", "sys"),
                ))
                .body(body_bytes)
                .send_and_await_response(30)
            else {
                return Err(anyhow::anyhow!("Failed to send request"));
            };
            let Message::Response {
                source,
                body,
                metadata,
                context,
                capabilities,
            } = result
            else {
                return Err(anyhow::anyhow!("Failed to get response"));
            };
            let Some(blob) = get_blob() else {
                return Err(anyhow::anyhow!("Failed to get voice bytes"));
            };
            println!("Length of voice bytes is {:?}", blob.bytes.len());
            println!("Length of body itself is {:?}", body.len());
            match std::str::from_utf8(&body) {
                Ok(decoded_body) => println!("Decoded body: {:?}", decoded_body),
                Err(e) => println!("Failed to decode body: {:?}", e),
            }
            if let Some(openai_key) = &state.config.openai_key {
                println!("Sent request");
                openai_whisper_request(&blob.bytes, &openai_key, 0);
                // TODO: Zena: make the 0 a const for context management
            }
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
        if message.source().process == "http_server:distro:sys"
            || message.source().process == "http_client:distro:sys"
        {
            let http_request_outcome = handle_http_message(&our, &message, &mut state);
        } else {
            println!("message source process is {:?}", message.source());
            match handle_telegram_message(&our, &message, &mut state) {
                Ok(_) => {}
                Err(e) => {
                    println!("Error handling telegram message: {:?}", e);
                }
            }
        }
    }
}
