import { describe, expect, it } from 'vitest';
import { shouldShowWelcome, welcomeStorageKey, WELCOME_CHOICES } from './subscriberWelcome';

const newSubscriber = { created_at: '2026-11-17T11:46:00Z', status: 'active', plan_type: 'subscription' };
describe('premiers pas abonnés', () => {
  it('présente les trois parcours existants aux nouveaux abonnés mensuels et annuels', () => {
    expect(shouldShowWelcome(newSubscriber, false)).toBe(true);
    expect(shouldShowWelcome({ ...newSubscriber, plan_type: 'annual' }, false)).toBe(true);
    expect(WELCOME_CHOICES.map(c => c.to)).toEqual(['/v3/lancer', '/v3/corriger', '/v3/create/illustre']);
  });
  it('ne change pas l’accueil des anciens abonnés', () => {
    expect(shouldShowWelcome({ ...newSubscriber, created_at: '2026-11-16T12:00:00Z' }, false)).toBe(false);
    expect(shouldShowWelcome({ ...newSubscriber, plan_type: 'lifetime' }, false)).toBe(false);
  });
  it('ne présente pas l’accueil sans abonnement actif', () => {
    expect(shouldShowWelcome(null, false)).toBe(false);
    expect(shouldShowWelcome({ ...newSubscriber, status: 'inactive' }, false)).toBe(false);
  });
  it('respecte le choix déjà fait et isole sa mémorisation par compte', () => {
    expect(shouldShowWelcome(newSubscriber, true)).toBe(false);
    expect(welcomeStorageKey('georges')).not.toBe(welcomeStorageKey('other'));
  });
});