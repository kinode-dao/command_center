use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Request {
    ListDatabases,
    SubmitData {
        database_name: String,
        values: Vec<(String, String)>,
    },
    SemanticSearch {
        database_name: String,
        top_k: usize,
        query: String,
    },
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Response {
    ListDatabases(Vec<String>),
    SubmitData,
    SemanticSearch(Vec<(String, String)>),
    Error(String),
}
