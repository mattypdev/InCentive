-- Migration 4: live sessions, family, comms

create table if not exists live_sessions (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references groups(id),
  host_id uuid not null references profiles(id),
  cohost_ids uuid[] default '{}',
  unit_id text references units(id),
  length_min int,
  audience text,
  devices text,
  run_of_show jsonb not null,
  question_ids uuid[] not null,
  check_question_ids uuid[] default '{}',
  code text unique not null,
  status text not null default 'draft'
    check (status in ('draft','lobby','live','ended')),
  state jsonb not null default '{}',
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists live_players (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references live_sessions(id) on delete cascade,
  user_id uuid references profiles(id),
  nickname text,
  team text,
  removed boolean default false,
  joined_at timestamptz default now()
);

create table if not exists live_responses (
  id bigserial primary key,
  session_id uuid not null references live_sessions(id) on delete cascade,
  player_id uuid references live_players(id),
  question_id uuid not null references questions(id),
  phase text not null check (phase in ('pre','game','post')),
  answer jsonb not null,
  correct boolean not null,
  points int default 0,
  ms int,
  source text not null default 'phone' check (source in ('phone','paper')),
  paper_count int,
  created_at timestamptz default now()
);

create table if not exists session_feedback (
  session_id uuid references live_sessions(id),
  player_id uuid references live_players(id),
  stars int check (stars between 1 and 5),
  primary key (session_id, player_id)
);

create table if not exists volunteer_hours (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id),
  session_id uuid not null references live_sessions(id),
  hours numeric(4,2) not null,
  role text not null,
  verified_by uuid references profiles(id),
  verified_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists family_challenges (
  id uuid primary key default gen_random_uuid(),
  family_group_id uuid not null references groups(id),
  challenge_key text not null,
  starts_on date not null,
  completed_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists challenge_checkins (
  challenge_id uuid references family_challenges(id) on delete cascade,
  user_id uuid references profiles(id),
  day int check (day between 1 and 7),
  note jsonb,
  primary key (challenge_id, user_id, day)
);

create table if not exists family_promises (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references profiles(id),
  child_id uuid not null references profiles(id),
  island text references islands(slug),
  text text not null,
  fulfilled_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists email_log (
  id bigserial primary key,
  to_hash text not null,
  template text not null,
  user_id uuid,
  sent_at timestamptz default now(),
  provider_id text
);

create table if not exists events (
  id bigserial primary key,
  user_id uuid,
  name text not null,
  props jsonb default '{}',
  at timestamptz default now()
);

-- RLS
alter table live_sessions enable row level security;
create policy ls_public_read on live_sessions for select using (status != 'draft');
create policy ls_host_all on live_sessions for all
  using (host_id = auth.uid() or auth.uid() = any(cohost_ids));

alter table live_players enable row level security;
create policy lp_self on live_players for select
  using (user_id = auth.uid() or
    exists (select 1 from live_sessions s where s.id = session_id
      and (s.host_id = auth.uid() or auth.uid() = any(s.cohost_ids))));

alter table live_responses enable row level security;
create policy lr_host on live_responses for select
  using (exists (select 1 from live_sessions s where s.id = session_id
    and (s.host_id = auth.uid() or auth.uid() = any(s.cohost_ids))));
create policy lr_self on live_responses for select
  using (exists (select 1 from live_players p where p.id = player_id and p.user_id = auth.uid()));

alter table family_challenges enable row level security;
create policy fc_member on family_challenges for all
  using (exists (select 1 from group_members where group_id = family_group_id and user_id = auth.uid()));

alter table family_promises enable row level security;
create policy fp_own on family_promises for all
  using (parent_id = auth.uid() or child_id = auth.uid());

alter table events enable row level security;
create policy events_self on events for select using (user_id = auth.uid());
-- inserts go through server actions (service role)
