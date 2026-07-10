// Atelier d'édition — source unique des agents (métiers d'une maison d'édition).
//
// Deux offres :
//   - V3 (197€) : les 22 agents « tier: v3 » — de l'idée au livre publié sur KDP.
//   - V4 (347€) : tous les agents (v3 + les agents « tier: v4 »). La V4 enrichit
//     AUSSI le livre lui-même (illustrations intérieures, traduction, passe
//     éditoriale premium, version audio) en plus du Département Commercial.
//
// Chaque agent est branché sur un module déjà présent dans le projet
// (voir src/components/admin/v3ModuleRegistry.tsx → V3_MODULE_COMPONENTS).
// On ne change QUE l'orchestration/présentation : les générateurs restent intacts.

export type EditionTier = 'v3' | 'v4';

export interface EditionAgent {
  /** Numéro d'ordre affiché (1 → 30). */
  order: number;
  /** Nom métier de l'agent (maison d'édition). */
  role: string;
  /** Département / studio auquel il appartient (regroupement visuel). */
  department: string;
  /** Mission courte, une phrase claire. */
  mission: string;
  /** Module ouvert quand on lance l'agent (clé de v3ModuleRegistry). */
  moduleId: string;
  /** Offre minimale requise. */
  tier: EditionTier;
}

export const EDITION_DEPARTMENTS: string[] = [
  'Studio Conception',
  "Atelier d'Écriture",
  'Bureau de Révision',
  'Fabrication',
  'Publication',
  'Département Commercial',
];

