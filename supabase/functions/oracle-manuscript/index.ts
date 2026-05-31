import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
    const manuscript = (body?.manuscript ?? '').toString().trim();
    const question = (body?.question ?? '').toString().trim();
    const history = Array.isArray(body?.history) ? body.history.slice(-8) : [];
    if (manuscript.length < 100) return new Response(JSON.stringify({ error: 'Colle ton manuscrit (min. 100 caractères).' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    if (question.length < 2) return new Response(JSON.stringify({ error: 'Pose une question sur ton manuscrit.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const useOpenRouter = !!OPENROUTER_API_KEY;
    const endpoint = useOpenRouter ? 'https://openrouter.ai/api/v1/chat/completions' : 'https://ai.gateway.lovable.dev/v1/chat/completions';
    const apiKey = useOpenRouter ? OPENROUTER_API_KEY : LOVABLE_API_KEY;
    const model = useOpenRouter ? 'google/gemini-2.0-flash-001' : 'google/gemini-3-flash-preview';
    if (!apiKey) throw new Error('Aucune clé IA configurée (OpenRouter ou Lovable)');

    const messages = [
      { role: 'system', content: "Tu es ORACLE, agent IA qui répond aux questions sur un manuscrit fourni. Tu t'appuies UNIQUEMENT sur le contenu du manuscrit pour répondre (cohérence, résumés, fiches personnages, incohérences, timeline). Si l'info n'y est pas, dis-le clairement. Réponds en français, de façon structurée (markdown léger : titres, listes)." },
      { role: 'system', content: `MANUSCRIT :\n"""${manuscript.slice(0, 30000)}"""` },
      ...history.map((m: any) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: String(m.content ?? '') })),
      { role: 'user', content: question },
    ];

    const aiRes = await fetch(endpoint, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', ...(useOpenRouter ? { 'HTTP-Referer': 'https://ebookstudio.fr', 'X-Title': 'ORACLE - eBook Studio' } : {}) },
      body: JSON.stringify({ model, messages }),
    });

    if (aiRes.status === 429) return new Response(JSON.stringify({ error: 'Trop de requêtes, réessaie dans un instant.' }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    if (aiRes.status === 402) return new Response(JSON.stringify({ error: 'Crédits IA épuisés.' }), { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    if (!aiRes.ok) { const t = await aiRes.text(); console.error('AI gateway error', aiRes.status, t); return new Response(JSON.stringify({ error: 'Erreur du moteur IA' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }); }

    const data = await aiRes.json();
    const answer = data?.choices?.[0]?.message?.content;
    if (!answer) return new Response(JSON.stringify({ error: 'Réponse IA inexploitable' }), { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    return new Response(JSON.stringify({ answer }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    console.error('oracle-manuscript error', e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Erreur inconnue' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
