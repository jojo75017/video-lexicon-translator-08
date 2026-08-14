/**
 * Relevé de cohérence du livre, construit avant la correction.
 *
 * Objectif : qu'un même personnage ne soit pas écrit « Elias » au chapitre 2 et
 * « Élias » au chapitre 9, et que le temps narratif dominant serve de référence
 * à toutes les passes. Analyse 100 % locale (aucun appel IA, aucun crédit).
 */

export interface BookContext {
  title?: string;
  /** Noms propres retenus (orthographe majoritaire). */
  names: string[];
  /** Lieux repérés (« à Verdon », « de Sainte-Colombe »…). */
  places: string[];
  /** Temps narratif dominant. */
  tense?: 'passé simple / imparfait' | 'présent';
  /** Point de vue narratif dominant. */
  pov?: 'première personne' | 'troisième personne';
}

export interface NameInconsistency {
  retained: string;
  variants: string[];
}

/** Mots fréquents en début de phrase, jamais des noms propres. */
const STOP = new Set([
  'Le', 'La', 'Les', 'Un', 'Une', 'Des', 'Du', 'De', 'Il', 'Elle', 'Ils', 'Elles',
  'Je', 'Tu', 'Nous', 'Vous', 'On', 'Ce', 'Cet', 'Cette', 'Ces', 'Son', 'Sa', 'Ses',
  'Mon', 'Ma', 'Mes', 'Ton', 'Ta', 'Tes', 'Leur', 'Leurs', 'Notre', 'Votre',
  'Et', 'Mais', 'Or', 'Car', 'Donc', 'Puis', 'Quand', 'Lorsque', 'Alors', 'Ainsi',
  'Après', 'Avant', 'Depuis', 'Dans', 'Sur', 'Sous', 'Pour', 'Par', 'Avec', 'Sans',
  'Pourtant', 'Cependant', 'Enfin', 'Jamais', 'Toujours', 'Rien', 'Tout', 'Toute',
  'Tous', 'Toutes', 'Plus', 'Moins', 'Aucun', 'Chaque', 'Quelque', 'Quelques',
  'Chapitre', 'Partie', 'Prologue', 'Épilogue', 'Elle', 'Oui', 'Non', 'Peut',
  'Que', 'Qui', 'Quoi', 'Comme', 'Si', 'Là', 'Ici', 'Encore', 'Déjà', 'Bien',
]);

/** Retire les accents pour comparer deux graphies d'un même nom. */
const fold = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const PLACE_HINT = /\b(?:à|au|aux|de|du|des|dans|vers|jusqu'à|depuis)\s+((?:[A-ZÀÂÄÉÈÊËÎÏÔÖÙÛÜÇ][\p{L}'’-]+)(?:[- ](?:[A-ZÀÂÄÉÈÊËÎÏÔÖÙÛÜÇ][\p{L}'’-]+))*)/gu;

/**
 * Construit le relevé du livre et signale les noms écrits de plusieurs façons.
 */
export function buildBookContext(
  chapters: Array<{ title: string; original: string }>,
  bookTitle?: string,
): { context: BookContext; inconsistencies: NameInconsistency[] } {
  const text = chapters.map((c) => c.original || '').join('\n\n');

  // --- Noms propres : mots capitalisés hors début de phrase, comptés par graphie.
  const counts = new Map<string, number>();
  const sentences = text.split(/(?<=[.!?…»])\s+/);
  for (const sentence of sentences) {
    const words = sentence.match(/[\p{Lu}][\p{L}'’-]+/gu) || [];
    words.forEach((w, i) => {
      // Le premier mot d'une phrase est capitalisé par nature : trop ambigu.
      if (i === 0 && sentence.trim().startsWith(w)) return;
      if (STOP.has(w) || w.length < 3) return;
      counts.set(w, (counts.get(w) || 0) + 1);
    });
  }

  // Regroupement par graphie « pliée » : Elias / Élias / ELIAS.
  const groups = new Map<string, Map<string, number>>();
  counts.forEach((n, w) => {
    if (n < 2) return;
    const key = fold(w);
    const g = groups.get(key) || new Map<string, number>();
    g.set(w, (g.get(w) || 0) + n);
    groups.set(key, g);
  });

  const ranked: Array<{ name: string; count: number; variants: string[] }> = [];
  const inconsistencies: NameInconsistency[] = [];
  groups.forEach((g) => {
    const entries = [...g.entries()].sort((a, b) => b[1] - a[1]);
    const total = entries.reduce((s, e) => s + e[1], 0);
    const retained = entries[0][0];
    const variants = entries.slice(1).map((e) => e[0]);
    ranked.push({ name: retained, count: total, variants });
    if (variants.length) inconsistencies.push({ retained, variants });
  });

  ranked.sort((a, b) => b.count - a.count);
  const names = ranked.slice(0, 60).map((r) => r.name);

  // --- Lieux : noms propres introduits par une préposition de lieu.
  const placeCounts = new Map<string, number>();
  for (const m of text.matchAll(PLACE_HINT)) {
    const raw = (m[1] || '').trim();
    if (!raw || STOP.has(raw)) continue;
    placeCounts.set(raw, (placeCounts.get(raw) || 0) + 1);
  }
  const places = [...placeCounts.entries()]
    .filter(([, n]) => n >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 40)
    .map(([p]) => p);

  // --- Temps narratif dominant.
  const past = (text.match(/\b\p{L}+(?:èrent|irent|ait|aient|urent)\b/gu) || []).length;
  const present = (text.match(/\b(?:est|sont|va|vont|dit|prend|regarde|marche)\b/gi) || []).length;
  const tense: BookContext['tense'] = past >= present ? 'passé simple / imparfait' : 'présent';

  // --- Point de vue dominant.
  const first = (text.match(/\bje\b|\bj’|\bj'/gi) || []).length;
  const third = (text.match(/\b(?:il|elle|ils|elles)\b/gi) || []).length;
  const pov: BookContext['pov'] = first > third * 0.6 ? 'première personne' : 'troisième personne';

  return {
    context: { title: bookTitle, names, places, tense, pov },
    inconsistencies,
  };
}
