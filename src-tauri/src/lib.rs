use std::time::Instant;
use tauri::State;
use std::sync::Mutex;

struct TimerState {
    start_time: Mutex<Option<Instant>>,
}

#[tauri::command]
fn start_timer(state: State<'_, TimerState>) -> bool {
    let mut start_time = state.start_time.lock().unwrap();
    *start_time = Some(Instant::now());
    true
}

#[tauri::command]
fn stop_timer() -> bool {
    false
}

#[tauri::command]
fn get_elapsed_seconds(state: State<'_, TimerState>) -> u64 {
    let start_time = state.start_time.lock().unwrap();
    match *start_time {
        Some(instant) => instant.elapsed().as_secs(),
        None => 0,
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(TimerState { start_time: Mutex::new(None) })
        .invoke_handler(tauri::generate_handler![start_timer, stop_timer, get_elapsed_seconds])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
