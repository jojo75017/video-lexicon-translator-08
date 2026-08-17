ALTER TABLE public.email_send_log ADD COLUMN IF NOT EXISTS provider_message_id TEXT;
CREATE INDEX IF NOT EXISTS email_send_log_provider_message_id_idx ON public.email_send_log (provider_message_id);