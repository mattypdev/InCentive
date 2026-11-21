-- ── League tables and columns ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS league_groups (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tier       text NOT NULL CHECK (tier IN ('penny','nickel','dime','quarter','dollar','gold')),
  week_start date NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE league_groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "league_groups_select" ON league_groups FOR SELECT USING (true);

-- New profile columns for the league system
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS weekly_xp              integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS league_tier            text    DEFAULT 'penny'
    CHECK (league_tier IN ('penny','nickel','dime','quarter','dollar','gold')),
  ADD COLUMN IF NOT EXISTS league_group_id        uuid    REFERENCES league_groups(id),
  ADD COLUMN IF NOT EXISTS league_rank_yesterday  integer,
  ADD COLUMN IF NOT EXISTS hide_from_leaderboard  boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS streak_best            integer DEFAULT 0;

-- Seed streak_best for existing users
UPDATE profiles
SET streak_best = COALESCE(streak_count, 0)
WHERE streak_best = 0 AND COALESCE(streak_count, 0) > 0;

-- weekly_xp starts at 0 for all users; incremented as lessons are completed going forward.

-- ── Helper: tier ↔ integer ───────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION tier_to_int(t text) RETURNS int AS $$
  SELECT CASE t
    WHEN 'penny'   THEN 1
    WHEN 'nickel'  THEN 2
    WHEN 'dime'    THEN 3
    WHEN 'quarter' THEN 4
    WHEN 'dollar'  THEN 5
    WHEN 'gold'    THEN 6
    ELSE 1
  END;
$$ LANGUAGE sql IMMUTABLE;

CREATE OR REPLACE FUNCTION int_to_tier(n int) RETURNS text AS $$
  SELECT CASE GREATEST(1, LEAST(6, n))
    WHEN 1 THEN 'penny'
    WHEN 2 THEN 'nickel'
    WHEN 3 THEN 'dime'
    WHEN 4 THEN 'quarter'
    WHEN 5 THEN 'dollar'
    WHEN 6 THEN 'gold'
  END;
$$ LANGUAGE sql IMMUTABLE;

-- ── Regroup all users into new league_groups by tier ─────────────────────────
-- Called after every weekly reset.

CREATE OR REPLACE FUNCTION regroup_league_by_tier() RETURNS void AS $$
DECLARE
  v_tier       text;
  v_total      int;
  v_group_id   uuid;
  v_week_start date := date_trunc('isow', now())::date;
  v_chunk      constant int := 30;
  v_offset     int;
BEGIN
  FOREACH v_tier IN ARRAY ARRAY['penny','nickel','dime','quarter','dollar','gold'] LOOP
    SELECT COUNT(*) INTO v_total FROM profiles WHERE league_tier = v_tier;
    CONTINUE WHEN v_total = 0;

    v_offset := 0;
    WHILE v_offset < v_total LOOP
      INSERT INTO league_groups (tier, week_start)
      VALUES (v_tier, v_week_start)
      RETURNING id INTO v_group_id;

      -- Pseudo-random but deterministic per week so groups differ each week
      UPDATE profiles
      SET league_group_id = v_group_id
      WHERE id IN (
        SELECT id FROM profiles
        WHERE league_tier = v_tier
        ORDER BY md5(id::text || v_week_start::text)
        LIMIT v_chunk OFFSET v_offset
      );

      v_offset := v_offset + v_chunk;
    END LOOP;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ── Weekly reset: promote top 5, demote bottom 5, then regroup ───────────────
-- Call this every Monday 00:00 UTC (pg_cron or Supabase scheduled function).

CREATE OR REPLACE FUNCTION weekly_league_reset() RETURNS void AS $$
DECLARE
  v_gid  uuid;
  v_size int;
BEGIN
  FOR v_gid IN
    SELECT DISTINCT league_group_id FROM profiles WHERE league_group_id IS NOT NULL
  LOOP
    SELECT COUNT(*) INTO v_size FROM profiles WHERE league_group_id = v_gid;

    -- Save end-of-week rank into league_rank_yesterday
    WITH ranked AS (
      SELECT id, ROW_NUMBER() OVER (ORDER BY weekly_xp DESC) AS rk
      FROM profiles WHERE league_group_id = v_gid
    )
    UPDATE profiles p
    SET league_rank_yesterday = r.rk
    FROM ranked r WHERE p.id = r.id;

    -- Promote top 5 (not past gold, only if group is big enough)
    IF v_size > 10 THEN
      WITH ranked AS (
        SELECT id, ROW_NUMBER() OVER (ORDER BY weekly_xp DESC) AS rk
        FROM profiles WHERE league_group_id = v_gid
      )
      UPDATE profiles p
      SET league_tier = int_to_tier(LEAST(tier_to_int(p.league_tier) + 1, 6))
      FROM ranked r
      WHERE p.id = r.id AND r.rk <= 5;

      -- Demote bottom 5 (not past penny)
      WITH ranked AS (
        SELECT id, ROW_NUMBER() OVER (ORDER BY weekly_xp DESC) AS rk
        FROM profiles WHERE league_group_id = v_gid
      )
      UPDATE profiles p
      SET league_tier = int_to_tier(GREATEST(tier_to_int(p.league_tier) - 1, 1))
      FROM ranked r
      WHERE p.id = r.id AND r.rk > v_size - 5;
    END IF;
  END LOOP;

  UPDATE profiles SET weekly_xp = 0;
  PERFORM regroup_league_by_tier();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
