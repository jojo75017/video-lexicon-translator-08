// Promo d'été — source unique de vérité pour le prix de l'offre de base (accès à vie).
// Baisse saisonnière 59€ → 47€ jusqu'au 31 août 2026 (23h59, Europe/Paris).
//
// Pour rétablir le tarif normal après le 31 août :
//  - remettre PROMO_PRICE = 59 ici (l'affichage repasse automatiquement)
//  - ET remettre les montants dans les edge functions de paiement :
//      supabase/functions/stripe-checkout/index.ts       (pro_lifetime.amount : 4700 → 5900)
//      supabase/functions/create-promo-checkout/index.ts (AMOUNT_EUR : 47 → 59)
//      supabase/functions/v3-pack-checkout/index.ts      (v2_1x / v2_2x / v2_3x)

/** Prix de vente actuel (promo d'été). */
export const PROMO_PRICE = 47;

/** Prix normal, affiché barré à côté du prix promo. */
export const REGULAR_PRICE = 59;

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
