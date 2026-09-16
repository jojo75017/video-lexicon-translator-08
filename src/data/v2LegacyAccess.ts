/**
 * Accès « ancien client V2 ».
 *
 * Les acheteurs de la V2 (accès à vie) gardent leur V2 intacte et reçoivent
 * 5 nouveautés V3 offertes à vie — pas la V3 complète. Pour aller plus loin,
 * ils bénéficient d'une remise permanente de 20 % sur Plume ou Édition.
 */

/** Remise permanente réservée aux acheteurs V2. */
export { V2_LEGACY_DISCOUNT, legacyPrice } from '@/data/v3Pricing';

/** Les 5 nouveautés V3 offertes à vie aux acheteurs V2. */
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
  {
    key: 'ia-byok',
    title: "Discussion avec l'IA",
    to: '/v3/discuter-ia',
    description:
      "Discutez librement avec Gemini, ChatGPT, Claude ou OpenRouter grâce à votre propre clé.",
  },
  {
    key: 'demarrage-idees',
    title: "Kit de démarrage et idées",
    to: '/v3/kit-demarrage',
    description:
      "Trouvez une idée, explorez les niches proposées et préparez le démarrage de votre prochain livre.",
  },
] as const;

/** Routes débloquées pour un ancien client V2 (hors forfait payant). */
export const V2_LEGACY_UNLOCKED_PATHS = new Set<string>([
  '/v3/migration',
  '/v3/create',
  '/v3/corriger',
  '/v3/discuter-ia',
  '/v3/kit-demarrage',
  '/niches',
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

export function isLegacyUnlockedPath(pathname: string): boolean {
  return V2_LEGACY_UNLOCKED_PATHS.has(pathname);
}
