import { requireUser } from "../_shared/authGuard.ts";
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
  const __guard = await requireUser(req);
  if (__guard instanceof Response) return __guard;

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

    // Photo style prompts optimisés pour qualité HD
    const stylePrompts: Record<string, string> = {
      'realistic': 'ultra high resolution professional travel photography, National Geographic cover quality, stunning colors, perfect exposure',
      'cinematic': 'cinematic 4K travel photography, ultra wide angle lens, epic dramatic lighting, Hollywood blockbuster quality',
      'golden': 'golden hour magic photography, warm honey-toned sunset, dreamy soft light, romantic travel atmosphere',
      'aerial': 'professional drone photography 4K, breathtaking aerial perspective, Condé Nast Traveler quality'
    };

    const stylePrompt = stylePrompts[photoStyle] || stylePrompts['realistic'];

    // Prompt optimisé pour photos ultra-réalistes style magazine premium
    const imagePrompt = `${stylePrompt}.

Award-winning travel photograph of "${destinationName}" in ${country || 'this destination'}.

PHOTOGRAPHIC EXCELLENCE:
- Shot with professional full-frame DSLR or medium format camera
- Perfect golden ratio composition, rule of thirds
- Razor-sharp focus on main subject with natural depth of field
- Rich, vibrant colors with perfect white balance
- Magazine cover worthy, Condé Nast Traveler or Lonely Planet quality

SUBJECT & SCENE:
- Iconic landmark or most photogenic view of ${destinationName}
- Authentic local atmosphere and cultural elements
- Perfect weather conditions, ideal lighting
- Human element for scale if appropriate (local people, travelers)

TECHNICAL QUALITY:
- 8K resolution clarity
- Professional color grading
- Natural dynamic range
- No lens flare or artifacts

ABSOLUTE RESTRICTIONS:
- NO text, NO watermarks, NO titles, NO letters, NO words anywhere
- NO logos, NO stamps, NO copyright marks
- NO AI artifacts, NO unnatural elements
- Pure authentic travel photography only`;

    console.log(`Generating HIGH QUALITY travel image for: ${destinationName}, ${country}`);

    let imageUrl: string | undefined;

    // Essayer OpenAI DALL-E 3 HD d'abord si disponible
    if (OPENAI_API_KEY) {
      console.log('Using OpenAI DALL-E 3 HD for premium travel image...');
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
          console.log('OpenAI DALL-E 3 HD travel image generated successfully');
        } else {
          const errText = await dalleResponse.text();
          console.error('OpenAI error:', dalleResponse.status, errText);
        }
      } catch (err) {
        console.error('OpenAI DALL-E failed:', err);
      }
    }

    // Fallback vers Lovable AI Gemini 3 Pro Image (qualité premium)
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