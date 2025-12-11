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
      synopsis,
      style = 'cinematic',
      authorName
    } = await req.json();

    console.log('Generating series cover:', { seriesTitle, tomeNumber, tomeTitle, genre, style });

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
      'default': 'style couverture de livre professionnel, éclairage cinématique, haute qualité'
    };

    const genreStyle = genreStyles[genre?.toLowerCase()] || genreStyles['default'];

    const tomeText = tomeNumber ? `Tome ${tomeNumber}${tomeTitle ? ` : ${tomeTitle}` : ''}` : '';
    
    const imagePrompt = `Crée une couverture de livre PROFESSIONNELLE (première de couverture) pour une série de livres ${genre || 'fiction'}.

DÉTAILS DE LA SÉRIE :
- Titre de la série : "${seriesTitle}"
${tomeText ? `- Ceci est : ${tomeText}` : '- Ceci est la couverture principale de la série'}
${synopsis ? `- Thème/Synopsis : ${synopsis.substring(0, 200)}` : ''}
${authorName ? `- Auteur : ${authorName}` : ''}

STYLE VISUEL :
- ${genreStyle}
- ${style === 'minimalist' ? 'Design minimaliste épuré avec imagerie symbolique' : 
    style === 'illustrated' ? 'Illustration détaillée avec imagerie riche et personnages' :
    style === 'photorealistic' ? 'Style photoréaliste avec composition dramatique' :
    'Composition visuelle cinématique et épique'}

EXIGENCES CRITIQUES :
- Format portrait ratio 2:3 pour Amazon KDP (1024x1536)
- Design plein bord - PAS de bordures blanches
- Qualité édition professionnelle
- Imagerie accrocheuse représentant l'histoire
- Espace en haut pour le titre de la série et numéro de tome
- Espace en bas pour le nom de l'auteur
- Palette de couleurs cohérente
- Contraste élevé pour les zones de texte lisibles
- NE PAS inclure de texte - laisser des zones propres pour superposition de texte

Rends cette couverture mémorable et appropriée au genre, adaptée à une série de livres bestseller.`;

    console.log('Calling Lovable AI for series cover generation');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
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
