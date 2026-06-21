ALTER TABLE public.sales_prospects
  ADD COLUMN IF NOT EXISTS relance_sent_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS relance_status text;