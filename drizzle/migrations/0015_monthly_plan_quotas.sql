CREATE OR REPLACE FUNCTION public.monthly_quota_status(_user_id uuid)
RETURNS TABLE(plan text, books_used integer, books_limit integer, covers_used integer, covers_limit integer)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE _email text; _plan text; _start timestamptz;
BEGIN
  IF _user_id IS NULL OR public.has_role(_user_id, 'admin') THEN RETURN; END IF;
  SELECT lower(email) INTO _email FROM auth.users WHERE id = _user_id;
  IF _email IS NULL THEN RETURN; END IF;
  -- Anciens clients à vie : jamais de plafond
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
  covers_used := (SELECT count(*) FROM cover_projects WHERE user_id=_user_id AND created_at>=_start);
  RETURN NEXT;
END $$;

CREATE OR REPLACE FUNCTION public.get_my_monthly_quota()
RETURNS TABLE(plan text, books_used integer, books_limit integer, covers_used integer, covers_limit integer)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT * FROM public.monthly_quota_status(auth.uid());
$$;
REVOKE ALL ON FUNCTION public.monthly_quota_status(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_monthly_quota() TO authenticated;

CREATE OR REPLACE FUNCTION public.enforce_monthly_book_quota()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE q record;
BEGIN
  SELECT * INTO q FROM public.monthly_quota_status(NEW.user_id);
  IF q.plan IS NOT NULL AND q.books_limit <> -1 AND q.books_used >= q.books_limit THEN
    RAISE EXCEPTION 'Vous avez utilisé vos % livres de ce mois. Ils reviennent le 1er du mois prochain, ou passez à la formule supérieure.', q.books_limit USING ERRCODE='P0001';
  END IF;
  RETURN NEW;
END $$;

CREATE OR REPLACE FUNCTION public.enforce_monthly_cover_quota()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE q record;
BEGIN
  SELECT * INTO q FROM public.monthly_quota_status(NEW.user_id);
  IF q.plan IS NOT NULL AND q.covers_used >= q.covers_limit THEN
    RAISE EXCEPTION 'Vous avez utilisé vos % couvertures de ce mois. Elles reviennent le 1er du mois prochain, ou passez à la formule supérieure.', q.covers_limit USING ERRCODE='P0001';
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_monthly_quota ON public.ebook_projects;
CREATE TRIGGER trg_monthly_quota BEFORE INSERT ON public.ebook_projects FOR EACH ROW EXECUTE FUNCTION public.enforce_monthly_book_quota();
DROP TRIGGER IF EXISTS trg_monthly_quota ON public.book_projects;
CREATE TRIGGER trg_monthly_quota BEFORE INSERT ON public.book_projects FOR EACH ROW EXECUTE FUNCTION public.enforce_monthly_book_quota();
DROP TRIGGER IF EXISTS trg_monthly_quota ON public.comic_books;
CREATE TRIGGER trg_monthly_quota BEFORE INSERT ON public.comic_books FOR EACH ROW EXECUTE FUNCTION public.enforce_monthly_book_quota();
DROP TRIGGER IF EXISTS trg_monthly_quota ON public.vc_books;
CREATE TRIGGER trg_monthly_quota BEFORE INSERT ON public.vc_books FOR EACH ROW EXECUTE FUNCTION public.enforce_monthly_book_quota();
DROP TRIGGER IF EXISTS trg_monthly_quota ON public.illustrated_guides;
CREATE TRIGGER trg_monthly_quota BEFORE INSERT ON public.illustrated_guides FOR EACH ROW EXECUTE FUNCTION public.enforce_monthly_book_quota();
DROP TRIGGER IF EXISTS trg_monthly_quota ON public.cover_projects;
CREATE TRIGGER trg_monthly_quota BEFORE INSERT ON public.cover_projects FOR EACH ROW EXECUTE FUNCTION public.enforce_monthly_cover_quota();