
-- Table des prospects pour la campagne de vente
CREATE TABLE public.sales_prospects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  first_name text DEFAULT '',
  source text DEFAULT 'excel_import',
  current_step integer DEFAULT 0,
  last_email_sent_at timestamptz,
  next_email_at timestamptz DEFAULT now(),
  auto_send boolean DEFAULT false,
  status text DEFAULT 'active',
  unsubscribed boolean DEFAULT false,
  completed boolean DEFAULT false,
  imported_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(email)
);

-- RLS: admin only
ALTER TABLE public.sales_prospects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage sales prospects"
  ON public.sales_prospects FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Trigger updated_at
CREATE TRIGGER update_sales_prospects_updated_at
  BEFORE UPDATE ON public.sales_prospects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
