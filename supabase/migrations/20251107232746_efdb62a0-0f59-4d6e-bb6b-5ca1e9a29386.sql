-- A. Supprimer la ligne invalide avec user_id NULL
DELETE FROM public.user_roles WHERE user_id IS NULL;

-- B. Ajouter la contrainte UNIQUE manquante (CRITIQUE!)
ALTER TABLE public.user_roles 
ADD CONSTRAINT user_roles_user_id_role_unique UNIQUE (user_id, role);

-- C. Rendre user_id NOT NULL pour éviter de futurs problèmes
ALTER TABLE public.user_roles 
ALTER COLUMN user_id SET NOT NULL;