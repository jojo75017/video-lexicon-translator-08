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

/** Brouillon complet de fiche, modifiable par l'auteur avant lancement. */
export function nicheToDraft(niche: Niche600, authorName: string): NicheStartDraft {
  const format = nicheFormat(niche);
  const fiction = isFictionNiche(niche);
  return {
    title: fiction ? fictionTitle(niche) : nonFictionTitle(niche),
    subtitle: fiction ? fictionSubtitle(niche) : nonFictionSubtitle(niche),
    author: authorName || 'Auteur Ebookstudio',
    category: CATEGORY_MAP[niche.category] || 'Guide pratique',
    synopsis: fiction
      ? fictionSynopsis(niche, format.chapters)
      : nonFictionSynopsis(niche, format.chapters),
    chapters: format.chapters,
    wordsPerChapter: format.wordsPerChapter,
  };
}
