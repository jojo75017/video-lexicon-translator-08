/**
 * Generates the audiobook intro jingle:
 * 1. A 3-second bell/chime sound effect via ElevenLabs SFX (MP3)
 * 2. TTS intro message via Azure Speech (MP3)
 * 3. 1.5-second silence encoded as MP3-compatible silent frame
 */

import { supabase } from '@/integrations/supabase/client';

const INTRO_TEXT = "Bienvenue dans votre livre audio produit par EbookStudio 2026. Installez-vous confortablement, nous commençons la lecture.";

/**
 * Generate a bell chime MP3 via ElevenLabs Sound Effects API
 */
async function generateBellChimeMp3(): Promise<Blob | null> {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-sfx`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          prompt: 'Gentle crystal bell chime, elegant and warm, like a meditation bell or audiobook intro tone, single clear ring with soft reverb',
          duration: 3,
        }),
      }
    );

    if (!response.ok) {
      console.warn('ElevenLabs SFX failed, skipping bell chime:', response.status);
      return null;
    }

    const data = await response.json();
    if (!data.audioContent) return null;

    const audioUrl = `data:audio/mpeg;base64,${data.audioContent}`;
    const audioResponse = await fetch(audioUrl);
    return await audioResponse.blob();
  } catch (error) {
    console.warn('Bell chime generation failed:', error);
    return null;
  }
}

/**
 * Generate the complete intro jingle:
 * Bell chime (3s) + TTS intro + Silence (1.5s)
 * 
 * All segments are in MP3 format for proper concatenation.
 * 
 * @param generateTts - Function to generate TTS MP3 blob from text
 * @returns Array of Blobs to prepend before chapter content
 */
export async function generateIntroJingle(
  generateTts: (text: string) => Promise<Blob | null>
): Promise<Blob[]> {
  const introBlobs: Blob[] = [];

  // 1. Generate bell chime as MP3 via ElevenLabs SFX
  const bellMp3 = await generateBellChimeMp3();
  if (bellMp3) {
    introBlobs.push(bellMp3);
  }

  // 2. Generate TTS intro message (returns MP3 from Azure)
  const ttsBlob = await generateTts(INTRO_TEXT);
  if (ttsBlob) {
    introBlobs.push(ttsBlob);
  }

  // 3. Generate a short silence via TTS (a single period produces ~1s of near-silence)
  const silenceBlob = await generateTts('...');
  if (silenceBlob) {
    introBlobs.push(silenceBlob);
  }

  return introBlobs;
}

/**
 * Alternative approach: Generate the entire intro via Azure SSML
 * Uses a break tag for the bell effect timing and actual speech
 */
export async function generateIntroViaTts(
  generateTts: (text: string) => Promise<Blob | null>
): Promise<Blob[]> {
  const introBlobs: Blob[] = [];

  // Generate bell chime as MP3
  const bellMp3 = await generateBellChimeMp3();
  if (bellMp3) {
    introBlobs.push(bellMp3);
  }

  // Generate the spoken intro via TTS
  const ttsBlob = await generateTts(INTRO_TEXT);
  if (ttsBlob) {
    introBlobs.push(ttsBlob);
  }

  // Silence transition via minimal TTS
  const silenceBlob = await generateTts('...');
  if (silenceBlob) {
    introBlobs.push(silenceBlob);
  }

  return introBlobs;
}

export { INTRO_TEXT };
