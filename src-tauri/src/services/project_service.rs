use crate::database::models::project::Project;
use crate::models::dbstate::DbState;
use tauri::State;
use uuid::Uuid;

pub async fn create_project(
    name: String,
    description: String,
    color: String,
    db: State<'_, DbState>,
) -> Result<String, String> {
    let pool = &db.pool;
    let uuid = Uuid::new_v4().to_string();

    sqlx::query!(
        "INSERT INTO projects (id, name, description, color) VALUES (?, ?, ?, ?)",
        uuid,
        name,
        description,
        color
    )
    .execute(pool)
    .await
    .map_err(|e| e.to_string())?;

    Ok(uuid)
}

pub async fn get_projects(db: State<'_, DbState>) -> Result<Vec<Project>, sqlx::Error> {
    let pool = &db.pool;

    let projects = sqlx::query_as!(
        Project,
        r#"
        SELECT 
            id as "id!",           
            name, 
            description,
            color, 
            is_deleted as "is_deleted: i64"
        FROM projects 
        WHERE is_deleted = 0
        "#
    )
    .fetch_all(pool)
    .await;

    projects
}

pub async fn delete_project(id: String, db: State<'_, DbState>) -> Result<(), String> {
    let mut tx = db.pool.begin().await.map_err(|e| e.to_string())?;

    sqlx::query!("UPDATE projects SET is_deleted = 1 WHERE id = ?", id)
        .execute(&mut *tx)
        .await
        .map_err(|e| e.to_string())?;

    sqlx::query!(
        "UPDATE sessions SET is_deleted = 1 WHERE project_id = ?",
        id
    )
    .execute(&mut *tx)
    .await
    .map_err(|e| e.to_string())?;

    tx.commit().await.map_err(|e| e.to_string())?;

    Ok(())
}
