UPDATE public.ebook_projects p
SET chapters = (
  SELECT jsonb_agg(
    CASE WHEN i = 40 THEN jsonb_set(jsonb_set(c, '{title}', '"Suie et puanteur fétide"'::jsonb), '{titre}', '"Suie et puanteur fétide"'::jsonb) ELSE c END
    ORDER BY i
  )
  FROM jsonb_array_elements(p.chapters) WITH ORDINALITY t(c, i)
)
WHERE p.id = 'd1bad0b0-6ced-4459-9658-9fd2f16a62d0';