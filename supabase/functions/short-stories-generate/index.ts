// Agent générateur d'histoires courtes & contes illustrés pour KDP.
// Retourne N histoires { title, synopsis, content, illustrationPromptEn, moral } via Lovable AI Gateway.
// Option generateImages : génère aussi l'illustration via le gateway image.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface Body {
  bookTitle: string;
  targetAge: '3-6' | '7-12' | 'adultes';
  theme?: string;
  tone?: string;
  count: number;
  wordsPerStory?: number;
  characterBible?: string;
  preset?: string;
  generateImages?: boolean;
  startIndex?: number;
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
    const words = Math.max(50, Math.min(2500, Number(body.wordsPerStory) || 250));
    const targetAge = body.targetAge || '3-6';
    const generateImages = !!body.generateImages;
    const startIndex = Math.max(0, Number(body.startIndex) || 0);

    const ageBlock = targetAge === '3-6'
      ? `Public : maternelle 3-6 ans. Histoires du soir très courtes, rassurantes, positives, avec une petite leçon de vie douce. Phrases simples, vocabulaire adapté à l'âge. Environ ${words} mots (±15%).`
      : targetAge === '7-12'
        ? `Public : jeunesse 7-12 ans. Contes aventureux ou mystérieux, personnages attachants, rebondissements adaptés. Environ ${words} mots (±15%).`
        : `Public : adultes. Nouvelles, contes philosophiques, feel-good ou réflexifs. Environ ${words} mots (±15%).`;

    const toneBlock = body.tone ? `\nTON À RESPECTER STRICTEMENT : ${body.tone}` : '';
    const themeBlock = body.theme ? `\nThème / fil rouge du livre : ${body.theme}` : '';
    const charBlock = body.characterBible ? `\nPersonnage(s) récurrent(s) : ${body.characterBible}` : '';
    const presetBlock = body.preset ? `\nPreset éditorial : ${body.preset}` : '';

    const sys = `Tu es un auteur de contes et d'histoires courtes pour le marché KDP francophone.
${ageBlock}
Chaque histoire doit être entièrement en français. INTERDICTIONS : latin, pseudo-langues, mots inventés, mots étrangers décoratifs.
Chaque histoire se termine par une phrase complète avec un point.
Réponds UNIQUEMENT en JSON valide, sans texte autour, sous la forme:
{"stories":[{"title":"...","synopsis":"...","content":"...","illustrationPromptEn":"...","moral":"..."}, ...]}
- title : titre court, accrocheur, en français.
- synopsis : 1-2 phrases décrivant UNE scène visuelle claire (lieu, action, émotion) — servira à l'illustration.
- content : le texte complet de l'histoire (~${words} mots), prêt à imprimer, sans titre répété.
- illustrationPromptEn : prompt optimisé en anglais pour générer une illustration de l'histoire (style line art / coloriage ou scène narrative selon le contexte), 30-60 mots.
- moral : une courte morale ou message positif (1 phrase).${toneBlock}`;

    const user = `Livre : "${body.bookTitle || 'Histoires courtes & contes illustrés'}"${themeBlock}${charBlock}${presetBlock}

Génère ${count} histoires DIFFÉRENTES et cohérentes.
Numérote-les à partir de ${startIndex + 1} pour le sommaire final (champ numero implicite).
Varie les lieux et les émotions. Texte 100 % français.`;

    const res = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${lovableKey}`,
      },
      body: JSON.stringify({
        model: 'google/gemini-3.6-flash',
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

    let parsed: { stories?: { title: string; synopsis: string; content?: string; illustrationPromptEn?: string; moral?: string }[] };
    try { parsed = JSON.parse(m[0]); } catch { return json({ error: 'JSON invalide' }, 502); }

    let stories = (parsed.stories || [])
      .filter((s) => s?.title && s?.synopsis)
      .map((s, i) => ({
        numero: startIndex + i + 1,
        title: s.title,
        synopsis: s.synopsis,
        content: s.content || '',
        illustrationPromptEn: s.illustrationPromptEn || '',
        moral: s.moral || '',
      }))
      .slice(0, count);

    // Génération optionnelle des illustrations
    if (generateImages && stories.length > 0) {
      stories = await Promise.all(stories.map(async (s) => {
        if (!s.illustrationPromptEn) return { ...s, imageUrl: '' };
        try {
          const imgRes = await fetch('https://ai.gateway.lovable.dev/v1/images/generations', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${lovableKey}`,
            },
            body: JSON.stringify({
              model: 'google/gemini-3.1-flash-image',
              prompt: s.illustrationPromptEn,
              n: 1,
              size: '1024x1024',
            }),
          });
          if (!imgRes.ok) return { ...s, imageUrl: '' };
          const imgJ = await imgRes.json();
          const url = imgJ?.data?.[0]?.url || '';
          return { ...s, imageUrl: url };
        } catch {
          return { ...s, imageUrl: '' };
        }
      }));
    }

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
