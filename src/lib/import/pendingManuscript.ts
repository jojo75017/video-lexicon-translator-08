/**
 * Manuscrit importé en attente d'une action (rédaction IA ou correction).
 * Stocké en localStorage pour passer de l'Import Studio à « Corriger mon livre »
 * sans redemander le fichier à l'auteur.
 */
import type { Manuscript } from '@/lib/bookperfect/types';

const KEY = 'v3_manuscript_to_correct_v1';
/** Au-delà de 24 h, on considère l'import comme périmé. */
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

export function savePendingManuscript(m: Manuscript) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ savedAt: Date.now(), manuscript: m }));
  } catch {
    /* quota dépassé (très long manuscrit) : on ignore */
  }
}

export function readPendingManuscript(): Manuscript | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { savedAt?: number; manuscript?: Manuscript };
    if (!parsed?.manuscript?.chapters?.length) return null;
    if (parsed.savedAt && Date.now() - parsed.savedAt > MAX_AGE_MS) {
      clearPendingManuscript();
      return null;
    }
    return parsed.manuscript;
  } catch {
    return null;
  }
}

export function clearPendingManuscript() {
  try { localStorage.removeItem(KEY); } catch { /* noop */ }
}
