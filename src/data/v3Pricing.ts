export type V3PlanId = "debutant" | "expert" | "auteur";
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

export const V3_PLANS: V3Plan[] = [
  {
    id: "debutant",
    name: "Débutant",
    tagline: "Publiez vos premiers livres proprement sur KDP",
    monthlyPrice: 9.99,
    yearlyPrice: 97,
    booksPerMonth: 20,
    chaptersMax: 20,
    wordsPerChapter: 3500,
    charactersMax: 3,
    agentsCount: 22,
    proModulesIncluded: false,
    features: [
      "20 livres / mois",
      "20 chapitres max · 3 500 mots/ch",
      "22 agents IA",
      "Export PDF/DOCX/EPUB + TOC",
      "10 traductions incluses",
      "Couverture base (recto + tranche + 4e)",
      "Support email 48h",
    ],
  },
  {
    id: "expert",
    name: "Expert",
    tagline: "Plus de livres, plus de contrôle, plus de conversions",
    monthlyPrice: 12.99,
    yearlyPrice: 117,
    booksPerMonth: 50,
    chaptersMax: 40,
    wordsPerChapter: 5000,
    charactersMax: 8,
    agentsCount: 22,
    proModulesIncluded: false,
    features: [
      "50 livres / mois",
      "40 chapitres max · 5 000 mots/ch",
      "22 agents IA + priorité",
      "Templates KDP standard",
      "10 traductions incluses",
      "Couverture pro + variantes",
      "Support email 24h",
    ],
  },
  {
    id: "auteur",
    name: "Auteur",
    tagline: "L'atelier d'édition complet : tout, illimité, sans compromis",
    monthlyPrice: 59,
    yearlyPrice: 547,
    booksPerMonth: null,
    chaptersMax: 60,
    wordsPerChapter: 8000,
    charactersMax: Infinity,
    agentsCount: 30,
    proModulesIncluded: true,
    features: [
      "Livres illimités",
      "60 chapitres max · 8 000 mots/ch",
      "30 agents IA (P1 → P30)",
      "Tous les modules Pro inclus",
      "Cover Studio Pro (P23)",
      "KDP Pilot Pro renforcé (P27+)",
      "Sélection éditeurs (P26)",
      "Amazon Spy (P28), Audiobook (P29), BD Studio (P30)",
      "10 traductions + relecture IA premium",
      "Support prioritaire 12h + coaching mensuel",
    ],
  },
];

export function getV3Plan(id: V3PlanId): V3Plan | undefined {
  return V3_PLANS.find((p) => p.id === id);
}

export function getV3PriceId(planId: V3PlanId, interval: V3BillingInterval): string {
  return `${planId}_${interval === "month" ? "monthly" : "yearly"}`;
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
    description: "Analyse éditoriale IA + export Word corrigé",
    price: 97,
  },
  serenity: {
    key: "serenity",
    title: "Pack Sérénité",
    description: "Session Zoom 1-à-1 + support prioritaire + audit ebook",
    price: 30,
  },
} as const;
