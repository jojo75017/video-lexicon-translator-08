/**
 * Generates the audiobook intro jingle:
 * 1. A bell/chime sound generated via Web Audio API (played as separate WAV blob)
 * 2. TTS intro message via Azure Speech (MP3)
 * 3. Short silence transition via TTS
 * 
 * Returns an array of blobs to be played SEQUENTIALLY (not concatenated),
 * since the bell is WAV and TTS segments are MP3.
 */

const INTRO_TEXT = "Bienvenue dans votre livre audio produit par EbookStudio 2026. Installez-vous confortablement, nous commençons la lecture.";

/**
 * Generate a synthetic bell chime using Web Audio API.
 * Returns a WAV Blob.
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
    return audioBufferToWav(renderedBuffer);
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
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const dataLength = buffer.length * blockAlign;
  const headerLength = 44;
  const totalLength = headerLength + dataLength;
  const arrayBuffer = new ArrayBuffer(totalLength);
  const view = new DataView(arrayBuffer);

  writeString(view, 0, 'RIFF');
  view.setUint32(4, totalLength - 8, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataLength, true);

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
 * Generate the complete intro jingle.
 * Returns blobs that MUST be played sequentially (bell=WAV, rest=MP3).
 * For export/download, use generateIntroForExport() which is MP3-only.
 */
export async function generateIntroJingle(
  generateTts: (text: string) => Promise<Blob | null>
): Promise<Blob[]> {
  const introBlobs: Blob[] = [];

  // 1. Bell chime (WAV, generated locally — no API call)
  const bellBlob = await generateBellChimeWebAudio();
  if (bellBlob) {
    introBlobs.push(bellBlob);
  }

  // 2. Welcome message (MP3 via TTS)
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

/**
 * Generate intro for file export (MP3-only, no WAV bell).
 * Safe to concatenate with other MP3 blobs.
 */
export async function generateIntroForExport(
  generateTts: (text: string) => Promise<Blob | null>
): Promise<Blob[]> {
  const introBlobs: Blob[] = [];

  // Welcome message (MP3)
  const ttsBlob = await generateTts(INTRO_TEXT);
  if (ttsBlob && ttsBlob.size > 0) {
    introBlobs.push(ttsBlob);
  }

  // Short silence
  const silenceBlob = await generateTts('...');
  if (silenceBlob && silenceBlob.size > 0) {
    introBlobs.push(silenceBlob);
  }

  return introBlobs;
}

export { INTRO_TEXT };
