/**
 * Adresse de retour de Stripe après un paiement réussi.
 *
 * La page « Merci » est une route publique : elle s'affiche dès que Stripe
 * renvoie le client, même s'il n'est pas connecté. Elle ne doit jamais
 * pointer sur une adresse reprise par un alias de navigation (l'ancien
 * /v3/offres/merci renvoyait sur la page des tarifs, pas sur un remerciement).
 */
export const THANK_YOU_PATH = '/merci';

/** Marqueur remplacé par Stripe dans l'URL de retour. */
export const STRIPE_SESSION_PLACEHOLDER = '{CHECKOUT_SESSION_ID}';

export function stripeThankYouUrl(origin: string, planLabel: string): string {
  return `${origin}${THANK_YOU_PATH}?session_id=${STRIPE_SESSION_PLACEHOLDER}&plan=${encodeURIComponent(planLabel)}`;
}
