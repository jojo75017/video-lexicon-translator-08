import { describe, it, expect } from 'vitest';
import { isDedicatedReviewer, reviewerSubscription } from '../../supabase/functions/_shared/reviewerRules';
describe('JVZoo review account boundaries', () => {
  it('grants Auteur and not Edition or administrator', () => {
    const grant = reviewerSubscription('review@example.com', 'user-id', 'CODE', '2026-11-15T00:00:00Z');
    expect(grant.plan_tier).toBe('auteur');
    expect(grant.status).toBe('active');
    expect(grant).not.toHaveProperty('role');
    expect(grant).not.toHaveProperty('stripe_subscription_id');
  });
  it('refuses management of ordinary customer accounts', () => {
    expect(isDedicatedReviewer({})).toBe(false);
    expect(isDedicatedReviewer({ reviewer_kind: 'client' })).toBe(false);
    expect(isDedicatedReviewer({ reviewer_kind: 'jvzoo-auteur' })).toBe(true);
  });
});