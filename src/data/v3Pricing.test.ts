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

import { V3_NEW_OFFERS as NEW } from "./v3Pricing";
describe("Nouvelles offres 97 € / 247 €", () => {
  it("Auteur coûte 97 € par an, payable en 1 ou 3 fois", () => {
    expect(NEW.auteur.price).toBe(97);
    expect(NEW.auteur.options.map(o => o.installments)).toEqual([1, 3]);
  });
  it("Édition à vie coûte 247 €, payable en 1, 3 ou 6 fois", () => {
    expect(NEW.edition.price).toBe(247);
    expect(NEW.edition.options.map(o => o.installments)).toEqual([1, 3, 6]);
  });
  it("les échéances couvrent le prix", () => {
    for (const o of [...NEW.auteur.options, ...NEW.edition.options]) {
      const base = o.plan.startsWith("auteur") ? 97 : 247;
      expect(Math.abs(o.amount * o.installments - base)).toBeLessThan(0.1);
    }
  });
  it("quotas : Auteur 10 livres/40 ch., Édition 20 livres/60 ch.", () => {
    expect([NEW.auteur.booksPerMonth, NEW.auteur.chaptersMax]).toEqual([10, 40]);
    expect([NEW.edition.booksPerMonth, NEW.edition.chaptersMax]).toEqual([20, 60]);
  });
});
