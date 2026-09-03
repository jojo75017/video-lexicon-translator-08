REVOKE ALL ON public.cover_pro_api_keys FROM anon, authenticated;

GRANT SELECT (user_id, provider, key_mask, last_tested_at, last_test_ok, created_at, updated_at)
  ON public.cover_pro_api_keys TO authenticated;

GRANT ALL ON public.cover_pro_api_keys TO service_role;