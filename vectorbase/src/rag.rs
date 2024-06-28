use crate::structs::State;
use kinode_process_lib::{Request, Response, http, println};
use vectorbase_interface::rag::{Request as RAGRequest, Response as RAGResponse, RAGType};
use anyhow::Result;
use url::Url;
use std::collections::HashMap;
use llm_interface::openai::{LLMRequest, LLMResponse, ClaudeChatRequest, ClaudeChatRequestBuilder, Message, MessageBuilder};


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
        }
        // Add other RAG request types as needed
    }
}

pub fn generate_rag_response(
    state: &mut State,
    prompt: String,
    rag_type: RAGType,
) -> Result<String> {
    println!("Starting generate_rag_response");

    // Ensure it's naive RAG type (ignore other types for now)
    match rag_type {
        RAGType::Naive => {},
        RAGType::Vector => return Err(anyhow::anyhow!("Vector RAG type is not yet implemented")),
        _ => return Err(anyhow::anyhow!("Unsupported RAG type")),
    }

    println!("RAG type check passed");

    let modified_prompt = rag_instruction(&prompt);
    println!("Modified prompt created");

    // Prompt the LLM (Claude)
    let claude_request = ClaudeChatRequestBuilder::default()
        .model("claude-3-opus-20240229".to_string())
        .messages(vec![MessageBuilder::default()
            .role("user".to_string())
            .content(modified_prompt)
            .build()?])
        .max_tokens(Some(1000))
        .build()?;

    println!("Claude request built");

    let llm_request = serde_json::to_vec(&LLMRequest::ClaudeChat(claude_request))?;
    println!("LLM request serialized");

    let response = Request::to(crate::LLM_ADDRESS)
        .body(llm_request)
        .send_and_await_response(30)??;

    println!("LLM response received");

    let LLMResponse::ClaudeChat(chat) = serde_json::from_slice(response.body())? else {
        println!("Failed to parse LLM response");
        return Err(anyhow::anyhow!("Failed to parse LLM response"));
    };

    println!("Claude answer is {:?}", chat);

    let content = chat.content.first()
        .map(|content| content.text.clone())
        .unwrap_or_default();

    println!("Content extracted from LLM response");

    // Parse the content into a list of strings
    let urls: Vec<String> = serde_json::from_str(&content)
        .unwrap_or_else(|_| {
            println!("Failed to parse content as JSON, using empty vector");
            Vec::new()
        });

    println!("URLs parsed: {} found", urls.len());
    println!("Urls are {:?}", urls);

    // Fetch content for each URL
    let mut combined_content = String::new();
    for (index, url) in urls.iter().enumerate() {
        println!("Fetching content for URL {}/{}: {}", index + 1, urls.len(), url);
        match fetch_github_content(url) {
            Ok(content) => {
                combined_content.push_str(&format!("File: {}\n\n{}\n\n", url, content));
                println!("Content fetched successfully for {}", url);
            }
            Err(e) => {
                println!("Error fetching content from {}: {}", url, e);
            }
        }
    }
    println!("Combined content is {:?}", combined_content);
    Ok("temp".to_string())

    // // Create and send the RAG response
    // let rag_response = RAGResponse::RAG(combined_content.clone());
    // println!("RAG response created");

    // let response = Response::new()
    //     .body(serde_json::to_vec(&rag_response)?)
    //     .send();

    // println!("RAG response sent");

    // Ok(combined_content)
}

fn fetch_github_content(url: &str) -> Result<String> {
    println!("Starting fetch_github_content for URL: {}", url);

    // Convert GitHub URL to raw content URL
    let raw_url = url.replace("github.com", "raw.githubusercontent.com")
                     .replace("/blob/", "/");

    let url = Url::parse(&raw_url)?;
    println!("Raw URL parsed successfully: {}", raw_url);

    let response = http::send_request_await_response(
        http::Method::GET,
        url,
        Some(std::collections::HashMap::from([
            ("Accept".to_string(), "application/vnd.github.v3.raw".to_string()),
        ])),
        30,   // timeout in seconds
        Vec::new(), // empty body for GET request
    )?;

    println!("HTTP request sent, status code: {}", response.status());

    if response.status() != 200 {
        println!("HTTP request failed with status: {}", response.status());
        return Err(anyhow::anyhow!("Failed to fetch content: HTTP {}", response.status()));
    }

    let content = String::from_utf8(response.body().to_vec())
        .map_err(|e| {
            println!("Failed to parse response as UTF-8: {}", e);
            anyhow::anyhow!("Failed to parse response as UTF-8: {}", e)
        })?;

    println!("Content fetched and parsed successfully, length: {} characters", content.len());

    Ok(content)
}

pub fn test_rag_functionality(state: &mut State) -> anyhow::Result<String> {
    let test_prompt = "How do I use the Telegram interface in Kinode?".to_string();
    let test_rag_type = RAGType::Naive;

    println!("Testing RAG functionality");
    generate_rag_response(state, test_prompt, test_rag_type)
}