fn dot_product(a: &Vec<f32>, b: &Vec<f32>) -> f32 {
    a.iter().zip(b.iter()).map(|(x, y)| x * y).sum()
}

fn magnitude(vec: &Vec<f32>) -> f32 {
    vec.iter().map(|x| x.powi(2)).sum::<f32>().sqrt()
}

fn cosine_similarity(a: &Vec<f32>, b: &Vec<f32>) -> f32 {
    dot_product(a, b) / (magnitude(a) * magnitude(b))
}

pub fn similarity_search(
    input_vector: &Vec<f32>,
    vectors: &Vec<Vec<f32>>,
    top_k: usize,
) -> Vec<Vec<f32>> {
    let mut similarities: Vec<(f32, &Vec<f32>)> = vectors
        .iter()
        .map(|v| (cosine_similarity(input_vector, v), v))
        .collect();

    similarities.sort_by(|a, b| b.0.partial_cmp(&a.0).unwrap());

    similarities
        .iter()
        .take(top_k.min(100)) // Capping it at 100 for now
        .map(|(_, v)| (*v).clone())
        .collect()
}
