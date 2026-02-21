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

#[tauri::command]
pub async fn get_todays_overall_time(db: State<'_, DbState>) -> Result<u64, String> {
    let todays_overall_time = analytics_service::get_todays_overall_time(db)
        .await
        .expect("Couldn't calculate todays overall time.");
    Ok(todays_overall_time)
}

#[tauri::command]
pub async fn get_most_active_project_name(db: State<'_, DbState>) -> Result<String, String> {
    let most_active_project_name = analytics_service::get_most_active_project_name(db)
        .await
        .expect("Couldn't receive most active project name.");
    Ok(most_active_project_name)
}
