ALTER TABLE public.book_testimonials
  ADD COLUMN IF NOT EXISTS consent_publication BOOLEAN NOT NULL DEFAULT false;

GRANT UPDATE, DELETE ON public.book_testimonials TO authenticated;

DROP POLICY IF EXISTS "Admins can read all testimonials" ON public.book_testimonials;
CREATE POLICY "Admins can read all testimonials"
  ON public.book_testimonials FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can moderate testimonials" ON public.book_testimonials;
CREATE POLICY "Admins can moderate testimonials"
  ON public.book_testimonials FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete testimonials" ON public.book_testimonials;
CREATE POLICY "Admins can delete testimonials"
  ON public.book_testimonials FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));