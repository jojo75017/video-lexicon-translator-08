/**
 * Flag global de lancement V3.
 *
 * Tant que `V3_LAUNCH_UNLOCKED = false` :
 *  - Les visiteurs et abonnés V2 ne peuvent voir QUE :
 *      /v3            (page d'accueil V3)
 *      /v3/pourquoi   (page "Pourquoi EbookStudio V3")
 *      /v3/offre      (page de présentation de l'offre + pré-inscription)
 *  - Toutes les autres routes /v3/* redirigent vers /v3/offre.
 *  - Les paiements Stripe/PayPal V3 sont désactivés.
 *  - Les admins (getIsCurrentSessionAdmin) gardent l'accès complet
 *    pour préparer et tester.
 *
 * Le 1er octobre 2026 : basculer sur `true`, republier.
 */
export const V3_LAUNCH_UNLOCKED = false;

/** Date d'ouverture publique de la V3 (utilisée pour le compte à rebours). */
export const V3_LAUNCH_DATE_ISO = "2026-10-01T08:00:00+02:00";

/** Routes V3 accessibles avant l'ouverture. */
export const V3_PUBLIC_PREVIEW_PATHS = new Set<string>([
  "/v3",
  "/v3/pourquoi",
  "/v3/realite-kdp",
  "/v3/offre",
  "/v3/auth",
  "/v3/temoignage",
  "/v3/migration",
]);
