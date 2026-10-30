-- Add per-user streak persistence to the profiles table.
-- streak_last_date stores YYYY-MM-DD (local-time string, matches the JS en-CA format).
-- Run once in the Supabase Dashboard → SQL Editor.

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS streak_count     INT  NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS streak_last_date TEXT;
