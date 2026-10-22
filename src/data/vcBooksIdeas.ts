export interface VCBookTitleIdea {
  title: string;
  subtitle: string;
}

/**
 * Idées de titres et sous-titres prêtes à l'emploi pour les livres VC Books
 * (humour, curiosités, records — dans l'esprit du modèle « Petit Cabinet »).
 * Listes éditoriales figées : aucune génération aléatoire.
 */
export const VC_BOOKS_TITLE_IDEAS: VCBookTitleIdea[] = [
  { title: 'Le Grand Livre des records absurdes', subtitle: 'Des records véridiques qui font sourire' },
  { title: '1000 curiosités à raconter aux petits coins', subtitle: 'Des faits étonnants à lire en 2 minutes' },
  { title: 'Pourquoi les carottes crient-elles ?', subtitle: '150 questions farfelues et leurs vraies réponses' },
  { title: 'Le Cabinet des machines folles', subtitle: 'Les inventions les plus improbables de l’histoire' },
  { title: 'La Grande Encyclopédie du n’importe quoi (mais vrai)', subtitle: 'Des centaines de vérités absurdes, vérifiées' },
  { title: 'Des chiffres et des blagues', subtitle: 'Les nombres les plus drôles du monde' },
  { title: 'Le Mini Musée des objets rigolos', subtitle: 'Une visite guidée des objets les plus étonnants' },
  { title: 'Questions à dormir debout', subtitle: 'Ce que vous n’avez jamais osé demander' },
  { title: 'Le Zoo des animaux champions', subtitle: 'Les records les plus fous du règne animal' },
  { title: 'Histoires vraies à ne pas y croire', subtitle: '50 récits authentiques et irrésistibles' },
];

/**
 * Catégories KDP adaptées aux livres VC Books (humour, curiosités, jeunesse).
 * L’auteur en choisit deux ou trois et les retrouve dans son tableau de bord KDP.
 */
export const VC_BOOKS_CATEGORIES: string[] = [
  'Humour pour enfants',
  'Blagues, devinettes et énigmes',
  'Curiosités et faits étonnants',
  'Records et choses incroyables',
  'Jeux, quiz et activités',
  'Lecture facile pour enfants (6-8 ans)',
  'Sciences amusantes pour enfants',
  'Histoires vraies insolites',
  'Humour général',
  'Éveil et découverte du monde',
];

export function parseVCBookCategories(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function formatVCBookCategories(categories: string[]): string {
  return categories.join(', ');
}
