import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const EXT_BY_MIME: Record<string, string> = {
  'audio/webm': 'webm',
  'audio/mp4': 'mp4',
  'audio/mpeg': 'mp3',
  'audio/mp3': 'mp3',
  'audio/ogg': 'ogg',
  'audio/wav': 'wav',
  'audio/x-wav': 'wav',
  'audio/flac': 'flac',
  'audio/aac': 'aac',
  'audio/x-m4a': 'm4a',
  'video/mp4': 'mp4',
  'video/quicktime': 'mov',
  'video/webm': 'webm',
  'video/x-matroska': 'mkv',
};

// 25 MiB — limite de la gateway de transcription.
const MAX_BYTES = 25 * 1024 * 1024;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return json({ error: 'Non authentifié' }, 401);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData?.user) return json({ error: 'Session invalide' }, 401);

    const { data: isAdmin } = await supabase.rpc('has_role', { _user_id: userData.user.id, _role: 'admin' });
    if (!isAdmin) return json({ error: 'Accès réservé aux administrateurs' }, 403);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) return json({ error: 'Clé IA non configurée' }, 500);

    const form = await req.formData().catch(() => null);
    const file = form?.get('file');
    if (!(file instanceof File)) return json({ error: 'Aucun fichier audio/vidéo fourni.' }, 400);
    if (file.size === 0) return json({ error: 'Fichier vide.' }, 400);
    if (file.size > MAX_BYTES) return json({ error: 'Fichier trop volumineux (max 25 Mo). Découpe-le ou compresse l’audio.' }, 413);

    const mime = (file.type || '').split(';')[0];
    const ext = EXT_BY_MIME[mime] ?? (file.name.split('.').pop() || 'mp3');
    const language = (form?.get('language') ?? '').toString().trim();

    const upstream = new FormData();
    upstream.append('model', 'openai/gpt-4o-transcribe');
    upstream.append('file', file, `media.${ext}`);
    if (language) upstream.append('language', language);

    const res = await fetch('https://ai.gateway.lovable.dev/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}` },
      body: upstream,
    });

    if (res.status === 429) return json({ error: 'Trop de requêtes, réessaie dans un instant.' }, 429);
    if (res.status === 402) return json({ error: 'Crédits IA épuisés.' }, 402);
    if (!res.ok) {
      const t = await res.text().catch(() => '');
      console.error('transcribe gateway error', res.status, t);
      return json({ error: 'Le moteur de transcription a échoué. Vérifie le format du fichier.' }, 502);
    }

    const data = await res.json();
    const text = (data?.text ?? '').toString().trim();
    if (!text) return json({ error: 'Aucune parole détectée dans le fichier.' }, 422);

    return json({ text, language: language || 'auto', durationChars: text.length });
  } catch (e) {
    console.error('transcribe-media error', e);
    return json({ error: e instanceof Error ? e.message : 'Erreur inconnue' }, 500);
  }
});
