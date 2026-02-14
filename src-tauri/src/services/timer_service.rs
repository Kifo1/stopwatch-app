use crate::models::timer::{ActiveMode, SharedTimerState};
use std::time::{Duration, Instant};
use tauri::{AppHandle, Emitter};
use tokio::time::sleep;

pub async fn start_timer(app: AppHandle, state: SharedTimerState) -> Result<(), String> {
    {
        let mut state = state.lock().map_err(|_| "Mutex Error")?;

        if state.is_running {
            return Err("Timer läuft bereits.".into());
        }
        state.is_running = true;

        match state.active_mode {
            ActiveMode::Stopwatch => {
                let stopwatch = &mut state.stopwatch;
                stopwatch.start_instant = Some(if stopwatch.elapsed_millis > 0 {
                    Instant::now() - Duration::from_millis(stopwatch.elapsed_millis)
                } else {
                    Instant::now()
                });
            }
            ActiveMode::Pomodoro => {
                let pomodoro = &mut state.pomodoro;
                pomodoro.start_instant = Some(if pomodoro.elapsed_millis > 0 {
                    Instant::now() - Duration::from_millis(pomodoro.elapsed_millis)
                } else {
                    Instant::now()
                });
            }
        }
    }

    let state_clone = state.clone();

    tauri::async_runtime::spawn(async move {
        loop {
            let elapsed = {
                let mut state = state_clone.lock().unwrap();

                if !state.is_running {
                    break;
                }

                match state.active_mode {
                    ActiveMode::Stopwatch => {
                        let stopwatch = &mut state.stopwatch;
                        if let Some(start) = stopwatch.start_instant {
                            stopwatch.elapsed_millis = start.elapsed().as_millis() as u64;
                        }
                        stopwatch.elapsed_millis
                    }
                    ActiveMode::Pomodoro => {
                        let pomodoro = &mut state.pomodoro;
                        if let Some(start) = pomodoro.start_instant {
                            pomodoro.elapsed_millis = start.elapsed().as_millis() as u64;
                        }
                        let millis_left = pomodoro.current_phase_millis_left();

                        if millis_left == 0 {
                            pomodoro.start_next_phase();
                            let _ = app.emit("pomodoro-phase", pomodoro.phase as u8);
                            let _ = app.emit("pomodoro-phase-sound", ());
                            pomodoro.current_phase_millis_left()
                        } else {
                            millis_left
                        }
                    }
                }
            };

            let _ = app.emit("timer-tick", elapsed);
            sleep(Duration::from_millis(100)).await;
        }
    });

    Ok(())
}

pub fn stop_timer(state: SharedTimerState) -> Result<(), String> {
    let mut state = state.lock().map_err(|_| "Mutex Error")?;
    stop_timer_inner(&mut state);
    Ok(())
}

fn stop_timer_inner(state: &mut crate::models::timer::TimerState) {
    if !state.is_running {
        return;
    }

    state.is_running = false;

    match state.active_mode {
        ActiveMode::Stopwatch => {
            if let Some(start) = state.stopwatch.start_instant {
                state.stopwatch.elapsed_millis = start.elapsed().as_millis() as u64;
            }
        }
        ActiveMode::Pomodoro => {
            if let Some(start) = state.pomodoro.start_instant {
                state.pomodoro.elapsed_millis = start.elapsed().as_millis() as u64;
            }
        }
    }
}

pub async fn reset_timer(app: AppHandle, state: SharedTimerState) -> Result<(), String> {
    let was_running = {
        let mut state_guard = state.lock().map_err(|_| "Mutex Error")?;
        let was_running = state_guard.is_running;

        stop_timer_inner(&mut state_guard);

        match state_guard.active_mode {
            ActiveMode::Stopwatch => state_guard.stopwatch.elapsed_millis = 0,
            ActiveMode::Pomodoro => {
                state_guard.pomodoro.elapsed_millis = 0;
                state_guard.pomodoro.phase = crate::models::pomodoro::PomodoroPhase::FocusOne;
                let _ = app.emit("pomodoro-phase", state_guard.pomodoro.phase as u8);
            }
        }

        was_running
    };

    if was_running {
        start_timer(app, state).await
    } else {
        Ok(())
    }
}
