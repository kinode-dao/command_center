use frankenstein::{Message as TgMessage, TelegramApi, UpdateContent, Voice};
use serde_json::json;
use std::collections::HashMap;

use kinode_process_lib::{
    await_message, call_init, get_blob, http, println, Address, Message, ProcessId, Request,
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
        Message::Response { .. } => handle_http_response(message, state),
        Message::Request { ref body, .. } => handle_http_request(our, state, body),
    };
}

fn handle_http_response(message: &Message, state: &mut Option<State>) -> Option<()> {
    let context = message.context()?;
    let state = state.as_ref()?;

    match context[0] {
        0 => {
            // Result of voice message transcription
            let _text = openai_whisper_response().ok()?;
            // TODO: Do something with the text;
        }
        1 => {
            let bytes = get_blob()?.bytes;
            if let Some(openai_key) = &state.config.openai_key {
                println!("Sent request");
                openai_whisper_request(&bytes, &openai_key, 0);
                // TODO: Zena: make the 0 a const for context management
            }
        }
        _ => {}
    }
    Some(())
}

fn handle_http_request(our: &Address, state: &mut Option<State>, body: &[u8]) -> Option<()> {
    let http_request = http::HttpServerRequest::from_bytes(body).ok()?.request();
    let path = http_request?.path().ok()?;
    let bytes = get_blob()?.bytes;

    match path.as_str() {
        "/submit_config" => {
            submit_config(our, &bytes, state);
        }
        _ => {}
    }
    Some(())
}

fn submit_config(our: &Address, body_bytes: &[u8], state: &mut Option<State>) -> Option<()> {
    let initial_config = serde_json::from_slice::<InitialConfig>(body_bytes).ok()?;
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

    Some(())
}

fn get_last_tg_msg(message: &Message) -> Option<TgMessage> {
    let Ok(TgResponse::Update(tg_update)) = serde_json::from_slice(message.body()) else {
        return None;
    };
    let update = tg_update.updates.last()?;
    let msg = match &update.content {
        UpdateContent::Message(msg) | UpdateContent::ChannelPost(msg) => msg,
        _ => return None,
    };
    Some(msg.clone())
}

fn handle_tg_voice_message(state: &State, voice: Box<Voice>) -> Option<()> {
    let get_file_params = frankenstein::GetFileParams::builder()
        .file_id(voice.file_id)
        .build();
    let file_path = state
        .tg_api
        .get_file(&get_file_params)
        .ok()?
        .result
        .file_path?;
    let download_url = format!(
        "https://api.telegram.org/file/bot{}/{}",
        state.config.telegram_key, file_path
    );
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
    Request::new()
        .target(Address::new(
            "our",
            ProcessId::new(Some("http_client"), "distro", "sys"),
        ))
        .body(body_bytes)
        .context(vec![1])
        .send()
        .ok()
}

fn handle_telegram_message(message: &Message, state: &mut Option<State>) -> Option<()> {
    let state = state.as_ref()?;
    if *message.source() != state.tg_worker {
        return None;
    }
    let msg = get_last_tg_msg(message)?;
    let text = msg.text.clone().unwrap_or_default();
    println!("Got message: {:?}", text);

    if let Some(voice) = msg.voice.clone() {
        handle_tg_voice_message(state, voice);
    }
    Some(())
}

fn handle_message(our: &Address, state: &mut Option<State>) -> anyhow::Result<()> {
    let message = await_message()?;
    if message.source().node != our.node {
        return Ok(());
    }

    match message.source().process.to_string().as_str() {
        "http_server:distro:sys" | "http_client:distro:sys" => {
            handle_http_message(&our, &message, state);
        }
        _ => {
            handle_telegram_message(&message, state);
        }
    }
    Ok(())
}

call_init!(init);
fn init(our: Address) {
    let _ = http::serve_ui(&our, "ui/", true, false, vec!["/", "/submit_config"]);
    let mut state = State::fetch();

    loop {
        let _ = handle_message(&our, &mut state);
    }
}
