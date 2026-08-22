DELETE FROM public.email_send_log
WHERE id IN (
  SELECT id
  FROM (
    SELECT id,
           ROW_NUMBER() OVER (
             PARTITION BY lower(recipient_email), template_name, status
             ORDER BY created_at ASC, id ASC
           ) AS rn
    FROM public.email_send_log
    WHERE template_name = 'offre-47-directe'
      AND status = 'failed'
  ) sub
  WHERE rn > 1
);