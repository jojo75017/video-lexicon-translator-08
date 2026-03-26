import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const AMAZON_DOMAINS: Record<string, string> = {
  us: 'amazon.com',
  fr: 'amazon.fr',
  de: 'amazon.de',
  uk: 'amazon.co.uk',
  es: 'amazon.es',
  it: 'amazon.it',
};

const MARKET_LANG: Record<string, string> = {
  us: 'en',
  fr: 'fr',
  de: 'de',
  uk: 'en',
  es: 'es',
  it: 'it',
};

const MARKET_COUNTRY: Record<string, string> = {
  us: 'US',
  fr: 'FR',
  de: 'DE',
  uk: 'GB',
  es: 'ES',
  it: 'IT',
};

type FirecrawlSearchItem = {
  url?: string;
  title?: string;
  description?: string;
  markdown?: string;
};

type FirecrawlScrapePayload = {
  markdown?: string;
  metadata?: Record<string, unknown>;
};

type ResolvedSearchHit = {
  asin: string | null;
  description: string;
  markdown: string;
  title: string;
  url: string;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { asin, marketplace = 'fr', query, mode } = await req.json();

    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!firecrawlApiKey) {
      return jsonResponse({ success: false, error: 'Firecrawl non configuré' }, 500);
    }

    const domain = AMAZON_DOMAINS[marketplace] || AMAZON_DOMAINS.fr;

    if (mode === 'asin' && asin) {
      const cleanAsin = normalizeAsin(asin);
      if (!isValidAmazonIdentifier(cleanAsin)) {
        return jsonResponse({ success: false, error: 'ASIN invalide. Format attendu: B0XXXXXXXXX ou ISBN-10/13' }, 400);
      }

      console.log('Scraping ASIN:', cleanAsin, 'URL:', `https://www.${domain}/dp/${cleanAsin}`);
      const resolved = await resolveAmazonBook(firecrawlApiKey, cleanAsin, marketplace, domain);

      return jsonResponse({ success: true, data: resolved.book });
    }

    if (mode === 'niche' && query) {
      console.log('Niche search:', query);
      const results = await searchNicheBooks(firecrawlApiKey, query, marketplace, domain);
      return jsonResponse({ success: true, data: results });
    }

    if (mode === 'keywords' && asin) {
      const cleanAsin = normalizeAsin(asin);
      if (!isValidAmazonIdentifier(cleanAsin)) {
        return jsonResponse({ success: false, error: 'ASIN invalide. Format attendu: B0XXXXXXXXX ou ISBN-10/13' }, 400);
      }

      const resolved = await resolveAmazonBook(firecrawlApiKey, cleanAsin, marketplace, domain);
      const keywords = extractKeywords(resolved.keywordSource, resolved.book.title, resolved.book.description);

      return jsonResponse({ success: true, data: keywords });
    }

    return jsonResponse({ success: false, error: 'Mode invalide. Utilisez: asin, niche, ou keywords' }, 400);
  } catch (error) {
    console.error('KDP scraper error:', error);
    return jsonResponse(
      { success: false, error: error instanceof Error ? error.message : 'Erreur interne' },
      500,
    );
  }
});

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function normalizeAsin(asin: string) {
  return asin.trim().toUpperCase();
}

function isValidAmazonIdentifier(value: string) {
  return /^B[0-9A-Z]{9}$|^\d{10}$|^\d{13}$/.test(value);
}

function extractAsinFromUrl(url: string) {
  const match = url.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i);
  return match ? match[1].toUpperCase() : null;
}

function cleanText(value?: string | null) {
  return (value || '').replace(/\s+/g, ' ').trim();
}

function cleanAmazonTitle(title?: string | null) {
  return cleanText(title)
    .replace(/^Amazon\.[^:]+:\s*/i, '')
    .replace(/\s+-\s+Amazon\..*$/i, '')
    .replace(/\s+:\s*Amazon\..*$/i, '')
    .replace(/\s+(?:eBook|Broché|Relié|Format Kindle|Paperback|Hardcover)\s*:\s*.*$/i, '')
    .trim();
}

