CREATE TABLE public.subscriber_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text,
  last_name text,
  pen_name text,
  address_line text,
  postal_code text,
  city text,
  country text,
  phone text,
  billing_email text,
  website_url text,
  facebook_url text,
  instagram_url text,
  x_url text,
  tiktok_url text,
  youtube_url text,
  linkedin_url text,
  pinterest_url text,
  amazon_author_url text,
  socials_public boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.subscriber_profiles TO authenticated;
GRANT ALL ON public.subscriber_profiles TO service_role;

ALTER TABLE public.subscriber_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Own profile only" ON public.subscriber_profiles
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER subscriber_profiles_set_updated_at
  BEFORE UPDATE ON public.subscriber_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.subscriber_integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider text NOT NULL,
  api_key text,
  list_id text,
  webhook_url text,
  status text NOT NULL DEFAULT 'unknown',
  last_tested_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, provider)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.subscriber_integrations TO authenticated;
GRANT ALL ON public.subscriber_integrations TO service_role;

ALTER TABLE public.subscriber_integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Own integrations only" ON public.subscriber_integrations
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER subscriber_integrations_set_updated_at
  BEFORE UPDATE ON public.subscriber_integrations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();