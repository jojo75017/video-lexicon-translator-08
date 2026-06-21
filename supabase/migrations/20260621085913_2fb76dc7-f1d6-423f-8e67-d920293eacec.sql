
DROP VIEW IF EXISTS public.funnel_orders_self;
DROP VIEW IF EXISTS public.v3_installment_orders_self;

-- Fonction acheteur : ses commandes de tunnel, sans admin_notes ni metadata
CREATE OR REPLACE FUNCTION public.get_my_funnel_orders()
RETURNS TABLE(
  id uuid, email text, first_name text, product_key text, amount numeric,
  currency text, payment_method text, status text, ref_code text,
  paid_at timestamptz, created_at timestamptz, updated_at timestamptz
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT id, email, first_name, product_key, amount, currency, payment_method,
         status, ref_code, paid_at, created_at, updated_at
  FROM public.funnel_orders
  WHERE lower(email) = lower(auth.email());
$$;
REVOKE ALL ON FUNCTION public.get_my_funnel_orders() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_my_funnel_orders() TO authenticated;

-- Fonction acheteur : ses commandes échelonnées V3, sans identifiants Stripe ni metadata
CREATE OR REPLACE FUNCTION public.get_my_v3_installment_orders()
RETURNS TABLE(
  id uuid, email text, plan text, installments_total integer, installments_paid integer,
  amount_total numeric, currency text, status text, grace_until timestamptz,
  completed_at timestamptz, environment text, created_at timestamptz, updated_at timestamptz
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT id, email, plan, installments_total, installments_paid, amount_total,
         currency, status, grace_until, completed_at, environment, created_at, updated_at
  FROM public.v3_installment_orders
  WHERE lower(email) = lower(auth.email());
$$;
REVOKE ALL ON FUNCTION public.get_my_v3_installment_orders() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_my_v3_installment_orders() TO authenticated;
