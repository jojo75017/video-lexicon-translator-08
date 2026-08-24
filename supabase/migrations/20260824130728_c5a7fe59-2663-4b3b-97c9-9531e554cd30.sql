CREATE TABLE public.free_trials (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  first_name text,
  started_at timestamptz NOT NULL DEFAULT now(),
  ends_at timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'actif',
  converted_at timestamptz,
  expired_at timestamptz,
  source text NOT NULL DEFAULT 'lovable',
  utm_source text,
  utm_campaign text,
  landing_url text,
  ip text,
  user_agent text,
  systemeio_contact_id text,
  systemeio_synced_at timestamptz,
  systemeio_attempts integer NOT NULL DEFAULT 0,
  systemeio_last_error text,
  systemeio_next_attempt_at timestamptz,
  client_tag_synced_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT free_trials_status_check CHECK (status IN ('actif', 'expire', 'converti'))
);

CREATE UNIQUE INDEX free_trials_email_unique ON public.free_trials (lower(email));
CREATE INDEX free_trials_status_ends_at_idx ON public.free_trials (status, ends_at);
CREATE INDEX free_trials_sync_retry_idx ON public.free_trials (systemeio_synced_at, systemeio_next_attempt_at);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.free_trials TO authenticated;
GRANT ALL ON public.free_trials TO service_role;

ALTER TABLE public.free_trials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view free trials"
  ON public.free_trials FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update free trials"
  ON public.free_trials FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete free trials"
  ON public.free_trials FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER free_trials_set_updated_at
  BEFORE UPDATE ON public.free_trials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();