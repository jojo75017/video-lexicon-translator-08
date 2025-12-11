-- Create table for storing series bibles
CREATE TABLE public.series_bibles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  genre TEXT,
  total_tomes INTEGER DEFAULT 3,
  main_themes JSONB DEFAULT '[]'::jsonb,
  characters JSONB DEFAULT '[]'::jsonb,
  locations JSONB DEFAULT '[]'::jsonb,
  timeline JSONB DEFAULT '[]'::jsonb,
  plot_threads JSONB DEFAULT '[]'::jsonb,
  tomes JSONB DEFAULT '[]'::jsonb,
  world_rules TEXT,
  narrative_style TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.series_bibles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own series bibles"
ON public.series_bibles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own series bibles"
ON public.series_bibles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own series bibles"
ON public.series_bibles
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own series bibles"
ON public.series_bibles
FOR DELETE
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_series_bibles_updated_at
BEFORE UPDATE ON public.series_bibles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();