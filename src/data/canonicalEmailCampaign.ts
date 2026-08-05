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
    { step: 1, delay: 'J+0', label: 'Offre claire', template: 'offre-47-unique-1', subject: 'Tout EbookStudio à 47 € — voici ce qui est inclus' },
    { step: 2, delay: 'J+2', label: 'Bénéfices', template: 'offre-47-unique-2', subject: 'De votre idée à un livre prêt pour Amazon KDP' },
    { step: 3, delay: 'J+5', label: 'Workflow', template: 'offre-47-unique-3', subject: 'Voici les 5 étapes qui créent votre livre' },
    { step: 4, delay: 'J+7', label: 'Objections', template: 'offre-47-unique-4', subject: 'Paiement, accès, accompagnement : réponses claires' },
    { step: 5, delay: 'J+10', label: 'Échéance', template: 'offre-47-unique-5', subject: 'Le tarif de 47 € se termine le 30 septembre' },
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