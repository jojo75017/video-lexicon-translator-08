/**
 * Source unique de la grille des 3 formules validée par Georges le 22/10/2026 :
 * Starter 27 € à vie / Auteur 97 € / Édition 197 € à vie.
 *
 * Règles :
 * - Accès cumulatif : un plan ouvre son niveau et tous les niveaux inférieurs.
 * - Admin = passe-partout (géré dans usePlanTier).
 * - Les droits existants (abonnés actuels, acheteurs 47 €, JVZoo, compléments
 *   achetés à l'unité) ne sont JAMAIS retirés : ce fichier ne fait qu'AJOUTER
 *   des verrous pour les comptes qui possèdent une des nouvelles formules.
 *   Un compte sans nouvelle formule (tier = null) ne voit aucun cadenas.
 */

export type V3PlanTier = 'starter' | 'auteur' | 'edition';

export const TIER_RANK: Record<V3PlanTier, number> = {
  starter: 0,
  auteur: 1,
  edition: 2,
};

export const PLAN_TIER_META: Record<V3PlanTier, { label: string; price: number; entitlement: string }> = {
  starter: { label: 'Starter', price: 27, entitlement: 'plan_starter' },
  auteur: { label: 'Auteur', price: 97, entitlement: 'plan_auteur' },
  edition: { label: 'Édition', price: 197, entitlement: 'plan_edition' },
};

/**
 * Niveau minimal requis par préfixe de route.
 * Le préfixe le plus long gagne (ex. /v3/create/album-illustre avant /v3/create).
 * Toute route non listée est ouverte dès Starter.
 */
const ROUTE_MIN_TIER: { prefix: string; tier: V3PlanTier }[] = [
  // — Édition uniquement —
  { prefix: '/v3/studio-v4', tier: 'edition' }, // Studio Couverture broché KDP complet
  { prefix: '/v3/cover-pro', tier: 'edition' }, // Cover Studio KDP Pro
  { prefix: '/v3/create/album-illustre', tier: 'edition' }, // Album illustré jeunesse 3–6 ans
  { prefix: '/v3/outils/audiobook', tier: 'edition' }, // Audiolivres

  // — Auteur et Édition —
  { prefix: '/v3/vc-books', tier: 'auteur' },
  { prefix: '/bd-studio', tier: 'auteur' }, // BD Studio
  { prefix: '/v3/livres/bd', tier: 'auteur' }, // Livres spéciaux BD / Manga
  { prefix: '/v3/corriger', tier: 'auteur' }, // Correction éditoriale
  { prefix: '/bookperfect', tier: 'auteur' }, // BookPerfect AI
  { prefix: '/v3/outils/humanizer', tier: 'auteur' }, // HumanizeAI
  { prefix: '/v3/create', tier: 'auteur' }, // Je raconte un livre
  { prefix: '/v3/studio', tier: 'auteur' }, // Studio Pro hybride (Gemini + ChatGPT)
];

/** Niveau minimal requis pour une route, ou null si ouverte dès Starter. */
export function minTierForPath(pathname: string): V3PlanTier | null {
  const clean = (pathname.split('?')[0] ?? '/').replace(/\/+$/, '') || '/';
  let best: { prefix: string; tier: V3PlanTier } | null = null;
  for (const rule of ROUTE_MIN_TIER) {
    if (clean === rule.prefix || clean.startsWith(rule.prefix + '/')) {
      if (!best || rule.prefix.length > best.prefix.length) best = rule;
    }
  }
  return best?.tier ?? null;
}

/**
 * true si la route est verrouillée pour ce plan.
 * tier = null (compte sans nouvelle formule, ex. client historique) → jamais
 * verrouillé : les droits existants sont préservés.
 */
export function isPathLockedForTier(pathname: string, tier: V3PlanTier | null): boolean {
  if (tier === null) return false;
  const required = minTierForPath(pathname);
  if (required === null) return false;
  return TIER_RANK[tier] < TIER_RANK[required];
}

/** Plan minimal requis pour une route (pour l'affichage du cadenas). */
export function requiredPlanLabel(pathname: string): string | null {
  const required = minTierForPath(pathname);
  return required ? PLAN_TIER_META[required].label : null;
}
