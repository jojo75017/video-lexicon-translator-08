/**
 * Generates the audiobook IMMERSIVE intro (Jingle):
 * 
 * Structure (Position 0 — avant le Chapitre 1) :
 * 1. Ambiance Sonore : Effet sonore de 3s (type annonce de gare/aéroport → sensation de départ en voyage)
 * 2. Présentation Officielle : "Bienvenue sur EbookStudio 2026. Ce livre audio est rédigé par Georges Boubet. Nous vous présentons aujourd'hui : {TITRE}."
 * 3. Extrait "Teaser" : 50 mots max tirés de l'introduction
 * 4. Mot de la Fin : "Attachez vos ceintures, l'aventure commence maintenant."
 * 5. Transition : Silence de 2 secondes avant le Chapitre 1
 * 
 * Consigne : Utilise la MÊME voix Azure (ex: Denise ou Henri) pour toute l'introduction.
 */

export interface IntroPremiumOptions {
  ebookTitle?: string;
  authorName?: string;
  introductionText?: string;
  genre?: string;
}

// ─── Script builder (structure immersive) ───

function buildPremiumIntroScript(options: IntroPremiumOptions): string[] {
  const title = options.ebookTitle?.trim() || 'votre livre audio';
  const author = options.authorName?.trim() || 'Georges Boubet';
  const extract = extractFirst50Words(options.introductionText || '');

  const segments: string[] = [];

  // Segment 1: Présentation Officielle (voix unique, cohérente)
  segments.push(
    `Bienvenue sur EbookStudio 2026. Ce livre audio est rédigé par ${author}. Nous vous présentons aujourd'hui : ${title}.`
  );

  // Segment 2: Extrait "Teaser" (50 mots max tirés de l'introduction)
  if (extract) {
    segments.push(extract);
  }

  // Segment 3: Le Mot de la Fin (Intro)
  segments.push(`Attachez vos ceintures, l'aventure commence maintenant.`);

  return segments;
}

/**
 * Extract the first ~50 words from an introduction text,
 * cutting at the last complete sentence to avoid mid-sentence breaks.
 */
function extractFirst50Words(text: string): string {
  if (!text || !text.trim()) return '';
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  if (words.length === 0) return '';
  
  const selected = words.slice(0, 50).join(' ');
  
  // Find the last sentence-ending punctuation within the selected text
  const sentenceEndMatch = selected.match(/^([\s\S]*[.!?])\s*/);
  if (sentenceEndMatch && sentenceEndMatch[1].trim().length > 20) {
    return sentenceEndMatch[1].trim();
  }
  
  const result = selected.trim();
  if (result && !result.match(/[.!?]$/)) {
    return result + '.';
  }
  return result;
}

/**
 * Build a single combined intro text (for display/preview purposes).
 */
export function buildIntroDisplayText(options: IntroPremiumOptions): string {
  const segments = buildPremiumIntroScript(options);
  return '🔊 [Ambiance sonore — annonce de gare — 3 secondes]\n\n' + segments.join('\n\n') + '\n\n⏸️ [Silence de 2 secondes — transition vers le Chapitre 1]';
}

// ─── Legacy flat intro text (kept for backward compatibility) ───

const DEFAULT_INTRO_TEXT = "Bienvenue sur EbookStudio 2026. Ce livre audio est rédigé par {AUTEUR}. Nous vous présentons aujourd'hui : {TITRE}.";

function buildIntroText(ebookTitle?: string, authorName?: string): string {
  const title = ebookTitle?.trim() || 'votre livre audio';
  const author = authorName?.trim() || 'Georges Boubet';
  return DEFAULT_INTRO_TEXT.replace('{TITRE}', title).replace('{AUTEUR}', author);
}

// ─── Audio generation (Web Audio API) ───

/**
 * Generate an immersive "train station / airport announcement" ambiance.
 * Duration: 3 seconds. Creates a reverberant chime + ambient pad.
 * Returns a WAV Blob.
 */
