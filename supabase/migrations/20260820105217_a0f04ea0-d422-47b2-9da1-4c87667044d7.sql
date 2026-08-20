-- 1) Essais gratuits (chapitre 1 offert)
CREATE TABLE public.trial_chapters (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text,
  book_idea text NOT NULL,
  audience text,
  tone text,
  language text NOT NULL DEFAULT 'fr',
  proposed_title text,
  proposed_subtitle text,
  outline jsonb NOT NULL DEFAULT '[]'::jsonb,
  chapter_title text,
  chapter_text text,
  word_count integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'generated',
  ip text,
  user_agent text,
  utm_source text,
  utm_campaign text,
  delivered_at timestamptz,
  converted_user_id uuid,
  converted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX trial_chapters_email_idx ON public.trial_chapters (lower(email));
CREATE INDEX trial_chapters_created_idx ON public.trial_chapters (created_at DESC);

GRANT SELECT ON public.trial_chapters TO authenticated;
GRANT ALL ON public.trial_chapters TO service_role;

ALTER TABLE public.trial_chapters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read their own trial chapters"
  ON public.trial_chapters FOR SELECT TO authenticated
  USING (converted_user_id = auth.uid() OR lower(email) = lower(auth.email()));

CREATE POLICY "Admins read all trial chapters"
  ON public.trial_chapters FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trial_chapters_set_updated_at
  BEFORE UPDATE ON public.trial_chapters
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2) Liste d'attente des membres fondateurs
CREATE TABLE public.launch_waitlist (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  user_id uuid,
  plan text NOT NULL,
  billing_interval text NOT NULL DEFAULT 'month',
  amount numeric,
  currency text NOT NULL DEFAULT 'eur',
  rank integer GENERATED ALWAYS AS IDENTITY,
  status text NOT NULL DEFAULT 'pending',
  trial_ends_at timestamptz,
  stripe_customer_id text,
  stripe_subscription_id text,
  environment text NOT NULL DEFAULT 'sandbox',
  trial_chapter_id uuid REFERENCES public.trial_chapters(id) ON DELETE SET NULL,
  source text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX launch_waitlist_email_key ON public.launch_waitlist (lower(email));

GRANT SELECT ON public.launch_waitlist TO authenticated;
GRANT ALL ON public.launch_waitlist TO service_role;

ALTER TABLE public.launch_waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read their own waitlist entry"
  ON public.launch_waitlist FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR lower(email) = lower(auth.email()));

CREATE POLICY "Admins read the whole waitlist"
  ON public.launch_waitlist FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER launch_waitlist_set_updated_at
  BEFORE UPDATE ON public.launch_waitlist
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3) Interrupteurs du lancement
CREATE TABLE public.launch_settings (
  key text NOT NULL PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.launch_settings TO anon, authenticated;
GRANT INSERT, UPDATE ON public.launch_settings TO authenticated;
GRANT ALL ON public.launch_settings TO service_role;

ALTER TABLE public.launch_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read launch settings"
  ON public.launch_settings FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Admins manage launch settings"
  ON public.launch_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER launch_settings_set_updated_at
  BEFORE UPDATE ON public.launch_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.launch_settings (key, value) VALUES
  ('free_trial_open', '{"enabled": true}'::jsonb),
  ('v3_open', '{"enabled": false, "opens_at": "2026-10-01T08:00:00+02:00"}'::jsonb),
  ('first_month_free_open', '{"enabled": true, "closes_at": "2026-09-30T23:59:59+02:00"}'::jsonb);