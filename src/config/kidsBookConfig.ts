// Configuration du mode "Livre illustré maternelle"
// Réservé aux forfaits Studio (expert) et Éditeur (auteur).

import type { V3Plan } from '@/data/v3ToolPlans';

export const KIDS_BOOK_ALLOWED_PLANS: V3Plan[] = ['expert', 'auteur'];

export type IllustrationStyle = 'pixar-3d' | 'aquarelle' | 'crayonne' | 'flat-vector' | 'storybook';

export const ILLUSTRATION_STYLES: { id: IllustrationStyle; label: string; prompt: string }[] = [
  { id: 'pixar-3d', label: 'Pixar 3D moderne', prompt: 'modern Pixar-style 3D render, soft lighting, cinematic, expressive character' },
  { id: 'aquarelle', label: 'Aquarelle douce', prompt: 'soft watercolor illustration, gentle pastel colors, storybook feel, hand-painted texture' },
  { id: 'crayonne', label: 'Crayonné coloré', prompt: 'colored pencil children book illustration, warm textures, hand-drawn' },
  { id: 'flat-vector', label: 'Vectoriel plat', prompt: 'flat vector kids illustration, bold clean shapes, bright cheerful palette' },
  { id: 'storybook', label: 'Album jeunesse classique', prompt: 'classic children storybook illustration, whimsical, detailed, warm palette' },
];

export const KIDS_BOOK_FORMATS = {
  albumSquare: { label: 'Album carré 21,59 × 21,59 cm', width: 21.59, height: 21.59 },
} as const;

// Quotas d'illustrations par livre selon le forfait
export const KIDS_BOOK_IMAGE_QUOTA: Record<V3Plan, number> = {
  debutant: 0,
  expert: 30,
  auteur: 60,
};

// Modèle image par forfait
export const KIDS_BOOK_IMAGE_MODEL: Record<V3Plan, string> = {
  debutant: 'google/gemini-3.1-flash-image',
  expert: 'google/gemini-3.1-flash-image',
  auteur: 'google/gemini-3-pro-image',
};

export function canUseKidsBook(plan: V3Plan | null | undefined): boolean {
  if (!plan) return false;
  return KIDS_BOOK_ALLOWED_PLANS.includes(plan);
}

// Presets — chaque preset pré-remplit les paramètres du livre illustré
export type KidsPresetId = 'maternelle-3-6' | 'histoires-du-soir-3-7';

export interface KidsPreset {
  id: KidsPresetId;
  label: string;
  targetAge: string;
  chapterCount: number;
  wordsPerStory: number;
  defaultStyle: IllustrationStyle;
  tone: string; // injecté dans le prompt agent-kids-stories
  titleHint?: string;
  badge?: string;
}

export const KIDS_BOOK_PRESETS: Record<KidsPresetId, KidsPreset> = {
  'maternelle-3-6': {
    id: 'maternelle-3-6',
    label: 'Maternelle 3-6 ans',
    targetAge: '3-6 ans',
    chapterCount: 10,
    wordsPerStory: 120,
    defaultStyle: 'pixar-3d',
    tone: 'Ton joyeux, coloré, dynamique, adapté à des enfants de 3 à 6 ans en maternelle.',
  },
  'histoires-du-soir-3-7': {
    id: 'histoires-du-soir-3-7',
    label: 'Histoires du soir 3-7 ans',
    targetAge: '3-7 ans',
    chapterCount: 20,
    wordsPerStory: 175,
    defaultStyle: 'aquarelle',
    tone: 'Ton doux, apaisant, propice au coucher. Chaque histoire se termine par une fin rassurante qui invite au sommeil (bâillement, doudou, câlin, lumière tamisée, rêves paisibles). Vocabulaire riche mais accessible aux 3-7 ans.',
    titleHint: 'Histoires du soir',
    badge: 'Nouveau',
  },
};


export interface CharacterBible {
  name: string;
  age: string;
  physical: string;      // "garçon 4 ans, cheveux bruns bouclés, yeux marron, joues rondes"
  outfit: string;        // "t-shirt vert, short bleu, baskets blanches"
  personality?: string;
}

export interface KidsStory {
  id: string;
  title: string;
  synopsis: string;      // 1-2 phrases servant à générer l'illustration
  content?: string;      // texte final de l'histoire
  illustrationUrl?: string;
}

export interface KidsBookDraft {
  title: string;
  subtitle?: string;
  authorName: string;      // OBLIGATOIRE — affiché sur couverture et page de titre
  synopsis?: string;       // pitch du livre — sert de fil rouge à toutes les histoires
  targetAge: string;       // "3-6 ans"
  style: IllustrationStyle;
  chapterCount?: number;   // nombre d'histoires à générer
  wordsPerStory?: number;  // longueur cible par histoire
  character: CharacterBible;
  stories: KidsStory[];
  coverUrl?: string;       // 1ère de couverture générée par IA
  backCoverUrl?: string;   // 4ème de couverture générée par IA
  backCoverText?: string;  // résumé/pitch imprimé sur la 4e de couverture
  spineText?: string;      // texte affiché sur la tranche (titre + auteur)
}

/**
 * Calcul KDP de la largeur de tranche (spine) pour un livre couleur
 * standard (papier 60#, blanc). Formule Amazon : pages × 0.0025 pouces.
 * @param pageCount nombre total de pages intérieures du livre
 * @returns { inches, mm, cm } — largeur de tranche
 */
export function computeSpineWidth(pageCount: number): { inches: number; mm: number; cm: number } {
  const safe = Math.max(24, Math.min(828, Math.round(pageCount)));
  const inches = safe * 0.0025;
  const mm = inches * 25.4;
  return { inches, mm, cm: mm / 10 };
}


export function buildCharacterBibleText(c: CharacterBible): string {
  return [
    `Personnage principal: ${c.name}, ${c.age}.`,
    `Apparence: ${c.physical}.`,
    `Tenue: ${c.outfit}.`,
    c.personality ? `Personnalité: ${c.personality}.` : '',
    'IMPORTANT: le personnage doit rester STRICTEMENT identique (même visage, mêmes vêtements) d\'une illustration à l\'autre.',
  ].filter(Boolean).join(' ');
}
