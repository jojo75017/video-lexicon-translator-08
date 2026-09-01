REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;

REVOKE ALL ON FUNCTION public.subscribers_link_user_id() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.subscribers_link_user_id() TO service_role;

ALTER FUNCTION public.admin_list_testimonials() SECURITY INVOKER;