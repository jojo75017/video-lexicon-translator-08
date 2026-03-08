/**
 * Generates the audiobook PREMIUM intro:
 * 
 * Structure (Position 0 — avant le Chapitre 1) :
 * 1. Ouverture Musicale : Jingle/nappe sonore de 3 secondes (Web Audio API → WAV)
 * 2. Annonce Marque : "Vous êtes bien sur EbookStudio 2026."
 * 3. Crédits Auteur : "Ce livre audio est rédigé par {AUTEUR}."
 * 4. Annonce Titre : "Nous avons le plaisir de vous présenter : {TITRE}."
 * 5. Extrait Mise en Bouche : 50 mots max tirés de l'introduction
 * 6. Transition : Silence de 2 secondes avant le Chapitre 1
 * 
 * Returns an array of blobs to be played SEQUENTIALLY (bell=WAV, rest=MP3).
 */

export interface IntroPremiumOptions {
  ebookTitle?: string;
  authorName?: string;
  introductionText?: string;
  genre?: string;
}

// ─── Phrases de clôture par genre ───

const CLOSING_PHRASES: Record<string, string> = {
  'enfants-3-6': 'Installez-vous confortablement, et laissez la magie opérer.',
  'enfants-6-12': 'Préparez-vous pour une aventure incroyable. C\'est parti !',
  'thriller': 'Éteignez les lumières, et préparez-vous à retenir votre souffle.',
  'romance': 'Laissez-vous emporter par cette histoire, et ouvrez grand votre cœur.',
  'spiritualite': 'Respirez profondément, et laissez ces mots guider votre chemin intérieur.',
  'business': 'Prenez des notes, et transformez ces idées en résultats concrets.',
  'histoire': 'Voyagez dans le temps, et découvrez les secrets du passé.',
  'default': 'Bonne écoute, et laissez-vous porter par cette aventure.',
};

function getClosingPhrase(genre?: string): string {
  if (genre && CLOSING_PHRASES[genre]) {
    return CLOSING_PHRASES[genre];
  }
  return CLOSING_PHRASES['default'];
}

// ─── Premium intro script builder ───

function buildPremiumIntroScript(options: IntroPremiumOptions): string[] {
  const title = options.ebookTitle?.trim() || 'votre livre audio';
  const author = options.authorName?.trim() || 'l\'auteur';
  const extract = extractFirst50Words(options.introductionText || '');

  const segments: string[] = [];

  // Segment 1: Annonce de la Marque
  segments.push(`Vous êtes bien sur EbookStudio 2026.`);

  // Segment 2: Crédits Auteur
  segments.push(`Ce livre audio est rédigé par ${author}.`);

  // Segment 3: Annonce du Titre
  segments.push(`Nous avons le plaisir de vous présenter : ${title}.`);

  // Segment 4: Extrait de Mise en Bouche (50 mots max)
  if (extract) {
    segments.push(extract);
  }

  // Segment 5: Phrase de clôture adaptée au genre
  segments.push(getClosingPhrase(options.genre));

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
  
  // If no complete sentence found, take the whole chunk and end cleanly
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
  return segments.join('\n\n');
}

// ─── Legacy flat intro text (kept for backward compatibility) ───

const DEFAULT_INTRO_TEXT = "Vous êtes bien sur EbookStudio 2026. Ce livre audio est rédigé par {AUTEUR}. Nous avons le plaisir de vous présenter : {TITRE}.";

function buildIntroText(ebookTitle?: string, authorName?: string): string {
  const title = ebookTitle?.trim() || 'votre livre audio';
  const author = authorName?.trim() || 'l\'auteur';
  return DEFAULT_INTRO_TEXT.replace('{TITRE}', title).replace('{AUTEUR}', author);
}

// ─── Audio generation (Web Audio API) ───

/**
 * Generate a professional opening jingle using Web Audio API.
 * Duration: 3 seconds (as specified).
 * Returns a WAV Blob.
 */
