ALTER TABLE public.subscribers ADD COLUMN IF NOT EXISTS trial_ends_at timestamptz;
ALTER TABLE public.subscribers ADD COLUMN IF NOT EXISTS stripe_customer_id text;
ALTER TABLE public.subscribers ADD COLUMN IF NOT EXISTS stripe_subscription_id text;