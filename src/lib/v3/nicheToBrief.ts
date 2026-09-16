/**
 * Pont « niche → fiche du livre ».
 * Convertit une niche de la base des 600 niches en brouillon de fiche prêt à
 * remplir le parcours de création (titre, sous-titre, catégorie, synopsis,
 * nombre de chapitres, nombre de mots). Entièrement déterministe : aucune
 * donnée inventée côté marché, on ne réutilise que la niche elle-même.
 */
import type { Niche600 } from '@/data/niches600';

export type NicheStartDraft = {
  title: string;
  subtitle: string;
  author: string;
  category: string;
  synopsis: string;
  chapters: number;
  wordsPerChapter: number;
};

const FICTION_KEYS = ['romance', 'thriller', 'fantasy', 'jeunesse'];
const CARNET_KEYS = ['carnets'];

/** Catégorie de la fiche de création correspondant à la catégorie de niche. */
const CATEGORY_MAP: Record<string, string> = {
  romance: 'Romance',
  thriller: 'Thriller / Policier',
  devperso: 'Développement personnel',
  finance: 'Finances personnelles / Investissement',
  sante: 'Santé / Bien-être',
  cuisine: 'Cuisine / Recettes',
  jeunesse: 'Enfants / Jeunesse',
  parascolaire: 'Éducation / Pédagogie',
  fantasy: 'Fantasy / Fantastique',
  spiritualite: 'Spiritualité',
  carnets: 'Carnet / Journal / Cahier',
  pratique: 'Loisirs créatifs / DIY',
};

export function isFictionNiche(niche: Niche600): boolean {
  return FICTION_KEYS.includes(niche.category);
}

/** Format de départ : chapitres et mots par chapitre selon le type de livre. */
export function nicheFormat(niche: Niche600): { chapters: number; wordsPerChapter: number } {
  if (CARNET_KEYS.includes(niche.category)) return { chapters: 10, wordsPerChapter: 1800 };
  if (isFictionNiche(niche)) return { chapters: 24, wordsPerChapter: 2500 };
  return { chapters: 12, wordsPerChapter: 2200 };
}

function capitalize(text: string): string {
  const clean = text.trim();
  if (!clean) return '';
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

function fictionTitle(niche: Niche600): string {
  return capitalize(niche.niche);
}

function nonFictionTitle(niche: Niche600): string {
  return capitalize(niche.niche);
}

function fictionSubtitle(niche: Niche600): string {
  return `Un roman ${niche.motCleAmazon} à lire d'une traite`;
}

function nonFictionSubtitle(niche: Niche600): string {
  return `La méthode claire, étape par étape, pour ${niche.motCleAmazon}`;
}

function fictionSynopsis(niche: Niche600, chapters: number): string {
  return [
    `Livre de fiction dans la niche « ${niche.niche} » (${niche.sousNiche}).`,
    `Mot-clé Amazon visé : ${niche.motCleAmazon}.`,
    '',
    `Histoire à construire en ${chapters} chapitres : un personnage principal attachant,`,
    'un obstacle qui grandit à chaque chapitre, un tournant au milieu du livre et',
    'une fin qui tient la promesse annoncée en couverture.',
    '',
    'Complétez ce synopsis avec votre intrigue, vos personnages et le lieu de l\'action',
    'avant de lancer la rédaction.',
  ].join('\n');
}

function nonFictionSynopsis(niche: Niche600, chapters: number): string {
  return [
    `Guide pratique dans la niche « ${niche.niche} » (${niche.sousNiche}).`,
    `Mot-clé Amazon visé : ${niche.motCleAmazon}.`,
    '',
    `Le livre répond à un problème précis du lecteur en ${chapters} chapitres :`,
    'diagnostic de la situation, méthode pas à pas, exemples concrets, erreurs à éviter',
    'et plan d\'action final applicable immédiatement.',
    '',
    'Précisez ici votre lecteur idéal et votre expérience personnelle sur le sujet',
    'avant de lancer la rédaction.',
  ].join('\n');
}

/** Mots-clés de catégorie pour reconnaître une niche venue d'une autre liste. */
const LABEL_KEYS: Array<{ key: string; words: string[] }> = [
  { key: 'romance', words: ['romance', 'amour', 'relation', 'rencontre', 'séduction'] },
  { key: 'thriller', words: ['thriller', 'polar', 'policier', 'suspense', 'enquête'] },
  { key: 'fantasy', words: ['fantasy', 'fantastique', 'science-fiction', 'sf', 'imaginaire'] },
  { key: 'jeunesse', words: ['enfant', 'jeunesse', 'kids', 'ado'] },
  { key: 'parascolaire', words: ['éducation', 'education', 'pédagogie', 'scolaire', 'apprentissage'] },
  { key: 'devperso', words: ['développement personnel', 'developpement personnel', 'confiance', 'productivité', 'motivation'] },
  { key: 'finance', words: ['finance', 'argent', 'business', 'entrepreneur', 'carrière', 'investissement'] },
  { key: 'sante', words: ['santé', 'sante', 'bien-être', 'bien etre', 'fitness', 'sport', 'nutrition'] },
  { key: 'cuisine', words: ['cuisine', 'recette', 'gastronomie'] },
  { key: 'spiritualite', words: ['spiritualité', 'spiritualite', 'méditation', 'philosophie', 'éveil'] },
  { key: 'carnets', words: ['carnet', 'journal', 'cahier', 'planner'] },
];

/**
 * Construit une niche exploitable à partir d'un simple intitulé et d'une
 * catégorie libre (bibliothèque de niches, best-sellers…). Aucune donnée de
 * marché n'est inventée : les repères chiffrés restent neutres.
 */
export function nicheFromLabel(label: string, category: string): Niche600 {
  const haystack = `${category} ${label}`.toLowerCase();
  const match = LABEL_KEYS.find((entry) => entry.words.some((w) => haystack.includes(w)));
  return {
    id: 0,
    niche: label.trim(),
    sousNiche: category.trim() || 'Niche',
    motCleAmazon: label.trim().toLowerCase(),
    bsrCible: 0,
    concurrence: 'Modérée',
    potentiel: 3,
    exemplePrix: 0,
    category: match?.key || 'pratique',
    emoji: '📗',
  };
}

/** Brouillon complet de fiche, modifiable par l'auteur avant lancement. */
export function nicheToDraft(niche: Niche600, authorName: string): NicheStartDraft {
  const format = nicheFormat(niche);
  const fiction = isFictionNiche(niche);
  return {
    title: fiction ? fictionTitle(niche) : nonFictionTitle(niche),
    subtitle: fiction ? fictionSubtitle(niche) : nonFictionSubtitle(niche),
    author: authorName || 'Auteur Ebookstudio',
    category: CATEGORY_MAP[niche.category] || 'Autre',
    synopsis: fiction
      ? fictionSynopsis(niche, format.chapters)
      : nonFictionSynopsis(niche, format.chapters),
    chapters: format.chapters,
    wordsPerChapter: format.wordsPerChapter,
  };
}
