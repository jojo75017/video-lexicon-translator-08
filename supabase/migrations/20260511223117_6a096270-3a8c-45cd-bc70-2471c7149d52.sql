-- =============================================================================
-- TUNNEL DE VENTE AFFILIÉ — Migration
-- =============================================================================

-- 1) funnel_leads : visiteurs qui ont laissé leur email sur /promo
CREATE TABLE public.funnel_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  first_name text,
  ref_code text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  landing_url text,
  user_agent text,
  ip text,
  lead_magnet_sent_at timestamptz,
  sequence_started boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX funnel_leads_email_idx ON public.funnel_leads (lower(email));
CREATE INDEX funnel_leads_ref_code_idx ON public.funnel_leads (ref_code);

ALTER TABLE public.funnel_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a lead"
  ON public.funnel_leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins manage leads"
  ON public.funnel_leads FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER funnel_leads_set_updated_at
  BEFORE UPDATE ON public.funnel_leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2) affiliate_clicks : analytics clics affiliés
CREATE TABLE public.affiliate_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ref_code text NOT NULL,
  landing_path text,
  referrer text,
  user_agent text,
  ip text,
  clicked_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX affiliate_clicks_ref_code_idx ON public.affiliate_clicks (ref_code);
CREATE INDEX affiliate_clicks_clicked_at_idx ON public.affiliate_clicks (clicked_at DESC);

ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can log a click"
  ON public.affiliate_clicks FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins read all clicks"
  ON public.affiliate_clicks FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Affiliates can read clicks on their own ref_code
CREATE POLICY "Affiliates read own clicks"
  ON public.affiliate_clicks FOR SELECT
  TO authenticated
  USING (
    ref_code IN (SELECT code FROM public.referral_codes WHERE user_id = auth.uid())
  );

-- 3) funnel_orders : commandes du tunnel
CREATE TABLE public.funnel_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  first_name text,
  product_key text NOT NULL CHECK (product_key IN ('main', 'upsell_license', 'upsell_templates')),
  amount numeric(10,2) NOT NULL,
  currency text NOT NULL DEFAULT 'EUR',
  payment_method text NOT NULL CHECK (payment_method IN ('paypal', 'virement')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'refunded', 'cancelled')),
  ref_code text,
  paid_at timestamptz,
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX funnel_orders_email_idx ON public.funnel_orders (lower(email));
CREATE INDEX funnel_orders_ref_code_idx ON public.funnel_orders (ref_code);
CREATE INDEX funnel_orders_status_idx ON public.funnel_orders (status);

ALTER TABLE public.funnel_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create an order"
  ON public.funnel_orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Buyers see their own orders"
  ON public.funnel_orders FOR SELECT
  TO authenticated
  USING (lower(email) = lower(auth.email()));

CREATE POLICY "Admins manage orders"
  ON public.funnel_orders FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER funnel_orders_set_updated_at
  BEFORE UPDATE ON public.funnel_orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4) Étendre referrals
ALTER TABLE public.referrals
  ADD COLUMN IF NOT EXISTS commission_rate numeric NOT NULL DEFAULT 0.30,
  ADD COLUMN IF NOT EXISTS funnel_order_id uuid;

CREATE INDEX IF NOT EXISTS referrals_funnel_order_id_idx ON public.referrals (funnel_order_id);

-- 5) Trigger : à chaque passage en 'paid' avec ref_code, créer la commission
CREATE OR REPLACE FUNCTION public.handle_funnel_order_paid()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_referrer_id uuid;
  v_rate numeric := 0.30;
BEGIN
  -- Only fire when transitioning to 'paid' for the first time
  IF NEW.status = 'paid'
     AND (OLD.status IS DISTINCT FROM 'paid')
     AND NEW.ref_code IS NOT NULL
     AND length(NEW.ref_code) > 0 THEN

    SELECT user_id INTO v_referrer_id
    FROM public.referral_codes
    WHERE code = NEW.ref_code
    LIMIT 1;

    IF v_referrer_id IS NOT NULL THEN
      -- Avoid duplicate commissions for the same order
      IF NOT EXISTS (
        SELECT 1 FROM public.referrals WHERE funnel_order_id = NEW.id
      ) THEN
        INSERT INTO public.referrals (
          referrer_id,
          referred_email,
          status,
          commission_amount,
          commission_rate,
          funnel_order_id,
          converted_at
        ) VALUES (
          v_referrer_id,
          NEW.email,
          'converted',
          ROUND(NEW.amount * v_rate, 2),
          v_rate,
          NEW.id,
          now()
        );
      END IF;

      -- Stamp paid_at if missing
      IF NEW.paid_at IS NULL THEN
        NEW.paid_at := now();
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER funnel_orders_on_paid
  BEFORE UPDATE ON public.funnel_orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_funnel_order_paid();
