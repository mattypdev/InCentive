-- Migration 3: learning, assignments, wallet
-- attempts, answers, review_queue, assignments, class_plans,
-- host_requests, wallet_ledger, streaks, quest_progress

create table if not exists attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id),
  lesson_id text not null references lessons(id),
  started_at timestamptz default now(),
  completed_at timestamptz,
  score numeric,
  cents_awarded int default 0,
  xp_awarded int default 0,
  created_at timestamptz default now()
);

create table if not exists answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references attempts(id) on delete cascade,
  question_id uuid not null references questions(id),
  response jsonb not null,
  correct boolean not null,
  credit numeric not null,          -- 0, 0.5, or 1
  misconception text,
  ms int,
  created_at timestamptz default now()
);

create table if not exists review_queue (
  user_id uuid references profiles(id),
  question_id uuid references questions(id),
  due_on date not null,
  interval_days int not null default 1,
  primary key (user_id, question_id)
);

create table if not exists assignments (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references groups(id) on delete cascade,
  unit_id text references units(id),
  lesson_id text references lessons(id),
  assigned_by uuid not null references profiles(id),
  opens_at timestamptz default now(),
  due_at timestamptz,
  settings jsonb not null default '{"retakes":true,"best_score":true}',
  created_at timestamptz default now(),
  check ((unit_id is null) <> (lesson_id is null))
);

create table if not exists class_plans (
  group_id uuid references groups(id) on delete cascade,
  preset text,
  starts_on date,
  items jsonb not null default '[]',
  created_at timestamptz default now(),
  primary key (group_id)
);

create table if not exists host_requests (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references groups(id),
  chapter_id uuid not null references chapters(id),
  topic_unit_id text references units(id),
  wanted_at timestamptz not null,
  notes text,
  status text not null default 'open'
    check (status in ('open','claimed','confirmed','done','cancelled')),
  host_id uuid references profiles(id),
  session_id uuid,
  created_at timestamptz default now()
);

create table if not exists wallet_ledger (
  id bigserial primary key,
  user_id uuid not null references profiles(id),
  cents int not null default 0,
  xp int not null default 0,
  reason text not null,
  ref text,
  created_at timestamptz default now()
);

-- Unique index prevents double-awarding the same ref per reason
create unique index if not exists wallet_once
  on wallet_ledger (user_id, reason, ref)
  where ref is not null;

create table if not exists streaks (
  user_id uuid primary key references profiles(id),
  current int not null default 0,
  longest int not null default 0,
  last_active_on date,
  freezes int not null default 0,
  created_at timestamptz default now()
);

create table if not exists quest_progress (
  user_id uuid references profiles(id),
  quest_key text,
  progress int not null default 0,
  completed_at timestamptz,
  primary key (user_id, quest_key)
);

-- RLS
alter table attempts enable row level security;
create policy attempts_self on attempts for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy attempts_teacher on attempts for select
  using (
    exists (
      select 1 from group_members t
      join group_members s on s.group_id = t.group_id
      join groups g on g.id = t.group_id
      where g.kind = 'class' and g.archived_at is null
        and t.user_id = auth.uid() and t.role in ('owner','co_teacher')
        and s.user_id = attempts.user_id and s.role = 'student'
    )
  );

alter table answers enable row level security;
create policy answers_self on answers for all
  using (
    exists (select 1 from attempts a where a.id = attempt_id and a.user_id = auth.uid())
  );

alter table review_queue enable row level security;
create policy rq_self on review_queue for all using (user_id = auth.uid());

alter table wallet_ledger enable row level security;
create policy wl_self on wallet_ledger for select using (user_id = auth.uid());

alter table streaks enable row level security;
create policy streaks_self on streaks for all using (user_id = auth.uid());

alter table quest_progress enable row level security;
create policy qp_self on quest_progress for all using (user_id = auth.uid());
