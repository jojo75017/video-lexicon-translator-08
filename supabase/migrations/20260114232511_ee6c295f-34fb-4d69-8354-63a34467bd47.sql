-- Table pour suivre la séquence d'emails de chaque inscrit
CREATE TABLE public.email_sequences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  sequence_name TEXT NOT NULL DEFAULT 'welcome',
  current_step INTEGER NOT NULL DEFAULT 0,
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_email_sent_at TIMESTAMP WITH TIME ZONE,
  next_email_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed BOOLEAN NOT NULL DEFAULT false,
  unsubscribed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(email, sequence_name)
);

-- Enable RLS
ALTER TABLE public.email_sequences ENABLE ROW LEVEL SECURITY;

-- Policy pour service role uniquement (edge functions)
CREATE POLICY "Service role can manage email sequences"
ON public.email_sequences
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Index pour les requêtes de cron
CREATE INDEX idx_email_sequences_next_email ON public.email_sequences(next_email_at) WHERE completed = false AND unsubscribed = false;

-- Trigger pour updated_at
CREATE TRIGGER update_email_sequences_updated_at
BEFORE UPDATE ON public.email_sequences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();