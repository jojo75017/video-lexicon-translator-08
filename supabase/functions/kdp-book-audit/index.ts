import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { bookData } = await req.json();
    if (!bookData) {
      return new Response(JSON.stringify({ success: false, error: 'Données du livre requises' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ success: false, error: 'LOVABLE_API_KEY non configurée' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = `Tu es un expert KDP Amazon spécialisé dans l'optimisation de fiches produit. Tu dois analyser un livre et donner des scores de 0 à 100 et des recommandations concrètes pour chaque critère. Sois précis, actionnable et bienveillant. Réponds TOUJOURS en français.`;

    const userPrompt = `Analyse cette fiche de livre Amazon KDP et donne un audit complet avec des scores de 0 à 100 et des recommandations d'amélioration pour chaque critère :

DONNÉES DU LIVRE :
- Titre : ${bookData.title || 'Non disponible'}
- Auteur : ${bookData.author || 'Non disponible'}
- Prix : ${bookData.price ? bookData.price + '€' : 'Non disponible'}
- Note : ${bookData.rating ? bookData.rating + '/5' : 'Non disponible'}
- Avis : ${bookData.reviews || 'Non disponible'}
- BSR : ${bookData.bsr ? '#' + bookData.bsr : 'Non disponible'}
- Pages : ${bookData.pages || 'Non disponible'}
- Catégories : ${bookData.categories?.length ? bookData.categories.join(', ') : 'Aucune catégorie détectée'}
- Description : ${bookData.description || 'Non disponible'}
- Ventes estimées/mois : ${bookData.estimatedMonthlySales || 'Non disponible'}

Analyse les critères suivants et retourne ton évaluation.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'book_audit',
            description: 'Retourne l\'audit complet d\'un livre KDP avec scores et recommandations',
            parameters: {
              type: 'object',
              properties: {
                overall_score: { type: 'number', description: 'Score global de 0 à 100' },
                overall_verdict: { type: 'string', description: 'Verdict global en 1-2 phrases' },
                criteria: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: { type: 'string', description: 'Nom du critère (ex: Titre, Description, Prix, Catégories, Mots-clés, Couverture, Note & Avis, Positionnement BSR)' },
                      score: { type: 'number', description: 'Score de 0 à 100' },
                      status: { type: 'string', enum: ['excellent', 'bon', 'moyen', 'faible', 'critique'], description: 'Niveau de performance' },
                      recommendation: { type: 'string', description: 'Recommandation concrète d\'amélioration en 1-3 phrases' },
                      priority: { type: 'string', enum: ['haute', 'moyenne', 'basse'], description: 'Priorité d\'action' },
                    },
                    required: ['name', 'score', 'status', 'recommendation', 'priority'],
                    additionalProperties: false,
                  },
                },
                quick_wins: {
                  type: 'array',
                  items: { type: 'string' },
                  description: '3-5 actions rapides à mettre en place immédiatement',
                },
              },
              required: ['overall_score', 'overall_verdict', 'criteria', 'quick_wins'],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: 'function', function: { name: 'book_audit' } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ success: false, error: 'Trop de requêtes, réessayez dans quelques secondes.' }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ success: false, error: 'Crédits AI insuffisants.' }), {
          status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      return new Response(JSON.stringify({ success: false, error: 'Erreur du service AI' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiData = await response.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) {
      console.error('No tool call in AI response:', JSON.stringify(aiData));
      return new Response(JSON.stringify({ success: false, error: 'Réponse AI invalide' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const audit = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify({ success: true, data: audit }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Audit error:', error);
    return new Response(JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Erreur interne' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
