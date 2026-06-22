ALTER TABLE public.funnel_orders REPLICA IDENTITY FULL;
ALTER TABLE public.payment_confirmations REPLICA IDENTITY FULL;

DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.funnel_orders;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.payment_confirmations;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;