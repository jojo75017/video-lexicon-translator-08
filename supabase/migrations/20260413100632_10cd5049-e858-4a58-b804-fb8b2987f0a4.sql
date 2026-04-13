
-- published_books: change from public to authenticated
DROP POLICY IF EXISTS "Users can create their own books" ON public.published_books;
DROP POLICY IF EXISTS "Users can delete their own books" ON public.published_books;
DROP POLICY IF EXISTS "Users can update their own books" ON public.published_books;
DROP POLICY IF EXISTS "Users can view their own books" ON public.published_books;

CREATE POLICY "Users can create their own books" ON public.published_books FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own books" ON public.published_books FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own books" ON public.published_books FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own books" ON public.published_books FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- series_bibles: change from public to authenticated
DROP POLICY IF EXISTS "Users can create their own series bibles" ON public.series_bibles;
DROP POLICY IF EXISTS "Users can delete their own series bibles" ON public.series_bibles;
DROP POLICY IF EXISTS "Users can update their own series bibles" ON public.series_bibles;
DROP POLICY IF EXISTS "Users can view their own series bibles" ON public.series_bibles;

CREATE POLICY "Users can create their own series bibles" ON public.series_bibles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own series bibles" ON public.series_bibles FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own series bibles" ON public.series_bibles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own series bibles" ON public.series_bibles FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- book_tracking_history: change from public to authenticated
DROP POLICY IF EXISTS "Users can create their own tracking data" ON public.book_tracking_history;
DROP POLICY IF EXISTS "Users can delete their own tracking data" ON public.book_tracking_history;
DROP POLICY IF EXISTS "Users can view their own tracking data" ON public.book_tracking_history;

CREATE POLICY "Users can create their own tracking data" ON public.book_tracking_history FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own tracking data" ON public.book_tracking_history FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own tracking data" ON public.book_tracking_history FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ebook_projects: change from public to authenticated
DROP POLICY IF EXISTS "Users can create their own ebook projects" ON public.ebook_projects;
DROP POLICY IF EXISTS "Users can delete their own ebook projects" ON public.ebook_projects;
DROP POLICY IF EXISTS "Users can update their own ebook projects" ON public.ebook_projects;
DROP POLICY IF EXISTS "Users can view their own ebook projects" ON public.ebook_projects;

CREATE POLICY "Users can create their own ebook projects" ON public.ebook_projects FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own ebook projects" ON public.ebook_projects FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own ebook projects" ON public.ebook_projects FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own ebook projects" ON public.ebook_projects FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ebook_project_versions: change from public to authenticated
DROP POLICY IF EXISTS "Users can create versions for their own projects" ON public.ebook_project_versions;
DROP POLICY IF EXISTS "Users can delete their own project versions" ON public.ebook_project_versions;
DROP POLICY IF EXISTS "Users can view their own project versions" ON public.ebook_project_versions;

CREATE POLICY "Users can create versions for their own projects" ON public.ebook_project_versions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own project versions" ON public.ebook_project_versions FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own project versions" ON public.ebook_project_versions FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Restrict audiobooks storage upload to user's own folder
DROP POLICY IF EXISTS "Authenticated users can upload audiobooks" ON storage.objects;
CREATE POLICY "Authenticated users can upload to own folder" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'audiobooks' AND auth.uid()::text = (storage.foldername(name))[1]);
