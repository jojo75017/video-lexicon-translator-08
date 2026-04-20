-- Table de log des erreurs client en production
CREATE TABLE IF NOT EXISTS public.error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_email TEXT,
  user_id UUID,
  error_type TEXT NOT NULL,
  error_message TEXT NOT NULL,
  error_stack TEXT,
  context JSONB DEFAULT '{}'::jsonb,
  url TEXT,
  user_agent TEXT,
  severity TEXT NOT NULL DEFAULT 'error',
  alerted BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_error_logs_created_at ON public.error_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_error_logs_severity ON public.error_logs(severity);
CREATE INDEX IF NOT EXISTS idx_error_logs_user_email ON public.error_logs(user_email);

ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;

-- Service role insère via edge function
CREATE POLICY "Service can insert errors"
  ON public.error_logs FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Admins peuvent tout lire
CREATE POLICY "Admins can read errors"
  ON public.error_logs FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins peuvent supprimer (purge)
CREATE POLICY "Admins can delete errors"
  ON public.error_logs FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));