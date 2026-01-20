import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { category, timeframe } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "LOVABLE_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required" }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
