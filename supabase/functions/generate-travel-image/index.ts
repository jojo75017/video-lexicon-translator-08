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

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Clé API Lovable non configurée' }),
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
- High resolution, sharp details

CRITICAL - NO TEXT:
- Absolutely NO text, NO words, NO title, NO letters anywhere in the image
- Pure photography only
- No watermarks, no captions, no overlays

This should look like a photo from National Geographic or a luxury travel magazine.`;

    console.log(`Generating travel image for: ${destinationName}, ${country}`);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image',
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
          JSON.stringify({ error: 'Limite de requêtes atteinte. Réessayez dans quelques instants.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        console.error('Credits exhausted');
        return new Response(
          JSON.stringify({ error: 'Crédits épuisés. Ajoutez des crédits à votre workspace.' }),
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
      throw new Error('Aucune image générée');
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
