const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/** Transcrit un fichier audio/vidéo via Lovable AI Gateway (openai/gpt-4o-transcribe). */
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY manquant');

    const { fileName, mimeType, base64 } = await req.json().catch(() => ({}));
    if (!base64 || !fileName) {
      return new Response(JSON.stringify({ error: 'Fichier manquant' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // base64 → bytes
    const bin = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    const blob = new Blob([bin], { type: mimeType || 'audio/mpeg' });

    const form = new FormData();
    form.append('model', 'openai/gpt-4o-transcribe');
    form.append('file', blob, fileName);

    const aiRes = await fetch('https://ai.gateway.lovable.dev/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}` },
      body: form,
    });

    if (aiRes.status === 429) return new Response(JSON.stringify({ error: 'Trop de requêtes, réessayez.' }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    if (aiRes.status === 402) return new Response(JSON.stringify({ error: 'Crédits IA épuisés.' }), { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    if (!aiRes.ok) {
      const t = await aiRes.text();
      console.error('STT gateway error', aiRes.status, t);
      return new Response(JSON.stringify({ error: 'Transcription impossible', details: t }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const data = await aiRes.json();
    const transcript = data?.text || '';
    return new Response(JSON.stringify({ transcript }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Erreur inconnue' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
