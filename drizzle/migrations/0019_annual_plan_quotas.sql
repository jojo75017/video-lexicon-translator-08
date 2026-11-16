CREATE OR REPLACE FUNCTION public.monthly_quota_status(_user_id uuid)
 RETURNS TABLE(plan text, books_used integer, books_limit integer, covers_used integer, covers_limit integer)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE _email text; _plan text; _start timestamptz;
BEGIN
  IF _user_id IS NULL OR public.has_role(_user_id, 'admin') THEN RETURN; END IF;
  SELECT lower(email) INTO _email FROM auth.users WHERE id = _user_id;
  IF _email IS NULL THEN RETURN; END IF;
  IF EXISTS (SELECT 1 FROM subscribers s WHERE lower(s.email)=_email AND s.status='active' AND s.plan_type='lifetime') THEN RETURN; END IF;
  SELECT o.plan INTO _plan FROM v3_installment_orders o
   WHERE lower(o.email)=_email AND o.plan LIKE 'v3m_%' AND o.status IN ('active','past_due')
   ORDER BY CASE WHEN o.plan LIKE 'v3m\_vip\_%' THEN 3 WHEN o.plan LIKE 'v3m\_auteur\_%' THEN 2 ELSE 1 END DESC LIMIT 1;
  IF _plan IS NULL THEN RETURN; END IF;
  _start := (date_trunc('month', now() AT TIME ZONE 'Europe/Paris')) AT TIME ZONE 'Europe/Paris';
  plan := _plan;
  books_limit := CASE WHEN _plan LIKE 'v3m\_debutant\_%' THEN 20 WHEN _plan LIKE 'v3m\_auteur\_%' THEN 50 ELSE -1 END;
  covers_limit := CASE WHEN _plan LIKE 'v3m\_debutant\_%' THEN 10 WHEN _plan LIKE 'v3m\_auteur\_%' THEN 30 ELSE 50 END;
  books_used := (SELECT count(*) FROM ebook_projects WHERE user_id=_user_id AND created_at>=_start)
    + (SELECT count(*) FROM book_projects WHERE user_id=_user_id AND created_at>=_start)
    + (SELECT count(*) FROM comic_books WHERE user_id=_user_id AND created_at>=_start)
    + (SELECT count(*) FROM vc_books WHERE user_id=_user_id AND created_at>=_start)
    + (SELECT count(*) FROM illustrated_guides WHERE user_id=_user_id AND created_at>=_start);
  covers_used := (SELECT count(*) FROM cover_generation_log WHERE user_id=_user_id AND created_at>=_start);
  RETURN NEXT;
END $function$;