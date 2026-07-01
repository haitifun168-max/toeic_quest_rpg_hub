-- Create user_quests table
CREATE TABLE IF NOT EXISTS user_quests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quest_type VARCHAR(50) NOT NULL, -- 'vocab', 'listening', 'pvp'
    title VARCHAR(255) NOT NULL,
    target_count INTEGER NOT NULL,
    current_count INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    quest_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_quest_per_day UNIQUE (user_id, quest_type, quest_date)
);

-- Trigger to automatically update updated_at timestamp
CREATE OR REPLACE TRIGGER update_user_quests_updated_at
    BEFORE UPDATE ON user_quests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
