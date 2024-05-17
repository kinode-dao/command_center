use kinode_process_lib::{
    await_message, call_init, println, Address, Message, get_blob, Request
};
use frankenstein::{Message as TgMessage, UpdateContent, ChatId, SendMessageParams};

use frankenstein::GetFileParams;
use llm_interface::openai::*;
use stt_interface::STTRequest;
use stt_interface::STTResponse;
use telegram_interface::*;

pub const TG_ADDRESS: (&str, &str, &str, &str) = ("our", "tg", "command_center", "appattacc.os");
pub const LLM_ADDRESS: (&str, &str, &str, &str) =
    ("our", "openai", "command_center", "appattacc.os");
pub const STT_ADDRESS: (&str, &str, &str, &str) =
    ("our", "speech_to_text", "command_center", "appattacc.os");

wit_bindgen::generate!({
    path: "wit",
    world: "process",
});

fn handle_message(
    our: &Address,
) -> anyhow::Result<()> {
    let message = await_message()?;
    if message.source().node != our.node {
        return Ok(());
    }
    handle_telegram_message(&message)
}

pub fn handle_telegram_message(message: &Message) -> anyhow::Result<()> {
    let Some(msg) = get_last_tg_msg(&message) else {
        return Ok(());
    };
    let id = msg.chat.id;
    let mut text = msg.text.clone().unwrap_or_default();
    if let Some(voice) = msg.voice.clone() {
        let audio = get_file(&voice.file_id)?;
        text += &get_text(audio)?;
    }
    let answer = get_groq_answer(&text)?;
    let _message = send_bot_message(&answer, id);
    Ok(())
}

fn send_bot_message(text: &str, id: i64) -> anyhow::Result<TgMessage> {
    let params = SendMessageParams::builder()
        .chat_id(ChatId::Integer(id)) 
        .text(text)
        .build();
    let send_message_request = serde_json::to_vec(&TgRequest::SendMessage(params))?;
    let response = Request::to(TG_ADDRESS)
        .body(send_message_request)
        .send_and_await_response(30)??;
    let TgResponse::SendMessage(message) = serde_json::from_slice(response.body())? else {
        return Err(anyhow::anyhow!("Failed to send message"));
    };
    Ok(message)
}

fn get_groq_answer(text: &str) -> anyhow::Result<String> {
    let request = ChatRequestBuilder::default()
        .model("llama3-8b-8192".to_string())
        .messages(vec![MessageBuilder::default()
            .role("user".to_string())
            .content(text.to_string())
            .build()?])
        .build()?;
    let request = serde_json::to_vec(&LLMRequest::GroqChat(request))?;
    let response = Request::to(LLM_ADDRESS)
        .body(request)
        .send_and_await_response(30)??;
    let LLMResponse::Chat(chat) = serde_json::from_slice(response.body())? else {
        return Err(anyhow::anyhow!("Failed to parse LLM response"));
    };
    Ok(chat.choices[0].message.content.clone())
}

fn get_text(audio: Vec<u8>) -> anyhow::Result<String> {
    let stt_request = serde_json::to_vec(&STTRequest::OpenaiTranscribe(audio))?;
    let response = Request::to(STT_ADDRESS)
        .body(stt_request)
        .send_and_await_response(3)??;
    let STTResponse::OpenaiTranscribed(text) = serde_json::from_slice(response.body())? else {
        return Err(anyhow::anyhow!("Failed to parse STT response"));
    };
    Ok(text)
}

fn get_file(file_id: &str) -> anyhow::Result<Vec<u8>> {
    let get_file_params = GetFileParams::builder().file_id(file_id).build();
    let tg_request = serde_json::to_vec(&TgRequest::GetFile(get_file_params))?;
    let _ = Request::to(TG_ADDRESS)
        .body(tg_request)
        .send_and_await_response(10)??; 
    if let Some(blob) = get_blob() {
        return Ok(blob.bytes);
    }
    Err(anyhow::anyhow!("Failed to get file"))
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

pub fn subscribe() -> anyhow::Result<()> {
    let subscribe_request = serde_json::to_vec(&TgRequest::Subscribe)?;
    let result = Request::to(TG_ADDRESS)
        .body(subscribe_request)
        .send_and_await_response(3)??;
    let TgResponse::Ok = serde_json::from_slice::<TgResponse>(result.body())? else {
        return Err(anyhow::anyhow!("Failed to parse subscription response"));
    };
    println!("Subscribed to telegram");
    Ok(())
}

call_init!(init);
fn init(our: Address) {
    let _ = subscribe();

    loop {
        match handle_message(&our) {
            Ok(_) => {}
            Err(e) => println!("Error: {:?}", e),
        }
    }
}

// TODO: Requires context manager
// TODO: Make stuff async
