-- Table pour sauvegarder les bandes dessinées générées
CREATE TABLE public.comic_books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  main_character TEXT,
  genre TEXT DEFAULT 'adventure',
  age_group TEXT DEFAULT '7-10',
  art_style TEXT DEFAULT 'cartoon',
  color_mode TEXT DEFAULT 'full',
  panel_layout TEXT DEFAULT '2x2',
  number_of_pages INTEGER DEFAULT 4,
  scenario JSONB,
  pages JSONB,
  cover_url TEXT,
  visual_seed TEXT,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.comic_books ENABLE ROW LEVEL SECURITY;

-- Policies for user access
CREATE POLICY "Users can view their own comic books" 
ON public.comic_books 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own comic books" 
ON public.comic_books 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comic books" 
ON public.comic_books 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comic books" 
ON public.comic_books 
FOR DELETE 
USING (auth.uid() = user_id);

-- Trigger for automatic timestamp updates
CREATE TRIGGER update_comic_books_updated_at
BEFORE UPDATE ON public.comic_books
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Index for faster user queries
CREATE INDEX idx_comic_books_user_id ON public.comic_books(user_id);
CREATE INDEX idx_comic_books_created_at ON public.comic_books(created_at DESC);