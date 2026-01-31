use tauri::{AppHandle, Emitter};
use std::sync::{Arc, Mutex};
use std::time::Instant;
use tokio::time::{sleep, Duration};

pub struct TimerState {
    pub is_running: Arc<Mutex<bool>>,
    pub elapsed_millis: Arc<Mutex<u64>>,
    pub start_instant: Arc<Mutex<Instant>>,
}

#[tauri::command]
pub async fn start_timer(app: AppHandle, state: tauri::State<'_, TimerState>) -> Result<(), String> {
    let mut is_running = state.is_running.lock().map_err(|_| "Mutex Error")?;
    let mut start_instant = state.start_instant.lock().map_err(|_| "Mutex Error")?;
    let elapsed_millis = state.elapsed_millis.lock().map_err(|_| "Mutex Error")?;
    
    if *is_running {
        return Err("Timer läuft bereits.".into());
    }

    *is_running = true;
    if *elapsed_millis > 0 {
        *start_instant = Instant::now() - Duration::from_millis(*elapsed_millis);
    } else {
        *start_instant = Instant::now();
    }

    let is_running_clone = Arc::clone(&state.is_running);
    let start_instant_clone = Arc::clone(&state.start_instant);

    tauri::async_runtime::spawn(async move {
        loop {
            let running = {
                let lock = is_running_clone.lock().unwrap();
                *lock
            };

            if !running {
                break;
            }

            let elapsed = start_instant_clone.lock().unwrap().elapsed().as_millis() as u64;
            let _ = app.emit("timer-tick", elapsed);

            sleep(Duration::from_millis(100)).await;
        }
    });

    Ok(())
}

#[tauri::command]
pub fn stop_timer(state: tauri::State<'_, TimerState>) {
    let mut is_running = state.is_running.lock().unwrap();
    *is_running = false;

    let mut elapsed_millis = state.elapsed_millis.lock().unwrap();
    *elapsed_millis = state.start_instant.lock().unwrap().elapsed().as_millis() as u64;
}