import type { ProBookTier } from '@/hooks/useProBookTier';

export type ProBookModule =
  | 'documentary'
  | 'atlas'
  | 'recipe'
  | 'travel'
  | 'encyclopedia'
  | 'coloring'
  | 'agenda'
  | 'scolaire'
  | 'pedagogique'
  | 'comic'
  | 'diary'
  | 'aquarium'
  | 'bird'
  | 'multitome';

export interface ProBookLimits {
  maxSections: number;
  wordsPerSection: [number, number];
  imagesPerSection: number;
  extras: string[];
}

const MATRIX: Record<ProBookModule, Record<ProBookTier, ProBookLimits>> = {
  documentary: {
    standard: {
      maxSections: 15,
      wordsPerSection: [400, 800],
      imagesPerSection: 1,
      extras: ['Sommaire', 'Remerciements'],
    },
    pro: {
      maxSections: 60,
      wordsPerSection: [1500, 2500],
      imagesPerSection: 3,
      extras: ['Encadrés "Le saviez-vous"', 'Citations sourcées', 'Bibliographie auto', 'Index', 'À propos de l\'auteur'],
    },
  },
  atlas: {
    standard: {
      maxSections: 15,
      wordsPerSection: [300, 600],
      imagesPerSection: 1,
      extras: ['Sommaire', 'Fiche pays courte'],
    },
    pro: {
      maxSections: 60,
      wordsPerSection: [1200, 2000],
      imagesPerSection: 2,
      extras: ['Géographie / Histoire / Culture / Économie', 'Encadrés chiffrés', 'Index alphabétique', 'Format paysage 2 colonnes'],
    },
  },
  recipe: {
    standard: {
      maxSections: 15,
      wordsPerSection: [200, 400],
      imagesPerSection: 1,
      extras: ['Ingrédients + étapes + temps'],
    },
    pro: {
      maxSections: 60,
      wordsPerSection: [600, 1000],
      imagesPerSection: 2,
      extras: ['Astuces chef', 'Variantes', 'Valeurs nutritionnelles', 'Difficulté & portions', 'Index par ingrédient'],
    },
  },
  travel: {
    standard: {
      maxSections: 15,
      wordsPerSection: [400, 700],
      imagesPerSection: 1,
      extras: ['Itinéraire jour par jour', 'Top lieux'],
    },
    pro: {
      maxSections: 60,
      wordsPerSection: [1200, 2000],
      imagesPerSection: 2,
      extras: ['Où dormir / manger par gamme', 'Budget estimé', 'Phrases utiles', 'Sécurité & santé', 'Checklist voyage', 'Carte itinéraire IA'],
    },
  },
};

export function getProBookLimits(module: ProBookModule, tier: ProBookTier): ProBookLimits {
  return MATRIX[module][tier];
}

export const PRO_MODULE_LABELS: Record<ProBookModule, string> = {
  documentary: 'Documentaire',
  atlas: 'Atlas',
  recipe: 'Livre de cuisine',
  travel: 'Guide de voyage',
};
