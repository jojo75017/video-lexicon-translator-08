REVOKE EXECUTE ON FUNCTION public.can_create_vip() FROM anon;
REVOKE EXECUTE ON FUNCTION public.count_vip_subscribers() FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.subscribers_link_user_id() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.vip_days_remaining() FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_my_module_entitlements() FROM anon;

ALTER FUNCTION public.can_create_vip() SECURITY INVOKER;
ALTER FUNCTION public.count_vip_subscribers() SECURITY INVOKER;
ALTER FUNCTION public.get_my_funnel_orders() SECURITY INVOKER;
ALTER FUNCTION public.get_my_module_entitlements() SECURITY INVOKER;
ALTER FUNCTION public.get_my_v3_installment_orders() SECURITY INVOKER;
ALTER FUNCTION public.get_referral_stats(uuid) SECURITY INVOKER;
ALTER FUNCTION public.vip_days_remaining() SECURITY INVOKER;