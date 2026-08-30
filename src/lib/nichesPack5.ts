import { niches600, niches600Categories, type Niche600 } from '@/data/niches600';

/**
 * Pack cadeau « 5 niches offertes ».
 *
 * Extraction strictement déterministe depuis la base réelle des 600 niches :
 * une niche par catégorie parmi les 5 catégories les plus vendeuses sur Amazon KDP,
 * en privilégiant le meilleur potentiel puis la concurrence la plus faible.
 * Aucune donnée inventée, aucun Math.random.
 */

/** Les 5 catégories retenues pour le cadeau. */
const PACK_CATEGORIES: string[] = ['devperso', 'finance', 'sante', 'cuisine', 'jeunesse'];

const CONCURRENCE_RANK: Record<Niche600['concurrence'], number> = {
  Faible: 0,
  'Modérée': 1,
  'Élevée': 2,
};

export const NICHES_5_LEAD_MAGNET = 'niches5-bonus';
export const NICHES_5_EMAIL_KEY = 'ebs_niches5_email';
export const NICHES_5_PATH = '/cadeau';

export interface Niche5 extends Niche600 {
  /** Libellé lisible de la catégorie, ex. « 💰 Finance & Business ». */
  categoryLabel: string;
  /** Angle de livre conseillé, dérivé de la sous-niche et du mot-clé réels. */
  angle: string;
}

function labelFor(categoryKey: string): string {
  const found = niches600Categories.find((c) => c.key === categoryKey);
  return found ? found.label : categoryKey;
}

/** Retourne les 5 niches du cadeau, toujours dans le même ordre. */
export function getNiches5Pack(): Niche5[] {
  const pack: Niche5[] = [];

  for (const key of PACK_CATEGORIES) {
    const candidates = niches600.filter((n) => n.category === key);
    if (candidates.length === 0) continue;

    const best = [...candidates].sort((a, b) => {
      if (b.potentiel !== a.potentiel) return b.potentiel - a.potentiel;
      const ca = CONCURRENCE_RANK[a.concurrence];
      const cb = CONCURRENCE_RANK[b.concurrence];
      if (ca !== cb) return ca - cb;
      return a.bsrCible - b.bsrCible;
    })[0];

    pack.push({
      ...best,
      categoryLabel: labelFor(key),
      angle: `Un livre centré sur « ${best.sousNiche} », positionné sur le mot-clé « ${best.motCleAmazon} ».`,
    });
  }

  return pack;
}

/** Nombre de niches restantes dans la base complète (argument de valeur). */
export function remainingNiches5Count(): number {
  return Math.max(0, niches600.length - getNiches5Pack().length);
}

/** Mémorise l'email inscrit : il déverrouille les bonus tout de suite. */
export function rememberNiches5Email(email: string): void {
  try {
    localStorage.setItem(NICHES_5_EMAIL_KEY, email.trim().toLowerCase());
  } catch {
    // stockage indisponible (navigation privée) — le lien direct reste utilisable
  }
}

export function readNiches5Email(): string | null {
  try {
    return localStorage.getItem(NICHES_5_EMAIL_KEY);
  } catch {
    return null;
  }
}
