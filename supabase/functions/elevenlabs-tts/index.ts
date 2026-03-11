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
const AZURE_TEXT_LIMIT = 5000;

const jsonResponse = (payload: unknown, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

// === PROVIDER 1: ElevenLabs ===
const generateWithElevenLabs = async (text: string, voiceId?: string, modelId?: string) => {
  const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
  if (!ELEVENLABS_API_KEY) throw new Error('ELEVENLABS_API_KEY not configured');

  const voice = voiceId || DEFAULT_VOICE_ID;
  const model = modelId || DEFAULT_MODEL_ID;
  console.log(`ElevenLabs TTS: voice=${voice}, model=${model}, len=${text.length}`);

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
      voice_settings: { stability: 0.5, similarity_boost: 0.80, style: 0.35, use_speaker_boost: true },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('ElevenLabs error:', response.status, errorText);
    throw new Error(`ELEVENLABS_ERROR_${response.status}:${errorText}`);
  }

  return await response.arrayBuffer();
};

// === PROVIDER 2: Azure Neural Speech ===
const generateWithAzure = async (text: string) => {
  const AZURE_SPEECH_KEY = Deno.env.get('AZURE_SPEECH_KEY');
  if (!AZURE_SPEECH_KEY) throw new Error('AZURE_SPEECH_KEY not configured');

  const AZURE_SPEECH_REGION = Deno.env.get('AZURE_SPEECH_REGION') || 'francecentral';
  const truncated = text.substring(0, AZURE_TEXT_LIMIT);
  console.log(`Azure TTS fallback: region=${AZURE_SPEECH_REGION}, len=${truncated.length}`);

  // Escape XML
  const escaped = truncated
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

  const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='fr-FR'>
  <voice name='fr-FR-DeniseNeural'>
    <prosody rate='0%' pitch='0%'>${escaped}</prosody>
  </voice>
</speak>`;

  // Get token
  const tokenRes = await fetch(
    `https://${AZURE_SPEECH_REGION}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
    {
      method: 'POST',
      headers: { 'Ocp-Apim-Subscription-Key': AZURE_SPEECH_KEY, 'Content-Length': '0' },
    }
  );

  if (!tokenRes.ok) {
    const errText = await tokenRes.text();
    throw new Error(`Azure token error ${tokenRes.status}: ${errText}`);
  }

  const accessToken = await tokenRes.text();

  // Call TTS
  const ttsRes = await fetch(
    `https://${AZURE_SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-48khz-192kbitrate-mono-mp3',
        'User-Agent': 'EbookStudio2026',
      },
      body: ssml,
    }
  );

  if (!ttsRes.ok) {
    const errText = await ttsRes.text();
    throw new Error(`Azure TTS error ${ttsRes.status}: ${errText}`);
  }

  return await ttsRes.arrayBuffer();
};

// === PROVIDER 3: OpenAI TTS ===
const generateWithOpenAI = async (text: string) => {
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
  if (!OPENAI_API_KEY) throw new Error('OPENAI_API_KEY not configured');

  console.log(`OpenAI TTS fallback: len=${text.length}`);

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
    throw new Error(`OpenAI TTS error ${response.status}: ${errorText}`);
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
      return jsonResponse({ error: 'Token invalide ou expiré' }, 401);
    }

    console.log(`User: ${claimsData.claims.sub}`);

    const { text, voiceId, modelId } = await req.json();

    if (typeof text !== 'string' || !text.trim()) {
      return jsonResponse({ error: 'Le texte est requis' }, 400);
    }
    if (text.length > MAX_TEXT_LENGTH) {
      return jsonResponse({ error: `Texte trop long (max ${MAX_TEXT_LENGTH})` }, 400);
    }

    let audioBuffer: ArrayBuffer;
    let provider = 'elevenlabs';

    // === FALLBACK CHAIN: ElevenLabs → Azure → OpenAI ===
    try {
      audioBuffer = await generateWithElevenLabs(text, voiceId, modelId);
    } catch (elError) {
      const msg = elError instanceof Error ? elError.message : String(elError);
      console.warn('ElevenLabs failed:', msg);

      // Try Azure
      try {
        audioBuffer = await generateWithAzure(text);
        provider = 'azure-fallback';
      } catch (azError) {
        console.warn('Azure failed:', azError instanceof Error ? azError.message : azError);

        // Try OpenAI as last resort
        audioBuffer = await generateWithOpenAI(text);
        provider = 'openai-fallback';
      }
    }

    // Use Deno's native base64 encoding (no CPU timeout)
    const base64Audio = base64Encode(audioBuffer);
    console.log(`TTS OK [${provider}]: ${audioBuffer.byteLength} bytes`);

    return jsonResponse({ audioContent: base64Audio, provider });
  } catch (error) {
    console.error('TTS fatal error:', error);
    return jsonResponse({ error: error instanceof Error ? error.message : 'Erreur inconnue' }, 500);
  }
});
