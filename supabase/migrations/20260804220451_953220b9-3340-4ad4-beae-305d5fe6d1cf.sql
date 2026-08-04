DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'sales-email-auto-send') THEN
    PERFORM cron.unschedule('sales-email-auto-send');
  END IF;
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'process-promo-nurture-hourly') THEN
    PERFORM cron.unschedule('process-promo-nurture-hourly');
  END IF;
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'onboarding-email-cron-hourly') THEN
    PERFORM cron.unschedule('onboarding-email-cron-hourly');
  END IF;
END
$$;