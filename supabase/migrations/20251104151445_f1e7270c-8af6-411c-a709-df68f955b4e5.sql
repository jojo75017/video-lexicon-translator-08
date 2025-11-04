-- Ajouter une colonne access_code à la table subscribers
ALTER TABLE public.subscribers 
ADD COLUMN access_code TEXT UNIQUE;

-- Créer un index pour améliorer les performances
CREATE INDEX idx_subscribers_access_code ON public.subscribers(access_code);

-- Générer des codes pour les abonnés existants
UPDATE public.subscribers 
SET access_code = 'EBK-' || upper(substring(md5(random()::text) from 1 for 6))
WHERE access_code IS NULL;