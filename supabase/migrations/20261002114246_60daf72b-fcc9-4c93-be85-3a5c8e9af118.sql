CREATE OR REPLACE FUNCTION public.lancement_places_restantes(_env text DEFAULT 'live')
RETURNS integer LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT GREATEST(0, 15 - COUNT(*)::integer)
  FROM public.v3_installment_orders
  WHERE plan = 'v3_edition_lifetime'
    AND environment = CASE WHEN _env = 'live' THEN 'live' ELSE 'sandbox' END
    AND status IN ('active','completed','paid')
$$;
GRANT EXECUTE ON FUNCTION public.lancement_places_restantes(text) TO anon, authenticated;