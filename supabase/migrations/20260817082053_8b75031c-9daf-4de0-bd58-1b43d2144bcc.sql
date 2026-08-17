CREATE TABLE public.book_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID,
  role TEXT NOT NULL CHECK (role IN ('user','assistant')),
  content TEXT NOT NULL DEFAULT '',
  changes TEXT,
  brief_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
  outline_snapshot JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.book_conversations TO authenticated;
GRANT ALL ON public.book_conversations TO service_role;
ALTER TABLE public.book_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own book conversations"
  ON public.book_conversations FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX book_conversations_user_created_idx ON public.book_conversations (user_id, created_at DESC);

CREATE TABLE public.book_outline_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID,
  book_title TEXT NOT NULL DEFAULT '',
  version INTEGER NOT NULL DEFAULT 1,
  chapters JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.book_outline_versions TO authenticated;
GRANT ALL ON public.book_outline_versions TO service_role;
ALTER TABLE public.book_outline_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own outline versions"
  ON public.book_outline_versions FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX book_outline_versions_user_created_idx ON public.book_outline_versions (user_id, created_at DESC);