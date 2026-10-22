CREATE TABLE public.vc_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  author_name TEXT NOT NULL DEFAULT '',
  theme TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  format TEXT NOT NULL DEFAULT 'poche',
  target_pages INTEGER NOT NULL DEFAULT 120,
  cover_url TEXT,
  status TEXT NOT NULL DEFAULT 'brouillon',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.vc_books TO authenticated;
GRANT ALL ON public.vc_books TO service_role;

ALTER TABLE public.vc_books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own VC books"
ON public.vc_books
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE TRIGGER update_vc_books_updated_at
BEFORE UPDATE ON public.vc_books
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();