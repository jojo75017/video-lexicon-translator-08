CREATE TABLE public.cover_projects (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL DEFAULT auth.uid(),
  project_name text NOT NULL,
  book_title text,
  cover_type text NOT NULL DEFAULT 'ebook',
  format_id text NOT NULL DEFAULT 'ebook-kindle',
  page_count integer,
  fabric_json jsonb,
  illustration_path text,
  thumbnail_path text,
  schema_version integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.cover_projects TO authenticated;
GRANT ALL ON public.cover_projects TO service_role;

ALTER TABLE public.cover_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cover_projects_select_own" ON public.cover_projects
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "cover_projects_insert_own" ON public.cover_projects
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "cover_projects_update_own" ON public.cover_projects
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "cover_projects_delete_own" ON public.cover_projects
  FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE INDEX cover_projects_user_updated_idx ON public.cover_projects (user_id, updated_at DESC);

CREATE TRIGGER cover_projects_set_updated_at
  BEFORE UPDATE ON public.cover_projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "covers owner read" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'covers' AND (storage.foldername(name))[1] = (auth.uid())::text);
CREATE POLICY "covers owner write" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'covers' AND (storage.foldername(name))[1] = (auth.uid())::text);
CREATE POLICY "covers owner update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'covers' AND (storage.foldername(name))[1] = (auth.uid())::text);
CREATE POLICY "covers owner delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'covers' AND (storage.foldername(name))[1] = (auth.uid())::text);