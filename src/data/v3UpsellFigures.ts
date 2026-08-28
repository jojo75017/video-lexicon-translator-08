/**
 * Figures (personnages + prénoms) associées à chaque upsell V3.
 *
 * Chaque encart upsell porte un personnage original avec un prénom français
 * différent des agents existants (Camille, Victor, Noémie…) et de Marie/Rachel
 * (déjà utilisés en emailing). Les phrases illustrent un cas d'usage pédagogique,
 * jamais un faux témoignage client.
 *
 * Clés : id de pack roadmap (V3_UPSELL_PACKS) OU clé d'addon (V3_ADDON_LIST).
 */

export interface UpsellFigure {
  /** Prénom affiché (≤ 12 caractères). */
  prenom: string;
  /** Couleur d'accent (hex) — variée par personnage. */
  accent: string;
  /** Variant robot vs humain. */
  robot?: boolean;
  /** Phrase pédagogique d'une ligne, présentée comme un cas d'usage. */
  phrase: string;
}

/** Palette d'accents distincts par personnage (jamais de copie d'avatar). */
const C = {
  emerald: '#0d7a5f',
  teal: '#008296',
  gold: '#b4831f',
  purple: '#5B21B6',
  rose: '#9d174d',
  indigo: '#3730a3',
  amber: '#C97A14',
  green: '#15803d',
  blue: '#1d4ed8',
  slate: '#334155',
} as const;

export const V3_UPSELL_FIGURES: Record<string, UpsellFigure> = {
  // ===== Packs essentiels (roadmap) =====
  monetisation: {
    prenom: 'Étienne',
    accent: C.emerald,
    phrase: 'Comme Étienne, maximise tes royalties sur chaque vente.',
  },
  distribution: {
    prenom: 'Hélène',
    accent: C.teal,
    phrase: 'Comme Hélène, diffuse ton livre sur 5 plateformes en un clic.',
  },
  social: {
    prenom: 'Yanis',
    accent: C.rose,
    phrase: 'Comme Yanis, fais décoller ton book trailer sur les réseaux.',
  },
  editorial: {
    prenom: 'Margaux',
    accent: C.purple,
    phrase: 'Comme Margaux, publie un livre zéro faute, label qualité.',
  },
  'market-research': {
    prenom: 'Karim',
    accent: C.indigo,
    phrase: 'Comme Karim, trouve ta niche rentable en 10 minutes.',
  },

  // ===== Options à la carte =====
  promotion: {
    prenom: 'Sophie',
    accent: C.gold,
    phrase: 'Comme Sophie, place ton livre en librairie et dans la presse.',
  },
  transcription: {
    prenom: 'Mehdi',
    accent: C.blue,
    phrase: 'Comme Mehdi, transforme tes podcasts en un livre fini.',
  },
  'documentation-studio': {
    prenom: 'Claire',
    accent: C.slate,
    phrase: 'Comme Claire, livre toute la doc de ton produit en une journée.',
  },
  boost_lancement: {
    prenom: 'Lina',
    accent: C.amber,
    phrase: 'Comme Lina, décolle dès le lancement avec 50 ventes la 1re semaine.',
  },
  puzzle_book: {
    prenom: 'Basile',
    accent: C.green,
    phrase: 'Comme Basile, publie un livre d\'énigmes prêt pour KDP.',
  },
  cherche_trouve: {
    prenom: 'Prune',
    accent: C.teal,
    phrase: 'Comme Prune, vends des coloriages Cherche & Trouve à la carte.',
  },
  short_stories: {
    prenom: 'Aurèle',
    accent: C.purple,
    phrase: 'Comme Aurèle, édite un recueil de contes illustrés en une soirée.',
  },

  // ===== Compléments (V3_ADDON_LIST) =====
  bookperfect: {
    prenom: 'Margaux',
    accent: C.purple,
    phrase: 'Comme Margaux, fais relire ton manuscrit par un directeur éditorial IA.',
  },
  translations: {
    prenom: 'Solène',
    accent: C.blue,
    phrase: 'Comme Solène, traduis ton livre en 10 langues, relu et harmonisé.',
  },
  audio_premium: {
    prenom: 'Timothée',
    accent: C.indigo,
    phrase: 'Comme Timothée, exporte un audiolivre premium prêt à distribuer.',
  },
  audio_single: {
    prenom: 'Iris',
    accent: C.rose,
    phrase: 'Comme Iris, écoute ton livre en MP3, voix naturelle, immédiat.',
  },
  publishers: {
    prenom: 'Victor',
    accent: C.gold,
    phrase: 'Comme Victor, écris aux maisons d\'édition avec une lettre ciblée.',
  },
  serenity: {
    prenom: 'Camille',
    accent: C.emerald,
    phrase: 'Comme Camille, débloque un Zoom 1-à-1 et un audit complet de ton ebook.',
  },
};

/** Figure par défaut si un pack n'a pas de mapping explicite. */
export const DEFAULT_UPSELL_FIGURE: UpsellFigure = {
  prenom: 'Gaspard',
  accent: C.slate,
  phrase: 'Un cas d\'usage concret pour aller plus loin.',
};

export function getUpsellFigure(id: string): UpsellFigure {
  return V3_UPSELL_FIGURES[id] ?? DEFAULT_UPSELL_FIGURE;
}
