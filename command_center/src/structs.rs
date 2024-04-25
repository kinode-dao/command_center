use serde::{Deserialize, Serialize};
use kinode_process_lib::{get_state, set_state, Address};
use crate::tg_api::init_tg_bot;
use serde::Deserializer;
use serde::Serializer;
use crate::tg_api::Api;

#[derive(Debug)]
pub struct State {
    pub our: Address,
    pub config: InitialConfig,
    // Non-serializable fields
    pub tg_api: Api,
    pub tg_worker: Address,
}

impl State {
    pub fn new(our: &Address, config: InitialConfig) -> Self {
        hydrate_state(our, config).expect("Failed to hydrate state")
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

impl Serialize for State {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let serializable_part = (self.our.clone(), &self.config);
        serializable_part.serialize(serializer)
    }
}

impl<'de> Deserialize<'de> for State {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        let (our, config) = Deserialize::deserialize(deserializer)?;
        Ok(hydrate_state(&our, config).expect("Failed to hydrate state"))
    }
}

fn hydrate_state(our: &Address, config: InitialConfig) -> anyhow::Result<State> {
    let Ok((tg_api, tg_worker)) =
        init_tg_bot(our.clone(), &config.telegram_key, None)
    else {
        return Err(anyhow::anyhow!("tg bot couldn't boot."));
    };
    Ok(State {
        our: our.clone(),
        config, 
        tg_api,
        tg_worker,
    })
}

#[derive(Serialize, Deserialize, Default, Debug, Clone)]
pub struct InitialConfig {
    pub telegram_key: String,
    pub openai_key: Option<String>,
}

