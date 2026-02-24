
-- Table des codes de parrainage (un par utilisateur)
CREATE TABLE public.referral_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  code text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index pour lookups rapides
CREATE UNIQUE INDEX idx_referral_codes_user ON public.referral_codes(user_id);
CREATE UNIQUE INDEX idx_referral_codes_code ON public.referral_codes(code);

ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own referral code"
  ON public.referral_codes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own referral code"
  ON public.referral_codes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Table des parrainages (qui a parrainé qui)
CREATE TABLE public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL,
  referred_email text NOT NULL,
  referred_user_id uuid,
  status text NOT NULL DEFAULT 'pending',
  commission_amount numeric NOT NULL DEFAULT 0,
  commission_paid boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  converted_at timestamptz,
  paid_at timestamptz
);

CREATE INDEX idx_referrals_referrer ON public.referrals(referrer_id);
CREATE UNIQUE INDEX idx_referrals_referred_email ON public.referrals(referred_email);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Les parrains voient leurs filleuls
CREATE POLICY "Users can view their own referrals"
  ON public.referrals FOR SELECT
  USING (auth.uid() = referrer_id);

-- Insertion via service role uniquement (edge function)
CREATE POLICY "Service role can insert referrals"
  ON public.referrals FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can update referrals"
  ON public.referrals FOR UPDATE
  USING (true);

-- Fonction pour générer un code unique
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_code text;
  code_exists boolean;
BEGIN
  LOOP
    new_code := 'REF-' || upper(substr(md5(random()::text), 1, 6));
    SELECT EXISTS(SELECT 1 FROM referral_codes WHERE code = new_code) INTO code_exists;
    EXIT WHEN NOT code_exists;
  END LOOP;
  RETURN new_code;
END;
$$;

-- Vue pour les stats de parrainage (accessible par l'utilisateur)
CREATE OR REPLACE FUNCTION public.get_referral_stats(p_user_id uuid)
RETURNS json
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT json_build_object(
    'total_referrals', (SELECT count(*) FROM referrals WHERE referrer_id = p_user_id),
    'pending', (SELECT count(*) FROM referrals WHERE referrer_id = p_user_id AND status = 'pending'),
    'converted', (SELECT count(*) FROM referrals WHERE referrer_id = p_user_id AND status = 'converted'),
    'total_commission', (SELECT coalesce(sum(commission_amount), 0) FROM referrals WHERE referrer_id = p_user_id AND status = 'converted'),
    'unpaid_commission', (SELECT coalesce(sum(commission_amount), 0) FROM referrals WHERE referrer_id = p_user_id AND status = 'converted' AND commission_paid = false),
    'paid_commission', (SELECT coalesce(sum(commission_amount), 0) FROM referrals WHERE referrer_id = p_user_id AND commission_paid = true)
  )
$$;
