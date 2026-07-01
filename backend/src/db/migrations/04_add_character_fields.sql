-- Add character_name and avatar_id columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS character_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS avatar_id VARCHAR(50);
