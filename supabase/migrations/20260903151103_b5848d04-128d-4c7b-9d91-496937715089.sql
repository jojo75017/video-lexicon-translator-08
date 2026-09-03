ALTER TABLE public.v3_installment_orders DROP CONSTRAINT IF EXISTS v3_installment_orders_plan_check;

ALTER TABLE public.v3_installment_orders
  ADD CONSTRAINT v3_installment_orders_plan_check
  CHECK (
    plan = ANY (ARRAY['full_1x'::text, 'full_3x'::text, 'full_4x'::text, 'base_1x'::text, 'base_3x'::text, 'v2_1x'::text, 'v2_2x'::text, 'v2_3x'::text])
    OR plan LIKE 'pack\_%'
  );