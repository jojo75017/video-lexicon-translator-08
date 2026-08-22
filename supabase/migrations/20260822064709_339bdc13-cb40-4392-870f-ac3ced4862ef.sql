DELETE FROM public.email_send_log
WHERE id IN (
  SELECT p.id
  FROM public.email_send_log p
  WHERE p.template_name = 'offre-47-directe'
    AND p.status = 'pending'
    AND EXISTS (
      SELECT 1 FROM public.email_send_log f
      WHERE f.template_name = p.template_name
        AND lower(f.recipient_email) = lower(p.recipient_email)
        AND f.status IN ('sent','delivered','failed')
        AND f.id <> p.id
    )
);