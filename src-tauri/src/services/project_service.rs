use crate::database::models::project::Project;
use crate::models::dbstate::DbState;
use tauri::State;

pub async fn create_project(name: String, description: String, color: String, db: State<'_, DbState>) -> Result<(), String> {
    let pool = &db.pool;

    sqlx::query!(
        "INSERT INTO projects (name, description, color) VALUES (?, ?, ?)",
        name,
        description,
        color
    ).execute(pool)
        .await
        .map_err(|e| e.to_string())?;

    Ok(())
}

pub async fn get_projects(db: State<'_, DbState>) -> Result<Vec<Project>, sqlx::Error> {
    let pool = &db.pool;

    let projects = sqlx::query_as!(
        Project,
        "SELECT id, name, description, color FROM projects"
    )
        .fetch_all(pool)
        .await;

    projects
}

pub async fn delete_project(id: i64, db: State<'_, DbState>) -> Result<(), String> {
    let pool = &db.pool;

    sqlx::query!(
        "DELETE FROM projects WHERE id = ?",
        id
    ).execute(pool)
        .await
        .map_err(|e| e.to_string())?;
    
    Ok(())
}