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
    const { title, content } = await req.json();

    if (!title) {
      return new Response(
        JSON.stringify({ error: "Le titre est requis" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY non configurée");
    }

    const systemPrompt = `Tu es un éditeur exigeant spécialisé dans l'analyse de qualité éditoriale.

Ta mission est d'analyser le contenu fourni comme un éditeur professionnel et de produire une évaluation détaillée.

Critères d'évaluation :
1. Clarté globale : le message est-il immédiatement compréhensible ?
2. Cohérence interne : la structure et les arguments sont-ils logiques ?
3. Valeur perçue : le contenu apporte-t-il une vraie valeur au lecteur ?
4. Utilité pour le lecteur : le lecteur peut-il appliquer ce qu'il apprend ?

Tu dois identifier :
- Ce qui fonctionne (points forts)
- Ce qui doit être amélioré
- Les ajustements prioritaires

Réponds UNIQUEMENT en JSON valide avec cette structure exacte :
{
  "clarteGlobale": { "score": 7, "commentaire": "..." },
  "coherenceInterne": { "score": 8, "commentaire": "..." },
  "valeurPercue": { "score": 7, "commentaire": "..." },
  "utiliteLecteur": { "score": 8, "commentaire": "..." },
  "pointsForts": ["...", "...", "..."],
  "ameliorations": ["...", "...", "..."],
  "ajustementsPrioritaires": ["...", "...", "..."]
}`;

    const userPrompt = `Analyse ce contenu comme un éditeur exigeant :

Titre : ${title}
${content ? `\nContenu :\n${content}` : ''}

Évalue la clarté, la cohérence, la valeur perçue et l'utilité pour le lecteur.
Indique ce qui fonctionne, ce qui doit être amélioré, et les ajustements prioritaires.`;

    console.log("Calling OpenAI for editorial quality analysis...");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

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
        max_tokens: 2000,
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requêtes atteinte" }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error(`OpenAI error: ${response.status}`);
    }

    const data = await response.json();
    const contentText = data.choices[0].message.content;

    console.log("OpenAI response received");

    let result;
    try {
      const jsonMatch = contentText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        result = {
          clarteGlobale: { score: 7, commentaire: "Analyse basée sur le titre" },
          coherenceInterne: { score: 7, commentaire: "Structure à évaluer" },
          valeurPercue: { score: 7, commentaire: "Potentiel identifié" },
          utiliteLecteur: { score: 7, commentaire: "Applications possibles" },
          pointsForts: ["Sujet pertinent", "Potentiel commercial"],
          ameliorations: ["Approfondir le contenu", "Ajouter des exemples"],
          ajustementsPrioritaires: ["Structurer les chapitres", "Enrichir les exemples", "Clarifier la promesse"]
        };
      }
    } catch (e) {
      console.log("JSON parsing failed, using fallback");
      result = {
        clarteGlobale: { score: 7, commentaire: "Analyse basée sur le titre" },
        coherenceInterne: { score: 7, commentaire: "Structure à évaluer" },
        valeurPercue: { score: 7, commentaire: "Potentiel identifié" },
        utiliteLecteur: { score: 7, commentaire: "Applications possibles" },
        pointsForts: ["Sujet pertinent", "Potentiel commercial"],
        ameliorations: ["Approfondir le contenu"],
        ajustementsPrioritaires: ["Structurer", "Enrichir", "Clarifier"]
      };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Error in editorial-quality:", error);
    const errorMessage = error.name === 'AbortError' ? 'Timeout - analyse trop longue' : error.message;
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
