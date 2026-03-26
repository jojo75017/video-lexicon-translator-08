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

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      return new Response(JSON.stringify({ success: false, error: 'Clé Gemini non configurée. Ajoutez votre clé dans les paramètres.' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = `Tu es un expert KDP Amazon spécialisé dans l'optimisation de fiches produit. Tu dois analyser un livre et donner des scores de 0 à 100 et des recommandations concrètes pour chaque critère. Sois précis, actionnable et bienveillant. Réponds TOUJOURS en français.

Tu DOIS retourner un JSON valide avec cette structure exacte :
{
  "overall_score": number (0-100),
  "overall_verdict": "string verdict global",
  "criteria": [
    {
      "name": "Nom du critère",
      "score": number (0-100),
      "status": "excellent" | "bon" | "moyen" | "faible" | "critique",
      "recommendation": "Recommandation concrète",
      "priority": "haute" | "moyenne" | "basse"
    }
  ],
  "quick_wins": ["action rapide 1", "action rapide 2", ...]
}

Les critères à évaluer sont : Titre, Description, Prix, Catégories, Mots-clés potentiels, Couverture (basé sur les avis), Note & Avis, Positionnement BSR.
Retourne UNIQUEMENT le JSON, sans markdown ni texte autour.`;

    const userPrompt = `Analyse cette fiche de livre Amazon KDP :

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

Retourne le JSON d'audit complet.`;

    console.log('Calling Gemini for audit...');

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: systemPrompt + '\n\n' + userPrompt }] },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4096,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      if (response.status === 429) {
        return new Response(JSON.stringify({ success: false, error: 'Trop de requêtes Gemini, réessayez dans quelques secondes.' }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      return new Response(JSON.stringify({ success: false, error: 'Erreur Gemini: ' + response.status }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiData = await response.json();
    const rawText = aiData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      console.error('No text in Gemini response:', JSON.stringify(aiData));
      return new Response(JSON.stringify({ success: false, error: 'Réponse Gemini vide' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Gemini response received, parsing...');

    // Clean and parse JSON
    const cleaned = rawText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    const audit = JSON.parse(cleaned);

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
