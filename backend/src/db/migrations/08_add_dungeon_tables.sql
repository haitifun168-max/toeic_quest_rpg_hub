-- Create dungeon_sessions table for Story 4-2 and 4-3
CREATE TABLE IF NOT EXISTS dungeon_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    dungeon_type VARCHAR(50) NOT NULL, -- 'mini' or 'full'
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    estimated_score INTEGER DEFAULT NULL,
    is_submitted BOOLEAN DEFAULT FALSE
);

-- Create dungeon_draft_answers table for checkpoints auto-save
CREATE TABLE IF NOT EXISTS dungeon_draft_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dungeon_session_id UUID REFERENCES dungeon_sessions(id) ON DELETE CASCADE,
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    selected_option VARCHAR(2) NOT NULL,
    answered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(dungeon_session_id, question_id)
);

-- Index for searching user's active session
CREATE INDEX IF NOT EXISTS idx_dungeon_sessions_user ON dungeon_sessions(user_id, is_submitted);

-- Index for loading checkpoints quickly
CREATE INDEX IF NOT EXISTS idx_dungeon_draft_answers_session ON dungeon_draft_answers(dungeon_session_id);
