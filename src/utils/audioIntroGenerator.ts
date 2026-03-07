/**
 * Generates the audiobook intro jingle:
 * 1. A bell/chime sound generated via Web Audio API (WAV→MP3-compatible)
 * 2. TTS intro message via Azure Speech (MP3)
 * 3. Short silence transition via TTS
 */

const INTRO_TEXT = "Bienvenue dans votre livre audio produit par EbookStudio 2026. Installez-vous confortablement, nous commençons la lecture.";

// Bell chime expressed as a TTS-friendly onomatopoeia so the output is MP3 (same format as other segments)
const BELL_SOUND_TEXT = "Ding... Ding... Ding...";

/**
 * Generate the complete intro jingle (all segments are MP3 from TTS):
 * 1. Bell-like sound via TTS onomatopoeia
 * 2. Welcome message
 * 3. Short silence transition
 * 
 * All blobs are MP3, so they can be safely concatenated or played sequentially.
 * 
 * @param generateTts - Function to generate TTS MP3 blob from text
 * @returns Array of MP3 Blobs to prepend before chapter content
 */
export async function generateIntroJingle(
  generateTts: (text: string) => Promise<Blob | null>
): Promise<Blob[]> {
  const introBlobs: Blob[] = [];

  // 1. Generate bell-like sound via TTS (MP3 format, same as other segments)
  const bellBlob = await generateTts(BELL_SOUND_TEXT);
  if (bellBlob && bellBlob.size > 0) {
    introBlobs.push(bellBlob);
  }

  // 2. Generate TTS intro message (MP3)
  const ttsBlob = await generateTts(INTRO_TEXT);
  if (ttsBlob && ttsBlob.size > 0) {
    introBlobs.push(ttsBlob);
  }

  // 3. Short silence transition
  const silenceBlob = await generateTts('...');
  if (silenceBlob && silenceBlob.size > 0) {
    introBlobs.push(silenceBlob);
  }

  return introBlobs;
}

export { INTRO_TEXT };
