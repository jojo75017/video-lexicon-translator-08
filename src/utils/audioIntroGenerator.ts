/**
 * Generates the audiobook intro jingle:
 * 1. A bell/chime sound generated via Web Audio API (WAV→MP3-compatible)
 * 2. TTS intro message via Azure Speech (MP3)
 * 3. Short silence transition via TTS
 */

const INTRO_TEXT = "Bienvenue dans votre livre audio produit par EbookStudio 2026. Installez-vous confortablement, nous commençons la lecture.";

/**
 * Generate a synthetic bell chime using Web Audio API.
 * Returns an MP3-compatible WAV blob that concatenates cleanly with Azure MP3 segments.
 */
async function generateBellChimeWebAudio(): Promise<Blob | null> {
  try {
    const sampleRate = 44100;
    const duration = 2.5;
    const length = sampleRate * duration;
    const offlineCtx = new OfflineAudioContext(1, length, sampleRate);

    // Fundamental bell tone (523 Hz - C5)
    const osc1 = offlineCtx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = 523.25;
    const gain1 = offlineCtx.createGain();
    gain1.gain.setValueAtTime(0.4, 0);
    gain1.gain.exponentialRampToValueAtTime(0.001, duration);
    osc1.connect(gain1).connect(offlineCtx.destination);
    osc1.start(0);
    osc1.stop(duration);

    // Harmonic overtone (1046 Hz - C6)
    const osc2 = offlineCtx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = 1046.5;
    const gain2 = offlineCtx.createGain();
    gain2.gain.setValueAtTime(0.2, 0);
    gain2.gain.exponentialRampToValueAtTime(0.001, duration * 0.6);
    osc2.connect(gain2).connect(offlineCtx.destination);
    osc2.start(0);
    osc2.stop(duration);

    // Soft shimmer (1568 Hz - G6)
    const osc3 = offlineCtx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.value = 1567.98;
    const gain3 = offlineCtx.createGain();
    gain3.gain.setValueAtTime(0.1, 0);
    gain3.gain.exponentialRampToValueAtTime(0.001, duration * 0.4);
    osc3.connect(gain3).connect(offlineCtx.destination);
    osc3.start(0);
    osc3.stop(duration);

    const renderedBuffer = await offlineCtx.startRendering();

    // Encode as WAV
    const wavBlob = audioBufferToWav(renderedBuffer);
    return wavBlob;
  } catch (error) {
    console.warn('Web Audio bell chime generation failed:', error);
    return null;
  }
}

/**
 * Convert an AudioBuffer to a WAV Blob
 */
function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const dataLength = buffer.length * blockAlign;
  const headerLength = 44;
  const totalLength = headerLength + dataLength;
  const arrayBuffer = new ArrayBuffer(totalLength);
  const view = new DataView(arrayBuffer);

  // WAV header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, totalLength - 8, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // chunk size
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataLength, true);

  // Write PCM samples
  const channelData = buffer.getChannelData(0);
  let offset = 44;
  for (let i = 0; i < buffer.length; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const sample = ch === 0 ? channelData[i] : buffer.getChannelData(ch)[i];
      const clamped = Math.max(-1, Math.min(1, sample));
      view.setInt16(offset, clamped < 0 ? clamped * 0x8000 : clamped * 0x7FFF, true);
      offset += bytesPerSample;
    }
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

/**
 * Generate the complete intro jingle:
 * Bell chime (2.5s) + TTS intro + Silence (1.5s)
 * 
 * @param generateTts - Function to generate TTS MP3 blob from text
 * @returns Array of Blobs to prepend before chapter content
 */
export async function generateIntroJingle(
  generateTts: (text: string) => Promise<Blob | null>
): Promise<Blob[]> {
  const introBlobs: Blob[] = [];

  // 1. Generate bell chime via Web Audio API (no external API needed)
  const bellBlob = await generateBellChimeWebAudio();
  if (bellBlob) {
    introBlobs.push(bellBlob);
  }

  // 2. Generate TTS intro message (returns MP3 from Azure)
  const ttsBlob = await generateTts(INTRO_TEXT);
  if (ttsBlob) {
    introBlobs.push(ttsBlob);
  }

  // 3. Generate a short silence via TTS
  const silenceBlob = await generateTts('...');
  if (silenceBlob) {
    introBlobs.push(silenceBlob);
  }

  return introBlobs;
}

/**
 * Alternative: Generate intro without bell (TTS only)
 */
export async function generateIntroViaTts(
  generateTts: (text: string) => Promise<Blob | null>
): Promise<Blob[]> {
  const introBlobs: Blob[] = [];

  const bellBlob = await generateBellChimeWebAudio();
  if (bellBlob) {
    introBlobs.push(bellBlob);
  }

  const ttsBlob = await generateTts(INTRO_TEXT);
  if (ttsBlob) {
    introBlobs.push(ttsBlob);
  }

  const silenceBlob = await generateTts('...');
  if (silenceBlob) {
    introBlobs.push(silenceBlob);
  }

  return introBlobs;
}

export { INTRO_TEXT };
