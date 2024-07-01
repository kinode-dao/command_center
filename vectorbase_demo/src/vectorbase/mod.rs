use kinode_process_lib::{await_message, call_init, println, Address, Message, Request, Response};
use std::collections::HashMap;
use vectorbase_interface::vectorbase::{
    Request as VectorbaseRequest, Response as VectorbaseResponse,
};
use crate::OpenAIResponse;
use crate::LLM_ADDRESS;
use crate::OpenAIRequest;
use crate::EmbeddingRequest;

pub mod structs;
use structs::{Element, State};

/*
TODO: Zena: Maybe we can add some kind of intermittent embedding population?
This is because if we fill a ton of data and don't generate embeddings, semantic search will be slow.
Something like a 10s loop that checks for unembedded elements.
*/ 

pub fn handle_vectorbase_request(
    state: &mut State,
    request: VectorbaseRequest,
) -> anyhow::Result<()> {
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
    let database = state
        .databases
        .entry(database_name)
        .or_insert_with(HashMap::new);

    for (entry_name, text) in values {
        database.insert(
            entry_name,
            Element {
                text,
                embedding: None,
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
    update_embeddings(state, &database_name)?;
    let query_embedding = get_embeddings(vec![query.clone()])?[0].clone();

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

fn cosine_similarity(a: &[f32], b: &[f32]) -> f32 {
    let dot_product: f32 = a.iter().zip(b).map(|(x, y)| x * y).sum();
    let magnitude_a: f32 = a.iter().map(|x| x * x).sum::<f32>().sqrt();
    let magnitude_b: f32 = b.iter().map(|x| x * x).sum::<f32>().sqrt();
    dot_product / (magnitude_a * magnitude_b)
}

fn similarity_search(
    database: &HashMap<String, Element>,
    query_embedding: &[f32],
    top_k: usize,
) -> Vec<(String, String)> {
    let mut similarities: Vec<(f32, &String, &Element)> = database
        .iter()
        .map(|(key, element)| {
            (
                cosine_similarity(query_embedding, &element.embedding.as_ref().unwrap()),
                key,
                element,
            )
        })
        .collect();

    similarities.sort_by(|a, b| b.0.partial_cmp(&a.0).unwrap_or(std::cmp::Ordering::Equal));

    similarities
        .into_iter()
        .take(top_k)
        .map(|(_, key, element)| (key.clone(), element.text.clone()))
        .collect()
}

fn get_embeddings(texts: Vec<String>) -> anyhow::Result<Vec<Vec<f32>>> {
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
    Ok(embedding_response.embeddings)
}

fn update_embeddings(state: &mut State, database_name: &str) -> anyhow::Result<()> {
    let Some(database) = state.databases.get_mut(database_name) else {
        return Err(anyhow::anyhow!("Database not found"));
    };

    let mut texts_to_embed = Vec::new();
    let mut elements_to_update = Vec::new();

    for (entry_name, element) in database.iter_mut() {
        if element.embedding.is_none() {
            texts_to_embed.push(element.text.clone());
            elements_to_update.push(entry_name.clone());
        }
    }

    if !texts_to_embed.is_empty() {
        let embeddings = get_embeddings(texts_to_embed)?;

        for (entry_name, embedding) in elements_to_update.into_iter().zip(embeddings) {
            if let Some(element) = database.get_mut(&entry_name) {
                element.embedding = Some(embedding);
            }
        }

        state.save();
    }

    Ok(())
}
