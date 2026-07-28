// Agent illustrateur — génère une illustration cohérente pour un chapitre
// de livre illustré maternelle et l'upload dans le bucket `ebook-images`.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface Body {
  characterBible: string;
  scene: string;
  stylePrompt: string;
  model?: string;
  storyId: string;
  bookId: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const auth = req.headers.get('Authorization');
    if (!auth) return json({ error: 'Auth requis' }, 401);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const anon = Deno.env.get('SUPABASE_ANON_KEY')!;
    const service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableKey) return json({ error: 'LOVABLE_API_KEY manquante' }, 500);

    const authed = createClient(supabaseUrl, anon, { global: { headers: { Authorization: auth } } });
    const { data: userData } = await authed.auth.getUser();
    if (!userData?.user) return json({ error: 'Non authentifié' }, 401);
    const userId = userData.user.id;

    const body = (await req.json()) as Body;
    if (!body.characterBible || !body.scene) return json({ error: 'characterBible et scene requis' }, 400);

    const model = body.model || 'google/gemini-3.1-flash-image';

    const fullPrompt = [
      body.characterBible,
      `Scène: ${body.scene}`,
      `Style: ${body.stylePrompt}. Illustration pour livre jeunesse 3-6 ans, sans texte dans l'image, cadrage centré, composition claire.`,
      'consistent character across all illustrations, same face, same outfit, same art style',
    ].join('\n\n');

    // Appel Lovable AI Gateway — chat-shape pour les modèles Gemini image
    const genRes = await fetch('https://ai.gateway.lovable.dev/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${lovableKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: fullPrompt }],
        modalities: ['image', 'text'],
      }),
    });

    if (!genRes.ok) {
      const txt = await genRes.text();
      return json({ error: `Gateway ${genRes.status}: ${txt.slice(0, 300)}` }, 502);
    }
    const genJson = await genRes.json();
    const b64: string | undefined = genJson?.data?.[0]?.b64_json;
    if (!b64) return json({ error: 'Pas d\'image retournée par le modèle' }, 502);

    // Upload dans le bucket ebook-images
    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    const path = `${userId}/kids-books/${body.bookId}/${body.storyId}-${Date.now()}.png`;
    const admin = createClient(supabaseUrl, service);
    const { error: upErr } = await admin.storage.from('ebook-images').upload(path, bytes, {
      contentType: 'image/png',
      upsert: true,
    });
    if (upErr) return json({ error: `Upload: ${upErr.message}` }, 500);

    const { data: pub } = admin.storage.from('ebook-images').getPublicUrl(path);
    return json({ url: pub.publicUrl, path, model });
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
