UPDATE public.email_send_log
SET status = 'failed',
    error_message = 'Quota épuisé — reprise manuelle après upgrade'
WHERE template_name = 'offre-47-directe'
  AND status = 'pending';