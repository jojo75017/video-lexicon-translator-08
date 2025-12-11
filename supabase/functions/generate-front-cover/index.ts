import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const stylePrompts: Record<string, string> = {
  professional: 'clean professional design, corporate style, elegant typography, subtle colors, business-like appearance',
  minimalist: 'minimalist design, lots of white space, simple elegant typography, clean lines, modern simplicity',
  artistic: 'artistic creative design, detailed illustrations, vibrant colors, unique visual elements, hand-drawn feel',
  modern: 'modern trendy design, geometric shapes, bold gradients, contemporary style, dynamic composition',
  vintage: 'vintage retro style, aged textures, classic typography, sepia tones, nostalgic feel',
  fantasy: 'fantasy magical style, mystical elements, ethereal lighting, enchanted atmosphere, otherworldly',
  thriller: 'dark intense style, high contrast, dramatic shadows, suspenseful mood, noir aesthetic',
  romance: 'soft romantic style, warm colors, elegant flowing elements, dreamy atmosphere, emotional depth',
  horror: 'dark terrifying style, horror elements, eerie atmosphere, macabre imagery, haunting shadows, blood red accents',
  detective: 'noir detective style, mystery elements, magnifying glass, clues, dark alleys, shadowy figures, crime scene feel',
  historical: 'historical period style, antique textures, period-accurate elements, aged parchment feel, classic elegance',
  literary: 'literary refined style, sophisticated typography, subtle elegance, classic book design, intellectual feel',
  comedy: 'bright cheerful style, playful illustrations, fun colors, humorous elements, light-hearted mood',
  adventure: 'epic adventure style, dramatic landscapes, action scenes, bold typography, exciting atmosphere',
  dystopian: 'dystopian dark style, post-apocalyptic elements, ruined cityscapes, oppressive atmosphere, muted colors',
  western: 'wild west style, desert landscapes, cowboy elements, sepia and brown tones, rustic textures',
  spiritual: 'spiritual serene style, soft light, sacred symbols, peaceful atmosphere, ethereal glow',
  cookbook: 'culinary appetizing style, food photography aesthetic, warm kitchen tones, delicious presentation'
};