async function generatePremiumJingle(): Promise<Blob | null> {
  try {
    const sampleRate = 44100;
    const duration = 3.0;
    const length = sampleRate * duration;
    const offlineCtx = new OfflineAudioContext(1, length, sampleRate);

    // Deep ambient pad (low drone — simulates station ambiance)
    const padOsc = offlineCtx.createOscillator();
    padOsc.type = 'sine';
    padOsc.frequency.value = 130.81; // C3 — warm, low
    const padGain = offlineCtx.createGain();
    padGain.gain.setValueAtTime(0, 0);
    padGain.gain.linearRampToValueAtTime(0.2, 0.5);
    padGain.gain.setValueAtTime(0.2, duration - 1.0);
    padGain.gain.exponentialRampToValueAtTime(0.001, duration);
    padOsc.connect(padGain).connect(offlineCtx.destination);
    padOsc.start(0);
    padOsc.stop(duration);

    // Second harmonic pad (fifth — G3 = 196 Hz)
    const pad2 = offlineCtx.createOscillator();
    pad2.type = 'sine';
    pad2.frequency.value = 196.0;
    const pad2Gain = offlineCtx.createGain();
    pad2Gain.gain.setValueAtTime(0, 0);
    pad2Gain.gain.linearRampToValueAtTime(0.12, 0.6);
    pad2Gain.gain.setValueAtTime(0.12, duration - 1.2);
    pad2Gain.gain.exponentialRampToValueAtTime(0.001, duration);
    pad2.connect(pad2Gain).connect(offlineCtx.destination);
    pad2.start(0);
    pad2.stop(duration);

    // Announcement chime — two-tone "ding-dong" (like train station)
    // First tone (high) — G5
    const chime1 = offlineCtx.createOscillator();
    chime1.type = 'sine';
    chime1.frequency.value = 783.99; // G5
    const chime1Gain = offlineCtx.createGain();
    chime1Gain.gain.setValueAtTime(0, 0);
    chime1Gain.gain.linearRampToValueAtTime(0.4, 0.05);
    chime1Gain.gain.exponentialRampToValueAtTime(0.001, 0.8);
    chime1.connect(chime1Gain).connect(offlineCtx.destination);
    chime1.start(0.1);
    chime1.stop(1.0);

    // Second tone (lower) — E5 (classic ding-dong interval)
    const chime2 = offlineCtx.createOscillator();
    chime2.type = 'sine';
    chime2.frequency.value = 659.25; // E5
    const chime2Gain = offlineCtx.createGain();
    chime2Gain.gain.setValueAtTime(0, 0);
    chime2Gain.gain.linearRampToValueAtTime(0.35, 0.05);
    chime2Gain.gain.exponentialRampToValueAtTime(0.001, 0.9);
    chime2.connect(chime2Gain).connect(offlineCtx.destination);
    chime2.start(0.55);
    chime2.stop(1.5);

    // Subtle high shimmer for "travel" atmosphere
    const shimmer = offlineCtx.createOscillator();
    shimmer.type = 'sine';
    shimmer.frequency.value = 1318.5; // E6
    const shimmerGain = offlineCtx.createGain();
    shimmerGain.gain.setValueAtTime(0, 0);
    shimmerGain.gain.linearRampToValueAtTime(0.06, 0.8);
    shimmerGain.gain.exponentialRampToValueAtTime(0.001, 2.0);
    shimmer.connect(shimmerGain).connect(offlineCtx.destination);
    shimmer.start(0.3);
    shimmer.stop(2.2);

    const renderedBuffer = await offlineCtx.startRendering();
    return audioBufferToWav(renderedBuffer);
  } catch (error) {
    console.warn('Premium jingle generation failed:', error);
    return null;
  }
}

/**
 * Generate a silence WAV for transition before Chapter 1.
 */
async function generateSilenceWav(durationSec: number = 2): Promise<Blob | null> {
  try {
    const sampleRate = 44100;
    const length = sampleRate * durationSec;
    const offlineCtx = new OfflineAudioContext(1, length, sampleRate);
    const renderedBuffer = await offlineCtx.startRendering();
    return audioBufferToWav(renderedBuffer);
  } catch (error) {
    console.warn('Silence generation failed:', error);
    return null;
  }
}

// ─── WAV encoding ───

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
  view.setUint16(20, 1, true);
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

// ─── Public API ───

/**
 * Generate the IMMERSIVE intro jingle (for in-browser playback).
 * Returns blobs played sequentially:
 *   [0] WAV ambiance sonore (3s — ding-dong gare)
 *   [1] MP3 TTS: Présentation officielle
 *   [2] MP3 TTS: Extrait teaser (50 mots)
 *   [3] MP3 TTS: "Attachez vos ceintures..."
 *   [4] WAV silence (2s transition)
 * 
 * Uses the SAME Azure voice throughout for coherence.
 */
export async function generateIntroJingle(
  generateTts: (text: string) => Promise<Blob | null>,
  ebookTitle?: string,
  authorName?: string,
  introductionText?: string,
  genre?: string
): Promise<Blob[]> {
  const introBlobs: Blob[] = [];

  // 1. Ambiance sonore (3s WAV — ding-dong type gare/aéroport)
  const jingleBlob = await generatePremiumJingle();
  if (jingleBlob) {
    introBlobs.push(jingleBlob);
  }

  // 2-4. TTS segments (même voix Azure pour cohérence)
  const segments = buildPremiumIntroScript({ ebookTitle, authorName, introductionText, genre });
  for (const segment of segments) {
    const ttsBlob = await generateTts(segment);
    if (ttsBlob && ttsBlob.size > 0) {
      introBlobs.push(ttsBlob);
    }
  }

  // 5. Transition silence (2s WAV)
  const silenceBlob = await generateSilenceWav(2);
  if (silenceBlob) {
    introBlobs.push(silenceBlob);
  }

  return introBlobs;
}

/**
 * Generate intro for file export (MP3-only, no WAV segments).
 * TTS segments only — compatible with MP3 concatenation.
 */
export async function generateIntroForExport(
  generateTts: (text: string) => Promise<Blob | null>,
  ebookTitle?: string,
  authorName?: string,
  introductionText?: string,
  genre?: string
): Promise<Blob[]> {
  const introBlobs: Blob[] = [];

  const segments = buildPremiumIntroScript({ ebookTitle, authorName, introductionText, genre });
  for (const segment of segments) {
    const ttsBlob = await generateTts(segment);
    if (ttsBlob && ttsBlob.size > 0) {
      introBlobs.push(ttsBlob);
    }
  }

  // Silence de transition (2s via TTS)
  const silenceBlob = await generateTts('...');
  if (silenceBlob && silenceBlob.size > 0) {
    introBlobs.push(silenceBlob);
  }

  return introBlobs;
}

export { DEFAULT_INTRO_TEXT as INTRO_TEXT };
