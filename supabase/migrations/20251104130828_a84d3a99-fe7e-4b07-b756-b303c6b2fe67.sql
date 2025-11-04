-- Table pour gérer les abonnés
CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  plan_type TEXT NOT NULL DEFAULT 'starter' CHECK (plan_type IN ('starter', 'pro', 'agency')),
  expires_at TIMESTAMPTZ,
  chapters_generated INTEGER NOT NULL DEFAULT 0,
  ebook_plans_generated INTEGER NOT NULL DEFAULT 0,
  subchapters_generated INTEGER NOT NULL DEFAULT 0,
  covers_generated INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour recherche rapide par email
CREATE INDEX idx_subscribers_email ON public.subscribers(email);

-- Index pour filtrer par statut
CREATE INDEX idx_subscribers_status ON public.subscribers(status);

-- Activer RLS
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Policy: Les utilisateurs peuvent voir leur propre abonnement
CREATE POLICY "Users can view their own subscription"
  ON public.subscribers
  FOR SELECT
  USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Policy: Les utilisateurs peuvent mettre à jour leur propre compteur (via edge function)
CREATE POLICY "Service role can update subscriptions"
  ON public.subscribers
  FOR UPDATE
  USING (true);

-- Policy: Service role peut insérer des abonnés
CREATE POLICY "Service role can insert subscriptions"
  ON public.subscribers
  FOR INSERT
  WITH CHECK (true);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour updated_at
CREATE TRIGGER update_subscribers_updated_at
  BEFORE UPDATE ON public.subscribers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();