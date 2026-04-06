import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const MAX_TEXT_LENGTH = 5000;

const VOICE_PRESETS: Record<string, { voice: string; rate: string; pitch: string }> = {
  'enfants-3-6': { voice: 'fr-FR-EloiseNeural', rate: '0%', pitch: '+5%' },
  'enfants-6-12': { voice: 'fr-FR-BrigitteNeural', rate: '0%', pitch: '0%' },
  'thriller': { voice: 'fr-FR-HenriNeural', rate: '-10%', pitch: '-5%' },
  'romance': { voice: 'fr-FR-DeniseNeural', rate: '0%', pitch: '+3%' },
  'spiritualite': { voice: 'fr-FR-AlainNeural', rate: '-5%', pitch: '-3%' },
  'business': { voice: 'fr-FR-JeromeNeural', rate: '+5%', pitch: '0%' },
  'histoire': { voice: 'fr-FR-CelesteNeural', rate: '0%', pitch: '0%' },
  'saga': { voice: 'fr-FR-HenriNeural', rate: '-5%', pitch: '-3%' },
  'default': { voice: 'fr-FR-DeniseNeural', rate: '0%', pitch: '0%' },
};

const errorResponse = (message: string, status = 500) =>
  new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

// Fallback: OpenAI TTS — returns the Response object directly (no base64)
async function generateWithOpenAIFallback(text: string): Promise<Response> {
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
  if (!OPENAI_API_KEY) throw new Error('OPENAI_API_KEY non configurée');

  console.log('Fallback: Using OpenAI TTS...');
  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini-tts',
      input: text.substring(0, 4000),
      voice: 'alloy',
      response_format: 'mp3',
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI TTS error ${response.status}: ${errText}`);
  }

  console.log('OpenAI TTS fallback success');
  return response;
}

// Fallback: ElevenLabs TTS — returns the Response object directly
async function generateWithElevenLabsFallback(text: string): Promise<Response> {
  const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
  if (!ELEVENLABS_API_KEY) throw new Error('ELEVENLABS_API_KEY non configurée');

  console.log('Fallback: Using ElevenLabs TTS...');
  const voiceId = 'Xb7hH8MSUJpSbSDYk0k2';
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text.substring(0, 5000),
        model_id: 'eleven_multilingual_v2',
        voice_settings: { stability: 0.5, similarity_boost: 0.80, style: 0.35, use_speaker_boost: true },
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`ElevenLabs TTS error ${response.status}: ${errText}`);
  }

  console.log('ElevenLabs TTS fallback success');
  return response;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const AZURE_SPEECH_KEY = Deno.env.get('AZURE_SPEECH_KEY');
    const AZURE_SPEECH_REGION = Deno.env.get('AZURE_SPEECH_REGION') || 'francecentral';

    const { text, voiceName, niche, rate, pitch } = await req.json();

    if (!text || text.trim().length === 0) {
      return errorResponse('Le texte est requis', 400);
    }

    const truncatedText = text.substring(0, MAX_TEXT_LENGTH);

    const preset = niche && VOICE_PRESETS[niche] ? VOICE_PRESETS[niche] : VOICE_PRESETS['default'];
    const finalVoice = voiceName || preset.voice;
    const finalRate = rate || preset.rate;
    const finalPitch = pitch || preset.pitch;

    // === TRY AZURE FIRST ===
    if (AZURE_SPEECH_KEY) {
      try {
        const escapedText = truncatedText
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&apos;');

        const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='fr-FR'>
  <voice name='${finalVoice}'>
    <prosody rate='${finalRate}' pitch='${finalPitch}'>
      ${escapedText}
    </prosody>
  </voice>
</speak>`;

        console.log(`Azure TTS: voice=${finalVoice}, niche=${niche || 'default'}, textLength=${truncatedText.length}`);

        const tokenController = new AbortController();
        const tokenTimeout = setTimeout(() => tokenController.abort(), 10000);
        
        const tokenResponse = await fetch(
          `https://${AZURE_SPEECH_REGION}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
          {
            method: 'POST',
            headers: { 'Ocp-Apim-Subscription-Key': AZURE_SPEECH_KEY, 'Content-Length': '0' },
            signal: tokenController.signal,
          }
        );
        clearTimeout(tokenTimeout);

        if (!tokenResponse.ok) {
          const errText = await tokenResponse.text();
          console.error('Azure token error:', tokenResponse.status, errText);
          if (tokenResponse.status === 429) {
            throw { azureQuota: true, message: 'Azure quota exceeded on token' };
          }
          throw new Error(`Azure token error: ${tokenResponse.status}`);
        }

        const accessToken = await tokenResponse.text();

        const ttsController = new AbortController();
        const ttsTimeout = setTimeout(() => ttsController.abort(), 30000);

        const ttsResponse = await fetch(
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
            signal: ttsController.signal,
          }
        );
        clearTimeout(ttsTimeout);

        if (!ttsResponse.ok) {
          const errText = await ttsResponse.text();
          console.error('Azure TTS error:', ttsResponse.status, errText);
          if (ttsResponse.status === 429) {
            throw { azureQuota: true, message: 'Azure quota exceeded on TTS' };
          }
          throw new Error(`Azure TTS error: ${ttsResponse.status}`);
        }

        console.log('Azure TTS success — streaming binary response');

        return new Response(ttsResponse.body, {
          headers: {
            ...corsHeaders,
            'Content-Type': 'audio/mpeg',
            'X-TTS-Provider': 'azure-speech',
            'X-TTS-Voice': finalVoice,
          },
        });

      } catch (azureErr: any) {
        if (azureErr?.name === 'AbortError') {
          console.warn('Azure TTS timed out, trying fallbacks...');
        } else if (azureErr?.azureQuota) {
          console.warn('Azure quota exceeded, trying fallbacks...');
        } else {
          console.error('Azure TTS failed, trying fallbacks...', azureErr);
        }
      }
    } else {
      console.warn('AZURE_SPEECH_KEY not configured, using fallbacks...');
    }

    // === FALLBACK: ElevenLabs → OpenAI — stream binary directly ===
    try {
      const elResponse = await generateWithElevenLabsFallback(truncatedText);
      return new Response(elResponse.body, {
        headers: { ...corsHeaders, 'Content-Type': 'audio/mpeg', 'X-TTS-Provider': 'elevenlabs-fallback' },
      });
    } catch (elErr) {
      console.error('ElevenLabs fallback failed:', elErr);
    }

    try {
      const oaiResponse = await generateWithOpenAIFallback(truncatedText);
      return new Response(oaiResponse.body, {
        headers: { ...corsHeaders, 'Content-Type': 'audio/mpeg', 'X-TTS-Provider': 'openai-fallback' },
      });
    } catch (oaiErr) {
      console.error('OpenAI TTS fallback also failed:', oaiErr);
    }

    return errorResponse('Tous les services de synthèse vocale sont indisponibles. Veuillez réessayer plus tard.', 503);

  } catch (error) {
    console.error('Error in azure-speech-tts:', error);
    return errorResponse(error.message || 'Erreur interne', 500);
  }
});
