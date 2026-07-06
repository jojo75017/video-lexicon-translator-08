import { supabase } from '@/integrations/supabase/client';

export const MARKETPLACES = [
  { id: 'fr', label: '🇫🇷 Amazon.fr', domain: 'amazon.fr' },
  { id: 'us', label: '🇺🇸 Amazon.com', domain: 'amazon.com' },
  { id: 'uk', label: '🇬🇧 Amazon.co.uk', domain: 'amazon.co.uk' },
  { id: 'de', label: '🇩🇪 Amazon.de', domain: 'amazon.de' },
  { id: 'es', label: '🇪🇸 Amazon.es', domain: 'amazon.es' },
  { id: 'it', label: '🇮🇹 Amazon.it', domain: 'amazon.it' },
];

export interface MarketBook {
  asin: string;
  title: string;
  author: string | null;
  price: number | null;
  rating: number | null;
  reviews: number | null;
  bsr: number | null;
  pages: number | null;
  categories: string[];
  description: string;
  estimatedDailySales: number | null;
  estimatedMonthlySales: number | null;
  estimatedMonthlyRevenue: number | null;
  amazonUrl: string;
  scrapedAt: string;
}

/** Courbe BSR → ventes/jour (identique au moteur serveur kdp-asin-scraper). */
export function estimateSalesFromBsr(bsr: number | null | undefined): number {
  if (!bsr || bsr <= 0) return 0;
  if (bsr <= 50) return 100;
  if (bsr <= 100) return 50;
  if (bsr <= 300) return 30;
  if (bsr <= 500) return 20;
  if (bsr <= 1000) return 12;
  if (bsr <= 2000) return 8;
  if (bsr <= 5000) return 5;
  if (bsr <= 10000) return 3;
  if (bsr <= 20000) return 2;
  if (bsr <= 50000) return 1.5;
  if (bsr <= 100000) return 1;
  if (bsr <= 200000) return 0.5;
  if (bsr <= 500000) return 0.3;
  return 0.1;
}

export function fmtEur(n: number | null | undefined): string {
  if (n == null) return '—';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
}

export function fmtNum(n: number | null | undefined): string {
  if (n == null) return '—';
  return new Intl.NumberFormat('fr-FR').format(n);
}

/** Appelle le scraper KDP (Firecrawl + PA-API côté serveur). */
export async function fetchAmazonBook(asin: string, marketplace: string): Promise<MarketBook> {
  const { data, error } = await supabase.functions.invoke('kdp-asin-scraper', {
    body: { mode: 'asin', asin, marketplace },
  });
  if (error) throw new Error(error.message || 'Erreur de récupération');
  if (!data?.success) throw new Error(data?.error || 'ASIN introuvable');
  return data.data as MarketBook;
}

export async function searchAmazonNiche(query: string, marketplace: string): Promise<any[]> {
  const { data, error } = await supabase.functions.invoke('kdp-asin-scraper', {
    body: { mode: 'niche', query, marketplace },
  });
  if (error) throw new Error(error.message || 'Erreur de recherche');
  if (!data?.success) throw new Error(data?.error || 'Recherche échouée');
  return data.data as any[];
}

export async function extractAsinKeywords(asin: string, marketplace: string): Promise<any> {
  const { data, error } = await supabase.functions.invoke('kdp-asin-scraper', {
    body: { mode: 'keywords', asin, marketplace },
  });
  if (error) throw new Error(error.message || 'Erreur');
  if (!data?.success) throw new Error(data?.error || 'Échec');
  return data.data;
}

export async function callMarketAI(tool: string, input: string, marketplace: string, userApiKey?: string): Promise<any> {
  const { data, error } = await supabase.functions.invoke('market-research', {
    body: { tool, input, marketplace, userApiKey },
  });
  if (error) throw new Error(error.message || 'Erreur IA');
  if (data?.error) throw new Error(data.error);
  return data.data;
}
