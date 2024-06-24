use std::collections::HashMap;
use std::str::FromStr;

use kinode_process_lib::{
    await_message, call_init, println, Address, Message, ProcessId, Request, Response,
};
use vectorbase_interface::{Request as VectorbaseRequest, Response as VectorbaseResponse};
use llm_interface::openai::{LLMRequest as OpenAIRequest, LLMResponse as OpenAIResponse, EmbeddingRequest};

mod structs;
use structs::*;

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
    let request = serde_json::from_slice::<VectorbaseRequest>(body)?;
    match request {
        VectorbaseRequest::ListDatabases => {
            let database_names: Vec<String> = state.databases.keys().cloned().collect();
            let response = VectorbaseResponse::ListDatabases(database_names);
            let response_body = serde_json::to_vec(&response)?;
            Response::new().body(response_body).send()?;
        }
        // TODO: Zen: Later: Should the values be sent via blob instead of body? 
        VectorbaseRequest::SubmitData {
            database_name,
            values,
        } => {
            let embedding_request = EmbeddingRequest {
                model: "text-embedding-3-large".to_string(),
                input: values,
            };
            let openai_request = OpenAIRequest::Embedding(embedding_request);
            let response = Request::to(LLM_ADDRESS)
                .body(openai_request)
                .send_and_await_response(30)??;
            // TODO: Zena: Entrypoint
            // response.
            let embeddings = response.embeddings;

            state
                .databases
                .entry(database_name)
                .or_insert_with(BTreeSet::new)
                .extend(values.into_iter().enumerate().map(|(index, text)| Element {
                    text,
                    embedding: Some(embeddings[index].clone()),
                }));

            state.save(); 

            Response::new()
                .body(serde_json::to_vec(&VectorbaseResponse::SubmitData)?)
                .send()?;
        }
        VectorbaseRequest::SemanticSearch {
            database_name,
            top_k,
            query,
        } => {},
    }
    Ok(())
}

call_init!(init);
fn init(our: Address) {
    println!("begin");

    let mut state = State::fetch().unwrap_or_default();

    loop {
        match handle_message(&our, &mut state) {
            Ok(()) => {}
            Err(e) => {
                println!("error: {:?}", e);
            }
        };
    }
}
