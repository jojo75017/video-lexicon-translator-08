import type { V3PackId } from '@/data/roadmapV3';

/**
 * Source unique des compléments payants V3 (upsells) et de leur verrou.
 *
 * `key` correspond exactement à `module_entitlements.module` écrit par le
 * webhook de paiement : c'est ce qui débloque réellement l'outil.
 *
 * `routes` = pages entièrement verrouillées (grisées) tant que le complément
 * n'est pas acheté. Les modules sans route (packs transverses) restent
 * seulement affichés en carte sur /v3/upsells.
 */
export interface V3PaidModule {
  /** Clé d'entitlement (module_entitlements.module). */
  key: string;
  title: string;
  /** Prix unitaire en euros (paiement unique). */
  price: number;
  /** Phrase courte affichée sur le verrou. */
  pitch: string;
  /** Routes V3 verrouillées par ce complément. */
  routes: string[];
  /** Pack roadmap → tunnel `v3-upsell-checkout`. */
  packId?: V3PackId;
  /** Prix Stripe (lookup_key) → tunnel `v3-subscription-checkout`. */
  priceId?: string;
}

export const V3_PAID_MODULES: V3PaidModule[] = [
  {
    key: 'bookperfect',
    title: 'BookPerfect AI — Directeur Éditorial',
    price: 47,
    pitch: 'Analyse éditoriale complète de votre manuscrit et export Word corrigé, chapitre par chapitre.',
    routes: ['/v3/corriger'],
    priceId: 'v3_addon_bookperfect_once',
  },
  {
    key: 'audio_premium',
    title: 'Audiolivre Premium',
    price: 27,
    pitch: 'Voix premium, chapitrage automatique et master audio prêt pour la distribution.',
    routes: ['/v3/outils/audiobook'],
    priceId: 'v3_addon_audio_premium_once',
  },
  {
    key: 'translations',
    title: 'Pack Traductions relues',
    price: 27,
    pitch: 'Votre livre traduit en 10 langues, relu et harmonisé pour les marchés Amazon étrangers.',
    routes: ['/v3/outils/traduction'],
    priceId: 'v3_addon_translations_once',
  },
  {
    key: 'monetisation',
    title: 'Pack Revenus & Scaling',
    price: 47,
    pitch: 'Royalties en direct, simulateur multi-prix, bundles et plan KDP Select.',
    routes: ['/v3/outils/royalties'],
    packId: 'monetisation',
  },
  {
    key: 'distribution',
    title: 'Pack Distribution Large',
    price: 47,
    pitch: 'Diffusez hors Amazon : Kobo, Apple Books, Google Play, ISBN et EPUB normé.',
    routes: ['/v3/donnees-kdp'],
    packId: 'distribution',
  },
  {
    key: 'social',
    title: 'Pack Trafic Social & Viralité',
    price: 47,
    pitch: 'Hooks viraux, calendrier 30 jours, visuels citations et kit influenceurs.',
    routes: ['/v3/posts'],
    packId: 'social',
  },
  {
    key: 'market-research',
    title: 'Pack Étude de Marché Pro',
    price: 47,
    pitch: 'Ventes estimées, mots-clés, reverse ASIN et analyse de niche sur données Amazon réelles.',
    routes: ['/v3/outils/espion-concurrents'],
    packId: 'market-research',
  },
  {
    key: 'promotion',
    title: 'Pack Promotion Éditeur',
    price: 27,
    pitch: 'Service de presse, argumentaire libraires, droits étrangers et précommandes.',
    routes: ['/v3/acquisition'],
    packId: 'promotion',
  },
  {
    key: 'editorial',
    title: 'Pack Qualité Éditoriale Pro',
    price: 47,
    pitch: 'Comité de lecture IA, édition structurelle et label qualité.',
    routes: [],
    packId: 'editorial',
  },
  {
    key: 'documentation-studio',
    title: 'Documentation Studio AI',
    price: 47,
    pitch: 'Toute la documentation d\'un produit numérique, générée et exportable.',
    routes: [],
    packId: 'documentation-studio',
  },
  {
    key: 'transcription',
    title: 'Transcription Audio / Vidéo → Texte',
    price: 27,
    pitch: 'Podcasts, vidéos et notes vocales transformés en texte éditable.',
    routes: [],
    packId: 'transcription',
  },
  {
    key: 'boost_lancement',
    title: 'Pack Boost de Lancement',
    price: 17,
    pitch: 'Visuels Pinterest, posts Instagram, checklist KDP et métadonnées prêtes.',
    routes: [],
    packId: 'boost_lancement',
  },
  {
    key: 'publishers',
    title: "Sélection maisons d'édition",
    price: 27,
    pitch: "Liste ciblée d'éditeurs et lettre d'accompagnement personnalisée.",
    routes: [],
    priceId: 'v3_addon_publishers_once',
  },
  {
    key: 'serenity',
    title: 'Pack Sérénité',
    price: 27,
    pitch: 'Session Zoom 1-à-1, support prioritaire et audit complet de votre ebook.',
    routes: [],
    priceId: 'v3_addon_serenity_once',
  },
  {
    key: 'puzzle-book',
    title: 'Livres de Jeux & Énigmes',
    price: 27,
    pitch: 'Générateur complet de livres d\'énigmes et d\'activités KDP.',
    routes: [],
    packId: 'puzzle_book',
  },
  {
    key: 'cherche-trouve',
    title: 'Coloriages Cherche & Trouve',
    price: 27,
    pitch: 'Scènes thématiques, objets cachés et prompts line art pour KDP.',
    routes: [],
    packId: 'cherche_trouve',
  },
  {
    key: 'short-stories',
    title: 'Histoires Courtes & Contes Illustrés',
    price: 27,
    pitch: 'Contes en français, synopsis visuels et exports PDF/DOCX.',
    routes: [],
    packId: 'short_stories',
  },
];

/** Accès par clé d'entitlement. */
export const V3_PAID_MODULE_BY_KEY: Record<string, V3PaidModule> = Object.fromEntries(
  V3_PAID_MODULES.map((m) => [m.key, m]),
);

/**
 * Correspondances utilisées par les cartes upsell : id de pack roadmap ou clé
 * d'addon tarifaire → clé d'entitlement réelle.
 */
const CARD_TO_MODULE_KEY: Record<string, string> = {
  // Packs roadmap (id) → module
  puzzle_book: 'puzzle-book',
  cherche_trouve: 'cherche-trouve',
  short_stories: 'short-stories',
  // Addons tarifaires (key v3Pricing) → module
  audio_single: 'audio_premium',
};

/** Clé d'entitlement d'une carte upsell (id de pack ou clé d'addon). */
export function resolveModuleKey(cardId: string): string | null {
  const mapped = CARD_TO_MODULE_KEY[cardId];
  if (mapped !== undefined) return mapped || null;
  return V3_PAID_MODULE_BY_KEY[cardId] ? cardId : null;
}

/** Complément verrouillant une route donnée (comparaison sur le chemin exact). */
export function findPaidModuleForPath(pathname: string): V3PaidModule | null {
  const clean = pathname.replace(/\/+$/, '') || '/';
  return V3_PAID_MODULES.find((m) => m.routes.includes(clean)) ?? null;
}
