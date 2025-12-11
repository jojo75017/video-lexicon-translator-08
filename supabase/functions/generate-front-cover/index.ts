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
  romance: 'soft romantic style, warm colors, elegant flowing elements, dreamy atmosphere, emotional depth'
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
  'children': 'children book, playful, colorful, friendly characters'
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
      variation = 1 
    } = await req.json();

    console.log('Generating front cover:', { ebookTitle, authorName, genre, style, variation });

    if (!ebookTitle) {
      return new Response(
        JSON.stringify({ error: 'Titre de l\'ebook requis' }),
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

    const imagePrompt = `Create a stunning professional FRONT BOOK COVER for Amazon KDP publication.

BOOK DETAILS:
- Title: "${ebookTitle}"
- Author: "${authorName}"
${subtitle ? `- Subtitle: "${subtitle}"` : ''}
- Genre: ${genreDesc}
- Style: ${styleDesc}

DESIGN REQUIREMENTS:
1. TITLE must be prominently displayed, large and clearly readable
2. AUTHOR NAME at the bottom, smaller but visible
${subtitle ? '3. SUBTITLE below the main title, medium size' : ''}
4. Create a compelling visual illustration that represents the book's theme
5. Use appropriate color palette for the ${genre} genre
6. Professional typography that fits the ${style} style
7. High-quality book cover composition

TECHNICAL SPECIFICATIONS:
- Portrait format 2:3 ratio (book cover standard)
- Full bleed design - NO white borders
- Clear visual hierarchy: Image > Title > Subtitle > Author
- Text must be integrated naturally into the design
- Professional Amazon KDP quality

${customPrompt ? `ADDITIONAL CUSTOMIZATION: ${customPrompt}` : ''}

VARIATION ${variation}: Make this unique while maintaining the core design principles.

This must look like a REAL publishable book cover that would sell on Amazon.`;

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

    console.log('Front cover generated successfully');
    
    return new Response(
      JSON.stringify({ imageUrl }),
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
