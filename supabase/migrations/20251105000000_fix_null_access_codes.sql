-- Backfill any null access codes
UPDATE public.subscribers
SET access_code = 'EBK-' || upper(substring(md5(random()::text) from 1 for 6))
WHERE access_code IS NULL;

-- Make access_code NOT NULL
ALTER TABLE public.subscribers ALTER COLUMN access_code SET NOT NULL;

-- Ensure it's unique (it already should be, but let's be sure)
-- The unique constraint already exists from previous migration
