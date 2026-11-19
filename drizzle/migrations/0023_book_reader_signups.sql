CREATE TABLE public.book_reader_signups (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 book_slug text NOT NULL,
 email text NOT NULL,
 first_name text,
 consent_version text NOT NULL DEFAULT 'book-news-2026-11-19',
 consent_at timestamptz NOT NULL DEFAULT now(),
 created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE (book_slug, email)
);
GRANT SELECT, DELETE ON public.book_reader_signups TO authenticated;
GRANT ALL ON public.book_reader_signups TO service_role;
ALTER TABLE public.book_reader_signups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read book readers" ON public.book_reader_signups FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins remove book readers" ON public.book_reader_signups FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE TABLE public.book_reader_rate_limits (
 bucket_key text PRIMARY KEY,
 attempts integer NOT NULL DEFAULT 1,
 expires_at timestamptz NOT NULL
);
GRANT ALL ON public.book_reader_rate_limits TO service_role;
ALTER TABLE public.book_reader_rate_limits ENABLE ROW LEVEL SECURITY;
CREATE FUNCTION public.claim_book_reader_attempt(p_key text) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE n integer;
BEGIN
 INSERT INTO public.book_reader_rate_limits(bucket_key, attempts, expires_at) VALUES (p_key, 1, now() + interval '1 hour')
 ON CONFLICT (bucket_key) DO UPDATE SET attempts = CASE WHEN book_reader_rate_limits.expires_at <= now() THEN 1 ELSE book_reader_rate_limits.attempts + 1 END, expires_at = CASE WHEN book_reader_rate_limits.expires_at <= now() THEN now() + interval '1 hour' ELSE book_reader_rate_limits.expires_at END
 RETURNING attempts INTO n;
 RETURN n <= 10;
END; $$;
REVOKE ALL ON FUNCTION public.claim_book_reader_attempt(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_book_reader_attempt(text) TO service_role;