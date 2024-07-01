use kinode_process_lib::{get_state, set_state};
use serde::{Deserialize, Serialize};

use crate::rag::structs::State as RAGState;
use crate::vectorbase::structs::State as VectorbaseState;

#[derive(Default, Debug, Clone, Serialize, Deserialize)]
pub struct State {
    pub rag_state: RAGState,
    pub vectorbase_state: VectorbaseState,
}

impl State {
    pub fn fetch() -> Option<State> {
        if let Some(state_bytes) = get_state() {
            bincode::deserialize(&state_bytes).ok()
        } else {
            None
        }
    }

    pub fn save(&self) {
        let serialized_state = bincode::serialize(self).expect("Failed to serialize state");
        set_state(&serialized_state);
    }
}
