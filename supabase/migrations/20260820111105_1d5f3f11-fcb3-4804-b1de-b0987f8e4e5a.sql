TRUNCATE TABLE public.email_send_log;
TRUNCATE TABLE public.email_opens;
TRUNCATE TABLE public.email_clicks;
UPDATE public.sales_prospects
SET current_step = 0,
    completed = false,
    last_email_sent_at = NULL,
    next_email_at = now()
WHERE unsubscribed = false;