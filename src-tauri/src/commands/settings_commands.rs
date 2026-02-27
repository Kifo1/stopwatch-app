use tauri::State;

use crate::{
    database::models::settings::AppSettings,
    models::{dbstate::DbState, timer::SharedTimerState},
};

#[tauri::command]
pub async fn get_settings(db: State<'_, DbState>) -> Result<AppSettings, String> {
    let settings = crate::services::settings_service::get_settings(&db)
        .await
        .expect("Unable to get settings");
    Ok(settings)
}

#[tauri::command]
pub async fn update_settings(
    state: State<'_, SharedTimerState>,
    db: State<'_, DbState>,
    new_settings: AppSettings,
) -> Result<(), String> {
    crate::services::settings_service::update_settings(&db, new_settings)
        .await
        .map_err(|e| e.to_string())?;

    let shared_state = state.inner().clone();

    crate::services::timer_service::sync_timer_with_settings(shared_state, &db)
        .await
        .map_err(|e| e.to_string())?;

    Ok(())
}
