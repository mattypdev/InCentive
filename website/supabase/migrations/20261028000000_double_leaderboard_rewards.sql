-- Double XP rewards for all lessons in the leaderboard function.
-- Regular lessons: 10 → 20 cents base, capstone: 200 → 400, chapter tests: 100 → 200.
-- The final *2 multiplier converts cents to XP (unchanged).
CREATE OR REPLACE FUNCTION get_leaderboard()
RETURNS TABLE (id uuid, name text, xp bigint, lessons bigint, tests bigint)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    p.id,
    COALESCE(p.name, 'Unnamed') AS name,
    COALESCE(SUM(ROUND(
      CASE
        WHEN lp.lesson_id = 'capstone'          THEN 400.0 * lp.score / 100
        WHEN lp.lesson_id LIKE '%-test'         THEN 200.0 * lp.score / 100
        ELSE                                         20.0  * lp.score / 100
      END
    )), 0)::bigint * 2 AS xp,
    COUNT(*) FILTER (
      WHERE lp.lesson_id NOT LIKE '%-test' AND lp.lesson_id <> 'capstone'
    ) AS lessons,
    COUNT(*) FILTER (WHERE lp.lesson_id LIKE '%-test') AS tests
  FROM profiles p
  LEFT JOIN lesson_progress lp
    ON lp.user_id = p.id AND lp.completed = true
  GROUP BY p.id, p.name
  ORDER BY xp DESC, lessons DESC;
$$;
