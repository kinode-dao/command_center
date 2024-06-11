use kinode_process_lib::{get_state, set_state, Address};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

pub type GlobalTweetMap = HashMap<String, TweetData>;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TweetData {
    pub content: String,
    pub photo: Option<String>,
    pub likes: Option<i32>,
    pub date: Option<i64>,
    pub comments: Option<i32>,
    pub retweets: Option<i32>,
    pub views: Option<i32>,
    pub user_likes_tweet: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct State {
    pub our: Address,
    pub tweets: GlobalTweetMap,
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