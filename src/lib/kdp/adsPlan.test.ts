import { describe, expect, it } from 'vitest';
import { ADS_CAMPAIGN_TYPES, approvedCompetitorAsins, simulateAds, splitDailyBudget } from './adsPlan';

describe('Amazon Ads plans', () => {
  it('offers exactly the three requested complementary campaigns', () => {
    expect(ADS_CAMPAIGN_TYPES).toEqual(['automatique', 'mots-clés exacts', 'produits']);
  });
  it('splits the total budget without multiplying spend', () => {
    expect(splitDailyBudget(15)).toEqual([5, 5, 5]);
    expect(splitDailyBudget(10)).toEqual([3.34, 3.33, 3.33]);
  });
  it('retains only distinct user-supplied valid competitor ASINs', () => {
    expect(approvedCompetitorAsins('b012345678, invalid; B012345678 B987654321')).toEqual(['B012345678', 'B987654321']);
  });
  it('calculates net profit from royalties, not the retail price', () => {
    expect(simulateAds(15, 30, 0.3, 5, 5.21)).toMatchObject({ spend: 450, clicks: 1500, sales: 75, royalties: 390.75, net: -59.25 });
  });
  it('does not forecast with missing assumptions', () => {
    expect(simulateAds(15, 30, 0, 5, 5.21)).toBeNull();
  });
});