-- Journal d'envoi de l'opération fondateur (15 places à 47 €).
-- Un prospect ne reçoit jamais deux fois le même email, même si l'envoi est
-- relancé par lots successifs de 300 ou 500 adresses.
CREATE TABLE public.offre_fondateur_sends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  email_id text NOT NULL,
  batch_index integer,
  status text NOT NULL DEFAULT 'sent',
  error text,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT offre_fondateur_sends_unique UNIQUE (email, email_id)
);

GRANT ALL ON public.offre_fondateur_sends TO service_role;
GRANT SELECT ON public.offre_fondateur_sends TO authenticated;

ALTER TABLE public.offre_fondateur_sends ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins consultent le journal d'envoi fondateur"
  ON public.offre_fondateur_sends
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER offre_fondateur_sends_set_updated_at
  BEFORE UPDATE ON public.offre_fondateur_sends
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX offre_fondateur_sends_email_id_idx
  ON public.offre_fondateur_sends (email_id, status);