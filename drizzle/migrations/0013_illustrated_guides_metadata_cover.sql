ALTER TABLE public.illustrated_guides
  ADD COLUMN IF NOT EXISTS description text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS categories text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS cover_url text;