WITH reached AS (
  SELECT lower(trim(recipient_email)) AS email,
         MAX((regexp_replace(template_name, '^offre-47-unique-([1-5]).*$', '\1'))::int) AS step
  FROM public.email_send_log
  WHERE template_name ~ '^offre-47-unique-[1-5]'
    AND status IN ('sent','delivered')
  GROUP BY 1
)
UPDATE public.sales_prospects sp
SET current_step = r.step,
    completed = (r.step >= 5),
    next_email_at = CASE WHEN r.step >= 5 THEN NULL ELSE now() + interval '2 days' END
FROM reached r
WHERE lower(trim(sp.email)) = r.email
  AND sp.current_step < r.step;