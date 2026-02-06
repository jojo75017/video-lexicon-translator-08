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
  cookbook: 'culinary appetizing style, food photography aesthetic, warm kitchen tones, delicious presentation',
  garden: 'lush garden style, green nature, plants, flowers, natural organic aesthetic, earthy tones'
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
  'health': 'health wellness book, fitness, wellbeing, lifestyle',
  'gardening': 'gardening book, plants, nature, botanical illustrations, green and earthy colors',
  'garden-bio': 'organic gardening, eco-friendly, natural methods, green and brown tones, sustainable',
  'permaculture': 'permaculture book, sustainable living, ecological design, nature harmony, green ecosystem',
  'potager': 'vegetable garden book, fresh produce, kitchen garden, colorful vegetables, organic farming',
  'bricolage': 'DIY book, home improvement, tools, woodworking, crafts, hands-on projects, workshop atmosphere'
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
      backCoverText = '',
      // Nouvelles options de personnalisation
      authorNamePosition = 'bottom',
      authorNameStyle = 'elegant',
      colorScheme = 'auto',
      titlePosition = 'center',
      showAuthorOnCover = true
    } = await req.json();

    console.log('Generating cover:', { ebookTitle, authorName, genre, style, coverType, bookFormat, pageCount, colorScheme, authorNamePosition });

    if (!ebookTitle) {
      return new Response(
        JSON.stringify({ error: "Titre de l'ebook requis" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Priorité : OpenAI > Lovable AI
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!OPENAI_API_KEY && !LOVABLE_API_KEY) {
      console.error('No API key configured (neither OPENAI nor LOVABLE)');
      return new Response(
        JSON.stringify({ error: 'Aucune clé API configurée (OpenAI ou Lovable)' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const useOpenAI = !!OPENAI_API_KEY;

    const styleDesc = stylePrompts[style] || stylePrompts.professional;
    const genreDesc = genrePrompts[genre] || genrePrompts['non-fiction'];

    // Descriptions pour les nouvelles options
    const colorSchemeDesc: Record<string, string> = {
      'auto': 'couleurs adaptées au genre du livre',
      'dark': 'fond sombre (noir, gris foncé, bleu nuit), texte clair et contrasté',
      'light': 'fond clair (blanc, crème, beige), texte foncé élégant',
      'warm': 'tons chauds (rouge, orange, doré, ambre), ambiance chaleureuse',
      'cold': 'tons froids (bleu, violet, cyan, argent), ambiance mystérieuse',
      'nature': 'tons naturels (vert forêt, brun, beige, terre), organique',
      'monochrome': 'noir et blanc élégant avec nuances de gris',
      'pastel': 'couleurs pastel douces et apaisantes',
      'vibrant': 'couleurs vives et saturées, impactantes'
    };

    const authorPositionDesc: Record<string, string> = {
      'bottom': 'en bas de la couverture, centré horizontalement',
      'top': 'en haut de la couverture, sous ou au-dessus du titre',
      'below-title': 'directement sous le titre principal',
      'signature': 'en style signature manuscrite élégante, positionné de manière artistique'
    };

    const authorStyleDesc: Record<string, string> = {
      'elegant': 'typographie élégante et raffinée, lettres espacées',
      'bold': 'typographie grasse et impactante, très visible',
      'script': 'typographie script manuscrite, artistique',
      'minimal': 'typographie minimaliste, fine et discrète',
      'serif': 'typographie serif classique, traditionnelle'
    };

    const titlePositionDesc: Record<string, string> = {
      'top': 'le titre en haut de la couverture',
      'center': 'le titre centré verticalement',
      'bottom': 'le titre dans la partie inférieure',
      'overlay': 'le titre superposé sur l\'illustration de manière intégrée'
    };

    let imagePrompt = '';

    if (coverType === 'full') {
      // Full cover (front + spine + back)
      imagePrompt = `Create a PREMIUM, AWARD-WINNING COMPLETE BOOK COVER for Amazon KDP print. This MUST include FRONT COVER + SPINE + BACK COVER in a single horizontal image.

CRITICAL TEXT RENDERING:
- TITLE "${ebookTitle}" must be CRISP, PERFECTLY LEGIBLE on the front - positioned ${titlePositionDesc[titlePosition] || titlePositionDesc['center']}
${showAuthorOnCover ? `- AUTHOR "${authorName}" ${authorPositionDesc[authorNamePosition] || authorPositionDesc['bottom']} with ${authorStyleDesc[authorNameStyle] || authorStyleDesc['elegant']} font` : '- NO author name on front'}
- Author name on spine (vertical)
- All text: SHARP, HIGH CONTRAST, professional typography

COLOR & ATMOSPHERE: ${colorSchemeDesc[colorScheme] || colorSchemeDesc['auto']}

LAYOUT (LEFT→RIGHT): BACK COVER | SPINE | FRONT COVER

FRONT COVER (RIGHT - Hero):
1. TITLE "${ebookTitle}" - dominant, cinematic typography
${showAuthorOnCover ? `2. "${authorName}" - ${authorStyleDesc[authorNameStyle] || 'elegant'}` : ''}
${subtitle ? `3. "${subtitle}" below title` : ''}
4. Breathtaking visual: ${genreDesc}, ${styleDesc}

SPINE (CENTER STRIP):
- "${ebookTitle}" vertical + "${authorName}" at bottom

BACK COVER (LEFT):
${backCoverText ? `- Synopsis: "${backCoverText.substring(0, 200)}"` : '- Clean synopsis area'}
- Author bio section with "${authorName}"
- Circular author photo placeholder

VISUAL QUALITY (CRITICAL):
- Photorealistic, magazine-quality rendering
- Rich cinematic lighting, deep shadows, atmosphere
- Seamless design flowing across all three sections
- Full bleed, NO white borders
- NO barcodes, NO ISBN, NO QR codes, NO fictitious faces

${customPrompt ? `CREATIVE DIRECTION: ${customPrompt}` : ''}

This must rival covers from top publishers like Penguin Random House.`;

    } else {
      // Front cover only
      imagePrompt = `Create an AWARD-WINNING, BESTSELLER-QUALITY front book cover for Amazon KDP.

BOOK INFORMATION:
- Title: "${ebookTitle}"
- Author: "${authorName}"
${subtitle ? `- Subtitle: "${subtitle}"` : ''}
- Genre: ${genreDesc}
- Visual Style: ${styleDesc}

MANDATORY DESIGN RULES:
1. The TITLE "${ebookTitle}" MUST be rendered in LARGE, CRISP, PERFECTLY LEGIBLE typography - positioned ${titlePositionDesc[titlePosition] || 'centered'}
${showAuthorOnCover ? `2. AUTHOR NAME "${authorName}" - ${authorPositionDesc[authorNamePosition] || 'at the bottom'}, ${authorStyleDesc[authorNameStyle] || 'elegant'} typography` : '2. NO author name'}
${subtitle ? `3. SUBTITLE "${subtitle}" - elegantly placed below title` : ''}

VISUAL QUALITY STANDARDS (CRITICAL):
- Photorealistic rendering quality, equivalent to professional studio photography
- Rich, deep colors with perfect contrast - COLOR SCHEME: ${colorSchemeDesc[colorScheme] || colorSchemeDesc['auto']}
- Dramatic cinematic lighting with depth and atmosphere
- Sharp details, no blur, no artifacts, no noise
- Professional typography with perfect kerning and weight
- Visual composition following the rule of thirds
- Depth of field creating a layered, immersive scene

TECHNICAL SPECS:
- Portrait 2:3 ratio (1024x1536 pixels)
- Full bleed - ABSOLUTELY NO white borders or margins
- Print-ready at 300 DPI quality
- Colors within CMYK gamut for print accuracy

PROHIBITIONS:
- NO watermarks, NO stock photo logos
- NO blurry or low-resolution elements
- NO generic clip-art style imagery
- NO visible AI artifacts or distortions

${customPrompt ? `CREATIVE DIRECTION: ${customPrompt}` : ''}

VARIATION ${variation}/3: Create a UNIQUE interpretation while maintaining top-tier quality.

This cover must look INDISTINGUISHABLE from covers designed by top professional book designers like Chip Kidd or Peter Mendelsund.`;
    }

    let imageUrl: string | undefined;

    if (useOpenAI) {
      // ========== OpenAI gpt-image-1 (best quality) with dall-e-3 fallback ==========
      const generateViaImagesAPI = async (model: string): Promise<{ ok: boolean; status: number; data?: any; errorText?: string }> => {
        const payload: any = {
          model,
          prompt: model === 'dall-e-3' ? imagePrompt.slice(0, 4000) : imagePrompt,
          n: 1,
          size: coverType === 'full' ? '1536x1024' : '1024x1536',
        };

        if (model === 'dall-e-3') {
          payload.response_format = 'b64_json';
          payload.quality = 'hd';
        } else if (model === 'gpt-image-1') {
          payload.quality = 'high';
          payload.output_format = 'png';
          payload.background = 'opaque';
        }

        console.log(`Calling OpenAI ${model} for cover generation...`);
        const resp = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!resp.ok) {
          const errorText = await resp.text();
          return { ok: false, status: resp.status, errorText };
        }

        const data = await resp.json();
        return { ok: true, status: resp.status, data };
      };

      // Try gpt-image-1 first (superior quality, native text rendering)
      let result = await generateViaImagesAPI('gpt-image-1');

      if (!result.ok) {
        console.error('OpenAI gpt-image-1 error:', result.status, result.errorText);
        if (result.status === 403 || result.status === 400 || /must be verified|permission|unknown_parameter/i.test(result.errorText || '')) {
          console.log('Falling back to dall-e-3...');
          result = await generateViaImagesAPI('dall-e-3');
        }
      }

      if (!result.ok) {
        throw new Error(`OpenAI image error: ${result.status}`);
      }

      // Handle both base64 and URL responses
      if (result.data?.data?.[0]?.b64_json) {
        imageUrl = `data:image/png;base64,${result.data.data[0].b64_json}`;
      } else if (result.data?.data?.[0]?.url) {
        imageUrl = result.data.data[0].url;
      }
    } else {
      // ========== Lovable AI (Gemini image) ==========
      console.log('Calling Lovable AI for image generation...');
      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-3-pro-image-preview',
          messages: [{ role: 'user', content: imagePrompt }],
          modalities: ['image', 'text'],
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
      imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    }

    if (!imageUrl) {
      console.error('No image returned');
      throw new Error('Aucune image générée dans la réponse');
    }

    console.log('Cover generated successfully, type:', coverType, 'provider:', useOpenAI ? 'OpenAI' : 'Lovable');

    return new Response(
      JSON.stringify({ imageUrl, coverType, dimensions: dimensions || null }),
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
