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
    body: JSON.stringify({
      query,
      limit,
      scrapeOptions: { formats: ["markdown"] },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Firecrawl search failed (${response.status}): ${err}`);
  }
  return await response.json();
}

async function firecrawlScrape(url: string, apiKey: string) {
  const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url,
      formats: ["markdown"],
      onlyMainContent: true,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Firecrawl scrape failed (${response.status}): ${err}`);
  }
  return await response.json();
}

function extractBsr(text: string): number | null {
  // Match patterns like "Best Sellers Rank: #1,234" or "Classement des meilleures ventes : n°1 234"
  const patterns = [
    /Best\s*Sellers?\s*Rank[:\s]*#?([\d,.\s]+)/i,
    /Classement.*meilleures\s*ventes[:\s]*n°?\s*([\d\s,.]+)/i,
    /Amazon\s*Best\s*Sellers?\s*Rank[:\s]*#?([\d,.\s]+)/i,
    /BSR[:\s]*#?([\d,.\s]+)/i,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) {
      const num = parseInt(m[1].replace(/[\s,.]/g, ""), 10);
      if (!isNaN(num) && num > 0) return num;
    }
  }
  return null;
}

function extractPrice(text: string): number | null {
  // Match "9,99 €" or "€9.99" or "$12.99" or "9.99€"
  const patterns = [
    /([\d]+[,.][\d]{2})\s*€/,
    /€\s*([\d]+[,.][\d]{2})/,
    /\$([\d]+[,.][\d]{2})/,
    /Prix[:\s]*([\d]+[,.][\d]{2})/i,
    /Kindle[:\s]*([\d]+[,.][\d]{2})/i,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) {
      const num = parseFloat(m[1].replace(",", "."));
      if (!isNaN(num) && num > 0 && num < 500) return num;
    }
  }
  return null;
}

function extractRating(text: string): { rating: number | null; reviewCount: number | null } {
  let rating: number | null = null;
  let reviewCount: number | null = null;

  // "4.5 out of 5 stars" or "4,5 sur 5 étoiles"
  const ratingMatch = text.match(/([\d][,.][\d])\s*(?:out of|sur)\s*5/i);
  if (ratingMatch) {
    rating = parseFloat(ratingMatch[1].replace(",", "."));
  }

  // "1,234 ratings" or "1 234 évaluations" or "1.234 Bewertungen"
  const reviewMatch = text.match(/([\d\s,.]+)\s*(?:ratings?|évaluations?|avis|Bewertungen|customer reviews)/i);
  if (reviewMatch) {
    reviewCount = parseInt(reviewMatch[1].replace(/[\s,.]/g, ""), 10);
  }

  return { rating, reviewCount };
}

function extractPages(text: string): number | null {
  const m = text.match(/([\d]+)\s*(?:pages|Seiten)/i);
  if (m) {
    const n = parseInt(m[1], 10);
    if (!isNaN(n) && n > 0 && n < 10000) return n;
  }
  return null;
}

function extractAsin(url: string): string | null {
  const m = url.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i);
  return m ? m[1] : null;
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

function parseBookFromMarkdown(markdown: string, url: string): BookResult {
  const lines = markdown.split("\n").filter(l => l.trim());
  
  // Title: usually the first heading
  let title = "N/A";
  const titleMatch = markdown.match(/^#\s+(.+)/m);
  if (titleMatch) title = titleMatch[1].trim();
  else if (lines[0]) title = lines[0].replace(/^[#\s*]+/, "").trim();

  // Author
  let author = "Inconnu";
  const authorMatch = markdown.match(/(?:by|de|par|Auteur)\s*[:\s]*([^\n|]+)/i);
  if (authorMatch) author = authorMatch[1].trim().replace(/\[|\]/g, "").substring(0, 80);

  const bsr = extractBsr(markdown);
  const price = extractPrice(markdown);
  const { rating, reviewCount } = extractRating(markdown);
  const pages = extractPages(markdown);
  const asin = extractAsin(url);

  // Try to find an image
  let imageUrl: string | null = null;
  const imgMatch = markdown.match(/!\[.*?\]\((https:\/\/[^\s)]+(?:jpg|jpeg|png|webp)[^\s)]*)\)/i);
  if (imgMatch) imageUrl = imgMatch[1];

  return {
    title: title.substring(0, 200),
    author: author.substring(0, 100),
    price,
    bsr,
    rating,
    reviewCount,
    pages,
    estimatedDailySales: estimateDailySales(bsr),
    asin,
    imageUrl,
    url,
  };
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

    if (action === "search" && keywords) {
      const domain = marketplace === "us" ? "amazon.com" : marketplace === "uk" ? "amazon.co.uk" : marketplace === "de" ? "amazon.de" : "amazon.fr";
      const query = `site:${domain} ${keywords} Kindle ebook`;
      
      const searchResults = await firecrawlSearch(query, firecrawlKey, Math.min(maxResults || 10, 10));
      
      const items: BookResult[] = [];
      const results = searchResults?.data || searchResults?.results || [];

      for (const result of results) {
        const url = result.url || "";
        const markdown = result.markdown || result.description || "";
        
        if (!url.includes("amazon.") && !url.includes("/dp/")) continue;
        
        const book = parseBookFromMarkdown(markdown, url);
        if (book.title !== "N/A") {
          items.push(book);
        }
      }

      return new Response(
        JSON.stringify({ success: true, items, totalResults: items.length, source: "firecrawl" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "lookup" && asins && Array.isArray(asins)) {
      const domain = marketplace === "us" ? "amazon.com" : marketplace === "uk" ? "amazon.co.uk" : marketplace === "de" ? "amazon.de" : "amazon.fr";
      
      const items: BookResult[] = [];
      
      // Scrape each ASIN page directly
      const scrapePromises = asins.slice(0, 5).map(async (asin: string) => {
        try {
          const url = `https://www.${domain}/dp/${asin}`;
          const scrapeResult = await firecrawlScrape(url, firecrawlKey);
          const markdown = scrapeResult?.data?.markdown || scrapeResult?.markdown || "";
          if (markdown) {
            return parseBookFromMarkdown(markdown, url);
          }
        } catch (e) {
          console.error(`Failed to scrape ASIN ${asin}:`, e);
        }
        return null;
      });

      const results = await Promise.all(scrapePromises);
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
