ALTER TABLE public.subscribers ADD COLUMN IF NOT EXISTS user_id UUID;

UPDATE public.subscribers s
SET user_id = u.id
FROM auth.users u
WHERE lower(u.email) = lower(s.email) AND s.user_id IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS subscribers_user_id_key ON public.subscribers(user_id) WHERE user_id IS NOT NULL;

CREATE OR REPLACE FUNCTION public.subscribers_link_user_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.user_id IS NULL AND NEW.email IS NOT NULL THEN
    SELECT u.id INTO NEW.user_id FROM auth.users u WHERE lower(u.email) = lower(NEW.email) LIMIT 1;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS subscribers_link_user_id_trg ON public.subscribers;
CREATE TRIGGER subscribers_link_user_id_trg
BEFORE INSERT OR UPDATE OF email ON public.subscribers
FOR EACH ROW EXECUTE FUNCTION public.subscribers_link_user_id();