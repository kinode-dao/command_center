// TODO: Maybe add the addresses to interfaces?
pub const INTERFACE_CONTEXT: &str = r#"
These are the addresses: 
```
pub const TG_ADDRESS: (&str, &str, &str, &str) = ("our", "tg", "command_center", "appattacc.os");
pub const LLM_ADDRESS: (&str, &str, &str, &str) =
    ("our", "openai", "command_center", "appattacc.os");
pub const STT_ADDRESS: (&str, &str, &str, &str) =
    ("our", "speech_to_text", "command_center", "appattacc.os");
pub const VECTORBASE_ADDRESS: (&str, &str, &str, &str) =
    ("our", "vectorbase", "command_center", "appattacc.os");
``` 


Speech to text: enter any audio and you will receive the transcript. Registering api keys should be done by command center already. 
https://github.com/kinode-dao/stt/blob/interface/stt_interface/src/lib.rs

LLM: calling large language models or getting embeddings from them: 
https://github.com/kinode-dao/llm/blob/interface/llm_interface/src/lib.rs

Telegram: Subscribing to events from telegram or requesting certain actions from your telegram bot: 
https://github.com/kinode-dao/telegram-bot/blob/zen/interface/telegram_interface/src/lib.rs

Vectorbase: Ability to do RAG (i.e. enriching a prompt) or vector similarity search: 
https://github.com/kinode-dao/command_center/blob/vectorbase_interface/vectorbase_interface/src/lib.rs

"#;

pub fn rag_instruction(initial_prompt: &str) -> String {
    format!(
        r#"
    Given this initial prompt: 
    {}

    And this context: 
    {}

    Provide a list of all the links that you would like to inspect to get better knowledge and context. Pick as many as necessary, but no more. 
    Make sure to stricly answer in the form of a json list of strings. This list is going to get parsed, so any wrong answer, including pre or post amble will ruin it. 
    If no links are relevant, just answer with an empty list. 
    "#,
        initial_prompt, INTERFACE_CONTEXT
    )
}
