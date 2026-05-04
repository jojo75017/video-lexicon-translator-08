-- Fix #1 (ERROR): Replace JWT-claim-based policy on subscribers with auth.email()
DROP POLICY IF EXISTS "Users can view their own subscription" ON public.subscribers;

CREATE POLICY "Users can view their own subscription"
ON public.subscribers
FOR SELECT
TO authenticated
USING (email = auth.email());

-- Fix #2 (WARN): Add UPDATE policy on ebook_project_versions for owners
CREATE POLICY "Users can update their own project versions"
ON public.ebook_project_versions
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);