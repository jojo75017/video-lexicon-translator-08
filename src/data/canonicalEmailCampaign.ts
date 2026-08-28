import { COMMANDER_URL } from './externalLinks';

export const ACTIVE_EMAIL_CAMPAIGN = {
  id: 'fin-47-lancement-v3-2026',
  name: 'Rappels fin du 47 € (30 septembre) + lancement V3 (1er octobre) — 21 au 30 septembre',
  status: 'active' as const,
  sendingBlocked: false,
  price: '47 €',
  afterOffer: 'abonnement mensuel sans engagement : 27 €/mois (Plume) ou 47 €/mois (Édition)',
  deadline: '30 septembre 2026',
  checkoutUrl: COMMANDER_URL,

  steps: [
    { step: 1, delay: '21 août', label: 'R1 — Fin du 47 € le 30 septembre', template: 'rappel-47-1', subject: 'L’accès à 47 € se termine le 30 septembre' },
    { step: 2, delay: '24 août', label: 'R2 — La vidéo démo', template: 'rappel-47-2', subject: 'Un livre complet, du sommaire au fichier Amazon' },
    { step: 3, delay: '27 août', label: 'R3 — Objections', template: 'rappel-47-3', subject: '« Je n’écris pas bien », « c’est trop technique » : mes réponses' },
    { step: 4, delay: '29 août', label: 'R4 — Ce qui change le 1er octobre', template: 'rappel-47-4', subject: 'Ce qui change vraiment le 1er octobre' },
    { step: 5, delay: '30 septembre', label: 'R5 — Dernier jour', template: 'rappel-47-5', subject: 'Dernier jour : 47 € ce soir, abonnement ensuite' },
    { step: 6, delay: '22 août', label: 'R6 — Page méthode (/methode)', template: 'rappel-47-6', subject: 'Pas une formation. Un système.' },
  ],

} as const;


/** Campagne de clôture de l'offre 47 € : envois manuels depuis /gestion-prospects. */
export const CLOSING_EMAIL_CAMPAIGN = {
  id: 'cloture-47-2026',
  name: 'Clôture 47 € — cliqueurs et ouvreurs',
  deadline: '30 septembre 2026',
  checkoutUrl: COMMANDER_URL,
  letters: [
    { template: 'cliqueurs-personnel', segment: 'clickers', label: 'Message personnel aux cliqueurs', subject: "Vous avez regardé EbookStudio — qu'est-ce qui vous retient ?" },
    { template: 'cloture-47-1', segment: 'openers_no_click', label: 'Ce qui change le 1er octobre', subject: "Le 1er octobre, l'accès à vie disparaît (le calcul est simple)" },
    { template: 'cloture-47-2', segment: 'openers_no_click', label: 'La preuve en images', subject: 'Un livre entier, du sommaire au fichier Amazon' },
    { template: 'cloture-47-3', segment: 'openers_no_click', label: 'Dernier jour utile', subject: "Dernier rappel : après le 30 septembre, ce tarif n'existe plus" },
    { template: 'relance-niches-1', segment: 'no_click', label: '10 niches offertes (non-cliqueurs)', subject: "10 niches Amazon rentables, offertes (même si vous n'achetez rien)" },
    { template: 'offre-47-directe', segment: 'all', label: 'Offre directe 47 € (test de clics)', subject: "47 € une fois, à vie — jusqu'au 30 septembre" },

  ],
} as const;


export const ARCHIVED_TEMPLATE_PREFIXES = [
  'standard-', 'interesse-', 'relance-', 'offre-47-serie-', 'ab-47-',
  'v3-incluse-', 'vrai-lien-', 'v3-offre-', 'v2-v3-', 'marie-rachel-',
  'video-demo-', 'fin-47-v3-', 'v2-lettre-', 'openers-reactivation-', 'clickers-',
];

export const isArchivedEmailTemplate = (template?: string | null) => {
  const value = (template || '').toLowerCase();
  return ARCHIVED_TEMPLATE_PREFIXES.some((prefix) => value.startsWith(prefix));
};