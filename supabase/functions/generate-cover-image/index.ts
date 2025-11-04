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

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Configuration manquante' }),
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
    
    const imagePrompt = `Créez une couverture de livre ${currentStyle} pour un ebook ${genreText} intitulé "${ebookTitle}" par ${authorName || 'Auteur'}. 
    
La couverture doit :
- Être professionnelle et attrayante pour Amazon KDP
- Inclure le titre "${ebookTitle}" de manière lisible et élégante au centre
- Inclure l'auteur "${authorName}" de façon discrète en bas
- Avoir un design moderne et vendeur
- Utiliser des couleurs harmonieuses et professionnelles
- Être optimisée pour une miniature Amazon (format portrait 6:9)
- Style : ${currentStyle}
- Version : ${variationNum}

Format : Portrait vertical (1600x2400 pixels), haute qualité, style ${genreText}.
IMPORTANT : Le texte doit être LISIBLE et CLAIR sur la couverture.`;

    console.log('Generating cover image with prompt for variation', variationNum);

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
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
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      console.error('No image URL in response:', JSON.stringify(data));
      return new Response(
        JSON.stringify({ error: 'Aucune image générée' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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
