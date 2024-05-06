// use frankenstein::{Message as TgMessage, TelegramApi, UpdateContent, Voice};

use kinode_process_lib::{call_init, println, Address, Request};
use serde::Serialize;
// use openai_whisper::{openai_whisper_request, openai_whisper_response};

// mod structs;
// use structs::*;

// mod tg_api;
// use crate::tg_api::TgResponse;

mod spawners;
use spawners::*;

use llm_interface::openai::*;

wit_bindgen::generate!({
    path: "wit",
    world: "process",
});

fn register_openai_api_key(openai_address: &Address) -> anyhow::Result<()> {
    let openai_api_key_request = RegisterApiKeyRequest {
        api_key: "sk-proj-HQVWEpmlLcvdOzewWENwT3BlbkFJ5w8vgnW7feohw0TVdaOH".to_string(),
    };
    let request = serde_json::to_vec(&LLMRequest::RegisterOpenaiApiKey(openai_api_key_request))?;
    let response = Request::new()
        .target(openai_address)
        .body(request)
        .send_and_await_response(30)??;

    println!("Openai register response {:?}", response);

    Ok(())
}

fn openai_embedding_request(openai_address: &Address) -> anyhow::Result<()> {
    let request = EmbeddingRequest {
        model: "text-embedding-3-small".to_string(),
        input: "The food was delicious and the waitress was very friendly".to_string(),
    };
    let request = serde_json::to_vec(&LLMRequest::Embedding(request))?;
    let response = Request::new()
        .target(openai_address)
        .body(request)
        .send_and_await_response(30)?;

    let decoded_response = String::from_utf8(response?.body().to_vec())?;
    println!("Decoded embedding response: {}", decoded_response);

    Ok(())
}

fn openai_chat_request(openai_address: &Address) -> anyhow::Result<()> {
    let request = ChatRequestBuilder::default()
        .model("gpt-3.5-turbo".to_string())
        .messages(vec![MessageBuilder::default()
            .role("user".to_string())
            .content("Hello!".to_string())
            .build()?])
        .build()?;
    println!("Request: {:?}", request);

    let request = serde_json::to_vec(&LLMRequest::OpenaiChat(request))?;
    println!("Serialized request: {:?}", request);
    let response = Request::new()
        .target(openai_address)
        .body(request)
        .send_and_await_response(30)?;

    let decoded_response = String::from_utf8(response?.body().to_vec())?;
    println!("Decoded chat response: {}", decoded_response);

    Ok(())
}

call_init!(init);
fn init(our: Address) {
    println!("Start");
    let Ok(openai_address) = spawn_openai_pkg(our) else {
        println!("Failed spawning open ai pkg");
        return;
    };
    println!("Openai pkg spawned, with address {:?}", openai_address);

    match register_openai_api_key(&openai_address) {
        Ok(_) => println!("Openai api key registered"),
        Err(e) => println!("Failed registering openai api key: {:?}", e),
    }

    match openai_embedding_request(&openai_address) {
        Ok(_) => println!("Embedding request successful"),
        Err(e) => println!("Embedding request failed: {:?}", e),
    }

    match openai_chat_request(&openai_address) {
        Ok(_) => println!("Chat request successful"),
        Err(e) => println!("Chat request failed: {:?}", e),
    }

    // Openai chat

    // Openai image

    // Register groq api key

    // Groq chat
}
