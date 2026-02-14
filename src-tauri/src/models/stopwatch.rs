use std::time::Instant;

pub struct StopwatchState {
    pub elapsed_millis: u64,
    pub start_instant: Option<Instant>,
}

impl StopwatchState {
    pub fn new() -> Self {
        Self {
            elapsed_millis: 0,
            start_instant: None,
        }
    }
}
