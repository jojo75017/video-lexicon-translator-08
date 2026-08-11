import { COMMANDER_URL } from './externalLinks';

export const ACTIVE_EMAIL_CAMPAIGN = {
  id: 'offre-47-sequence-2026',
  name: 'Offre 47 € — séquence unique',
  status: 'active' as const,
  sendingBlocked: false,
  price: '47 €',
  regularPrice: '59 €',
  deadline: '30 septembre 2026',
  checkoutUrl: COMMANDER_URL,

  steps: [
    { step: 1, delay: 'J+0', label: 'Offre complète', template: 'offre-47-unique-1', subject: 'Votre idée de livre peut être publiée sur Amazon ce mois-ci' },
    { step: 2, delay: 'J+2', label: 'Avant / après', template: 'offre-47-unique-2', subject: 'De trois lignes d’idée à un manuscrit complet' },
    { step: 3, delay: 'J+5', label: 'Workflow', template: 'offre-47-unique-3', subject: 'Les 5 étapes qui créent votre livre' },
    { step: 4, delay: 'J+7', label: 'Objections', template: 'offre-47-unique-4', subject: '« Je n’écris pas bien », « c’est trop technique » : réponses claires' },
    { step: 5, delay: 'J+10', label: 'Échéance', template: 'offre-47-unique-5', subject: 'Le tarif de 47 € se termine le 30 septembre' },
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
  ],
} as const;


export const ARCHIVED_TEMPLATE_PREFIXES = [
  'standard-', 'interesse-', 'relance-', 'offre-47-serie-', 'ab-47-',
  'v3-incluse-', 'vrai-lien-', 'v3-offre-', 'v2-v3-', 'marie-rachel-',
  'video-demo-', 'v2-lettre-', 'openers-reactivation-', 'clickers-',
];

export const isArchivedEmailTemplate = (template?: string | null) => {
  const value = (template || '').toLowerCase();
  return ARCHIVED_TEMPLATE_PREFIXES.some((prefix) => value.startsWith(prefix));
};