export const EDITION_AGENTS: EditionAgent[] = [
  // ─────────── Studio Conception ───────────
  { order: 1, department: 'Studio Conception', role: 'Le Directeur Éditorial',
    mission: 'Cadre la promesse, le ton et l\'angle commercial de votre livre.',
    moduleId: 'book-creation-studio', tier: 'v3' },
  { order: 2, department: 'Studio Conception', role: "L'Analyste de Marché",
    mission: 'Trouve la niche, les catégories et les 7 mots-clés KDP porteurs.',
    moduleId: 'niche-intelligence', tier: 'v3' },
  { order: 3, department: 'Studio Conception', role: "L'Architecte du Livre",
    mission: 'Construit le plan détaillé et les titres de chapitres.',
    moduleId: 'book-creation-studio', tier: 'v3' },
  { order: 4, department: 'Studio Conception', role: 'Le Comparateur de versions',
    mission: 'V4 : Studio A/B/C — 3 versions de titre, 4e et couverture, avec version recommandée.',
    moduleId: 'edition-variant-studio', tier: 'v4' },

  // ─────────── Atelier d'Écriture ───────────
  { order: 5, department: "Atelier d'Écriture", role: 'Le Documentaliste',
    mission: 'Rassemble la recherche, les sources et les repères concurrents.',
    moduleId: 'p16-competitive', tier: 'v3' },
  { order: 6, department: "Atelier d'Écriture", role: 'Le Romancier',
    mission: 'Rédige le manuscrit chapitre par chapitre (titre affiché).',
    moduleId: 'p20-chat-manuscript', tier: 'v3' },
  { order: 7, department: "Atelier d'Écriture", role: 'Le Styliste',
    mission: 'Humanise le texte et installe votre voix d\'auteur.',
    moduleId: 'p19-author-voice', tier: 'v3' },
  { order: 8, department: "Atelier d'Écriture", role: 'Le Dialoguiste',
    mission: 'Ajuste le ton, les dialogues et le rythme du récit.',
    moduleId: 'p25-tone-adapter', tier: 'v3' },
  { order: 9, department: "Atelier d'Écriture", role: 'Le Relieur',
    mission: 'Assure les transitions, le fil rouge et la cohérence de l\'univers.',
    moduleId: 'p23-universe-bible', tier: 'v3' },
  { order: 10, department: "Atelier d'Écriture", role: "L'Illustrateur",
    mission: 'V4 : illustrations intérieures IA insérées dans vos chapitres.',
    moduleId: 'cover-studio-pro', tier: 'v4' },
  { order: 11, department: "Atelier d'Écriture", role: 'Le Traducteur',
    mission: 'V4 : traduit votre livre pour les marchés étrangers.',
    moduleId: 'translation-markets', tier: 'v4' },

  // ─────────── Bureau de Révision ───────────
  { order: 12, department: 'Bureau de Révision', role: 'Le Correcteur',
    mission: 'Corrige orthographe, grammaire et ponctuation ligne à ligne.',
    moduleId: 'copy-editing-line', tier: 'v3' },
  { order: 13, department: 'Bureau de Révision', role: 'Le Réviseur',
    mission: 'Contrôle la cohérence, la clarté et la structure éditoriale.',
    moduleId: 'developmental-edit', tier: 'v3' },
  { order: 14, department: 'Bureau de Révision', role: 'Le Vérificateur des Faits',
    mission: 'Vérifie la conformité du contenu et les affirmations sensibles.',
    moduleId: 'content-compliance', tier: 'v3' },
  { order: 15, department: 'Bureau de Révision', role: 'Le Détecteur de clichés',
    mission: 'Repère les tournures mécaniques et les clichés à éliminer.',
    moduleId: 'p24-cliche-detector', tier: 'v3' },
  { order: 16, department: 'Bureau de Révision', role: 'Le Comité de Lecture',
    mission: 'Donne un avis bêta et un verdict éditorial franc.',
    moduleId: 'reading-committee', tier: 'v3' },
  { order: 17, department: 'Bureau de Révision', role: "L'Éditeur littéraire (premium)",
    mission: 'V4 : passe éditoriale approfondie et manuscrit enrichi.',
    moduleId: 'editorial', tier: 'v4' },

  // ─────────── Fabrication ───────────
  { order: 18, department: 'Fabrication', role: 'Le Maquettiste',
    mission: 'Met en page l\'intérieur et prépare le manuscrit à l\'export.',
    moduleId: 'manuscript-converter', tier: 'v3' },
  { order: 19, department: 'Fabrication', role: 'Le Rédacteur des pages liminaires',
    mission: 'Génère copyright, remerciements et pages de fin.',
    moduleId: 'back-matter-builder', tier: 'v3' },
  { order: 20, department: 'Fabrication', role: 'Le Directeur Artistique',
    mission: 'Crée la couverture pro (dos + 4e + bleed).',
    moduleId: 'cover-studio-pro', tier: 'v3' },
  { order: 21, department: 'Fabrication', role: "Le Correcteur d'épreuves",
    mission: 'Vérifie le bon à tirer (BAT) du broché avant impression.',
    moduleId: 'print-proof-checker', tier: 'v3' },
  { order: 22, department: 'Fabrication', role: 'Le Directeur Audio',
    mission: 'V4 : version audio (audiobook) narrée, prête à publier.',
    moduleId: 'audiobook-express', tier: 'v4' },

  // ─────────── Publication ───────────
  { order: 23, department: 'Publication', role: 'Le Responsable Métadonnées',
    mission: 'Optimise titre, sous-titre, mots-clés et catégories KDP.',
    moduleId: 'categories-manager-10', tier: 'v3' },
  { order: 24, department: 'Publication', role: 'Le Stratège de Positionnement',
    mission: 'V4 : meilleures catégories KDP, 7 mots-clés et angle concurrentiel.',
    moduleId: 'book-positioning', tier: 'v4' },
  { order: 25, department: 'Publication', role: 'Le Rédacteur de 4e de couverture',
    mission: 'Écrit la description de vente qui convertit.',
    moduleId: 'sales-description', tier: 'v3' },
  { order: 26, department: 'Publication', role: 'Le Chef de Fabrication',
    mission: 'Exporte le livre en EPUB / PDF / DOCX prêts pour KDP.',
    moduleId: 'multi-format-express', tier: 'v3' },
  { order: 27, department: 'Publication', role: 'Le Responsable Conformité KDP',
    mission: 'Passe la checklist prépublication avant mise en ligne.',
    moduleId: 'prepub-checklist', tier: 'v3' },
  { order: 28, department: 'Publication', role: "L'Humanisateur",
    mission: 'Bonus : rend le texte plus humain et protège contre le plagiat.',
    moduleId: 'ebook-anti-plagiat', tier: 'v3' },

  // ─────────── Département Commercial (V4 uniquement) ───────────
  { order: 29, department: 'Département Commercial', role: "L'Attaché de Presse",
    mission: 'Prépare le kit média et les communiqués de presse.',
    moduleId: 'media-kit', tier: 'v4' },
  { order: 30, department: 'Département Commercial', role: 'Le Community Manager',
    mission: 'Calendrier social 30 jours, TikTok et Pinterest.',
    moduleId: 'social-calendar-30', tier: 'v4' },
  { order: 31, department: 'Département Commercial', role: 'Le Responsable Amazon Ads',
    mission: 'Construit et pilote vos campagnes Amazon Ads rentables.',
    moduleId: 'amazon-ads', tier: 'v4' },
  { order: 32, department: 'Département Commercial', role: 'Le Responsable Partenariats & Influenceurs',
    mission: 'Recrute des influenceurs et une équipe ARC.',
    moduleId: 'influencer-kit', tier: 'v4' },
  { order: 33, department: 'Département Commercial', role: 'Le Responsable Distribution Large',
    mission: 'Diffuse hors Amazon (wide), ISBN et dépôt légal.',
    moduleId: 'wide-distribution', tier: 'v4' },
  { order: 34, department: 'Département Commercial', role: 'Le Directeur Commercial',
    mission: 'Pricing intelligent, royalties et bundles.',
    moduleId: 'auto-pricing', tier: 'v4' },
  { order: 35, department: 'Département Commercial', role: "Le Responsable Avis & Réputation",
    mission: 'Booste les avis et optimise votre présence Goodreads.',
    moduleId: 'reviews-booster', tier: 'v4' },
  { order: 36, department: 'Département Commercial', role: 'Le Directeur de Collection',
    mission: 'Bâtit sagas, séries et tunnel de back-catalogue.',
    moduleId: 'p17-series', tier: 'v4' },
];

export const V3_AGENT_COUNT = EDITION_AGENTS.filter((a) => a.tier === 'v3').length; // 22
export const V4_AGENT_COUNT = EDITION_AGENTS.length; // 36

/** Agents visibles selon l'offre détenue (V4 = tout, V3 = 22). */
export function getAgentsForTier(hasFull: boolean): EditionAgent[] {
  return hasFull ? EDITION_AGENTS : EDITION_AGENTS.filter((a) => a.tier === 'v3');
}
