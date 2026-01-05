import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { bookTitle, bookSummary, authorName, targetAudience, genre } = await req.json();

    if (!bookTitle) {
      return new Response(
        JSON.stringify({ error: "Le titre du livre est requis" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY non configurée");
    }

    const systemPrompt = `Tu es un expert en marketing éditorial et copywriting. Tu crées des éléments marketing qui convertissent.

Objectifs du packaging :
- CLARTÉ : le lecteur comprend immédiatement la valeur
- CRÉDIBILITÉ : inspire confiance sans exagération
- CONVERSION : pousse à l'action (achat, téléchargement)

Génère les éléments suivants en JSON :
{
  "descriptionPersuasive": {
    "courte": "... (max 150 caractères)",
    "moyenne": "... (max 500 caractères)", 
    "longue": "... (max 1500 caractères)"
  },
  "texteCouverture": {
    "quatriemeCouverture": "...",
    "bandeauPromo": "..."
  },
  "presentationAuteur": {
    "courte": "... (50 mots)",
    "complete": "... (150 mots)"
  },
  "accroches": {
    "principale": "...",
    "alternatives": ["...", "...", "..."],
    "reseauxSociaux": {
      "twitter": "...",
      "linkedin": "...",
      "instagram": "..."
    }
  },
  "argumentsVente": ["...", "...", "..."],
  "objectionsBrisees": [
    {
      "objection": "...",
      "reponse": "..."
    }
  ]
}`;

    const userPrompt = `Génère le packaging marketing complet pour ce livre :

Titre : ${bookTitle}
${bookSummary ? `Résumé : ${bookSummary}` : ''}
${authorName ? `Auteur : ${authorName}` : ''}
${targetAudience ? `Public cible : ${targetAudience}` : ''}
${genre ? `Genre : ${genre}` : ''}

Objectif : créer des éléments marketing clairs, crédibles et orientés conversion.`;

    console.log("Calling Lovable AI for editorial packaging...");

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
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requêtes atteinte, réessayez dans quelques instants." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Crédits insuffisants." }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    console.log("Raw AI response received");

    let result;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found");
      }
    } catch (e) {
      console.log("JSON parsing failed, creating fallback structure");
      result = {
        descriptionPersuasive: {
          courte: content.substring(0, 150),
          moyenne: content.substring(0, 500),
          longue: content
        },
        texteCouverture: {
          quatriemeCouverture: "",
          bandeauPromo: ""
        },
        presentationAuteur: {
          courte: "",
          complete: ""
        },
        accroches: {
          principale: "",
          alternatives: [],
          reseauxSociaux: {}
        },
        argumentsVente: [],
        objectionsBrisees: []
      };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Error in editorial-packaging:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
