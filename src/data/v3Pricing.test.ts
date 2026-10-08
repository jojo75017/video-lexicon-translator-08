import { describe, expect, it } from 'vitest';
import { V3_LIFETIME_OFFERS, getV3Plan, getV3PriceId } from './v3Pricing';

describe('one-time offers and historical subscriptions', () => {
  it('keeps the lifetime entry price at 47 euros', () => {
    expect(V3_LIFETIME_OFFERS.base.price).toBe(47);
  });
  it('includes 10 books per month in the 47 euro offer', () => {
    expect(V3_LIFETIME_OFFERS.base.booksPerMonth).toBe(10);
  });
  it('includes up to 120 books per year in the 47 euro offer', () => {
    expect(V3_LIFETIME_OFFERS.base.booksPerYear).toBe(120);
    expect(V3_LIFETIME_OFFERS.base.booksPerMonth * 12).toBe(120);
  });
  it('caps the 47 euro offer at 40 chapters per book', () => {
    expect(V3_LIFETIME_OFFERS.base.chaptersMax).toBe(40);
  });
  it('offers Edition Pro at 97 euros', () => {
    expect(V3_LIFETIME_OFFERS.pro.price).toBe(97);
  });
  it('keeps standalone Cover Pro at 67 euros', () => {
    expect(V3_LIFETIME_OFFERS.cover.price).toBe(67);
  });
  it('preserves existing Plume billing', () => {
    expect(getV3Plan('plume')?.monthlyPrice).toBe(27);
    expect(getV3PriceId('plume', 'month')).toBe('v3_plume_monthly');
  });
  it('preserves existing Edition billing', () => {
    expect(getV3Plan('edition')?.monthlyPrice).toBe(47);
    expect(getV3PriceId('edition', 'month', true)).toBe('v3_edition_monthly_legacy');
  });
});
