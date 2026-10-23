-- Add meta JSONB column for new interactive question types (sort, order, wordbank).
-- Existing questions are unaffected (meta stays null).
ALTER TABLE questions ADD COLUMN IF NOT EXISTS meta JSONB;
