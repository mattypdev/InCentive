-- Run this once in the Supabase SQL Editor
-- (Dashboard → SQL Editor → New query → paste → Run)

CREATE OR REPLACE FUNCTION public.get_leaderboard()
RETURNS TABLE(id uuid, name text, xp numeric, lessons bigint, tests bigint)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    p.id,
    p.name,
    (p.xp * 2) AS xp,
    COUNT(CASE WHEN lp.lesson_id NOT LIKE '%-test' AND lp.lesson_id != 'capstone' THEN 1 END) AS lessons,
    COUNT(CASE WHEN lp.lesson_id LIKE '%-test' THEN 1 END) AS tests
  FROM profiles p
  LEFT JOIN lesson_progress lp ON lp.user_id = p.id AND lp.completed = true
  GROUP BY p.id, p.name, p.xp
  ORDER BY (p.xp * 2) DESC, lessons DESC;
$$;

GRANT EXECUTE ON FUNCTION public.get_leaderboard() TO anon, authenticated;
