import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const MAX_TEXT_LENGTH = 1400;

const errorResponse = (message: string, status = 500) =>
  new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return errorResponse('Corps de requête invalide', 400);
    }

    const text = typeof body?.text === 'string' ? body.text.trim() : '';
    if (!text) {
      return errorResponse('Le texte est requis', 400);
    }
    if (text.length > MAX_TEXT_LENGTH) {
      return errorResponse(`Le texte dépasse la limite autorisée (${MAX_TEXT_LENGTH} caractères)`, 413);
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      return errorResponse('OPENAI_API_KEY non configurée', 500);
    }

    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini-tts',
        input: text,
        voice: body.voiceName || 'nova',
        response_format: 'mp3',
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('OpenAI TTS error:', response.status, errText);
      return errorResponse(`Erreur OpenAI TTS: ${response.status}`, response.status);
    }

    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-store',
        'X-TTS-Provider': 'openai',
      },
    });
  } catch (error) {
    console.error('Error in TTS:', error);
    return errorResponse(error instanceof Error ? error.message : 'Erreur interne', 500);
  }
});
