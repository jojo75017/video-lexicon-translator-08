/**
 * Préfixes de routes où les éléments d'acquisition (pop-up, bandeau, CTA flottant)
 * ne doivent PAS apparaître : app interne, checkout, confirmation, espaces gérés.
 * Centralisé pour éviter les divergences entre composants.
 */
export const MARKETING_EXCLUDED_PREFIXES = [
  '/dashboard',
  '/ebook',
  '/admin',
  '/commander',
  '/commande',
  '/paiement',
  '/confirmation',
  '/merci',
  '/audit-pilot',
  '/gestion-prospects',
  '/crm',
  '/auth',
  '/demo',
  '/espace',
  '/v3',
  '/10-niches-offertes',
  '/methode',
];

export const isMarketingExcluded = (pathname: string): boolean =>
  MARKETING_EXCLUDED_PREFIXES.some((p) => pathname.startsWith(p));

/** Détecte les pages destinées aux francophones expatriés. */
export const isExpatPath = (pathname: string): boolean =>
  pathname.startsWith('/creer-ebook-kdp-etranger') ||
  pathname.includes('etranger') ||
  pathname.includes('expatri');
