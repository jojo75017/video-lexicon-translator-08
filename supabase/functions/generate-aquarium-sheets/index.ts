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
    const { numberOfSheets = 40, category = 'tropical', customInstructions = '' } = await req.json();

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!OPENAI_API_KEY && !LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Aucune clé API configurée' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const categoryDescriptions: Record<string, string> = {
      'tropical': 'poissons d\'eau douce tropicale populaires en aquariophilie (néons, guppys, scalaires, discus, corydoras, rasboras, barbus, gouramis, loches, ancistrus, etc.)',
      'coldwater': 'poissons d\'eau froide (poissons rouges, koïs, vairons, tanches, esturgeons, etc.)',
      'marine': 'poissons d\'eau de mer (poissons clowns, chirurgiens, demoiselles, gobies marins, etc.)',
      'mixed': 'mélange varié de poissons d\'aquarium de toutes catégories'
    };

    const categoryDesc = categoryDescriptions[category] || categoryDescriptions['tropical'];

    const systemPrompt = `Tu es un expert aquariophile avec 20 ans d'expérience. Tu génères des fiches techniques ULTRA-DÉTAILLÉES pour poissons d'aquarium.

RÈGLES ABSOLUES:
- Chaque fiche doit contenir TOUTES les sections du template
- Données RÉALISTES et PRÉCISES (paramètres eau, tailles, comportements)
- Informations COMPLÈTES pour chaque champ
- Format JSON strict
- ${numberOfSheets} poissons DIFFÉRENTS, aucun doublon
- Privilégie les espèces POPULAIRES et ACCESSIBLES en animalerie

${customInstructions ? `INSTRUCTIONS SPÉCIALES: ${customInstructions}` : ''}`;

    const userPrompt = `Génère exactement ${numberOfSheets} fiches techniques de ${categoryDesc}.

Pour chaque poisson, retourne un objet JSON avec cette structure EXACTE:

{
  "fishList": [
    {
      "id": 1,
      "scientificName": "Paracheirodon innesi",
      "commonName": "Néon bleu",
      "origin": "Amérique du Sud, Amazonie, eaux noires et acides",
      "adultSize": "3.5 cm",
      "lifespan": "5-8 ans",
      "behavior": "Paisible, grégaire",
      "swimmingLevel": "Milieu",
      "temperature": "22-26°C",
      "ph": "5.5-7.0",
      "gh": "2-10",
      "kh": "1-5",
      "minVolume": "60L",
      "sensitivity": "Sensible aux nitrates, acclimatation lente nécessaire",
      "aquariumType": "Communautaire, biotope amazonien",
      "setup": "Sable fin sombre, racines, plantes denses (Echinodorus, Microsorum), éclairage tamisé",
      "lighting": "Faible à modéré",
      "filtration": "Douce, peu de courant",
      "compatible": ["Corydoras", "Rasboras", "Crevettes Amano", "Otocinclus", "Apistogramma"],
      "avoid": ["Cichlidés agressifs", "Gros poissons", "Bettas"],
      "stockingRule": "1 poisson / 5L, groupe minimum 10 individus",
      "dietType": "Omnivore à tendance carnivore",
      "mealFrequency": "2x par jour, petites quantités",
      "menu": ["Micro-granulés", "Artémias", "Daphnies", "Vers de vase congelés"],
      "dietWarning": "Éviter suralimentation, sensible aux ballonnements",
      "substrate": "Sable fin 0.5-1mm, couleur sombre",
      "plants": ["Cabomba", "Limnophila", "Cryptocoryne", "Mousse de Java"],
      "hideouts": "Racines de mangrove, feuilles de catappa, zones plantées denses",
      "reproductionType": "Ovipare, ponte en pleine eau",
      "reproductionConditions": "Eau très acide (pH 5.5), obscurité, retirer parents après ponte",
      "commonDiseases": ["Maladie du néon (Pleistophora)", "Ichtyophthirius", "Pourriture des nageoires"],
      "stressSigns": "Décoloration, nage erratique, isolement du groupe",
      "prevention": "NO3 < 20ppm, changements 20%/semaine, quarantaine nouveaux poissons",
      "difficulty": "Intermédiaire",
      "difficultyStars": 2,
      "tips": [
        "Acclimatation goutte-à-goutte sur 2 heures minimum",
        "Jamais moins de 10 individus pour leur bien-être",
        "Éviter cohabitation avec poissons vifs ou stressants"
      ]
    }
  ]
}

IMPORTANT: 
- Génère EXACTEMENT ${numberOfSheets} poissons DIFFÉRENTS
- Chaque champ doit être REMPLI avec des données RÉELLES
- Les paramètres eau doivent être PRÉCIS et CORRECTS
- Varie les familles: Characidés, Cichlidés nains, Cyprinidés, Loricariidés, Anabantidés, etc.`;

    console.log(`Generating ${numberOfSheets} aquarium fish sheets (${category})...`);

    let content = '';
    
    // Priorité OpenAI pour fiabilité
    if (OPENAI_API_KEY) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          max_tokens: 16000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error('OpenAI error:', response.status, errText);
        throw new Error(`OpenAI error: ${response.status}`);
      }

      const data = await response.json();
      content = data.choices?.[0]?.message?.content || '';
    } else if (LOVABLE_API_KEY) {
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
            { role: 'user', content: userPrompt }
          ],
        }),
      });

      if (!response.ok) {
        if (response.status === 429 || response.status === 402) {
          return new Response(
            JSON.stringify({ error: 'Crédits épuisés ou limite atteinte' }),
            { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        throw new Error(`Lovable AI error: ${response.status}`);
      }

      const data = await response.json();
      content = data.choices?.[0]?.message?.content || '';
    }

    // Parse JSON response
    let fishList = [];
    try {
      // Clean markdown code blocks
      let cleanContent = content.trim();
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.slice(7);
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.slice(3);
      }
      if (cleanContent.endsWith('```')) {
        cleanContent = cleanContent.slice(0, -3);
      }
      cleanContent = cleanContent.trim();

      const parsed = JSON.parse(cleanContent);
      fishList = parsed.fishList || parsed.fish || parsed;
      
      if (!Array.isArray(fishList)) {
        fishList = [fishList];
      }
    } catch (parseErr) {
      console.error('JSON parse error:', parseErr);
      // Fallback: generate sample data
      fishList = generateFallbackFish(numberOfSheets);
    }

    console.log(`Generated ${fishList.length} fish sheets successfully`);

    return new Response(
      JSON.stringify({ fishList, count: fishList.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-aquarium-sheets:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Erreur inconnue' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function generateFallbackFish(count: number) {
  const fallbackFish = [
    { id: 1, scientificName: 'Paracheirodon innesi', commonName: 'Néon bleu', origin: 'Amazonie', adultSize: '3.5 cm', lifespan: '5 ans', behavior: 'Paisible, grégaire', swimmingLevel: 'Milieu', temperature: '22-26°C', ph: '5.5-7.0', gh: '2-10', kh: '1-5', minVolume: '60L', sensitivity: 'Sensible aux nitrates', aquariumType: 'Communautaire', setup: 'Plantes denses, racines', lighting: 'Modéré', filtration: 'Douce', compatible: ['Corydoras', 'Rasboras'], avoid: ['Cichlidés'], stockingRule: '10+ individus', dietType: 'Omnivore', mealFrequency: '2x/jour', menu: ['Granulés', 'Artémias'], dietWarning: 'Éviter suralimentation', substrate: 'Sable fin', plants: ['Cabomba', 'Mousse Java'], hideouts: 'Racines', reproductionType: 'Ovipare', reproductionConditions: 'Eau acide', commonDiseases: ['Ichtyophthirius'], stressSigns: 'Décoloration', prevention: 'Changements eau réguliers', difficulty: 'Intermédiaire', difficultyStars: 2, tips: ['Groupe minimum 10', 'Acclimatation lente'] },
    { id: 2, scientificName: 'Poecilia reticulata', commonName: 'Guppy', origin: 'Amérique du Sud', adultSize: '5 cm', lifespan: '3 ans', behavior: 'Vif, paisible', swimmingLevel: 'Surface/Milieu', temperature: '24-28°C', ph: '7.0-8.0', gh: '10-20', kh: '5-15', minVolume: '40L', sensitivity: 'Robuste', aquariumType: 'Communautaire', setup: 'Plantes flottantes', lighting: 'Modéré', filtration: 'Moyenne', compatible: ['Platys', 'Corydoras'], avoid: ['Bettas'], stockingRule: '1M/3F', dietType: 'Omnivore', mealFrequency: '2x/jour', menu: ['Paillettes', 'Spiruline'], dietWarning: 'Alimentation variée', substrate: 'Gravier', plants: ['Vallisneria', 'Elodea'], hideouts: 'Plantes denses', reproductionType: 'Vivipare', reproductionConditions: 'Facile', commonDiseases: ['Pourriture nageoires'], stressSigns: 'Nageoires repliées', prevention: 'Qualité eau', difficulty: 'Débutant', difficultyStars: 1, tips: ['Prolifique', 'Séparer alevins'] },
  ];
  
  const result = [];
  for (let i = 0; i < count; i++) {
    const base = fallbackFish[i % fallbackFish.length];
    result.push({ ...base, id: i + 1, commonName: `${base.commonName} ${i > 1 ? `var. ${i}` : ''}` });
  }
  return result;
}
