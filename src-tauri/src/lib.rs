mod commands;
mod models;
mod services;

use models::timer::TimerState;
use std::sync::{Arc, Mutex};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let timer_state = Arc::new(Mutex::new(TimerState::new()));

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
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
            commands::timer_commands::get_pomodoro_phase])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
