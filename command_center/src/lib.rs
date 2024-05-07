use std::collections::HashMap;

use kinode_process_lib::{
    await_message, call_init, get_blob, http, println, Address, Message,  Request,
};
use llm_interface::openai::*;
use openai_whisper::{openai_whisper_request, openai_whisper_response};
use stt_interface::*;

mod structs;
use structs::*;

mod tg_api;

mod spawners;
use spawners::*;

wit_bindgen::generate!({
    path: "wit",
    world: "process",
});

/*


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
        .expects_response(30)
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

    if let Some(voice) = msg.voice.clone() {
        handle_tg_voice_message(state, voice);
    }
    Some(())
}

*/
fn submit_config(
    our: &Address,
    body_bytes: &[u8],
    state: &mut Option<State>,
    pkgs: &HashMap<Pkg, Address>,
) -> Option<()> {
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
        for (pkg, addr) in pkgs.iter() {
            match pkg {
                Pkg::LLM => {
                    if let Some(openai_key) = &state.config.openai_key {
                        let req = serde_json::to_vec(&LLMRequest::RegisterOpenaiApiKey(
                            RegisterApiKeyRequest {
                                api_key: openai_key.clone(),
                            },
                        ))
                        .ok()?;
                        let _ = Request::new().target(addr.clone()).body(req).send();
                    }
                    if let Some(groq_key) = &state.config.groq_key {
                        let req = serde_json::to_vec(
                            &llm_interface::openai::LLMRequest::RegisterGroqApiKey(
                                RegisterApiKeyRequest {
                                    api_key: groq_key.clone(),
                                },
                            ),
                        )
                        .ok()?;
                        let _ = Request::new().target(addr.clone()).body(req).send();
                    }
                }
                Pkg::STT => {
                    if let Some(openai_key) = &state.config.openai_key {
                        let req =
                            serde_json::to_vec(&STTRequest::RegisterApiKey(openai_key.clone()))
                                .ok()?;
                        let _ = Request::new().target(addr.clone()).body(req).send();
                    }
                }
            }
        }
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

fn handle_http_message(
    our: &Address,
    message: &Message,
    state: &mut Option<State>,
    pkgs: &HashMap<Pkg, Address>,
) {
    match message {
        Message::Request { ref body, .. } => handle_http_request(our, state, body, pkgs),
        Message::Response { .. } => handle_http_response(message, state),
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

fn handle_http_request(
    our: &Address,
    state: &mut Option<State>,
    body: &[u8],
    pkgs: &HashMap<Pkg, Address>,
) -> Option<()> {
    let http_request = http::HttpServerRequest::from_bytes(body).ok()?.request();
    let path = http_request?.path().ok()?;
    let bytes = get_blob()?.bytes;

    match path.as_str() {
        "/status" => {
            let _ = fetch_status();
        }
        "/submit_config" => {
            submit_config(our, &bytes, state, pkgs);
        }
        _ => {}
    }
    Some(())
}

fn fetch_status() -> anyhow::Result<()> {
    let state = State::fetch().ok_or_else(|| anyhow::anyhow!("Failed to fetch state"))?;
    let config = &state.config;
    let response_body = serde_json::to_string(&config)?;
    http::send_response(
        http::StatusCode::OK,
        Some(HashMap::from([(
            "Content-Type".to_string(),
            "application/json".to_string(),
        )])),
        response_body.as_bytes().to_vec(),
    );
    Ok(())
}

fn handle_message(
    our: &Address,
    state: &mut Option<State>,
    pkgs: &HashMap<Pkg, Address>,
) -> anyhow::Result<()> {
    let message = await_message()?;
    if message.source().node != our.node {
        return Ok(());
    }

    match message.source().process.to_string().as_str() {
        "http_server:distro:sys" | "http_client:distro:sys" => {
            handle_http_message(&our, &message, state, pkgs);
        }
        _ => {}
    }
    Ok(())
}

call_init!(init);
fn init(our: Address) {
    let _ = http::serve_ui(
        &our,
        "ui/",
        true,
        false,
        vec!["/", "/submit_config", "/status"],
    );
    let mut state = State::fetch();

    let Ok(pkgs) = spawners::spawn_pkgs(&our) else {
        panic!("Failed to spawn pkgs");
    };

    loop {
        match handle_message(&our, &mut state, &pkgs) {
            Ok(_) => {}
            Err(e) => println!("Error: {:?}", e),
        }
    }
}