const genrePrompts: Record<string, string> = {
  'non-fiction': 'non-fiction book, informative, educational feel',
  'fiction': 'fiction novel, storytelling, narrative feel',
  'business': 'business book, professional, corporate themes',
  'self-help': 'self-help book, motivational, personal growth themes',
  'fantasy': 'fantasy book, magical worlds, mythical creatures',
  'romance': 'romance novel, love story, emotional connection',
  'thriller': 'thriller book, suspense, mystery, danger',
  'sci-fi': 'science fiction, futuristic, technology, space',
  'children': 'children book, playful, colorful, friendly characters',
  'horror': 'horror book, scary, supernatural, dark themes',
  'mystery': 'mystery detective book, crime investigation, clues, suspense',
  'historical': 'historical fiction, period drama, past eras',
  'biography': 'biography memoir, real life story, personal journey',
  'cooking': 'cookbook, recipes, food, culinary arts',
  'travel': 'travel book, adventures, destinations, exploration',
  'poetry': 'poetry book, verses, lyrical, emotional expression',
  'health': 'health wellness book, fitness, wellbeing, lifestyle'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      ebookTitle, 
      authorName = 'Auteur', 
      subtitle = '',
      genre = 'non-fiction', 
      style = 'professional', 
      customPrompt = '',
      variation = 1,
      // KDP specific options
      coverType = 'front',
      bookFormat = '6x9',
      pageCount = 200,
      paperType = 'white',
      bindingType = 'paperback',
      spineWidth = '0.45',
      dimensions = null,
      backCoverText = ''
    } = await req.json();

    console.log('Generating cover:', { ebookTitle, authorName, genre, style, coverType, bookFormat, pageCount });

    if (!ebookTitle) {
      return new Response(
        JSON.stringify({ error: "Titre de l'ebook requis" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Configuration manquante - Clé API requise' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const styleDesc = stylePrompts[style] || stylePrompts.professional;
    const genreDesc = genrePrompts[genre] || genrePrompts['non-fiction'];

    let imagePrompt = '';

    if (coverType === 'full') {
      // Full cover (front + spine + back)
      imagePrompt = `Create a COMPLETE BOOK COVER for Amazon KDP print publication. This must include FRONT COVER, SPINE, and BACK COVER in a single horizontal image.

BOOK DETAILS:
- Title: "${ebookTitle}"
- Author: "${authorName}"
${subtitle ? `- Subtitle: "${subtitle}"` : ''}
- Genre: ${genreDesc}
- Style: ${styleDesc}
- Binding: ${bindingType === 'paperback' ? 'Paperback' : 'Hardcover'}

TECHNICAL SPECIFICATIONS (CRITICAL):
- This is a FULL WRAP-AROUND COVER layout
- Image must be LANDSCAPE/HORIZONTAL orientation
- Layout from LEFT to RIGHT: BACK COVER | SPINE | FRONT COVER
- Spine width: ${spineWidth} inches (based on ${pageCount} pages on ${paperType} paper)
- Book format: ${bookFormat}
${dimensions ? `- Total dimensions: approximately ${dimensions.totalWidthIn}" x ${dimensions.heightIn}"` : ''}

FRONT COVER (RIGHT SIDE):
1. TITLE "${ebookTitle}" - Large, prominent, clearly readable
2. Author name "${authorName}" - At bottom, smaller but visible
${subtitle ? `3. Subtitle "${subtitle}" - Below title` : ''}
4. Compelling visual illustration for the ${genre} genre

SPINE (CENTER - NARROW VERTICAL STRIP):
1. Title "${ebookTitle}" - Rotated vertically, readable from bottom to top
2. Author name "${authorName}" - At bottom of spine
3. Small decorative element or publisher logo area
4. Width proportional to ${pageCount} pages

BACK COVER (LEFT SIDE):
${backCoverText ? `1. Marketing text/synopsis: "${backCoverText.substring(0, 300)}"` : '1. Space for marketing copy/synopsis'}
2. Author bio area - leave a clean space for author information, DO NOT generate any person or face
3. Price area (bottom left)

DESIGN REQUIREMENTS:
- Seamless design that flows across all three sections
- Professional ${style} aesthetic throughout
- Consistent color palette and typography
- Full bleed design - NO white borders
- The spine must be clearly visible but naturally integrated
- Background/imagery should wrap smoothly from back to front

${customPrompt ? `ADDITIONAL CUSTOMIZATION: ${customPrompt}` : ''}

VARIATION ${variation}: Create a unique version while maintaining the layout structure.

This MUST look like a REAL, PRINT-READY Amazon KDP book cover.`;

    } else {
      // Front cover only
      imagePrompt = `Create a stunning professional FRONT BOOK COVER for Amazon KDP publication.

BOOK DETAILS:
- Title: "${ebookTitle}"
- Author: "${authorName}"
${subtitle ? `- Subtitle: "${subtitle}"` : ''}
- Genre: ${genreDesc}
- Style: ${styleDesc}
- Book format: ${bookFormat}

DESIGN REQUIREMENTS:
1. TITLE "${ebookTitle}" must be prominently displayed, large and clearly readable
2. AUTHOR NAME "${authorName}" at the bottom, smaller but visible
${subtitle ? `3. SUBTITLE "${subtitle}" below the main title, medium size` : ''}
4. Create a compelling visual illustration that represents the book theme
5. Use appropriate color palette for the ${genre} genre
6. Professional typography that fits the ${style} style
7. High-quality book cover composition

TECHNICAL SPECIFICATIONS:
- Portrait format (book cover standard ratio 2:3)
- Full bleed design - NO white borders
- Clear visual hierarchy: Image > Title > Subtitle > Author
- Text must be integrated naturally into the design
- Professional Amazon KDP quality

${customPrompt ? `ADDITIONAL CUSTOMIZATION: ${customPrompt}` : ''}

VARIATION ${variation}: Make this unique while maintaining the core design principles.

This must look like a REAL publishable book cover that would sell on Amazon.`;
    }

    console.log('Calling Lovable AI for image generation...');

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
        console.error('Rate limit reached');
        return new Response(
          JSON.stringify({ error: 'Limite de requêtes atteinte. Veuillez réessayer dans quelques instants.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        console.error('Credits exhausted');
        return new Response(
          JSON.stringify({ error: 'Crédits épuisés. Veuillez ajouter des crédits à votre espace de travail Lovable.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      throw new Error(`Erreur API: ${response.status}`);
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      console.error('No image in response:', JSON.stringify(data).slice(0, 500));
      throw new Error('Aucune image générée dans la réponse');
    }

    console.log('Cover generated successfully, type:', coverType);
    
    return new Response(
      JSON.stringify({ 
        imageUrl,
        coverType,
        dimensions: dimensions || null
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-front-cover:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Erreur interne lors de la génération' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
