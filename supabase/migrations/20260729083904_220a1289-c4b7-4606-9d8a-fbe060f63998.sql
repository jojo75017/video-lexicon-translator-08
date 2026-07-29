DROP POLICY IF EXISTS "Authenticated users can view forum replies" ON public.forum_replies;
CREATE POLICY "Anyone can view forum replies"
  ON public.forum_replies FOR SELECT
  USING (true);

GRANT SELECT ON public.forum_categories TO anon;
GRANT SELECT ON public.forum_posts TO anon;
GRANT SELECT ON public.forum_replies TO anon;