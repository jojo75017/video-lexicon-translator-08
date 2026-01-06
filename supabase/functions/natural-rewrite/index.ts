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
    const { text, style, preserveStructure } = await req.json();

    if (!text) {
      return new Response(
        JSON.stringify({ error: "Le texte à réécrire est requis" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY non configurée");
    }

    const systemPrompt = `Tu es un expert en réécriture éditoriale. Ta mission est de transformer des textes pour les rendre naturels et humains.

Objectifs de la réécriture :
- FLUIDE : les phrases s'enchaînent naturellement, sans ruptures
- NATUREL : le texte sonne comme une conversation intelligente
- CRÉDIBLE : le ton inspire confiance sans être pompeux
- SANS TRACE IA : aucune formulation générique ou robotique

Éléments à SUPPRIMER systématiquement :
- "Il est important de noter que..."
- "En conclusion..."
- "Dans le monde actuel..."
- "Il convient de souligner..."
- Listes à puces excessives
- Répétitions de mots-clés
- Phrases trop longues (+ de 25 mots)
- Adverbes inutiles (vraiment, absolument, totalement)

Éléments à AJOUTER :
- Transitions naturelles entre paragraphes
- Variations de longueur de phrases
- Questions rhétoriques occasionnelles
- Anecdotes ou exemples vivants

Réponds en JSON :
{
  "texteReecrit": "...",
  "modificationsApportees": ["...", "..."],
  "scoreNaturalite": 85,
  "suggestions": ["...", "..."]
}`;

    const userPrompt = `Réécris ce texte pour qu'il soit naturel, fluide et crédible :

---
${text}
---

${style ? `Style souhaité : ${style}` : ''}
${preserveStructure ? 'Préserve la structure globale du texte.' : ''}

Supprime toute formulation générique ou automatisée.`;

    console.log("Calling OpenAI for natural rewrite...");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000);

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
          { role: "user", content: userPrompt }
        ],
        max_tokens: 4000,
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requêtes atteinte, réessayez dans quelques instants." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error(`OpenAI error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    console.log("OpenAI response received");

    let result;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        result = {
          texteReecrit: content,
          modificationsApportees: [],
          scoreNaturalite: 0,
          suggestions: []
        };
      }
    } catch (e) {
      console.log("JSON parsing failed, using raw content");
      result = {
        texteReecrit: content,
        modificationsApportees: [],
        scoreNaturalite: 0,
        suggestions: []
      };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Error in natural-rewrite:", error);
    const errorMessage = error.name === 'AbortError' ? 'Timeout - réécriture trop longue' : error.message;
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
