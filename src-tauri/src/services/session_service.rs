use crate::{
    database::models::session::{SessionType, TimerMode},
    models::dbstate::DbState,
};
use chrono::Utc;
use tauri::State;

pub async fn start_session(
    project_id: i64,
    session_type: SessionType,
    mode: TimerMode,
    db: State<'_, DbState>,
) -> Result<i64, String> {
    let pool = &db.pool;
    let now = Utc::now();

    let row = sqlx::query!(
        r#"
        INSERT INTO sessions (project_id, session_type, mode, start_time)
        VALUES (?, ?, ?, ?)
        RETURNING id AS "id!"
        "#,
        project_id,
        session_type,
        mode,
        now
    )
    .fetch_one(pool)
    .await
    .map_err(|e| e.to_string())?;

    Ok(row.id)
}

pub async fn stop_session(session_id: i64, db: State<'_, DbState>) -> Result<(), String> {
    let pool = &db.pool;
    let now = Utc::now();

    sqlx::query!(
        "UPDATE sessions SET end_time = ? WHERE id = ?",
        now,
        session_id
    )
    .execute(pool)
    .await
    .map_err(|e| e.to_string())?;

    Ok(())
}
