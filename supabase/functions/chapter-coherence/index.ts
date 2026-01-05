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
    const { title, chaptersContent } = await req.json();

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

    const systemPrompt = `Tu es un éditeur senior analysant la COHÉRENCE GLOBALE INTER-CHAPITRES.

Analyse l'ensemble du contenu et vérifie:
1. Cohérence des idées principales
2. Continuité logique entre chapitres
3. Absence de contradictions
4. Progression pédagogique fluide

Liste les incohérences et propose des corrections précises.

Réponds UNIQUEMENT en JSON valide:
{
  "coherenceGlobale": "évaluation de la cohérence d'ensemble",
  "continuite": "analyse de la continuité logique",
  "contradictions": [
    {"chapitre": "nom", "probleme": "description", "correction": "solution"}
  ],
  "progressionPedagogique": "analyse de la progression",
  "score": 8,
  "recommandations": ["rec1", "rec2", "rec3"]
}`;

    const userContent = chaptersContent 
      ? `Titre: "${title}"\n\nContenu des chapitres:\n${chaptersContent}`
      : `Titre: "${title}"\n\nAnalyse la cohérence potentielle basée sur ce titre.`;

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
    const content = data.choices?.[0]?.message?.content || '';

    let analysis;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found');
      }
    } catch {
      analysis = {
        coherenceGlobale: "Analyse non disponible",
        continuite: "Analyse non disponible",
        contradictions: [],
        progressionPedagogique: "Analyse non disponible",
        score: 7,
        recommandations: ["Fournir le contenu des chapitres pour une analyse détaillée"]
      };
    }

    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in chapter-coherence:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
