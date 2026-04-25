-- Supprime les doublons de projets ebook : garde uniquement le projet le plus récemment mis à jour
-- pour chaque combinaison (user_id, title)
WITH ranked AS (
  SELECT id,
         ROW_NUMBER() OVER (PARTITION BY user_id, title ORDER BY updated_at DESC, created_at DESC) as rn
  FROM public.ebook_projects
)
DELETE FROM public.ebook_projects
WHERE id IN (SELECT id FROM ranked WHERE rn > 1);