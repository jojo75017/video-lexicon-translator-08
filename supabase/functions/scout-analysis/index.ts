import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TOOL = {
  type: 'function',
  function: {
    name: 'report_competitive_analysis',
    description: "Analyse concurrentielle structurée d'une niche de livres Amazon KDP.",
    parameters: {
      type: 'object',
      properties: {
        niche_summary: { type: 'string', description: 'Synthèse du marché de la niche en 2-3 phrases.' },
        saturation_level: { type: 'string', enum: ['faible', 'moyen', 'élevé'], description: 'Niveau de saturation du marché.' },
        opportunity_score: { type: 'number', description: 'Score d’opportunité de 0 à 100.' },
        top_competitors: {
          type: 'array',
          description: '5 à 10 concurrents/livres types positionnés sur la niche.',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              positioning: { type: 'string', description: 'Angle / promesse principale du livre.' },
              estimated_strength: { type: 'string', enum: ['faible', 'moyen', 'fort'] },
              weakness: { type: 'string', description: 'Faiblesse exploitable.' },
            },
            required: ['title', 'positioning', 'estimated_strength', 'weakness'],
            additionalProperties: false,
          },
        },
        differentiation_angles: {
          type: 'array',
          description: '4 à 6 angles de différenciation recommandés.',
          items: { type: 'string' },
        },
        recommended_keywords: {
          type: 'array',
          description: '6 à 10 mots-clés/expressions à cibler.',
          items: { type: 'string' },
        },
        suggested_subtitle: { type: 'string', description: 'Proposition de sous-titre vendeur pour se démarquer.' },
        action_plan: {
          type: 'array',
          description: '3 à 5 actions concrètes prioritaires.',
          items: { type: 'string' },
        },
      },
      required: [
        'niche_summary', 'saturation_level', 'opportunity_score', 'top_competitors',
        'differentiation_angles', 'recommended_keywords', 'suggested_subtitle', 'action_plan',
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

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY manquante');

    const aiRes = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          {
            role: 'system',
            content:
              "Tu es SCOUT, agent IA d'analyse concurrentielle pour l'auto-édition Amazon KDP. " +
              "Tu produis des analyses réalistes basées sur ta connaissance des marchés de livres. " +
              "Tu n'inventes pas de chiffres de ventes précis : tu donnes des estimations qualitatives prudentes. " +
              "Réponds toujours via l'outil report_competitive_analysis, en français.",
          },
          {
            role: 'user',
            content: `Analyse la niche de livres suivante sur ${market} : "${niche}". Identifie les concurrents types, leurs angles, les faiblesses exploitables et les opportunités de différenciation.`,
          },
        ],
        tools: [TOOL],
        tool_choice: { type: 'function', function: { name: 'report_competitive_analysis' } },
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
    console.error('scout-analysis error', e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Erreur inconnue' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
