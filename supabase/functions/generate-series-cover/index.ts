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

    // Style variations based on genre
    const genreStyles: Record<string, string> = {
      'fantasy': 'epic fantasy art style, magical atmosphere, mystical lighting, enchanted landscapes',
      'science-fiction': 'futuristic sci-fi style, neon lights, space atmosphere, technological elements',
      'romance': 'romantic soft lighting, warm colors, elegant and emotional atmosphere',
      'thriller': 'dark and suspenseful atmosphere, dramatic shadows, noir style',
      'historique': 'period-appropriate art style, vintage aesthetic, historical accuracy',
      'horreur': 'dark horror atmosphere, eerie lighting, gothic elements',
      'aventure': 'adventurous dynamic scene, action-packed, vibrant colors',
      'policier': 'crime noir style, urban setting, mysterious atmosphere',
      'default': 'professional book cover style, cinematic lighting, high quality'
    };

    const genreStyle = genreStyles[genre?.toLowerCase()] || genreStyles['default'];

    const tomeText = tomeNumber ? `Tome ${tomeNumber}${tomeTitle ? `: ${tomeTitle}` : ''}` : '';
    
    const imagePrompt = `Create a stunning professional BOOK COVER (front cover) for a ${genre || 'fiction'} book series.

SERIES DETAILS:
- Series Title: "${seriesTitle}"
${tomeText ? `- This is: ${tomeText}` : '- This is the main series cover'}
${synopsis ? `- Theme/Synopsis: ${synopsis.substring(0, 200)}` : ''}
${authorName ? `- Author: ${authorName}` : ''}

VISUAL STYLE:
- ${genreStyle}
- ${style === 'minimalist' ? 'Clean minimalist design with symbolic imagery' : 
    style === 'illustrated' ? 'Detailed illustration with rich imagery and characters' :
    style === 'photorealistic' ? 'Photorealistic style with dramatic composition' :
    'Cinematic and epic visual composition'}

CRITICAL REQUIREMENTS:
- Portrait format 2:3 ratio for Amazon KDP (1024x1536)
- Full bleed design - NO white borders
- Professional publishing quality
- Eye-catching imagery that represents the story
- Space at top for series title and tome number
- Space at bottom for author name
- Cohesive color palette
- High contrast for text readability areas
- DO NOT include any text - leave clean areas for text overlay

Make this cover memorable and genre-appropriate, suitable for a bestselling book series.`;

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
