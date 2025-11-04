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
    const { ebookTitle, authorName, genre, style, variation } = await req.json();

    console.log('Received request:', { ebookTitle, authorName, genre, style, variation });

    if (!ebookTitle) {
      return new Response(
        JSON.stringify({ error: 'Titre de l\'ebook requis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Configuration manquante - Clé OpenAI requise' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const styleText = style || 'moderne et professionnel';
    const genreText = genre || 'non-fiction';
    const variationNum = variation || 1;
    
    // Variations de style pour chaque version
    const styleVariations = [
      'minimaliste avec typographie élégante',
      'dynamique avec illustrations colorées',
      'professionnel avec design épuré'
    ];
    
    const currentStyle = styleVariations[(variationNum - 1) % 3];
    
    const imagePrompt = `Create a professional book cover in ${currentStyle} style for a ${genreText} ebook titled "${ebookTitle}" by ${authorName || 'Author'}. 

Requirements:
- Professional and eye-catching design suitable for Amazon KDP
- Title "${ebookTitle}" clearly visible and elegant in the center
- Author name "${authorName}" subtly placed at the bottom
- Modern and sales-oriented design
- Harmonious and professional color palette
- Optimized for Amazon thumbnail (portrait 6:9 ratio)
- Style: ${currentStyle}
- Variation: ${variationNum}
- FULL BLEED: The design must extend to all edges with NO WHITE BORDERS or margins
- The entire canvas should be filled with the design

Portrait format, high quality, ${genreText} style.
CRITICAL: Text must be READABLE and CLEAR. NO white borders or empty margins around the cover.`;

    console.log('Generating cover image with OpenAI for variation', variationNum);

    const aiResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
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

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Limite de taux dépassée. Veuillez réessayer plus tard.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Crédits insuffisants. Veuillez ajouter des crédits à votre workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la génération de l\'image' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await aiResponse.json();
    console.log('OpenAI response received:', data);
    
    // OpenAI returns base64 for gpt-image-1
    const imageB64 = data.data?.[0]?.b64_json;

    if (!imageB64) {
      console.error('No image in response:', JSON.stringify(data));
      return new Response(
        JSON.stringify({ error: 'Aucune image générée' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const imageUrl = `data:image/png;base64,${imageB64}`;
    console.log('Cover image generated successfully');

    return new Response(
      JSON.stringify({ imageUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-cover-image:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Erreur interne' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
