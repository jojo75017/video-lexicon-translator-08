ALTER TABLE public.cover_projects
  ADD COLUMN IF NOT EXISTS kdp_config jsonb,
  ADD COLUMN IF NOT EXISTS kdp_geometry jsonb,
  ADD COLUMN IF NOT EXISTS kdp_rules_version text;