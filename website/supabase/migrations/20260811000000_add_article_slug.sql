-- Add slug column to articles and backfill from existing titles.
-- Run this once in the Supabase Dashboard → SQL Editor.

-- 1. Add the column (nullable so backfill can run first)
ALTER TABLE articles ADD COLUMN IF NOT EXISTS slug TEXT;

-- 2. Slugify helper: lowercase, strip non-alphanumeric, collapse to hyphens
CREATE OR REPLACE FUNCTION slugify(val TEXT) RETURNS TEXT AS $$
  SELECT regexp_replace(
    regexp_replace(
      regexp_replace(lower(trim(val)), $r$['''']$r$, '', 'g'),
      '[^a-z0-9\s-]', ' ', 'g'
    ),
    '[\s-]+', '-', 'g'
  );
$$ LANGUAGE SQL IMMUTABLE STRICT;

-- 3. Backfill: set slug from title, append "-<id>" for any duplicates
UPDATE articles SET slug = slugify(title) WHERE slug IS NULL;

UPDATE articles a
SET slug = slugify(a.title) || '-' || a.id
WHERE EXISTS (
  SELECT 1 FROM articles b
  WHERE b.slug = slugify(a.title) AND b.id != a.id AND b.id < a.id
);

-- 4. Now make it non-null and unique
ALTER TABLE articles
  ALTER COLUMN slug SET NOT NULL,
  ADD CONSTRAINT articles_slug_key UNIQUE (slug);
