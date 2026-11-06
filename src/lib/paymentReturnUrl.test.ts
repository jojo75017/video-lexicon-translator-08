import { describe, expect, it } from 'vitest';
import { stripeThankYouUrl } from './paymentReturnUrl';

describe('payment return address', () => {
  it('sends the buyer to the public thank-you page, not to the pricing page', () => {
    const url = stripeThankYouUrl('https://ebookstudio.fr', 'Auteur · 29 €/mois');
    expect(url.startsWith('https://ebookstudio.fr/merci?')).toBe(true);
    expect(url).not.toContain('/v3/offres');
    expect(url).not.toContain('/forfaits');
  });

  it('keeps the Stripe session marker literal so Stripe can fill it in', () => {
    const url = stripeThankYouUrl('https://ebookstudio.fr', 'Débutant · 19 €/mois');
    expect(url).toContain('session_id={CHECKOUT_SESSION_ID}');
  });

  it('keeps the plan label readable after encoding', () => {
    const url = stripeThankYouUrl('https://ebookstudio.fr', 'Édition VIP · 59 €/mois');
    expect(decodeURIComponent(url.split('plan=')[1])).toBe('Édition VIP · 59 €/mois');
  });
});
