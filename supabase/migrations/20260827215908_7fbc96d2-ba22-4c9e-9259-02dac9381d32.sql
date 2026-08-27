CREATE TABLE public.cs_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  target_audience TEXT,
  tone VARCHAR(50) DEFAULT 'informative',
  language_code VARCHAR(10) DEFAULT 'fr',
  kdp_description TEXT,
  kdp_keywords TEXT[],
  kdp_categories TEXT[],
  cover_image_url TEXT,
  video_unlocked BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.cs_projects TO authenticated;
GRANT ALL ON public.cs_projects TO service_role;

ALTER TABLE public.cs_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own cs_projects" ON public.cs_projects
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.cs_chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.cs_projects(id) ON DELETE CASCADE,
  chapter_number INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content_markdown TEXT,
  key_takeaways TEXT[],
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.cs_chapters TO authenticated;
GRANT ALL ON public.cs_chapters TO service_role;

ALTER TABLE public.cs_chapters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own cs_chapters" ON public.cs_chapters
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.cs_projects p
      WHERE p.id = cs_chapters.project_id
        AND p.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.cs_projects p
      WHERE p.id = cs_chapters.project_id
        AND p.user_id = auth.uid()
    )
  );

CREATE TABLE public.cs_video_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID NOT NULL REFERENCES public.cs_chapters(id) ON DELETE CASCADE,
  video_title VARCHAR(255) NOT NULL,
  script_hook TEXT,
  script_core TEXT,
  script_action TEXT,
  slides_json JSONB,
  audio_url TEXT,
  subtitle_vtt_url TEXT,
  video_mp4_url TEXT,
  duration_seconds INT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.cs_video_lessons TO authenticated;
GRANT ALL ON public.cs_video_lessons TO service_role;

ALTER TABLE public.cs_video_lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own cs_video_lessons" ON public.cs_video_lessons
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.cs_chapters c
      JOIN public.cs_projects p ON p.id = c.project_id
      WHERE c.id = cs_video_lessons.chapter_id
        AND p.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.cs_chapters c
      JOIN public.cs_projects p ON p.id = c.project_id
      WHERE c.id = cs_video_lessons.chapter_id
        AND p.user_id = auth.uid()
    )
  );

CREATE TRIGGER update_cs_projects_updated_at BEFORE UPDATE ON public.cs_projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cs_chapters_updated_at BEFORE UPDATE ON public.cs_chapters
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cs_video_lessons_updated_at BEFORE UPDATE ON public.cs_video_lessons
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();