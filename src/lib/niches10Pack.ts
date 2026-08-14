import { niches600, niches600Categories, type Niche600 } from '@/data/niches600';

/**
 * Pack cadeau « 10 niches offertes ».
 *
 * Extraction strictement déterministe depuis la base réelle des 600 niches :
 * une niche par catégorie (les 10 catégories les plus vendeuses sur Amazon KDP),
 * en privilégiant le meilleur potentiel et la concurrence la plus faible.
 * Aucune donnée inventée, aucun Math.random.
 */

/** Les 10 catégories retenues pour le pack (sur les 12 disponibles). */
const PACK_CATEGORIES: string[] = [
  'romance',
  'thriller',
  'devperso',
  'finance',
  'sante',
  'cuisine',
  'jeunesse',
  'parascolaire',
  'carnets',
  'pratique',
];

const CONCURRENCE_RANK: Record<Niche600['concurrence'], number> = {
  Faible: 0,
  'Modérée': 1,
  'Élevée': 2,
};

export const NICHES_10_LEAD_MAGNET = '10-niches-offertes';
export const NICHES_10_EMAIL_KEY = 'ebs_niches10_email';
export const NICHES_10_PATH = '/10-niches-offertes';

export interface Niche10 extends Niche600 {
  /** Libellé lisible de la catégorie, ex. « 💕 Romance ». */
  categoryLabel: string;
}

function labelFor(categoryKey: string): string {
  const found = niches600Categories.find((c) => c.key === categoryKey);
  return found ? found.label : categoryKey;
}

/**
 * Retourne les 10 niches du pack, toujours dans le même ordre.
 */
export function getNiches10Pack(): Niche10[] {
  const pack: Niche10[] = [];

  for (const key of PACK_CATEGORIES) {
    const candidates = niches600.filter((n) => n.category === key);
    if (candidates.length === 0) continue;

    // Meilleur potentiel d'abord, puis concurrence la plus faible, puis BSR le plus bas.
    const best = [...candidates].sort((a, b) => {
      if (b.potentiel !== a.potentiel) return b.potentiel - a.potentiel;
      const ca = CONCURRENCE_RANK[a.concurrence];
      const cb = CONCURRENCE_RANK[b.concurrence];
      if (ca !== cb) return ca - cb;
      return a.bsrCible - b.bsrCible;
    })[0];

    pack.push({ ...best, categoryLabel: labelFor(key) });
  }

  return pack;
}

/** Nombre de niches restantes dans l'offre complète. */
export function remainingNichesCount(): number {
  return Math.max(0, niches600.length - getNiches10Pack().length);
}

/** Mémorise l'email déjà capté pour laisser la page cadeau accessible ensuite. */
export function rememberNiches10Email(email: string): void {
  try {
    localStorage.setItem(NICHES_10_EMAIL_KEY, email.trim().toLowerCase());
  } catch {
    // stockage indisponible (navigation privée) — la page reste accessible via le lien direct
  }
}

export function readNiches10Email(): string | null {
  try {
    return localStorage.getItem(NICHES_10_EMAIL_KEY);
  } catch {
    return null;
  }
}