function isGenericAmazonContent(text?: string | null) {
  const normalized = cleanText(text).toLowerCase();
  if (!normalized) return true;

  return [
    'continuer les achats',
    'conditions générales de vente',
    'cookies and advertising choices',
    'vos informations personnelles',
    'amazon.fr',
    'amazon.com',
  ].some((marker) => normalized.includes(marker));
}

function looksLikeInterstitial(markdown?: string, metadata?: Record<string, unknown>) {
  const title = cleanText(String(metadata?.title || ''));
  const snippet = cleanText((markdown || '').slice(0, 1200));

  if (!title && !snippet) return true;
  if (/^amazon\.[a-z.]+$/i.test(title)) return true;

  return isGenericAmazonContent(title) || isGenericAmazonContent(snippet);
}

async function firecrawlSearch(
  firecrawlApiKey: string,
  body: Record<string, unknown>,
) {
  const response = await fetch('https://api.firecrawl.dev/v1/search', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${firecrawlApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (!response.ok) {
    console.error('Firecrawl search error:', data);
    throw new Error(`Erreur de recherche Firecrawl [${response.status}]`);
  }

  return data;
}

async function firecrawlScrape(
  firecrawlApiKey: string,
  url: string,
  marketplace: string,
): Promise<FirecrawlScrapePayload | null> {
  const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${firecrawlApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url,
      formats: ['markdown', 'html'],
      onlyMainContent: false,
      waitFor: 4000,
      location: {
        country: MARKET_COUNTRY[marketplace] || 'FR',
        languages: [MARKET_LANG[marketplace] || 'fr'],
      },
    }),
  });

  const data = await response.json();
  if (!response.ok || !data?.success) {
    console.error('Firecrawl scrape error:', data);
    return null;
  }

  return data.data || data;
}

