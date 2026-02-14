use std::time::Instant;

#[derive(Debug, Copy, Clone, PartialEq, Eq)]
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
    pub fn new() -> Self {
        Self {
            elapsed_millis: 0,
            start_instant: None,
            focus_minutes: 25,
            short_break_minutes: 5,
            long_break_minutes: 10,
            phase: PomodoroPhase::FocusOne,
        }
    }

    pub fn current_phase_millis_left(&self) -> u64 {
        let phase_millis = match self.phase {
            PomodoroPhase::FocusOne | PomodoroPhase::FocusTwo => {
                self.focus_minutes as u64 * 60 * 1000
            }
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
