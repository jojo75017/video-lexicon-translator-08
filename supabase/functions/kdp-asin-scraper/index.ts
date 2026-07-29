import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { paapiGetItems, parsePaapiItem, type PaapiBookData } from "./paapi.ts";

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
  html?: string;
  rawHtml?: string;
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
      console.log('Extracted BSR:', resolved.book.bsr, 'Price:', resolved.book.price, 'Rating:', resolved.book.rating, 'Reviews:', resolved.book.reviews);

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
      formats: ['markdown', 'html', 'rawHtml'],
      onlyMainContent: false,
      waitFor: 8000,
      timeout: 60000,
      actions: [
        { type: 'wait', milliseconds: 2000 },
        { type: 'scroll', direction: 'down' },
        { type: 'scroll', direction: 'down' },
        { type: 'wait', milliseconds: 2500 },
        { type: 'scroll', direction: 'down' },
        { type: 'wait', milliseconds: 2000 },
      ],
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

async function scraperApiScrape(
  url: string,
  marketplace: string,
): Promise<FirecrawlScrapePayload | null> {
  const key = Deno.env.get('SCRAPERAPI_KEY');
  if (!key) return null;
  const country = (MARKET_COUNTRY[marketplace] || 'FR').toLowerCase();
  const params = new URLSearchParams({
    api_key: key,
    url,
    country_code: country,
    render: 'true',
    keep_headers: 'true',
  });
  try {
    const response = await fetch(`https://api.scraperapi.com/?${params.toString()}`, {
      method: 'GET',
    });
    if (!response.ok) {
      console.error('ScraperAPI error:', response.status, await response.text().catch(() => ''));
      return null;
    }
    const html = await response.text();
    if (!html || html.length < 500) return null;
    const markdown = html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    console.log('ScraperAPI OK pour', url, '— HTML length:', html.length);
    return { html, rawHtml: html, markdown, metadata: {} };
  } catch (e) {
    console.error('ScraperAPI exception:', e);
    return null;
  }
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
  // 1) Tentative PA-API officielle (BSR fiable à 100%)
  let paapiData: PaapiBookData | null = null;
  try {
    const paapiResp = await paapiGetItems([asin], marketplace);
    const item = paapiResp?.ItemsResult?.Items?.[0];
    if (item) {
      paapiData = parsePaapiItem(item);
      console.log('PA-API OK pour', asin, '— BSR:', paapiData.bsr, 'Reviews:', paapiData.reviews, 'Rating:', paapiData.rating, 'Price:', paapiData.price);
    } else {
      const errs = paapiResp?.Errors || paapiResp?.ItemsResult?.Items;
      if (errs) console.warn('PA-API: pas d\'item retourné pour', asin, JSON.stringify(errs).slice(0, 300));
    }
  } catch (e) {
    console.warn('PA-API exception pour', asin, e);
  }

  // 2) Firecrawl en complément (description, image, fallback)
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
    selectedScrape?.html || selectedScrape?.rawHtml || '',
  );

  // 3) PA-API a priorité absolue sur les valeurs scrapées (sources officielles)
  if (paapiData) {
    if (paapiData.title) book.title = paapiData.title;
    if (paapiData.author) book.author = paapiData.author;
    if (paapiData.price != null) book.price = paapiData.price;
    if (paapiData.rating != null) book.rating = paapiData.rating;
    if (paapiData.reviews != null) book.reviews = paapiData.reviews;
    if (paapiData.bsr != null) {
      book.bsr = paapiData.bsr;
      book.estimatedDailySales = estimateSalesFromBsr(paapiData.bsr);
      book.estimatedMonthlySales = Math.round(book.estimatedDailySales * 30);
      book.estimatedMonthlyRevenue = book.price ? Math.round(book.estimatedMonthlySales * book.price * 0.7) : null;
    }
    if (paapiData.pages != null) book.pages = paapiData.pages;
    if (paapiData.categories && paapiData.categories.length > 0) {
      book.categories = [...new Set([...paapiData.categories, ...(book.categories || [])])].slice(0, 8);
    }
    (book as any).source = 'paapi+firecrawl';
  } else {
    (book as any).source = 'firecrawl';
  }

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

  const markdownAuthor = markdown.match(/(?:de|by)\s+\[?([^\]\n]{3,80})\]?/i)?.[1];
  const candidate = cleanText(markdownAuthor);
  if (!candidate || /^(vente|publication|taille|accessibilité|langue|fichier)$/i.test(candidate)) {
    return null;
  }

  return candidate;
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

function stripHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#?\w+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractFromHtml(html: string) {
  const result: { bsr: number | null; reviews: number | null; rating: number | null; price: number | null; pages: number | null; categories: string[] } = {
    bsr: null, reviews: null, rating: null, price: null, pages: null, categories: [],
  };
  if (!html) return result;

  // Price from offer blocks (Amazon a-price classes)
  const priceWhole = html.match(/<span[^>]*class="[^"]*a-price-whole[^"]*"[^>]*>([\d\s.,]+)<\/span>\s*(?:<span[^>]*class="[^"]*a-price-decimal[^"]*"[^>]*>[^<]*<\/span>\s*<span[^>]*class="[^"]*a-price-fraction[^"]*"[^>]*>([\d]+)<\/span>)?/i);
  if (priceWhole) {
    const w = priceWhole[1].replace(/[^\d]/g, '');
    const f = priceWhole[2] ? priceWhole[2].replace(/[^\d]/g, '') : '00';
    const num = parseFloat(`${w}.${f}`);
    if (!isNaN(num) && num > 0 && num < 1000) result.price = num;
  }
  if (!result.price) {
    const offHtml = stripHtml(html);
    const m = offHtml.match(/(\d+[.,]\d{2})\s*€/) || offHtml.match(/€\s*(\d+[.,]\d{2})/) || offHtml.match(/\$(\d+[.,]\d{2})/);
    if (m) {
      const num = parseFloat(m[1].replace(',', '.'));
      if (!isNaN(num) && num > 0 && num < 1000) result.price = num;
    }
  }

  // Rating
  const ratingMatch = html.match(/(\d[.,]\d)\s*(?:sur|out of)\s*5\s*étoiles?/i)
    || html.match(/data-hook="rating-out-of-text"[^>]*>\s*(\d[.,]\d)/i)
    || html.match(/a-icon-alt[^>]*>\s*(\d[.,]\d)\s*(?:sur|out of)/i);
  if (ratingMatch) {
    const r = parseFloat(ratingMatch[1].replace(',', '.'));
    if (!isNaN(r) && r > 0 && r <= 5) result.rating = r;
  }

  // Reviews count - Amazon uses aria-label="N Commentaires/ratings" or visible "(N)" pattern
  const reviewMatch = html.match(/acrCustomerReviewText[^>]*aria-label="([\d\s,.\u202f\u00a0]+)\s*(?:Commentaires|évaluations|ratings|avis|reviews)/i)
    || html.match(/aria-label="([\d\s,.\u202f\u00a0]+)\s*(?:Commentaires|évaluations|ratings|avis|reviews)"/i)
    || html.match(/id="acrCustomerReviewText"[^>]*>\s*\(?([\d\s,.\u202f\u00a0]+)\)?\s*</i)
    || html.match(/>\s*([\d\s,.\u202f\u00a0]+)\s*(?:évaluations|ratings|avis|reviews|commentaires)\s*</i);
  if (reviewMatch) {
    const n = parseInt(reviewMatch[1].replace(/[^\d]/g, ''), 10);
    if (!isNaN(n) && n >= 0) result.reviews = n;
  }

  // Pages
  const pagesMatch = html.match(/(\d{2,5})\s*pages/i);
  if (pagesMatch) {
    const n = parseInt(pagesMatch[1], 10);
    if (n > 0 && n < 20000) result.pages = n;
  }

  // BSR — Amazon "Détails sur le produit" / "Product details" block
  // On capture ~2000 caractères après le label (tags HTML inclus) puis on strip le HTML :
  // le rang principal est souvent enfermé dans un <span> voisin, donc [^<] ne suffisait pas.
  const bsrBlockMatch = html.match(/(?:Classement des meilleures ventes|Best Sellers Rank|Amazon Bestseller-Rang|Clasificaci[oó]n en los m[aá]s vendidos|Posizione nella classifica)[\s\S]{0,2000}/i);
  if (bsrBlockMatch) {
    const text = stripHtml(bsrBlockMatch[0]);
    // Priorité : rang racine (Kindle Store, Boutique Kindle, Livres, Books…)
    const rootRank = text.match(/#?\s*([\d][\d\s.,\u202f\u00a0]{0,12})\s+(?:en|in|dans)\s+(?:Boutique\s+Kindle|Kindle\s+Store|Livres|Books|Kindle-Shop|Tienda\s+Kindle|Negozio\s+Kindle)/i);
    if (rootRank) {
      const n = parseInt(rootRank[1].replace(/[^\d]/g, ''), 10);
      if (n > 0 && n < 10_000_000) result.bsr = n;
    } else {
      const m = text.match(/#?\s*([\d][\d\s.,\u202f\u00a0]{1,})/);
      if (m) {
        const n = parseInt(m[1].replace(/[^\d]/g, ''), 10);
        if (n > 0 && n < 10_000_000) result.bsr = n;
      }
    }
    // Sous-catégories (ex. "3 en Fantasy romantique - ebooks")
    const subMatches = [...text.matchAll(/#?\s*([\d\s.,\u202f\u00a0]+)\s+(?:dans|in|en)\s+([^#\n<>()]{3,80})/gi)];
    for (const sub of subMatches.slice(0, 6)) {
      const cat = cleanText(sub[2]).replace(/\s*\(.*$/, '');
      if (cat && !/^(Boutique\s+Kindle|Kindle\s+Store|Livres|Books|Kindle-Shop)$/i.test(cat)) {
        result.categories.push(cat);
      }
    }
  }

  return result;
}

function parseAmazonBookPage(
  markdown: string,
  metadata: Record<string, unknown>,
  asin: string,
  domain: string,
  searchHit?: ResolvedSearchHit | null,
  html: string = '',
) {
  const htmlData = extractFromHtml(html);

  const combinedText = [
    String(metadata.title || ''),
    String(metadata.description || ''),
    searchHit?.title || '',
    searchHit?.description || '',
    markdown,
    stripHtml(html).slice(0, 20000),
  ].join('\n');

  const metadataTitle = cleanAmazonTitle(String(metadata.title || ''));
  const searchTitle = cleanAmazonTitle(searchHit?.title || '');
  const title = [metadataTitle, searchTitle].find((entry) => entry && !/^amazon\.[a-z.]+$/i.test(entry)) || `ASIN ${asin}`;

  let price = htmlData.price;
  if (price == null) {
    const priceMatch = combinedText.match(/(\d+[.,]\d{2})\s*€/i) || combinedText.match(/\$(\d+[.,]\d{2})/i);
    price = priceMatch ? parseFloat(priceMatch[1].replace(',', '.')) : null;
  }

  let rating = htmlData.rating;
  if (rating == null) {
    const ratingMatch = combinedText.match(/(\d[.,]\d)\s*(?:sur|out of)\s*5/i);
    rating = ratingMatch ? parseFloat(ratingMatch[1].replace(',', '.')) : null;
  }

  let reviews = htmlData.reviews;
  if (reviews == null) {
    const reviewMatch = combinedText.match(/([\d\s,.\u202f\u00a0]+)\s*(?:évaluations|ratings|avis|reviews|commentaires)/i);
    reviews = reviewMatch ? parseInt(reviewMatch[1].replace(/[^\d]/g, ''), 10) : null;
  }

  let bsr = htmlData.bsr;
  if (bsr == null) {
    const bsrPatterns = [
      /(?:Best Sellers Rank|Classement des meilleures ventes|Amazon Bestseller-Rang)[^\d#]*#?([\d\s,.\u202f\u00a0]+)/i,
    ];
    for (const pattern of bsrPatterns) {
      const match = combinedText.match(pattern);
      if (match) {
        const parsed = parseInt(match[1].replace(/[^\d]/g, ''), 10);
        if (parsed > 0 && parsed < 10000000) { bsr = parsed; break; }
      }
    }
  }

  let pages = htmlData.pages;
  if (pages == null) {
    const pagesMatch = combinedText.match(/(\d{2,5})\s*(?:pages|page)/i);
    pages = pagesMatch ? parseInt(pagesMatch[1], 10) : null;
  }

  const categorySet = new Set<string>(htmlData.categories);
  const categoryPatterns = [
    /(?:in|dans)\s+(?:Kindle Store|Boutique Kindle|Books|Livres)\s*>\s*([^\n<]+)/gi,
    /(?:Catégorie|Category)\s*:\s*([^\n<]+)/gi,
  ];
  for (const pattern of categoryPatterns) {
    const matches = combinedText.matchAll(pattern);
    for (const m of matches) {
      const cat = cleanText(m[1] || m[0]).replace(/^(?:in|dans)\s+/i, '');
      if (cat && !isGenericAmazonContent(cat) && cat.length < 120) categorySet.add(cat);
    }
  }
  const categories = [...categorySet].slice(0, 8);

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
  // More granular estimation using logarithmic curve
  // Based on industry data: BSR 1 ≈ 200/day, BSR 100k ≈ 0.3/day
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
    'accessibilité', 'langue', 'janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
  ]);

  const words = fullText
    .toLowerCase()
    .replace(/[^a-zà-ÿ0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 3 && !stopWords.has(word) && !/^\d+$/.test(word) && !/^b[0-9a-z]{9,12}$/i.test(word));

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
