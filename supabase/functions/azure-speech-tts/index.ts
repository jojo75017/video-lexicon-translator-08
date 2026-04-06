import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const MAX_TEXT_LENGTH = 1400;
const TOKEN_TIMEOUT_MS = 10000;
const TTS_TIMEOUT_MS = 30000;

type TtsRequestBody = {
  text: string;
  voiceName?: string;
  niche?: string;
  rate?: string;
  pitch?: string;
};

const VOICE_PRESETS: Record<string, { voice: string; rate: string; pitch: string }> = {
  'enfants-3-6': { voice: 'fr-FR-EloiseNeural', rate: '0%', pitch: '+5%' },
  'enfants-6-12': { voice: 'fr-FR-BrigitteNeural', rate: '0%', pitch: '0%' },
  thriller: { voice: 'fr-FR-HenriNeural', rate: '-10%', pitch: '-5%' },
  romance: { voice: 'fr-FR-DeniseNeural', rate: '0%', pitch: '+3%' },
  spiritualite: { voice: 'fr-FR-AlainNeural', rate: '-5%', pitch: '-3%' },
  business: { voice: 'fr-FR-JeromeNeural', rate: '+5%', pitch: '0%' },
  histoire: { voice: 'fr-FR-CelesteNeural', rate: '0%', pitch: '0%' },
  saga: { voice: 'fr-FR-HenriNeural', rate: '-5%', pitch: '-3%' },
  default: { voice: 'fr-FR-DeniseNeural', rate: '0%', pitch: '0%' },
};

const errorResponse = (message: string, status = 500) =>
  new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

const parseRequestBody = async (req: Request): Promise<TtsRequestBody | Response> => {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return errorResponse('Corps de requête invalide', 400);
  }

  if (!body || typeof body !== 'object') {
    return errorResponse('Corps de requête invalide', 400);
  }

  const { text, voiceName, niche, rate, pitch } = body as Record<string, unknown>;

  if (typeof text !== 'string' || text.trim().length === 0) {
    return errorResponse('Le texte est requis', 400);
  }

  const normalizedText = text.trim();
  if (normalizedText.length > MAX_TEXT_LENGTH) {
    return errorResponse(`Le texte dépasse la limite autorisée (${MAX_TEXT_LENGTH} caractères)`, 413);
  }

  return {
    text: normalizedText,
    voiceName: typeof voiceName === 'string' ? voiceName : undefined,
    niche: typeof niche === 'string' ? niche : undefined,
    rate: typeof rate === 'string' ? rate : undefined,
    pitch: typeof pitch === 'string' ? pitch : undefined,
  };
};

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

async function generateWithOpenAIFallback(text: string): Promise<Response> {
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
  if (!OPENAI_API_KEY) throw new Error('OPENAI_API_KEY non configurée');

  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini-tts',
      input: text,
      voice: 'alloy',
      response_format: 'mp3',
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI TTS error ${response.status}: ${await response.text()}`);
  }

  return response;
}

async function generateWithElevenLabsFallback(text: string): Promise<Response> {
  const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
  if (!ELEVENLABS_API_KEY) throw new Error('ELEVENLABS_API_KEY non configurée');

  const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/Xb7hH8MSUJpSbSDYk0k2?output_format=mp3_44100_128', {
    method: 'POST',
    headers: {
      'xi-api-key': ELEVENLABS_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: { stability: 0.5, similarity_boost: 0.8, style: 0.35, use_speaker_boost: true },
    }),
  });

  if (!response.ok) {
    throw new Error(`ElevenLabs TTS error ${response.status}: ${await response.text()}`);
  }

  return response;
}

async function generateWithAzure(body: TtsRequestBody): Promise<Response> {
  const AZURE_SPEECH_KEY = Deno.env.get('AZURE_SPEECH_KEY');
  if (!AZURE_SPEECH_KEY) {
    throw new Error('AZURE_SPEECH_KEY non configurée');
  }

  const region = Deno.env.get('AZURE_SPEECH_REGION') || 'francecentral';
  const preset = body.niche && VOICE_PRESETS[body.niche] ? VOICE_PRESETS[body.niche] : VOICE_PRESETS.default;
  const finalVoice = body.voiceName || preset.voice;
  const finalRate = body.rate || preset.rate;
  const finalPitch = body.pitch || preset.pitch;

  const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='fr-FR'>
  <voice name='${finalVoice}'>
    <prosody rate='${finalRate}' pitch='${finalPitch}'>${escapeXml(body.text)}</prosody>
  </voice>
</speak>`;

  const tokenController = new AbortController();
  const tokenTimeout = setTimeout(() => tokenController.abort(), TOKEN_TIMEOUT_MS);

  const tokenResponse = await fetch(`https://${region}.api.cognitive.microsoft.com/sts/v1.0/issueToken`, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': AZURE_SPEECH_KEY,
      'Content-Length': '0',
    },
    signal: tokenController.signal,
  });
  clearTimeout(tokenTimeout);

  if (!tokenResponse.ok) {
    const message = await tokenResponse.text();
    if (tokenResponse.status === 429) {
      throw new Error('Quota Azure dépassé');
    }
    throw new Error(`Azure token error ${tokenResponse.status}: ${message}`);
  }

  const accessToken = await tokenResponse.text();

  const ttsController = new AbortController();
  const ttsTimeout = setTimeout(() => ttsController.abort(), TTS_TIMEOUT_MS);

  const ttsResponse = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': 'audio-24khz-96kbitrate-mono-mp3',
      'User-Agent': 'EbookStudio2026',
    },
    body: ssml,
    signal: ttsController.signal,
  });
  clearTimeout(ttsTimeout);

  if (!ttsResponse.ok) {
    const message = await ttsResponse.text();
    if (ttsResponse.status === 429) {
      throw new Error('Quota Azure dépassé');
    }
    throw new Error(`Azure TTS error ${ttsResponse.status}: ${message}`);
  }

  return ttsResponse;
}

const audioResponse = (response: Response, provider: string, voiceName?: string) =>
  new Response(response.body, {
    headers: {
      ...corsHeaders,
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'no-store',
      'X-TTS-Provider': provider,
      ...(voiceName ? { 'X-TTS-Voice': voiceName } : {}),
    },
  });

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const parsedBody = await parseRequestBody(req);
    if (parsedBody instanceof Response) {
      return parsedBody;
    }

    try {
      const azureResponse = await generateWithAzure(parsedBody);
      return audioResponse(azureResponse, 'azure-speech', parsedBody.voiceName);
    } catch (azureError) {
      console.error('Azure TTS failed, trying OpenAI fallback...', azureError);
    }

    try {
      const openAiResponse = await generateWithOpenAIFallback(parsedBody.text);
      return audioResponse(openAiResponse, 'openai-fallback');
    } catch (openAiError) {
      console.error('OpenAI TTS failed, trying ElevenLabs fallback...', openAiError);
    }

    try {
      const elevenLabsResponse = await generateWithElevenLabsFallback(parsedBody.text);
      return audioResponse(elevenLabsResponse, 'elevenlabs-fallback');
    } catch (elevenLabsError) {
      console.error('ElevenLabs TTS failed:', elevenLabsError);
    }

    return errorResponse('Tous les services de synthèse vocale sont indisponibles. Veuillez réessayer plus tard.', 503);
  } catch (error) {
    console.error('Error in azure-speech-tts:', error);
    return errorResponse(error instanceof Error ? error.message : 'Erreur interne', 500);
  }
});