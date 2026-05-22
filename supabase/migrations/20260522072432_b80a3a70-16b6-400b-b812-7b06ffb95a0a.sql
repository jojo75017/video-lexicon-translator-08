ALTER TABLE public.funnel_orders DROP CONSTRAINT IF EXISTS funnel_orders_product_key_check;
ALTER TABLE public.funnel_orders ADD CONSTRAINT funnel_orders_product_key_check
  CHECK (product_key = ANY (ARRAY['main'::text, 'upsell_license'::text, 'upsell_templates'::text, 'coaching_vip'::text]));