export type V3PlanId = "plume" | "edition" | "studio";
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
  /** Sommaire IA : niveau proposé par le forfait. */
  aiSummary: string;
  /** Tous les compléments (upsells) sont-ils inclus ? */
  allAddonsIncluded: boolean;
  features: string[];
}

/** Remise à vie accordée aux acheteurs de la V2. */
export const V2_LEGACY_DISCOUNT = 0.2;

export const legacyPrice = (amount: number): number =>
  Math.round(amount * (1 - V2_LEGACY_DISCOUNT) * 100) / 100;

/**
 * Trois forfaits V3 (activation octobre 2026).
 * Socle identique pour les trois — dont les 10 langues et le Sommaire IA.
 * Édition ajoute la puissance professionnelle ; Studio Pro inclut
 * TOUS les compléments (aucun achat supplémentaire, jamais).
 */
export const V3_PLANS: V3Plan[] = [
  {
    id: "plume",
    name: "Plume",
    tagline: "J'écris et je publie mes livres, avec tous les outils du studio",
    monthlyPrice: 27,
    yearlyPrice: 270,
    booksPerMonth: 30,
    chaptersMax: 40,
    wordsPerChapter: 5000,
    charactersMax: 8,
    agentsCount: 22,
    proModulesIncluded: false,
    aiSummary: "Sommaire IA guidé (dialogue)",
    allAddonsIncluded: false,
    features: [
      "30 livres / mois",
      "Tous les onglets : Plan, Écrire, Habiller, Publier, Vendre",
      "40 chapitres max · 5 000 mots/ch",
      "Sommaire IA guidé : vous construisez le plan avec l'IA",
      "10 langues incluses (choix dès l'étape 1)",
      "Export PDF / DOCX / EPUB + sommaire stylé",
      "Couverture complète (recto + tranche + 4e)",
      "Audiolivre inclus",
      "Import de manuscrit (DOCX / PDF / URL)",
      "Correction professionnelle du livre",
      "Support email 24 h",
    ],
  },
  {
    id: "edition",
    name: "Édition",
    tagline: "Je publie en professionnel et je vends — tout Plume, en version pro",
    monthlyPrice: 47,
    yearlyPrice: 470,
    booksPerMonth: null,
    chaptersMax: 60,
    wordsPerChapter: 8000,
    charactersMax: Infinity,
    agentsCount: 30,
    proModulesIncluded: true,
    aiSummary: "Sommaire IA avancé (sous-chapitres, plan long)",
    allAddonsIncluded: false,
    features: [
      "Livres illimités",
      "Tout ce que contient Plume, en version professionnelle",
      "Mode Recherche Approfondie (workflow renforcé)",
      "60 chapitres max · 8 000 mots/ch",
      "Sommaire IA avancé + ambiances de sommaire",
      "10 langues incluses",
      "Cover Studio Pro (300 DPI, gabarits KDP, variantes)",
      "Audiolivre version pro (voix premium, chapitrage)",
      "BD Studio Pro",
      "Amazon Spy / Audit ASIN / mots-clés avancés",
      "Pack KDP prêt à publier (ZIP) + checklist",
      "Support prioritaire",
    ],
  },
  {
    id: "studio",
    name: "Studio Pro",
    tagline: "Tout est inclus : plus aucun complément à acheter, jamais",
    monthlyPrice: 97,
    yearlyPrice: 970,
    booksPerMonth: null,
    chaptersMax: 60,
    wordsPerChapter: 8000,
    charactersMax: Infinity,
    agentsCount: 30,
    proModulesIncluded: true,
    aiSummary: "Sommaire IA avancé + architecture de série multi-tomes",
    allAddonsIncluded: true,
    features: [
      "Tout Édition, sans limite",
      "Séries multi-tomes (Bible d'univers + mémoire de série)",
      "10 langues incluses",
      "BookPerfect AI inclus (valeur 97 €)",
      "Pack Traductions relues inclus (valeur 97 €)",
      "Audiolivre Premium inclus (valeur 67 €)",
      "Version audio de chaque livre incluse (valeur 9,99 €/livre)",
      "Sélection maisons d'édition incluse (valeur 77 €)",
      "Pack Sérénité — Zoom 1-à-1 inclus (valeur 30 €)",
      "Coaching mensuel + priorité sur les nouveaux modules",
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
    studio: { monthly: "v3_studio_monthly", annual: "v3_studio_annual" },
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

export interface V3Addon {
  key: string;
  title: string;
  description: string;
  price: number;
  /** Route interne où l'abonné utilise ou commande le complément. */
  to: string;
  /** Inclus d'office dans Édition ? */
  inEdition: boolean;
}

/** Catalogue unique des compléments — tous inclus dans Studio Pro. */
export const V3_ADDON_LIST: V3Addon[] = [
  {
    key: "bookperfect",
    title: "BookPerfect AI — Directeur Éditorial",
    description: "Analyse éditoriale complète + export Word corrigé, chapitre par chapitre.",
    price: 97,
    to: "/v3/corriger",
    inEdition: true,
  },
  {
    key: "translations",
    title: "Pack Traductions relues",
    description: "Traduction de votre livre en 10 langues, relue et harmonisée.",
    price: 97,
    to: "/v3/outils/traduction",
    inEdition: false,
  },
  {
    key: "audio_premium",
    title: "Audiolivre Premium",
    description: "Voix premium, chapitrage, master audio prêt pour la distribution.",
    price: 67,
    to: "/v3/audiobook",
    inEdition: false,
  },
  {
    key: "audio_single",
    title: "Version audio d'un livre",
    description: "Un livre converti en MP3, voix naturelle, écoute et téléchargement immédiats.",
    price: 9.99,
    to: "/v3/audiobook",
    inEdition: false,
  },
  {
    key: "publishers",
    title: "Sélection maisons d'édition",
    description: "Liste ciblée d'éditeurs + lettre d'accompagnement personnalisée.",
    price: 77,
    to: "/v3/outils",
    inEdition: false,
  },
  {
    key: "serenity",
    title: "Pack Sérénité",
    description: "Session Zoom 1-à-1 + support prioritaire + audit complet de votre ebook.",
    price: 30,
    to: "/contact-support?sujet=pack-serenite",
    inEdition: false,
  },
];

/** Valeur totale des compléments inclus dans Studio Pro. */
export const V3_ADDONS_TOTAL_VALUE = Math.round(
  V3_ADDON_LIST.reduce((sum, a) => sum + a.price, 0),
);

/** Rétrocompatibilité avec l'ancien objet V3_ADDONS. */
export const V3_ADDONS = {
  bookperfect: V3_ADDON_LIST[0],
  serenity: V3_ADDON_LIST[V3_ADDON_LIST.length - 1],
} as const;

/** Prix unique de la conversion audio d'un livre. */
export const AUDIO_SINGLE_PRICE = 9.99;
export const AUDIO_SINGLE_PRICE_ID = "v3_audio_single";
