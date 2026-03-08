import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const MAX_TEXT_LENGTH = 5000;

// Voix Azure par niche
const VOICE_PRESETS: Record<string, { voice: string; rate: string; pitch: string }> = {
  'enfants-3-6': { voice: 'fr-FR-EloiseNeural', rate: '0%', pitch: '+5%' },
  'enfants-6-12': { voice: 'fr-FR-BrigitteNeural', rate: '0%', pitch: '0%' },
  'thriller': { voice: 'fr-FR-HenriNeural', rate: '-10%', pitch: '-5%' },
  'romance': { voice: 'fr-FR-DeniseNeural', rate: '0%', pitch: '+3%' },
  'spiritualite': { voice: 'fr-FR-AlainNeural', rate: '-5%', pitch: '-3%' },
  'business': { voice: 'fr-FR-JeromeNeural', rate: '+5%', pitch: '0%' },
  'histoire': { voice: 'fr-FR-CelesteNeural', rate: '0%', pitch: '0%' },
  'default': { voice: 'fr-FR-DeniseNeural', rate: '0%', pitch: '0%' },
};

// Fallback: OpenAI TTS
async function generateWithOpenAIFallback(text: string): Promise<{ base64: string; provider: string }> {
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
  if (!OPENAI_API_KEY) throw new Error('OPENAI_API_KEY non configurée pour le fallback');

  console.log('Fallback: Using OpenAI TTS...');
  const truncated = text.substring(0, 4000);

  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini-tts',
      input: truncated,
      voice: 'alloy',
      response_format: 'mp3',
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI TTS error ${response.status}: ${errText}`);
  }

  const audioBuffer = await response.arrayBuffer();
  const uint8Array = new Uint8Array(audioBuffer);

  let binary = '';
  const chunkSize = 8192;
  for (let i = 0; i < uint8Array.length; i += chunkSize) {
    const chunk = uint8Array.slice(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  const base64Audio = btoa(binary);

  console.log(`OpenAI TTS fallback success: ${uint8Array.length} bytes`);
  return { base64: base64Audio, provider: 'openai-tts-fallback' };
}

// Fallback 2: ElevenLabs TTS
async function generateWithElevenLabsFallback(text: string): Promise<{ base64: string; provider: string }> {
  const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
  if (!ELEVENLABS_API_KEY) throw new Error('ELEVENLABS_API_KEY non configurée pour le fallback');

  console.log('Fallback: Using ElevenLabs TTS...');
  const truncated = text.substring(0, 5000);

  // Alice voice - good for French
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
        text: truncated,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`ElevenLabs TTS error ${response.status}: ${errText}`);
  }

  const audioBuffer = await response.arrayBuffer();
  const uint8Array = new Uint8Array(audioBuffer);

  let binary = '';
  const chunkSize = 8192;
  for (let i = 0; i < uint8Array.length; i += chunkSize) {
    const chunk = uint8Array.slice(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  const base64Audio = btoa(binary);

  console.log(`ElevenLabs TTS fallback success: ${uint8Array.length} bytes`);
  return { base64: base64Audio, provider: 'elevenlabs-fallback' };
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
      return new Response(
        JSON.stringify({ error: 'Le texte est requis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const truncatedText = text.substring(0, MAX_TEXT_LENGTH);

    // Determine voice settings
    const preset = niche && VOICE_PRESETS[niche] ? VOICE_PRESETS[niche] : VOICE_PRESETS['default'];
    const finalVoice = voiceName || preset.voice;
    const finalRate = rate || preset.rate;
    const finalPitch = pitch || preset.pitch;

    // === TRY AZURE FIRST ===
    if (AZURE_SPEECH_KEY) {
      try {
        // Escape XML special characters in text
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

        // Get token
        const tokenResponse = await fetch(
          `https://${AZURE_SPEECH_REGION}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
          {
            method: 'POST',
            headers: {
              'Ocp-Apim-Subscription-Key': AZURE_SPEECH_KEY,
              'Content-Length': '0',
            },
          }
        );

        if (!tokenResponse.ok) {
          const errText = await tokenResponse.text();
          console.error('Azure token error:', tokenResponse.status, errText);
          if (tokenResponse.status === 429) {
            throw { azureQuota: true, message: 'Azure quota exceeded on token' };
          }
          throw new Error(`Azure token error: ${tokenResponse.status}`);
        }

        const accessToken = await tokenResponse.text();

        // Call TTS
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
          }
        );

        if (!ttsResponse.ok) {
          const errText = await ttsResponse.text();
          console.error('Azure TTS error:', ttsResponse.status, errText);
          if (ttsResponse.status === 429) {
            throw { azureQuota: true, message: 'Azure quota exceeded on TTS' };
          }
          throw new Error(`Azure TTS error: ${ttsResponse.status}`);
        }

        const audioBuffer = await ttsResponse.arrayBuffer();
        const uint8Array = new Uint8Array(audioBuffer);

        // Convert to base64
        let binary = '';
        const chunkSize = 8192;
        for (let i = 0; i < uint8Array.length; i += chunkSize) {
          const chunk = uint8Array.slice(i, i + chunkSize);
          binary += String.fromCharCode(...chunk);
        }
        const base64Audio = btoa(binary);

        console.log(`Azure TTS success: ${uint8Array.length} bytes`);

        return new Response(
          JSON.stringify({
            audioContent: base64Audio,
            provider: 'azure-speech',
            voice: finalVoice,
            format: 'audio-48khz-192kbitrate-mono-mp3'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      } catch (azureErr: any) {
        if (azureErr?.azureQuota) {
          console.warn('Azure quota exceeded, trying fallbacks...');
        } else {
          console.error('Azure TTS failed, trying fallbacks...', azureErr);
        }
        // Fall through to fallbacks
      }
    } else {
      console.warn('AZURE_SPEECH_KEY not configured, using fallbacks...');
    }

    // === FALLBACK CHAIN: ElevenLabs → OpenAI ===
    // Try ElevenLabs first (better voice quality for French)
    try {
      const result = await generateWithElevenLabsFallback(truncatedText);
      return new Response(
        JSON.stringify({
          audioContent: result.base64,
          provider: result.provider,
          voice: 'Alice (ElevenLabs)',
          format: 'mp3_44100_128',
          fallbackUsed: true
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (elErr) {
      console.error('ElevenLabs fallback failed:', elErr);
    }

    // Try OpenAI TTS as last resort
    try {
      const result = await generateWithOpenAIFallback(truncatedText);
      return new Response(
        JSON.stringify({
          audioContent: result.base64,
          provider: result.provider,
          voice: 'Alloy (OpenAI)',
          format: 'mp3',
          fallbackUsed: true
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (oaiErr) {
      console.error('OpenAI TTS fallback also failed:', oaiErr);
    }

    // All providers failed
    return new Response(
      JSON.stringify({ error: 'Tous les services de synthèse vocale sont indisponibles. Veuillez réessayer plus tard.' }),
      { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in azure-speech-tts:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Erreur interne' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
