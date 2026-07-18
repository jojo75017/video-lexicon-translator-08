GRANT SELECT, INSERT, UPDATE, DELETE ON public.ebook_projects TO authenticated;
GRANT ALL ON public.ebook_projects TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.ebook_project_versions TO authenticated;
GRANT ALL ON public.ebook_project_versions TO service_role;