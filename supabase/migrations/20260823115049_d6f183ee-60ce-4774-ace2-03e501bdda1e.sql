ALTER TABLE public.sales_prospects ADD COLUMN IF NOT EXISTS systemeio_synced_at timestamptz;
ALTER TABLE public.funnel_leads ADD COLUMN IF NOT EXISTS systemeio_synced_at timestamptz;