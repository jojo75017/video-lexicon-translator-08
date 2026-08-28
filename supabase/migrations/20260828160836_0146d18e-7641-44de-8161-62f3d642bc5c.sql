-- Correction des taux de commission d'affiliation
-- Accès à vie (47 €, funnel_orders) : 15 % (avant 30 %)
-- Abonnements V3 Plume (27 €) et Édition (47 €) : 20 % (gérés par payments-webhook)

CREATE OR REPLACE FUNCTION public.handle_funnel_order_paid()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_referrer_id uuid;
  v_rate numeric := 0.15;
BEGIN
  IF NEW.status = 'paid'
     AND (OLD.status IS DISTINCT FROM 'paid')
     AND NEW.ref_code IS NOT NULL
     AND length(NEW.ref_code) > 0 THEN

    SELECT user_id INTO v_referrer_id
    FROM public.referral_codes
    WHERE code = NEW.ref_code
    LIMIT 1;

    IF v_referrer_id IS NOT NULL THEN
      IF NOT EXISTS (
        SELECT 1 FROM public.referrals WHERE funnel_order_id = NEW.id
      ) THEN
        INSERT INTO public.referrals (
          referrer_id, referred_email, status,
          commission_amount, commission_rate, funnel_order_id, converted_at
        ) VALUES (
          v_referrer_id, NEW.email, 'converted',
          ROUND(NEW.amount * v_rate, 2), v_rate, NEW.id, now()
        );
      END IF;

      IF NEW.paid_at IS NULL THEN
        NEW.paid_at := now();
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

ALTER TABLE public.referrals
  ALTER COLUMN commission_rate SET DEFAULT 0.15;