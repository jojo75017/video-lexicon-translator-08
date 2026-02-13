
-- Replace quota-based VIP check with 60-day countdown from launch date
-- Launch date: 2026-02-13 (today)
CREATE OR REPLACE FUNCTION public.can_create_vip()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT now() < ('2026-02-13'::timestamptz + interval '60 days')
$function$;

-- New function: get remaining days for VIP offer
CREATE OR REPLACE FUNCTION public.vip_days_remaining()
 RETURNS integer
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT GREATEST(0, EXTRACT(DAY FROM (('2026-02-13'::timestamptz + interval '60 days') - now()))::integer)
$function$;
