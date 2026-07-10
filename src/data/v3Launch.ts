// Données du LANCEMENT V3 : order bump + bonus de lancement.
// Source unique de vérité, réutilisée par la page de commande, la page de vente
// et le module Bonus de lancement dans le Hub admin.

import { V3_PRICE, V3_FULL_PACK } from '@/data/roadmapV3';

export type V3OfferKey = 'v3-base' | 'v3-pro';

export interface V3Offer {
  key: V3OfferKey;
  name: string;
  price: number;
  compareAt?: number;
  installments: string[];
  tagline: string;
  features: string[];
  highlight?: boolean;
}

/** Les DEUX offres proposées (OU exclusif — jamais l'addition des deux). */
export const V3_OFFERS: V3Offer[] = [
  {
    key: 'v3-base',
    name: 'V3 — Publication Assistée Pro (22 agents)',
    price: V3_PRICE, // 197
    installments: ['1×197€', '3×69€'],
    tagline: 'Écrire, illustrer, formater et publier proprement sur KDP.',
    features: [
      'Studio de création (15 agents IA)',
      'Studio couvertures pro (dos + 4e + bleed)',
      'Recherche de niche & concurrence',
      'Formatage & export multi-format KDP',
      'Séquence de lancement J-7',
      'Mises à jour à vie · Garantie 7 jours',
    ],
  },
  {
    key: 'v3-pro',
    name: 'V4 — Maison d\'Édition (36 agents)',
    price: V3_FULL_PACK.price, // 347
    compareAt: V3_FULL_PACK.compareAt,
    installments: V3_FULL_PACK.installments,
    tagline: 'Tout pour écrire, publier ET vendre : les 100 modules débloqués.',
    highlight: true,
    features: [
      'Tout ce qu\'inclut la Base',
      'Pack Revenus & Scaling',
      'Pack Distribution',
      'Pack Trafic Social',
      'Pack Qualité Éditoriale',
      'Suite Étude de Marché (type BookBeam)',
      '100 modules · Mises à jour à vie · Garantie 7 jours',
    ],
  },
];

export function getV3Offer(key: V3OfferKey): V3Offer {
  return V3_OFFERS.find((o) => o.key === key) ?? V3_OFFERS[0];
}

/** Order bump optionnel — coché volontairement par l'acheteur, ajouté au total. */
export const V3_ORDER_BUMP = {
  /** Clé addon reconnue par l'edge function stripe-checkout. */
  key: 'v3_order_bump',
  title: 'OUI, j\'ajoute le Pack Guides Avancés KDP',
  short: 'Pack Guides Avancés KDP',
  desc: '3 guides premium (PDF) : Amazon Ads rentables, scaling multi-livres et niches cachées 2026. À ajouter à ma commande.',
  price: 47,
  compareAt: 97,
};

export interface V3LaunchBonus {
  title: string;
  desc: string;
  value: number; // valeur perçue en €
  emoji: string;
}

/** Bonus de lancement mis en avant pour augmenter la valeur perçue. */
export const V3_LAUNCH_BONUSES: V3LaunchBonus[] = [
  {
    title: '50 niches KDP rentables 2026',
    desc: 'Les niches porteuses à attaquer dès maintenant, avec mots-clés associés.',
    value: 47,
    emoji: '🎯',
  },
  {
    title: 'Modèles de couvertures qui convertissent',
    desc: 'Une bibliothèque de directions artistiques prêtes à décliner dans le Studio.',
    value: 39,
    emoji: '🎨',
  },
  {
    title: 'Checklist "Lancement parfait J-7"',
    desc: 'Le plan jour par jour pour maximiser les ventes dès la mise en ligne.',
    value: 29,
    emoji: '🚀',
  },
  {
    title: 'Session de démarrage guidée',
    desc: 'Un parcours en 30 étapes de l\'idée au livre publié, à suivre pas à pas.',
    value: 67,
    emoji: '🧭',
  },
];

export const V3_BONUSES_TOTAL_VALUE = V3_LAUNCH_BONUSES.reduce((s, b) => s + b.value, 0);

export const buildV3PaypalLink = (amount: number, label: string) =>
  `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=boubetgeorges@gmail.com&amount=${amount}&currency_code=EUR&item_name=${encodeURIComponent(label)}`;
