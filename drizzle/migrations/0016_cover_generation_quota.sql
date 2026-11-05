CREATE TABLE public.cover_generation_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  source text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.cover_generation_log TO authenticated;
GRANT ALL ON public.cover_generation_log TO service_role;
ALTER TABLE public.cover_generation_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own cover log" ON public.cover_generation_log FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE INDEX idx_cover_gen_log_user ON public.cover_generation_log(user_id, created_at);

-- Les couvertures/images sont comptées à chaque génération (tous studios), plus à la création d'un projet.
DROP TRIGGER IF EXISTS trg_monthly_quota ON public.cover_projects;

CREATE OR REPLACE FUNCTION public.monthly_quota_status(_user_id uuid)
RETURNS TABLE(plan text, books_used integer, books_limit integer, covers_used integer, covers_limit integer)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE _email text; _plan text; _start timestamptz;
BEGIN
  IF _user_id IS NULL OR public.has_role(_user_id, 'admin') THEN RETURN; END IF;
  SELECT lower(email) INTO _email FROM auth.users WHERE id = _user_id;
  IF _email IS NULL THEN RETURN; END IF;
  IF EXISTS (SELECT 1 FROM subscribers s WHERE lower(s.email)=_email AND s.status='active' AND s.plan_type='lifetime') THEN RETURN; END IF;
  SELECT o.plan INTO _plan FROM v3_installment_orders o
   WHERE lower(o.email)=_email AND o.plan LIKE 'v3m_%' AND o.status IN ('active','past_due')
   ORDER BY CASE o.plan WHEN 'v3m_vip_monthly' THEN 3 WHEN 'v3m_auteur_monthly' THEN 2 ELSE 1 END DESC LIMIT 1;
  IF _plan IS NULL THEN RETURN; END IF;
  _start := (date_trunc('month', now() AT TIME ZONE 'Europe/Paris')) AT TIME ZONE 'Europe/Paris';
  plan := _plan;
  books_limit := CASE _plan WHEN 'v3m_debutant_monthly' THEN 20 WHEN 'v3m_auteur_monthly' THEN 50 ELSE -1 END;
  covers_limit := CASE _plan WHEN 'v3m_debutant_monthly' THEN 10 WHEN 'v3m_auteur_monthly' THEN 30 ELSE 50 END;
  books_used := (SELECT count(*) FROM ebook_projects WHERE user_id=_user_id AND created_at>=_start)
    + (SELECT count(*) FROM book_projects WHERE user_id=_user_id AND created_at>=_start)
    + (SELECT count(*) FROM comic_books WHERE user_id=_user_id AND created_at>=_start)
    + (SELECT count(*) FROM vc_books WHERE user_id=_user_id AND created_at>=_start)
    + (SELECT count(*) FROM illustrated_guides WHERE user_id=_user_id AND created_at>=_start);
  covers_used := (SELECT count(*) FROM cover_generation_log WHERE user_id=_user_id AND created_at>=_start);
  RETURN NEXT;
END $$;
REVOKE ALL ON FUNCTION public.monthly_quota_status(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.monthly_quota_status(uuid) TO service_role;