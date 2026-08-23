ALTER TABLE public.sales_prospects ADD COLUMN IF NOT EXISTS systemeio_sync_error text;
ALTER TABLE public.funnel_leads ADD COLUMN IF NOT EXISTS systemeio_sync_error text;