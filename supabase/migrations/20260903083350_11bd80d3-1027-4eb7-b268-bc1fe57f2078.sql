select cron.unschedule('relance-panier-abandonne-quotidien') where exists (select 1 from cron.job where jobname='relance-panier-abandonne-quotidien');

SELECT cron.schedule(
  'relance-panier-abandonne-quotidien',
  '0 9 * * *',
  $$
  SELECT net.http_post(
    url := 'https://xvdgazrewsuaqtalqxue.supabase.co/functions/v1/relance-panier-abandonne',
    headers := '{"Content-Type": "application/json", "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2ZGdhenJld3N1YXF0YWxxeHVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNTgwMDYsImV4cCI6MjA3NzgzNDAwNn0.8LDj5M77n8yDqF4NU6O1wfzJVZojyDnT02VOBpVTQKA", "x-cron-secret": "ffc8e38b95567aa2186a3b4f438f46f88b24ff37e4c0368c"}'::jsonb,
    body := '{"mode": "send"}'::jsonb
  );
  $$
);