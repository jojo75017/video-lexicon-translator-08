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
    const { recipeName, country, cuisine, photoStyle } = await req.json();

    if (!recipeName) {
      return new Response(
        JSON.stringify({ error: 'Le nom de la recette est requis' }),
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

    // Styles de photographie culinaire premium
    const stylePrompts: Record<string, string> = {
      'overhead': 'stunning overhead flat lay food photography, birds eye view, perfectly styled ingredients',
      'closeup': 'macro food photography, extreme close-up details, steam rising, textures visible',
      'rustic': 'rustic farmhouse food styling, wooden surfaces, natural linen, artisanal aesthetic',
      'modern': 'minimalist modern food photography, clean white background, elegant plating',
      'ambient': 'ambient lifestyle food photography, natural window light, cozy kitchen setting'
    };

    const stylePrompt = stylePrompts[photoStyle] || stylePrompts['overhead'];

    // Prompt ultra-optimisé pour photos culinaires de qualité magazine
    const imagePrompt = `${stylePrompt}.

Award-winning food photograph of "${recipeName}"${country ? ` from ${country}` : ''}${cuisine ? `, ${cuisine} cuisine` : ''}.

FOOD PHOTOGRAPHY EXCELLENCE:
- Shot by a world-class food photographer for Bon Appétit or Food & Wine magazine
- Professional Canon/Sony full-frame camera with macro lens
- Perfect studio lighting with soft diffused natural light
- Impeccable food styling with fresh, glistening ingredients
- Steam, sauce drips, or garnish in motion for dynamic appeal

COMPOSITION & STYLING:
- Magazine cover worthy composition
- Beautiful ceramic plates, artisan bowls, or traditional serving ware
- Fresh herbs, spices, and ingredients as props
- Complementary napkins, cutlery, or textured background
- Negative space for potential text overlay (but NO text in image)

FOOD DETAILS:
- Perfect golden crust, caramelization, or char marks where appropriate
- Glistening sauces, drizzles of olive oil, or melted butter
- Fresh, vibrant vegetables and herbs
- Authentic presentation true to ${cuisine || 'the dish'}'s culinary tradition

TECHNICAL PERFECTION:
- 8K resolution clarity
- Shallow depth of field with creamy bokeh
- Professional color grading, warm appetizing tones
- No harsh shadows, perfect exposure

ABSOLUTE RESTRICTIONS:
- NO text, NO watermarks, NO titles, NO letters, NO words anywhere
- NO logos, NO stamps, NO recipe cards visible
- NO artificial-looking food, NO plastic props
- Pure authentic food photography only`;

    console.log(`Generating HIGH QUALITY recipe image for: ${recipeName}`);

    let imageUrl: string | undefined;

    // Priorité OpenAI DALL-E 3 HD pour qualité maximale
    if (OPENAI_API_KEY) {
      console.log('Using OpenAI DALL-E 3 HD for premium food photography...');
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
            quality: 'hd',  // HD quality pour résultats professionnels
            style: 'natural',  // Style naturel pour photoréalisme
            response_format: 'url',
          }),
        });

        if (dalleResponse.ok) {
          const dalleData = await dalleResponse.json();
          imageUrl = dalleData?.data?.[0]?.url;
          console.log('OpenAI DALL-E 3 HD food image generated successfully');
        } else {
          const errText = await dalleResponse.text();
          console.error('OpenAI error:', dalleResponse.status, errText);
        }
      } catch (err) {
        console.error('OpenAI DALL-E failed:', err);
      }
    }

    // Fallback Lovable AI avec Gemini 3 Pro Image (qualité premium)
    if (!imageUrl && LOVABLE_API_KEY) {
      console.log('Using Lovable AI Gemini 3 Pro Image for premium food photography...');
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

    console.log(`Recipe image generated successfully for ${recipeName}`);

    return new Response(
      JSON.stringify({ imageUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-recipe-image:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Erreur inconnue' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
