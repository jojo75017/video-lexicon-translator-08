export interface VCBookTitleIdea {
  title: string;
  subtitle: string;
  theme: string;
  description: string;
  categories: string[];
}

/**
 * Idées de fiches prêtes à l'emploi pour les livres VC Books
 * (humour, curiosités, records — dans l'esprit du modèle « Petit Cabinet »).
 * Un clic remplit toute la fiche : titre, sous-titre, thème, description et catégories.
 * Listes éditoriales figées : aucune génération aléatoire.
 */
export const VC_BOOKS_TITLE_IDEAS: VCBookTitleIdea[] = [
  {
    title: 'Le Grand Livre des records absurdes',
    subtitle: 'Des records véridiques qui font sourire',
    theme: 'records absurdes et prouesses parfaitement inutiles',
    description:
      "Un recueil de records bien réels mais parfaitement inutiles : la plus grande peluche du monde, la collection de télécommandes la plus fournie, la file d’attente la plus longue de l’histoire. Chaque pause tient en une page, avec le chiffre exact et sa source. Idéal pour rire deux minutes avant de revenir à autre chose.",
    categories: ['Records et choses incroyables', 'Curiosités et faits étonnants', 'Humour général'],
  },
  {
    title: '1000 curiosités à raconter aux petits coins',
    subtitle: 'Des faits étonnants à lire en 2 minutes',
    theme: 'curiosités courtes à raconter autour de soi',
    description:
      "Mille faits étonnants classés par thèmes de conversation : le corps humain, les animaux, les pays, la nourriture, l’espace. Une à trois lignes par curiosité, une pause après dix faits, et une page de récapitulatif à la fin pour ne rien oublier de ce que vous avez à raconter.",
    categories: ['Curiosités et faits étonnants', 'Blagues, devinettes et énigmes', 'Humour général'],
  },
  {
    title: 'Pourquoi les carottes crient-elles ?',
    subtitle: '150 questions farfelues et leurs vraies réponses',
    theme: 'questions farfelues et réponses sérieuses',
    description:
      "Cent cinquante questions qu’on n’ose pas poser à voix haute, suivies de réponses vraies, documentées et souvent drôles. Chaque question ouvre une pause, chaque réponse tient sur une page. Un livre pour apprendre quelque chose à chaque fois qu’on l’ouvre.",
    categories: ['Sciences amusantes pour enfants', 'Curiosités et faits étonnants', 'Jeux, quiz et activités'],
  },
  {
    title: 'Le Cabinet des machines folles',
    subtitle: 'Les inventions les plus improbables de l’histoire',
    theme: 'inventions improbables et machines inutiles',
    description:
      "Le catalogue des inventions les plus improbables jamais déposées : la machine à lacet automatique, le parapluie pour poule, le grille-pain volant. Pour chaque machine, son inventeur, son année, son usage annoncé et ce qu’elle est devenue. Une pause par machine, avec un dessin noir et blanc.",
    categories: ['Curiosités et faits étonnants', 'Histoires vraies insolites', 'Sciences amusantes pour enfants'],
  },
  {
    title: 'La Grande Encyclopédie du n’importe quoi (mais vrai)',
    subtitle: 'Des centaines de vérités absurdes, vérifiées',
    theme: 'vérités absurdes vérifiées une par une',
    description:
      "Des centaines de vérités qui semblent inventées et qui ne le sont pas, chacune vérifiée et datée. Classées par rubrique comme une vraie encyclopédie, avec un index en fin de livre pour retrouver une perle en dix secondes. Parfait pour picorer au hasard.",
    categories: ['Curiosités et faits étonnants', 'Humour général', 'Records et choses incroyables'],
  },
  {
    title: 'Des chiffres et des blagues',
    subtitle: 'Les nombres les plus drôles du monde',
    theme: 'chiffres, maths et humour',
    description:
      "Les nombres les plus étonnants et les plus drôles du monde, racontés en une pause chacun : le chiffre le plus paresseux, le nombre qui sert de mot de passe aux astronautes, la quantité exacte de miettes produites chaque année. Aucune équation, aucun calcul à faire, juste de quoi rire et retenir un chiffre.",
    categories: ['Jeux, quiz et activités', 'Sciences amusantes pour enfants', 'Humour pour enfants'],
  },
  {
    title: 'Le Mini Musée des objets rigolos',
    subtitle: 'Une visite guidée des objets les plus étonnants',
    theme: 'objets étonnants du quotidien',
    description:
      "Une visite guidée des objets les plus étonnants qui traînent dans une maison : la cuillère en bois, le bouchon de liège, la chaussette orpheline. Chaque vitrine présente trois objets avec leur petite histoire vraie et un dessin noir et blanc. Une salle par pause.",
    categories: ['Curiosités et faits étonnants', 'Éveil et découverte du monde', 'Humour pour enfants'],
  },
  {
    title: 'Questions à dormir debout',
    subtitle: 'Ce que vous n’avez jamais osé demander',
    theme: 'questions embarrassantes et réponses nettes',
    description:
      "Les questions gênantes que tout le monde se pose sans jamais les formuler, suivies de réponses nettes, honnêtes et drôles. Une question par page, une réponse courte, et une pause toutes les dix pages pour reprendre son souffle. Un livre qu’on passe à ses amis sans un mot d’explication.",
    categories: ['Humour général', 'Curiosités et faits étonnants', 'Histoires vraies insolites'],
  },
  {
    title: 'Le Zoo des animaux champions',
    subtitle: 'Les records les plus fous du règne animal',
    theme: 'animaux champions et records du règne animal',
    description:
      "Les animaux qui détiennent les records les plus fous : le plus bruyant, le plus lent, le plus gourmand, le plus doué pour disparaître. Une fiche par champion avec son exploit chiffré, sa durée et un dessin noir et blanc. Une pause par animal, et un quiz de cinq questions à la fin.",
    categories: ['Sciences amusantes pour enfants', 'Records et choses incroyables', 'Éveil et découverte du monde'],
  },
  {
    title: 'Histoires vraies à ne pas y croire',
    subtitle: '50 récits authentiques et irrésistibles',
    theme: 'histoires vraies insolites',
    description:
      "Cinquante récits authentiques qui semblent inventés : un canular qui a fait trembler une ville, un objet égaré retrouvé cinquante ans plus tard, un voyage mal préparé. Chaque histoire tient en une pause, avec sa date, son lieu et sa fin vérifiée. Un récit par page, sans jamais avoir à reprendre le fil.",
    categories: ['Histoires vraies insolites', 'Humour général', 'Curiosités et faits étonnants'],
  },
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
