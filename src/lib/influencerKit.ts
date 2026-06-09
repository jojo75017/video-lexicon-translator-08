// Kit Influenceurs — modèle financier centralisé
// Prix actuel : 67€ (jusqu'au 1er octobre 2026). Bascule V3 : 197€ dès octobre.
// Tout le kit (page publique, simulateur, message d'approche, PDF) lit ces valeurs.

export const COMMISSION_RATE = 0.30;

// Date de bascule du prix V2 (67€) vers le prix V3 (197€).
export const V3_PRICE_SWITCH_DATE = new Date('2026-10-01T00:00:00+02:00');

export const PRICE_NOW = 67;   // V2 actuelle
export const PRICE_V3 = 197;   // V3 "Publication Assistée Pro" dès octobre

export const COMMISSION_NOW = Math.round(PRICE_NOW * COMMISSION_RATE * 100) / 100; // 20.10
export const COMMISSION_V3 = Math.round(PRICE_V3 * COMMISSION_RATE * 100) / 100;   // 59.10

export const isV3PriceActive = (): boolean =>
  Date.now() >= V3_PRICE_SWITCH_DATE.getTime();

/** Prix de vente en vigueur selon la date. */
export const getActivePrice = (): number =>
  isV3PriceActive() ? PRICE_V3 : PRICE_NOW;

/** Commission par vente en vigueur selon la date. */
export const getActiveCommission = (): number =>
  isV3PriceActive() ? COMMISSION_V3 : COMMISSION_NOW;

export const formatEuro = (n: number): string =>
  n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '\u00A0€';

export const ORIGIN = 'https://ebookstudio.fr';
