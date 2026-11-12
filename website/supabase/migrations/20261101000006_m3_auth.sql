-- Migration 6: M3 auth helpers, RLS functions, class accounts, host mode prep

-- ── RLS helper functions ─────────────────────────────────────────────────────

create or replace function is_member(gid uuid)
returns boolean language sql stable security definer as $$
  select exists (
    select 1 from group_members
    where group_id = gid and user_id = auth.uid()
  )
$$;

create or replace function teaches(gid uuid)
returns boolean language sql stable security definer as $$
  select exists (
    select 1 from group_members
    where group_id = gid and user_id = auth.uid()
      and role in ('owner','co_teacher')
  )
$$;

create or replace function parent_can_see(uid uuid)
returns boolean language sql stable security definer as $$
  select exists (
    select 1 from family_links
    where parent_id = auth.uid() and child_id = uid and status = 'active'
  )
$$;

-- ── Extend profiles for class accounts ──────────────────────────────────────

alter table profiles
  add column if not exists class_pin text,
  add column if not exists class_email text,
  add column if not exists is_class_account boolean default false,
  add column if not exists sound_enabled boolean default true;

-- ── Insert policy for groups (teachers create classes) ───────────────────────

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'groups' and policyname = 'groups_owner_insert'
  ) then
    create policy groups_owner_insert on groups for insert
      with check (owner_id = auth.uid());
  end if;
end $$;

-- ── RLS for live_responses (insert for players) ──────────────────────────────

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'live_responses' and policyname = 'lr_insert_self'
  ) then
    create policy lr_insert_self on live_responses for insert
      with check (
        exists (
          select 1 from live_players p
          where p.id = player_id and p.user_id = auth.uid()
        )
      );
  end if;
end $$;

-- ── RLS for live_players (players join sessions) ─────────────────────────────

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'live_players' and policyname = 'lp_insert_self'
  ) then
    create policy lp_insert_self on live_players for insert
      with check (user_id = auth.uid() or user_id is null);
  end if;
end $$;

-- ── RLS for parent_consents ───────────────────────────────────────────────────

alter table parent_consents enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'parent_consents' and policyname = 'pc_child_read'
  ) then
    create policy pc_child_read on parent_consents for select
      using (child_id = auth.uid());
  end if;
end $$;

-- ── Host applications RLS ────────────────────────────────────────────────────

alter table host_applications enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'host_applications' and policyname = 'ha_own'
  ) then
    create policy ha_own on host_applications for all
      using (user_id = auth.uid());
  end if;
end $$;

-- ── Cleanup function for expired under-13 pending accounts ───────────────────
-- Runs via pg_cron or manual invocation. Deletes profiles where consent is
-- pending AND consent row has been expired for > 7 days.

create or replace function cleanup_expired_consents()
returns void language plpgsql security definer as $$
begin
  -- Mark parent_consents as expired when past expires_at
  update parent_consents
  set status = 'expired'
  where status = 'pending' and expires_at < now();

  -- profiles with consent_status = 'pending' whose consent is expired
  -- are anonymised (name cleared, profile data removed)
  -- Actual auth deletion requires admin API; we just mark them declined.
  update profiles p
  set consent_status = 'declined',
      first_name = null,
      last_initial = null,
      birth_year = null,
      birth_month = null
  where p.consent_status = 'pending'
    and not exists (
      select 1 from parent_consents pc
      where pc.child_id = p.id and pc.status = 'pending'
    );
end;
$$;

-- ── Host Mode: extend live_sessions with session-machine state ───────────────

alter table live_sessions
  add column if not exists phase text not null default 'draft'
    check (phase in (
      'draft','lobby','before_check','question','reveal',
      'discussion','leaderboard','after_check','ended'
    )),
  add column if not exists current_question_index int default 0,
  add column if not exists question_started_at timestamptz,
  add column if not exists question_limit_ms int default 30000,
  add column if not exists paper_votes jsonb default '{}';

-- ── session_scores view for leaderboard ─────────────────────────────────────

create or replace view session_scores as
select
  lp.session_id,
  lp.id as player_id,
  lp.user_id,
  coalesce(lp.nickname, p.first_name || ' ' || coalesce(p.last_initial, '')) as display_name,
  lp.team,
  sum(lr.points) as total_points,
  count(lr.id) filter (where lr.correct) as correct_count,
  count(lr.id) as answer_count
from live_players lp
left join live_responses lr on lr.player_id = lp.id and lr.phase = 'game'
left join profiles p on p.id = lp.user_id
where not lp.removed
group by lp.session_id, lp.id, lp.user_id, lp.nickname, p.first_name, p.last_initial, lp.team;
