-- Met à jour le setting launch_video avec l'URL du MP3 et le type audio
INSERT INTO public.launch_settings (key, value, updated_at)
VALUES (
  'launch_video',
  '{"enabled": true, "url": "https://xvdgazrewsuaqtalqxue.supabase.co/storage/v1/object/public/launch-media/message-lancement.mp3", "kind": "audio"}'::jsonb,
  now()
)
ON CONFLICT (key) DO UPDATE
SET value = EXCLUDED.value,
    updated_at = EXCLUDED.updated_at;
