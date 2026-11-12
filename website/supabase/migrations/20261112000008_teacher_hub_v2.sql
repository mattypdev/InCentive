-- Teacher hub v2: extend assignments for multi-item assignments
ALTER TABLE assignments
  ADD COLUMN IF NOT EXISTS title text,
  ADD COLUMN IF NOT EXISTS items jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS target_user_ids uuid[],
  ADD COLUMN IF NOT EXISTS is_draft boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_review boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS nudge_until timestamptz;

-- Drop old check constraint that required exactly one of unit_id/lesson_id
-- (new multi-item assignments may use neither)
ALTER TABLE assignments DROP CONSTRAINT IF EXISTS assignments_check;

-- RLS for group_members: teachers can read their class members
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'group_members' AND policyname = 'gm_teacher_read'
  ) THEN
    CREATE POLICY gm_teacher_read ON group_members FOR SELECT
      USING (teaches(group_id));
  END IF;
END $$;

-- RLS for attempts: teachers can read their students' attempts
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'attempts' AND policyname = 'att_teacher_read'
  ) THEN
    CREATE POLICY att_teacher_read ON attempts FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM group_members gm
          WHERE gm.user_id = attempts.user_id
            AND gm.role = 'student'
            AND teaches(gm.group_id)
        )
      );
  END IF;
END $$;

-- RLS for lesson_progress: teachers can read their students' progress
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'lesson_progress' AND policyname = 'lp_teacher_read'
  ) THEN
    CREATE POLICY lp_teacher_read ON lesson_progress FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM group_members gm
          WHERE gm.user_id = lesson_progress.user_id
            AND gm.role = 'student'
            AND teaches(gm.group_id)
        )
      );
  END IF;
END $$;

-- RLS for answers: teachers can read their students' answers
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'answers' AND policyname = 'ans_teacher_read'
  ) THEN
    CREATE POLICY ans_teacher_read ON answers FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM group_members gm
            JOIN attempts att ON att.user_id = gm.user_id
          WHERE att.id = answers.attempt_id
            AND gm.role = 'student'
            AND teaches(gm.group_id)
        )
      );
  END IF;
END $$;
