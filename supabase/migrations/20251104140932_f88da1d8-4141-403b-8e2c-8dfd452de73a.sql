-- Créer l'enum pour les rôles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Créer la table user_roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Fonction de sécurité pour vérifier les rôles
CREATE OR REPLACE FUNCTION public.has_role(_email TEXT, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE email = _email AND role = _role
  )
$$;

-- Politique pour que les admins puissent tout faire
CREATE POLICY "Admins can manage user_roles"
ON public.user_roles
FOR ALL
USING (public.has_role(email, 'admin'))
WITH CHECK (public.has_role(email, 'admin'));

-- Politique pour que les utilisateurs puissent voir leur propre rôle
CREATE POLICY "Users can view their own role"
ON public.user_roles
FOR SELECT
USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Insérer un premier admin (remplacez l'email par le vôtre)
INSERT INTO public.user_roles (email, role)
VALUES ('admin@example.com', 'admin');