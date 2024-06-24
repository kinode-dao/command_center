use std::collections::HashMap;

use kinode_process_lib::{
    await_message, call_init, println, Address, Message, Request, Response,
};
use llm_interface::openai::{
    EmbeddingRequest, LLMRequest as OpenAIRequest, LLMResponse as OpenAIResponse,
};
use vectorbase_interface::{Request as VectorbaseRequest, Response as VectorbaseResponse};

mod structs;
use structs::*;

mod similarity_search;
use similarity_search::similarity_search;

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
        VectorbaseRequest::ListDatabases => list_databases(state),
        VectorbaseRequest::SubmitData {
            database_name,
            values,
        } => submit_data(state, database_name, values),
        VectorbaseRequest::SemanticSearch {
            database_name,
            top_k,
            query,
        } => semantic_search(state, database_name, top_k, query),
    }
}

fn list_databases(state: &State) -> anyhow::Result<()> {
    let database_names: Vec<String> = state.databases.keys().cloned().collect();
    let response = VectorbaseResponse::ListDatabases(database_names);
    let response_body = serde_json::to_vec(&response)?;
    Response::new().body(response_body).send()?;
    Ok(())
}

fn submit_data(
    state: &mut State,
    database_name: String,
    values: Vec<(String, String)>,
) -> anyhow::Result<()> {
    let texts: Vec<String> = values.iter().map(|(_, text)| text.clone()).collect();
    let embedding_request = EmbeddingRequest {
        model: "text-embedding-3-large".to_string(),
        input: texts,
    };
    let openai_request = serde_json::to_vec(&OpenAIRequest::Embedding(embedding_request))?;
    let response = Request::to(LLM_ADDRESS)
        .body(openai_request)
        .send_and_await_response(30)??;
    let OpenAIResponse::Embedding(embedding_response) = serde_json::from_slice(response.body())?
    else {
        return Err(anyhow::anyhow!("Failed to parse embedding response"));
    };
    let embeddings = embedding_response.embeddings;

    let database = state
        .databases
        .entry(database_name)
        .or_insert_with(HashMap::new);

    for (index, (entry_name, text)) in values.into_iter().enumerate() {
        database.insert(
            entry_name,
            Element {
                text,
                embedding: embeddings[index].clone(),
            },
        );
    }
    state.save();

    Response::new()
        .body(serde_json::to_vec(&VectorbaseResponse::SubmitData)?)
        .send()?;

    Ok(())
}

fn semantic_search(
    state: &mut State,
    database_name: String,
    top_k: usize,
    query: String,
) -> anyhow::Result<()> {
    // Vectorize the query input with openai
    let embedding_request = EmbeddingRequest {
        model: "text-embedding-3-large".to_string(),
        input: vec![query.clone()],
    };
    let openai_request = serde_json::to_vec(&OpenAIRequest::Embedding(embedding_request))?;
    let response = Request::to(LLM_ADDRESS)
        .body(openai_request)
        .send_and_await_response(30)??;
    let OpenAIResponse::Embedding(embedding_response) = serde_json::from_slice(response.body())?
    else {
        return Err(anyhow::anyhow!("Failed to parse embedding response"));
    };
    let query_embedding = embedding_response.embeddings[0].clone();

    let Some(vec_database) = state.databases.get(&database_name) else {
        Response::new()
            .body(serde_json::to_vec(&VectorbaseResponse::Error(
                "Database not found".to_string(),
            ))?)
            .send()?;
        return Ok(());
    };
    let top_results = similarity_search(vec_database, &query_embedding, top_k);

    let response = VectorbaseResponse::SemanticSearch(top_results);
    Response::new()
        .body(serde_json::to_vec(&response)?)
        .send()?;
    Ok(())
}

call_init!(init);
fn init(our: Address) {
    println!("Begin: {:?}", our.process.process_name);

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
