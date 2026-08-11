export type V3PlanId = "plume" | "edition";
export type V3BillingInterval = "month" | "year";

export interface V3Plan {
  id: V3PlanId;
  name: string;
  tagline: string;
  monthlyPrice: number;
  yearlyPrice: number;
  booksPerMonth: number | null; // null = illimité
  chaptersMax: number;
  wordsPerChapter: number;
  charactersMax: number;
  agentsCount: number;
  proModulesIncluded: boolean;
  features: string[];
}

/**
 * Deux forfaits V3 (activation octobre 2026).
 * Principe : même socle d'outils pour les deux. Édition ajoute la puissance
 * professionnelle (workflow renforcé, Cover Studio Pro, BD Studio Pro…) et
 * inclut les upsells au lieu de les facturer à l'unité.
 * L'audiolivre est inclus dans LES DEUX forfaits.
 */
export const V3_PLANS: V3Plan[] = [
  {
    id: "plume",
    name: "Plume",
    tagline: "J'écris et je publie mes livres, avec tous les outils du studio",
    monthlyPrice: 17,
    yearlyPrice: 170,
    booksPerMonth: 30,
    chaptersMax: 40,
    wordsPerChapter: 5000,
    charactersMax: 8,
    agentsCount: 22,
    proModulesIncluded: false,
    features: [
      "30 livres / mois",
      "Tous les onglets : Plan, Écrire, Habiller, Publier, Vendre",
      "40 chapitres max · 5 000 mots/ch",
      "Export PDF / DOCX / EPUB + sommaire propre",
      "Couverture complète (recto + tranche + 4e)",
      "Audiolivre inclus",
      "Import de manuscrit (DOCX / PDF / URL)",
      "Livre illustré maternelle",
      "Traductions 10 langues incluses",
      "Support email 24 h",
    ],
  },
  {
    id: "edition",
    name: "Édition",
    tagline: "Je publie en professionnel et je vends — tout Plume, en version pro",
    monthlyPrice: 27,
    yearlyPrice: 270,
    booksPerMonth: null,
    chaptersMax: 60,
    wordsPerChapter: 8000,
    charactersMax: Infinity,
    agentsCount: 30,
    proModulesIncluded: true,
    features: [
      "Livres illimités",
      "Tout ce que contient Plume, en version professionnelle",
      "Mode Recherche Approfondie (workflow renforcé)",
      "60 chapitres max · 8 000 mots/ch",
      "Cover Studio Pro (300 DPI, gabarits KDP, variantes)",
      "Audiolivre version pro (voix premium, chapitrage)",
      "BD Studio Pro",
      "Amazon Spy / Audit ASIN / mots-clés avancés",
      "Pack KDP prêt à publier (ZIP) + checklist",
      "Upsells inclus : BookPerfect AI, sélection éditeurs, relecture IA premium",
      "Support prioritaire + coaching mensuel",
    ],
  },
];

export function getV3Plan(id: V3PlanId): V3Plan | undefined {
  return V3_PLANS.find((p) => p.id === id);
}

export function getV3PriceId(
  planId: V3PlanId,
  interval: V3BillingInterval,
  legacyV2 = false,
): string {
  // Identifiants de prix stables (identiques en test et en production).
  const suffix = interval === "month" ? "monthly" : "annual";
  const map: Record<V3PlanId, { monthly: string; annual: string }> = {
    plume: { monthly: "v3_plume_monthly", annual: "v3_plume_annual" },
    edition: { monthly: "v3_edition_monthly", annual: "v3_edition_annual" },
  };
  const base = map[planId][suffix];
  // Prix réservé aux acheteurs V2 (-20 % à vie). Le serveur revérifie le droit.
  return legacyV2 ? `${base}_legacy` : base;
}

export function getYearlySavingsPercent(plan: V3Plan): number {
  const monthlyTotal = plan.monthlyPrice * 12;
  const yearlyTotal = plan.yearlyPrice;
  return Math.round(((monthlyTotal - yearlyTotal) / monthlyTotal) * 100);
}

export function getYearlySavingsAmount(plan: V3Plan): number {
  return Math.round(plan.monthlyPrice * 12 - plan.yearlyPrice);
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export const V3_ADDONS = {
  bookperfect: {
    key: "bookperfect",
    title: "BookPerfect AI — Directeur Éditorial",
    description: "Analyse éditoriale IA + export Word corrigé (inclus dans Édition)",
    price: 97,
  },
  serenity: {
    key: "serenity",
    title: "Pack Sérénité",
    description: "Session Zoom 1-à-1 + support prioritaire + audit ebook",
    price: 30,
  },
} as const;