async function generatePremiumJingle(): Promise<Blob | null> {
  try {
    const sampleRate = 44100;
    const duration = 3.0; // 3 seconds as requested
    const length = sampleRate * duration;
    const offlineCtx = new OfflineAudioContext(1, length, sampleRate);

    // Rich warm pad — Fundamental (C4 = 261 Hz)
    const osc1 = offlineCtx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = 261.63;
    const gain1 = offlineCtx.createGain();
    gain1.gain.setValueAtTime(0, 0);
    gain1.gain.linearRampToValueAtTime(0.35, 0.4); // fade in
    gain1.gain.setValueAtTime(0.35, duration - 0.8);
    gain1.gain.exponentialRampToValueAtTime(0.001, duration);
    osc1.connect(gain1).connect(offlineCtx.destination);
    osc1.start(0);
    osc1.stop(duration);

    // Harmonic sparkle (E5 = 659 Hz)
    const osc2 = offlineCtx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = 659.25;
    const gain2 = offlineCtx.createGain();
    gain2.gain.setValueAtTime(0, 0);
    gain2.gain.linearRampToValueAtTime(0.2, 0.3);
    gain2.gain.exponentialRampToValueAtTime(0.001, duration * 0.7);
    osc2.connect(gain2).connect(offlineCtx.destination);
    osc2.start(0);
    osc2.stop(duration);

    // Bell chime accent (G5 = 784 Hz) — delayed start for "ding" effect
    const osc3 = offlineCtx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.value = 783.99;
    const gain3 = offlineCtx.createGain();
    gain3.gain.setValueAtTime(0, 0);
    gain3.gain.setValueAtTime(0, 0.15);
    gain3.gain.linearRampToValueAtTime(0.25, 0.25);
    gain3.gain.exponentialRampToValueAtTime(0.001, duration * 0.5);
    osc3.connect(gain3).connect(offlineCtx.destination);
    osc3.start(0);
    osc3.stop(duration);

    // High shimmer (C6 = 1046 Hz) — soft ethereal touch
    const osc4 = offlineCtx.createOscillator();
    osc4.type = 'sine';
    osc4.frequency.value = 1046.5;
    const gain4 = offlineCtx.createGain();
    gain4.gain.setValueAtTime(0, 0);
    gain4.gain.linearRampToValueAtTime(0.08, 0.5);
    gain4.gain.exponentialRampToValueAtTime(0.001, duration * 0.6);
    osc4.connect(gain4).connect(offlineCtx.destination);
    osc4.start(0);
    osc4.stop(duration);

    const renderedBuffer = await offlineCtx.startRendering();
    return audioBufferToWav(renderedBuffer);
  } catch (error) {
    console.warn('Premium jingle generation failed:', error);
    return null;
  }
}

/**
 * Generate a 2-second silence WAV for transition before Chapter 1.
 */
async function generateSilenceWav(durationSec: number = 2): Promise<Blob | null> {
  try {
    const sampleRate = 44100;
    const length = sampleRate * durationSec;
    const offlineCtx = new OfflineAudioContext(1, length, sampleRate);
    // No oscillators → pure silence
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

// ─── Public API ───

/**
 * Generate the PREMIUM intro jingle (for in-browser playback).
 * Returns blobs that MUST be played sequentially:
 *   [0] WAV jingle (3s)
 *   [1..N] MP3 TTS segments (brand, author, title, extract)
 *   [N+1] WAV silence (2s transition)
 * 
 * The generateTts function should use the SAME voice as the book.
 */
export async function generateIntroJingle(
  generateTts: (text: string) => Promise<Blob | null>,
  ebookTitle?: string,
  authorName?: string,
  introductionText?: string
): Promise<Blob[]> {
  const introBlobs: Blob[] = [];

  // 1. Opening jingle (3s WAV)
  const jingleBlob = await generatePremiumJingle();
  if (jingleBlob) {
    introBlobs.push(jingleBlob);
  }

  // 2-5. TTS segments (same voice as book)
  const segments = buildPremiumIntroScript({ ebookTitle, authorName, introductionText });
  for (const segment of segments) {
    const ttsBlob = await generateTts(segment);
    if (ttsBlob && ttsBlob.size > 0) {
      introBlobs.push(ttsBlob);
    }
  }

  // 6. Transition silence (2s WAV)
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
  introductionText?: string
): Promise<Blob[]> {
  const introBlobs: Blob[] = [];

  const segments = buildPremiumIntroScript({ ebookTitle, authorName, introductionText });
  for (const segment of segments) {
    const ttsBlob = await generateTts(segment);
    if (ttsBlob && ttsBlob.size > 0) {
      introBlobs.push(ttsBlob);
    }
  }

  // Add a TTS silence for transition
  const silenceBlob = await generateTts('...');
  if (silenceBlob && silenceBlob.size > 0) {
    introBlobs.push(silenceBlob);
  }

  return introBlobs;
}

export { DEFAULT_INTRO_TEXT as INTRO_TEXT };
