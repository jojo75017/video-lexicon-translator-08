CREATE TABLE public.v3_installment_orders (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  plan text NOT NULL,
  installments_total integer NOT NULL DEFAULT 1,
  installments_paid integer NOT NULL DEFAULT 0,
  amount_total numeric(10,2) NOT NULL,
  currency text NOT NULL DEFAULT 'EUR',
  status text NOT NULL DEFAULT 'pending',
  stripe_session_id text,
  stripe_subscription_id text,
  stripe_customer_id text,
  grace_until timestamptz,
  completed_at timestamptz,
  environment text NOT NULL DEFAULT 'sandbox',
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT v3_installment_orders_plan_check CHECK (plan = ANY (ARRAY['full_1x','full_4x','full_6x'])),
  CONSTRAINT v3_installment_orders_status_check CHECK (status = ANY (ARRAY['pending','active','past_due','completed','cancelled']))
);

CREATE INDEX idx_v3_installment_orders_email ON public.v3_installment_orders (lower(email));
CREATE INDEX idx_v3_installment_orders_sub ON public.v3_installment_orders (stripe_subscription_id);
CREATE INDEX idx_v3_installment_orders_session ON public.v3_installment_orders (stripe_session_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.v3_installment_orders TO authenticated;
GRANT ALL ON public.v3_installment_orders TO service_role;

ALTER TABLE public.v3_installment_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage v3 installment orders"
  ON public.v3_installment_orders FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Buyers see their own v3 installment orders"
  ON public.v3_installment_orders FOR SELECT
  TO authenticated
  USING (lower(email) = lower(auth.email()));

CREATE TRIGGER v3_installment_orders_set_updated_at
  BEFORE UPDATE ON public.v3_installment_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();