
-- Create audiobooks storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('audiobooks', 'audiobooks', true);

-- Create audiobooks table
CREATE TABLE public.audiobooks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  author_name TEXT,
  description TEXT,
  cover_url TEXT,
  audio_url TEXT,
  duration_seconds INTEGER DEFAULT 0,
  voice_name TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  is_public BOOLEAN NOT NULL DEFAULT false,
  slug TEXT UNIQUE,
  play_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.audiobooks ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can manage their own audiobooks" ON public.audiobooks
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view public audiobooks" ON public.audiobooks
  FOR SELECT TO anon, authenticated
  USING (is_public = true);

-- Storage policies for audiobooks bucket
CREATE POLICY "Authenticated users can upload audiobooks" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'audiobooks');

CREATE POLICY "Anyone can read public audiobooks" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'audiobooks');

CREATE POLICY "Users can delete their own audiobook files" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'audiobooks' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Updated at trigger
CREATE TRIGGER update_audiobooks_updated_at
  BEFORE UPDATE ON public.audiobooks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
