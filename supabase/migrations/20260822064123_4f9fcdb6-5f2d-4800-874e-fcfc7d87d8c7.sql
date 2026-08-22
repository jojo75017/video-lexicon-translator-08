CREATE UNIQUE INDEX IF NOT EXISTS idx_email_send_log_pending_message_id
  ON public.email_send_log (template_name, message_id)
  WHERE status = 'pending';