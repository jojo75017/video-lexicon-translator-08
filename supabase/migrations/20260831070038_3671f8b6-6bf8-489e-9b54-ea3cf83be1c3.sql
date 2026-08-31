-- 1) Dédoublonnage strict des envois de campagne
DELETE FROM public.email_send_log a
USING public.email_send_log b
WHERE a.template_name IN ('cadeau-1','cadeau-2','cadeau-3','cadeau-4','cadeau-5')
  AND b.template_name = a.template_name
  AND lower(b.recipient_email) = lower(a.recipient_email)
  AND b.ctid < a.ctid;

CREATE UNIQUE INDEX IF NOT EXISTS email_send_log_campagne_unique
  ON public.email_send_log (template_name, lower(recipient_email))
  WHERE template_name IN ('cadeau-1','cadeau-2','cadeau-3','cadeau-4','cadeau-5');

-- 2) Témoignages : masquer la colonne email au public
REVOKE SELECT ON public.book_testimonials FROM anon, authenticated;
GRANT SELECT (id, author_name, book_title, comment, rating, photo_url, approved, consent_publication, created_at)
  ON public.book_testimonials TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.admin_list_testimonials()
RETURNS TABLE (
  id uuid, email text, author_name text, book_title text, comment text,
  rating integer, photo_url text, approved boolean, consent_publication boolean,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT t.id, t.email, t.author_name, t.book_title, t.comment, t.rating,
         t.photo_url, t.approved, t.consent_publication, t.created_at
  FROM public.book_testimonials t
  WHERE public.has_role(auth.uid(), 'admin')
  ORDER BY t.created_at DESC
$$;

REVOKE ALL ON FUNCTION public.admin_list_testimonials() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_list_testimonials() TO authenticated, service_role;