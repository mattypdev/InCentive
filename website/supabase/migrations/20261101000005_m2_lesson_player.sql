-- M2: lesson player support
-- 1. step_index on attempts for autosave/resume
-- 2. answers.question_id → text so inline question refs work (no UUID FK needed)

alter table attempts add column if not exists step_index int not null default 0;
alter table attempts add column if not exists state jsonb;

-- Drop UUID FK and convert question_id to text
alter table answers drop constraint if exists answers_question_id_fkey;
alter table answers alter column question_id type text using question_id::text;
