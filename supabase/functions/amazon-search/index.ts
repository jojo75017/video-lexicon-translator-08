import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function firecrawlSearch(query: string, apiKey: string, limit = 10) {
  const response = await fetch("https://api.firecrawl.dev/v1/search", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, limit }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Firecrawl search failed (${response.status}): ${err}`);
  }
  return await response.json();
}

function extractAsinFromUrl(url: string): string | null {
  const m = url.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i);
  return m ? m[1].toUpperCase() : null;
}

function extractPriceFromText(text: string): number | null {
  const patterns = [
    /(\d+[,.]\d{2})\s*€/,
    /€\s*(\d+[,.]\d{2})/,
    /\$\s*(\d+[,.]\d{2})/,
    /(\d+[,.]\d{2})\s*\$/,
    /Kindle.*?(\d+[,.]\d{2})/i,
    /ebook.*?(\d+[,.]\d{2})/i,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) {
      const n = parseFloat(m[1].replace(",", "."));
      if (!isNaN(n) && n > 0 && n < 200) return n;
    }
  }
  return null;
}

function extractRatingFromText(text: string): { rating: number | null; reviewCount: number | null } {
  let rating: number | null = null;
  let reviewCount: number | null = null;

  const rMatch = text.match(/(\d[,.]\d)\s*(?:out of|sur|\/)\s*5/i) ||
                 text.match(/(\d[,.]\d)\s*(?:stars?|étoiles?)/i) ||
                 text.match(/note.*?(\d[,.]\d)/i);
  if (rMatch) rating = parseFloat(rMatch[1].replace(",", "."));

  const rcMatch = text.match(/([\d\s,.]+)\s*(?:ratings?|reviews?|avis|évaluations?|notes?|commentaires?)/i);
  if (rcMatch) {
    const n = parseInt(rcMatch[1].replace(/[\s,.]/g, ""), 10);
    if (!isNaN(n) && n > 0) reviewCount = n;
  }

  return { rating, reviewCount };
}

function estimateDailySales(bsr: number | null): number {
  if (!bsr || bsr <= 0) return 0;
  if (bsr <= 100) return 50;
  if (bsr <= 500) return 25;
  if (bsr <= 1000) return 15;
  if (bsr <= 5000) return 8;
  if (bsr <= 10000) return 4;
  if (bsr <= 50000) return 2;
  if (bsr <= 100000) return 1;
  return 0.5;
}

interface BookResult {
  title: string;
  author: string;
  price: number | null;
  bsr: number | null;
  rating: number | null;
  reviewCount: number | null;
  pages: number | null;
  estimatedDailySales: number;
  asin: string | null;
  imageUrl: string | null;
  url: string | null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const firecrawlKey = Deno.env.get("FIRECRAWL_API_KEY");
    if (!firecrawlKey) {
      return new Response(
        JSON.stringify({ error: "Firecrawl API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { action, keywords, asins, marketplace, maxResults } = await req.json();
    const domain = marketplace === "us" ? "amazon.com" : marketplace === "uk" ? "amazon.co.uk" : marketplace === "de" ? "amazon.de" : "amazon.fr";

    if (action === "search" && keywords) {
      // Use Firecrawl to search Google for Amazon Kindle results
      // This gets titles, prices, ratings from Google's search result snippets
      const query = `${keywords} kindle ebook site:${domain}`;
      const searchResults = await firecrawlSearch(query, firecrawlKey, Math.min(maxResults || 10, 15));
      
      const results = searchResults?.data || [];
      const items: BookResult[] = [];
      const seenAsins = new Set<string>();

      for (const result of results) {
        const url = result.url || "";
        const asin = extractAsinFromUrl(url);
        
        // Only keep Amazon product pages
        if (!url.includes(domain) || !asin || seenAsins.has(asin)) continue;
        seenAsins.add(asin);

        const text = `${result.title || ""} ${result.description || ""} ${result.markdown || ""}`;
        
        // Extract title from search result - Google usually shows "Title: Author: Books"
        let title = result.title || "N/A";
        // Clean up Amazon title patterns
        title = title
          .replace(/\s*:\s*Amazon\.(fr|com|co\.uk|de).*$/i, "")
          .replace(/\s*-\s*Amazon\.(fr|com|co\.uk|de).*$/i, "")
          .replace(/\|\s*Amazon.*$/i, "")
          .trim();

        // Try to extract author from title pattern "Book Title: Author Name"
        let author = "Inconnu";
        const authorPatterns = [
          /:\s*([^:]+?):\s*(?:Books|Livres|Amazon)/i,
          /de\s+([A-ZÀ-Ü][a-zà-ü]+(?:\s+[A-ZÀ-Ü][a-zà-ü]+){1,3})/,
          /by\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/,
        ];
        for (const p of authorPatterns) {
          const m = text.match(p);
          if (m) { author = m[1].trim(); break; }
        }

        const price = extractPriceFromText(text);
        const { rating, reviewCount } = extractRatingFromText(text);

        // Pages
        let pages: number | null = null;
        const pagesMatch = text.match(/(\d+)\s*(?:pages|p\.)/i);
        if (pagesMatch) pages = parseInt(pagesMatch[1], 10);

        // BSR from search snippet (rare but possible)
        let bsr: number | null = null;
        const bsrMatch = text.match(/#?\s*([\d\s,.]+)\s*(?:in|dans|en)\s*(?:Kindle|Livres|Books)/i);
        if (bsrMatch) {
          const n = parseInt(bsrMatch[1].replace(/[\s,.]/g, ""), 10);
          if (!isNaN(n) && n > 0) bsr = n;
        }

        items.push({
          title: title.substring(0, 200),
          author: author.substring(0, 100),
          price,
          bsr,
          rating,
          reviewCount,
          pages,
          estimatedDailySales: estimateDailySales(bsr),
          asin,
          imageUrl: null,
          url: `https://www.${domain}/dp/${asin}`,
        });
      }

      // Now enrich top results by scraping individual product pages via Firecrawl
      // Use a second search specifically for BSR/details
      if (items.length > 0) {
        const enrichPromises = items.slice(0, 5).map(async (item) => {
          try {
            const detailQuery = `"${item.asin}" amazon BSR classement meilleures ventes`;
            const detailResults = await firecrawlSearch(detailQuery, firecrawlKey, 3);
            const detailData = detailResults?.data || [];
            
            for (const d of detailData) {
              const dText = `${d.title || ""} ${d.description || ""} ${d.markdown || ""}`;
              
              if (!item.bsr) {
                const bsrM = dText.match(/#?\s*([\d\s,.]+)\s*(?:in|dans|en)\s*(?:Kindle|Livres|Books)/i);
                if (bsrM) {
                  const n = parseInt(bsrM[1].replace(/[\s,.]/g, ""), 10);
                  if (!isNaN(n) && n > 0) {
                    item.bsr = n;
                    item.estimatedDailySales = estimateDailySales(n);
                  }
                }
              }
              if (!item.price) item.price = extractPriceFromText(dText);
              if (!item.rating) {
                const r = extractRatingFromText(dText);
                if (r.rating) item.rating = r.rating;
                if (r.reviewCount) item.reviewCount = r.reviewCount;
              }
            }
          } catch (e) {
            console.error(`Enrich failed for ${item.asin}:`, e);
          }
        });
        await Promise.all(enrichPromises);
      }

      return new Response(
        JSON.stringify({ success: true, items, totalResults: items.length, source: "firecrawl" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "lookup" && asins && Array.isArray(asins)) {
      const items: BookResult[] = [];

      const lookupPromises = asins.slice(0, 5).map(async (asin: string) => {
        try {
          const query = `"${asin}" site:${domain} kindle`;
          const results = await firecrawlSearch(query, firecrawlKey, 5);
          const data = results?.data || [];

          let title = asin;
          let author = "Inconnu";
          let price: number | null = null;
          let bsr: number | null = null;
          let rating: number | null = null;
          let reviewCount: number | null = null;
          let pages: number | null = null;

          for (const d of data) {
            const text = `${d.title || ""} ${d.description || ""} ${d.markdown || ""}`;
            
            if (title === asin && d.title) {
              title = d.title.replace(/\s*[-:|]\s*Amazon.*$/i, "").trim();
            }
            if (!price) price = extractPriceFromText(text);
            if (!rating) {
              const r = extractRatingFromText(text);
              if (r.rating) rating = r.rating;
              if (r.reviewCount) reviewCount = r.reviewCount;
            }
            const pM = text.match(/(\d+)\s*(?:pages|p\.)/i);
            if (!pages && pM) pages = parseInt(pM[1], 10);

            const bsrM = text.match(/#?\s*([\d\s,.]+)\s*(?:in|dans|en)\s*(?:Kindle|Livres|Books)/i);
            if (!bsr && bsrM) {
              const n = parseInt(bsrM[1].replace(/[\s,.]/g, ""), 10);
              if (!isNaN(n) && n > 0) bsr = n;
            }

            const aMatch = text.match(/(?:by|de|par)\s+([A-ZÀ-Ü][a-zà-ü]+(?:\s+[A-ZÀ-Ü][a-zà-ü]+){1,3})/);
            if (author === "Inconnu" && aMatch) author = aMatch[1].trim();
          }

          return {
            title: title.substring(0, 200),
            author,
            price,
            bsr,
            rating,
            reviewCount,
            pages,
            estimatedDailySales: estimateDailySales(bsr),
            asin,
            imageUrl: null,
            url: `https://www.${domain}/dp/${asin}`,
          } as BookResult;
        } catch (e) {
          console.error(`Lookup failed for ${asin}:`, e);
          return null;
        }
      });

      const results = await Promise.all(lookupPromises);
      for (const r of results) {
        if (r) items.push(r);
      }

      return new Response(
        JSON.stringify({ success: true, items, source: "firecrawl" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action. Use 'search' or 'lookup'." }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Amazon search error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
