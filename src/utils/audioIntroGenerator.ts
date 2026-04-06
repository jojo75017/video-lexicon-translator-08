/**
 * Generates a simple, professional audiobook intro:
 * "{Titre}, par {Auteur}."
 */

export interface IntroPremiumOptions {
  ebookTitle?: string;
  authorName?: string;
  introductionText?: string;
  genre?: string;
}

function buildIntroSegment(options: IntroPremiumOptions): string {
  const title = options.ebookTitle?.trim() || 'votre livre audio';
  const author = options.authorName?.trim() || 'l\'auteur';
  return `${title}, par ${author}.`;
}

/**
 * Build intro display text (for preview in the UI).
 */
export function buildIntroDisplayText(options: IntroPremiumOptions): string {
  return buildIntroSegment(options);
}

/**
 * Generate intro for file export — single TTS segment: "{Titre}, par {Auteur}."
 */
export async function generateIntroForExport(
  generateTts: (text: string) => Promise<Blob | null>,
  ebookTitle?: string,
  authorName?: string,
  _introductionText?: string,
  _genre?: string
): Promise<Blob[]> {
  const introText = buildIntroSegment({ ebookTitle, authorName });
  const blob = await generateTts(introText);
  if (blob && blob.size > 0) {
    return [blob];
  }
  return [];
}

/**
 * Generate intro jingle for in-browser playback — same as export (no more jingle/silence).
 */
export async function generateIntroJingle(
  generateTts: (text: string) => Promise<Blob | null>,
  ebookTitle?: string,
  authorName?: string,
  _introductionText?: string,
  _genre?: string
): Promise<Blob[]> {
  return generateIntroForExport(generateTts, ebookTitle, authorName);
}

export const INTRO_TEXT = "{TITRE}, par {AUTEUR}.";
