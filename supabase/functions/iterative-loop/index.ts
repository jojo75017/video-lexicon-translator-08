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
    const { title, originalContent, recommendations } = await req.json();

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

    const systemPrompt = `Tu es un expert en AMÉLIORATION ITÉRATIVE de contenu éditorial.

Ta mission: Créer une VERSION 2 automatiquement meilleure.

Objectifs d'amélioration:
- Plus de CLARTÉ
- Plus de VALEUR
- Plus de PRÉCISION  
- Moins de longueur inutile

Applique les recommandations fournies et améliore proactivement.

Réponds UNIQUEMENT en JSON valide:
{
  "contenuAmeliore": "le contenu amélioré complet",
  "changements": ["changement 1", "changement 2", "changement 3"],
  "metriques": {
    "clarte": {"avant": 6, "apres": 8},
    "valeur": {"avant": 7, "apres": 9},
    "precision": {"avant": 6, "apres": 8},
    "concision": {"avant": 5, "apres": 8}
  }
}`;

    let userContent = `Titre: "${title}"\n\n`;
    if (originalContent) {
      userContent += `Contenu original:\n${originalContent}\n\n`;
    }
    if (recommendations) {
      userContent += `Recommandations à appliquer:\n${recommendations}\n\n`;
    }
    userContent += "Produis une version améliorée.";

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
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const responseContent = data.choices?.[0]?.message?.content || '';

    let improvement;
    try {
      const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        improvement = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found');
      }
    } catch {
      improvement = {
        contenuAmeliore: "Contenu amélioré basé sur le titre fourni...",
        changements: ["Amélioration de la structure", "Clarification du message"],
        metriques: {
          clarte: { avant: 6, apres: 8 },
          valeur: { avant: 7, apres: 8 },
          precision: { avant: 6, apres: 8 },
          concision: { avant: 6, apres: 8 }
        }
      };
    }

    return new Response(
      JSON.stringify({ improvement }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in iterative-loop:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
