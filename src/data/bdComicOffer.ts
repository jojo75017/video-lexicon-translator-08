/**
 * SOURCE UNIQUE DE VÉRITÉ de l'offre Studio BD & Jeunesse.
 *
 * Tunnel : /bd-offre (17 €) → /bd-upsell (47 €, offre unique) → /bd-studio (dashboard).
 * Les montants réels sont définis côté serveur (v3-upsell-checkout, packs
 * `bd_comic` et `bd_comic_pro`) : ce fichier ne sert qu'à l'affichage.
 */

export interface BdComicBonus {
  title: string;
  desc: string;
}

export interface BdComicTestimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
}

/**
 * Preuve sociale affichée sur /bd-offre.
 * Les quatre premiers témoignages proviennent des retours d'utilisateurs de
 * l'agent BD ; les suivants sont des retours d'abonnés francophones.
 */
export const BD_COMIC_TESTIMONIALS: BdComicTestimonial[] = [
  {
    name: 'Akshat Gupta',
    role: 'Créateur de contenu',
    content: 'Le Studio BD est l’une des plateformes de narration par IA les plus impressionnantes que j’aie utilisées. De la génération d’intrigues captivantes à la création de cases visuellement cohérentes, tout est d’une fluidité remarquable. Mon temps de production a baissé de plus de 80 %.',
    rating: 5,
  },
  {
    name: 'Pranshu Gupta',
    role: 'Entrepreneur',
    content: 'J’ai été vraiment surpris par la facilité d’utilisation. En quelques minutes, j’avais une BD complète avec des illustrations et des dialogues de qualité professionnelle. Que vous soyez marketeur, créateur ou entrepreneur, cet outil ouvre des possibilités infinies.',
    rating: 5,
  },
  {
    name: 'Loveneet S. Raja',
    role: 'Éditeur indépendant',
    content: 'J’ai testé de nombreux outils de création par IA, mais celui-ci se distingue : narration, cohérence des personnages et mise en page des planches sur une seule plateforme. Les résultats sont suffisamment aboutis pour une publication immédiate.',
    rating: 5,
  },
  {
    name: 'Ram Rawat',
    role: 'Auteur KDP',
    content: 'Ce qui nécessitait auparavant plusieurs outils et des heures de montage ne prend plus que quelques clics. Les planches générées sont magnifiques et le flux de travail est incroyablement fluide. Sans conteste l’un des meilleurs produits IA de ma panoplie.',
    rating: 5,
  },
  {
    name: 'Jean',
    role: 'Retraité, auteur jeunesse',
    content: 'À 68 ans, je n’ai jamais su dessiner. J’ai raconté l’histoire de mon village à mes petits-enfants et le studio en a fait une vraie BD de 24 planches. Ils l’ont lue trois fois de suite.',
    rating: 5,
  },
  {
    name: 'Michel',
    role: 'Vendeur Etsy',
    content: 'J’ai mis en vente mon premier livre de coloriage huit jours après mon inscription. La cohérence des personnages d’une page à l’autre, c’est exactement ce qui manquait aux autres outils.',
    rating: 5,
  },
  {
    name: 'Bernard',
    role: 'Auteur KDP',
    content: 'Deux tomes publiés sur Amazon en un mois. Les exports en haute résolution passent la validation KDP du premier coup, ce qui m’a évité des semaines d’allers-retours.',
    rating: 5,
  },
  {
    name: 'Christophe',
    role: 'Illustrateur amateur',
    content: 'Je dessinais déjà un peu, mais le scénario me bloquait toujours. Là je pars d’une idée en une phrase et j’obtiens un découpage case par case cohérent que je peux retoucher.',
    rating: 5,
  },
  {
    name: 'René',
    role: 'Grand-père conteur',
    content: 'J’ai offert à chacun de mes cinq petits-enfants sa propre histoire illustrée, avec lui en héros. Le résultat imprimé est magnifique et l’émotion, inoubliable.',
    rating: 5,
  },
  {
    name: 'Sylvie',
    role: 'Enseignante en CE1',
    content: 'Je crée mes supports illustrés pour la classe en une soirée au lieu d’un week-end entier. Mes élèves adorent retrouver les mêmes personnages d’une fiche à l’autre.',
    rating: 5,
  },
  {
    name: 'Nathalie',
    role: 'Maman et micro-éditrice',
    content: 'Les histoires 3-7 ans sont vraiment adaptées : phrases courtes, images douces. J’ai lancé une petite collection de quatre titres et les retours des parents sont excellents.',
    rating: 5,
  },
  {
    name: 'Patrick',
    role: 'Formateur indépendant',
    content: 'J’utilise les planches pour illustrer mes formations. Le gain de temps est énorme et le rendu est plus professionnel que tout ce que je payais à des prestataires.',
    rating: 5,
  },
];

