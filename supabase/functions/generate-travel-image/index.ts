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
    const { destinationName, country, photoStyle } = await req.json();

    if (!destinationName) {
      return new Response(
        JSON.stringify({ error: 'Le nom de la destination est requis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Priorité : OpenAI > Lovable AI (pour éviter les problèmes de crédits)
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!OPENAI_API_KEY && !LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Aucune clé API configurée' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Photo style prompts
    const stylePrompts: Record<string, string> = {
      'realistic': 'professional travel photography, high resolution, National Geographic style, vibrant colors, stunning landscape',
      'cinematic': 'cinematic travel photography, wide angle, dramatic lighting, movie quality, epic landscape',
      'golden': 'golden hour photography, warm sunset lighting, magical atmosphere, dreamy travel photo',
      'aerial': 'aerial drone photography, stunning bird eye view, landscape perspective, travel magazine'
    };

    const stylePrompt = stylePrompts[photoStyle] || stylePrompts['realistic'];

    const imagePrompt = `${stylePrompt}.

Beautiful travel photograph of "${destinationName}" in ${country || 'this destination'}.

REQUIREMENTS:
- Stunning landscape showing the iconic view or landmark of ${destinationName}
- Professional travel magazine quality
- Vibrant, eye-catching colors
- Perfect composition and lighting

CRITICAL - NO TEXT:
- Absolutely NO text, NO words, NO title, NO letters anywhere in the image
- Pure photography only`;

    console.log(`Generating travel image for: ${destinationName}, ${country}`);

    let imageUrl: string | undefined;

    // Essayer OpenAI DALL-E d'abord si disponible
    if (OPENAI_API_KEY) {
      console.log('Using OpenAI DALL-E for travel image...');
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
          console.log('OpenAI DALL-E image generated successfully');
        } else {
          const errText = await dalleResponse.text();
          console.error('OpenAI error:', dalleResponse.status, errText);
        }
      } catch (err) {
        console.error('OpenAI DALL-E failed:', err);
      }
    }

    // Fallback vers Lovable AI si OpenAI a échoué
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
            JSON.stringify({ error: 'Limite de requêtes atteinte. Réessayez plus tard.' }),
            { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        if (response.status === 402) {
          return new Response(
            JSON.stringify({ error: 'Crédits épuisés. Configurez une clé OpenAI dans les Paramètres.' }),
            { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        throw new Error(`Erreur API: ${response.status}`);
      }

      const data = await response.json();
      imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    }

    if (!imageUrl) {
      throw new Error('Aucune image générée. Configurez une clé OpenAI dans les Paramètres.');
    }

    console.log(`Travel image generated successfully for ${destinationName}`);

    return new Response(
      JSON.stringify({ imageUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-travel-image:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Erreur inconnue' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});