import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Sélection — Le moteur de recherche de maisons d'édition.
// À partir de la description d'un livre (genre, ton, taille, singularité),
// l'IA identifie les maisons d'édition francophones dont la ligne éditoriale
// est la plus cohérente. Réservé aux agents V4 (gate côté frontend).

const TOOL = {
  type: 'function',
  function: {
    name: 'report_publishers',
    description:
      "Identifie les maisons d'édition francophones dont la ligne éditoriale correspond le mieux au livre décrit. Ne renvoie que des maisons réelles et pertinentes.",
    parameters: {
      type: 'object',
      properties: {
        publishers: {
          type: 'array',
          description: '6 à 12 maisons d\'édition réelles, classées de la plus pertinente à la moins pertinente.',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Nom de la maison d\'édition (réelle).' },
              match: { type: 'string', description: 'Niveau de correspondance : "Forte correspondance", "Bonne correspondance" ou "Correspondance modérée".' },
              editorial_line: { type: 'string', description: 'Ligne éditoriale résumée (genres, spécialités, ton).' },
              why: { type: 'string', description: 'Pourquoi cette maison correspond à CE livre précis.' },
              alerts: { type: 'string', description: 'Alertes utiles avant d\'envoyer (soumissions ouvertes/fermées, compte d\'auteur à éviter, sélectivité, etc.). Vide si rien à signaler.' },
              submission_tip: { type: 'string', description: 'Conseil concret pour la soumission à cette maison.' },
            },
            required: ['name', 'match', 'editorial_line', 'why', 'alerts', 'submission_tip'],
            additionalProperties: false,
          },
        },
        summary: { type: 'string', description: 'Synthèse en 2-3 phrases : à quel type de maisons ce livre correspond le mieux.' },
        warnings: {
          type: 'array',
          description: '2 à 4 conseils généraux pour éviter les pièges (maisons à compte d\'auteur, soumissions fermées, etc.).',
          items: { type: 'string' },
        },
      },
      required: ['publishers', 'summary', 'warnings'],
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
    const subgenre = (body?.subgenre ?? '').toString().trim();
    const audience = (body?.audience ?? '').toString().trim();
    const wordCount = (body?.wordCount ?? '').toString().trim();
    const keywords = (body?.keywords ?? '').toString().trim();
    const description = (body?.description ?? '').toString().trim();

    if (description.length < 15 && genre.length < 2 && keywords.length < 2) {
      return new Response(JSON.stringify({ error: 'Décris ton livre : genre, mots-clés ou un résumé.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const useOpenRouter = !!OPENROUTER_API_KEY;
    const endpoint = useOpenRouter ? 'https://openrouter.ai/api/v1/chat/completions' : 'https://ai.gateway.lovable.dev/v1/chat/completions';
    const apiKey = useOpenRouter ? OPENROUTER_API_KEY : LOVABLE_API_KEY;
    const model = useOpenRouter ? 'google/gemini-2.0-flash-001' : 'google/gemini-3-flash-preview';
    if (!apiKey) throw new Error('Aucune clé IA configurée');

    const system = `Tu es "Sélection", un moteur de recherche expert des maisons d'édition francophones (France, Belgique, Suisse, Québec). À partir de la description d'un manuscrit, tu identifies les maisons dont la ligne éditoriale correspond réellement — son genre, son sous-genre, son ton, sa taille et sa singularité. Tu ne cites QUE des maisons d'édition réelles et existantes. Tu es honnête sur la sélectivité et tu alertes sur les maisons à compte d'auteur, les soumissions fermées ou les pièges connus. Tu n'inventes jamais de maison ni de fait. Français. Réponds via l'outil report_publishers.`;

    const userMsg = `Manuscrit à placer :\nTitre : ${title || '(non précisé)'}\nGenre : ${genre || '(non précisé)'}\nSous-genre / niche : ${subgenre || '(non précisé)'}\nLectorat visé : ${audience || '(non précisé)'}\nTaille approximative : ${wordCount || '(non précisée)'}\nMots-clés / singularité : ${keywords || '(non précisés)'}\nDescription du livre :\n"""${description.slice(0, 6000)}"""\n\nDonne les maisons d'édition les plus susceptibles d'éditer ce livre, classées par pertinence, avec pour chacune sa ligne éditoriale, la raison de la correspondance, les alertes et un conseil de soumission.`;

    const aiRes = await fetch(endpoint, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', ...(useOpenRouter ? { 'HTTP-Referer': 'https://ebookstudio.fr', 'X-Title': 'Sélection - eBook Studio' } : {}) },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: userMsg },
        ],
        tools: [TOOL],
        tool_choice: { type: 'function', function: { name: 'report_publishers' } },
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
    console.error('selection-publishers error', e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Erreur inconnue' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
