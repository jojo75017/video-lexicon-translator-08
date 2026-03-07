import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function callGemini(systemPrompt: string, userPrompt: string, opts: { maxTokens?: number; temperature?: number; timeout?: number } = {}) {
  const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
  if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY non configurée. Ajoutez votre clé Gemini dans Paramètres.");

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), opts.timeout || 60000);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        generationConfig: {
          temperature: opts.temperature ?? 0.7,
          maxOutputTokens: opts.maxTokens ?? 2000,
        },
      }),
      signal: controller.signal,
    }
  );

  clearTimeout(timeoutId);

  if (!response.ok) {
    const errText = await response.text();
    console.error("Gemini error:", response.status, errText);
    if (response.status === 429) throw { status: 429, message: "Limite de requêtes Gemini atteinte." };
    throw new Error(`Erreur Gemini: ${response.status}`);
  }

  const data = await response.json();
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!content) throw new Error("Aucune réponse de Gemini");
  return content;
}

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

    console.log("Architecture pour:", sujet, "avec", nombreChapitres, "chapitres (Gemini 3 Flash)");

    const content = await callGemini(systemPrompt, userPrompt, { maxTokens: 3000 });

    console.log("Réponse brute:", content.substring(0, 200));

    let architecture;
    try {
      const cleanContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      architecture = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Erreur parsing JSON:", parseError);
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
    const errorMessage = error.name === 'AbortError' ? 'Timeout - architecture trop longue' : (error.message || "Erreur interne");
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: error.status || 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
