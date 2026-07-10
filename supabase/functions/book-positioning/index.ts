import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Stratège de Positionnement — cherche les meilleures positions du livre :
// catégories KDP atteignables, 7 mots-clés porteurs, angle concurrentiel.
// Réservé aux agents V4 (gate côté frontend).

const TOOL = {
  type: 'function',
  function: {
    name: 'report_positioning',
    description: "Détermine le meilleur positionnement Amazon KDP d'un livre : catégories atteignables, 7 mots-clés porteurs, et angle concurrentiel.",
    parameters: {
      type: 'object',
      properties: {
        categories: {
          type: 'array',
          description: '5 à 8 sous-catégories Amazon KDP où le livre peut réalistement se classer.',
          items: {
            type: 'object',
            properties: {
              path: { type: 'string', description: 'Chemin complet de la catégorie (ex : Livres > Développement personnel > Confiance en soi).' },
              difficulty: { type: 'string', description: 'faible, moyen ou fort.' },
              target_rank: { type: 'string', description: 'Rang bestseller réaliste à viser (ex : Top 20).' },
              why: { type: 'string', description: 'Pourquoi cette catégorie est atteignable.' },
            },
            required: ['path', 'difficulty', 'target_rank', 'why'],
            additionalProperties: false,
          },
        },
        keywords: {
          type: 'array',
          description: 'Exactement 7 mots-clés KDP porteurs (les 7 champs mots-clés de KDP).',
          items: {
            type: 'object',
            properties: {
              keyword: { type: 'string' },
              intent: { type: 'string', description: 'Intention de recherche / raison du choix.' },
            },
            required: ['keyword', 'intent'],
            additionalProperties: false,
          },
        },
        competitive: {
          type: 'object',
          properties: {
            angle: { type: 'string', description: 'Angle libre à prendre pour se démarquer dans la niche.' },
            gaps: { type: 'array', description: '3 à 5 manques des best-sellers à exploiter.', items: { type: 'string' } },
            watchouts: { type: 'array', description: '2 à 4 pièges / concurrents forts à surveiller.', items: { type: 'string' } },
          },
          required: ['angle', 'gaps', 'watchouts'],
          additionalProperties: false,
        },
        summary: { type: 'string', description: 'Synthèse du positionnement recommandé en 2-3 phrases.' },
      },
      required: ['categories', 'keywords', 'competitive', 'summary'],
      additionalProperties: false,
    },
  },
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return new Response(JSON.stringify({ error: 'Non authentifié' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '', { global: { headers: { Authorization: authHeader } } });
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData?.user) return new Response(JSON.stringify({ error: 'Session invalide' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const body = await req.json().catch(() => ({}));
    const title = (body?.title ?? '').toString().trim();
    const genre = (body?.genre ?? '').toString().trim();
    const audience = (body?.audience ?? '').toString().trim();
    const niche = (body?.niche ?? '').toString().trim();
    const summary = (body?.summary ?? '').toString().trim();
    const market = (body?.market ?? 'Amazon.fr').toString().trim();

    if (summary.length < 20 && title.length < 2 && niche.length < 2) {
      return new Response(JSON.stringify({ error: 'Renseigne au moins le titre, la niche ou un résumé du livre.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const useOpenRouter = !!OPENROUTER_API_KEY;
    const endpoint = useOpenRouter ? 'https://openrouter.ai/api/v1/chat/completions' : 'https://ai.gateway.lovable.dev/v1/chat/completions';
    const apiKey = useOpenRouter ? OPENROUTER_API_KEY : LOVABLE_API_KEY;
    const model = useOpenRouter ? 'google/gemini-2.0-flash-001' : 'google/gemini-3-flash-preview';
    if (!apiKey) throw new Error('Aucune clé IA configurée');

    const system = `Tu es le Stratège de Positionnement d'une maison d'édition, expert du marché ${market}. Tu analyses un livre et détermines son meilleur positionnement : les sous-catégories KDP réalistement atteignables (pas les plus grosses, les plus rentables à conquérir), 7 mots-clés porteurs, et l'angle concurrentiel pour se démarquer. Tes recommandations sont concrètes, honnêtes sur la difficulté, sans données inventées. Français. Réponds via l'outil report_positioning.`;

    const userMsg = `Livre :\nTitre : ${title || '(non précisé)'}\nGenre : ${genre || '(non précisé)'}\nNiche : ${niche || '(non précisée)'}\nPublic cible : ${audience || '(non précisé)'}\nMarché : ${market}\nSujet / résumé :\n"""${summary.slice(0, 6000)}"""\n\nDonne les meilleures catégories KDP, 7 mots-clés et l'angle concurrentiel.`;

    const aiRes = await fetch(endpoint, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', ...(useOpenRouter ? { 'HTTP-Referer': 'https://ebookstudio.fr', 'X-Title': 'Stratège Positionnement - eBook Studio' } : {}) },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: userMsg },
        ],
        tools: [TOOL],
        tool_choice: { type: 'function', function: { name: 'report_positioning' } },
      }),
    });

    if (aiRes.status === 429) return new Response(JSON.stringify({ error: 'Trop de requêtes, réessaie dans un instant.' }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    if (aiRes.status === 402) return new Response(JSON.stringify({ error: 'Crédits IA épuisés.' }), { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    if (!aiRes.ok) { const t = await aiRes.text(); console.error('AI gateway error', aiRes.status, t); return new Response(JSON.stringify({ error: 'Erreur du moteur IA' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }); }

    const data = await aiRes.json();
    const call = data?.choices?.[0]?.message?.tool_calls?.[0];
    if (!call?.function?.arguments) return new Response(JSON.stringify({ error: 'Réponse IA inexploitable' }), { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const report = JSON.parse(call.function.arguments);
    return new Response(JSON.stringify({ report }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    console.error('book-positioning error', e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Erreur inconnue' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
