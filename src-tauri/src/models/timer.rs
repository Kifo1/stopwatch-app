use super::{stopwatch::StopwatchState, pomodoro::PomodoroState};
use std::sync::{Arc, Mutex};

pub enum ActiveMode {
    Stopwatch,
    Pomodoro,
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
            stopwatch: StopwatchState::new(),
            pomodoro: PomodoroState::new(),
        }
    }
}

pub type SharedTimerState = Arc<Mutex<TimerState>>;
