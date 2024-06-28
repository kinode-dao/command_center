use kinode_process_lib::{await_message, call_init, println, Address, Message, Request, Response};
use llm_interface::openai::{
    EmbeddingRequest, LLMRequest as OpenAIRequest, LLMResponse as OpenAIResponse,
};
use vectorbase_interface::rag::{Request as RAGRequest, Response as RAGResponse};
use vectorbase_interface::vectorbase::{
    Request as VectorbaseRequest, Response as VectorbaseResponse,
};

mod structs;
use structs::*;

mod vectorbase;
use vectorbase::*;

mod rag;
use rag::*;

mod prompts;

wit_bindgen::generate!({
    path: "target/wit",
    world: "process-v0",
});

pub const LLM_ADDRESS: (&str, &str, &str, &str) =
    ("our", "openai", "command_center", "appattacc.os");

fn handle_message(our: &Address, state: &mut State) -> anyhow::Result<()> {
    let message = await_message()?;
    if message.source().node != our.node {
        println!("vectorbase: message from wrong node");
        return Ok(());
    }
    match message {
        Message::Request { ref body, .. } => handle_internal_request(state, body),
        Message::Response { .. } => Ok(()),
    }
}

fn handle_internal_request(state: &mut State, body: &[u8]) -> anyhow::Result<()> {
    if let Ok(request) = serde_json::from_slice::<VectorbaseRequest>(body) {
        return handle_vectorbase_request(state, request);
    }
    if let Ok(request) = serde_json::from_slice::<RAGRequest>(body) {
        return handle_rag_request(state, request);
    }
    Err(anyhow::anyhow!("Unknown request type"))
}

call_init!(init);
fn init(our: Address) {
    println!("Begin: {:?}", our.process.process_name);

    let mut state = State::fetch().unwrap_or_default();

    match test_rag_functionality(&mut state) {
        Ok(result) => {
            println!("RAG functionality test passed");
            println!("Test result: {}", result);
        },
        Err(e) => {
            println!("RAG functionality test failed: {:?}", e);
        }
    }

    loop {
        match handle_message(&our, &mut state) {
            Ok(()) => {}
            Err(e) => {
                println!("error: {:?}", e);
            }
        };
    }
}

// TODO: Zena: Maybe we can add some kind of intermittent embedding population?