function mapSearchResults(items: FirecrawlSearchItem[]) {
  const seen = new Set<string>();

  return items
    .map((item) => {
      const url = cleanText(item.url);
      const asin = extractAsinFromUrl(url);
      const title = cleanAmazonTitle(item.title);
      const description = cleanText(item.description) || cleanText(item.markdown?.slice(0, 240));

      return {
        asin,
        description,
        markdown: cleanText(item.markdown?.slice(0, 500)),
        title,
        url,
      } satisfies ResolvedSearchHit;
    })
    .filter((item) => item.asin && item.url.includes('amazon.') && item.title && !/^amazon\.[a-z.]+$/i.test(item.title))
    .filter((item) => {
      const key = item.asin as string;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

async function searchAmazonByAsin(
  firecrawlApiKey: string,
  asin: string,
  marketplace: string,
  domain: string,
) {
  const data = await firecrawlSearch(firecrawlApiKey, {
    query: `${asin} site:${domain}`,
    limit: 8,
    lang: MARKET_LANG[marketplace] || 'fr',
    country: MARKET_COUNTRY[marketplace] || 'FR',
    scrapeOptions: { formats: ['markdown'] },
  });

  const results = mapSearchResults(data.data || []);
  return results.find((item) => item.asin === asin) || results[0] || null;
}

async function searchNicheBooks(
  firecrawlApiKey: string,
  query: string,
  marketplace: string,
  domain: string,
) {
  const data = await firecrawlSearch(firecrawlApiKey, {
    query: `${query} site:${domain}`,
    limit: 20,
    lang: MARKET_LANG[marketplace] || 'fr',
    country: MARKET_COUNTRY[marketplace] || 'FR',
    scrapeOptions: { formats: ['markdown'] },
  });

  return mapSearchResults(data.data || []).slice(0, 10);
}

async function resolveAmazonBook(
  firecrawlApiKey: string,
  asin: string,
  marketplace: string,
  domain: string,
) {
  const directUrl = `https://www.${domain}/dp/${asin}`;
  const directScrape = await firecrawlScrape(firecrawlApiKey, directUrl, marketplace);
  const searchHit = await searchAmazonByAsin(firecrawlApiKey, asin, marketplace, domain);

  let selectedScrape = directScrape;

  if ((!selectedScrape || looksLikeInterstitial(selectedScrape.markdown, selectedScrape.metadata)) && searchHit?.url) {
    const fallbackScrape = await firecrawlScrape(firecrawlApiKey, searchHit.url, marketplace);
    if (fallbackScrape && !looksLikeInterstitial(fallbackScrape.markdown, fallbackScrape.metadata)) {
      selectedScrape = fallbackScrape;
    }
  }

  const book = parseAmazonBookPage(
    selectedScrape?.markdown || searchHit?.markdown || '',
    selectedScrape?.metadata || {},
    asin,
    domain,
    searchHit,
  );

  const keywordSource = [
    searchHit?.title,
    searchHit?.description,
    selectedScrape?.metadata?.title ? String(selectedScrape.metadata.title) : '',
    selectedScrape?.metadata?.description ? String(selectedScrape.metadata.description) : '',
    selectedScrape?.markdown || searchHit?.markdown || '',
  ]
    .filter(Boolean)
    .join('\n\n');

  return { book, keywordSource };
}

function extractAuthor(markdown: string, metadata: Record<string, unknown>, searchHit?: ResolvedSearchHit | null) {
  const authorFromTitle = cleanText(searchHit?.title || String(metadata.title || '')).match(
    /(?:eBook|Broché|Relié|Format Kindle|Paperback|Hardcover)\s*:\s*([^:]+)(?::|$)/i,
  );
  if (authorFromTitle?.[1]) return cleanText(authorFromTitle[1]);

  const markdownAuthor = markdown.match(/(?:de|by)\s+\[?([^\]\n]{3,80})\]?/i);
  return markdownAuthor?.[1] ? cleanText(markdownAuthor[1]) : null;
}

function extractDescription(markdown: string, metadata: Record<string, unknown>, searchHit?: ResolvedSearchHit | null) {
  const markdownDescription = markdown.match(
    /(?:Description|Description du produit|À propos de ce livre|About this item|À propos)[:\s]*\n([\s\S]{50,700}?)(?:\n\n|\n#|$)/i,
  )?.[1];

  const candidates = [
    markdownDescription,
    String(metadata.description || ''),
    searchHit?.description || '',
    markdown.slice(0, 320),
  ]
    .map((entry) => cleanText(entry))
    .filter(Boolean)
    .filter((entry) => !isGenericAmazonContent(entry));

  return candidates[0] || 'Description indisponible';
}

function parseAmazonBookPage(
  markdown: string,
  metadata: Record<string, unknown>,
  asin: string,
  domain: string,
  searchHit?: ResolvedSearchHit | null,
) {
  const combinedText = [
    String(metadata.title || ''),
    String(metadata.description || ''),
    searchHit?.title || '',
    searchHit?.description || '',
    markdown,
  ].join('\n');

  const metadataTitle = cleanAmazonTitle(String(metadata.title || ''));
  const searchTitle = cleanAmazonTitle(searchHit?.title || '');
  const title = [metadataTitle, searchTitle].find((entry) => entry && !/^amazon\.[a-z.]+$/i.test(entry)) || `ASIN ${asin}`;

  const priceMatch = combinedText.match(/(\d+[.,]\d{2})\s*€/i) || combinedText.match(/\$(\d+[.,]\d{2})/i);
  const price = priceMatch ? parseFloat(priceMatch[1].replace(',', '.')) : null;

  const ratingMatch = combinedText.match(/(\d[.,]\d)\s*(?:sur|out of)\s*5/i);
  const rating = ratingMatch ? parseFloat(ratingMatch[1].replace(',', '.')) : null;

  const reviewMatch = combinedText.match(/(\d[\d\s,.]*)\s*(?:évaluations|ratings|avis|reviews|commentaires)/i);
  const reviews = reviewMatch ? parseInt(reviewMatch[1].replace(/[\s,.]/g, ''), 10) : null;

  const bsrMatch = combinedText.match(/(?:Best Sellers Rank|Classement des meilleures ventes|Rang des ventes)[^\d#]*#?([\d\s,.]+)/i);
  const bsr = bsrMatch ? parseInt(bsrMatch[1].replace(/[\s,.]/g, ''), 10) : null;

  const pagesMatch = combinedText.match(/(\d+)\s*(?:pages|page)/i);
  const pages = pagesMatch ? parseInt(pagesMatch[1], 10) : null;

  const categoryMatches = combinedText.match(/(?:in|dans)\s+(?:Kindle Store|Boutique Kindle)\s*>\s*([^\n]+)/gi) || [];
  const categories = [...new Set(categoryMatches.map((item) => cleanText(item.replace(/^(?:in|dans)\s+/i, ''))))];

  const author = extractAuthor(markdown, metadata, searchHit);
  const description = extractDescription(markdown, metadata, searchHit);

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
    amazonUrl: searchHit?.url || `https://www.${domain}/dp/${asin}`,
    scrapedAt: new Date().toISOString(),
  };
}

function estimateSalesFromBsr(bsr: number) {
  if (bsr <= 100) return 50;
  if (bsr <= 500) return 25;
  if (bsr <= 1000) return 15;
  if (bsr <= 5000) return 8;
  if (bsr <= 10000) return 5;
  if (bsr <= 50000) return 2;
  if (bsr <= 100000) return 1;
  return 0.5;
}

function extractKeywords(sourceText: string, title: string, description: string) {
  const sanitizedSource = sourceText
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/#+\s*/g, ' ');

  const fullText = `${title} ${description} ${sanitizedSource}`;

  const stopWords = new Set([
    'le', 'la', 'les', 'de', 'du', 'des', 'un', 'une', 'et', 'en', 'à', 'pour', 'par', 'sur', 'avec', 'dans',
    'que', 'qui', 'est', 'ce', 'cette', 'au', 'aux', 'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to',
    'for', 'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'has', 'have', 'had', 'do', 'does',
    'did', 'will', 'would', 'could', 'should', 'may', 'might', 'it', 'its', 'this', 'that', 'these', 'those', 'amazon',
    'kindle', 'ebook', 'broché', 'relié', 'store', 'boutique', 'livre', 'edition', 'format', 'paperback', 'hardcover',
    'https', 'http', 'www', 'help', 'customer', 'display', 'html', 'footer', 'nodeid', 'requestid', 'privacy', 'cookies',
    'advertising', 'choices', 'continuer', 'achats', 'conditions', 'générales', 'vente', 'informations', 'personnelles',
    'cliquez', 'bouton', 'dessous', 'filiales', 'produit', 'asin', 'date', 'publication', 'savoir', 'plus', 'taille', 'fichier',
  ]);

  const words = fullText
    .toLowerCase()
    .replace(/[^a-zà-ÿ0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 3 && !stopWords.has(word) && !/^\d+$/.test(word));

  const frequency: Record<string, number> = {};
  for (const word of words) {
    frequency[word] = (frequency[word] || 0) + 1;
  }

  const singleKeywords = Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(([word, count]) => ({ word, count, relevance: Math.min(100, count * 10) }));

  const bigrams: Record<string, number> = {};
  for (let index = 0; index < words.length - 1; index += 1) {
    const bigram = `${words[index]} ${words[index + 1]}`;
    if (bigram.length > 7) {
      bigrams[bigram] = (bigrams[bigram] || 0) + 1;
    }
  }

  const phraseKeywords = Object.entries(bigrams)
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([phrase, count]) => ({ phrase, count, relevance: Math.min(100, count * 15) }));

  return {
    title,
    singleKeywords,
    phraseKeywords,
    suggestedBackendKeywords: singleKeywords.slice(0, 7).map((item) => item.word),
    titleKeywords: title
      .toLowerCase()
      .split(/\s+/)
      .map((word) => word.replace(/[^a-zà-ÿ0-9-]/g, ''))
      .filter((word) => word.length > 3 && !stopWords.has(word)),
  };
}
