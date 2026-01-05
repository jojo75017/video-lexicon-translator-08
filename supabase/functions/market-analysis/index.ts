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

const systemPrompt = `Tu es un expert en SEO Amazon KDP et en analyse de marché pour ebooks numériques.

Tu dois analyser un sujet d'ebook et fournir une analyse de marché détaillée AVEC 7 MOTS-CLÉS KDP OPTIMISÉS.

IMPORTANT: Réponds UNIQUEMENT en JSON valide avec cette structure exacte:
{
  "nichePrincipale": "la niche KDP précise identifiée",
  "tailleMarche": "grand|moyen|niche",
  "concurrenceNiveau": "faible|moyenne|forte",
  "opportunite": "l'opportunité identifiée",
  "motsClésKDP": ["7 mots-clés stratégiques pour Amazon KDP"],
  "justificationMotsCles": ["justification courte pour chaque mot-clé"],
  "categoriesKDP": ["2 catégories Amazon principales"],
  "categoriesSecondaires": ["3 catégories cachées potentielles"],
  "prixOptimal": "prix suggéré avec justification",
  "potentielVentes": "estimation réaliste",
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

Pour les mots-clés KDP:
- Correspondre à des recherches réelles d'internautes (Amazon + Google France)
- Être adaptés à Amazon KDP (ni trop génériques, ni trop vagues)
- Pas de répétition exacte du titre

Fournis 3-5 éléments par catégorie d'analyse, classés par potentiel d'impact.
Sois concret, actionnable et orienté valeur commerciale.`;

    const userPrompt = `Analyse ce sujet d'ebook et génère 7 mots-clés KDP stratégiques:

SUJET/TITRE: ${sujet}
${contexte ? `CONTEXTE: ${contexte}` : ""}

Fournis:
1. L'analyse de niche et positionnement marché
2. 7 MOTS-CLÉS KDP très performants pour Amazon France
3. Les catégories Amazon recommandées
4. Le prix optimal suggéré
5. Les attentes des lecteurs
6. Les frustrations non résolues par la concurrence
7. Les angles sous-exploités
8. Les erreurs fréquentes des concurrents`;

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
      // Fallback avec structure par défaut incluant mots-clés
      analysis = {
        nichePrincipale: "Non déterminée",
        tailleMarche: "moyen",
        concurrenceNiveau: "moyenne",
        opportunite: "Analyse complète requise",
        motsClésKDP: ["mot-clé 1", "mot-clé 2", "mot-clé 3", "mot-clé 4", "mot-clé 5", "mot-clé 6", "mot-clé 7"],
        justificationMotsCles: [],
        categoriesKDP: ["Catégorie principale"],
        categoriesSecondaires: [],
        prixOptimal: "À déterminer",
        potentielVentes: "À évaluer",
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
