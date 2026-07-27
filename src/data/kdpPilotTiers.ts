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
  version: "basique" | "complet" | "pro";
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
  debutant: {
    planId: "debutant",
    label: "KDP Pilot — Audit basique",
    version: "basique",
    agentCode: "P27",
    runsPerMonth: 5,
    bsrMode: "static",
    keywordSuggestions: 10,
    nicheComparator: false,
    competitorScan: false,
    actionPlanAI: false,
    scoreDepth: "basic",
    features: [
      { key: "score", label: "Score qualité KDP (/100)", description: "Notation globale titre + description + mots-clés.", included: true },
      { key: "top3", label: "Top 3 axes d'amélioration", description: "Les 3 leviers prioritaires pour votre fiche produit.", included: true },
      { key: "bsr_static", label: "BSR estimé (snapshot)", description: "Estimation de rang à l'instant T (non actualisée).", included: true },
      { key: "keywords_10", label: "10 suggestions de mots-clés", description: "Mots-clés de base extraits automatiquement.", included: true },
      { key: "niche_compare", label: "Comparateur de niches", description: "Réservé Auteur.", included: false },
      { key: "competitor_scan", label: "Scan concurrence live", description: "Réservé Auteur.", included: false },
      { key: "action_plan", label: "Plan d'action IA", description: "Réservé Auteur.", included: false },
    ],
  },
  expert: {
    planId: "expert",
    label: "KDP Pilot — Audit complet",
    version: "complet",
    agentCode: "P27",
    runsPerMonth: 20,
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
      { key: "niche_compare", label: "Comparateur multi-niches", description: "Réservé Auteur.", included: false },
      { key: "action_plan", label: "Plan d'action IA", description: "Réservé Auteur.", included: false },
    ],
  },
  auteur: {
    planId: "auteur",
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
};

export function getKdpPilotTier(planId: V3PlanId): KdpPilotTierConfig {
  return KDP_PILOT_TIERS[planId];
}
