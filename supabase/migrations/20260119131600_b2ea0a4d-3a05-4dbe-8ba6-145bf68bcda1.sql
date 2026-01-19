-- Ajouter une colonne pour le type de projet
ALTER TABLE public.ebook_projects 
ADD COLUMN IF NOT EXISTS project_type TEXT DEFAULT 'ebook';

-- Ajouter un commentaire pour documenter les types
COMMENT ON COLUMN public.ebook_projects.project_type IS 'Types: ebook, atlas, encyclopedia, coloring, comic, documentary, diary';

-- Créer un index pour les requêtes filtrées
CREATE INDEX IF NOT EXISTS idx_ebook_projects_type ON public.ebook_projects(project_type);
CREATE INDEX IF NOT EXISTS idx_ebook_projects_user_type ON public.ebook_projects(user_id, project_type);