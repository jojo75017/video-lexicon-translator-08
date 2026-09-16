ALTER TABLE public.v3_installment_orders
  DROP CONSTRAINT IF EXISTS v3_installment_orders_plan_check;

ALTER TABLE public.v3_installment_orders
  ADD CONSTRAINT v3_installment_orders_plan_check
  CHECK (
    plan = ANY (ARRAY[
      'full_1x'::text, 'full_3x'::text, 'full_4x'::text,
      'base_1x'::text, 'base_3x'::text,
      'v2_1x'::text, 'v2_2x'::text, 'v2_3x'::text,
      'pack_bd_comic'::text, 'pack_cover_studio_pro'::text,
      'pack_ebook_version_longue'::text,
      'v3_plume_monthly'::text, 'v3_plume_annual'::text,
      'v3_edition_monthly'::text, 'v3_edition_annual'::text,
      'v3_plume_monthly_legacy'::text, 'v3_plume_annual_legacy'::text,
      'v3_edition_monthly_legacy'::text, 'v3_edition_annual_legacy'::text
    ])
  );