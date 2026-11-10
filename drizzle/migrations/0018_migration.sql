CREATE TABLE public.checkout_intents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  plan_name text,
  price_id text,
  page_path text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.checkout_intents TO authenticated;
GRANT ALL ON public.checkout_intents TO service_role;

ALTER TABLE public.checkout_intents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read checkout intents"
  ON public.checkout_intents FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));