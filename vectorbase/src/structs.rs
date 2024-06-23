use kinode_process_lib::{get_state, set_state, Address};
use serde::{Deserialize, Serialize};
use std::collections::BTreeSet;
use std::collections::HashMap;

#[derive(Default, Debug, Clone, Serialize, Deserialize)]
pub struct State {
    pub databases: HashMap<String, BTreeSet<Element>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Element {
    pub text: String,
    pub embedding: Option<Vec<f32>>,
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