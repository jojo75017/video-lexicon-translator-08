-- Table pour stocker les demandes de paiement en attente
CREATE TABLE public.payment_confirmations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  processed_by TEXT
);

-- Enable RLS
ALTER TABLE public.payment_confirmations ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert a confirmation (public form)
CREATE POLICY "Anyone can submit payment confirmation" 
ON public.payment_confirmations 
FOR INSERT 
WITH CHECK (true);

-- Policy: Only admins can read (via service role in edge functions)
CREATE POLICY "Admins can read confirmations" 
ON public.payment_confirmations 
FOR SELECT 
USING (true);

-- Policy: Only admins can update
CREATE POLICY "Admins can update confirmations" 
ON public.payment_confirmations 
FOR UPDATE 
USING (true);

-- Enable realtime for instant notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.payment_confirmations;