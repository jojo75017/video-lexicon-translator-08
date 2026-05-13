CREATE TABLE public.admin_launches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  launch_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'planned',
  notes TEXT,
  color TEXT DEFAULT '#008296',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_launches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage launches"
ON public.admin_launches
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_admin_launches_updated_at
BEFORE UPDATE ON public.admin_launches
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_admin_launches_date ON public.admin_launches(launch_date);