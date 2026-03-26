import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const AMAZON_DOMAINS: Record<string, string> = {
  'us': 'amazon.com',
  'fr': 'amazon.fr',
  'de': 'amazon.de',
  'uk': 'amazon.co.uk',
  'es': 'amazon.es',
  'it': 'amazon.it',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { asin, marketplace, query, mode } = await req.json();
    
    const FIRECRAWL_API_KEY = Deno.env.get('FIRECRAWL_API_KEY');
    if (!FIRECRAWL_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl non configuré' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const domain = AMAZON_DOMAINS[marketplace || 'fr'] || 'amazon.fr';

    // Mode 1: Scrape a specific ASIN product page
    if (mode === 'asin' && asin) {
      const cleanAsin = asin.trim().toUpperCase();
      if (!/^B[0-9A-Z]{9}$|^\d{10}$|^\d{13}$/.test(cleanAsin)) {
        return new Response(
          JSON.stringify({ success: false, error: 'ASIN invalide. Format attendu: B0XXXXXXXXX ou ISBN-10/13' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const url = `https://www.${domain}/dp/${cleanAsin}`;
      console.log('Scraping ASIN:', cleanAsin, 'URL:', url);

      const scrapeRes = await fetch('https://api.firecrawl.dev/v1/scrape', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          formats: ['markdown', 'html'],
          onlyMainContent: true,
          waitFor: 3000,
        }),
      });

      const scrapeData = await scrapeRes.json();
      
      if (!scrapeRes.ok || !scrapeData.success) {
        console.error('Firecrawl scrape error:', scrapeData);
        return new Response(
          JSON.stringify({ success: false, error: 'Impossible de scraper cette page Amazon' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const markdown = scrapeData.data?.markdown || scrapeData.markdown || '';
      const metadata = scrapeData.data?.metadata || scrapeData.metadata || {};
      
      const bookData = parseAmazonBookPage(markdown, metadata, cleanAsin, domain);

      return new Response(
        JSON.stringify({ success: true, data: bookData }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Mode 2: Search for books in a niche
    if (mode === 'niche' && query) {
      console.log('Niche search:', query);

      const searchRes = await fetch('https://api.firecrawl.dev/v1/search', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `${query} kindle ebook site:${domain}`,
          limit: 15,
          lang: marketplace === 'fr' ? 'fr' : 'en',
          scrapeOptions: { formats: ['markdown'] },
        }),
      });

      const searchData = await searchRes.json();
      
      if (!searchRes.ok) {
        return new Response(
          JSON.stringify({ success: false, error: 'Erreur de recherche Firecrawl' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const results = (searchData.data || []).map((item: any) => {
        const asinMatch = (item.url || '').match(/\/dp\/([A-Z0-9]{10})/);
        return {
          title: item.title || 'Titre inconnu',
          url: item.url || '',
          description: item.description || '',
          asin: asinMatch ? asinMatch[1] : null,
          markdown: item.markdown?.substring(0, 500) || '',
        };
      }).filter((r: any) => r.asin);

      return new Response(
        JSON.stringify({ success: true, data: results }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Mode 3: Extract keywords from a competitor ASIN
    if (mode === 'keywords' && asin) {
      const cleanAsin = asin.trim().toUpperCase();
      const url = `https://www.${domain}/dp/${cleanAsin}`;

      const scrapeRes = await fetch('https://api.firecrawl.dev/v1/scrape', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          formats: ['markdown'],
          onlyMainContent: true,
          waitFor: 3000,
        }),
      });

      const scrapeData = await scrapeRes.json();
      const markdown = scrapeData.data?.markdown || scrapeData.markdown || '';
      const metadata = scrapeData.data?.metadata || scrapeData.metadata || {};

      const keywords = extractKeywords(markdown, metadata);

      return new Response(
        JSON.stringify({ success: true, data: keywords }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Mode invalide. Utilisez: asin, niche, ou keywords' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('KDP scraper error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Erreur interne' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function parseAmazonBookPage(markdown: string, metadata: any, asin: string, domain: string): any {
  const title = metadata.title?.replace(/ - Amazon.*$/, '').replace(/Amazon\..*?:\s*/, '') || 'Titre non trouvé';
  
  // Extract price
  const priceMatch = markdown.match(/(\d+[.,]\d{2})\s*€/) || markdown.match(/\$(\d+[.,]\d{2})/);
  const price = priceMatch ? parseFloat(priceMatch[1].replace(',', '.')) : null;

  // Extract rating
  const ratingMatch = markdown.match(/(\d[.,]\d)\s*(?:sur|out of)\s*5/);
  const rating = ratingMatch ? parseFloat(ratingMatch[1].replace(',', '.')) : null;

  // Extract review count
  const reviewMatch = markdown.match(/(\d[\d\s,.]*)\s*(?:évaluations|ratings|avis|reviews|commentaires)/i);
  const reviews = reviewMatch ? parseInt(reviewMatch[1].replace(/[\s,.]/g, '')) : null;

  // Extract BSR
  const bsrMatch = markdown.match(/(?:Best Sellers Rank|Classement des meilleures ventes|Rang des ventes)[^\d]*#?([\d\s,.]+)/i);
  const bsr = bsrMatch ? parseInt(bsrMatch[1].replace(/[\s,.]/g, '')) : null;

  // Extract pages
  const pagesMatch = markdown.match(/(\d+)\s*(?:pages|page)/i);
  const pages = pagesMatch ? parseInt(pagesMatch[1]) : null;

  // Extract author
  const authorMatch = markdown.match(/(?:de|by)\s+\[?([A-ZÀ-Ÿ][a-zà-ÿ]+(?:\s+[A-ZÀ-Ÿ][a-zà-ÿ]+)*)\]?/);
  const author = authorMatch ? authorMatch[1] : null;

  // Extract categories
  const categoryMatches = markdown.match(/(?:in|dans)\s+(?:Kindle Store|Boutique Kindle)\s*>\s*([^\n]+)/gi) || [];
  const categories = categoryMatches.map((c: string) => c.replace(/^(?:in|dans)\s+/i, '').trim());

  // Extract description
  const descMatch = markdown.match(/(?:Description|About this item|À propos)[:\s]*\n([\s\S]{50,500}?)(?:\n\n|\n#)/i);
  const description = descMatch ? descMatch[1].trim() : markdown.substring(0, 300).trim();

  // Estimate sales from BSR
  const estimatedDailySales = bsr ? estimateSalesFromBsr(bsr) : null;
  const estimatedMonthlySales = estimatedDailySales ? Math.round(estimatedDailySales * 30) : null;
  const estimatedMonthlyRevenue = estimatedMonthlySales && price ? Math.round(estimatedMonthlySales * price * 0.7) : null;

  return {
    asin,
    title,
    author,
    price,
    rating,
    reviews,
    bsr,
    pages,
    categories,
    description,
    estimatedDailySales,
    estimatedMonthlySales,
    estimatedMonthlyRevenue,
    amazonUrl: `https://www.${domain}/dp/${asin}`,
    scrapedAt: new Date().toISOString(),
  };
}

function estimateSalesFromBsr(bsr: number): number {
  if (bsr <= 100) return 50;
  if (bsr <= 500) return 25;
  if (bsr <= 1000) return 15;
  if (bsr <= 5000) return 8;
  if (bsr <= 10000) return 5;
  if (bsr <= 50000) return 2;
  if (bsr <= 100000) return 1;
  return 0.5;
}

function extractKeywords(markdown: string, metadata: any): any {
  const title = metadata.title || '';
  const description = metadata.description || '';
  const fullText = `${title} ${description} ${markdown.substring(0, 2000)}`;

  // Remove common words and extract meaningful terms
  const stopWords = new Set(['le', 'la', 'les', 'de', 'du', 'des', 'un', 'une', 'et', 'en', 'à', 'pour', 'par', 'sur', 'avec', 'dans', 'que', 'qui', 'est', 'ce', 'cette', 'au', 'aux', 'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'has', 'have', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'it', 'its', 'this', 'that', 'these', 'those', 'amazon', 'kindle', 'ebook']);

  const words = fullText.toLowerCase()
    .replace(/[^a-zà-ÿ0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3 && !stopWords.has(w));

  const freq: Record<string, number> = {};
  for (const word of words) {
    freq[word] = (freq[word] || 0) + 1;
  }

  const sorted = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(([word, count]) => ({ word, count, relevance: Math.min(100, count * 10) }));

  // Extract 2-word phrases
  const bigrams: Record<string, number> = {};
  for (let i = 0; i < words.length - 1; i++) {
    const bigram = `${words[i]} ${words[i + 1]}`;
    if (bigram.length > 7) {
      bigrams[bigram] = (bigrams[bigram] || 0) + 1;
    }
  }

  const topBigrams = Object.entries(bigrams)
    .filter(([_, c]) => c >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([phrase, count]) => ({ phrase, count, relevance: Math.min(100, count * 15) }));

  return {
    title: metadata.title || '',
    singleKeywords: sorted,
    phraseKeywords: topBigrams,
    suggestedBackendKeywords: sorted.slice(0, 7).map(k => k.word),
    titleKeywords: title.toLowerCase().split(/\s+/).filter((w: string) => w.length > 3 && !stopWords.has(w)),
  };
}
