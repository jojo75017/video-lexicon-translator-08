import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const LANGUE_RULE =
  'Tous les textes générés doivent être 100 % en français courant. ' +
  'Interdit : latin, faux latin, mots inventés, pseudo-langues et mots étrangers décoratifs. ' +
  'Les fins de paragraphe doivent se terminer par une phrase complète avec un point.';

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Méthode non autorisée' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
  if (!lovableApiKey) {
    return new Response(JSON.stringify({ error: 'Backend IA non configuré' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const prompt = typeof body?.prompt === 'string' ? body.prompt.trim() : '';
    if (!prompt || prompt.length > 200000) {
      return new Response(JSON.stringify({ error: 'Prompt invalide' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const systemPrompt =
      typeof body?.systemPrompt === 'string' && body.systemPrompt.trim()
        ? body.systemPrompt.trim().slice(0, 8000)
        : 'Tu es un expert en création de contenu éditorial pour livres et ebooks.';
    const temperature = typeof body?.temperature === 'number' ? Math.min(1.5, Math.max(0, body.temperature)) : 0.7;
    const maxTokens = typeof body?.maxTokens === 'number' ? Math.min(8192, Math.max(256, body.maxTokens)) : 4096;
    const jsonMode = body?.jsonMode === true;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Lovable-API-Key': lovableApiKey,
        'X-Lovable-AIG-SDK': 'edge-function-direct',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3.7-flash',
        messages: [
          {
            role: 'system',
            content:
              `${systemPrompt}\n\n${LANGUE_RULE}` +
              (jsonMode ? '\n\nRéponds UNIQUEMENT avec un JSON valide, sans texte autour, sans bloc de code.' : ''),
          },
          { role: 'user', content: prompt },
        ],
        temperature,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('ai-text-fallback gateway error', response.status, errText.slice(0, 400));
      const message =
        response.status === 402
          ? 'Crédits IA épuisés. Rechargez vos crédits pour continuer.'
          : response.status === 429
            ? 'IA momentanément saturée. Réessayez dans une minute.'
            : `Erreur IA (${response.status}).`;
      return new Response(JSON.stringify({ error: message }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) {
      return new Response(JSON.stringify({ error: 'Réponse IA vide' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('ai-text-fallback error', e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
