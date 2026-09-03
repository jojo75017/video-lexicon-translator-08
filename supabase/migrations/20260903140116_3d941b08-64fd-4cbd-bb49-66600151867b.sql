-- =========================================================
-- Cover Studio KDP Pro — étape 3 : coffre BYOK + crédits inclus
-- =========================================================

-- 1) Coffre des clés API personnelles (chiffrées côté serveur uniquement)
CREATE TABLE public.cover_pro_api_keys (
  user_id uuid NOT NULL PRIMARY KEY,
  provider text NOT NULL DEFAULT 'openai',
  key_cipher text NOT NULL,
  key_iv text NOT NULL,
  key_mask text NOT NULL,
  last_tested_at timestamptz,
  last_test_ok boolean,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT cover_pro_api_keys_provider_chk CHECK (provider IN ('openai'))
);

-- Lecture client limitée aux colonnes non sensibles : jamais le chiffré ni l'IV.
GRANT SELECT (user_id, provider, key_mask, last_tested_at, last_test_ok, created_at, updated_at)
  ON public.cover_pro_api_keys TO authenticated;
GRANT ALL ON public.cover_pro_api_keys TO service_role;

ALTER TABLE public.cover_pro_api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cover_pro_api_keys_select_own"
  ON public.cover_pro_api_keys FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE TRIGGER cover_pro_api_keys_set_updated_at
  BEFORE UPDATE ON public.cover_pro_api_keys
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2) Crédits inclus (3 générations offertes une seule fois par compte)
CREATE TABLE public.cover_pro_credits (
  user_id uuid NOT NULL PRIMARY KEY,
  granted integer NOT NULL DEFAULT 0,
  used integer NOT NULL DEFAULT 0,
  granted_once boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT cover_pro_credits_used_chk CHECK (used >= 0 AND used <= granted)
);

GRANT SELECT ON public.cover_pro_credits TO authenticated;
GRANT ALL ON public.cover_pro_credits TO service_role;

ALTER TABLE public.cover_pro_credits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cover_pro_credits_select_own"
  ON public.cover_pro_credits FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE TRIGGER cover_pro_credits_set_updated_at
  BEFORE UPDATE ON public.cover_pro_credits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3) Journal sécurisé des mouvements de crédits
CREATE TABLE public.cover_pro_credit_events (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  project_id uuid,
  event_type text NOT NULL,
  provider text,
  model text,
  funding text,
  detail text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT cover_pro_credit_events_type_chk
    CHECK (event_type IN ('granted','reserved','consumed','restored','byok_used','denied'))
);

CREATE INDEX cover_pro_credit_events_user_idx
  ON public.cover_pro_credit_events (user_id, created_at DESC);

GRANT SELECT ON public.cover_pro_credit_events TO authenticated;
GRANT ALL ON public.cover_pro_credit_events TO service_role;

ALTER TABLE public.cover_pro_credit_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cover_pro_credit_events_select_own"
  ON public.cover_pro_credit_events FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- 4) Métadonnées d'illustration sur les projets de couverture
ALTER TABLE public.cover_projects
  ADD COLUMN IF NOT EXISTS ai_generated boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS illustration_provider text,
  ADD COLUMN IF NOT EXISTS illustration_model text,
  ADD COLUMN IF NOT EXISTS illustration_width integer,
  ADD COLUMN IF NOT EXISTS illustration_height integer,
  ADD COLUMN IF NOT EXISTS illustration_generated_at timestamptz;

-- 5) Fonctions atomiques (réservées au serveur)
CREATE OR REPLACE FUNCTION public.cover_pro_grant_included_credits(_user_id uuid, _amount integer DEFAULT 3)
RETURNS TABLE(granted integer, used integer, remaining integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.cover_pro_credits (user_id, granted, used, granted_once)
  VALUES (_user_id, _amount, 0, true)
  ON CONFLICT (user_id) DO NOTHING;

  IF FOUND THEN
    INSERT INTO public.cover_pro_credit_events (user_id, event_type, detail)
    VALUES (_user_id, 'granted', _amount || ' générations incluses');
  END IF;

  RETURN QUERY
  SELECT c.granted, c.used, GREATEST(0, c.granted - c.used)
  FROM public.cover_pro_credits c
  WHERE c.user_id = _user_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.cover_pro_reserve_credit(_user_id uuid, _project_id uuid DEFAULT NULL)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_ok boolean := false;
BEGIN
  UPDATE public.cover_pro_credits
  SET used = used + 1
  WHERE user_id = _user_id AND used < granted
  RETURNING true INTO v_ok;

  IF COALESCE(v_ok, false) THEN
    INSERT INTO public.cover_pro_credit_events (user_id, project_id, event_type, funding)
    VALUES (_user_id, _project_id, 'reserved', 'ebookstudio');
    RETURN true;
  END IF;

  RETURN false;
END;
$$;

CREATE OR REPLACE FUNCTION public.cover_pro_restore_credit(_user_id uuid, _project_id uuid DEFAULT NULL, _detail text DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.cover_pro_credits
  SET used = GREATEST(0, used - 1)
  WHERE user_id = _user_id;

  INSERT INTO public.cover_pro_credit_events (user_id, project_id, event_type, funding, detail)
  VALUES (_user_id, _project_id, 'restored', 'ebookstudio', _detail);
END;
$$;

REVOKE ALL ON FUNCTION public.cover_pro_grant_included_credits(uuid, integer) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.cover_pro_reserve_credit(uuid, uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.cover_pro_restore_credit(uuid, uuid, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.cover_pro_grant_included_credits(uuid, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.cover_pro_reserve_credit(uuid, uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.cover_pro_restore_credit(uuid, uuid, text) TO service_role;