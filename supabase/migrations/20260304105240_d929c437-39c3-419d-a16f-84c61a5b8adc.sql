
-- Update VIP offer deadline to June 30, 2026
CREATE OR REPLACE FUNCTION public.can_create_vip()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT now() < '2026-06-30T23:59:59+00:00'::timestamptz
$function$;

CREATE OR REPLACE FUNCTION public.vip_days_remaining()
 RETURNS integer
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT GREATEST(0, EXTRACT(DAY FROM ('2026-06-30T23:59:59+00:00'::timestamptz - now()))::integer)
$function$;
