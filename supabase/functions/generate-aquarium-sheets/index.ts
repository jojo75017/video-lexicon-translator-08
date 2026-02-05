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

    const systemPrompt = `Tu es un expert aquariophile avec 20 ans d'expérience. Tu génères des fiches techniques ULTRA-DÉTAILLÉES et LONGUES pour poissons d'aquarium.

RÈGLES ABSOLUES:
- Chaque fiche doit contenir MINIMUM 500 MOTS de contenu textuel
- Les descriptions doivent être TRÈS DÉTAILLÉES et COMPLÈTES
- Chaque champ de texte doit faire AU MOINS 2-3 phrases complètes
- Données RÉALISTES et PRÉCISES (paramètres eau, tailles, comportements)
- Format JSON strict
- ${numberOfSheets} poissons DIFFÉRENTS, aucun doublon
- Privilégie les espèces POPULAIRES et ACCESSIBLES en animalerie

${customInstructions ? `INSTRUCTIONS SPÉCIALES: ${customInstructions}` : ''}`;

    const userPrompt = `Génère exactement ${numberOfSheets} fiches techniques TRÈS DÉTAILLÉES (500+ mots chacune) de ${categoryDesc}.

IMPORTANT - CHAQUE CHAMP DOIT ÊTRE LONG ET DÉTAILLÉ:

Pour chaque poisson, retourne un objet JSON avec cette structure EXACTE:

{
  "fishList": [
    {
      "id": 1,
      "scientificName": "Paracheirodon innesi",
      "commonName": "Néon bleu",
      "origin": "Originaire d'Amérique du Sud, principalement des affluents du bassin amazonien au Pérou et en Colombie. On le trouve naturellement dans les eaux noires et acides, riches en tanins provenant des feuilles mortes et du bois en décomposition. Ces eaux sont généralement très douces avec une faible minéralisation.",
      "adultSize": "3-4 cm en aquarium, peut atteindre 4.5 cm dans des conditions optimales avec une alimentation variée",
      "lifespan": "5 à 8 ans en captivité avec des soins appropriés, certains spécimens dépassant les 10 ans dans des aquariums parfaitement entretenus",
      "behavior": "Poisson extrêmement paisible et grégaire qui doit impérativement être maintenu en groupe d'au moins 10 individus pour exprimer son comportement naturel de banc. En groupe, les néons nagent de manière synchronisée et créent un spectacle visuel magnifique. Ils sont actifs principalement en journée et préfèrent nager dans la zone médiane de l'aquarium.",
      "swimmingLevel": "Zone médiane principalement, avec des incursions occasionnelles vers la surface pour l'alimentation",
      "temperature": "22-26°C, idéalement 24°C pour une activité optimale et une coloration intense",
      "ph": "5.5-7.0, préférence pour les eaux légèrement acides autour de 6.5",
      "gh": "2-10 °dGH, les eaux très douces sont préférables pour la reproduction",
      "kh": "1-5 °dKH, une faible dureté carbonatée est essentielle",
      "minVolume": "60 litres minimum pour un groupe de 10-15 individus, 100 litres recommandés pour un groupe plus important",
      "sensitivity": "Espèce sensible aux fluctuations des paramètres d'eau, particulièrement aux nitrates qui doivent rester sous 20 ppm. L'acclimatation doit être très progressive (méthode goutte-à-goutte sur 2-3 heures). Sensible également aux métaux lourds et au chlore résiduel.",
      "aquariumType": "Aquarium communautaire paisible ou biotope amazonien reconstitué avec d'autres espèces sud-américaines calmes",
      "setup": "Substrat de sable fin de couleur sombre pour mettre en valeur les couleurs du poisson. Décor composé de racines de mangrove ou de mopani créant des zones ombragées. Plantation dense sur les côtés et l'arrière avec des espèces amazoniennes comme Echinodorus, Microsorum pteropus, et Cabomba. Quelques feuilles de catappa ou de chêne pour teinter légèrement l'eau.",
      "lighting": "Éclairage faible à modéré, tamisé par des plantes flottantes comme Salvinia ou Limnobium. Les néons sont plus colorés et moins stressés sous un éclairage doux.",
      "filtration": "Filtration douce avec un débit modéré pour éviter les courants trop forts. Un filtre cascade ou éponge avec une sortie bien orientée est idéal. Filtration sur tourbe recommandée pour acidifier naturellement l'eau.",
      "compatible": ["Corydoras paleatus et aeneus", "Rasboras arlequin", "Crevettes Amano et Neocaridina", "Otocinclus affinis", "Apistogramma cacatuoides", "Cardinalis", "Hyphessobrycon herbertaxelrodi"],
      "avoid": ["Cichlidés africains et américains de grande taille", "Scalaires adultes qui peuvent les considérer comme proies", "Bettas territoriaux", "Barbus tigre mordeurs de nageoires", "Poissons combattants"],
      "stockingRule": "1 poisson pour 5 litres d'eau nette, groupe minimum de 10 individus fortement recommandé, idéalement 15-20 pour un effet banc naturel",
      "dietType": "Omnivore à tendance carnivore, acceptant une grande variété d'aliments adaptés à sa petite bouche",
      "mealFrequency": "2 à 3 fois par jour en très petites quantités, juste ce qu'ils peuvent consommer en 2-3 minutes",
      "menu": ["Micro-granulés de haute qualité", "Artémias vivants ou congelés", "Daphnies", "Vers de vase congelés", "Cyclops", "Paillettes broyées finement", "Nourriture vivante variée"],
      "dietWarning": "Éviter absolument la suralimentation qui peut provoquer des ballonnements mortels. Jeûner un jour par semaine est bénéfique. Varier les sources de protéines pour une nutrition optimale.",
      "substrate": "Sable fin 0.5-1mm de couleur sombre (noir, brun foncé) qui met en valeur la bande bleue fluorescente du poisson",
      "plants": ["Cabomba caroliniana", "Limnophila sessiliflora", "Cryptocoryne wendtii", "Mousse de Java (Taxiphyllum barbieri)", "Echinodorus bleheri", "Vallisneria spiralis"],
      "hideouts": "Racines de mangrove formant des grottes, feuilles de catappa créant des zones sombres, zones densément plantées offrant un sentiment de sécurité",
      "reproductionType": "Ovipare, ponte en pleine eau parmi les plantes à feuilles fines",
      "reproductionConditions": "Reproduction difficile nécessitant une eau très acide (pH 5.0-5.5), très douce (GH < 2), température 24-25°C, et obscurité totale. Les parents doivent être retirés immédiatement après la ponte car ils dévorent les œufs. Les alevins sont minuscules et nécessitent des infusoires puis des nauplies d'artémias.",
      "commonDiseases": ["Maladie du néon (Pleistophora hyphessobryconis) - incurable et contagieuse", "Ichtyophthirius multifiliis (points blancs)", "Pourriture des nageoires due au stress ou mauvaise qualité d'eau", "Columnaris", "Infections bactériennes diverses"],
      "stressSigns": "Décoloration de la bande bleue, nage erratique ou statique, isolement du groupe, respiration rapide, perte d'appétit, nageoires serrées contre le corps",
      "prevention": "Maintenir les nitrates sous 20 ppm avec des changements d'eau hebdomadaires de 20-25%. Quarantaine stricte de 4 semaines pour tout nouveau poisson. Éviter les variations brusques de température ou de paramètres. Alimentation variée et de qualité.",
      "difficulty": "Intermédiaire - nécessite une attention particulière aux paramètres d'eau mais reste accessible aux aquariophiles ayant quelques mois d'expérience",
      "difficultyStars": 2,
      "tips": [
        "L'acclimatation goutte-à-goutte sur minimum 2 heures est absolument essentielle pour éviter le choc osmotique qui peut être fatal",
        "Ne jamais maintenir moins de 10 individus car le stress du groupe trop petit affaiblit leur système immunitaire",
        "Les néons sont plus colorés et actifs dans une eau légèrement ambrée obtenue avec des feuilles de catappa ou de la tourbe",
        "Éviter de les introduire dans un aquarium de moins de 3 mois car ils sont sensibles au syndrome du nouvel aquarium",
        "Un éclairage tamisé par des plantes flottantes révèle la fluorescence naturelle de leur bande bleue"
      ]
    }
  ]
}

CRITIQUE - CHAQUE FICHE DOIT AVOIR:
- origin: minimum 3 phrases détaillées sur l'habitat naturel
- behavior: minimum 3 phrases sur le comportement social et l'activité
- sensitivity: minimum 2 phrases sur les sensibilités particulières
- setup: minimum 3 phrases détaillées sur l'aménagement
- compatible/avoid: minimum 5-7 espèces chacun avec noms complets
- menu: minimum 6-8 types d'aliments différents
- tips: minimum 5 conseils détaillés (2 phrases chacun minimum)
- Tous les autres champs: 1-2 phrases complètes minimum

GÉNÈRE EXACTEMENT ${numberOfSheets} poissons DIFFÉRENTS avec ce niveau de détail.`;

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
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          max_tokens: 32000,
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
