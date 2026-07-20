
-- 1. Restrict overly-permissive RLS policies (USING/WITH CHECK = true) --------

-- email_sequences: was ALL USING(true) WITH CHECK(true) for public
DROP POLICY IF EXISTS "Service role can manage email sequences" ON public.email_sequences;
CREATE POLICY "Service role can manage email sequences"
  ON public.email_sequences
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- referrals: UPDATE USING(true) and INSERT WITH CHECK(true) should be service-only
DROP POLICY IF EXISTS "Service role can update referrals" ON public.referrals;
CREATE POLICY "Service role can update referrals"
  ON public.referrals
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role can insert referrals" ON public.referrals;
CREATE POLICY "Service role can insert referrals"
  ON public.referrals
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- 2. forum_replies: require authentication to view (was public SELECT) --------
DROP POLICY IF EXISTS "Anyone can view forum replies" ON public.forum_replies;
CREATE POLICY "Authenticated users can view forum replies"
  ON public.forum_replies
  FOR SELECT
  TO authenticated
  USING (true);

-- 3. SECURITY DEFINER function permissions ------------------------------------
-- Trigger functions never need direct EXECUTE by clients — they run via triggers.
REVOKE ALL ON FUNCTION public.increment_reply_count()      FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.decrement_reply_count()      FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column()   FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_post_like_count()     FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_funnel_order_paid()   FROM PUBLIC, anon, authenticated;

-- Admin/service-only generator: no client should be minting codes directly
REVOKE ALL ON FUNCTION public.generate_referral_code()     FROM PUBLIC, anon, authenticated;
GRANT  EXECUTE ON FUNCTION public.generate_referral_code() TO service_role;
