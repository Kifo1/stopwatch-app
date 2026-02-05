pub mod commands;
use commands::timer::{TimerState, start_timer, stop_timer, reset_timer, switch_timer_mode, get_current_time_millis, is_timer_running};
use std::sync::{Arc, Mutex};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(Arc::new(Mutex::new(TimerState::new())))
        .invoke_handler(tauri::generate_handler![start_timer, stop_timer, reset_timer, switch_timer_mode, get_current_time_millis, is_timer_running])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
