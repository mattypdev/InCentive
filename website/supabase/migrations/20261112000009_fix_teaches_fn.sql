-- Fix teaches() to also check groups.owner_id, so teachers who own a class
-- (but have no group_members row) still pass the RLS check.
CREATE OR REPLACE FUNCTION public.teaches(gid uuid)
  RETURNS boolean
  LANGUAGE sql
  STABLE SECURITY DEFINER
AS $$
  select exists (
    select 1 from group_members
    where group_id = gid
      and user_id = auth.uid()
      and role in ('owner', 'co_teacher')
  )
  or exists (
    select 1 from groups
    where id = gid
      and owner_id = auth.uid()
  )
$$;

-- Backfill: for every class whose owner lacks a group_members owner row, insert one.
INSERT INTO group_members (group_id, user_id, role)
SELECT g.id, g.owner_id, 'owner'
FROM groups g
WHERE g.kind = 'class'
  AND g.owner_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM group_members gm
    WHERE gm.group_id = g.id
      AND gm.user_id = g.owner_id
      AND gm.role = 'owner'
  )
ON CONFLICT DO NOTHING;
