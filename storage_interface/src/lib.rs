use serde::{Deserialize, Serialize};
use std::collections::HashMap;


#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Request {
    GetTweets {
        start_time: i64,
        end_time: i64,
    },
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Response {
    GetTweets {
        tweets: GlobalTweetMap,
    },
}


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


