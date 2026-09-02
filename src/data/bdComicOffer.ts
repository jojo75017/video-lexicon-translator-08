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
