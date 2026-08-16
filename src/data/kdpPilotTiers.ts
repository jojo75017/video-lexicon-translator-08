// Configuration KDP Pilot différenciée par forfait V3.
// Utilisée par le hub, la page admin et les runners d'agents (P27 / P27+).

import type { V3PlanId } from "./v3Pricing";

export interface KdpPilotFeatureFlag {
  key: string;
  label: string;
  description: string;
  included: boolean;
}

export interface KdpPilotTierConfig {
  planId: V3PlanId;
  label: string;
  version: "complet" | "pro";
  agentCode: "P27" | "P27" | "P27+";
  runsPerMonth: number | null; // null = illimité
  bsrMode: "static" | "daily" | "live";
  keywordSuggestions: number;
  nicheComparator: boolean;
  competitorScan: boolean;
  actionPlanAI: boolean;
  scoreDepth: "basic" | "advanced" | "expert";
  features: KdpPilotFeatureFlag[];
}

export const KDP_PILOT_TIERS: Record<V3PlanId, KdpPilotTierConfig> = {
  plume: {
    planId: "plume",
    label: "KDP Pilot — Audit complet",
    version: "complet",
    agentCode: "P27",
    runsPerMonth: 30,
    bsrMode: "daily",
    keywordSuggestions: 30,
    nicheComparator: false,
    competitorScan: true,
    actionPlanAI: false,
    scoreDepth: "advanced",
    features: [
      { key: "score", label: "Score qualité KDP détaillé", description: "Notation par critère : titre, description, mots-clés, catégories, prix.", included: true },
      { key: "axes", label: "Recommandations complètes", description: "Tous les axes d'amélioration avec exemples de reformulation.", included: true },
      { key: "bsr_daily", label: "BSR actualisé quotidiennement", description: "Suivi journalier du rang par catégorie.", included: true },
      { key: "keywords_30", label: "30 suggestions de mots-clés + longue traîne", description: "Analyse volume + concurrence estimée.", included: true },
      { key: "competitor_top10", label: "Scan Top 10 concurrents", description: "Titres, prix, notes, formats des 10 premiers résultats.", included: true },
      { key: "categories", label: "Catégories BSR recommandées", description: "Top catégories à cibler pour maximiser le classement.", included: true },
      { key: "niche_compare", label: "Comparateur multi-niches", description: "Version Pro — forfait Édition.", included: false },
      { key: "action_plan", label: "Plan d'action IA", description: "Version Pro — forfait Édition.", included: false },
    ],
  },
  edition: {
    planId: "edition",
    label: "KDP Pilot Pro — Version renforcée",
    version: "pro",
    agentCode: "P27+",
    runsPerMonth: null,
    bsrMode: "live",
    keywordSuggestions: 100,
    nicheComparator: true,
    competitorScan: true,
    actionPlanAI: true,
    scoreDepth: "expert",
    features: [
      { key: "score_expert", label: "Scoring expert multi-critères", description: "12 critères pondérés, benchmark vs top 100 de la niche.", included: true },
      { key: "bsr_live", label: "BSR live temps réel", description: "Rafraîchissement à la demande + historique 30 jours.", included: true },
      { key: "keywords_100", label: "100 mots-clés + volumes + intent", description: "Analyse sémantique + regroupement par intention d'achat.", included: true },
      { key: "niche_compare", label: "Comparateur multi-niches", description: "Comparez 5 niches en parallèle sur 8 métriques.", included: true },
      { key: "competitor_deep", label: "Scan concurrence profond", description: "Top 50 titres, extraction descriptions, look inside, reviews clés.", included: true },
      { key: "action_plan", label: "Plan d'action IA personnalisé", description: "Roadmap 30/60/90 jours générée par IA en fonction du positionnement.", included: true },
      { key: "reprice", label: "Suggestions de prix optimales", description: "Fourchette de prix recommandée + tests A/B suggérés.", included: true },
      { key: "reports", label: "Rapports exportables (PDF/CSV)", description: "Livrables partageables avec ghostwriters ou éditeurs.", included: true },
      { key: "unlimited", label: "Audits illimités", description: "Aucun quota mensuel.", included: true },
    ],
  },
  studio: {
    planId: "studio",
    label: "KDP Pilot Pro — Tout inclus",
    version: "pro",
    agentCode: "P27+",
    runsPerMonth: null,
    bsrMode: "live",
    keywordSuggestions: 100,
    nicheComparator: true,
    competitorScan: true,
    actionPlanAI: true,
    scoreDepth: "expert",
    features: [
      { key: "score_expert", label: "Scoring expert multi-critères", description: "12 critères pondérés, benchmark vs top 100 de la niche.", included: true },
      { key: "bsr_live", label: "BSR live temps réel", description: "Rafraîchissement à la demande + historique 30 jours.", included: true },
      { key: "keywords_100", label: "100 mots-clés + volumes + intent", description: "Analyse sémantique + regroupement par intention d'achat.", included: true },
      { key: "niche_compare", label: "Comparateur multi-niches", description: "Comparez 5 niches en parallèle sur 8 métriques.", included: true },
      { key: "competitor_deep", label: "Scan concurrence profond", description: "Top 50 titres, extraction descriptions, look inside, reviews clés.", included: true },
      { key: "action_plan", label: "Plan d'action IA personnalisé", description: "Roadmap 30/60/90 jours générée par IA.", included: true },
      { key: "reprice", label: "Suggestions de prix optimales", description: "Fourchette recommandée + tests A/B suggérés.", included: true },
      { key: "reports", label: "Rapports exportables (PDF/CSV)", description: "Livrables partageables avec ghostwriters ou éditeurs.", included: true },
      { key: "unlimited", label: "Audits illimités", description: "Aucun quota mensuel.", included: true },
      { key: "coaching", label: "Revue d'audit avec coaching", description: "Analyse commentée lors de votre session mensuelle 1-à-1.", included: true },
    ],
  },
};

export function getKdpPilotTier(planId: V3PlanId): KdpPilotTierConfig {
  return KDP_PILOT_TIERS[planId];
}
