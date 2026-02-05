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
    const { fishName, scientificName, origin } = await req.json();

    if (!fishName) {
      return new Response(
        JSON.stringify({ error: 'Le nom du poisson est requis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!OPENAI_API_KEY && !LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Aucune clé API configurée' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prompt optimisé pour des photos ultra-réalistes style National Geographic
    const imagePrompt = `Ultra-realistic underwater photograph of a ${fishName} (${scientificName || 'tropical fish'}) in its natural aquarium habitat.

PHOTOGRAPHIC STYLE:
- Award-winning underwater wildlife photography
- National Geographic quality, professional DSLR shot
- Crystal clear water with natural light rays penetrating the surface
- Macro lens detail showing every scale, fin ray, and color gradient
- Natural bokeh background with blurred aquatic plants

SUBJECT REQUIREMENTS:
- Single ${fishName} as the main subject, perfectly in focus
- Fish displaying natural swimming posture, fins fully extended
- Authentic species coloration at peak health
- Catchlight visible in the eye for lifelike appearance

ENVIRONMENT:
- Planted aquarium with lush green aquatic vegetation
- Natural substrate (fine sand or smooth river pebbles)
- Soft dappled lighting mimicking sunlight through water
${origin ? `- Biotope inspiration: ${origin}` : ''}

ABSOLUTE RESTRICTIONS:
- NO text, watermarks, labels, or any written elements
- NO artificial-looking renders or cartoon styles
- NO composite images or collages
- Pure photographic realism only`;

    console.log(`Generating HIGH QUALITY aquarium image for: ${fishName}`);

    let imageUrl: string | undefined;

    // Priorité OpenAI DALL-E 3 HD pour qualité maximale
    if (OPENAI_API_KEY) {
      console.log('Using OpenAI DALL-E 3 HD for premium aquarium image...');
      try {
        const dalleResponse = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'dall-e-3',
            prompt: imagePrompt.slice(0, 4000),
            n: 1,
            size: '1024x1024',
            quality: 'hd',  // HD quality for professional results
            style: 'natural',  // Natural style for photorealism
            response_format: 'url',
          }),
        });

        if (dalleResponse.ok) {
          const dalleData = await dalleResponse.json();
          imageUrl = dalleData?.data?.[0]?.url;
          console.log('OpenAI DALL-E 3 HD aquarium image generated successfully');
        } else {
          const errText = await dalleResponse.text();
          console.error('OpenAI error:', dalleResponse.status, errText);
        }
      } catch (err) {
        console.error('OpenAI DALL-E failed:', err);
      }
    }

    // Fallback Lovable AI avec Gemini 3 Pro Image (meilleure qualité)
    if (!imageUrl && LOVABLE_API_KEY) {
      console.log('Using Lovable AI Gemini 3 Pro Image for premium quality...');
      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-3-pro-image-preview',  // Modèle premium pour meilleure qualité
          messages: [{ role: 'user', content: imagePrompt }],
          modalities: ['image', 'text']
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          return new Response(
            JSON.stringify({ error: 'Limite de requêtes atteinte' }),
            { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        if (response.status === 402) {
          return new Response(
            JSON.stringify({ error: 'Crédits épuisés' }),
            { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        throw new Error(`Erreur API: ${response.status}`);
      }

      const data = await response.json();
      imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    }

    if (!imageUrl) {
      throw new Error('Aucune image générée');
    }

    console.log(`Aquarium image generated successfully for ${fishName}`);

    return new Response(
      JSON.stringify({ imageUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-aquarium-image:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Erreur inconnue' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
