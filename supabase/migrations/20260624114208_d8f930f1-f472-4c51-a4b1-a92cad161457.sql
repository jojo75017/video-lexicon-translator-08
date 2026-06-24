ALTER TABLE public.email_opens ADD COLUMN IF NOT EXISTS template_name text;
ALTER TABLE public.email_clicks ADD COLUMN IF NOT EXISTS template_name text;

CREATE TABLE IF NOT EXISTS public.email_send_log (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id text,
  template_name text,
  recipient_email text NOT NULL,
  status text NOT NULL DEFAULT 'sent',
  last_event text,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_email_send_log_message_id ON public.email_send_log(message_id);
CREATE INDEX IF NOT EXISTS idx_email_send_log_template ON public.email_send_log(template_name);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.email_send_log TO authenticated;
GRANT ALL ON public.email_send_log TO service_role;

ALTER TABLE public.email_send_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read email send log"
ON public.email_send_log FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_email_send_log_updated_at
BEFORE UPDATE ON public.email_send_log
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();