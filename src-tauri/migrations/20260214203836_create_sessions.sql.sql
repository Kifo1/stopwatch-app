-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT,
    last_heartbeat TEXT NOT NULL,
    session_type TEXT NOT NULL,
    mode TEXT NOT NULL,
    is_deleted INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT fk_projects
        FOREIGN KEY (project_id) 
        REFERENCES projects (id) 
        ON DELETE CASCADE
);

-- Index project_ids for search optimization
CREATE INDEX IF NOT EXISTS idx_sessions_project_id ON sessions(project_id);

-- Index sessions_start_times for search optimization
CREATE INDEX IF NOT EXISTS idx_sessions_start_time ON sessions(start_time);