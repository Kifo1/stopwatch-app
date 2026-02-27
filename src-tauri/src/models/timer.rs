use crate::{database::models::project::Project, models::dbstate::DbState};

use super::{pomodoro::PomodoroState, stopwatch::StopwatchState};
use std::sync::{Arc, Mutex};

pub enum ActiveMode {
    Stopwatch,
    Pomodoro,
}

pub struct TimerState {
    pub active_mode: ActiveMode,
    pub is_running: bool,
    pub selected_project: Option<Project>,
    pub current_session_id: Option<String>,

    pub stopwatch: StopwatchState,
    pub pomodoro: PomodoroState,
}

impl TimerState {
    pub async fn new(db: &DbState) -> Self {
        Self {
            active_mode: ActiveMode::Stopwatch,
            is_running: false,
            selected_project: None,
            current_session_id: None,
            stopwatch: StopwatchState::new(),
            pomodoro: PomodoroState::new(db).await,
        }
    }
}

pub type SharedTimerState = Arc<Mutex<TimerState>>;
