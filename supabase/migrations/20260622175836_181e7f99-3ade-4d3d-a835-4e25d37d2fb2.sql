CREATE TABLE public.capture_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type text NOT NULL CHECK (event_type IN ('view','click')),
  surface text NOT NULL CHECK (surface IN ('popup','sticky','demo','inline','cadeau')),
  ab_variant text CHECK (ab_variant IN ('A','B')),
  lead_magnet text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  page_path text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.capture_events TO authenticated;
GRANT INSERT ON public.capture_events TO anon, authenticated;
GRANT ALL ON public.capture_events TO service_role;

ALTER TABLE public.capture_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert capture events"
ON public.capture_events FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admins can read capture events"
ON public.capture_events FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_capture_events_created_at ON public.capture_events (created_at DESC);
CREATE INDEX idx_capture_events_surface ON public.capture_events (surface);

ALTER PUBLICATION supabase_realtime ADD TABLE public.capture_events;