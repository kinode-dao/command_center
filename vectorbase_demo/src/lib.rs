use kinode_process_lib::{await_message, call_init, println, Address, Message};
use llm_interface::openai::{
    EmbeddingRequest, LLMRequest as OpenAIRequest, LLMResponse as OpenAIResponse,
};

mod structs;
use structs::{State, Req};

mod vectorbase;
use vectorbase::*;

mod rag;
use rag::*;


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
    match serde_json::from_slice::<Req>(body)? {
        Req::VectorbaseRequest(request) => handle_vectorbase_request(&mut state.vectorbase_state, request),
        Req::RAGRequest(request) => handle_rag_request(&mut state.rag_state, request),
    }
}

call_init!(init);
fn init(our: Address) {
    println!("Begin: {:?}", our.process.process_name);

    let mut state = State::fetch().unwrap_or_default();
    rag::init(&mut state.rag_state).unwrap();

    loop {
        match handle_message(&our, &mut state) {
            Ok(()) => {}
            Err(e) => {
                println!("error: {:?}", e);
            }
        };
    }
}