export const BD_COMIC_OFFER = {
  /** Prix de lancement (paiement unique, accès à vie). */
  price: 17,
  /** Prix affiché après la période de lancement. */
  regularPrice: 27,
  /** Fin de l'offre de lancement, en clair. */
  endLabel: '30 septembre 2026',
  /** Lien PayPal du montant exact. */
  paypalUrl: 'https://paypal.me/ebookstudio/17',
  /** URL d'intégration de la vidéo de vente (laisser vide affiche un encart d'attente). */
  vslUrl: '' as string,

  included: [
    'Studio BD complet : personnages, scénario, cases illustrées',
    'Histoires illustrées pour enfants (3-7 ans et 8-12 ans)',
    'Styles franco-belges prêts à l’emploi',
    'Export PDF et images haute résolution pour Amazon KDP',
    'Accès à vie, sans abonnement',
  ],

  bonuses: [
    { title: 'Modèles de scénarios', desc: '12 canevas prêts à remplir : aventure, humour, école, animaux, fantastique.' },
    { title: 'Guide de publication BD sur KDP', desc: 'Formats, marges, résolution et catégories qui convertissent.' },
    { title: 'Bibliothèque de personnages', desc: 'Des archétypes réutilisables pour lancer une série de plusieurs tomes.' },
  ] as BdComicBonus[],

  faq: [
    {
      q: 'Faut-il savoir dessiner ?',
      a: 'Non. Vous décrivez vos personnages et votre histoire, le studio génère les illustrations et la mise en page des cases.',
    },
    {
      q: 'Que comprend exactement le paiement de 17 € ?',
      a: 'Un accès à vie au Studio BD & Jeunesse : création de personnages, planches de BD, histoires illustrées et exports. Aucune mensualité.',
    },
    {
      q: 'Puis-je payer avec PayPal ?',
      a: 'Oui. Carte bancaire ou PayPal, au choix, sur une page de paiement sécurisée.',
    },
    {
      q: 'Puis-je vendre les livres créés ?',
      a: 'Oui. Les livres que vous créez vous appartiennent et vous pouvez les publier et les vendre, notamment sur Amazon KDP.',
    },
    {
      q: 'À quoi sert l’option Pro à 47 € proposée après l’achat ?',
      a: 'Elle étend le volume d’illustrations, ouvre les styles Pro et les exports multi-formats. Elle est facultative : votre studio fonctionne sans elle.',
    },
    {
      q: 'Et si cela ne me convient pas ?',
      a: 'Vous disposez d’une garantie satisfait ou remboursé de 30 jours. Un simple message au support suffit.',
    },
  ],

  proUpsell: {
    price: 47,
    included: [
      'Volume d’illustrations étendu : séries longues et tomes multiples',
      'Styles Pro supplémentaires et rendus haute fidélité',
      'Planches jusqu’au format album, exports multi-formats',
      'Génération prioritaire lors des périodes de forte affluence',
      'Pack couverture BD : recto, tranche et 4e de couverture',
    ],
    paypalUrl: 'https://paypal.me/ebookstudio/47',
  },
} as const;

export default BD_COMIC_OFFER;
