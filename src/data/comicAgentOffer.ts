/**
 * SOURCE UNIQUE — offre externe Ebook Comic Agent.
 *
 * Page de présentation publique (`/comic-agent`) qui renvoie vers le vrai
 * tunnel de vente externe. Aucun paiement n'est encaissé par EbookStudio et
 * aucun accès n'est déverrouillé dans l'application : c'est une offre partenaire.
 */

export interface ComicModule {
  icon: string;
  title: string;
  desc: string;
}

export interface ComicBonus {
  title: string;
  desc: string;
  value: number;
}

export interface ComicFaqItem {
  q: string;
  a: string;
}

export const COMIC_AGENT = {
  /** Vrai tunnel de vente partenaire. */
  funnelUrl: 'https://www.trafic-affiliation.com/comic_agent_ia-5f0cc13e',
  /** Lien indiqué comme étant l'éditeur / la plateforme d'achat. */
  publisherLabel: "offre partenaire, paiement et accès sur le site de l'éditeur",

  headline: 'Créez et vendez des bandes dessinées avec l’IA — aucun talent de dessin requis',
  tagline:
    'De la première idée de scénario jusqu’à la mise en vente sur Amazon KDP et Etsy. L’IA génère les illustrations, les dialogues, les couvertures… tout. Et vous gardez 100 % des droits.',

  price: 47,
  regularPrice: 97,
  guaranteeDays: 30,
  /** Fin de l'exclusivité de lancement. */
  endISO: '2026-12-31T23:59:59Z',
  endLabel: '31 décembre 2026',

  claimCreators: 'plus de 2 400 créateurs',

  modules: [
    { icon: 'Users', title: 'Agent BD', desc: 'Vous donnez une idée, l’IA génère une bande dessinée complète, page par page, avec les dialogues et les illustrations.' },
    { icon: 'Palette', title: 'Créateur de couvertures', desc: 'Des couvertures professionnelles prêtes pour Amazon, en un clic.' },
    { icon: 'UserCheck', title: 'Cohérence des personnages', desc: 'Vos personnages restent identiques sur toutes les pages, pour un livre cohérent.' },
    { icon: 'Brush', title: 'Studio de coloriage', desc: 'Créez des livres de coloriage haute qualité, prêts à imprimer et vendre.' },
    { icon: 'Puzzle', title: 'Packs d’activités', desc: 'Labyrinthes, mots mêlés, jeux de logique pour enfants.' },
    { icon: 'Megaphone', title: 'Suite marketing', desc: 'Descriptions produits, fiches Amazon, publicités, tout généré par l’IA.' },
    { icon: 'Languages', title: 'Traducteur 12 langues', desc: 'Vendez vos livres à l’international immédiatement.' },
  ] as ComicModule[],

  bonuses: [
    { title: '100 prompts BD premium', desc: 'Des scénarios et directions artistiques prêts à l’emploi.', value: 197 },
    { title: '50 couvertures modifiables', desc: 'Des modèles de couvertures à personnaliser pour vos titres.', value: 297 },
    { title: 'Formation KDP & Etsy', desc: 'La formation complète pour publier et vendre sur les bonnes places de marché.', value: 397 },
  ] as ComicBonus[],

  audience: [
    'Débutants qui veulent créer sans savoir dessiner',
    'Auteurs indépendants qui cherchent une niche visuelle rentable',
    'Vendeurs e-commerce qui veulent lancer des produits illustrés',
    'Illustrateurs qui veulent aller plus vite grâce à l’IA',
  ],

  faq: [
    {
      q: 'Faut-il savoir dessiner ?',
      a: 'Non. L’IA génère les illustrations, les dialogues et les couvertures à partir de vos idées. Aucune compétence en dessin n’est nécessaire.',
    },
    {
      q: 'À qui appartiennent les livres créés ?',
      a: 'Vous gardez 100 % des droits. La licence commerciale est incluse, sans aucune redevance : vous publiez et vendez librement.',
    },
    {
      q: 'Que se passe-t-il après l’achat ?',
      a: 'Vous êtes redirigé vers le site de l’éditeur pour finaliser le paiement et ouvrir votre accès. EbookStudio présente l’offre mais n’encaisse pas le paiement.',
    },
    {
      q: 'Y a-t-il une garantie ?',
      a: `Oui, une garantie satisfait ou remboursé de ${30} jours est proposée par l’éditeur de l’outil.`,
    },
    {
      q: 'Le prix va-t-il augmenter ?',
      a: `Le tarif de lancement est de 47 € au lieu de 97 € jusqu’au 31 décembre 2026. Après cette date, le prix habituel pourra s’appliquer.`,
    },
  ] as ComicFaqItem[],
};

export const COMIC_BONUS_TOTAL = COMIC_AGENT.bonuses.reduce((sum, b) => sum + b.value, 0);
