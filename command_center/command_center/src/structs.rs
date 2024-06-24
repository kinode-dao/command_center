use kinode_process_lib::{get_state, set_state, Address};
use serde::{Deserialize, Serialize};

#[derive(Debug, Eq, Hash, PartialEq, Clone, Serialize, Deserialize)]
pub enum Pkg {
    LLM,
    STT,
    Telegram,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct State {
    pub our: Address,
    pub config: InitialConfig,
    pub password_hash: String,
}

impl State {
    pub fn new(our: &Address, config: InitialConfig) -> Self {
        State {
            our: our.clone(),
            config,
            password_hash: "".to_string(),
        }
    }

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

#[derive(Serialize, Deserialize, Default, Debug, Clone)]
pub struct InitialConfig {
    pub telegram_key: Option<String>,
    pub openai_key: Option<String>,
    pub groq_key: Option<String>,
}
