ALTER TABLE public.capture_events
  DROP CONSTRAINT IF EXISTS capture_events_surface_check;

ALTER TABLE public.capture_events
  ADD CONSTRAINT capture_events_surface_check
  CHECK (surface = ANY (ARRAY[
    'popup'::text,
    'sticky'::text,
    'demo'::text,
    'inline'::text,
    'cadeau'::text,
    'commander'::text,
    'methode'::text
  ]));