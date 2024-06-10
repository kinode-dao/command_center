use std::collections::HashMap;

use kinode_process_lib::vfs::{create_drive, DirEntry, FileType};
use kinode_process_lib::{
    await_message, call_init, get_blob, http, println, Address, Message, Request,
};

use llm_interface::openai::*;
use stt_interface::*;
use telegram_interface::*;

mod structs;
use structs::*;

mod tg_api;

mod files;

wit_bindgen::generate!({
    path: "wit",
    world: "process",
});

fn handle_http_message(
    our: &Address,
    message: &Message,
    state: &mut Option<State>,
    pkgs: &HashMap<Pkg, Address>,
) -> anyhow::Result<()> {
    println!("handle http message");
    match message {
        Message::Request { ref body, .. } => handle_http_request(our, state, body, pkgs),
        Message::Response { .. } => Ok(()),
    }
}

fn handle_http_request(
    our: &Address,
    state: &mut Option<State>,
    body: &[u8],
    pkgs: &HashMap<Pkg, Address>,
) -> anyhow::Result<()> {
    println!("handle http request");
    let http_request = http::HttpServerRequest::from_bytes(body)?
        .request()
        .ok_or_else(|| anyhow::anyhow!("Failed to parse http request"))?;
    let path = http_request.path()?;
    println!("path: {:?}", path);
    let bytes = get_blob()
        .ok_or_else(|| anyhow::anyhow!("Failed to get blob"))?
        .bytes;
    match path.as_str() {
        "/status" => {
            println!("fetching status");
            fetch_status()
        }
        "/submit_config" => submit_config(our, &bytes, state, pkgs),
        "/notes" => {
            println!("fetching notes");
            fetch_notes()
        }
        _ => Ok(()),
    }
}

fn fetch_status() -> anyhow::Result<()> {
    let state = State::fetch()
        .ok_or_else(|| anyhow::anyhow!("State being fetched for the first time (or failed)"))?;
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

fn fetch_notes() -> anyhow::Result<()> {
    let dir_entry: DirEntry = DirEntry {
        path: NOTES_PATH.to_string(),
        file_type: FileType::Directory,
    };

    let notes = files::read_nested_dir(dir_entry)?;
    println!("notes: {:?}", notes);

    let response_body = serde_json::to_string(&notes)?;
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

// also creates state if doesn't exist
fn submit_config(
    our: &Address,
    body_bytes: &[u8],
    state: &mut Option<State>,
    pkgs: &HashMap<Pkg, Address>,
) -> anyhow::Result<()> {
    let initial_config = serde_json::from_slice::<InitialConfig>(body_bytes)?;
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
            println!("submit_config: matching pkg: {:?}", pkg);
            match pkg {
                Pkg::LLM => {
                    if let Some(openai_key) = &state.config.openai_key {
                        let req = serde_json::to_vec(&LLMRequest::RegisterOpenaiApiKey(
                            RegisterApiKeyRequest {
                                api_key: openai_key.clone(),
                            },
                        ))?;
                        let _ = Request::new()
                            .target(addr.clone())
                            .body(req)
                            .send_and_await_response(5)??;
                    }
                    if let Some(groq_key) = &state.config.groq_key {
                        let req = serde_json::to_vec(
                            &llm_interface::openai::LLMRequest::RegisterGroqApiKey(
                                RegisterApiKeyRequest {
                                    api_key: groq_key.clone(),
                                },
                            ),
                        )?;
                        let _ = Request::new()
                            .target(addr.clone())
                            .body(req)
                            .send_and_await_response(5)??;
                    }
                }
                Pkg::STT => {
                    if let Some(openai_key) = &state.config.openai_key {
                        let req =
                            serde_json::to_vec(&STTRequest::RegisterApiKey(openai_key.clone()))?;
                        let _ = Request::new()
                            .target(addr.clone())
                            .body(req)
                            .send_and_await_response(5)??;
                    }
                }
                Pkg::Telegram => {
                    if let Some(telegram_key) = &state.config.telegram_key {
                        let init = TgInitialize {
                            token: telegram_key.clone(),
                            params: None,
                        };
                        let req = serde_json::to_vec(&TgRequest::RegisterApiKey(init))?;
                        let _ = Request::new()
                            .target(addr.clone())
                            .body(req)
                            .send_and_await_response(5)??;
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
    Ok(())
}

fn handle_message(
    our: &Address,
    state: &mut Option<State>,
    pkgs: &HashMap<Pkg, Address>,
) -> anyhow::Result<()> {
    println!("handle message");
    let message = await_message()?;
    if message.source().node != our.node {
        return Ok(());
    }
    println!("message source: {:?}", message.source());
    match message.source().process.to_string().as_str() {
        "http_server:distro:sys" | "http_client:distro:sys" => {
            handle_http_message(&our, &message, state, pkgs)
        }
        _ => Ok(()),
    }
}

const ICON: &str = include_str!("icon");
const NOTES_PATH: &str = "/command_center:appattacc.os/files/Obsidian Vault";
call_init!(init);
fn init(our: Address) {
    let _ = http::serve_ui(
        &our,
        "ui",
        true,
        false,
        vec!["/", "/submit_config", "/status", "/notes"],
    );

    let mut state = State::fetch();

    // add ourselves to the homepage
    Request::to(("our", "homepage", "homepage", "sys"))
        .body(
            serde_json::json!({
                "Add": {
                    "label": "Command Center",
                    "icon": ICON,
                    "path": "/", // just our root
                }
            })
            .to_string()
            .as_bytes()
            .to_vec(),
        )
        .send()
        .unwrap();

    // calling RegisterApiKey because it calls getUpdates (necessary every time a process is restarted)
    let mut pkgs = HashMap::new();
    pkgs.insert(
        Pkg::LLM,
        Address::new(&our.node, ("openai", "command_center", "appattacc.os")),
    );
    pkgs.insert(
        Pkg::STT,
        Address::new(
            &our.node,
            ("speech_to_text", "command_center", "appattacc.os"),
        ),
    );
    pkgs.insert(
        Pkg::Telegram,
        Address::new(&our.node, ("tg", "command_center", "appattacc.os")),
    );

    match &state.clone() {
        Some(state) => {
            if let Some(telegram_key) = &state.config.telegram_key {
                let init = TgInitialize {
                    token: telegram_key.clone(),
                    params: None,
                };
                let req = serde_json::to_vec(&TgRequest::RegisterApiKey(init));
                let _ = Request::new()
                    .target(pkgs.get(&Pkg::Telegram).unwrap())
                    .body(req.unwrap())
                    .send_and_await_response(5);
            }
        }
        None => {}
    }

    let drive_path: String = create_drive(our.package_id(), "files", Some(5)).unwrap();

    loop {
        match handle_message(&our, &mut state, &pkgs) {
            Ok(_) => {}
            Err(e) => println!("Error: {:?}", e),
        }
    }
}
