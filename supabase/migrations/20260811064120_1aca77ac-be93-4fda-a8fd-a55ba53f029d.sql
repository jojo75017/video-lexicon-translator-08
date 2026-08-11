-- 1. book_projects : fiche maître
CREATE TABLE public.book_projects (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  title text NOT NULL DEFAULT 'Nouveau livre',
  subtitle text,
  book_kind text NOT NULL DEFAULT 'roman',
  genre text,
  target_audience text,
  objective text,
  chapters_target integer NOT NULL DEFAULT 12,
  length_target text,
  tone text,
  writing_style text,
  language_level text,
  narrative_pov text,
  era text,
  places text,
  main_characters text,
  constraints text,
  source_notes text,
  mode text NOT NULL DEFAULT 'guide',
  status text NOT NULL DEFAULT 'brief',
  with_images boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.book_projects TO authenticated;
GRANT ALL ON public.book_projects TO service_role;
ALTER TABLE public.book_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own book projects" ON public.book_projects
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER update_book_projects_updated_at BEFORE UPDATE ON public.book_projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_book_projects_user ON public.book_projects(user_id, updated_at DESC);

-- 2. book_bibles : versions de la Bible
CREATE TABLE public.book_bibles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid NOT NULL REFERENCES public.book_projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  version integer NOT NULL DEFAULT 1,
  concept text,
  promise text,
  synopsis text,
  structure jsonb NOT NULL DEFAULT '[]'::jsonb,
  characters jsonb NOT NULL DEFAULT '[]'::jsonb,
  timeline jsonb NOT NULL DEFAULT '[]'::jsonb,
  places jsonb NOT NULL DEFAULT '[]'::jsonb,
  plot_threads jsonb NOT NULL DEFAULT '[]'::jsonb,
  pedagogy jsonb NOT NULL DEFAULT '[]'::jsonb,
  notes text,
  engine text NOT NULL DEFAULT 'gemini',
  validated_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (project_id, version)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.book_bibles TO authenticated;
GRANT ALL ON public.book_bibles TO service_role;
ALTER TABLE public.book_bibles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own book bibles" ON public.book_bibles
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER update_book_bibles_updated_at BEFORE UPDATE ON public.book_bibles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_book_bibles_project ON public.book_bibles(project_id, version DESC);

-- 3. book_chapters
CREATE TABLE public.book_chapters (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid NOT NULL REFERENCES public.book_projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  position integer NOT NULL,
  title text NOT NULL DEFAULT '',
  objective text,
  planned_summary text,
  subsections jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'a_ecrire',
  word_target integer,
  word_count integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.book_chapters TO authenticated;
GRANT ALL ON public.book_chapters TO service_role;
ALTER TABLE public.book_chapters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own book chapters" ON public.book_chapters
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER update_book_chapters_updated_at BEFORE UPDATE ON public.book_chapters
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_book_chapters_project ON public.book_chapters(project_id, position);

-- 4. book_chapter_versions
CREATE TABLE public.book_chapter_versions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chapter_id uuid NOT NULL REFERENCES public.book_chapters(id) ON DELETE CASCADE,
  project_id uuid NOT NULL REFERENCES public.book_projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  kind text NOT NULL DEFAULT 'originale',
  version integer NOT NULL DEFAULT 1,
  content text NOT NULL DEFAULT '',
  engine text,
  word_count integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.book_chapter_versions TO authenticated;
GRANT ALL ON public.book_chapter_versions TO service_role;
ALTER TABLE public.book_chapter_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own chapter versions" ON public.book_chapter_versions
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_book_chapter_versions_chapter ON public.book_chapter_versions(chapter_id, created_at DESC);

-- 5. book_memory
CREATE TABLE public.book_memory (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid NOT NULL REFERENCES public.book_projects(id) ON DELETE CASCADE,
  chapter_id uuid REFERENCES public.book_chapters(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  chapter_position integer,
  summary text,
  events jsonb NOT NULL DEFAULT '[]'::jsonb,
  characters_present jsonb NOT NULL DEFAULT '[]'::jsonb,
  revealed_info jsonb NOT NULL DEFAULT '[]'::jsonb,
  places jsonb NOT NULL DEFAULT '[]'::jsonb,
  dates jsonb NOT NULL DEFAULT '[]'::jsonb,
  objects jsonb NOT NULL DEFAULT '[]'::jsonb,
  clues jsonb NOT NULL DEFAULT '[]'::jsonb,
  decisions jsonb NOT NULL DEFAULT '[]'::jsonb,
  relationship_changes jsonb NOT NULL DEFAULT '[]'::jsonb,
  open_questions jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.book_memory TO authenticated;
GRANT ALL ON public.book_memory TO service_role;
ALTER TABLE public.book_memory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own book memory" ON public.book_memory
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER update_book_memory_updated_at BEFORE UPDATE ON public.book_memory
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_book_memory_project ON public.book_memory(project_id, chapter_position);