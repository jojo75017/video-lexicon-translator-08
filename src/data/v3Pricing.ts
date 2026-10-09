export type V3PlanId = "plume" | "edition" | "maison";
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
  /** Les gros compléments premium sont-ils inclus ? */
  allAddonsIncluded: boolean;
  /** À qui cette formule convient le mieux. */
  idealFor: string;
  features: string[];
}

/** Remise à vie accordée aux acheteurs de la V2. */
export const V2_LEGACY_DISCOUNT = 0.2;

/**
 * Fermeture annoncée de la V2 (affichage seul) : la V2 reste utilisable par
 * tout le monde — anciens abonnés, Plume et Édition — jusqu'à cette date,
 * en attendant la V4. Aucun verrou technique n'est posé ici.
 */
export const V2_ACCESS_UNTIL_ISO = "2026-12-31T23:59:59+01:00";
export const V2_ACCESS_UNTIL_LABEL = "31 décembre 2026";
export const V2_ACCESS_NOTE = `Accès V2 conservé jusqu'au ${V2_ACCESS_UNTIL_LABEL}, en attendant la V4.`;

export const legacyPrice = (amount: number): number =>
  Math.round(amount * (1 - V2_LEGACY_DISCOUNT) * 100) / 100;

/**
 * Deux forfaits V3 uniquement (activation octobre 2026).
 * Socle identique pour les deux — dont les 10 langues et le Sommaire IA.
 * Édition ajoute les studios professionnels. Les gros compléments à la carte
 * restent séparés dans les deux forfaits.
 */
