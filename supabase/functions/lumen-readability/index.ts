import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TOOL = {
  type: 'function',
  function: {
    name: 'report_readability',
    description: "Audit de lisibilité d'un texte de livre pour l'auto-édition Amazon KDP.",
    parameters: {
      type: 'object',
      properties: {
        readability_score: { type: 'number', description: 'Score global de lisibilité de 0 à 100 (100 = très facile à lire).' },
        readability_label: { type: 'string', description: 'Étiquette : Très facile / Facile / Moyen / Difficile / Très difficile.' },
        avg_sentence_length: { type: 'number', description: 'Longueur moyenne des phrases (en mots).' },
        rhythm: { type: 'string', description: 'Analyse du rythme (alternance phrases courtes/longues).' },
        tone: { type: 'string', description: 'Ton perçu du texte.' },
        strengths: { type: 'array', description: '2 à 4 points forts du texte.', items: { type: 'string' } },
        issues: {
          type: 'array',
          description: '3 à 6 problèmes de lisibilité détectés.',
          items: {
            type: 'object',
            properties: {
              type: { type: 'string', description: 'Type de problème (phrase longue, jargon, répétition, passif…).' },
              excerpt: { type: 'string', description: 'Court extrait concerné.' },
              suggestion: { type: 'string', description: 'Suggestion concrète de réécriture.' },
              severity: { type: 'string', description: 'faible / moyen / élevé.' },
            },
            required: ['type', 'excerpt', 'suggestion', 'severity'],
            additionalProperties: false,
          },
        },
        suggestions: { type: 'array', description: '3 à 5 conseils globaux pour améliorer la lisibilité.', items: { type: 'string' } },
      },
      required: ['readability_score', 'readability_label', 'avg_sentence_length', 'rhythm', 'tone', 'strengths', 'issues', 'suggestions'],
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
    const text = (body?.text ?? '').toString().trim();
    if (text.length < 50) return new Response(JSON.stringify({ error: 'Colle un texte à analyser (min. 50 caractères).' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const useOpenRouter = !!OPENROUTER_API_KEY;
    const endpoint = useOpenRouter ? 'https://openrouter.ai/api/v1/chat/completions' : 'https://ai.gateway.lovable.dev/v1/chat/completions';
    const apiKey = useOpenRouter ? OPENROUTER_API_KEY : LOVABLE_API_KEY;
    const model = useOpenRouter ? 'google/gemini-2.0-flash-001' : 'google/gemini-3-flash-preview';
    if (!apiKey) throw new Error('Aucune clé IA configurée (OpenRouter ou Lovable)');

    const aiRes = await fetch(endpoint, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', ...(useOpenRouter ? { 'HTTP-Referer': 'https://ebookstudio.fr', 'X-Title': 'LUMEN - eBook Studio' } : {}) },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: "Tu es LUMEN, agent IA d'audit de lisibilité pour l'auto-édition Amazon KDP. Tu analyses un texte (chapitre/manuscrit) : score de lisibilité, rythme, longueur de phrases, ton, points forts, problèmes avec extraits et suggestions de réécriture concrètes. Réponds toujours via l'outil report_readability, en français." },
          { role: 'user', content: `Analyse la lisibilité de ce texte et propose des améliorations concrètes :\n\n"""${text.slice(0, 12000)}"""` },
        ],
        tools: [TOOL],
        tool_choice: { type: 'function', function: { name: 'report_readability' } },
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
    console.error('lumen-readability error', e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Erreur inconnue' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
