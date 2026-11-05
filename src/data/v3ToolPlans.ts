import type { V2Tool } from './v2ToolsRegistry';

/** Deux niveaux : `plume` (socle complet) et `edition` (version pro + upsells inclus). */
export type V3Plan = 'plume' | 'edition';

/**
 * Fonctions réservées au forfait Édition.
 * Tout le reste est inclus dès Plume — y compris l'audiolivre, les traductions,
 * la communauté et les outils marketing de base.
 */
export const PRO_ONLY = new Set<string>([
  // Pilotage business / éditeur
  'business-center', 'crm', 'gestion-prospects', 'coaching-vip', 'influenceurs',
  'affiliation', 'dashboard-marketing',
  // Modules professionnels
  'publication-pro', 'kdp-etranger',
  'bd-studio',
  'bookperfect',
  'masterclass',
  'puzzle-book',
  'cherche-trouve',
]);

export function planForTool(tool: Pick<V2Tool, 'id'>): V3Plan {
  return PRO_ONLY.has(tool.id) ? 'edition' : 'plume';
}

export const PLAN_META: Record<V3Plan, { label: string; short: string; color: string; bg: string; border: string; order: number }> = {
  plume:   { label: 'Inclus dès Débutant (19 €/mois)', short: 'Débutant · 19 €',   color: '#FB923C', bg: '#2A1A0E', border: '#FB923C66', order: 0 },
  edition: { label: 'Dès Auteur (29 €/mois) et Édition VIP (59 €/mois)', short: 'Auteur 29 € · Édition VIP 59 €', color: '#C4B5FD', bg: '#1E1533', border: '#C4B5FD66', order: 1 },
};

export function isUnlockedForPlan(toolPlan: V3Plan, userPlan: V3Plan): boolean {
  const rank = { plume: 0, edition: 1 } as const;
  return rank[userPlan] >= rank[toolPlan];
}

/**
 * Niveau de puissance d'un outil partagé par les deux forfaits.
 * Plume garde une version pleinement utilisable ; Édition passe en version pro.
 */
export type ToolPowerLevel = 'standard' | 'pro';

export const PRO_LEVEL_TOOLS = new Set<string>([
  'audiobook', 'audiobook-demo',
  'cover-design-editor', 'cover', 'backcover',
  'amazon-spy', 'audit-pilot', 'kdp-keywords-pro', 'niches-600',
  'kids-book',
]);

export function powerLevelForPlan(toolId: string, userPlan: V3Plan): ToolPowerLevel {
  if (!PRO_LEVEL_TOOLS.has(toolId)) return 'standard';
  return userPlan === 'edition' ? 'pro' : 'standard';
}
