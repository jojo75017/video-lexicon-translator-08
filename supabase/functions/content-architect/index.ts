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
    const { sujet, objectif, nombreChapitres = 8 } = await req.json();
    
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

    const systemPrompt = `Tu es un architecte éditorial expert spécialisé dans la conception de structures d'ebooks professionnels.

Tu dois créer une structure optimisée pour :
- La COMPRÉHENSION (clarté, progression logique)
- La PROGRESSION PÉDAGOGIQUE (du simple au complexe)
- La VALEUR PERÇUE (contenu premium, bonus)
- L'ENGAGEMENT DU LECTEUR (hooks, exercices, résumés)

IMPORTANT: Réponds UNIQUEMENT en JSON valide avec cette structure exacte:
{
  "introduction": {
    "elements": ["élément 1", "élément 2", "élément 3"],
    "justification": "Pourquoi cette structure d'intro"
  },
  "chapitres": [
    {
      "numero": 1,
      "titre": "Titre du chapitre",
      "objectif": "Objectif pédagogique en 3-5 mots",
      "justification": "Pourquoi ce chapitre à cette position",
      "sousSections": ["Sous-section 1", "Sous-section 2", "Sous-section 3"]
    }
  ],
  "conclusion": {
    "elements": ["élément 1", "élément 2"],
    "justification": "Pourquoi cette structure de conclusion"
  },
  "bonusSuggeres": ["Bonus 1", "Bonus 2", "Bonus 3"]
}

Crée exactement le nombre de chapitres demandé.
Chaque chapitre doit avoir 3-5 sous-sections.
Sois concret et orienté valeur pour le lecteur.`;

    const userPrompt = `Construis une structure d'ebook professionnelle pour:

SUJET: ${sujet}
${objectif ? `OBJECTIF DU LECTEUR: ${objectif}` : ""}
NOMBRE DE CHAPITRES: ${nombreChapitres}

Optimise pour:
- Compréhension maximale
- Progression pédagogique fluide
- Valeur perçue élevée
- Engagement constant du lecteur

Justifie brièvement chaque partie.`;

    console.log("Architecture pour:", sujet, "avec", nombreChapitres, "chapitres");

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
        max_tokens: 3000,
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

    console.log("Réponse brute:", content.substring(0, 200));

    let architecture;
    try {
      const cleanContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      architecture = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Erreur parsing JSON:", parseError);
      // Fallback structure
      architecture = {
        introduction: {
          elements: ["Accroche captivante", "Promesse de valeur", "Feuille de route"],
          justification: "Crée l'engagement initial et définit les attentes"
        },
        chapitres: Array.from({ length: nombreChapitres }, (_, i) => ({
          numero: i + 1,
          titre: `Chapitre ${i + 1}`,
          objectif: "À définir",
          justification: "Structure de base à personnaliser",
          sousSections: ["Section A", "Section B", "Section C"]
        })),
        conclusion: {
          elements: ["Récapitulatif", "Plan d'action", "Ressources"],
          justification: "Consolide l'apprentissage et encourage l'action"
        },
        bonusSuggeres: ["Checklist pratique", "Templates", "Ressources complémentaires"]
      };
    }

    return new Response(
      JSON.stringify({ success: true, architecture }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Erreur content-architect:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Erreur interne" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