export const V3_PLANS: V3Plan[] = [
  {
    id: "plume",
    name: "Plume",
    tagline: "J'écris et je publie mes livres, avec tous les outils du studio",
    monthlyPrice: 27,
    yearlyPrice: 270,
    booksPerMonth: 50,
    chaptersMax: 40,
    wordsPerChapter: 5000,
    charactersMax: 8,
    agentsCount: 22,
    proModulesIncluded: false,
    aiSummary: "Sommaire IA guidé (dialogue)",
    allAddonsIncluded: false,
    idealFor: "Les auteurs qui publient régulièrement et veulent un atelier complet, simple et maîtrisé.",
    features: [
      "Accès V2 inclus jusqu'au 31 décembre 2026 (vous avez les deux)",
      "50 livres / mois",
      "Tous les onglets : Plan, Écrire, Habiller, Publier, Vendre",
      "40 chapitres max · 5 000 mots/ch · 8 personnages",
      "Création guidée ou travail à partir de votre propre sommaire",
      "Rédaction chapitre par chapitre avec le Génie",
      "10 langues incluses (choix dès l'étape 1)",
      "Mise en page et exports PDF / DOCX / EPUB / Kindle",
      "Couverture standard Kindle et KDP broché",
      "Audiolivre standard inclus",
      "Import de manuscrit (DOCX / PDF / URL)",
      "Correction professionnelle du livre",
      "Recherche avancée pour documenter votre sujet",
      "Mockups et visuels de présentation du livre",
      "Fiche produit KDP : titre, description, mots-clés",
      "Calendrier de publication",
      "Discussion libre avec l'IA (votre propre clé)",
      "Support email 24 h",
    ],
  },
  {
    id: "edition",
    name: "Édition",
    tagline: "Tout est inclus : je publie en professionnel, je vends, plus rien à acheter",
    monthlyPrice: 47,
    yearlyPrice: 470,
    booksPerMonth: null,
    chaptersMax: 60,
    wordsPerChapter: 8000,
    charactersMax: Infinity,
    agentsCount: 30,
    proModulesIncluded: true,
    aiSummary: "Sommaire IA avancé + architecture de série multi-tomes",
    allAddonsIncluded: false,
    idealFor: "Les auteurs et éditeurs qui produisent sans limite et utilisent les studios professionnels.",
    features: [
      "Accès V2 inclus jusqu'au 31 décembre 2026 (vous avez les deux)",
      "Livres illimités",
      "Tout ce que contient Plume, en version professionnelle",
      "Mode Recherche Approfondie (workflow renforcé)",
      "60 chapitres max · 8 000 mots/ch · personnages illimités",
      "Sommaire IA avancé + ambiances de sommaire",
      "Séries multi-tomes (Bible d'univers + mémoire de série)",
      "10 langues incluses",
      "Inclus (valeur 67 €) : Cover Studio KDP Pro — première, dos, quatrième, exports 300 DPI",
      "En option : Studio Jeunesse & BD (47 €)",
      "Amazon Spy / Audit ASIN / mots-clés avancés",
      "Pack KDP prêt à publier (ZIP) + checklist",
      "Inclus (valeur 81 €) : Pack Traductions relues 10 langues",
      "Inclus : Audiolivre Premium (voix premium, chapitrage, master)",
      "Inclus : Sélection maisons d'édition + lettre d'accompagnement",
      "Inclus : BookPerfect AI — direction éditoriale approfondie",
      "Inclus : Pack Sérénité (audit complet + support prioritaire)",
      "Priorité sur les nouveautés V4 dès leur sortie",
      "Tous les modules professionnels V3 inclus",
      "Support prioritaire",
    ],
  },
  {
    id: "maison",
    name: "Maison d'Édition",
    tagline: "Tout compris : Édition + tous les compléments (Cover Studio Pro inclus ; Studio Jeunesse & BD en option)",
    monthlyPrice: 97,
    yearlyPrice: 897,
    booksPerMonth: null,
    chaptersMax: 60,
    wordsPerChapter: 8000,
    charactersMax: Infinity,
    agentsCount: 30,
    proModulesIncluded: true,
    aiSummary: "Sommaire IA avancé + architecture de série multi-tomes",
    allAddonsIncluded: true,
    idealFor: "Les auteurs-éditeurs qui veulent tous les studios et tous les compléments, sans jamais payer de supplément.",
    features: [
      "Accès V2 inclus jusqu'au 31 décembre 2026 (vous avez les deux)",
      "Tout ce que contient Édition",
      "Tous les compléments payants inclus, sans achat séparé",
      "Version Longue, Histoires illustrées",
      "Jeux & Énigmes, Cherche & Trouve, Histoires courtes",
      "Pack Boost de Lancement et Promotion Éditeur",
      "Transcription audio/vidéo et Documentation Studio",
      "Revenus & Scaling, Distribution Large, Trafic Social",
      "Qualité Éditoriale et Étude de Marché",
      "Toutes les futures nouveautés V3 incluses",
      "Inclus (valeur 67 €) : Cover Studio KDP Pro — première, dos, quatrième, exports 300 DPI",
      "En option : Studio Jeunesse & BD (47 €)",
      "Support prioritaire",
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
    maison: { monthly: "v3_maison_monthly", annual: "v3_maison_annual" },
    
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
  /** Identifiant de prix (paiement unique) autorisé côté serveur. */
  priceId: string;
  title: string;
  description: string;
  price: number;
  /** Route interne où l'abonné utilise ou commande le complément. */
  to: string;
  /** Inclus d'office dans Édition ? */
  inEdition: boolean;
}

/** Catalogue unique des gros compléments premium, vendus séparément. */
export const V3_ADDON_LIST: V3Addon[] = [
  {
    key: "bookperfect",
    priceId: "v3_addon_bookperfect_once",
    title: "BookPerfect AI — Directeur Éditorial",
    description: "Analyse éditoriale complète + export Word corrigé, chapitre par chapitre.",
    price: 47,
    to: "/v3/corriger",
    inEdition: true,
  },
  {
    key: "translations",
    priceId: "v3_addon_translations_once",
    title: "Pack Traductions relues",
    description: "Traduction de votre livre en 10 langues, relue et harmonisée.",
    price: 27,
    to: "/v3/outils/traduction",
    inEdition: true,
  },
  {
    key: "audio_premium",
    priceId: "v3_addon_audio_premium_once",
    title: "Audiolivre Premium",
    description: "Voix premium, chapitrage, master audio prêt pour la distribution.",
    price: 27,
    to: "/v3/outils/audiobook",
    inEdition: true,
  },
  {
    key: "audio_single",
    priceId: "v3_audio_single",
    title: "Version audio d'un livre",
    description: "Un livre converti en MP3, voix naturelle, écoute et téléchargement immédiats.",
    price: 9.99,
    to: "/v3/outils/audiobook",
    inEdition: false,
  },
  {
    key: "publishers",
    priceId: "v3_addon_publishers_once",
    title: "Sélection maisons d'édition",
    description: "Liste ciblée d'éditeurs + lettre d'accompagnement personnalisée.",
    price: 27,
    to: "/v3/outils",
    inEdition: true,
  },
  {
    key: "serenity",
    priceId: "v3_addon_serenity_once",
    title: "Pack Sérénité",
    description: "Session Zoom 1-à-1 + support prioritaire + audit complet de votre ebook.",
    price: 27,
    to: "/contact-support?sujet=pack-serenite",
    inEdition: true,
  },
];

/** Valeur totale des compléments premium proposés à la carte. */
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

/** Public one-time offers; V3_PLANS remains historical subscription data. */
export const V3_LIFETIME_OFFERS = {
  base: {
    price: 47,
    title: "EbookStudio — accès à vie",
    booksPerMonth: 10,
    booksPerYear: 120,
    chaptersMax: 40,
    features: [
      "10 livres par mois, soit jusqu’à 120 livres par an",
      "40 chapitres maximum par livre ; privilégiez 30 chapitres ou moins",
      "Écrire un livre, raconter un livre ou sa vie, partir de son sommaire",
      "Correction du manuscrit et HumanizeAI",
      "Mise en page et exports PDF, Word et EPUB",
      "Studio V4 : illustration incluse, aperçu et exports 300 DPI",
      "Outils KDP de base : description, mots-clés et catégories",
      "Votre propre clé IA pour les moteurs concernés",
    ],
  },
  pro: {
    price: 97,
    title: "Pack Édition Pro — accès à vie",
    priceId: "v3_pack_edition_pro_once",
    features: [
      "Complément à votre accès EbookStudio, sans abonnement",
      "Cover Studio KDP Pro inclus (valeur 67 €)",
      "Outils KDP avancés : Amazon Spy, mots-clés Pro et audit",
      "BD Studio et BookPerfect",
      "Livres illimités et chapitres plus longs",
    ],
  },
  cover: { price: 67, title: "Cover Studio KDP Pro seul", priceId: "v3_pack_cover_studio_pro_once" },
} as const;

/**
 * Nouvelles offres pour les nouveaux clients (à partir du 16/10/2026).
 * Les identifiants `plan` correspondent aux formules autorisées côté serveur
 * (fonction v3-pack-checkout). Les anciens clients gardent leurs droits.
 */
export interface V3NewOfferOption { plan: string; label: string; installments: number; amount: number }
export const V3_NEW_OFFERS = {
  auteur: {
    title: "EbookStudio Auteur",
    price: 97,
    period: "par an",
    renewal: "Renouvellement automatique chaque année, résiliable à tout moment.",
    booksPerMonth: 10,
    chaptersMax: 40,
    options: [
      { plan: "auteur97_1x", label: "97 € par an", installments: 1, amount: 97 },
      { plan: "auteur97_3x", label: "3 × 32,34 € (1 an d'accès)", installments: 3, amount: 32.34 },
    ] as V3NewOfferOption[],
    features: [
      "Les 4 parcours : Écrire un livre, Je raconte un livre, Je raconte ma vie, J'ai déjà mon sommaire",
      "Rédaction chapitre par chapitre avec les robots",
      "Correction éditoriale et HumanizeAI",
      "Exports PDF, DOCX et EPUB · mise en page Kindle et broché",
      "Studio de couverture V4 : illustration IA, 5 modèles, PDF KDP 300 DPI",
      "Outils KDP de base : mots-clés, description, catégories",
      "Rédaction en 10 langues",
      "10 livres par mois · 40 chapitres max (30 conseillés)",
    ],
    paidOptions: "En option : Cover Studio Pro 67 €, Studio Jeunesse 47 €, Version audio 9,99 €, Micro-Séries 67 €.",
  },
  edition: {
    title: "EbookStudio Édition à vie",
    price: 497,
    period: "à vie",
    renewal: "Aucun renouvellement : vous payez une fois, l'accès est à vie.",
    booksPerMonth: 20,
    chaptersMax: 60,
    // Les identifiants de plan (edition247_*) sont des clés de synchronisation permanentes : ne pas les renommer.
    options: [
      { plan: "edition247_1x", label: "497 € en une fois", installments: 1, amount: 497 },
      { plan: "edition247_3x", label: "3 × 165,67 €", installments: 3, amount: 165.67 },
      { plan: "edition247_6x", label: "6 × 82,84 €", installments: 6, amount: 82.84 },
    ] as V3NewOfferOption[],
    features: [
      "Tout le contenu de l'offre Auteur",
      "Pack Édition Pro inclus : Cover Studio Pro, BD Studio Pro",
      "Recherche approfondie, Amazon Spy et outils KDP avancés",
      "20 livres par mois · 60 chapitres max",
      "Mises à jour de la V3 incluses",
    ],
    paidOptions: "Restent en option : Studio Jeunesse, Version audio, Micro-Séries V4, accompagnement personnel.",
  },
} as const;
