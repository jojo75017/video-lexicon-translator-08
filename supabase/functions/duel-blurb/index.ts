import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TOOL = {
  type: 'function',
  function: {
    name: 'report_blurb_duel',
    description: "Génère et score plusieurs variantes de 4e de couverture (blurb) pour un livre auto-édité Amazon KDP.",
    parameters: {
      type: 'object',
      properties: {
        variants: {
          type: 'array',
          description: 'Entre 3 et 4 variantes de 4e de couverture, chacune avec un style distinct.',
          items: {
            type: 'object',
            properties: {
              label: { type: 'string', description: 'Nom court du style (ex : Émotionnel, Mystère, Bénéfices, Direct).' },
              hook: { type: 'string', description: 'Phrase d’accroche percutante (1 ligne).' },
              blurb: { type: 'string', description: 'Texte complet de la 4e de couverture (600 à 1200 caractères).' },
              score: { type: 'number', description: 'Score de potentiel commercial de 0 à 100.' },
              strengths: { type: 'array', description: '2 à 3 points forts de cette variante.', items: { type: 'string' } },
              weaknesses: { type: 'array', description: '1 à 2 points faibles ou risques.', items: { type: 'string' } },
            },
            required: ['label', 'hook', 'blurb', 'score', 'strengths', 'weaknesses'],
            additionalProperties: false,
          },
        },
        winner_label: { type: 'string', description: 'Label de la variante recommandée (la plus vendeuse).' },
        winner_reason: { type: 'string', description: 'Pourquoi cette variante est la plus susceptible de convertir.' },
        global_tips: { type: 'array', description: '3 à 5 conseils pour optimiser la 4e de couverture.', items: { type: 'string' } },
      },
      required: ['variants', 'winner_label', 'winner_reason', 'global_tips'],
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

    const { data: isAdmin } = await supabase.rpc('has_role', { _user_id: userData.user.id, _role: 'admin' });
    if (!isAdmin) return new Response(JSON.stringify({ error: 'Accès réservé aux administrateurs' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const body = await req.json().catch(() => ({}));
    const title = (body?.title ?? '').toString().trim();
    const genre = (body?.genre ?? '').toString().trim();
    const summary = (body?.summary ?? '').toString().trim();
    const audience = (body?.audience ?? '').toString().trim();
    if (summary.length < 30 && title.length < 2) {
      return new Response(JSON.stringify({ error: 'Renseigne au moins le titre et un résumé du livre.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const useOpenRouter = !!OPENROUTER_API_KEY;
    const endpoint = useOpenRouter ? 'https://openrouter.ai/api/v1/chat/completions' : 'https://ai.gateway.lovable.dev/v1/chat/completions';
    const apiKey = useOpenRouter ? OPENROUTER_API_KEY : LOVABLE_API_KEY;
    const model = useOpenRouter ? 'google/gemini-2.0-flash-001' : 'google/gemini-3-flash-preview';
    if (!apiKey) throw new Error('Aucune clé IA configurée (OpenRouter ou Lovable)');

    const aiRes = await fetch(endpoint, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', ...(useOpenRouter ? { 'HTTP-Referer': 'https://ebookstudio.fr', 'X-Title': 'DUEL - eBook Studio' } : {}) },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: "Tu es DUEL, agent IA spécialiste de la 4e de couverture (blurb) pour l'auto-édition Amazon KDP. Tu génères plusieurs variantes de 4e de couverture avec des angles distincts (émotionnel, mystère/curiosité, bénéfices, direct), tu les notes selon leur potentiel commercial et tu désignes la plus vendeuse. Tu écris des blurbs avec accroche forte, montée de tension, promesse claire et appel implicite à l'achat. Réponds toujours via l'outil report_blurb_duel, en français." },
          { role: 'user', content: `Génère et score 3 à 4 variantes de 4e de couverture pour ce livre :\n\nTitre : ${title || '(non précisé)'}\nGenre : ${genre || '(non précisé)'}\nPublic cible : ${audience || '(non précisé)'}\nRésumé / contenu :\n"""${summary.slice(0, 6000)}"""` },
        ],
        tools: [TOOL],
        tool_choice: { type: 'function', function: { name: 'report_blurb_duel' } },
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
    console.error('duel-blurb error', e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Erreur inconnue' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
