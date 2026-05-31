import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TOOL = {
  type: 'function',
  function: {
    name: 'report_author_voice',
    description: "Profil de la voix d'auteur extrait d'un échantillon de texte, réutilisable sur toute une série.",
    parameters: {
      type: 'object',
      properties: {
        voice_name: { type: 'string', description: 'Nom court et évocateur du style (ex. « Plume cinématographique tendue »).' },
        summary: { type: 'string', description: 'Résumé du style en 2-3 phrases.' },
        tone: { type: 'string', description: 'Ton dominant.' },
        sentence_structure: { type: 'string', description: 'Structure de phrases caractéristique.' },
        vocabulary: { type: 'string', description: 'Niveau et registre de vocabulaire.' },
        pacing: { type: 'string', description: 'Rythme narratif typique.' },
        signature_traits: { type: 'array', description: '3 à 6 marqueurs de style signature.', items: { type: 'string' } },
        recurring_devices: { type: 'array', description: '3 à 5 procédés/figures récurrents (métaphores, dialogues, etc.).', items: { type: 'string' } },
        do: { type: 'array', description: '3 à 5 choses à FAIRE pour respecter cette voix.', items: { type: 'string' } },
        dont: { type: 'array', description: '3 à 5 choses à ÉVITER pour ne pas casser cette voix.', items: { type: 'string' } },
        style_prompt: { type: 'string', description: "Bloc d'instructions prêt à coller pour qu'une IA réécrive avec cette voix." },
      },
      required: ['voice_name', 'summary', 'tone', 'sentence_structure', 'vocabulary', 'pacing', 'signature_traits', 'recurring_devices', 'do', 'dont', 'style_prompt'],
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
    if (text.length < 100) return new Response(JSON.stringify({ error: 'Colle un échantillon de ton écriture (min. 100 caractères).' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const useOpenRouter = !!OPENROUTER_API_KEY;
    const endpoint = useOpenRouter ? 'https://openrouter.ai/api/v1/chat/completions' : 'https://ai.gateway.lovable.dev/v1/chat/completions';
    const apiKey = useOpenRouter ? OPENROUTER_API_KEY : LOVABLE_API_KEY;
    const model = useOpenRouter ? 'google/gemini-2.0-flash-001' : 'google/gemini-3-flash-preview';
    if (!apiKey) throw new Error('Aucune clé IA configurée (OpenRouter ou Lovable)');

    const aiRes = await fetch(endpoint, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', ...(useOpenRouter ? { 'HTTP-Referer': 'https://ebookstudio.fr', 'X-Title': 'ECHO - eBook Studio' } : {}) },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: "Tu es ÉCHO, agent IA qui capture la voix d'auteur. À partir d'un échantillon, tu extrais un profil de style détaillé et réutilisable (ton, structure, vocabulaire, rythme, marqueurs signature) et tu produis un bloc d'instructions prêt à coller pour réappliquer ce style sur toute une série. Réponds toujours via l'outil report_author_voice, en français." },
          { role: 'user', content: `Analyse cet échantillon et extrais la voix d'auteur réutilisable :\n\n"""${text.slice(0, 12000)}"""` },
        ],
        tools: [TOOL],
        tool_choice: { type: 'function', function: { name: 'report_author_voice' } },
      }),
    });

    if (aiRes.status === 429) return new Response(JSON.stringify({ error: 'Trop de requêtes, réessaie dans un instant.' }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    if (aiRes.status === 402) return new Response(JSON.stringify({ error: 'Crédits IA épuisés.' }), { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    if (!aiRes.ok) { const t = await aiRes.text(); console.error('AI gateway error', aiRes.status, t); return new Response(JSON.stringify({ error: 'Erreur du moteur IA' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }); }

    const data = await aiRes.json();
    const call = data?.choices?.[0]?.message?.tool_calls?.[0];
    if (!call?.function?.arguments) return new Response(JSON.stringify({ error: 'Réponse IA inexploitable' }), { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const profile = JSON.parse(call.function.arguments);
    return new Response(JSON.stringify({ profile }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    console.error('echo-author-voice error', e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Erreur inconnue' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
