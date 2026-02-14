mod commands;
mod database;
mod models;
mod services;

use models::dbstate::DbState;
use models::timer::TimerState;
use sqlx::sqlite::{SqliteConnectOptions, SqlitePoolOptions};
use std::{
    str::FromStr,
    sync::{Arc, Mutex},
};
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let timer_state = Arc::new(Mutex::new(TimerState::new()));

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let handle = app.handle().clone();

            let app_dir = handle
                .path()
                .app_data_dir()
                .expect("Failed to get app directory");
            std::fs::create_dir_all(&app_dir).ok();

            let db_path = app_dir.join("database.sqlite");
            let db_url = format!(
                "sqlite:{}",
                db_path.to_str().expect("Path contains invalid UTF-8")
            );
            let connection_options = SqliteConnectOptions::from_str(&db_url)?
                .create_if_missing(true)
                .pragma("foreign_keys", "ON")
                .journal_mode(sqlx::sqlite::SqliteJournalMode::Wal);

            tauri::async_runtime::block_on(async move {
                let pool = SqlitePoolOptions::new()
                    .connect_with(connection_options)
                    .await
                    .expect("Unable to open database file");

                sqlx::migrate!("./migrations")
                    .run(&pool)
                    .await
                    .expect("Unable to run database migrations");

                handle.manage(DbState { pool });
            });

            Ok(())
        })
        .manage(timer_state)
        .invoke_handler(tauri::generate_handler![
            commands::timer_commands::start_timer,
            commands::timer_commands::stop_timer,
            commands::timer_commands::reset_timer,
            commands::timer_commands::switch_timer_mode,
            commands::timer_commands::get_pomodoro_millis,
            commands::timer_commands::get_stopwatch_millis,
            commands::timer_commands::is_timer_running,
            commands::timer_commands::get_timer_mode,
            commands::timer_commands::get_pomodoro_phase,
            commands::timer_commands::set_selected_project,
            commands::timer_commands::get_selected_project,
            commands::project_commands::create_project,
            commands::project_commands::get_projects,
            commands::project_commands::delete_project,
            commands::analytics_commands::get_overall_project_time,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
