ALTER TABLE public.sales_prospects ADD COLUMN IF NOT EXISTS segment_lancement text;
CREATE INDEX IF NOT EXISTS sales_prospects_segment_lancement_idx ON public.sales_prospects(segment_lancement);

CREATE TABLE public.offre_lancement_sends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  email_id text NOT NULL DEFAULT 'offre-lancement-47',
  batch_index integer,
  status text NOT NULL DEFAULT 'sent',
  error text,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (email, email_id)
);
GRANT SELECT ON public.offre_lancement_sends TO authenticated;
GRANT ALL ON public.offre_lancement_sends TO service_role;
ALTER TABLE public.offre_lancement_sends ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read offre_lancement_sends" ON public.offre_lancement_sends
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER offre_lancement_sends_set_updated_at BEFORE UPDATE ON public.offre_lancement_sends
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();