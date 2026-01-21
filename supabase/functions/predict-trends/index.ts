import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type TrendPrediction = {
  niche: string;
  category: string;
  confidenceScore: number;
  trend: "rising" | "stable" | "declining";
  estimatedMonthlySearches: number;
  competitionLevel: "low" | "medium" | "high";
  profitPotential: number;
  bestTimeToPublish: string;
  keywordsToTarget: string[];
  reasoning: string;
};

function pseudoRandom(seed: string) {
  // Simple deterministic PRNG from a string seed
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateMockPredictions(category: string, timeframe: string): TrendPrediction[] {
  const rnd = pseudoRandom(`${category}::${timeframe}`);

  const bestTimeByTimeframe: Record<string, string[]> = {
    "3months": ["Février 2026", "Mars 2026", "Avril 2026"],
    "6months": ["Mars 2026", "Avril 2026", "Mai 2026"],
    "12months": ["Août 2026", "Septembre 2026", "Octobre 2026"],
  };

  const categoryLabelMap: Record<string, string> = {
    all: "Toutes catégories",
    fiction: "Fiction & Romans",
    nonfiction: "Non-Fiction",
    selfhelp: "Développement Personnel",
    business: "Business & Finance",
    health: "Santé & Bien-être",
    children: "Livres pour Enfants",
    romance: "Romance",
    thriller: "Thriller & Suspense",
  };

  const catLabel = categoryLabelMap[category] ?? "Toutes catégories";
  const bestTimes = bestTimeByTimeframe[timeframe] ?? bestTimeByTimeframe["6months"];

  const templates: Array<{ niche: string; keywords: string[]; reasoning: string; trend?: TrendPrediction["trend"] }> =
    category === "fiction" || category === "romance" || category === "thriller"
      ? [
          {
            niche: "Romance contemporaine (Workplace)",
            keywords: ["romance bureau", "workplace romance", "slow burn"],
            reasoning:
              "Communauté très active sur les réseaux; formats série et tomes courts performants en numérique.",
            trend: "rising",
          },
          {
            niche: "Thriller psychologique domestique",
            keywords: ["thriller psychologique", "mystère", "secret de famille"],
            reasoning:
              "Lecture addictive et forte demande; angles modernes (podcasts true crime) boostent la découverte.",
            trend: "rising",
          },
          {
            niche: "Fantasy urbaine 'cozy'",
            keywords: ["cozy fantasy", "fantasy urbaine", "magie moderne"],
            reasoning:
              "Le lectorat cherche des récits réconfortants; concurrence moins dense que la romantasy mainstream.",
            trend: "stable",
          },
          {
            niche: "LitRPG & progression fantasy",
            keywords: ["litRPG", "progression fantasy", "levels"],
            reasoning:
              "Consommation en série élevée, lecteurs fidèles; opportunités sur niches spécifiques.",
            trend: "stable",
          },
          {
            niche: "Romance paranormale dark",
            keywords: ["dark romance", "romance paranormale", "vampire romance"],
            reasoning:
              "Segment viral; fort potentiel mais concurrence plus forte—viser des micro-niches.",
            trend: "rising",
          },
          {
            niche: "Novellas 'page-turner' (1-2h)",
            keywords: ["nouvelle", "novella", "lecture rapide"],
            reasoning:
              "Formats courts performants sur mobile; bonne stratégie d'acquisition de lecteurs.",
            trend: "rising",
          },
        ]
      : [
          {
            niche: "IA & productivité personnelle",
            keywords: ["productivité IA", "automatisation", "assistants IA"],
            reasoning:
              "Demande croissante pour des guides pratiques orientés résultats (templates, workflows).",
            trend: "rising",
          },
          {
            niche: "Finances personnelles (débutants)",
            keywords: ["budget", "épargne", "investir débutant"],
            reasoning:
              "Contexte économique pousse à l'optimisation; forte recherche d'approches simples.",
            trend: "stable",
          },
          {
            niche: "Nutrition anti-inflammatoire",
            keywords: ["anti-inflammatoire", "recettes santé", "alimentation"],
            reasoning:
              "Intérêt constant; différenciation via menus, listes courses et plans hebdo.",
            trend: "stable",
          },
          {
            niche: "Parentalité & écrans",
            keywords: ["enfants écrans", "temps écran", "éducation numérique"],
            reasoning:
              "Préoccupation durable des parents; formats checklists et routines sont très demandés.",
            trend: "rising",
          },
          {
            niche: "Micro-habitudes & discipline",
            keywords: ["habitudes", "discipline", "routine"],
            reasoning:
              "Le marché préfère des méthodes courtes et actionnables; bon potentiel de séries.",
            trend: "rising",
          },
          {
            niche: "Jardinage urbain intérieur",
            keywords: ["potager appartement", "plantes intérieur", "hydroponie"],
            reasoning:
              "Tendance portée par l'urbanisation; niches 'petits espaces' restent sous-exploitées.",
            trend: "stable",
          },
        ];

  return templates.slice(0, 8).map((t, i) => {
    const confidenceBase = 78 + Math.floor(rnd() * 18);
    const competition: TrendPrediction["competitionLevel"] =
      rnd() < 0.35 ? "low" : rnd() < 0.78 ? "medium" : "high";
    const searches = Math.floor(12000 + rnd() * 70000);
    const profit = Math.round((6.8 + rnd() * 2.8) * 10) / 10;
    return {
      niche: t.niche,
      category: catLabel,
      confidenceScore: Math.min(97, confidenceBase + (i === 0 ? 3 : 0)),
      trend: t.trend ?? (rnd() < 0.6 ? "rising" : "stable"),
      estimatedMonthlySearches: searches,
      competitionLevel: competition,
      profitPotential: profit,
      bestTimeToPublish: bestTimes[i % bestTimes.length],
      keywordsToTarget: t.keywords,
      reasoning: t.reasoning,
    };
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { category, timeframe } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      // Mode dégradé: on renvoie des prédictions simulées au lieu d'une erreur bloquante.
      const predictions = generateMockPredictions(category ?? "all", timeframe ?? "6months");
      return new Response(
        JSON.stringify({ predictions, degraded: true, degradedReason: "AI key not configured" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const timeframeText = timeframe === "3months" ? "3 months" : timeframe === "6months" ? "6 months" : "12 months";
    const categoryText = category === "all" ? "all book categories" : category;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are an expert Amazon KDP market analyst. Analyze current publishing trends and predict profitable niches for the next ${timeframeText}.

Return a JSON array of 6-8 trend predictions with this exact structure:
{
  "predictions": [
    {
      "niche": "Niche name",
      "category": "Book category",
      "confidenceScore": 85,
      "trend": "rising" | "stable" | "declining",
      "estimatedMonthlySearches": 25000,
      "competitionLevel": "low" | "medium" | "high",
      "profitPotential": 8.5,
      "bestTimeToPublish": "Month Year",
      "keywordsToTarget": ["keyword1", "keyword2", "keyword3"],
      "reasoning": "Explanation of why this niche is trending"
    }
  ]
}

Focus on ${categoryText}. Consider:
- Current social media trends (TikTok, Instagram)
- Seasonal patterns
- Economic factors
- Technology adoption
- Demographic shifts
- Cultural events

Provide actionable insights with realistic data.`
          },
          {
            role: "user",
            content: `Predict the most profitable ebook niches for the next ${timeframeText} in ${categoryText}. Focus on niches with strong growth potential and low to medium competition.`
          }
        ],
        temperature: 0.7,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      // Mode dégradé: on évite de bloquer l'UI si l'IA est en quota/indisponible.
      if (response.status === 429 || response.status === 402) {
        const predictions = generateMockPredictions(category ?? "all", timeframe ?? "6months");
        return new Response(
          JSON.stringify({
            predictions,
            degraded: true,
            degradedReason: response.status === 402 ? "Payment required" : "Rate limit exceeded",
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Parse JSON from response
    let predictions = [];
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        predictions = parsed.predictions || [];
      }
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
    }

    return new Response(
      JSON.stringify({ predictions }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Trend prediction error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
