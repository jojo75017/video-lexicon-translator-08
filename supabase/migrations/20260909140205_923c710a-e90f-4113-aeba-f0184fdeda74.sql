ALTER TABLE public.ebook_projects
ADD COLUMN IF NOT EXISTS draft_state jsonb NOT NULL DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.ebook_projects.draft_state IS 'Private V3 creation draft snapshot: brief, source passages, corrections, facts, conversation and active step.';