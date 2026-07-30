/**
 * Liens externes officiels utilisés dans l'app V3.
 * Centralisés ici pour garantir la cohérence (une seule source de vérité).
 */
export const BLOG_URL = 'https://ebookstudio.blog/#accueil';
export const BLOG_LABEL = 'Blog EbookStudio';

/**
 * 1TPE — MIS EN VEILLE.
 * Le lien est conservé mais aucun bouton ne doit s'afficher tant que
 * TPE_ENABLED reste à `false`. Passer à `true` pour le réactiver.
 */
export const TPE_ENABLED = false;
export const V2_PURCHASE_LINK_TPE = 'https://www.trafic-affiliation.com/ebookstudiopv';

/** Page de commande interne (unique tunnel de paiement de l'offre 59 €). */
export const COMMANDER_PATH = '/commander';
export const COMMANDER_URL = 'https://www.ebookstudio.fr/commander';

/** Construit un lien de commande traçable pour les réseaux sociaux / emails. */
export function commanderUrl(src?: string, ref?: string): string {
  const params = new URLSearchParams();
  if (src) params.set('src', src);
  if (ref) params.set('ref', ref);
  const qs = params.toString();
  return qs ? `${COMMANDER_URL}?${qs}` : COMMANDER_URL;
}
