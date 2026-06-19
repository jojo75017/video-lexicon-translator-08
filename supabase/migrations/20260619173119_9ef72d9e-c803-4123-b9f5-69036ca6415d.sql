ALTER TABLE public.funnel_leads ADD COLUMN IF NOT EXISTS lead_magnet text;

GRANT SELECT ON public.email_sequences TO authenticated;

DROP POLICY IF EXISTS "Admins can read email sequences" ON public.email_sequences;
CREATE POLICY "Admins can read email sequences"
ON public.email_sequences
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));