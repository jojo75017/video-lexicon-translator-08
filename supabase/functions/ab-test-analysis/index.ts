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
    const { testType, variants, context } = await req.json();

    if (!variants || variants.length < 2) {
      return new Response(
        JSON.stringify({ error: "At least 2 variants required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "LOVABLE_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const variantDescriptions = variants.map((v: any, i: number) => {
      if (testType === "title") {
        return `Variant ${i + 1} (${v.name}): Title: "${v.title}"${v.subtitle ? `, Subtitle: "${v.subtitle}"` : ""}`;
      } else if (testType === "cover") {
        return `Variant ${i + 1} (${v.name}): Cover URL: ${v.coverUrl}`;
      } else {
        return `Variant ${i + 1} (${v.name}): Description: "${v.description}"`;
      }
    }).join("\n");

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
            content: `You are an expert in book marketing and A/B testing. Analyze the provided ${testType} variants and determine which would perform best for Amazon KDP sales.

Return a JSON response with this structure:
{
  "result": {
    "winnerId": "1",
    "winnerName": "Version A",
    "confidence": 85,
    "reasoning": "Detailed explanation of why this variant wins",
    "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"]
  },
  "variantScores": {
    "1": {
      "score": 85,
      "analysis": {
        "clarity": 90,
        "emotion": 80,
        "uniqueness": 85,
        "marketFit": 85
      }
    }
  }
}

Consider:
- Clarity and readability
- Emotional impact
- Uniqueness in the market
- Target audience appeal
- SEO and discoverability
- Click-through potential`
          },
          {
            role: "user",
            content: `Analyze these ${testType} variants for the ebook "${context?.ebookTitle || "Untitled"}":\n\n${variantDescriptions}\n\nWhich variant would perform best and why?`
          }
        ],
        temperature: 0.5,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Parse JSON from response
    let result = null;
    let variantScores = {};
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        result = parsed.result;
        variantScores = parsed.variantScores || {};
      }
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
    }

    return new Response(
      JSON.stringify({ result, variantScores }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("A/B test analysis error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
