// Note: This is a temp file until we have a great way to message processes that we haven't spawned ourselves. This will just have a custom handle_request.
use crate::Pkg;
use crate::State;
use kinode_process_lib::{
    await_message, call_init, get_blob, http, println, Address, Message, Request,
};
use std::collections::HashMap;
use frankenstein::{UpdateContent, Message as TgMessage};

use llm_interface::*;
use stt_interface::*;
use telegram_interface::*;

pub fn one_shot(
    our: &Address,
    state: &mut Option<State>,
    pkgs: &HashMap<Pkg, Address>,
) -> anyhow::Result<()> {
    let address = pkgs.get(&Pkg::Telegram).unwrap();
    let subscribe_request = serde_json::to_vec(&TgRequest::Subscribe)?;
    let _ = Request::new()
        .target(address.clone())
        .body(subscribe_request)
        .send_and_await_response(5)??;
    println!("Subscribed to telegram");

    Ok(())
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
        state.config.telegram_key.unwrap(), file_path // TODO: Zena: All this should die and go toward the telegram process!
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
        .expects_response(30)
        .send()
        .ok()
}


fn handle_telegram_message(message: &Message, state: &mut Option<State>, pkgs: &HashMap<Pkg, Address>) -> anyhow::Result<()> {
    let tg_address = pkgs.get(&Pkg::Telegram).unwrap();
    if message.source().node != our.node {
        return Ok(());
    }
    let state = state.as_ref().ok_or_else(|| anyhow::anyhow!("State not initialized"))?;
    if *message.source() != *tg_address {
        return Ok(());
    }

    let msg: TgMessage = get_last_tg_msg(&message).ok_or_else(|| anyhow::anyhow!("Failed to parse telegram update"))?;
    let text = msg.text.clone().unwrap_or_default();

    if let Some(voice) = msg.voice.clone() {
        handle_tg_voice_message(state, voice);
    }


    Ok(())
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


fn handle_http_message(our: &Address, message: &Message, state: &mut Option<State>) {
    match message {
        Message::Response { .. } => handle_http_response(message, state),
        _ => None,
    };
}

fn handle_http_response(message: &Message, state: &mut Option<State>) -> Option<()> {
    let context = message.context()?;
    let state = state.as_ref()?;

    match context[0] {
        0 => {
            // Result of voice message transcription
            let text = openai_whisper_response().ok()?;
            println!("Got text: {:?}", text);
            // TODO: Do something with the text;
        }
        1 => {
            let bytes = get_blob()?.bytes;
            if let Some(openai_key) = &state.config.openai_key {
                openai_whisper_request(&bytes, &openai_key, 0);
                // TODO: Zena: make the 0 a const for context management
            }
        }
        _ => {}
    }
    Some(())
}

pub fn handle_message(our: &Address, state: &mut Option<State>, pkgs: &HashMap<Pkg, Address>) -> anyhow::Result<()> {
    let message = await_message()?;
    if message.source().node != our.node {
        return Ok(());
    }

    match message.source().process.to_string().as_str() {
        "http_server:distro:sys" | "http_client:distro:sys" => {
            handle_http_message(&our, &message, state);
        }
        _ => {
            handle_telegram_message(&message, state, pkgs);
        }
    }
    Ok(())
}