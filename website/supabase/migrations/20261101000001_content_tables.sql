-- Migration 1: content tables
-- islands, units, lessons (new); alter questions; kits

create table if not exists islands (
  slug text primary key,
  title text not null,
  tagline text not null,
  sort int not null,
  art text not null,
  color text not null,
  standards text[] not null,
  created_at timestamptz default now()
);

create table if not exists units (
  id text primary key,                        -- legacy 'u4-2'
  island text not null references islands(slug),
  slug text not null,
  sort int not null,
  title text not null,
  summary text not null default '',
  level text not null default 'beginner'
    check (level in ('beginner','intermediate','advanced')),
  cents_reward int not null default 160,
  created_at timestamptz default now(),
  unique (island, slug)
);

create table if not exists lessons (
  id text primary key,                        -- legacy 'u4-2-l2'
  unit_id text not null references units(id),
  slug text not null,
  sort int not null,
  title text not null,
  minutes int not null default 6,
  cents_reward int not null default 20,
  objective text not null default '',
  steps jsonb not null default '[]',
  fact_checked_at date,
  created_at timestamptz default now(),
  unique (unit_id, slug)
);

-- Extend questions table (existing) — safe idempotent adds
alter table questions
  add column if not exists misconceptions jsonb,
  add column if not exists hint text,
  add column if not exists tolerance numeric,
  add column if not exists partial_credit boolean default false,
  add column if not exists live_ok boolean default true,
  add column if not exists version int default 1;

create table if not exists kits (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('classroom','host','family')),
  unit_id text references units(id),
  lesson_id text references lessons(id),
  body jsonb not null,
  files jsonb not null default '[]',
  fact_checked_by uuid references profiles(id),
  fact_checked_at date,
  published boolean not null default false,
  created_at timestamptz default now()
);

-- RLS
alter table islands enable row level security;
create policy islands_public_read on islands for select using (true);

alter table units enable row level security;
create policy units_public_read on units for select using (true);

alter table lessons enable row level security;
create policy lessons_public_read on lessons for select using (true);

alter table kits enable row level security;
create policy kits_public_read on kits for select using (published = true);
create policy kits_admin_all on kits for all
  using (exists (select 1 from profiles where id = auth.uid() and is_admin = true));
