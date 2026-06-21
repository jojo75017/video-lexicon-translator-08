
-- ============ v3_gift_cards : accès admin explicite ============
DROP POLICY IF EXISTS "Admins manage gift cards" ON public.v3_gift_cards;
CREATE POLICY "Admins manage gift cards"
  ON public.v3_gift_cards FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
GRANT SELECT, INSERT, UPDATE, DELETE ON public.v3_gift_cards TO authenticated;
GRANT ALL ON public.v3_gift_cards TO service_role;

-- ============ funnel_orders : vue acheteur sans colonnes sensibles ============
DROP POLICY IF EXISTS "Buyers see their own orders" ON public.funnel_orders;

CREATE OR REPLACE VIEW public.funnel_orders_self
WITH (security_invoker = off) AS
  SELECT id, email, first_name, product_key, amount, currency,
         payment_method, status, ref_code, paid_at, created_at, updated_at
  FROM public.funnel_orders
  WHERE lower(email) = lower(auth.email());
GRANT SELECT ON public.funnel_orders_self TO authenticated;

-- ============ v3_installment_orders : vue acheteur sans identifiants Stripe ============
DROP POLICY IF EXISTS "Buyers see their own v3 installment orders" ON public.v3_installment_orders;

CREATE OR REPLACE VIEW public.v3_installment_orders_self
WITH (security_invoker = off) AS
  SELECT id, email, plan, installments_total, installments_paid, amount_total,
         currency, status, grace_until, completed_at, environment, created_at, updated_at
  FROM public.v3_installment_orders
  WHERE lower(email) = lower(auth.email());
GRANT SELECT ON public.v3_installment_orders_self TO authenticated;

-- ============ Bucket videos : upload réservé aux admins ============
DROP POLICY IF EXISTS "Authenticated users can upload videos" ON storage.objects;
CREATE POLICY "Admins can upload videos"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'videos' AND public.has_role(auth.uid(), 'admin'));
