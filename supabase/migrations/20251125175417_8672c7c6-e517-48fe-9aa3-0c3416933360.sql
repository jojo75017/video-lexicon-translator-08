-- Create table for project version history
CREATE TABLE IF NOT EXISTS public.ebook_project_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.ebook_projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  version_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  author_name TEXT,
  target_audience TEXT,
  cover_concepts TEXT,
  writing_style TEXT,
  chapter_length TEXT,
  tone TEXT,
  narrative_format TEXT,
  detail_level TEXT,
  number_of_chapters INTEGER,
  tome_number INTEGER,
  preface TEXT,
  conclusion TEXT,
  seo_optimization TEXT,
  book_summary TEXT,
  kdp_description TEXT,
  kdp_keywords TEXT,
  kdp_categories TEXT,
  chapters JSONB DEFAULT '[]'::jsonb,
  characters JSONB DEFAULT '[]'::jsonb,
  ebook_images JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(project_id, version_number)
);

-- Enable RLS
ALTER TABLE public.ebook_project_versions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own project versions"
ON public.ebook_project_versions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create versions for their own projects"
ON public.ebook_project_versions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own project versions"
ON public.ebook_project_versions
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_ebook_project_versions_project_id ON public.ebook_project_versions(project_id);
CREATE INDEX idx_ebook_project_versions_user_id ON public.ebook_project_versions(user_id);