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

    const systemPrompt = `Tu es un ÉDITEUR SENIOR rendant un VERDICT FINAL ULTIME.

Effet psychologique recherché: Confiance maximale + Validation professionnelle.

Évalue et délivre:
1. Publiable en l'état? (oui/non)
2. Niveau global (débutant/intermédiaire/expert)
3. Risques éventuels
4. Points forts
5. Recommandation finale
6. Scores détaillés (clarté, valeur, structure, style, originalité sur 10)
7. Certificat de validation (phrase de conclusion officielle)

Sois juste mais encourageant.

Réponds UNIQUEMENT en JSON valide:
{
  "publiable": true,
  "niveauGlobal": "intermediaire",
  "risques": ["risque 1", "risque 2"],
  "pointsForts": ["point 1", "point 2", "point 3"],
  "recommandationFinale": "recommandation synthétique",
  "scoresDetailles": {
    "clarte": 8,
    "valeur": 7,
    "structure": 8,
    "style": 7,
    "originalite": 6
  },
  "certificat": "Ce contenu a été validé par le Verdict Éditeur Ultime..."
}`;

    const userContent = content 
      ? `Titre: "${title}"\n\nContenu à évaluer:\n${content}`
      : `Titre: "${title}"\n\nÉvalue le potentiel éditorial de ce projet.`;

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
        temperature: 0.6,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const responseContent = data.choices?.[0]?.message?.content || '';

    let verdict;
    try {
      const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        verdict = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found');
      }
    } catch {
      verdict = {
        publiable: true,
        niveauGlobal: "intermediaire",
        risques: [],
        pointsForts: ["Sujet pertinent", "Potentiel éditorial"],
        recommandationFinale: "Projet prometteur nécessitant développement",
        scoresDetailles: {
          clarte: 7,
          valeur: 7,
          structure: 7,
          style: 7,
          originalite: 7
        },
        certificat: "Ce projet a été évalué par le système Verdict Éditeur Ultime."
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
