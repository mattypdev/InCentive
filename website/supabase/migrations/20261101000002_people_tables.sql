-- Migration 2: people and groups
-- Extend profiles; add chapters, schools, teacher_verifications,
-- parent_consents, host_applications, groups, group_members,
-- family_links, link_codes

alter table profiles
  add column if not exists first_name text,
  add column if not exists last_initial text,
  add column if not exists birth_year int,
  add column if not exists birth_month int,
  add column if not exists is_teacher boolean default false,
  add column if not exists is_host boolean default false,
  add column if not exists is_parent boolean default false,
  add column if not exists is_chapter_lead boolean default false,
  add column if not exists is_admin boolean default false,
  add column if not exists is_guest boolean default false,
  add column if not exists consent_status text default 'not_required'
    check (consent_status in ('not_required','pending','approved','declined','school')),
  add column if not exists timezone text default 'America/Los_Angeles',
  add column if not exists chapter_id uuid;

create table if not exists chapters (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text,
  state text,
  lead_id uuid references profiles(id),
  created_at timestamptz default now()
);

create table if not exists schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text,
  state text,
  email_domains text[] default '{}',
  created_at timestamptz default now()
);

create table if not exists teacher_verifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id),
  school_id uuid references schools(id),
  method text not null check (method in ('email_domain','chapter_lead')),
  status text not null default 'pending'
    check (status in ('pending','approved','rejected')),
  reviewed_by uuid references profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists parent_consents (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references profiles(id),
  parent_email text not null,
  token_hash text not null,
  status text not null default 'pending'
    check (status in ('pending','approved','declined','expired')),
  decided_at timestamptz,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);

create table if not exists host_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id),
  chapter_id uuid references chapters(id),
  training_done_at timestamptz,
  cohost_session_id uuid,
  status text not null default 'applied'
    check (status in ('applied','training','cohosting','approved','rejected')),
  reviewed_by uuid references profiles(id),
  created_at timestamptz default now()
);

create table if not exists groups (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('class','session','family')),
  name text not null,
  code text unique,
  owner_id uuid not null references profiles(id),
  school_id uuid references schools(id),
  chapter_id uuid references chapters(id),
  settings jsonb not null default '{}',
  archived_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists group_members (
  group_id uuid references groups(id) on delete cascade,
  user_id uuid references profiles(id),
  role text not null check (role in ('owner','co_teacher','student','host','cohost','parent','child')),
  joined_at timestamptz default now(),
  primary key (group_id, user_id)
);

create table if not exists family_links (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references profiles(id),
  child_id uuid not null references profiles(id),
  share jsonb not null default '{"island":true,"streak":true,"scores":false,"rank":false}',
  status text not null default 'active'
    check (status in ('active','revoked')),
  created_at timestamptz default now(),
  unique (parent_id, child_id)
);

create table if not exists link_codes (
  code text primary key,
  child_id uuid not null references profiles(id),
  share jsonb not null,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz default now()
);

-- RLS policies (minimal — full policies added with Server Actions)
alter table chapters enable row level security;
create policy chapters_public_read on chapters for select using (true);

alter table schools enable row level security;
create policy schools_public_read on schools for select using (true);

alter table groups enable row level security;
create policy groups_member_read on groups for select
  using (exists (select 1 from group_members where group_id = id and user_id = auth.uid()));
create policy groups_owner_write on groups for all
  using (owner_id = auth.uid());

alter table group_members enable row level security;
create policy gm_self on group_members for select using (user_id = auth.uid());

alter table family_links enable row level security;
create policy fl_own on family_links for all
  using (parent_id = auth.uid() or child_id = auth.uid());

alter table link_codes enable row level security;
create policy lc_own on link_codes for select using (child_id = auth.uid());
