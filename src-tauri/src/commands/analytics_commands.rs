use tauri::State;

use crate::{models::dbstate::DbState, services::analytics_service};

#[tauri::command]
pub async fn get_overall_project_time(
    project_id: String,
    db: State<'_, DbState>,
) -> Result<u64, String> {
    let overall_time = analytics_service::get_overall_project_time(project_id, db)
        .await
        .expect("Unable to calculate overall project time.");
    Ok(overall_time)
}
