// Note: This is a temp file until we have a great way to message processes that we haven't spawned ourselves. This will just have a custom handle_request.
// I know it's disgusting, that's why it's in a temp file.
// Fast >>>>> Robust in this case.
// Expand TG properly to work without this
use crate::Pkg;
use crate::State;
use frankenstein::{Message as TgMessage, SendMessageParams, TelegramApi, UpdateContent, Voice, ChatId};
use kinode_process_lib::{
    get_blob, http, http::send_request_await_response, http::Method, println, Address, Message,
    ProcessId, Request,
};
use serde_json::json;
use std::collections::HashMap;
use serde::Serialize;
use serde_json::Value;
use std::{path::PathBuf, str::FromStr};

use llm_interface::openai::*;
use stt_interface::*;
use telegram_interface::*;

// TODO: Zena: For demo purposes. 
const ID: i64 = 6808906235;

pub fn serialize_without_none<T: Serialize>(input: &T) -> serde_json::Result<Vec<u8>> {
    let value = serde_json::to_value(input)?;
    let cleaned_value = remove_none(&value);
    serde_json::to_vec(&cleaned_value)
}

fn remove_none(value: &Value) -> Value {
    match value {
        Value::Object(map) => {
            let mut cleaned_map = serde_json::Map::new();
            for (k, v) in map {
                let cleaned_value = remove_none(v);
                if !cleaned_value.is_null() {
                    cleaned_map.insert(k.clone(), cleaned_value);
                }
            }
            Value::Object(cleaned_map)
        },
        Value::Array(vec) => {
            Value::Array(vec.iter().map(remove_none).filter(|v| !v.is_null()).collect())
        },
        _ => value.clone(),
    }
}

pub fn one_shot(pkgs: &HashMap<Pkg, Address>) -> anyhow::Result<()> {
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
    let api = Api {
        api_url: format!(
            "https://api.telegram.org/bot{}",
            state.config.telegram_key.clone().unwrap()
        ),
    };

    let get_file_params = frankenstein::GetFileParams::builder()
        .file_id(voice.file_id)
        .build();
    let file_path = api.get_file(&get_file_params).ok()?.result.file_path?;
    println!("File path: {:?}", file_path);
    let download_url = format!(
        "https://api.telegram.org/file/bot{}/{}",
        state.config.telegram_key.clone().unwrap(),
        file_path // TODO: Zena: All this should die and go toward the telegram process!
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
    println!("Sending request to get file to http_client");
    Request::new()
        .target(Address::new(
            "our",
            ProcessId::new(Some("http_client"), "distro", "sys"),
        ))
        .body(body_bytes)
        .context(vec![0])
        .expects_response(30)
        .send()
        .ok()
}

pub fn handle_telegram_message(
    message: &Message,
    state: &mut Option<State>,
    pkgs: &HashMap<Pkg, Address>,
) -> anyhow::Result<()> {
    let tg_address = pkgs.get(&Pkg::Telegram).unwrap();
    let state = state
        .as_ref()
        .ok_or_else(|| anyhow::anyhow!("State not initialized"))?;
    if *message.source() != *tg_address {
        return Ok(());
    }

    let Some(msg) = get_last_tg_msg(&message) else {
        return Ok(());
    };
    let text = msg.text.clone().unwrap_or_default();
    println!("Received text: {:?}", text);
    println!("Id is {:?}", msg.chat.id);

    if let Some(voice) = msg.voice.clone() {
        println!("Received voice message");
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
        _ => {
            return None;
        }
    };
    Some(msg.clone())
}

pub fn handle_http_response(
    message: &Message,
    state: &mut Option<State>,
    pkgs: &HashMap<Pkg, Address>,
) -> Option<()> {
    let context = message.context()?;
    let _state = state.as_ref()?;

    match context[0] {
        0 => {
            println!("Received response from telegram file");
            let bytes = get_blob()?.bytes;
            let request = serde_json::to_vec(&STTRequest::OpenaiTranscribe(bytes)).ok()?;

            let response = Request::new()
                .target(pkgs.get(&Pkg::STT).unwrap())
                .body(request)
                .send_and_await_response(30)
                .ok()?
                .ok()?;
            let response = serde_json::from_slice::<STTResponse>(&response.body()).ok()?;
            println!("Transcribed text: {:?}", response);
            match response {
                STTResponse::OpenaiTranscribed(text) => {
                    let request = ChatRequestBuilder::default()
                        .model("llama3-8b-8192".to_string())
                        .messages(vec![MessageBuilder::default()
                            .role("user".to_string())
                            .content(text)
                            .build().ok()?])
                        .build().ok()?;

                    let request = serialize_without_none(&LLMRequest::GroqChat(request)).ok()?;

                    let response = Request::new()
                        .target(pkgs.get(&Pkg::LLM).unwrap())
                        .body(request)
                        .send_and_await_response(30).ok()?.ok()?;

                    let parsed_response = serde_json::from_slice::<LLMResponse>(&response.body()).ok()?;
                    match parsed_response {
                        LLMResponse::Chat(chat) => {
                            let response = chat.choices[0].message.content.clone();

                            // Send the message
                            let params = SendMessageParams::builder()
                                .chat_id(ChatId::Integer(ID))
                                .text(response)
                                .build();

                            let api = Api {
                                api_url: format!(
                                    "https://api.telegram.org/bot{}",
                                    _state.config.telegram_key.clone().unwrap()
                                ),
                            };
                            let _ = api.send_message(&params);
                        }
                        _ => (),
                    }


                }
                _ => (),
            }
        }
        _ => {}
    }
    Some(())
}

struct Api {
    api_url: String,
}

impl TelegramApi for Api {
    type Error = anyhow::Error;

    fn request<T1: serde::ser::Serialize, T2: serde::de::DeserializeOwned>(
        &self,
        method: &str,
        params: Option<T1>,
    ) -> Result<T2, anyhow::Error> {
        let url = format!("{}/{method}", self.api_url);
        let url = url::Url::from_str(&url)?;

        // content-type application/json
        let headers: HashMap<String, String> =
            HashMap::from_iter([("Content-Type".into(), "application/json".into())]);

        let body = if let Some(ref params) = params {
            serde_json::to_vec(params)?
        } else {
            Vec::new()
        };
        let res = send_request_await_response(Method::GET, url, Some(headers), 30, body)?;

        let deserialized: T2 = serde_json::from_slice(&res.body())
            .map_err(|e| anyhow::anyhow!("Failed to deserialize response body: {}", e))?;

        Ok(deserialized)
    }

    fn request_with_form_data<T1: serde::ser::Serialize, T2: serde::de::DeserializeOwned>(
        &self,
        _method: &str,
        _params: T1,
        _files: Vec<(&str, PathBuf)>,
    ) -> Result<T2, anyhow::Error> {
        return Err(anyhow::anyhow!(
            "tgbot doesn't support multipart uploads (yet!)"
        ));
    }
}
