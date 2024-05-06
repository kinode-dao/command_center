use kinode_process_lib::{call_init, println, Address, Request};
use serde::Serialize;
use serde_json::Value;

mod spawners;
use spawners::*;

use llm_interface::openai::*;

wit_bindgen::generate!({
    path: "wit",
    world: "process",
});

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

fn register_openai_api_key(openai_address: &Address) -> anyhow::Result<()> {
    let openai_api_key_request = RegisterApiKeyRequest {
        api_key: "sk-proj-HQVWEpmlLcvdOzewWENwT3BlbkFJ5w8vgnW7feohw0TVdaOH".to_string(),
    };
    let request = serialize_without_none(&LLMRequest::RegisterOpenaiApiKey(openai_api_key_request))?;
    let response = Request::new()
        .target(openai_address)
        .body(request)
        .send_and_await_response(30)??;

    println!("Openai register response {:?}", response);

    Ok(())
}

fn register_groq_api_key(address: &Address) -> anyhow::Result<()> {
    let groq_api_key_request = RegisterApiKeyRequest {
        api_key: "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".to_string(),
    };
    let request = serialize_without_none(&LLMRequest::RegisterGroqApiKey(groq_api_key_request))?;
    let response = Request::new()
        .target(address)
        .body(request)
        .send_and_await_response(30)?;

    println!("Groq register response {:?}", response);

    Ok(())
}

fn openai_embedding_request(openai_address: &Address) -> anyhow::Result<()> {
    let request = EmbeddingRequest {
        model: "text-embedding-3-small".to_string(),
        input: "The food was delicious and the waitress was very friendly".to_string(),
    };
    let request = serialize_without_none(&LLMRequest::Embedding(request))?;
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

    let request = serialize_without_none(&LLMRequest::OpenaiChat(request))?;
    let decoded_request = String::from_utf8(request.clone())?;
    println!("Decoded Openai chat request: {}", decoded_request);
    let response = Request::new()
        .target(openai_address)
        .body(request)
        .send_and_await_response(30)?;

    let decoded_response = String::from_utf8(response?.body().to_vec())?;
    println!("Decoded chat response: {}", decoded_response);

    Ok(())
}

fn groq_chat_request(groq_address: &Address) -> anyhow::Result<()> {
    let request = ChatRequestBuilder::default()
        .model("llama3-8b-8192".to_string())
        .messages(vec![MessageBuilder::default()
            .role("user".to_string())
            .content("Hello!".to_string())
            .build()?])
        .build()?;

    let request = serialize_without_none(&LLMRequest::GroqChat(request))?;
    let decoded_request = String::from_utf8(request.clone())?;
    println!("Decoded Groq chat request: {}", decoded_request);
    let response = Request::new()
        .target(groq_address)
        .body(request)
        .send_and_await_response(30)?;

    let decoded_response = String::from_utf8(response?.body().to_vec())?;
    println!("Decoded chat response: {}", decoded_response);

    Ok(())
}

// fn openai_image_request(openai_address: &Address) -> anyhow::Result<()> {
//     // TODO: Zena
//     let request = ChatImageRequestBuilder::default()
//         .model("gtp-4-turbo".to_string())
//         .messages(vec![ChatImageMessageBuilder::default()
//             .role("user".to_string())
//             .content(vec![ChatImageContentBuilder::default()
//                 .content_type("image".to_string())
//                 .image_url(Some(ImageUrl {
//                     url: "https://placekitten.com/200/300".to_string(),
//                 }))
//                 .build()?])
//             .build()?])
//         .build()?;
//     let request = serialize_without_none(&LLMRequest::ChatImage(request))?;
//     println!("Serialized request: {:?}", request);

//     let response = Request::new()
//         .target(openai_address)
//         .body(request)
//         .send_and_await_response(30)?;

//     let decoded_response = String::from_utf8(response?.body().to_vec())?;
//     println!("Decoded chat response: {}", decoded_response);

//     Ok(())
// }

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

    // TODO: Zena: Groq and openai image don't work yet because they're missing the field id. Troubleshoot this. 
    // match openai_image_request(&openai_address) {
    //     Ok(_) => println!("Image request successful"),
    //     Err(e) => println!("Image request failed: {:?}", e),
    // }

    // match register_groq_api_key(&openai_address) {
    //     Ok(_) => println!("Groq api key registered"),
    //     Err(e) => println!("Failed registering groq api key: {:?}", e),
    // }

    // match groq_chat_request(&openai_address) {
    //     Ok(_) => println!("Groq chat request successful"),
    //     Err(e) => println!("Groq chat request failed: {:?}", e),
    // }
}
