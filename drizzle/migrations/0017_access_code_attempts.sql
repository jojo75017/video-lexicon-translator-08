CREATE TABLE public.access_code_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  ip text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.access_code_attempts TO service_role;
ALTER TABLE public.access_code_attempts ENABLE ROW LEVEL SECURITY;
CREATE INDEX access_code_attempts_email_idx ON public.access_code_attempts (email, created_at DESC);
CREATE INDEX access_code_attempts_ip_idx ON public.access_code_attempts (ip, created_at DESC);