ALTER TABLE public.subscribers DROP CONSTRAINT IF EXISTS subscribers_status_check;
ALTER TABLE public.subscribers ADD CONSTRAINT subscribers_status_check
  CHECK (status = ANY (ARRAY['active'::text, 'expired'::text, 'cancelled'::text, 'trialing'::text, 'trial_expired'::text]));