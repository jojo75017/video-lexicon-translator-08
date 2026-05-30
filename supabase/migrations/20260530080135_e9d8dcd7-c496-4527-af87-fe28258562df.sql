ALTER TABLE public.beta_promo_codes
  ADD COLUMN IF NOT EXISTS sent_to_email text,
  ADD COLUMN IF NOT EXISTS sent_at timestamptz;