import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Studio A/B/C — génère 3 versions (A, B, C) pour le titre & sous-titre OU la 4e de couverture,
// et recommande la meilleure. Réservé aux agents V4 (gate côté frontend).

function buildTool(mode: 'title' | 'blurb') {
  const isTitle = mode === 'title';
  return {
    type: 'function',
    function: {
      name: 'report_variants',
      description: isTitle
        ? "Propose 3 versions distinctes (A, B, C) de titre + sous-titre pour un livre auto-édité Amazon KDP, et recommande la meilleure."
        : "Propose 3 versions distinctes (A, B, C) de 4e de couverture (description de vente Amazon) pour un livre auto-édité KDP, et recommande la meilleure.",
      parameters: {
        type: 'object',
        properties: {
          versions: {
            type: 'array',
            description: 'Exactement 3 versions, labellisées A, B et C.',
            items: {
              type: 'object',
              properties: {
                label: { type: 'string', description: 'A, B ou C.' },
                angle: { type: 'string', description: 'Nom court de l\'angle (ex : Émotionnel, Bénéfices, Curiosité).' },
                ...(isTitle
                  ? {
                      titre: { type: 'string', description: 'Titre du livre (percutant, vendeur).' },
                      sousTitre: { type: 'string', description: 'Sous-titre qui précise la promesse.' },
                    }
                  : {
                      texte: { type: 'string', description: 'Texte complet de la 4e de couverture (600 à 1200 caractères).' },
                    }),
                argument: { type: 'string', description: 'Une phrase expliquant la force commerciale de cette version.' },
              },
              required: isTitle
                ? ['label', 'angle', 'titre', 'sousTitre', 'argument']
                : ['label', 'angle', 'texte', 'argument'],
              additionalProperties: false,
            },
          },
          recommended: { type: 'string', description: 'Label de la version recommandée (A, B ou C).' },
          recommendation_reason: { type: 'string', description: 'Pourquoi cette version convertit le mieux.' },
        },
        required: ['versions', 'recommended', 'recommendation_reason'],
        additionalProperties: false,
      },
    },
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return new Response(JSON.stringify({ error: 'Non authentifié' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '', { global: { headers: { Authorization: authHeader } } });
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData?.user) return new Response(JSON.stringify({ error: 'Session invalide' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const body = await req.json().catch(() => ({}));
    const mode: 'title' | 'blurb' = body?.mode === 'blurb' ? 'blurb' : 'title';
    const title = (body?.title ?? '').toString().trim();
    const subtitle = (body?.subtitle ?? '').toString().trim();
    const genre = (body?.genre ?? '').toString().trim();
    const audience = (body?.audience ?? '').toString().trim();
    const summary = (body?.summary ?? '').toString().trim();

    if (summary.length < 20 && title.length < 2) {
      return new Response(JSON.stringify({ error: 'Renseigne au moins le titre et un résumé/sujet du livre.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const useOpenRouter = !!OPENROUTER_API_KEY;
    const endpoint = useOpenRouter ? 'https://openrouter.ai/api/v1/chat/completions' : 'https://ai.gateway.lovable.dev/v1/chat/completions';
    const apiKey = useOpenRouter ? OPENROUTER_API_KEY : LOVABLE_API_KEY;
    const model = useOpenRouter ? 'google/gemini-2.0-flash-001' : 'google/gemini-3-flash-preview';
    if (!apiKey) throw new Error('Aucune clé IA configurée');

    const system = mode === 'title'
      ? "Tu es le Comparateur de versions d'une maison d'édition. Tu proposes 3 versions distinctes (A, B, C) de titre + sous-titre pour un livre auto-édité Amazon KDP, chacune avec un angle marketing différent, puis tu recommandes la plus vendeuse. Français. Réponds via l'outil report_variants."
      : "Tu es le Comparateur de versions d'une maison d'édition. Tu proposes 3 versions distinctes (A, B, C) de 4e de couverture (description de vente Amazon) pour un livre auto-édité KDP, chacune avec un angle différent (émotionnel, bénéfices, curiosité), puis tu recommandes la plus vendeuse. Français. Réponds via l'outil report_variants.";

    const userMsg = `Livre :\nTitre actuel : ${title || '(non précisé)'}\nSous-titre actuel : ${subtitle || '(non précisé)'}\nGenre : ${genre || '(non précisé)'}\nPublic cible : ${audience || '(non précisé)'}\nSujet / résumé :\n"""${summary.slice(0, 6000)}"""\n\nGénère 3 versions (A, B, C) ${mode === 'title' ? 'de titre + sous-titre' : 'de 4e de couverture'} et recommande la meilleure.`;

    const aiRes = await fetch(endpoint, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', ...(useOpenRouter ? { 'HTTP-Referer': 'https://ebookstudio.fr', 'X-Title': 'Studio A/B/C - eBook Studio' } : {}) },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: userMsg },
        ],
        tools: [buildTool(mode)],
        tool_choice: { type: 'function', function: { name: 'report_variants' } },
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
    console.error('edition-variants error', e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Erreur inconnue' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
