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

/**
 * Page de commande interne (unique tunnel de paiement).
 * IMPORTANT : `SITE_ORIGIN` doit toujours pointer vers le domaine principal
 * réellement rattaché au projet. ebookstudio.fr est le domaine principal.
 */
export const SITE_ORIGIN = 'https://ebookstudio.fr';
export const COMMANDER_PATH = '/commander';
export const COMMANDER_URL = `${SITE_ORIGIN}${COMMANDER_PATH}`;


/** Construit un lien de commande traçable pour les réseaux sociaux / emails. */
export function commanderUrl(src?: string, ref?: string): string {
  const params = new URLSearchParams();
  if (src) params.set('src', src);
  if (ref) params.set('ref', ref);
  const qs = params.toString();
  return qs ? `${COMMANDER_URL}?${qs}` : COMMANDER_URL;
}

/**
 * KDP Pilot — outil tiers PAYANT de suivi des données Amazon (lien partenaire).
 * Le lien est vérifié et fonctionnel. Code promo réservé aux abonnés EbookStudio :
 * 15 % de réduction sur le 1er mois ou la 1re année.
 */
export const KDP_PILOT_URL = 'https://kdp-pilot.com?fpr=georges53';
export const KDP_PILOT_PROMO_CODE = 'PROMO15';


export function openKdpPilot(): void {
  window.open(KDP_PILOT_URL, '_blank', 'noopener,noreferrer');
}

/** Redirection réservée aux pages ouvertes hors de l'aperçu intégré. */
export function leaveForKdpPilot(): void {
  window.location.href = KDP_PILOT_URL;
}

/** Chemin relais interne (le lien de suivi n'est jamais visible). */
export const KDP_PILOT_GO_PATH = '/go/kdp-pilot';
