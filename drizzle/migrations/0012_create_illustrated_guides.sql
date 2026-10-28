CREATE TABLE public.illustrated_guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL DEFAULT '',
  subtitle text NOT NULL DEFAULT '',
  author_name text NOT NULL DEFAULT '',
  subject text NOT NULL DEFAULT '',
  audience text NOT NULL DEFAULT '',
  image_style text NOT NULL DEFAULT 'photo',
  format text NOT NULL DEFAULT '6x9',
  chapter_count integer NOT NULL DEFAULT 12,
  chapters jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.illustrated_guides TO authenticated;
GRANT ALL ON public.illustrated_guides TO service_role;
ALTER TABLE public.illustrated_guides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own illustrated guides" ON public.illustrated_guides FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX illustrated_guides_user_idx ON public.illustrated_guides(user_id, updated_at DESC);
CREATE TRIGGER update_illustrated_guides_updated_at BEFORE UPDATE ON public.illustrated_guides
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();