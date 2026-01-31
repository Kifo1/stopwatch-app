pub mod commands;
use commands::timer::{TimerState, start_timer, stop_timer, reset_timer};
use std::sync::{Arc, Mutex};
use std::time::Instant;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(TimerState { is_running: Arc::new(Mutex::new(false)), elapsed_millis: Arc::new(Mutex::new(0u64)), start_instant: Arc::new(Mutex::new(Instant::now())) })
        .invoke_handler(tauri::generate_handler![start_timer, stop_timer, reset_timer])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
