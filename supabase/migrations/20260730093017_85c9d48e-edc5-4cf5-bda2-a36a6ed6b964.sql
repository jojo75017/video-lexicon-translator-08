CREATE TABLE public.book_testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  author_name TEXT NOT NULL,
  book_title TEXT,
  comment TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  photo_url TEXT,
  approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.book_testimonials TO anon;
GRANT SELECT, INSERT ON public.book_testimonials TO authenticated;
GRANT ALL ON public.book_testimonials TO service_role;

ALTER TABLE public.book_testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a testimonial"
  ON public.book_testimonials FOR INSERT TO anon, authenticated
  WITH CHECK (approved = false);

CREATE POLICY "Approved testimonials are public"
  ON public.book_testimonials FOR SELECT TO anon, authenticated
  USING (approved = true);
