use crate::{
    database::models::session::{SessionType, TimerMode},
    models::dbstate::DbState,
};
use chrono::Utc;
use uuid::Uuid;

pub async fn start_session(
    project_id: String,
    session_type: SessionType,
    mode: TimerMode,
    db: &DbState,
) -> Result<String, String> {
    let pool = &db.pool;
    let now = Utc::now();
    let uuid = Uuid::new_v4().to_string(); 

    sqlx::query!(
        r#"
        INSERT INTO sessions (id, project_id, session_type, mode, start_time, last_heartbeat)
        VALUES (?, ?, ?, ?, ?, ?)
        "#,
        uuid,
        project_id,
        session_type,
        mode,
        now,
        now
    )
    .execute(pool)
    .await
    .map_err(|e| e.to_string())?;

    Ok(uuid)
}

pub async fn session_heartbeat(session_id: String, db: &DbState) -> Result<(), String> {
    let pool = &db.pool;
    let now = Utc::now();

    sqlx::query!(
        "UPDATE sessions SET last_heartbeat = ? WHERE id = ? AND is_deleted = 0",
        now,
        session_id
    )
    .execute(pool)
    .await
    .map_err(|e| e.to_string())?;

    Ok(())
}

pub async fn stop_session(session_id: String, db: &DbState) -> Result<(), String> {
    let pool = &db.pool;
    let now = Utc::now();

    sqlx::query!(
        "UPDATE sessions SET end_time = ? WHERE id = ? AND is_deleted = 0",
        now,
        session_id
    )
    .execute(pool)
    .await
    .map_err(|e| e.to_string())?;

    Ok(())
}

pub async fn delete_incomplete_sessions(db: &DbState) -> Result<u64, String> {
    let result = sqlx::query!("DELETE FROM sessions WHERE end_time IS NULL")
        .execute(&db.pool)
        .await
        .map_err(|e| e.to_string())?;

    Ok(result.rows_affected())
}
