use tauri::{AppHandle, Emitter};
use std::sync::{Arc, Mutex};
use std::time::Instant;
use tokio::time::{sleep, Duration};

pub enum ActiveMode {
    Stopwatch,
    Pomodoro,
}

pub struct StopwatchState {
    pub elapsed_millis: u64,
    pub start_instant: Option<Instant>,
}

#[derive(Debug, Copy, Clone)]
pub enum PomodoroPhase {
    FocusOne = 0,
    ShortBreak = 1,
    FocusTwo = 2,
    LongBreak = 3,
}

pub struct PomodoroState {
    pub elapsed_millis: u64,
    pub start_instant: Option<Instant>,

    pub focus_minutes: u32,
    pub short_break_minutes: u32,
    pub long_break_minutes: u32,

    pub phase: PomodoroPhase,
}

impl PomodoroState {
    pub fn current_phase_millis_left(&self) -> u64 {
        let phase_millis = match self.phase {
            PomodoroPhase::FocusOne | PomodoroPhase::FocusTwo => self.focus_minutes as u64 * 60 * 1000,
            PomodoroPhase::ShortBreak => self.short_break_minutes as u64 * 60 * 1000,
            PomodoroPhase::LongBreak => self.long_break_minutes as u64 * 60 * 1000,
        };
        phase_millis.saturating_sub(self.elapsed_millis)
    }

    pub fn start_next_phase(&mut self) {
        self.elapsed_millis = 0;
        self.start_instant = Some(Instant::now());
        match self.phase {
            PomodoroPhase::FocusOne => self.phase = PomodoroPhase::ShortBreak,
            PomodoroPhase::ShortBreak => self.phase = PomodoroPhase::FocusTwo,
            PomodoroPhase::FocusTwo => self.phase = PomodoroPhase::LongBreak,
            PomodoroPhase::LongBreak => self.phase = PomodoroPhase::FocusOne,
        }
    }
}

pub struct TimerState {
    pub active_mode: ActiveMode,
    pub is_running: bool,

    pub stopwatch: StopwatchState,
    pub pomodoro: PomodoroState,
}

impl TimerState {
    pub fn new() -> Self {
        Self {
            active_mode: ActiveMode::Stopwatch,
            is_running: false,

            stopwatch: StopwatchState { 
                elapsed_millis: 0,
                start_instant: None
            },

            pomodoro: PomodoroState { 
                elapsed_millis: 0,
                start_instant: None,
                focus_minutes: 25,
                short_break_minutes: 5,
                long_break_minutes: 10,
                phase: PomodoroPhase::FocusOne,
            },
        }
    }
}

pub type SharedTimerState = Arc<Mutex<TimerState>>;

#[tauri::command]
pub async fn start_timer(app: AppHandle, state: tauri::State<'_, SharedTimerState>) -> Result<(), String> {
    {
        let mut state = state.lock().map_err(|_| "Mutex Error")?;
    
        if state.is_running {
            return Err("Timer läuft bereits.".into());
        }
        state.is_running = true;
    
        match state.active_mode {
            ActiveMode::Stopwatch => {
                let stopwatch = &mut state.stopwatch;
                if stopwatch.elapsed_millis > 0 {
                    stopwatch.start_instant = Some(Instant::now() - Duration::from_millis(stopwatch.elapsed_millis));
                } else {
                    stopwatch.start_instant = Some(Instant::now());
                }
            }
            ActiveMode::Pomodoro => {
                let pomodoro = &mut state.pomodoro;
                if pomodoro.elapsed_millis > 0 {
                    pomodoro.start_instant = Some(Instant::now() - Duration::from_millis(pomodoro.elapsed_millis));
                } else {
                    pomodoro.start_instant = Some(Instant::now());
                }
            }
        }
    }
    
    let state = state.inner().clone();

    tauri::async_runtime::spawn(async move {
        loop {
            let elapsed = {
                let mut state = state.lock().unwrap();

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
                            pomodoro.current_phase_millis_left()
                        } else {
                            millis_left
                        }
                    }
                }
            };

            let _ = app.emit("timer-tick", elapsed );
            sleep(Duration::from_millis(100)).await;
        }
    });

    Ok(())
}

#[tauri::command]
pub fn stop_timer(state: tauri::State<'_, SharedTimerState>) -> Result<(), String> {
    let mut state = state.lock().map_err(|_| "Mutex Error")?;
    stop_timer_inner(&mut state);
    Ok(())
}

fn stop_timer_inner(state: &mut TimerState) {
    if !state.is_running {
        return;
    }

    state.is_running = false;

    match state.active_mode {
        ActiveMode::Stopwatch => {
            state.stopwatch.elapsed_millis = state.stopwatch.start_instant.unwrap().elapsed().as_millis() as u64;
        }
        ActiveMode::Pomodoro => {
            state.pomodoro.elapsed_millis = state.pomodoro.start_instant.unwrap().elapsed().as_millis() as u64;
        }
    };
}

#[tauri::command]
pub async fn reset_timer(app: AppHandle, state: tauri::State<'_, SharedTimerState>) -> Result<(), String> {
    let was_running = {
        let mut state_guard = state.lock().map_err(|_| "Mutex Error")?;
        let was_running = state_guard.is_running;

        stop_timer_inner(&mut state_guard);

        match state_guard.active_mode {
            ActiveMode::Stopwatch => state_guard.stopwatch.elapsed_millis = 0,
            ActiveMode::Pomodoro => {
                state_guard.pomodoro.elapsed_millis = 0;
                state_guard.pomodoro.phase = PomodoroPhase::FocusOne;
                let _ = app.emit("pomodoro-phase", state_guard.pomodoro.phase as u8);
            },
        }

        was_running
    };

    if was_running {
        start_timer(app, state).await
    } else {
        Ok(())
    }
}

#[tauri::command]
pub fn switch_timer_mode(timer_mode: String, state: tauri::State<'_, SharedTimerState>) -> Result<(), String> {
    let mut state = state.lock().map_err(|_| "Mutex Error")?;

    if timer_mode == "stopwatch" {
        state.active_mode = ActiveMode::Stopwatch;
    } else if timer_mode == "pomodoro" {
        state.active_mode = ActiveMode::Pomodoro;
    }

    Ok(())
}