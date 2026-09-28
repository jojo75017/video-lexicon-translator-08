CREATE TABLE IF NOT EXISTS public.v3_migration_sends (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  email_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent',
  error TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (email, email_id)
);
GRANT ALL ON public.v3_migration_sends TO service_role;
GRANT SELECT ON public.v3_migration_sends TO authenticated;
ALTER TABLE public.v3_migration_sends ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view migration sends" ON public.v3_migration_sends FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));