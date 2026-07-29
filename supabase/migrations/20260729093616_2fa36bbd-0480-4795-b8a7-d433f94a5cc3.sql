CREATE TABLE public.paypal_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  email text NOT NULL,
  plan_id text NOT NULL,
  plan_name text NOT NULL,
  interval text NOT NULL,
  amount numeric NOT NULL,
  currency text NOT NULL DEFAULT 'EUR',
  paypal_subscription_id text UNIQUE,
  paypal_plan_id text,
  paypal_payer_id text,
  status text NOT NULL DEFAULT 'pending',
  next_billing_at timestamptz,
  last_payment_at timestamptz,
  cancelled_at timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_paypal_subs_email ON public.paypal_subscriptions(lower(email));
CREATE INDEX idx_paypal_subs_user ON public.paypal_subscriptions(user_id);
CREATE INDEX idx_paypal_subs_status ON public.paypal_subscriptions(status);

GRANT SELECT ON public.paypal_subscriptions TO authenticated;
GRANT ALL ON public.paypal_subscriptions TO service_role;

ALTER TABLE public.paypal_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see their own PayPal subscriptions"
  ON public.paypal_subscriptions FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR lower(email) = lower(auth.email())
    OR public.has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Service role manages PayPal subscriptions"
  ON public.paypal_subscriptions FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

CREATE TRIGGER trg_paypal_subs_updated
  BEFORE UPDATE ON public.paypal_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Cache the PayPal Plan IDs we lazily create so we don't recreate them on every checkout
CREATE TABLE public.paypal_plan_cache (
  lookup_key text PRIMARY KEY,
  paypal_product_id text NOT NULL,
  paypal_plan_id text NOT NULL,
  amount numeric NOT NULL,
  currency text NOT NULL DEFAULT 'EUR',
  interval text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.paypal_plan_cache TO authenticated;
GRANT ALL ON public.paypal_plan_cache TO service_role;

ALTER TABLE public.paypal_plan_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone signed in can read PayPal plan cache"
  ON public.paypal_plan_cache FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role manages PayPal plan cache"
  ON public.paypal_plan_cache FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);