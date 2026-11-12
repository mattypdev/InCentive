-- Baseline schema — the tables that already existed in production before any
-- incremental migrations were written. This lets local Supabase start clean.

-- profiles: one row per auth user
CREATE TABLE IF NOT EXISTS profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name            TEXT,
  xp              INT NOT NULL DEFAULT 0,
  streak_count    INT NOT NULL DEFAULT 0,
  streak_last_date TEXT,
  first_name      TEXT,
  last_initial    TEXT,
  birth_year      INT,
  birth_month     INT,
  is_teacher      BOOLEAN DEFAULT FALSE,
  is_host         BOOLEAN DEFAULT FALSE,
  is_parent       BOOLEAN DEFAULT FALSE,
  is_chapter_lead BOOLEAN DEFAULT FALSE,
  is_admin        BOOLEAN DEFAULT FALSE,
  is_guest        BOOLEAN DEFAULT FALSE,
  consent_status  TEXT DEFAULT 'not_required'
    CHECK (consent_status IN ('not_required','pending','approved','declined','school')),
  timezone        TEXT DEFAULT 'America/Los_Angeles',
  chapter_id      UUID,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_owner" ON profiles USING (auth.uid() = id);
CREATE POLICY "profiles_public_read" ON profiles FOR SELECT USING (true);

-- lesson_progress: one row per (user, lesson) attempt
CREATE TABLE IF NOT EXISTS lesson_progress (
  id          BIGSERIAL PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  lesson_id   TEXT NOT NULL,
  score       INT  NOT NULL DEFAULT 0,
  completed   BOOL NOT NULL DEFAULT FALSE,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, lesson_id)
);

ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lp_owner" ON lesson_progress USING (auth.uid() = user_id);

-- questions: lesson questions loaded by the player
CREATE TABLE IF NOT EXISTS questions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id      TEXT,
  lesson_id    TEXT,
  type         TEXT NOT NULL DEFAULT 'multiple-choice',
  prompt       TEXT NOT NULL,
  options      JSONB,
  correct      TEXT,
  explanation  TEXT,
  position     INT  NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "questions_public_read" ON questions FOR SELECT USING (true);

-- articles: blog/resource articles
CREATE TABLE IF NOT EXISTS articles (
  id           BIGSERIAL PRIMARY KEY,
  title        TEXT NOT NULL,
  author       TEXT,
  body         TEXT,
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "articles_public_read" ON articles FOR SELECT USING (true);

-- quizzes: user-created quizzes
CREATE TABLE IF NOT EXISTS quizzes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  title       TEXT NOT NULL,
  code        TEXT NOT NULL UNIQUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "quizzes_owner_all" ON quizzes USING (auth.uid() = user_id);
CREATE POLICY "quizzes_public_read" ON quizzes FOR SELECT USING (true);

-- quiz_questions: questions within a user quiz
CREATE TABLE IF NOT EXISTS quiz_questions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id     UUID NOT NULL REFERENCES quizzes ON DELETE CASCADE,
  prompt      TEXT NOT NULL,
  options     JSONB,
  correct     TEXT,
  explanation TEXT,
  position    INT  NOT NULL DEFAULT 0
);

ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "qq_via_quiz" ON quiz_questions FOR SELECT USING (true);
CREATE POLICY "qq_owner_write" ON quiz_questions USING (
  EXISTS (SELECT 1 FROM quizzes q WHERE q.id = quiz_id AND q.user_id = auth.uid())
);

-- user_shop: persisted shop state per user
CREATE TABLE IF NOT EXISTS user_shop (
  user_id     UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  purchased   JSONB NOT NULL DEFAULT '[]',
  active      JSONB NOT NULL DEFAULT '[]',
  spent       INT   NOT NULL DEFAULT 0,
  peak_coins  INT   NOT NULL DEFAULT 0,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE user_shop ENABLE ROW LEVEL SECURITY;
CREATE POLICY "shop_owner" ON user_shop USING (auth.uid() = user_id);
