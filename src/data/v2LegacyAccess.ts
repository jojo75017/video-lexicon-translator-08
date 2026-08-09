/**
 * Accès « ancien client V2 ».
 *
 * Les acheteurs de la V2 (accès à vie) gardent leur V2 intacte et reçoivent
 * 3 nouveautés V3 offertes à vie — pas la V3 complète. Pour aller plus loin,
 * ils bénéficient d'une remise permanente de 20 % sur Plume ou Édition.
 */

/** Remise permanente réservée aux acheteurs V2. */
export const V2_LEGACY_DISCOUNT = 0.2;

/** Les 3 nouveautés V3 offertes à vie aux acheteurs V2. */
export const V2_LEGACY_MODULES = [
  {
    key: 'genie',
    title: 'Ebookstudio-Génie + Sommaire IA',
    to: '/v3/create',
    description:
      "Décrivez votre idée en une phrase : le Génie remplit la fiche du livre et construit le sommaire avec vous.",
  },
  {
    key: 'corriger',
    title: 'Correcteur de livre',
    to: '/v3/corriger',
    description:
      "Importez votre manuscrit : correction stricte, français garanti, aucune phrase inventée.",
  },
  {
    key: 'export-premium',
    title: 'Export premium',
    to: '/v3/create',
    description:
      "Sommaire stylé (fond crème, filets dorés), titres de chapitres nettoyés, pagination propre.",
  },
] as const;

/** Routes débloquées pour un ancien client V2 (hors forfait payant). */
export const V2_LEGACY_UNLOCKED_PATHS = new Set<string>([
  '/v3/migration',
  '/v3/create',
  '/v3/corriger',
]);

/** Quotas de la version offerte. */
export const V2_LEGACY_QUOTAS = {
  booksPerMonth: 2,
  chaptersMax: 20,
  wordsPerChapter: 3000,
};

/** Ce qui reste réservé aux forfaits payants. */
export const V2_LEGACY_EXCLUSIONS = [
  'Audiolivre',
  'Cover Studio Pro (300 DPI)',
  'Traductions 10 langues',
  'BD Studio Pro',
  'Mode Recherche Approfondie',
  'Amazon Spy · Audit ASIN · 600 niches',
];

/** Prix remisé (-20 %) arrondi au centime. */
export function legacyPrice(amount: number): number {
  return Math.round(amount * (1 - V2_LEGACY_DISCOUNT) * 100) / 100;
}

export function isLegacyUnlockedPath(pathname: string): boolean {
  return V2_LEGACY_UNLOCKED_PATHS.has(pathname);
}
