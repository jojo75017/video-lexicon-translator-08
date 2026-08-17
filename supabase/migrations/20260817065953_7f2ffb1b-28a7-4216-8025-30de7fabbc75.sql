UPDATE public.email_send_log
SET provider_message_id = message_id
WHERE provider_message_id IS NULL
  AND message_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';