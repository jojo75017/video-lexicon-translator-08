-- Drop broken restrictive policies
DROP POLICY IF EXISTS "Anyone can view public audiobooks" ON public.audiobooks;
DROP POLICY IF EXISTS "Users can manage their own audiobooks" ON public.audiobooks;

-- Recreate as PERMISSIVE policies (default is PERMISSIVE)
CREATE POLICY "Users can manage their own audiobooks"
  ON public.audiobooks
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view public audiobooks"
  ON public.audiobooks
  FOR SELECT
  TO anon, authenticated
  USING (is_public = true);