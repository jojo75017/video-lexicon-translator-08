-- Créer une table pour sauvegarder les projets d'ebook
CREATE TABLE IF NOT EXISTS public.ebook_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  author_name TEXT,
  target_audience TEXT,
  tome_number INTEGER,
  writing_style TEXT,
  chapter_length TEXT,
  detail_level TEXT,
  tone TEXT,
  narrative_format TEXT,
  preface TEXT,
  conclusion TEXT,
  chapters JSONB DEFAULT '[]'::jsonb,
  characters JSONB DEFAULT '[]'::jsonb,
  ebook_images JSONB DEFAULT '[]'::jsonb,
  number_of_chapters INTEGER DEFAULT 8,
  book_summary TEXT,
  cover_concepts TEXT,
  seo_optimization TEXT,
  kdp_description TEXT,
  kdp_keywords TEXT,
  kdp_categories TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS
ALTER TABLE public.ebook_projects ENABLE ROW LEVEL SECURITY;

-- Politique pour voir ses propres projets
CREATE POLICY "Users can view their own ebook projects" 
ON public.ebook_projects 
FOR SELECT 
USING (auth.uid() = user_id);

-- Politique pour créer ses propres projets
CREATE POLICY "Users can create their own ebook projects" 
ON public.ebook_projects 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Politique pour modifier ses propres projets
CREATE POLICY "Users can update their own ebook projects" 
ON public.ebook_projects 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Politique pour supprimer ses propres projets
CREATE POLICY "Users can delete their own ebook projects" 
ON public.ebook_projects 
FOR DELETE 
USING (auth.uid() = user_id);

-- Trigger pour mise à jour automatique du timestamp
CREATE TRIGGER update_ebook_projects_updated_at
BEFORE UPDATE ON public.ebook_projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();