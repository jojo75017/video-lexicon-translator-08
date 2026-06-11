CREATE TABLE public.ambassador_outreach (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL,
  handle TEXT NOT NULL,
  platform TEXT NOT NULL DEFAULT 'instagram',
  niche TEXT,
  status TEXT NOT NULL DEFAULT 'a_contacter',
  email TEXT,
  notes TEXT,
  last_contact_at TIMESTAMP WITH TIME ZONE,
  follow_up_at TIMESTAMP WITH TIME ZONE,
  source TEXT NOT NULL DEFAULT 'manual',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.ambassador_outreach TO authenticated;
GRANT ALL ON public.ambassador_outreach TO service_role;

ALTER TABLE public.ambassador_outreach ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners manage their own outreach"
  ON public.ambassador_outreach FOR ALL
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE TRIGGER update_ambassador_outreach_updated_at
  BEFORE UPDATE ON public.ambassador_outreach
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_ambassador_outreach_owner ON public.ambassador_outreach(owner_id);