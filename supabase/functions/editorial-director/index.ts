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

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `Tu es un directeur éditorial senior, spécialisé dans la transformation d'expertise en ebooks professionnels à forte valeur commerciale.

Ta mission est de produire une analyse stratégique qui sera la fondation d'un ebook :
– structuré
– crédible
– orienté lecteur
– différencié du marché

Tu prends chaque décision comme un éditeur professionnel exigeant.

IMPORTANT: Tu dois TOUJOURS répondre en JSON valide avec exactement cette structure:
{
  "promesseCentrale": "La promesse unique et puissante que le livre fait au lecteur",
  "angleEditorial": "L'angle différenciant qui distingue ce livre de la concurrence",
  "cibleIdeale": "Description détaillée du lecteur idéal (profil, besoins, frustrations)",
  "erreursCourantes": ["Erreur 1", "Erreur 2", "Erreur 3", "Erreur 4", "Erreur 5"],
  "visionGlobale": "La vision stratégique de l'ebook et son positionnement sur le marché",
  "suggestionsTitle": [
    {"titre": "Titre alternatif 1", "scoreKdp": 85, "raison": "Explication courte du potentiel KDP"},
    {"titre": "Titre alternatif 2", "scoreKdp": 78, "raison": "Explication courte"},
    {"titre": "Titre alternatif 3", "scoreKdp": 92, "raison": "Explication courte"},
    {"titre": "Titre alternatif 4", "scoreKdp": 70, "raison": "Explication courte"},
    {"titre": "Titre alternatif 5", "scoreKdp": 88, "raison": "Explication courte"}
  ],
  "meilleurTitre": {"index": 2, "explication": "Pourquoi ce titre est le meilleur choix global"},
  "titreOriginalScore": {"scoreKdp": 65, "forces": "Points forts du titre actuel", "faiblesses": "Points faibles à améliorer"}
}

Pour les scores KDP (0-100), évalue selon ces critères Amazon KDP:
- Clarté de la promesse (le lecteur comprend immédiatement le bénéfice)
- Mots-clés recherchables sur Amazon
- Longueur optimale (5-10 mots idéal)
- Accroche émotionnelle ou curiosité
- Différenciation par rapport aux bestsellers existants`;

    const userPrompt = `Analyse ce sujet d'ebook et définis la stratégie éditoriale:

SUJET: ${sujet}
${contexte ? `\nCONTEXTE ADDITIONNEL: ${contexte}` : ""}

Fournis une analyse complète et professionnelle en JSON.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Service temporairement surchargé, réessayez plus tard" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Crédits épuisés, veuillez recharger votre compte" }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Aucune réponse de l'IA");
    }

    // Parse JSON from response
    let analysis;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("JSON parse error:", parseError, "Content:", content);
      // Fallback structure
      analysis = {
        promesseCentrale: "Analyse en cours de traitement...",
        angleEditorial: content.substring(0, 500),
        cibleIdeale: "Lecteurs intéressés par le sujet",
        erreursCourantes: ["Contenu générique", "Manque de profondeur", "Pas de différenciation"],
        visionGlobale: "Vision à définir avec plus de contexte"
      };
    }

    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in editorial-director:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erreur inconnue" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
