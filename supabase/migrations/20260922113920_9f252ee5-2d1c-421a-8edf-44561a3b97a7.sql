REVOKE SELECT ON public.paypal_plan_cache FROM authenticated;
DROP POLICY IF EXISTS "Anyone signed in can read PayPal plan cache" ON public.paypal_plan_cache;

DROP POLICY IF EXISTS "Testimonial photos readable" ON storage.objects;