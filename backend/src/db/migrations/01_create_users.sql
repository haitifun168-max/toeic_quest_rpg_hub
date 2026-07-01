-- Enable uuid-ossp extension for auto-generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    display_name VARCHAR(255) NOT NULL,
    email TEXT UNIQUE NOT NULL, -- AES-256 encrypted email, unique constraint
    password_hash VARCHAR(255), -- Nullable to support OAuth2 users
    current_rank INTEGER DEFAULT 1, -- 1: Thực Tập Sinh
    total_kp INTEGER DEFAULT 0,
    current_elo INTEGER DEFAULT 1000,
    current_stamina INTEGER DEFAULT 15, -- Stamina for Free users (15) and Premium (30)
    last_stamina_reset TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
