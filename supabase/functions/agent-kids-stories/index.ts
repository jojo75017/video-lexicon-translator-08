// Agent générateur d'histoires courtes pour livre illustré maternelle.
// Retourne N histoires { title, synopsis } via Lovable AI Gateway.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface Body {
  bookTitle: string;
  targetAge: string;
  characterBible: string;
  count: number;
  theme?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const auth = req.headers.get('Authorization');
    if (!auth) return json({ error: 'Auth requis' }, 401);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const anon = Deno.env.get('SUPABASE_ANON_KEY')!;
    const lovableKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableKey) return json({ error: 'LOVABLE_API_KEY manquante' }, 500);

    const authed = createClient(supabaseUrl, anon, { global: { headers: { Authorization: auth } } });
    const { data: userData } = await authed.auth.getUser();
    if (!userData?.user) return json({ error: 'Non authentifié' }, 401);

    const body = (await req.json()) as Body;
    const count = Math.max(1, Math.min(30, Number(body.count) || 10));

    const sys = `Tu es un auteur jeunesse pour la maternelle (${body.targetAge || '3-6 ans'}).
Tu écris des histoires TRÈS COURTES (2-3 phrases), rassurantes, positives, avec une petite leçon de vie douce.
Réponds UNIQUEMENT en JSON valide, sans texte autour, sous la forme:
{"stories":[{"title":"...","synopsis":"..."}, ...]}
Le synopsis décrit UNE scène visuelle claire (lieu, action, émotion) — il servira à générer une illustration.`;

    const user = `Livre: "${body.bookTitle}"
${body.theme ? `Thème: ${body.theme}` : ''}
Personnage principal: ${body.characterBible}

Génère ${count} histoires DIFFÉRENTES pour ce personnage.
Chaque histoire = { "title": court et vivant, "synopsis": 2 phrases décrivant une scène visuelle }.
Varie les lieux (école, parc, maison, plage, jardin, chambre...) et les émotions.`;

    const res = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${lovableKey}`,
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: sys },
          { role: 'user', content: user },
        ],
      }),
    });

    if (!res.ok) {
      const txt = await res.text();
      return json({ error: `Gateway ${res.status}: ${txt.slice(0, 300)}` }, 502);
    }
    const j = await res.json();
    const raw: string = j?.choices?.[0]?.message?.content ?? '';
    const m = raw.match(/\{[\s\S]*\}/);
    if (!m) return json({ error: 'Réponse IA illisible' }, 502);
    let parsed: { stories?: { title: string; synopsis: string }[] };
    try { parsed = JSON.parse(m[0]); } catch { return json({ error: 'JSON invalide' }, 502); }
    const stories = (parsed.stories || []).filter((s) => s?.title && s?.synopsis).slice(0, count);
    return json({ stories });
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
