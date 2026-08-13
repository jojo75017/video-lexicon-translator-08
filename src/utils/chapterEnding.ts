/**
 * Contrôle des fins de chapitre.
 *
 * Un chapitre publié ne peut pas se terminer par un mot isolé, une phrase sans
 * ponctuation finale, une virgule ou un tiret orphelin. Ce module détecte ces
 * fins bancales (de manière déterministe, sans IA) et sert de garde-fou après
 * la passe de complétion demandée au modèle.
 */

export interface EndingCheck {
  incomplete: boolean;
  /** Raison lisible, affichée à l'auteur. */
  reason?: string;
  /** Dernière ligne non vide du chapitre. */
  lastLine: string;
}

const CLOSERS = /[»"'’)\]]+$/u;

/** Retire les guillemets / parenthèses fermantes pour examiner la vraie ponctuation. */
function stripClosers(s: string): string {
  return s.replace(CLOSERS, '').trim();
}

function lastNonEmptyLine(text: string): string {
  const lines = (text || '').replace(/\r\n/g, '\n').split('\n');
  for (let i = lines.length - 1; i >= 0; i--) {
    const l = lines[i].trim();
    if (l) return l;
  }
  return '';
}

/** Analyse la fin d'un chapitre. */
export function checkEnding(text: string): EndingCheck {
  const lastLine = lastNonEmptyLine(text);
  if (!lastLine) return { incomplete: true, reason: 'Chapitre vide', lastLine: '' };

  const core = stripClosers(lastLine);

  // Ponctuation d'attente ou de liaison : la phrase n'est pas achevée.
  if (/[,;:]$/.test(core)) {
    return { incomplete: true, reason: 'La dernière phrase se termine par une virgule ou un deux-points', lastLine };
  }
  if (/[-–—]$/.test(core)) {
    return { incomplete: true, reason: 'La dernière phrase se termine par un tiret', lastLine };
  }
  // Un tiret de dialogue ouvert sans réplique.
  if (/^[-–—]\s*\S{0,3}$/.test(core)) {
    return { incomplete: true, reason: 'Tiret de dialogue sans réplique', lastLine };
  }

  const endsWithSentencePunct = /[.!?…]$/.test(core);
  if (!endsWithSentencePunct) {
    return { incomplete: true, reason: 'La dernière phrase ne se termine pas par un point', lastLine };
  }

  // Dernière phrase réduite à un mot (« Fin », « Silence »…) : à compléter.
  const sentences = core.split(/(?<=[.!?…])\s+/).filter(Boolean);
  const last = sentences[sentences.length - 1] || core;
  const words = last.replace(/[^\p{L}\p{N}'’\s-]/gu, ' ').trim().split(/\s+/).filter(Boolean);
  if (words.length < 3) {
    return { incomplete: true, reason: 'Le chapitre se termine par un mot isolé', lastLine };
  }

  return { incomplete: false, lastLine };
}

/** Raccourci booléen. */
export function isIncompleteEnding(text: string): boolean {
  return checkEnding(text).incomplete;
}

/**
 * Dernier paragraphe du chapitre : c'est le seul fragment envoyé au modèle
 * pour la phrase de clôture (contexte suffisant, coût minimal).
 */
export function lastParagraph(text: string, maxChars = 1200): string {
  const paras = (text || '').replace(/\r\n/g, '\n').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const last = paras[paras.length - 1] || (text || '').trim();
  return last.length > maxChars ? last.slice(last.length - maxChars) : last;
}

/**
 * Remplace le dernier paragraphe par sa version complétée, en conservant
 * exactement le reste du chapitre.
 */
export function replaceLastParagraph(text: string, replacement: string): string {
  const normalized = (text || '').replace(/\r\n/g, '\n');
  const paras = normalized.split(/\n\s*\n/);
  for (let i = paras.length - 1; i >= 0; i--) {
    if (paras[i].trim()) {
      paras[i] = replacement.trim();
      return paras.join('\n\n').trim();
    }
  }
  return replacement.trim();
}
