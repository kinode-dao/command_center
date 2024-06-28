use crate::structs::State;
use kinode_process_lib::{Request, Response};
use vectorbase_interface::rag::{Request as RAGRequest, Response as RAGResponse, RAGType};


pub fn handle_rag_request(state: &mut State, request: RAGRequest) -> anyhow::Result<()> {
    match request {
        RAGRequest::RAG { prompt, rag_type } => {
            generate_rag_response(state, prompt, rag_type)
        }
        // Add other RAG request types as needed
    }
}

fn generate_rag_response(
    _state: &mut State,
    _prompt: String,
    _rag_type: RAGType,
) -> anyhow::Result<()> {
    // TODO:
    let _response: RAGResponse;
    Ok(())
}