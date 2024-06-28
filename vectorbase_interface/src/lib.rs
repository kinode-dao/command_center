use serde::{Deserialize, Serialize};

pub mod vectorbase {
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
}

pub mod rag {
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub enum Request {
        RAG {prompt: String, rag_type: RAGType},
    }

    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub enum Response {
        RAG(String),
        Error(String),
    }

    pub enum RAGType {
        Naive,
        Vector,
    }
}
