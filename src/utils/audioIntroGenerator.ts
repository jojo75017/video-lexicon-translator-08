/**
 * Generates the audiobook intro jingle:
 * 1. A 3-second bell/chime sound effect
 * 2. TTS intro message via Azure Speech
 * 3. 1.5-second silence for transition
 */

const INTRO_TEXT = "Bienvenue dans votre livre audio produit par EbookStudio 2026. Installez-vous confortablement, nous commençons la lecture.";

/**
 * Generate a bell chime sound effect (3 seconds) using Web Audio API
 * Returns a WAV Blob
 */
function generateBellChime(durationSec = 3, sampleRate = 48000): Blob {
  const numSamples = sampleRate * durationSec;
  const buffer = new Float32Array(numSamples);

  // Bell frequencies (harmonics of a bell-like tone)
  const harmonics = [
    { freq: 523.25, amp: 0.4, decay: 1.8 },   // C5
    { freq: 659.25, amp: 0.3, decay: 1.5 },   // E5
    { freq: 783.99, amp: 0.2, decay: 1.2 },   // G5
    { freq: 1046.50, amp: 0.15, decay: 0.9 }, // C6
    { freq: 1318.51, amp: 0.08, decay: 0.7 }, // E6
    { freq: 2093.00, amp: 0.04, decay: 0.4 }, // C7 shimmer
  ];

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let sample = 0;
    for (const h of harmonics) {
      const envelope = Math.exp(-t / h.decay);
      sample += h.amp * envelope * Math.sin(2 * Math.PI * h.freq * t);
    }
    // Soft attack (first 10ms)
    const attackEnv = Math.min(1, t / 0.01);
    buffer[i] = sample * attackEnv * 0.6; // master volume
  }

  // Fade out last 500ms
  const fadeStart = numSamples - sampleRate * 0.5;
  for (let i = Math.max(0, fadeStart); i < numSamples; i++) {
    buffer[i] *= (numSamples - i) / (numSamples - fadeStart);
  }

  // Encode as WAV
  return encodeWav(buffer, sampleRate);
}

function encodeWav(samples: Float32Array, sampleRate: number): Blob {
  const numSamples = samples.length;
  const bytesPerSample = 2; // 16-bit
  const blockAlign = bytesPerSample;
  const dataSize = numSamples * bytesPerSample;
  const headerSize = 44;
  const arrayBuffer = new ArrayBuffer(headerSize + dataSize);
  const view = new DataView(arrayBuffer);

  // RIFF header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, headerSize + dataSize - 8, true);
  writeString(view, 8, 'WAVE');

  // fmt chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // chunk size
  view.setUint16(20, 1, true);  // PCM
  view.setUint16(22, 1, true);  // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true); // bits per sample

  // data chunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  // Write samples
  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    offset += 2;
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

/**
 * Generate 1.5 seconds of silence as a WAV blob
 */
function generateSilence(durationSec = 1.5, sampleRate = 48000): Blob {
  const numSamples = Math.round(sampleRate * durationSec);
  const samples = new Float32Array(numSamples); // all zeros = silence
  return encodeWav(samples, sampleRate);
}

/**
 * Convert a WAV blob to MP3 base64 via a simple approach:
 * Since we're concatenating blobs for MP3 output, and the Azure TTS returns MP3,
 * we'll convert WAV to a playable audio blob that works when concatenated.
 * 
 * For simplicity, we encode the bell as a short SSML pause + effect in Azure itself.
 */

/**
 * Generate the complete intro jingle:
 * Bell chime (3s) + TTS intro + Silence (1.5s)
 * 
 * @param generateTts - Function to generate TTS MP3 blob from text
 * @returns Array of Blobs to prepend before chapter content
 */
export async function generateIntroJingle(
  generateTts: (text: string) => Promise<Blob | null>
): Promise<Blob[]> {
  const introBlobs: Blob[] = [];

  // 1. Generate bell chime as WAV (will work as audio in concatenation)
  const bellWav = generateBellChime(3, 48000);
  introBlobs.push(bellWav);

  // 2. Generate TTS intro
  const ttsBlob = await generateTts(INTRO_TEXT);
  if (ttsBlob) {
    introBlobs.push(ttsBlob);
  }

  // 3. Add 1.5s silence
  const silenceWav = generateSilence(1.5, 48000);
  introBlobs.push(silenceWav);

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

  // Generate bell chime locally  
  const bellWav = generateBellChime(3, 48000);
  introBlobs.push(bellWav);

  // Generate the spoken intro via TTS
  const ttsBlob = await generateTts(INTRO_TEXT);
  if (ttsBlob) {
    introBlobs.push(ttsBlob);
  }

  // Silence transition
  const silenceWav = generateSilence(1.5, 48000);
  introBlobs.push(silenceWav);

  return introBlobs;
}

export { INTRO_TEXT };
