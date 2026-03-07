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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const AZURE_SPEECH_KEY = Deno.env.get('AZURE_SPEECH_KEY');
    const AZURE_SPEECH_REGION = Deno.env.get('AZURE_SPEECH_REGION') || 'francecentral';

    if (!AZURE_SPEECH_KEY) {
      return new Response(
        JSON.stringify({ error: 'AZURE_SPEECH_KEY non configurée' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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
      return new Response(
        JSON.stringify({ error: `Erreur d'authentification Azure: ${tokenResponse.status}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
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
        return new Response(
          JSON.stringify({ error: 'Limite Azure atteinte, réessayez dans quelques instants.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: `Erreur Azure TTS: ${ttsResponse.status}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
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

  } catch (error) {
    console.error('Error in azure-speech-tts:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Erreur interne' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
