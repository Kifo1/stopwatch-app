-- Add settings table
CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    focus_duration INTEGER NOT NULL DEFAULT 25,
    short_break INTEGER NOT NULL DEFAULT 5,
    long_break INTEGER NOT NULL DEFAULT 15,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial settings
INSERT OR IGNORE INTO settings (id, focus_duration, short_break, long_break) 
VALUES (1, 25, 5, 15);

-- Update updated_at timestamp on updates
CREATE TRIGGER IF NOT EXISTS update_settings_updated_at
AFTER UPDATE ON settings
FOR EACH ROW
BEGIN
    UPDATE settings SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;
