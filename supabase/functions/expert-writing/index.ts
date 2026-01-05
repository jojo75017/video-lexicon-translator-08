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
    const { chapterTitle, chapterContext, targetAudience, expertise } = await req.json();

    if (!chapterTitle) {
      return new Response(
        JSON.stringify({ error: "Le titre du chapitre est requis" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY non configurée");
    }

    const systemPrompt = `Tu es un rédacteur expert reconnu dans ton domaine. Tu rédiges des contenus de qualité professionnelle.

Règles de rédaction :
- Clarté absolue : chaque phrase doit être immédiatement compréhensible
- Précision : utilise des termes techniques appropriés sans jargon inutile
- Exemples concrets : illustre chaque concept clé avec un exemple pratique
- Ton naturel : écris comme si tu expliquais à un collègue intelligent
- Zéro remplissage : chaque mot doit apporter de la valeur

Structure obligatoire :
1. Introduction engageante (2-3 phrases max)
2. Corps du chapitre avec sous-sections claires
3. Synthèse claire (résumé des points clés)
4. Action concrète (une tâche spécifique que le lecteur peut faire immédiatement)

Réponds en JSON avec cette structure :
{
  "introduction": "...",
  "sections": [
    {
      "titre": "...",
      "contenu": "...",
      "exemple": "..."
    }
  ],
  "synthese": "...",
  "actionConcrete": "...",
  "contenuComplet": "..."
}`;

    const userPrompt = `Rédige le chapitre suivant comme un expert reconnu :

Titre du chapitre : ${chapterTitle}
${chapterContext ? `Contexte : ${chapterContext}` : ''}
${targetAudience ? `Public cible : ${targetAudience}` : ''}
${expertise ? `Domaine d'expertise : ${expertise}` : ''}

Applique rigoureusement les règles de rédaction experte.`;

    console.log("Calling Lovable AI for expert writing...");

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
        result = {
          contenuComplet: content,
          synthese: "",
          actionConcrete: ""
        };
      }
    } catch (e) {
      console.log("JSON parsing failed, using raw content");
      result = {
        contenuComplet: content,
        synthese: "",
        actionConcrete: ""
      };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Error in expert-writing:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
