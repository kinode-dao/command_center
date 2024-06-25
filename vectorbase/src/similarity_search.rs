use std::collections::HashMap;
use crate::structs::Element;

pub fn cosine_similarity(a: &[f32], b: &[f32]) -> f32 {
    let dot_product: f32 = a.iter().zip(b).map(|(x, y)| x * y).sum();
    let magnitude_a: f32 = a.iter().map(|x| x * x).sum::<f32>().sqrt();
    let magnitude_b: f32 = b.iter().map(|x| x * x).sum::<f32>().sqrt();
    dot_product / (magnitude_a * magnitude_b)
}

pub fn similarity_search(
    database: &HashMap<String, Element>,
    query_embedding: &[f32],
    top_k: usize
) -> Vec<(String, String)> {
    let mut similarities: Vec<(f32, &String, &Element)> = database
        .iter()
        .map(|(key, element)| {
            (cosine_similarity(query_embedding, &element.embedding.as_ref().unwrap()), key, element)
        })
        .collect();

    similarities.sort_by(|a, b| b.0.partial_cmp(&a.0).unwrap_or(std::cmp::Ordering::Equal));

    similarities
        .into_iter()
        .take(top_k)
        .map(|(_, key, element)| (key.clone(), element.text.clone()))
        .collect()
}