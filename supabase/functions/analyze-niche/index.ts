import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const { niche } = await req.json();

    if (!niche || niche.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Niche requise' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const prompt = `Tu es un expert en édition de livres numériques et marketing Amazon KDP avec 10 ans d'expérience. Analyse en profondeur la niche suivante pour un ebook : "${niche.trim()}"

Réponds en JSON avec exactement cette structure :
{
  "scoreRentabilite": 78,
  "scoreDetails": {
    "demande": 85,
    "concurrence": 60,
    "margeBeneficiaire": 75,
    "potentielCroissance": 80
  },
  "niveauConcurrence": {
    "niveau": "Élevé",
    "nombreLivresEstime": "500-1000",
    "saturation": "Modérée",
    "difficulteDentree": "Moyenne",
    "analyse": "Description détaillée de la concurrence sur cette niche"
  },
  "forces": [
    { "text": "description de la force 1" },
    { "text": "description de la force 2" },
    { "text": "description de la force 3" },
    { "text": "description de la force 4" }
  ],
  "pointsAttention": [
    { "text": "description du point d'attention 1" },
    { "text": "description du point d'attention 2" },
    { "text": "description du point d'attention 3" }
  ],
  "demarquer": [
    { "text": "conseil détaillé pour se démarquer 1" },
    { "text": "conseil détaillé pour se démarquer 2" },
    { "text": "conseil détaillé pour se démarquer 3" }
  ],
  "motsClesKdp": [
    { "keyword": "mot-clé longue traîne 1", "volumeEstime": "Élevé", "difficulte": "Faible", "pertinence": 95 },
    { "keyword": "mot-clé longue traîne 2", "volumeEstime": "Moyen", "difficulte": "Moyenne", "pertinence": 88 },
    { "keyword": "mot-clé longue traîne 3", "volumeEstime": "Moyen", "difficulte": "Faible", "pertinence": 82 },
    { "keyword": "mot-clé longue traîne 4", "volumeEstime": "Faible", "difficulte": "Faible", "pertinence": 78 },
    { "keyword": "mot-clé longue traîne 5", "volumeEstime": "Élevé", "difficulte": "Élevée", "pertinence": 90 }
  ],
  "estimationRevenus": {
    "prixRecommande": "9.99-14.99€",
    "ventesEstimeesParMois": "30-80",
    "revenuMensuelEstime": "150-600€",
    "potentielAnnuel": "1800-7200€",
    "commentaire": "Explication du potentiel de revenus"
  }
}

IMPORTANT :
- Le scoreRentabilite est un pourcentage global de 0 à 100
- Les scoreDetails sont des pourcentages individuels de 0 à 100
- Les mots-clés doivent être des expressions longue traîne spécifiques à Amazon KDP
- Les estimations de revenus doivent être réalistes et basées sur le marché KDP
- Sois précis et concret. Parle directement au lecteur avec "tu/ton". Chaque texte des forces/points/démarquer doit faire 1-3 phrases.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Tu es un expert en édition de livres numériques et marketing KDP Amazon. Réponds uniquement en JSON valide sans markdown.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Trop de requêtes, réessayez dans quelques instants.' }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`OpenAI error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse AI response as JSON');
    }

    const analysis = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-niche:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
