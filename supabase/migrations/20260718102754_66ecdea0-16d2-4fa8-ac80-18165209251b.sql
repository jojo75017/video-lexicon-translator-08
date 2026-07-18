CREATE TABLE public.audiobook_unlocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id text NOT NULL,
  stripe_session_id text UNIQUE,
  environment text NOT NULL DEFAULT 'sandbox',
  status text NOT NULL DEFAULT 'paid',
  provider_used text,
  audio_url text,
  paid_at timestamptz DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_audiobook_unlocks_user_book ON public.audiobook_unlocks(user_id, book_id);

GRANT SELECT, INSERT, UPDATE ON public.audiobook_unlocks TO authenticated;
GRANT ALL ON public.audiobook_unlocks TO service_role;

ALTER TABLE public.audiobook_unlocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own audiobook unlocks"
  ON public.audiobook_unlocks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role manages audiobook unlocks"
  ON public.audiobook_unlocks FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE TRIGGER update_audiobook_unlocks_updated_at
  BEFORE UPDATE ON public.audiobook_unlocks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();