import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function generateWithOpenAI(
  ebookTitle: string, 
  authorName: string, 
  genre: string, 
  style: string, 
  variation: number, 
  apiKey: string,
  options: {
    includeAuthorName?: boolean;
    authorNamePosition?: string;
    includeBookSummary?: boolean;
    colorScheme?: string;
  } = {}
) {
  const styleText = style || 'moderne et professionnel';
  const genreText = genre || 'non-fiction';
  const variationNum = variation || 1;
  
  const { 
    includeAuthorName = true, 
    authorNamePosition = 'bottom',
    includeBookSummary = true,
    colorScheme = 'auto'
  } = options;
  
  const styleVariations = [
    'minimaliste avec fond clair et sections délimitées',
    'élégant avec texture subtile et typographie classique',
    'moderne avec couleurs douces et design épuré'
  ];
  
  const colorSchemeDesc: Record<string, string> = {
    'auto': 'couleurs adaptées au genre du livre',
    'dark': 'fond sombre (noir, gris foncé), texte clair',
    'light': 'fond clair (blanc, crème), texte foncé',
    'warm': 'tons chauds (rouge, orange, doré)',
    'cold': 'tons froids (bleu, violet, cyan)',
    'nature': 'tons naturels (vert, brun, beige)',
    'monochrome': 'noir et blanc élégant'
  };
  
  const authorPositionDesc: Record<string, string> = {
    'bottom': 'en bas de la 4ème de couverture',
    'top': 'en haut de la 4ème de couverture',
    'center': 'centré verticalement',
    'signature': 'en style signature manuscrite élégante'
  };
  
  const currentStyle = styleVariations[(variationNum - 1) % 3];
  
  const imagePrompt = `Create a professional BACK COVER (4ème de couverture) layout for Amazon KDP book.

CRITICAL LAYOUT - TWO SECTION DESIGN:

SECTION 1 (TOP 65%):
- Header: Small elegant text "À propos de ce livre" or decorative element
${includeBookSummary ? '- Main area for book description/summary with visible placeholder lines' : '- Clean minimal area without text placeholders'}
- Background style: ${colorSchemeDesc[colorScheme] || colorSchemeDesc['auto']}
- Clear text zone with subtle borders or frame

SECTION 2 (BOTTOM 35%):
- Header: "À propos de l'auteur"
${includeAuthorName ? `- AUTHOR NAME "${authorName}" displayed prominently ${authorPositionDesc[authorNamePosition] || authorPositionDesc['bottom']}
- Author name must be in elegant, large typography that is clearly readable
- Include decorative elements around the author name` : '- Area for author biography text only'}
- Slightly different background shade to distinguish from top section
- Small circular placeholder for author photo (left side)

GENERAL DESIGN:
- Title reference: "${ebookTitle}"
- Author: ${authorName || 'Author'}
- Style: ${currentStyle}
- Genre: ${genreText}
- Color scheme: ${colorSchemeDesc[colorScheme] || colorSchemeDesc['auto']}
- Variation ${variationNum}/3 (make unique)

TECHNICAL REQUIREMENTS:
- Portrait format 2:3 ratio (1024x1536)
- Full bleed - NO WHITE BORDERS
- Professional Amazon KDP back cover style
- Clean, readable layout
- ISBN barcode placeholder (bottom right corner)
- Subtle design elements but keep it clean for text readability
- Each section clearly separated with line or color variation
${includeAuthorName ? `- The author name "${authorName}" MUST be visible and prominent in the design` : ''}

This should look like a REAL book back cover with professional typography.`;

  console.log('Generating back cover with OpenAI for variation', variationNum, 'options:', options);

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-image-1',
      prompt: imagePrompt,
      n: 1,
      size: '1024x1536',
      quality: 'high',
      output_format: 'png',
      background: 'opaque'
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('OpenAI error:', response.status, errorText);
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const imageB64 = data.data?.[0]?.b64_json;

  if (!imageB64) {
    throw new Error('No image in OpenAI response');
  }

  const imageUrl = `data:image/png;base64,${imageB64}`;
  console.log('Back cover generated successfully with OpenAI');
  
  return new Response(
    JSON.stringify({ imageUrl }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function generateWithLovableAI(
  ebookTitle: string, 
  authorName: string, 
  genre: string, 
  style: string, 
  variation: number, 
  lovableApiKey: string,
  options: {
    includeAuthorName?: boolean;
    authorNamePosition?: string;
    includeBookSummary?: boolean;
    colorScheme?: string;
  } = {}
) {
  const genreText = genre || 'non-fiction';
  const variationNum = variation || 1;
  
  const { 
    includeAuthorName = true, 
    authorNamePosition = 'bottom',
    includeBookSummary = true,
    colorScheme = 'auto'
  } = options;
  
  const styleVariations = [
    'minimaliste avec fond clair et sections délimitées',
    'élégant avec texture subtile et typographie classique',
    'moderne avec couleurs douces et design épuré'
  ];
  
  const colorSchemeDesc: Record<string, string> = {
    'auto': 'couleurs adaptées au genre du livre',
    'dark': 'fond sombre (noir, gris foncé), texte clair',
    'light': 'fond clair (blanc, crème), texte foncé',
    'warm': 'tons chauds (rouge, orange, doré)',
    'cold': 'tons froids (bleu, violet, cyan)',
    'nature': 'tons naturels (vert, brun, beige)',
    'monochrome': 'noir et blanc élégant'
  };
  
  const authorPositionDesc: Record<string, string> = {
    'bottom': 'en bas de la 4ème de couverture',
    'top': 'en haut de la 4ème de couverture',
    'center': 'centré verticalement',
    'signature': 'en style signature manuscrite élégante'
  };
  
  const currentStyle = styleVariations[(variationNum - 1) % 3];
  
  const imagePrompt = `Create a professional BACK COVER (4ème de couverture) layout for Amazon KDP book.

CRITICAL LAYOUT - TWO SECTION DESIGN:

SECTION 1 (TOP 65%):
- Header: Small elegant text "À propos de ce livre" or decorative element
${includeBookSummary ? '- Main area for book description/summary with visible placeholder lines' : '- Clean minimal area without text placeholders'}
- Background style: ${colorSchemeDesc[colorScheme] || colorSchemeDesc['auto']}
- Clear text zone with subtle borders or frame

SECTION 2 (BOTTOM 35%):
- Header: "À propos de l'auteur"
${includeAuthorName ? `- AUTHOR NAME "${authorName}" displayed prominently ${authorPositionDesc[authorNamePosition] || authorPositionDesc['bottom']}
- Author name must be in elegant, large typography that is clearly readable
- Include decorative elements around the author name` : '- Area for author biography text only'}
- Slightly different background shade to distinguish from top section
- Small circular placeholder for author photo (left side)

GENERAL DESIGN:
- Title reference: "${ebookTitle}"
- Author: ${authorName || 'Author'}
- Style: ${currentStyle}
- Genre: ${genreText}
- Color scheme: ${colorSchemeDesc[colorScheme] || colorSchemeDesc['auto']}
- Variation ${variationNum}/3 (make unique)

TECHNICAL REQUIREMENTS:
- Portrait format 2:3 ratio (1024x1536)
- Full bleed - NO WHITE BORDERS
- Professional Amazon KDP back cover style
- Clean, readable layout
- ISBN barcode placeholder (bottom right corner)
- Subtle design elements but keep it clean for text readability
- Each section clearly separated with line or color variation
${includeAuthorName ? `- The author name "${authorName}" MUST be visible and prominent in the design` : ''}

This should look like a REAL book back cover with professional typography.`;

  console.log('Generating back cover with Lovable AI for variation', variationNum, 'options:', options);

  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${lovableApiKey}`,
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
        JSON.stringify({ error: 'Crédits épuisés. Veuillez ajouter des crédits à votre espace de travail Lovable.' }),
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
    throw new Error('No image in Lovable AI response');
  }

  console.log('Back cover generated successfully with Lovable AI');
  
  return new Response(
    JSON.stringify({ imageUrl }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      ebookTitle, 
      authorName, 
      genre = 'non-fiction', 
      style = 'moderne', 
      variation = 1, 
      useOpenAI = false, 
      openaiApiKey,
      // Nouvelles options
      includeAuthorName = true,
      authorNamePosition = 'bottom',
      includeBookSummary = true,
      colorScheme = 'auto'
    } = await req.json();

    const options = { includeAuthorName, authorNamePosition, includeBookSummary, colorScheme };
    
    console.log('Received request:', { ebookTitle, authorName, genre, style, variation, useOpenAI, options });

    if (!ebookTitle) {
      return new Response(
        JSON.stringify({ error: 'Titre de l\'ebook requis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Si useOpenAI est true, tenter OpenAI, sinon Lovable AI (fallback automatique)
    if (useOpenAI && openaiApiKey) {
      try {
        return await generateWithOpenAI(ebookTitle, authorName, genre, style, variation, openaiApiKey, options);
      } catch (err) {
        console.error('OpenAI generation failed, falling back to Lovable AI:', err);
        // Continue vers Lovable AI ci-dessous
      }
    }

    // Utiliser Lovable AI par défaut (ou en fallback)
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Configuration manquante - Clé Lovable AI requise' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return await generateWithLovableAI(ebookTitle, authorName, genre, style, variation, LOVABLE_API_KEY, options);
  } catch (error) {
    console.error('Error in generate-cover-image:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Erreur interne' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
