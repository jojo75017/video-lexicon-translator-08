SELECT cron.schedule(
  'offre-47-directe-resume',
  '*/2 * * * *',
  $$
  WITH remaining AS (
    SELECT count(*) AS n
    FROM public.sales_prospects sp
    WHERE sp.status = 'active'
      AND COALESCE(sp.unsubscribed, false) = false
      AND NOT EXISTS (
        SELECT 1 FROM public.email_send_log l
        WHERE l.recipient_email = sp.email
          AND l.template_name = 'offre-47-directe'
          AND l.status IN ('sent', 'delivered')
      )
  )
  SELECT CASE
    WHEN (SELECT n FROM remaining) > 0 AND now() < '2026-08-22 12:00:00+00'::timestamptz THEN
      (SELECT net.http_post(
        url := 'https://xvdgazrewsuaqtalqxue.supabase.co/functions/v1/send-closing-47',
        headers := '{"Content-Type": "application/json", "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2ZGdhenJld3N1YXF0YWxxeHVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNTgwMDYsImV4cCI6MjA3NzgzNDAwNn0.8LDj5M77n8yDqF4NU6O1wfzJVZojyDnT02VOBpVTQKA", "x-cron-secret": "ffc8e38b95567aa2186a3b4f438f46f88b24ff37e4c0368c"}'::jsonb,
        body := '{"mode": "send", "template": "offre-47-directe", "batch_size": 40}'::jsonb
      ))::text
    ELSE
      (SELECT cron.unschedule('offre-47-directe-resume'))::text
  END;
  $$
);