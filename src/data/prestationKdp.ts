/**
 * Grille de prestation « clé en main » KDP.
 *
 * Source unique pour la page /prestation-kdp. Volontairement séparée de
 * `v3Pricing.ts` : il s'agit d'un service réalisé par nous, pas d'un abonnement.
 * Ne jamais mélanger ces montants avec les tarifs Plume (27 €) et Édition (47 €).
 */

export type PrestationFormula = {
  id: 'essentiel' | 'complete' | 'cle-en-main';
  name: string;
  tagline: string;
  price: number;
  highlight?: boolean;
  includes: string[];
};

/** Base tarifaire : livre de 100 à 150 pages. */
export const PRESTATION_BASE_PAGES_MIN = 100;
export const PRESTATION_BASE_PAGES_MAX = 150;

/** Majoration pour un délai express de 5 à 7 jours. */
export const PRESTATION_EXPRESS_RATE = 0.2;

/** Supplément par page au-delà de PRESTATION_BASE_PAGES_MAX. */
export const PRESTATION_EXTRA_PAGE_PRICE = 1;

export const PRESTATION_FORMULAS: PrestationFormula[] = [
  {
    id: 'essentiel',
    name: 'Essentiel',
    tagline: 'Votre couverture et vos fichiers prêts pour Amazon.',
    price: 149,
    includes: [
      'Couverture complète : 1re de couverture, dos et 4e de couverture',
      'Dos calculé selon le nombre de pages et le type de papier',
      'Fichiers conformes aux exigences Amazon KDP',
      'Deux séries de modifications incluses',
    ],
  },
  {
    id: 'complete',
    name: 'Complète',
    tagline: 'Le texte corrigé, mis en page, et la couverture.',
    price: 349,
    highlight: true,
    includes: [
      'Tout ce que contient la formule Essentiel',
      'Relecture et correction du texte en français',
      'Mise en page intérieure du livre (broché)',
      'Préparation de la version Kindle',
      'Trois séries de modifications incluses',
    ],
  },
  {
    id: 'cle-en-main',
    name: 'Clé en main',
    tagline: 'Tout est préparé, il ne reste qu’à valider.',
    price: 449,
    includes: [
      'Tout ce que contient la formule Complète',
      'Titre, description commerciale, catégories et mots-clés',
      'Accompagnement à la publication : visio ou guide pas à pas',
      'Vérification finale des fichiers avant mise en vente',
      'Modifications illimitées pendant 15 jours',
    ],
  },
];

export const PRESTATION_OPTIONS = [
  {
    label: 'Délai express 5 à 7 jours',
    detail: 'Majoration de 20 % sur la formule choisie.',
  },
  {
    label: 'Livre de plus de 150 pages',
    detail: '1 € par page supplémentaire.',
  },
  {
    label: 'Couverture rigide (hardcover)',
    detail: 'Sur devis, calculée d’après les dimensions Amazon.',
  },
];

export const PRESTATION_NOT_INCLUDED = [
  'La rédaction du livre à votre place : nous travaillons sur votre texte.',
  'La traduction du livre dans une autre langue.',
  'La promotion et la publicité du livre après sa mise en vente.',
  'Aucune garantie de ventes ni de classement Amazon.',
];

export const PRESTATION_DELAY = 'Délai standard : 10 à 15 jours. Délai express : 5 à 7 jours avec la majoration.';

/**
 * Sur la publication : nous accompagnons l'auteur, la décision de publier
 * directement depuis son compte reste traitée au cas par cas dans le devis.
 */
export const PRESTATION_PUBLICATION_NOTE =
  'La publication se fait depuis votre compte Amazon KDP, qui doit rester le vôtre. Nous préparons tous les fichiers et nous vous accompagnons pas à pas, en visio si besoin, jusqu’à la mise en vente. Si vous souhaitez que nous effectuions nous-mêmes le téléversement, cela se décide au moment du devis et nécessite un accord écrit sur l’usage de vos accès.';

/** Calcul du prix d'un projet, arrondi à l'euro. */
export function computePrestationPrice(options: {
  formula: PrestationFormula['id'];
  pages: number;
  express: boolean;
}): { base: number; extraPages: number; express: number; total: number } {
  const formula = PRESTATION_FORMULAS.find((item) => item.id === options.formula) ?? PRESTATION_FORMULAS[0];
  const base = formula.price;
  const extraPages =
    options.pages > PRESTATION_BASE_PAGES_MAX
      ? (options.pages - PRESTATION_BASE_PAGES_MAX) * PRESTATION_EXTRA_PAGE_PRICE
      : 0;
  const subtotal = base + extraPages;
  const express = options.express ? Math.round(subtotal * PRESTATION_EXPRESS_RATE) : 0;
  return { base, extraPages, express, total: subtotal + express };
}

/**
 * Réponse type à envoyer à un auteur qui demande une prestation clé en main
 * pour un manuel d'environ 107 pages avec un délai de 5 à 7 jours.
 */
export const PRESTATION_REPLY_TEMPLATE = `Bonjour,

Merci pour votre message et pour le détail de votre projet.

Oui, je peux prendre en charge votre manuel de français A1 de 107 pages en prestation complète.

PRIX TOTAL : 539 € TTC, couverture comprise.
(Formule Clé en main 449 € + majoration délai express 90 €)

DÉLAI : 5 à 7 jours ouvrés à compter de la réception de votre fichier et du règlement de l'acompte.

CE QUI EST INCLUS :
- relecture et correction du texte en français ;
- mise en page intérieure du manuel, adaptée au format broché ;
- couverture complète : 1re de couverture, dos calculé selon vos 107 pages, et 4e de couverture ;
- préparation de la version Kindle ;
- fichiers PDF et image conformes aux exigences Amazon KDP ;
- titre, description commerciale, catégories et mots-clés ;
- modifications illimitées pendant 15 jours après livraison.

PUBLICATION SUR VOTRE COMPTE KDP :
Les fichiers sont livrés prêts à téléverser, et je vous accompagne pas à pas jusqu'à la mise en vente, en visio si vous le souhaitez : vous cliquez, je vous guide. Votre compte reste ainsi entièrement sous votre contrôle. Si vous préférez que j'effectue moi-même le téléversement, nous pouvons en convenir par écrit avant de commencer.

RÈGLEMENT : 50 % à la commande, 50 % à la livraison des fichiers validés.

Si cela vous convient, envoyez-moi votre fichier (Word ou PDF) et je démarre.

Bien cordialement,
Georges Boubet — EbookStudio
boubetgeorges@gmail.com`;
