import { SPECIAL_BOOK_TABS } from './specialBookTabs';

export type MenuLink = { label: string; to: string; badge?: string; desc?: string };
export type MenuCategory = {
  key: string;
  label: string;
  emoji: string;
  color: string; // accent
  links: MenuLink[];
};

export const V3_HEADER_MENU: MenuCategory[] = [
  {
    key: 'creer',
    label: 'Créer',
    emoji: '📘',
    color: '#F59E0B',
    links: [
      { label: 'Plan du livre', to: '/v3/create', desc: 'Assistant en 4 étapes' },
      { label: 'Personnages', to: '/v3/create?step=3' },
      { label: 'Importer un document', to: '/v3/create?import=1' },
      { label: 'Modèles / Templates', to: '/fiches-pratiques' },
      { label: 'Sommaire ultime', to: '/v3/outils/sommaire-ultime', badge: 'NEW' },
    ],
  },
  {
    key: 'ecrire',
    label: 'Écrire',
    emoji: '✍️',
    color: '#F97316',
    links: [
      { label: 'Générateur V2', to: '/ebook-planner', desc: '15 agents éprouvés' },
      { label: 'Parcours 30 agents', to: '/v3/hub?tab=parcours' },
      { label: 'Outils V3', to: '/v3/hub?tab=outils' },
      { label: 'BookPerfect AI', to: '/v3/hub?tab=bookperfect' },
      { label: "Parler avec l'IA", to: '/v3/hub?tab=assistant' },
    ],
  },
  {
    key: 'habiller',
    label: 'Habiller',
    emoji: '🎨',
    color: '#8B5CF6',
    links: [
      { label: 'Couverture KDP Studio', to: '/couverture-kdp' },
      { label: 'Cover Studio Pro V3', to: '/v3/hub?tab=cover-pro', badge: 'PRO' },
      { label: 'Illustrations intérieures', to: '/v3/outils/illustrations' },
      { label: 'Documentation Studio', to: '/v3/hub?tab=documentation' },
    ],
  },
  {
    key: 'publier',
    label: 'Publier',
    emoji: '🚀',
    color: '#0EA5A4',
    links: [
      { label: 'KDP Pilot / Audit', to: '/audit-pilot' },
      { label: 'Mots-clés Amazon (KDSpy)', to: '/kdp-keywords' },
      { label: '600 Niches', to: '/niches-600', badge: 'NEW' },
      { label: 'Amazon Spy', to: '/v3/outils/amazon-spy' },
      { label: 'Exporter le livre', to: '/v3/hub?tab=export' },
    ],
  },
  {
    key: 'vendre',
    label: 'Vendre',
    emoji: '💛',
    color: '#EC4899',
    links: [
      { label: 'Galerie communauté', to: '/v3/gallery' },
      { label: 'Ma page auteur', to: '/v3/auteur' },
      { label: 'Signature email', to: '/v3/outils/signature' },
      { label: 'Marketing / Emails', to: '/v3/hub?tab=marketing' },
    ],
  },
  {
    key: 'livres',
    label: 'Livres spéciaux',
    emoji: '📚',
    color: '#8B5CF6',
    links: SPECIAL_BOOK_TABS.map((t) => ({
      label: t.label,
      to: `/v3/livres/${t.slug}`,
    })),
  },
];
