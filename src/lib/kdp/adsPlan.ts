export const ADS_CAMPAIGN_TYPES = ['automatique', 'mots-clés exacts', 'produits'] as const;
export type AdsLevel = 'debutant' | 'intermediaire' | 'expert';
export const ADS_LEVELS: Record<AdsLevel, string> = { debutant: 'Débutant', intermediaire: 'Intermédiaire', expert: 'Expert' };

export function approvedCompetitorAsins(raw: string): string[] {
  return [...new Set(raw.toUpperCase().split(/[\s,;]+/).filter(x => /^[A-Z0-9]{10}$/.test(x)))];
}

export function splitDailyBudget(amount: number): number[] {
  const cents = Math.round(amount * 100);
  if (!Number.isFinite(cents) || cents < 3) throw new Error('Indiquez un budget total d’au moins 0,03 €.');
  return [0, 1, 2].map(i => (Math.floor(cents / 3) + (i < cents % 3 ? 1 : 0)) / 100);
}

export function simulateAds(daily: number, days: number, cpc: number, conversion: number, royalty: number) {
  if (![daily, days, cpc, conversion, royalty].every(Number.isFinite) || daily <= 0 || days <= 0 || cpc <= 0 || conversion <= 0 || conversion > 100 || royalty <= 0) return null;
  const spend = daily * days;
  const clicks = spend / cpc;
  const sales = clicks * conversion / 100;
  return { spend, clicks, sales, royalties: sales * royalty, net: sales * royalty - spend, breakEven: cpc / royalty * 100 };
}