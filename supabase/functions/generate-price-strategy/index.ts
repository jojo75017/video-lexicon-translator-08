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
    const { title, subtitle, category, pages, format, targetAudience, language = 'fr' } = await req.json();

    if (!title || !category || !pages) {
      return new Response(
        JSON.stringify({ error: 'Titre, catégorie et nombre de pages requis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Clé API OpenAI non configurée' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const prompt = `Tu es un expert en tarification Amazon KDP et stratégie de prix pour ebooks et livres brochés.

Analyse ce livre et génère une stratégie de tarification complète :

**Informations du livre :**
- Titre : ${title}
- Sous-titre : ${subtitle || 'Non spécifié'}
- Catégorie : ${category}
- Nombre de pages : ${pages}
- Format : ${format || 'ebook + broché'}
- Public cible : ${targetAudience || 'Grand public'}
- Langue : ${language === 'fr' ? 'Français' : language}

**Génère un JSON avec cette structure exacte :**
{
  "ebookPrice": {
    "recommended": 0.00,
    "min": 0.00,
    "max": 0.00,
    "royalty70": 0.00,
    "royalty35": 0.00,
    "justification": "..."
  },
  "paperbackPrice": {
    "recommended": 0.00,
    "min": 0.00,
    "max": 0.00,
    "printingCost": 0.00,
    "royaltyEstimate": 0.00,
    "justification": "..."
  },
  "competitorAnalysis": {
    "averagePrice": 0.00,
    "priceRange": "X€ - Y€",
    "positioning": "...",
    "topCompetitors": ["Titre 1", "Titre 2", "Titre 3"]
  },
  "launchStrategy": {
    "phase1": { "name": "Lancement", "duration": "...", "ebookPrice": 0.00, "paperbackPrice": 0.00, "description": "..." },
    "phase2": { "name": "Croissance", "duration": "...", "ebookPrice": 0.00, "paperbackPrice": 0.00, "description": "..." },
    "phase3": { "name": "Maturité", "duration": "...", "ebookPrice": 0.00, "paperbackPrice": 0.00, "description": "..." }
  },
  "revenueProjection": {
    "monthly30": { "units": 0, "revenue": 0.00 },
    "monthly100": { "units": 0, "revenue": 0.00 },
    "monthly500": { "units": 0, "revenue": 0.00 }
  },
  "tips": ["Conseil 1", "Conseil 2", "Conseil 3", "Conseil 4", "Conseil 5"],
  "kdpCategories": ["Catégorie 1", "Catégorie 2", "Catégorie 3"],
  "priceScore": 85
}

Règles KDP à respecter :
- Ebook : entre 2.99€ et 9.99€ pour royalties 70%, sinon royalties 35%
- Broché : prix minimum = coût d'impression + marge KDP
- Coût d'impression approximatif = 0.012€/page × nombre de pages + 0.85€ (couverture)
- Analyse la concurrence dans la catégorie donnée
- Projections réalistes basées sur les ventes moyennes KDP

Réponds UNIQUEMENT avec le JSON, sans markdown ni texte autour.`;

    console.log('Generating price strategy:', { title, category, pages });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Tu es un expert en tarification Amazon KDP. Réponds uniquement en JSON valide.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI error:', response.status, errorText);
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Limite de requêtes atteinte. Réessayez dans quelques instants.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error(`Erreur API: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('Aucune réponse générée');
    }

    // Clean and parse JSON
    let parsed;
    try {
      const cleaned = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch {
      // Try brace-counting extraction
      const start = content.indexOf('{');
      const end = content.lastIndexOf('}');
      if (start !== -1 && end !== -1) {
        parsed = JSON.parse(content.substring(start, end + 1));
      } else {
        throw new Error('Impossible de parser la réponse');
      }
    }

    console.log('Price strategy generated successfully');

    return new Response(
      JSON.stringify({ strategy: parsed }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-price-strategy:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Erreur interne' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
