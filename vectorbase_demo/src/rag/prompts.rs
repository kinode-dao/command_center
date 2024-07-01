pub fn rag_instruction(initial_prompt: &str, link_index: &str) -> String {
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
        initial_prompt, link_index
    )
}
