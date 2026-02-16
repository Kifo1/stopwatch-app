use tauri::State;

use crate::models::dbstate::DbState;

pub async fn get_overall_project_time(
    project_id: String,
    db: State<'_, DbState>,
) -> Result<u64, String> {
    let pool = &db.pool;

    let record = sqlx::query!(
        r#"
        SELECT 
            SUM(
                CASE 
                    WHEN end_time IS NOT NULL THEN (strftime('%s', end_time) - strftime('%s', start_time))
                    ELSE (strftime('%s', last_heartbeat) - strftime('%s', start_time))
                END
            ) AS "total_seconds!: i64"
        FROM sessions
        WHERE project_id = ?
        AND session_type = 'FOCUS'
        AND is_deleted = 0
        "#,
        project_id,
    )
    .fetch_one(pool)
    .await
    .map_err(|e| e.to_string())?;

    Ok(record.total_seconds.max(0) as u64)
}

pub async fn get_todays_overall_time(db: State<'_, DbState>) -> Result<u64, String> {
    let pool = &db.pool;

    let record = sqlx::query!(
        r#"
    SELECT
        SUM(
            MIN(
                strftime('%s', COALESCE(end_time, last_heartbeat, 'now')), 
                strftime('%s', 'now')
            ) - 
            MAX(
                strftime('%s', start_time), 
                strftime('%s', 'now', 'start of day')
            )
        ) AS "total_seconds!: i64"
    FROM sessions
    WHERE session_type = 'FOCUS'
    AND is_deleted = 0
    AND (
        (start_time >= datetime('now', 'start of day')) 
        OR 
        (COALESCE(end_time, last_heartbeat, 'now') > datetime('now', 'start of day'))
    )
    AND start_time < datetime('now', 'start of day', '+1 day')
    "#
    )
    .fetch_one(pool)
    .await
    .map_err(|e| e.to_string())?;

    Ok(record.total_seconds.max(0) as u64)
}
