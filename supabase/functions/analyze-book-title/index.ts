import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const systemPrompt = `Tu es un expert en marketing de livres Amazon KDP et en copywriting. Tu analyses les titres de livres pour évaluer leur potentiel commercial.

IMPORTANT: Tu dois TOUJOURS répondre en JSON valide avec exactement cette structure:
{
  "score": 75,
  "marketPotential": "Analyse du potentiel de marché du titre (2-3 phrases)",
  "kdpOptimization": "Analyse de l'optimisation pour la recherche Amazon (2-3 phrases)",
  "emotionalImpact": "Analyse de l'impact émotionnel et de l'accroche (2-3 phrases)",
  "suggestions": [
    "Suggestion de titre alternatif 1",
    "Suggestion de titre alternatif 2",
    "Suggestion de titre alternatif 3",
    "Suggestion de titre alternatif 4",
    "Suggestion de titre alternatif 5"
  ],
  "keywords": ["mot-clé 1", "mot-clé 2", "mot-clé 3", "mot-clé 4", "mot-clé 5", "mot-clé 6"],
  "competitorTitles": [
    "Titre concurrent 1 dans la même niche",
    "Titre concurrent 2 dans la même niche",
    "Titre concurrent 3 dans la même niche"
  ]
}

CRITÈRES DE NOTATION (score sur 100):
- 90-100: Titre exceptionnel, fort potentiel viral
- 70-89: Bon titre, optimisé pour KDP
- 50-69: Titre moyen, améliorations nécessaires
- 30-49: Titre faible, refonte recommandée
- 0-29: Titre à éviter

Évalue selon:
1. Clarté de la promesse (le lecteur sait ce qu'il va obtenir)
2. Mots-clés recherchables sur Amazon
3. Différenciation par rapport à la concurrence
4. Impact émotionnel et curiosité
5. Longueur appropriée (court et mémorable)
6. Présence de mots puissants (secret, ultime, complet, etc.)`;

async function callLovableAI(title: string, apiKey: string): Promise<Response> {
  return await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash-lite",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Analyse ce titre de livre: "${title}"` }
      ],
      max_tokens: 2000,
    }),
  });
}

async function callOpenAI(title: string, apiKey: string): Promise<Response> {
  return await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Analyse ce titre de livre: "${title}"` }
      ],
      max_tokens: 2000,
    }),
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title } = await req.json();
    console.log("Analyzing title:", title);

    if (!title) {
      return new Response(
        JSON.stringify({ error: "Le titre est requis" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    
    console.log("LOVABLE_API_KEY exists:", !!LOVABLE_API_KEY);
    console.log("OPENAI_API_KEY exists:", !!OPENAI_API_KEY);

    let response: Response | null = null;
    let usedProvider = "lovable";

    // Try Lovable AI first
    if (LOVABLE_API_KEY) {
      response = await callLovableAI(title, LOVABLE_API_KEY);
      console.log("Lovable AI response status:", response.status);
      
      // If credits exhausted or rate limited, try OpenAI
      if (response.status === 402 || response.status === 429) {
        console.log("Lovable AI credits exhausted, trying OpenAI fallback...");
        response = null;
        usedProvider = "openai";
      }
    }

    // Fallback to OpenAI
    if (!response && OPENAI_API_KEY) {
      response = await callOpenAI(title, OPENAI_API_KEY);
      console.log("OpenAI response status:", response.status);
      usedProvider = "openai";
    }

    // No API available
    if (!response) {
      console.error("No API key available");
      return new Response(
        JSON.stringify({ error: "Aucune clé API configurée. Contactez l'administrateur." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`${usedProvider} API error:`, errorBody);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requêtes atteinte, réessayez plus tard" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      return new Response(
        JSON.stringify({ error: `Erreur API (${usedProvider}): ${response.status}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Aucune réponse de l'IA");
    }

    let analysis;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("JSON parse error:", parseError, "Content:", content);
      // Fallback analysis
      analysis = {
        score: 65,
        marketPotential: "Impossible d'analyser le potentiel marché.",
        kdpOptimization: "Analyse KDP non disponible.",
        emotionalImpact: "Impact émotionnel non évalué.",
        suggestions: [
          `${title} : Guide Complet`,
          `${title} - Les Secrets Révélés`,
          `Maîtrisez ${title}`,
          `${title} pour Débutants`,
          `Le Guide Ultime de ${title}`
        ],
        keywords: ["guide", "méthode", "stratégie", "pratique"],
        competitorTitles: ["Titre similaire dans la niche"]
      };
    }

    console.log("Analysis successful using:", usedProvider);
    
    return new Response(
      JSON.stringify({ analysis, provider: usedProvider }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in analyze-book-title:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erreur inconnue" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
