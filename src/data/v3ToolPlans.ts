import type { V2Tool } from './v2ToolsRegistry';

export type V3Plan = 'debutant' | 'expert' | 'auteur';

// Outils réservés au forfait Auteur (le plus complet).
export const PRO_ONLY = new Set<string>([
  'business-center', 'crm', 'gestion-prospects', 'coaching-vip', 'influenceurs',
  'publication-pro', 'kdp-etranger', 'kdp-ads-guide',
  'audiobook', 'bd-studio',
  'bookperfect',
  'affiliation', 'dashboard-marketing',
  'masterclass',
  'v3-gallery',
]);

// Outils débloqués à partir du forfait Expert.
export const EXPERT_MIN = new Set<string>([
  'generateur-posts',
  'formation-audio', 'formation-series-audio', 'checklist-tournage', 'audiobook-demo',
  'niches-600', 'series-tomes', 'guide-kdp-enfants',
  'audit-pilot',
  'plan-marketing', 'campagne-vente', 'apercu-emails', 'emails-onboarding',
  'communaute', 'extension-chrome',
  'ai-chat', 'seo-generator', 'generateur-ebook',
  'multi-translator',
]);

export function planForTool(tool: Pick<V2Tool, 'id'>): V3Plan {
  if (PRO_ONLY.has(tool.id)) return 'auteur';
  if (EXPERT_MIN.has(tool.id)) return 'expert';
  return 'debutant';
}

export const PLAN_META: Record<V3Plan, { label: string; short: string; color: string; bg: string; border: string; order: number }> = {
  debutant: { label: 'Inclus dès Débutant', short: 'Débutant', color: '#0b6e4c', bg: '#e8f7ef', border: '#0f8a5f55', order: 0 },
  expert:   { label: 'Forfait Expert',      short: 'Expert',   color: '#C97A14', bg: '#FFF3DF', border: '#E8951E55', order: 1 },
  auteur:   { label: 'Forfait Auteur',      short: 'Auteur',   color: '#134e4a', bg: '#e6f2ef', border: '#0f766e55', order: 2 },
};

export function isUnlockedForPlan(toolPlan: V3Plan, userPlan: V3Plan): boolean {
  const rank = { debutant: 0, expert: 1, auteur: 2 } as const;
  return rank[userPlan] >= rank[toolPlan];
}
