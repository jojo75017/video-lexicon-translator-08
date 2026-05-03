DROP FUNCTION IF EXISTS public.auto_assign_admin() CASCADE;
DROP POLICY IF EXISTS "Service role can insert subscriptions" ON public.subscribers;