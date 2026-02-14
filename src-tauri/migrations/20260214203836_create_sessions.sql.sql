-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    start_time TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_time TEXT,
    session_type TEXT NOT NULL, -- 'FOCUS', 'SHORT_BREAK', 'LONG_BREAK'
    mode TEXT NOT NULL, -- 'STOPWATCH', 'POMODORO'
    CONSTRAINT fk_projects
        FOREIGN KEY (project_id) 
        REFERENCES projects (id) 
        ON DELETE CASCADE
);

-- Index project_ids for search optimization
CREATE INDEX IF NOT EXISTS idx_sessions_project_id ON sessions(project_id);

-- Index sessions_start_times for search optimization
CREATE INDEX IF NOT EXISTS idx_sessions_start_time ON sessions(start_time);