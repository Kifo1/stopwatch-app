use crate::models::dbstate::DbState;
use tauri::State;

pub async fn get_overall_project_time(
    project_id: i64,
    db: State<'_, DbState>,
) -> Result<u64, String> {
    let pool = &db.pool;

    let record = sqlx::query!(
        r#"
        SELECT 
            SUM(
                CASE 
                    WHEN end_time IS NOT NULL THEN (strftime('%s', end_time) - strftime('%s', start_time))
                    ELSE (strftime('%s', 'now') - strftime('%s', start_time))
                END
            ) AS "total_seconds!: i64"
        FROM sessions
        WHERE project_id = ?
        AND session_type = 'FOCUS'
        "#,
        project_id,
    )
    .fetch_one(pool)
    .await
    .map_err(|e| e.to_string())?;

    Ok(record.total_seconds.max(0) as u64)
}
