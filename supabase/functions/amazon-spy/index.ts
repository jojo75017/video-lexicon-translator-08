const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FIRECRAWL_V2 = 'https://api.firecrawl.dev/v2';
const GATEWAY_V2 = 'https://connector-gateway.lovable.dev/firecrawl/v2';

interface SpyBook {
  title: string;
  author?: string;
  price?: number | null;
  rating?: number | null;
  reviews?: number | null;
  bestSeller?: boolean;
  format?: string;
  position: number;
}

function firecrawlHeaders(apiKey: string) {
  if (apiKey.startsWith('lovc_')) {
    const lovableKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableKey) {
      throw new Error('LOVABLE_API_KEY manquant pour le mode gateway Firecrawl.');
    }
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${lovableKey}`,
      'X-Connection-Api-Key': apiKey,
    };
  }
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  };
}

function firecrawlUrl(apiKey: string, endpoint: string) {
  const base = apiKey.startsWith('lovc_') ? GATEWAY_V2 : FIRECRAWL_V2;
  return `${base}${endpoint}`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Firecrawl non configuré. Connectez Firecrawl dans les Connecteurs.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const body = await req.json().catch(() => ({}));
    const keyword: string = (body?.keyword ?? '').toString().trim();
    const marketplace: string = (body?.marketplace ?? 'fr').toString().toLowerCase();

    if (!keyword || keyword.length < 2) {
      return new Response(
        JSON.stringify({ error: 'Mot-clé requis (min. 2 caractères).' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const domain = marketplace === 'com' ? 'amazon.com'
      : marketplace === 'co.uk' || marketplace === 'uk' ? 'amazon.co.uk'
      : marketplace === 'de' ? 'amazon.de'
      : marketplace === 'es' ? 'amazon.es'
      : marketplace === 'it' ? 'amazon.it'
      : 'amazon.fr';

    const searchUrl = `https://www.${domain}/s?k=${encodeURIComponent(keyword)}&i=stripbooks`;

    const schema = {
      type: 'object',
      properties: {
        books: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              author: { type: 'string' },
              price: { type: 'number' },
              rating: { type: 'number' },
              reviews: { type: 'number' },
              bestSeller: { type: 'boolean' },
              format: { type: 'string' },
            },
            required: ['title'],
          },
        },
      },
      required: ['books'],
    };

    const fcRes = await fetch(firecrawlUrl(apiKey, '/scrape'), {
      method: 'POST',
      headers: firecrawlHeaders(apiKey),
      body: JSON.stringify({
        url: searchUrl,
        onlyMainContent: true,
        waitFor: 2500,
        location: { country: marketplace === 'com' ? 'US' : (marketplace === 'uk' || marketplace === 'co.uk') ? 'GB' : marketplace.toUpperCase() },
        formats: [{
          type: 'json',
          schema,
          prompt: `Extrait jusqu'à 20 livres des résultats de recherche Amazon dans l'ordre d'affichage. Pour chaque livre : titre exact, auteur, prix en nombre (sans devise), note moyenne (rating sur 5), nombre d'avis (reviews), si c'est un Best Seller (badge), et le format (Broché, Relié, Format Kindle, etc.).`,
        }],
      }),
    });

    const fcData = await fcRes.json();
    if (!fcRes.ok) {
      return new Response(
        JSON.stringify({ error: fcData?.error || `Firecrawl erreur ${fcRes.status}` }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const raw = fcData?.json?.books ?? fcData?.data?.json?.books ?? [];
    const books: SpyBook[] = (Array.isArray(raw) ? raw : [])
      .slice(0, 20)
      .map((b: Record<string, unknown>, i: number) => ({
        title: String(b.title ?? '').trim(),
        author: b.author ? String(b.author).trim() : undefined,
        price: typeof b.price === 'number' ? b.price : (b.price ? Number(String(b.price).replace(',', '.').replace(/[^\d.]/g, '')) || null : null),
        rating: typeof b.rating === 'number' ? b.rating : (b.rating ? Number(String(b.rating).replace(',', '.')) || null : null),
        reviews: typeof b.reviews === 'number' ? b.reviews : (b.reviews ? Number(String(b.reviews).replace(/[^\d]/g, '')) || null : null),
        bestSeller: Boolean(b.bestSeller),
        format: b.format ? String(b.format).trim() : undefined,
        position: i + 1,
      }))
      .filter((b: SpyBook) => b.title.length > 0);

    // ---- Analyse de niche ----
    const prices = books.map((b) => b.price).filter((p): p is number => typeof p === 'number' && p > 0);
    const reviewsArr = books.map((b) => b.reviews).filter((r): r is number => typeof r === 'number' && r >= 0);
    const ratings = books.map((b) => b.rating).filter((r): r is number => typeof r === 'number' && r > 0);

    const avg = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);
    const avgPrice = Math.round(avg(prices) * 100) / 100;
    const avgReviews = Math.round(avg(reviewsArr));
    const avgRating = Math.round(avg(ratings) * 10) / 10;
    const lowReviewCount = reviewsArr.filter((r) => r < 50).length;

    let demandScore = Math.min(100, books.length * 5);
    let competitionScore = avgReviews === 0 ? 20 : Math.min(100, Math.round((avgReviews / 500) * 100));
    const opportunity = Math.max(0, Math.min(100, Math.round(
      demandScore * 0.4 + (100 - competitionScore) * 0.5 + (lowReviewCount / Math.max(1, books.length)) * 100 * 0.1,
    )));

    const verdict = opportunity >= 70 ? 'Excellente opportunité'
      : opportunity >= 50 ? 'Niche correcte'
      : opportunity >= 30 ? 'Concurrence élevée'
      : 'Marché saturé';

    return new Response(
      JSON.stringify({
        keyword,
        marketplace: domain,
        searchUrl,
        books,
        analysis: {
          resultsCount: books.length,
          avgPrice,
          avgReviews,
          avgRating,
          lowReviewCount,
          opportunity,
          competitionScore,
          verdict,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : 'Erreur inconnue' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
