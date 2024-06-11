use kinode_process_lib::{await_message, call_init, get_blob, http, println, Address, Message};
use std::collections::HashMap;
use std::time::{SystemTime, UNIX_EPOCH};
use chrono::{DateTime, Utc, TimeZone};

mod structs;
use structs::*;

wit_bindgen::generate!({
    path: "wit",
    world: "process",
});

pub fn default_headers() -> HashMap<String, String> {
    HashMap::from([
        ("Content-Type".to_string(), "application/json".to_string()),
        ("Access-Control-Allow-Origin".to_string(), "*".to_string()),
        (
            "Access-Control-Allow-Headers".to_string(),
            "Content-Type".to_string(),
        ),
        (
            "Access-Control-Allow-Methods".to_string(),
            "GET, POST, OPTIONS".to_string(),
        ),
    ])
}

fn handle_message(our: &Address, state: &mut Option<State>) -> anyhow::Result<()> {
    println!("Awaiting.");
    let message = await_message()?;
    if message.source().node != our.node {
        return Ok(());
    }
    match message.source().process.to_string().as_str() {
        "http_server:distro:sys" | "http_client:distro:sys" => {
            handle_http_message(&our, &message, state)
        }
        _ => Ok(()),
    }
}

fn handle_http_message(
    our: &Address,
    message: &Message,
    state: &mut Option<State>,
) -> anyhow::Result<()> {
    match message {
        Message::Request { ref body, .. } => handle_http_request(our, state, body),
        Message::Response { .. } => Ok(()),
    }
}

fn handle_http_request(
    our: &Address,
    state: &mut Option<State>,
    body: &[u8],
) -> anyhow::Result<()> {
    let http_request = http::HttpServerRequest::from_bytes(body)?
        .request()
        .ok_or_else(|| anyhow::anyhow!("Failed to parse http request"))?;
    match http_request.method().ok() {
        Some(http::Method::OPTIONS) => {
            let _ = http::send_response(http::StatusCode::OK, Some(default_headers()), Vec::new());
            return Ok(());
        }
        Some(http::Method::POST) => {
            let path = http_request.path()?;
            let bytes = get_blob()
                .ok_or_else(|| anyhow::anyhow!("Failed to get blob"))?
                .bytes;
            match path.as_str() {
                "/populate" => populate_tweets(our, state, &bytes),
                _ => Ok(()),
            }
        }
        _ => Err(anyhow::anyhow!("Method not allowed")),
    }
}

fn populate_tweets(our: &Address, state: &mut Option<State>, bytes: &[u8]) -> anyhow::Result<()> {
    let tweets = serde_json::from_slice::<GlobalTweetMap>(bytes)?;
    if let Some(state) = state {
        for (key, value) in tweets {
            if !state.tweets.contains_key(&key) {
                state.tweets.insert(key, value);
            }
        }
        state.save();
    } else {
        let inner_state = State {
            our: our.clone(),
            tweets: tweets.clone(),
        };
        inner_state.save();
        *state = Some(inner_state);
    }

    http::send_response(
        http::StatusCode::OK,
        Some(default_headers()),
        b"{\"message\": \"success\"}".to_vec(),
    );
    Ok(())
}

fn is_leap_year(year: u64) -> bool {
    (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)
}

fn days_in_month(month: u64, year: u64) -> u64 {
    match month {
        1 | 3 | 5 | 7 | 8 | 10 | 12 => 31,
        4 | 6 | 9 | 11 => 30,
        2 if is_leap_year(year) => 29,
        2 => 28,
        _ => panic!("Invalid month"),
    }
}

fn unix_to_date(unix_timestamp: u64) -> String {
    let mut seconds = unix_timestamp;
    let mut minutes = seconds / 60;
    seconds %= 60;
    let mut hours = minutes / 60;
    minutes %= 60;
    let mut days = hours / 24;
    hours %= 24;

    let mut year = 1970;
    while days >= 365 + if is_leap_year(year) { 1 } else { 0 } {
        days -= 365 + if is_leap_year(year) { 1 } else { 0 };
        year += 1;
    }

    let mut month = 1;
    while days >= days_in_month(month, year) {
        days -= days_in_month(month, year);
        month += 1;
    }
    let day = days + 1; // Day of month starts at 1

    format!("{:04}-{:02}-{:02}T{:02}:{:02}:{:02}Z", year, month, day, hours, minutes, seconds)
}

fn date_to_unix(date_str: &str) -> u64 {
    let parts: Vec<&str> = date_str.split(['-', 'T', ':', 'Z'].as_ref()).collect();
    let year: u64 = parts[0].parse().unwrap();
    let month: u64 = parts[1].parse().unwrap();
    let day: u64 = parts[2].parse().unwrap();
    let hour: u64 = parts[3].parse().unwrap();
    let minute: u64 = parts[4].parse().unwrap();
    let second: u64 = parts[5].parse().unwrap();

    let mut seconds_since_epoch = 0;
    for y in 1970..year {
        seconds_since_epoch += 365 * 86400 + if is_leap_year(y) { 86400 } else { 0 };
    }

    for m in 1..month {
        seconds_since_epoch += days_in_month(m, year) * 86400;
    }

    seconds_since_epoch += (day - 1) * 86400;
    seconds_since_epoch += hour * 3600;
    seconds_since_epoch += minute * 60;
    seconds_since_epoch += second;

    seconds_since_epoch
}

call_init!(init);
fn init(our: Address) {
    let now = SystemTime::now().duration_since(UNIX_EPOCH).unwrap();
    let now_as_u64 = now.as_secs();
    println!("Now is {}", now_as_u64);
    let datetime: DateTime<Utc> = Utc.timestamp(now_as_u64 as i64, 0);
    println!("Datetime is {:?}", datetime);
    let unix_time = datetime.timestamp() as u64;
    println!("Unix time is {}", unix_time);


    println!("storage: init");

    if let Err(e) = http::serve_index_html(&our, "ui", false, true, vec!["/", "/populate"]) {
        panic!("Error binding https paths: {:?}", e);
    }

    let mut state = State::fetch();
    loop {
        match handle_message(&our, &mut state) {
            Ok(_) => {}
            Err(e) => println!("Error: {:?}", e),
        }
    }
}
