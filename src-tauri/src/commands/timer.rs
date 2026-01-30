use tauri::{AppHandle, Emitter};
use std::sync::{Arc, Mutex};
use std::time::Instant;
use tokio::time::{sleep, Duration};

pub struct TimerState {
    pub is_running: Arc<Mutex<bool>>,
}

#[tauri::command]
pub async fn start_timer(app: AppHandle, state: tauri::State<'_, TimerState>) -> Result<(), String> {
    let mut is_running = state.is_running.lock().map_err(|_| "Mutex Error")?;
    
    if *is_running {
        return Err("Timer läuft bereits.".into());
    }

    *is_running = true;
    let is_running_clone = Arc::clone(&state.is_running);
    let start_instant = Instant::now();

    tauri::async_runtime::spawn(async move {
        loop {
            let running = {
                let lock = is_running_clone.lock().unwrap();
                *lock
            };

            if !running {
                break;
            }

            let elapsed = start_instant.elapsed().as_millis() as u64;
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
}