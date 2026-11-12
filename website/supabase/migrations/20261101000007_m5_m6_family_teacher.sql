-- Migration 7: M5 Family features + M6 Teacher additions

-- ── Family challenges: day-by-day tracking ─────────────────────────────────

CREATE TABLE IF NOT EXISTS family_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES profiles(id),
  child_id uuid REFERENCES profiles(id),
  challenge_key text NOT NULL,
  challenge_title text NOT NULL,
  started_at timestamptz DEFAULT now(),
  parent_days int[] DEFAULT '{}',
  child_days int[] DEFAULT '{}',
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Add columns if the table was created without them (migration 4 used a different schema)
ALTER TABLE family_challenges
  ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES profiles(id),
  ADD COLUMN IF NOT EXISTS child_id uuid REFERENCES profiles(id);

ALTER TABLE family_challenges ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'family_challenges' AND policyname = 'fc_own'
  ) THEN
    CREATE POLICY fc_own ON family_challenges FOR ALL
      USING (parent_id = auth.uid() OR child_id = auth.uid());
  END IF;
END $$;

-- ── Family promises: parent incentive tied to island completion ─────────────

CREATE TABLE IF NOT EXISTS family_promises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid NOT NULL REFERENCES profiles(id),
  child_id uuid NOT NULL REFERENCES profiles(id),
  island_slug text NOT NULL,
  promise_text text NOT NULL,
  fulfilled_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE family_promises ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'family_promises' AND policyname = 'fp_own'
  ) THEN
    CREATE POLICY fp_own ON family_promises FOR ALL
      USING (parent_id = auth.uid() OR child_id = auth.uid());
  END IF;
END $$;

-- ── Extend groups for teacher class metadata ────────────────────────────────

ALTER TABLE groups
  ADD COLUMN IF NOT EXISTS period text,
  ADD COLUMN IF NOT EXISTS grade text,
  ADD COLUMN IF NOT EXISTS subject text;

-- ── Allow teens to insert their own link_codes ─────────────────────────────

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'link_codes' AND policyname = 'lc_insert_own'
  ) THEN
    CREATE POLICY lc_insert_own ON link_codes FOR INSERT WITH CHECK (child_id = auth.uid());
  END IF;
END $$;

-- Allow anyone to read link codes (needed for parent to redeem)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'link_codes' AND policyname = 'lc_read_all'
  ) THEN
    CREATE POLICY lc_read_all ON link_codes FOR SELECT USING (true);
  END IF;
END $$;

-- Allow parents to update link codes (mark used)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'link_codes' AND policyname = 'lc_update_used'
  ) THEN
    CREATE POLICY lc_update_used ON link_codes FOR UPDATE USING (true);
  END IF;
END $$;

-- Allow parents to insert family_links
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'family_links' AND policyname = 'fl_insert_parent'
  ) THEN
    CREATE POLICY fl_insert_parent ON family_links FOR INSERT WITH CHECK (parent_id = auth.uid());
  END IF;
END $$;

-- Allow parents to update family_links they own
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'family_links' AND policyname = 'fl_update_parent'
  ) THEN
    CREATE POLICY fl_update_parent ON family_links FOR UPDATE USING (parent_id = auth.uid());
  END IF;
END $$;

-- ── Assignments RLS ─────────────────────────────────────────────────────────

ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'assignments' AND policyname = 'assign_teacher'
  ) THEN
    CREATE POLICY assign_teacher ON assignments FOR ALL USING (teaches(group_id));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'assignments' AND policyname = 'assign_student_read'
  ) THEN
    CREATE POLICY assign_student_read ON assignments FOR SELECT USING (is_member(group_id));
  END IF;
END $$;

-- ── Class plans RLS ─────────────────────────────────────────────────────────

ALTER TABLE class_plans ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'class_plans' AND policyname = 'cp_teacher'
  ) THEN
    CREATE POLICY cp_teacher ON class_plans FOR ALL USING (teaches(group_id));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'class_plans' AND policyname = 'cp_student_read'
  ) THEN
    CREATE POLICY cp_student_read ON class_plans FOR SELECT USING (is_member(group_id));
  END IF;
END $$;

-- ── Wallet ledger: allow teachers to read student entries (for gradebook) ───

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'wallet_ledger' AND policyname = 'wl_teacher'
  ) THEN
    CREATE POLICY wl_teacher ON wallet_ledger FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM group_members t
          JOIN group_members s ON s.group_id = t.group_id
          JOIN groups g ON g.id = t.group_id
          WHERE g.kind = 'class' AND g.archived_at IS NULL
            AND t.user_id = auth.uid() AND t.role IN ('owner','co_teacher')
            AND s.user_id = wallet_ledger.user_id
        )
      );
  END IF;
END $$;

-- ── group_members: teachers can insert students ─────────────────────────────

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'group_members' AND policyname = 'gm_teacher_write'
  ) THEN
    CREATE POLICY gm_teacher_write ON group_members FOR INSERT
      WITH CHECK (teaches(group_id));
  END IF;
END $$;
