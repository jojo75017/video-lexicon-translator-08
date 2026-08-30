ALTER TABLE public.capture_events DROP CONSTRAINT capture_events_surface_check;
ALTER TABLE public.capture_events ADD CONSTRAINT capture_events_surface_check CHECK (surface = ANY (ARRAY['popup','sticky','demo','inline','cadeau','commander','methode','essai']));
ALTER TABLE public.capture_events DROP CONSTRAINT capture_events_event_type_check;
ALTER TABLE public.capture_events ADD CONSTRAINT capture_events_event_type_check CHECK (event_type = ANY (ARRAY['view','click','submit','checkout_click','checkout_ready','generate_click','outline_shown','wall_shown','email_captured','commander_click']));