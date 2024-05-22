use serde::{Deserialize, Serialize};

#[derive(Debug, Eq, Hash, PartialEq, Clone, Serialize, Deserialize)]
pub enum Pkg {
    LLM,
    STT,
    Telegram,
}
