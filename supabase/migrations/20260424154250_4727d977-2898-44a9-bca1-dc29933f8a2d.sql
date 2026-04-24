ALTER TABLE public.subscribers
ADD COLUMN IF NOT EXISTS license_type TEXT NOT NULL DEFAULT 'commercial'
CHECK (license_type IN ('commercial', 'extended'));

CREATE INDEX IF NOT EXISTS idx_subscribers_license_type ON public.subscribers(license_type);