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
    const { 
      seriesTitle, 
      tomeNumber, 
      tomeTitle,
      genre, 
      ageCategory = 'adult',
      synopsis,
      style = 'cinematic',
      authorName
    } = await req.json();

    console.log('Generating series cover:', { seriesTitle, tomeNumber, tomeTitle, genre, ageCategory, style, authorName });

    if (!seriesTitle) {
      return new Response(
        JSON.stringify({ error: 'Titre de la série requis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Configuration manquante - Clé Lovable AI requise' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Style variations based on genre (in French)
    const genreStyles: Record<string, string> = {
      'fantasy': 'style art fantasy épique, atmosphère magique, éclairage mystique, paysages enchantés',
      'science-fiction': 'style futuriste sci-fi, néons, atmosphère spatiale, éléments technologiques',
      'romance': 'éclairage romantique doux, couleurs chaudes, atmosphère élégante et émotionnelle',
      'thriller': 'atmosphère sombre et suspense, ombres dramatiques, style noir',
      'historique': 'style artistique d\'époque, esthétique vintage, précision historique',
      'horreur': 'atmosphère d\'horreur sombre, éclairage inquiétant, éléments gothiques',
      'aventure': 'scène d\'aventure dynamique, action, couleurs vibrantes',
      'policier': 'style polar noir, décor urbain, atmosphère mystérieuse',
      'dystopie': 'atmosphère post-apocalyptique, tons désaturés, ambiance oppressante',
      'urban fantasy': 'mélange urbain moderne et éléments magiques, néons et magie',
      'paranormal': 'atmosphère surnaturelle mystérieuse, jeux d\'ombres et de lumière',
      'default': 'style couverture de livre professionnel, éclairage cinématique, haute qualité'
    };

    // Age category adaptations
    const ageStyles: Record<string, string> = {
      'children': 'style illustration colorée adaptée aux enfants, personnages expressifs et mignons, couleurs vives et joyeuses',
      'young-adult': 'style dynamique pour adolescents, couleurs contrastées, ambiance moderne',
      'adult': 'style mature et sophistiqué, composition élégante',
      'all-ages': 'style universel accessible à tous, équilibré et accueillant'
    };

    const ageStyle = ageStyles[ageCategory] || ageStyles['adult'];

    const genreStyle = genreStyles[genre?.toLowerCase()] || genreStyles['default'];

    // Variations uniques par tome pour créer des couvertures différentes
    const tomeVariations = [
      { mood: 'aube, lumière dorée du matin, début d\'aventure, espoir', scene: 'personnage face à l\'horizon, nouveau départ' },
      { mood: 'crépuscule, couleurs orangées et violettes, tension montante', scene: 'personnage en action, moment de décision' },
      { mood: 'nuit étoilée, mystère, atmosphère intense', scene: 'confrontation, moment dramatique' },
      { mood: 'tempête, éclairs, climax épique', scene: 'bataille ou moment crucial' },
      { mood: 'lumière divine, révélation, conclusion majestueuse', scene: 'triomphe ou transformation' },
      { mood: 'brume mystérieuse, secrets révélés', scene: 'découverte importante' },
      { mood: 'feu et flammes, passion et danger', scene: 'épreuve de force' },
      { mood: 'glace et neige, isolation, survie', scene: 'voyage périlleux' },
      { mood: 'forêt enchantée, nature sauvage', scene: 'exploration mystique' },
      { mood: 'ville nocturne, lumières urbaines', scene: 'intrigue moderne' }
    ];

    const tomeIndex = tomeNumber ? (tomeNumber - 1) % tomeVariations.length : 0;
    const tomeVariation = tomeNumber ? tomeVariations[tomeIndex] : null;

    const tomeText = tomeNumber ? `Tome ${tomeNumber}${tomeTitle ? ` : ${tomeTitle}` : ''}` : '';
    
    // Prompt différent selon si c'est la couverture de série ou d'un tome spécifique
    let imagePrompt: string;
    const authorInfo = authorName ? `\nAuteur: ${authorName}` : '';
    
    if (tomeNumber && tomeNumber > 0) {
      // Couverture spécifique pour un tome
      imagePrompt = `Crée une couverture de livre UNIQUE pour le TOME ${tomeNumber} d'une série ${genre || 'fiction'}.

SÉRIE : "${seriesTitle}"${authorInfo}
TOME ${tomeNumber}${tomeTitle ? ` - "${tomeTitle}"` : ''}
${synopsis ? `Contexte : ${synopsis.substring(0, 150)}` : ''}

AMBIANCE SPÉCIFIQUE TOME ${tomeNumber} :
- Atmosphère : ${tomeVariation?.mood}
- Scène suggérée : ${tomeVariation?.scene}
- Cette couverture doit être DISTINCTE des autres tomes mais garder une cohérence visuelle

STYLE VISUEL :
- ${genreStyle}
- ${ageStyle}
- ${style === 'minimalist' ? 'Design minimaliste avec symbole unique pour ce tome' : 
    style === 'illustrated' ? 'Illustration détaillée montrant une scène clé de ce tome' :
    style === 'photorealistic' ? 'Style photoréaliste avec composition dramatique' :
    'Composition cinématique épique'}

EXIGENCES :
- Format portrait 2:3 (1024x1536) pour Amazon KDP
- Design plein bord sans bordures
- Image UNIQUE représentant l'essence du Tome ${tomeNumber}
- Espace pour titre en haut et auteur en bas
- PAS DE TEXTE sur l'image - zones propres pour superposition
- Couleurs cohérentes avec la série mais nuances uniques pour ce tome`;
    } else {
      // Couverture générale de la série
      imagePrompt = `Crée une couverture EMBLÉMATIQUE pour la série de livres "${seriesTitle}".${authorInfo}

DÉTAILS :
- Genre : ${genre || 'fiction'}
${synopsis ? `- Synopsis : ${synopsis.substring(0, 200)}` : ''}
- Ceci est la couverture PRINCIPALE de la série (pas un tome spécifique)

STYLE VISUEL :
- ${genreStyle}
- ${ageStyle}
- ${style === 'minimalist' ? 'Design minimaliste iconique' : 
    style === 'illustrated' ? 'Illustration majestueuse représentant l\'univers' :
    style === 'photorealistic' ? 'Style photoréaliste épique' :
    'Composition cinématique grandiose'}

EXIGENCES :
- Format portrait 2:3 (1024x1536) pour Amazon KDP
- Design plein bord sans bordures
- Image ICONIQUE représentant l'essence de toute la série
- Espace pour titre en haut et auteur en bas
- PAS DE TEXTE - zones propres pour superposition`;
    }

    console.log(`Generating ${tomeNumber ? `Tome ${tomeNumber}` : 'series'} cover with Lovable AI`);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-pro-image-preview',
        messages: [
          {
            role: 'user',
            content: imagePrompt
          }
        ],
        modalities: ['image', 'text']
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Limite de requêtes atteinte. Veuillez réessayer dans quelques instants.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Crédits épuisés. Veuillez ajouter des crédits.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      throw new Error(`Lovable AI error: ${response.status}`);
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      console.error('No image in response:', data);
      throw new Error('Aucune image générée');
    }

    console.log('Series cover generated successfully');
    
    return new Response(
      JSON.stringify({ imageUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-series-cover:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Erreur lors de la génération' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
