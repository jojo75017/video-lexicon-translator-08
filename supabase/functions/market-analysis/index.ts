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
    const { sujet, contexte } = await req.json();
    
    if (!sujet) {
      return new Response(
        JSON.stringify({ error: "Le sujet est requis" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY non configurée");
    }

    const systemPrompt = `Tu es un consultant expert en édition numérique et analyse de marché pour ebooks.

Tu dois analyser un sujet d'ebook et fournir une analyse de marché détaillée et actionnable.

IMPORTANT: Réponds UNIQUEMENT en JSON valide avec cette structure exacte:
{
  "attentesLecteurs": [
    { "element": "description de l'attente", "impact": "élevé|moyen|faible" }
  ],
  "frustrationsNonResolues": [
    { "element": "description de la frustration", "impact": "élevé|moyen|faible" }
  ],
  "anglesSousExploites": [
    { "element": "description de l'angle", "impact": "élevé|moyen|faible" }
  ],
  "erreursFrequentes": [
    { "element": "description de l'erreur", "impact": "élevé|moyen|faible" }
  ]
}

Fournis 3-5 éléments par catégorie, classés par potentiel d'impact.
Sois concret, actionnable et orienté valeur commerciale.`;

    const userPrompt = `Analyse ce sujet comme un consultant en édition numérique:

SUJET: ${sujet}
${contexte ? `CONTEXTE: ${contexte}` : ""}

Fournis:
– les attentes principales des lecteurs
– les frustrations non résolues
– les angles éditoriaux sous-exploités  
– les erreurs fréquentes des contenus concurrents

Classe chaque élément par potentiel d'impact (élevé, moyen, faible).`;

    console.log("Analyse de marché pour:", sujet);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erreur OpenAI:", response.status, errorText);
      throw new Error(`Erreur OpenAI: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Pas de contenu dans la réponse");
    }

    console.log("Réponse brute:", content);

    // Parser le JSON de la réponse
    let analysis;
    try {
      // Nettoyer le contenu si nécessaire (retirer les backticks markdown)
      const cleanContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      analysis = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Erreur parsing JSON:", parseError);
      // Fallback avec structure par défaut
      analysis = {
        attentesLecteurs: [
          { element: "Contenu pratique et actionnable", impact: "élevé" },
          { element: "Exemples concrets et cas d'usage", impact: "élevé" },
          { element: "Format facile à suivre étape par étape", impact: "moyen" }
        ],
        frustrationsNonResolues: [
          { element: "Trop de théorie, pas assez de pratique", impact: "élevé" },
          { element: "Contenu générique non adapté à leur situation", impact: "moyen" }
        ],
        anglesSousExploites: [
          { element: "Approche personnalisée par niveau d'expérience", impact: "élevé" },
          { element: "Intégration d'outils modernes et IA", impact: "moyen" }
        ],
        erreursFrequentes: [
          { element: "Structure trop complexe et intimidante", impact: "élevé" },
          { element: "Manque de ressources complémentaires", impact: "moyen" }
        ]
      };
    }

    return new Response(
      JSON.stringify({ success: true, analysis }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Erreur market-analysis:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Erreur interne" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
