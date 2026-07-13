// Promo d'été — source unique de vérité pour le prix de l'offre de base.
// Baisse saisonnière 67€ → 59€ jusqu'au 31 août 2026 (23h59, Europe/Paris).
//
// Pour rétablir le tarif normal après le 31 août :
//  - remettre PROMO_PRICE = 67 ici (l'affichage repasse automatiquement)
//  - ET remettre les montants dans les 2 edge functions de paiement :
//      supabase/functions/stripe-checkout/index.ts       (pro_lifetime.amount : 5900 → 6700)
//      supabase/functions/create-promo-checkout/index.ts (AMOUNT_EUR : 59 → 67)

/** Prix de vente actuel (promo d'été). */
export const PROMO_PRICE = 59;

/** Prix normal, affiché barré à côté du prix promo. */
export const REGULAR_PRICE = 67;

/** Fin de la promo : 31 août 2026, 23h59 heure de Paris (UTC+2 en été). */
export const PROMO_END = new Date("2026-08-31T23:59:59+02:00");

/** true tant que la promo d'été est en cours. */
export function isPromoActive(): boolean {
  return Date.now() < PROMO_END.getTime();
}

/** Prix à afficher/facturer selon l'état de la promo. */
export function currentPrice(): number {
  return isPromoActive() ? PROMO_PRICE : REGULAR_PRICE;
}
