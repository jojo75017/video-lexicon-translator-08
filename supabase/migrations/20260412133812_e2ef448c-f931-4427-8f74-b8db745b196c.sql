
-- Fix #3: Tighten overly permissive RLS policies

-- subscribers: remove the open "service role can update" policy that uses USING(true)
DROP POLICY IF EXISTS "Service role can update subscriptions" ON public.subscribers;

-- referrals: restrict insert/update to service_role only
DROP POLICY IF EXISTS "Service role can insert referrals" ON public.referrals;
DROP POLICY IF EXISTS "Service role can update referrals" ON public.referrals;

CREATE POLICY "Service role can insert referrals"
ON public.referrals FOR INSERT TO service_role
WITH CHECK (true);

CREATE POLICY "Service role can update referrals"
ON public.referrals FOR UPDATE TO service_role
USING (true);

-- payment_confirmations: restrict read/update to admins, keep public insert
DROP POLICY IF EXISTS "Admins can read confirmations" ON public.payment_confirmations;
DROP POLICY IF EXISTS "Admins can update confirmations" ON public.payment_confirmations;

CREATE POLICY "Admins can read confirmations"
ON public.payment_confirmations FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update confirmations"
ON public.payment_confirmations FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- email_opens: restrict insert to service_role
DROP POLICY IF EXISTS "Service can insert email opens" ON public.email_opens;

CREATE POLICY "Service can insert email opens"
ON public.email_opens FOR INSERT TO service_role
WITH CHECK (true);
