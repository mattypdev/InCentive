-- Allow unauthenticated users (anon role) to read articles.
-- This is required so Google, AI crawlers, and logged-out visitors
-- can see the articles index and individual article pages.
--
-- Run in Supabase Dashboard → SQL Editor.

-- Add permissive SELECT policy if it doesn't already exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'articles'
      AND policyname = 'articles_public_read'
  ) THEN
    CREATE POLICY articles_public_read ON public.articles
      FOR SELECT USING (true);
  END IF;
END $$;

-- Enable RLS (no-op if already enabled; adding a permissive policy
-- before enabling means nothing is locked out mid-migration)
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
