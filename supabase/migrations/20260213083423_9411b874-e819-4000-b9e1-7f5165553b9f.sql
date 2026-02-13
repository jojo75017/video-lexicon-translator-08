
CREATE OR REPLACE FUNCTION public.can_create_vip()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT (SELECT COUNT(*) FROM public.subscribers WHERE plan_tier = 'vip' AND status = 'active') < 30
$function$;
