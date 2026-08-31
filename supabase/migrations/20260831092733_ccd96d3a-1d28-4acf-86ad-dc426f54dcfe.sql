DO $$
DECLARE j record;
BEGIN
  FOR j IN SELECT jobname FROM cron.job WHERE command ILIKE '%send-sales-email%' OR command ILIKE '%send-closing-47%' OR command ILIKE '%send-campagne-unique%' LOOP
    PERFORM cron.unschedule(j.jobname);
  END LOOP;
END $$;