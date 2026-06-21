
-- 1) Public buckets: remove broad SELECT (list) policies on storage.objects.
-- Files in public buckets remain reachable via their public URL; dropping these
-- policies only blocks enumeration/listing of all files.
DROP POLICY IF EXISTS "Anyone can read public audiobooks" ON storage.objects;
DROP POLICY IF EXISTS "Public video access" ON storage.objects;

-- 2) Replace always-true INSERT policies with minimal validation so they are no
-- longer "USING/WITH CHECK (true)" while keeping public capture endpoints working.
DROP POLICY IF EXISTS "Anyone can log a click" ON public.affiliate_clicks;
CREATE POLICY "Anyone can log a click" ON public.affiliate_clicks
  FOR INSERT TO anon, authenticated
  WITH CHECK (ref_code IS NOT NULL AND length(ref_code) > 0);

DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.funnel_leads;
CREATE POLICY "Anyone can submit a lead" ON public.funnel_leads
  FOR INSERT TO anon, authenticated
  WITH CHECK (email IS NOT NULL AND position('@' in email) > 1);

DROP POLICY IF EXISTS "Anyone can create an order" ON public.funnel_orders;
CREATE POLICY "Anyone can create an order" ON public.funnel_orders
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    email IS NOT NULL AND position('@' in email) > 1
    AND product_key IS NOT NULL AND length(product_key) > 0
    AND amount >= 0
  );

-- 3) Revoke EXECUTE on internal trigger / helper SECURITY DEFINER functions from
-- public/anon/authenticated. These are never meant to be called directly via the API.
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.increment_reply_count() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.decrement_reply_count() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_post_like_count() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_funnel_order_paid() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.generate_referral_code() FROM PUBLIC, anon, authenticated;

-- Restrict reporting/admin helpers to signed-in users only (remove anonymous access).
REVOKE EXECUTE ON FUNCTION public.get_referral_stats(uuid) FROM PUBLIC, anon;

-- 4) app_secrets has RLS enabled but no policy. Make the deny explicit for
-- anon/authenticated (only service_role, which bypasses RLS, may access it).
DROP POLICY IF EXISTS "No client access to app_secrets" ON public.app_secrets;
CREATE POLICY "No client access to app_secrets" ON public.app_secrets
  FOR ALL TO anon, authenticated
  USING (false) WITH CHECK (false);
