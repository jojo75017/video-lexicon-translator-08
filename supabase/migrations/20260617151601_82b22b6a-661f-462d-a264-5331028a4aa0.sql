CREATE TABLE public.v3_gift_cards (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code text NOT NULL UNIQUE,
  plan text NOT NULL DEFAULT 'base',
  amount_paid numeric NOT NULL,
  currency text NOT NULL DEFAULT 'EUR',
  buyer_email text NOT NULL,
  recipient_email text,
  status text NOT NULL DEFAULT 'pending_payment',
  stripe_session_id text,
  redeemed_by_email text,
  redeemed_at timestamptz,
  environment text NOT NULL DEFAULT 'sandbox',
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.v3_gift_cards TO service_role;

ALTER TABLE public.v3_gift_cards ENABLE ROW LEVEL SECURITY;
-- Aucune policy : tout accès passe par les edge functions en service_role.