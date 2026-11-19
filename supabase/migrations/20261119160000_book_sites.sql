CREATE TABLE public.book_sites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  project_id uuid,
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' AND length(slug) BETWEEN 3 AND 60 AND slug <> 'el-cuervo'),
  title text NOT NULL CHECK (length(title) BETWEEN 1 AND 200),
  subtitle text,
  author_name text,
  description text,
  excerpt_title text,
  excerpt text CHECK (excerpt IS NULL OR length(excerpt) <= 6000),
  cover_url text,
  theme text NOT NULL DEFAULT 'clair' CHECK (theme IN ('clair','litteraire','doux','sombre')),
  amazon_kindle_url text,
  amazon_paperback_url text,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX book_sites_project_unique ON public.book_sites(user_id, project_id);
ALTER TABLE public.book_sites ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.book_sites TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.book_sites TO authenticated;
CREATE POLICY "Published sites are public" ON public.book_sites FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "Owners read their sites" ON public.book_sites FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Owners create sites" ON public.book_sites FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners update sites" ON public.book_sites FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners delete sites" ON public.book_sites FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Site owners read their readers" ON public.book_reader_signups FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.book_sites s WHERE s.slug = book_reader_signups.book_slug AND s.user_id = auth.uid()));
GRANT SELECT ON public.book_reader_signups TO authenticated;
