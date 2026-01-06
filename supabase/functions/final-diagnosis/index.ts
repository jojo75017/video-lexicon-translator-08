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
    const { title, author } = await req.json();

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

    const systemPrompt = `Tu es un consultant éditorial senior qui réalise le diagnostic final d'un projet de livre avant publication.

Ta mission est de fournir un verdict éditorial complet et actionnable.

Tu dois évaluer :
1. Le potentiel commercial du projet
2. La clarté de la proposition de valeur
3. La qualité perçue par un lecteur potentiel
4. Les points critiques à corriger avant publication

Réponds UNIQUEMENT en JSON valide avec cette structure exacte :
{
  "verdictGlobal": "pret" ou "a_ameliorer",
  "verdictMessage": "Message explicatif du verdict en 1-2 phrases",
  "scoreClarte": 8,
  "scoreValeurPercue": 7,
  "scoreMoyen": 7.5,
  "ameliorationsPrioritaires": [
    {
      "titre": "Titre court de l'amélioration",
      "description": "Description détaillée de l'action à mener",
      "impact": "critique" ou "important" ou "recommande"
    }
  ],
  "recommandationsFinales": ["Recommandation 1", "Recommandation 2", "Recommandation 3"],
  "conclusionEditoriale": "Conclusion professionnelle sur le projet"
}

Les 3 améliorations prioritaires doivent être classées par ordre d'importance.
Le verdict "pret" ne s'applique que si le score moyen est >= 7.5 et qu'il n'y a pas d'amélioration "critique".`;

    const userPrompt = `Fournis un diagnostic éditorial final pour ce projet de livre :

Titre : "${title}"
Auteur : ${author || 'Non spécifié'}

Donne :
- un verdict global (prêt à publier / à améliorer)
- un score de clarté sur 10
- un score de valeur perçue sur 10
- les 3 améliorations prioritaires avant publication
- des recommandations finales
- une conclusion éditoriale professionnelle`;

    console.log("Calling OpenAI for final diagnosis...");

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
          verdictGlobal: "a_ameliorer",
          verdictMessage: "Le projet nécessite quelques ajustements avant publication.",
          scoreClarte: 7,
          scoreValeurPercue: 7,
          scoreMoyen: 7,
          ameliorationsPrioritaires: [
            { titre: "Renforcer la promesse", description: "Clarifier la proposition de valeur unique", impact: "important" },
            { titre: "Structurer les chapitres", description: "Assurer une progression logique", impact: "important" },
            { titre: "Enrichir les exemples", description: "Ajouter des cas concrets", impact: "recommande" }
          ],
          recommandationsFinales: ["Relire pour la cohérence", "Faire relire par un tiers", "Vérifier le formatage"],
          conclusionEditoriale: "Ce projet a un bon potentiel mais nécessite des ajustements avant publication."
        };
      }
    } catch (e) {
      console.log("JSON parsing failed, using fallback");
      result = {
        verdictGlobal: "a_ameliorer",
        verdictMessage: "Diagnostic généré avec des recommandations standard.",
        scoreClarte: 7,
        scoreValeurPercue: 7,
        scoreMoyen: 7,
        ameliorationsPrioritaires: [
          { titre: "Clarifier la promesse", description: "Renforcer le message central", impact: "important" },
          { titre: "Enrichir le contenu", description: "Ajouter des exemples concrets", impact: "important" },
          { titre: "Optimiser la structure", description: "Améliorer le flux de lecture", impact: "recommande" }
        ],
        recommandationsFinales: ["Révision complète", "Test lecteur", "Validation finale"],
        conclusionEditoriale: "Projet prometteur nécessitant des finitions."
      };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Error in final-diagnosis:", error);
    const errorMessage = error.name === 'AbortError' ? 'Timeout - diagnostic trop long' : error.message;
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
