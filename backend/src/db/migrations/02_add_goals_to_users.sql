-- Add target_score and target_deadline columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS target_score INTEGER,
ADD COLUMN IF NOT EXISTS target_deadline TIMESTAMP WITH TIME ZONE;
