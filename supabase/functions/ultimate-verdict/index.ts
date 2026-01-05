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
        JSON.stringify({ error: 'Title is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `Tu es un ÉDITEUR SENIOR rendant un VERDICT FINAL ULTIME sur un projet de livre.

TON RÔLE : Fournir une évaluation de FIABILITÉ ÉDITORIALE (pas de technologie, pas de promesses de ventes).

RÈGLES ABSOLUES :
- Jamais de flatterie vide
- Jamais de promesses de succès commercial
- Verdict clair et professionnel
- Focus sur : structure, cohérence, valeur lecteur, crédibilité

FORMAT DU VERDICT ÉDITORIAL (le message principal affiché) :
- Si publiable : "Ce projet présente une structure cohérente, une valeur claire pour le lecteur et un niveau de crédibilité suffisant pour une publication."
- Si à améliorer : "Des ajustements sont recommandés avant publication. [Raison principale en 1 phrase]"

Tu dois fournir :
1. publiable (boolean) - Le projet peut-il être publié en l'état ?
2. verdictEditorial (string) - LE MESSAGE PRINCIPAL (voir format ci-dessus)
3. niveauGlobal (debutant/intermediaire/expert) - Niveau perçu du contenu
4. risques (array) - Ajustements recommandés (0-3 maximum)
5. pointsForts (array) - Points forts identifiés (2-4 maximum)
6. recommandationFinale (string) - Une recommandation synthétique en 2 phrases max
7. scoresDetailles - Cohérence, Valeur, Crédibilité (sur 10 chacun)
8. certificat (string) - Phrase de certification officielle

Réponds UNIQUEMENT en JSON valide:
{
  "publiable": true,
  "verdictEditorial": "Ce projet présente une structure cohérente, une valeur claire pour le lecteur et un niveau de crédibilité suffisant pour une publication.",
  "niveauGlobal": "intermediaire",
  "risques": ["Ajustement 1", "Ajustement 2"],
  "pointsForts": ["Point fort 1", "Point fort 2", "Point fort 3"],
  "recommandationFinale": "Recommandation synthétique.",
  "scoresDetailles": {
    "coherence": 8,
    "valeur": 7,
    "credibilite": 8
  },
  "certificat": "Ce projet a été évalué et validé par le Verdict Éditeur Ultime. Il répond aux standards de qualité éditoriale."
}`;

    const userContent = content 
      ? `Titre: "${title}"\n\nContenu à évaluer:\n${content}`
      : `Titre: "${title}"\n\nÉvalue le potentiel éditorial de ce projet basé sur son titre.`;

    console.log("Calling AI Gateway for ultimate verdict...");

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent }
        ],
        temperature: 0.5,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const responseContent = data.choices?.[0]?.message?.content || '';

    console.log("Raw AI response received");

    let verdict;
    try {
      const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        verdict = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found');
      }
    } catch {
      console.log("JSON parsing failed, using fallback");
      verdict = {
        publiable: true,
        verdictEditorial: "Ce projet présente un potentiel éditorial. Une évaluation plus approfondie avec le contenu complet permettrait un verdict plus précis.",
        niveauGlobal: "intermediaire",
        risques: ["Fournir le contenu complet pour une évaluation détaillée"],
        pointsForts: ["Titre pertinent", "Sujet porteur"],
        recommandationFinale: "Projet prometteur. Soumettre le contenu complet pour un verdict définitif.",
        scoresDetailles: {
          coherence: 7,
          valeur: 7,
          credibilite: 7
        },
        certificat: "Ce projet a été pré-évalué par le système Verdict Éditeur Ultime."
      };
    }

    return new Response(
      JSON.stringify({ verdict }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ultimate-verdict:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
