export const WELCOME_START = '2026-11-17T11:45:00Z';
export const welcomeStorageKey = (userId: string) => `ebookstudio:welcome:v1:${userId}`;

/** Presentation only: this never grants or changes subscription rights. */
export function shouldShowWelcome(subscriber: { created_at: string; status: string; plan_type: string } | null, completed: boolean): boolean {
  return !completed && subscriber !== null && subscriber.status === 'active'
    && ['subscription', 'annual'].includes(subscriber.plan_type)
    && Date.parse(subscriber.created_at) >= Date.parse(WELCOME_START);
}

export const WELCOME_CHOICES = [
  { title: 'Écrire mon premier livre', to: '/v3/lancer', agent: 'camille', name: 'Camille' },
  { title: 'Corriger mon manuscrit', to: '/v3/corriger', agent: 'victor', name: 'Victor' },
  { title: 'Créer un livre illustré', to: '/v3/create/illustre', agent: 'iris', name: 'Iris' },
] as const;