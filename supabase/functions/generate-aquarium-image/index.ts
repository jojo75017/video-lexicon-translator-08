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

    const imagePrompt = `Professional aquarium photography of a ${fishName} (${scientificName || 'tropical fish'}).

REQUIREMENTS:
- Beautiful specimen of ${fishName} in pristine aquarium conditions
- Crystal clear water, professional aquarium lighting
- Natural planted aquarium background with live plants
- Fish swimming gracefully, showing full body and fins
- Vibrant natural colors, sharp focus on the fish
- Magazine quality aquarium photography
- National Geographic style wildlife photography

CRITICAL - NO TEXT:
- Absolutely NO text, NO words, NO labels anywhere in the image
- Pure aquarium photography only

${origin ? `Natural habitat inspiration: ${origin}` : ''}`;

    console.log(`Generating aquarium image for: ${fishName}`);

    let imageUrl: string | undefined;

    // Priorité OpenAI DALL-E
    if (OPENAI_API_KEY) {
      console.log('Using OpenAI DALL-E for aquarium image...');
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
            quality: 'standard',
            response_format: 'url',
          }),
        });

        if (dalleResponse.ok) {
          const dalleData = await dalleResponse.json();
          imageUrl = dalleData?.data?.[0]?.url;
          console.log('OpenAI DALL-E aquarium image generated successfully');
        } else {
          const errText = await dalleResponse.text();
          console.error('OpenAI error:', dalleResponse.status, errText);
        }
      } catch (err) {
        console.error('OpenAI DALL-E failed:', err);
      }
    }

    // Fallback Lovable AI
    if (!imageUrl && LOVABLE_API_KEY) {
      console.log('Falling back to Lovable AI...');
      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash-image',
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
