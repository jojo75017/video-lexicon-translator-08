import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TOOL = {
  type: 'function',
  function: {
    name: 'report_trend_radar',
    description: "Radar de tendances pour une niche de livres Amazon KDP : sujets émergents et saisonnalité.",
    parameters: {
      type: 'object',
      properties: {
        niche_summary: { type: 'string', description: 'Dynamique actuelle de la niche en 2-3 phrases.' },
        momentum_score: { type: 'number', description: 'Score de dynamisme/croissance de la niche de 0 à 100.' },
        emerging_topics: {
          type: 'array',
          description: '4 à 7 sujets émergents ou en croissance dans la niche.',
          items: {
            type: 'object',
            properties: {
              topic: { type: 'string' },
              trend: { type: 'string', enum: ['émergent', 'en hausse', 'stable', 'en déclin'] },
              rationale: { type: 'string', description: 'Pourquoi ce sujet monte / est intéressant.' },
              book_angle: { type: 'string', description: 'Angle de livre concret à exploiter.' },
            },
            required: ['topic', 'trend', 'rationale', 'book_angle'],
            additionalProperties: false,
          },
        },
        seasonality: {
          type: 'array',
          description: '3 à 6 pics de saisonnalité (périodes de forte demande).',
          items: {
            type: 'object',
            properties: {
              period: { type: 'string', description: 'Période (ex. "Janvier", "Rentrée scolaire", "Fêtes de fin d\'année").' },
              demand: { type: 'string', enum: ['faible', 'moyen', 'fort'] },
              tip: { type: 'string', description: 'Conseil de publication pour profiter de ce pic.' },
            },
            required: ['period', 'demand', 'tip'],
            additionalProperties: false,
          },
        },
        next_book_recommendations: {
          type: 'array',
          description: '3 à 5 idées de prochain livre à écrire, classées par priorité.',
          items: { type: 'string' },
        },
        watch_outs: {
          type: 'array',
          description: '2 à 4 risques ou signaux à surveiller (saturation, modes passagères…).',
          items: { type: 'string' },
        },
      },
      required: [
        'niche_summary', 'momentum_score', 'emerging_topics',
        'seasonality', 'next_book_recommendations', 'watch_outs',
      ],
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
    const niche = (body?.niche ?? '').toString().trim();
    const market = (body?.market ?? 'Amazon.fr').toString().trim();
    if (niche.length < 2) {
      return new Response(JSON.stringify({ error: 'Précise une niche (min. 2 caractères).' }), {
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
        ...(useOpenRouter ? { 'HTTP-Referer': 'https://ebookstudio.fr', 'X-Title': 'VIGIE - eBook Studio' } : {}),
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content:
              "Tu es VIGIE, agent IA de veille de tendances pour l'auto-édition Amazon KDP. " +
              "Tu détectes les sujets émergents, la saisonnalité et les opportunités de prochain livre. " +
              "Tu t'appuies sur ta connaissance des marchés de livres et des dynamiques culturelles. " +
              "Tu n'inventes pas de chiffres précis : tu donnes des estimations qualitatives prudentes. " +
              "Réponds toujours via l'outil report_trend_radar, en français.",
          },
          {
            role: 'user',
            content: `Analyse les tendances de la niche de livres suivante sur ${market} : "${niche}". Identifie les sujets émergents, la saisonnalité, et recommande quel prochain livre écrire.`,
          },
        ],
        tools: [TOOL],
        tool_choice: { type: 'function', function: { name: 'report_trend_radar' } },
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

    const insights = JSON.parse(call.function.arguments);
    return new Response(JSON.stringify({ niche, market, insights }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('vigie-trends error', e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Erreur inconnue' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
