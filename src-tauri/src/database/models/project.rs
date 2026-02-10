#[derive(Debug, serde::Serialize)] 
pub struct Project {
    pub id: i64,
    pub name: String,
    pub description: Option<String>,
    pub color: String,
}