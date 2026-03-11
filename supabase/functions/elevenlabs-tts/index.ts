import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const DEFAULT_VOICE_ID = '9BWtsMINqrJLrRacOk9x';
const DEFAULT_MODEL_ID = 'eleven_multilingual_v2';
const MAX_TEXT_LENGTH = 10000;
const ELEVENLABS_TEXT_LIMIT = 5000;
const OPENAI_TEXT_LIMIT = 4000;

const jsonResponse = (payload: unknown, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

const generateWithElevenLabs = async (text: string, voiceId?: string, modelId?: string) => {
  const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
  if (!ELEVENLABS_API_KEY) {
    throw new Error('ELEVENLABS_API_KEY is not configured');
  }

  const voice = voiceId || DEFAULT_VOICE_ID;
  const model = modelId || DEFAULT_MODEL_ID;

  console.log(`Generating audio with ElevenLabs voice: ${voice}, model: ${model}, text length: ${text.length}`);

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': ELEVENLABS_API_KEY,
    },
    body: JSON.stringify({
      text: text.substring(0, ELEVENLABS_TEXT_LIMIT),
      model_id: model,
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.80,
        style: 0.35,
        use_speaker_boost: true,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('ElevenLabs API error:', response.status, errorText);
    throw new Error(`ELEVENLABS_ERROR_${response.status}:${errorText}`);
  }

  return await response.arrayBuffer();
};

const generateWithOpenAIFallback = async (text: string) => {
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured for fallback');
  }

  console.warn('Switching to OpenAI TTS fallback');

  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini-tts',
      voice: 'alloy',
      input: text.substring(0, OPENAI_TEXT_LIMIT),
      response_format: 'mp3',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('OpenAI TTS fallback error:', response.status, errorText);
    throw new Error(`OPENAI_TTS_ERROR_${response.status}:${errorText}`);
  }

  return await response.arrayBuffer();
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      console.error('Missing or invalid authorization header');
      return jsonResponse({ error: 'Authentification requise' }, 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);

    if (claimsError || !claimsData?.claims) {
      console.error('JWT validation failed:', claimsError);
      return jsonResponse({ error: 'Token invalide ou expiré' }, 401);
    }

    const userId = claimsData.claims.sub;
    console.log(`Authenticated user: ${userId}`);

    const { text, voiceId, modelId } = await req.json();

    if (typeof text !== 'string' || !text.trim()) {
      return jsonResponse({ error: 'Le texte est requis' }, 400);
    }

    if (text.length > MAX_TEXT_LENGTH) {
      return jsonResponse({ error: `Le texte est trop long (max ${MAX_TEXT_LENGTH} caractères)` }, 400);
    }

    let audioBuffer: ArrayBuffer;
    let provider = 'elevenlabs';

    try {
      audioBuffer = await generateWithElevenLabs(text, voiceId, modelId);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const shouldFallback = message.includes('ELEVENLABS_ERROR_401') || message.includes('invalid_api_key');

      if (!shouldFallback) {
        throw error;
      }

      audioBuffer = await generateWithOpenAIFallback(text);
      provider = 'openai-fallback';
    }

    const base64Audio = base64Encode(audioBuffer);
    console.log(`Audio generated successfully with ${provider}, size: ${audioBuffer.byteLength} bytes`);

    return jsonResponse({ audioContent: base64Audio, provider });
  } catch (error) {
    console.error('Error in elevenlabs-tts function:', error);
    return jsonResponse({ error: error instanceof Error ? error.message : 'Erreur inconnue' }, 500);
  }
});
