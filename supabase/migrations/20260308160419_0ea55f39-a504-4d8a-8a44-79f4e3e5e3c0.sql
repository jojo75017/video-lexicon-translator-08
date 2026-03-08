CREATE TABLE public.email_opens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_email text NOT NULL,
  email_step integer NOT NULL,
  opened_at timestamptz NOT NULL DEFAULT now(),
  user_agent text,
  ip_address text
);

ALTER TABLE public.email_opens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view email opens"
  ON public.email_opens FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service can insert email opens"
  ON public.email_opens FOR INSERT
  WITH CHECK (true);