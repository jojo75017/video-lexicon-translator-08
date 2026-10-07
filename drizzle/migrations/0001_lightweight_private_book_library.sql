CREATE OR REPLACE FUNCTION public.list_my_library_books()
RETURNS TABLE(id uuid, title text, author_name text, kdp_categories text, updated_at timestamptz, chapter_count integer, ebook_images jsonb, cover_concepts text, project_type text)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public
AS $$
 SELECT p.id, p.title, p.author_name, p.kdp_categories, p.updated_at,
 CASE WHEN jsonb_typeof(p.chapters::jsonb) = 'array' THEN jsonb_array_length(p.chapters::jsonb) ELSE 0 END,
 CASE WHEN length(p.ebook_images::jsonb->0->>'url') < 8192 THEN jsonb_build_array(p.ebook_images::jsonb->0) ELSE '[]'::jsonb END,
 CASE WHEN jsonb_typeof(p.cover_concepts::jsonb) = 'string' AND length(p.cover_concepts::jsonb #>> '{}') < 8192 THEN p.cover_concepts::jsonb #>> '{}' ELSE NULL END,
 p.project_type
 FROM public.ebook_projects p
 WHERE p.user_id = (SELECT auth.uid())
 ORDER BY p.updated_at DESC;
$$;
REVOKE ALL ON FUNCTION public.list_my_library_books() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.list_my_library_books() TO authenticated;
COMMENT ON FUNCTION public.list_my_library_books() IS 'Private library metadata without manuscript bodies or embedded image blobs; invoker permissions retain ebook_projects RLS.';