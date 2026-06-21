
CREATE TABLE IF NOT EXISTS public.app_secrets (
  key text PRIMARY KEY,
  value text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.app_secrets TO service_role;
ALTER TABLE public.app_secrets ENABLE ROW LEVEL SECURITY;
-- Aucune policy : seul le service_role (qui contourne la RLS) peut lire/écrire.

INSERT INTO public.app_secrets (key, value)
VALUES ('cron_secret', 'ffc8e38b95567aa2186a3b4f438f46f88b24ff37e4c0368c')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Mise à jour de la tâche planifiée pour transmettre le secret
SELECT cron.unschedule('sales-email-auto-send');
SELECT cron.schedule(
  'sales-email-auto-send',
  '*/10 * * * *',
  $$
  SELECT net.http_post(
    url:='https://xvdgazrewsuaqtalqxue.supabase.co/functions/v1/send-sales-email',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2ZGdhenJld3N1YXF0YWxxeHVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNTgwMDYsImV4cCI6MjA3NzgzNDAwNn0.8LDj5M77n8yDqF4NU6O1wfzJVZojyDnT02VOBpVTQKA", "x-cron-secret": "ffc8e38b95567aa2186a3b4f438f46f88b24ff37e4c0368c"}'::jsonb,
    body:='{"mode": "auto"}'::jsonb
  ) AS request_id;
  $$
);
