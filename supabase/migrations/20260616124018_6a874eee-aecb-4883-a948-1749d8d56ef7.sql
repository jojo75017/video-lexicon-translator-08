CREATE TABLE public.email_clicks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prospect_email text NOT NULL,
  email_step integer,
  clicked_url text NOT NULL,
  user_agent text,
  clicked_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.email_clicks TO authenticated;
GRANT ALL ON public.email_clicks TO service_role;

ALTER TABLE public.email_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view email clicks"
ON public.email_clicks FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service can insert email clicks"
ON public.email_clicks FOR INSERT TO service_role
WITH CHECK (true);

CREATE INDEX idx_email_clicks_email ON public.email_clicks (lower(prospect_email));