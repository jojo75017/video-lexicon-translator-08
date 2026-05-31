import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TOOL = {
  type: 'function',
  function: {
    name: 'report_series_architecture',
    description: "Plan structuré et cohérent d'une série de livres (tomes 2/3/4) pour l'auto-édition Amazon KDP.",
    parameters: {
      type: 'object',
      properties: {
        series_title: { type: 'string', description: 'Titre de série proposé (accrocheur, mémorisable).' },
        series_pitch: { type: 'string', description: 'Pitch global de la série en 2-3 phrases (la promesse au lecteur).' },
        overarching_arc: { type: 'string', description: 'Arc narratif global qui relie tous les tomes.' },
        recurring_characters: {
          type: 'array',
          description: '3 à 6 personnages récurrents avec leur évolution sur la série.',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              role: { type: 'string', description: 'Rôle dans la série (protagoniste, antagoniste, allié…).' },
              arc: { type: 'string', description: 'Évolution du personnage au fil des tomes.' },
            },
            required: ['name', 'role', 'arc'],
            additionalProperties: false,
          },
        },
        tomes: {
          type: 'array',
          description: 'Un objet par tome demandé, dans l’ordre.',
          items: {
            type: 'object',
            properties: {
              number: { type: 'number', description: 'Numéro du tome.' },
              title: { type: 'string', description: 'Titre du tome.' },
              premise: { type: 'string', description: 'Prémisse / synopsis du tome en 2-3 phrases.' },
              arc: { type: 'string', description: 'Arc narratif spécifique du tome.' },
              key_events: { type: 'array', description: '3 à 5 événements clés du tome.', items: { type: 'string' } },
              cliffhanger: { type: 'string', description: 'Cliffhanger / accroche de fin menant au tome suivant.' },
              themes: { type: 'array', description: '2 à 4 thèmes centraux du tome.', items: { type: 'string' } },
            },
            required: ['number', 'title', 'premise', 'arc', 'key_events', 'cliffhanger', 'themes'],
            additionalProperties: false,
          },
        },
        continuity_tips: {
          type: 'array',
          description: '3 à 5 conseils de cohérence pour maintenir la continuité entre les tomes.',
          items: { type: 'string' },
        },
      },
      required: ['series_title', 'series_pitch', 'overarching_arc', 'recurring_characters', 'tomes', 'continuity_tips'],
      additionalProperties: false,
    },
  },
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Non authentifié' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: 'Session invalide' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: isAdmin } = await supabase.rpc('has_role', {
      _user_id: userData.user.id,
      _role: 'admin',
    });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: 'Accès réservé aux administrateurs' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json().catch(() => ({}));
    const premise = (body?.premise ?? '').toString().trim();
    const genre = (body?.genre ?? '').toString().trim();
    const tomeCount = Math.min(Math.max(parseInt(body?.tomeCount ?? '3', 10) || 3, 2), 6);
    if (premise.length < 5) {
      return new Response(JSON.stringify({ error: 'Décris le livre / la prémisse (min. 5 caractères).' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    const useOpenRouter = !!OPENROUTER_API_KEY;
    const endpoint = useOpenRouter
      ? 'https://openrouter.ai/api/v1/chat/completions'
      : 'https://ai.gateway.lovable.dev/v1/chat/completions';
    const apiKey = useOpenRouter ? OPENROUTER_API_KEY : LOVABLE_API_KEY;
    const model = useOpenRouter ? 'google/gemini-2.0-flash-001' : 'google/gemini-3-flash-preview';
    if (!apiKey) throw new Error('Aucune clé IA configurée (OpenRouter ou Lovable)');

    const aiRes = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        ...(useOpenRouter ? { 'HTTP-Referer': 'https://ebookstudio.fr', 'X-Title': 'SAGA - eBook Studio' } : {}),
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content:
              "Tu es SAGA, agent IA architecte de série pour l'auto-édition Amazon KDP. " +
              "À partir d'un livre / d'une prémisse, tu conçois un plan cohérent de plusieurs tomes : " +
              "arc global, personnages récurrents, arcs par tome, événements clés, cliffhangers et conseils de continuité. " +
              "Tu privilégies la cohérence narrative et la rejouabilité commerciale (read-through entre tomes). " +
              `RÈGLE ABSOLUE : le tableau "tomes" doit contenir EXACTEMENT ${tomeCount} tomes, numérotés de 1 à ${tomeCount}, ni plus ni moins. ` +
              "Réponds toujours via l'outil report_series_architecture, en français.",
          },
          {
            role: 'user',
            content: `Conçois l'architecture d'une série de EXACTEMENT ${tomeCount} tomes${genre ? ` dans le genre « ${genre} »` : ''}, à partir de cette prémisse : "${premise}". Tu dois produire ${tomeCount} tomes (numéros 1 à ${tomeCount}). Donne un arc global cohérent, les personnages récurrents, puis un plan détaillé pour chacun des ${tomeCount} tomes avec cliffhangers.`,
          },
        ],
        tools: [TOOL],
        tool_choice: { type: 'function', function: { name: 'report_series_architecture' } },
      }),
    });

    if (aiRes.status === 429) {
      return new Response(JSON.stringify({ error: 'Trop de requêtes, réessaie dans un instant.' }), {
        status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (aiRes.status === 402) {
      return new Response(JSON.stringify({ error: 'Crédits IA épuisés. Ajoute des crédits dans Lovable AI.' }), {
        status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (!aiRes.ok) {
      const t = await aiRes.text();
      console.error('AI gateway error', aiRes.status, t);
      return new Response(JSON.stringify({ error: 'Erreur du moteur IA' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await aiRes.json();
    const call = data?.choices?.[0]?.message?.tool_calls?.[0];
    if (!call?.function?.arguments) {
      return new Response(JSON.stringify({ error: 'Réponse IA inexploitable' }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const plan = JSON.parse(call.function.arguments);
    return new Response(JSON.stringify({ premise, genre, tomeCount, plan }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('saga-architect error', e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Erreur inconnue' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
