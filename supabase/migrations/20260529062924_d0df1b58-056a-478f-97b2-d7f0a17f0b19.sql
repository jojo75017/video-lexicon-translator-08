CREATE TABLE public.beta_promo_codes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'available',
  used_by_email text,
  used_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.beta_promo_codes TO authenticated;
GRANT ALL ON public.beta_promo_codes TO service_role;

ALTER TABLE public.beta_promo_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage beta promo codes"
ON public.beta_promo_codes
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

INSERT INTO public.beta_promo_codes (code) VALUES
  ('BETA-EBOOK-4872'),
  ('BETA-EBOOK-1953'),
  ('BETA-EBOOK-7341'),
  ('BETA-EBOOK-2608'),
  ('BETA-EBOOK-9174');