CREATE TABLE public.module_entitlements (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  module text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  amount numeric,
  currency text DEFAULT 'eur',
  environment text NOT NULL DEFAULT 'sandbox',
  stripe_session_id text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.module_entitlements TO authenticated;
GRANT ALL ON public.module_entitlements TO service_role;

ALTER TABLE public.module_entitlements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own module entitlements"
ON public.module_entitlements
FOR SELECT
TO authenticated
USING (lower(email) = lower(auth.email()));

CREATE INDEX idx_module_entitlements_email_module
ON public.module_entitlements (lower(email), module);

CREATE TRIGGER update_module_entitlements_updated_at
BEFORE UPDATE ON public.module_entitlements
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.get_my_module_entitlements()
RETURNS TABLE(id uuid, email text, module text, status text, amount numeric, currency text, environment text, created_at timestamp with time zone)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT id, email, module, status, amount, currency, environment, created_at
  FROM public.module_entitlements
  WHERE lower(email) = lower(auth.email());
$function$;