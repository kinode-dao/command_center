use chrono::{DateTime, Utc};
use kinode_process_lib::NodeId;
use kinode_process_lib::{get_state, set_state, Address};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Eq, Hash, PartialEq, Clone, Serialize, Deserialize)]
pub enum Pkg {
    LLM,
    STT,
    Telegram,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct State {
    pub our: Address,
    pub api_keys: ApiKeys,
    pub backup_info: BackupInfo,
}

impl State {
    pub fn new(our: &Address, api_keys: ApiKeys, backup_info: BackupInfo) -> Self {
        State {
            our: our.clone(),
            api_keys,
            backup_info
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
pub struct ApiKeys {
    pub telegram_key: Option<String>,
    pub openai_key: Option<String>,
    pub groq_key: Option<String>,
}

#[derive(Serialize, Deserialize, Default, Debug, Clone)]
pub struct BackupInfo {
    // temporarily stores the password hash for encryption and decryption purposes
    pub data_password_hash: Option<String>,
    // used by backup provider to track which nodes it is providing backups to
    pub backups_time_map: HashMap<NodeId, DateTime<Utc>>,
    // when we last backed up our notes
    pub notes_last_backed_up_at: Option<DateTime<Utc>>,
    // our backup provider
    pub notes_backup_provider: Option<NodeId>,
}
