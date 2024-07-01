use crate::structs::State;
use anyhow::Result;
use kinode_process_lib::{http, println, Request, Response};
use llm_interface::openai::{
    ClaudeChatRequest, ClaudeChatRequestBuilder, LLMRequest, LLMResponse, Message, MessageBuilder,
};
use std::collections::HashMap;
use url::Url;
use vectorbase_interface::rag::{RAGType, Request as RAGRequest, Response as RAGResponse};

pub mod prompts;
use crate::prompts::{rag_instruction, INTERFACE_CONTEXT};


pub fn handle_rag_request(state: &mut State, request: RAGRequest) -> anyhow::Result<()> {
    match request {
        RAGRequest::RAG { prompt, rag_type } => {
            if let Err(e) = generate_rag_response(state, prompt, rag_type) {
                println!("Error generating RAG response: {:?}", e);
                return Err(e);
            } else {
                Ok(())
            }
        } // Add other RAG request types as needed
    }
}

pub fn generate_rag_response(
    state: &mut State,
    prompt: String,
    rag_type: RAGType,
) -> Result<String> {
    match rag_type {
        RAGType::Naive => {}
        RAGType::Vector => return Err(anyhow::anyhow!("Vector RAG type is not yet implemented")),
        _ => return Err(anyhow::anyhow!("Unsupported RAG type")),
    }

    let modified_prompt = rag_instruction(&prompt);

    let content = call_claude(modified_prompt)?;
    let combined_content = parse_and_fetch_content(&content)?;

    let rag_response = RAGResponse::RAG(combined_content.clone());
    println!("RAG response created");

    let response = Response::new()
        .body(serde_json::to_vec(&rag_response)?)
        .send();

    println!("RAG response sent");

    Ok(combined_content)
}

fn call_claude(prompt: String) -> Result<String> {
    let claude_request = ClaudeChatRequestBuilder::default()
        .model("claude-3-opus-20240229".to_string())
        .messages(vec![MessageBuilder::default()
            .role("user".to_string())
            .content(prompt)
            .build()?])
        .max_tokens(Some(1000))
        .build()?;

    let llm_request = serde_json::to_vec(&LLMRequest::ClaudeChat(claude_request))?;

    let response = Request::to(crate::LLM_ADDRESS)
        .body(llm_request)
        .send_and_await_response(30)??;

    let LLMResponse::ClaudeChat(chat) = serde_json::from_slice(response.body())? else {
        return Err(anyhow::anyhow!("Failed to parse LLM response"));
    };

    chat.content
        .first()
        .map(|content| content.text.clone())
        .ok_or_else(|| anyhow::anyhow!("No content in Claude response"))
}

fn parse_and_fetch_content(content: &str) -> Result<String> {
    let urls: Vec<String> = serde_json::from_str(content).unwrap_or_else(|_| Vec::new());

    let mut combined_content = String::new();
    for url in urls.iter() {
        match fetch_github_content(url) {
            Ok(content) => {
                combined_content.push_str(&format!("File: {}\n\n{}\n\n", url, content));
            }
            Err(_) => {
                // Silently ignore errors
            }
        }
    }

    Ok(combined_content)
}

fn fetch_github_content(url: &str) -> Result<String> {
    // Convert GitHub URL to raw content URL
    let raw_url = url
        .replace("github.com", "raw.githubusercontent.com")
        .replace("/blob/", "/");

    let url = Url::parse(&raw_url)?;

    let response = http::send_request_await_response(
        http::Method::GET,
        url,
        Some(std::collections::HashMap::from([(
            "Accept".to_string(),
            "application/vnd.github.v3.raw".to_string(),
        )])),
        30,         // timeout in seconds
        Vec::new(), // empty body for GET request
    )?;

    if response.status() != 200 {
        return Err(anyhow::anyhow!(
            "Failed to fetch content: HTTP {}",
            response.status()
        ));
    }

    let content = String::from_utf8(response.body().to_vec())?;

    Ok(content)
}

pub fn test_rag_functionality(state: &mut State) -> anyhow::Result<String> {
    let test_prompt = "How do I use the Telegram interface in Kinode?".to_string();
    let test_rag_type = RAGType::Naive;

    generate_rag_response(state, test_prompt, test_rag_type)
}