
-- 1. Fix subscribers INSERT: restrict to service_role only
DROP POLICY IF EXISTS "Service role can insert subscriptions" ON public.subscribers;
CREATE POLICY "Service role can insert subscriptions"
ON public.subscribers
FOR INSERT
TO service_role
WITH CHECK (true);

-- 2. Fix payment_confirmations INSERT: require authenticated user
DROP POLICY IF EXISTS "Anyone can submit payment confirmation" ON public.payment_confirmations;
CREATE POLICY "Authenticated users can submit payment confirmation"
ON public.payment_confirmations
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- 3. Fix forum_notifications INSERT: user can only create their own
DROP POLICY IF EXISTS "Service can create notifications" ON public.forum_notifications;
CREATE POLICY "Users can create their own notifications"
ON public.forum_notifications
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 4. Drop broken has_role(text, app_role) overload
DROP FUNCTION IF EXISTS public.has_role(_email text, _role app_role);

-- 5. Remove sensitive tables from Realtime publication
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'subscribers'
  ) THEN
    ALTER PUBLICATION supabase_realtime DROP TABLE public.subscribers;
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'payment_confirmations'
  ) THEN
    ALTER PUBLICATION supabase_realtime DROP TABLE public.payment_confirmations;
  END IF;
END $$;

-- 6. Add UPDATE policy on audiobooks storage for owners
CREATE POLICY "Users can update their own audiobook files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'audiobooks' AND auth.uid()::text = (storage.foldername(name))[1]);
