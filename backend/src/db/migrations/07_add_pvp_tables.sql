-- Create battle_sessions table for Story 3-1 and 3-5
CREATE TABLE IF NOT EXISTS battle_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_a_id UUID REFERENCES users(id) ON DELETE SET NULL,
    player_b_id UUID REFERENCES users(id) ON DELETE SET NULL,
    score_a INTEGER DEFAULT 0,
    score_b INTEGER DEFAULT 0,
    elo_change_a INTEGER DEFAULT 0,
    elo_change_b INTEGER DEFAULT 0,
    is_bot_match BOOLEAN DEFAULT FALSE,
    played_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for searching users ELO faster
CREATE INDEX IF NOT EXISTS idx_users_current_elo ON users(current_elo);

-- Indexes for quick query of match history
CREATE INDEX IF NOT EXISTS idx_battle_sessions_player_a ON battle_sessions(player_a_id);
CREATE INDEX IF NOT EXISTS idx_battle_sessions_player_b ON battle_sessions(player_b_id);
