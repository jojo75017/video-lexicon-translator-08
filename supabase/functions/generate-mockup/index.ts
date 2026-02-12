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
    const { imageBase64, deviceType = 'ipad', background = 'transparent' } = await req.json();

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: 'Image requise' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Clé API non configurée' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const deviceDescriptions: Record<string, string> = {
      'ipad': 'a modern Apple iPad Pro (silver, thin bezels) held at a slight 3/4 angle on a clean surface',
      'ipad-hand': 'a person holding a modern Apple iPad Pro in their hands, lifestyle photography style',
      'kindle': 'an Amazon Kindle Paperwhite e-reader lying flat on a wooden desk',
      'macbook': 'a MacBook Pro laptop screen showing the image, on a minimalist desk',
      'iphone': 'an Apple iPhone 15 Pro standing upright in a phone stand, showing the image on screen',
      'book-3d': 'a realistic 3D hardcover book with the image as the front cover, floating at an angle with dramatic lighting',
      'book-flat': 'a printed book lying flat on a marble surface, top-down view, the image as the cover',
      'tablet-stand': 'a tablet on a modern stand on a clean white desk, professional product photography',
    };

    const backgroundDescriptions: Record<string, string> = {
      'transparent': 'on a completely transparent/white background with no other objects, product photography isolated',
      'desk': 'on a clean minimalist wooden desk with soft natural lighting',
      'lifestyle': 'in a cozy lifestyle setting with a coffee cup and plant nearby, warm lighting',
      'studio': 'on a professional studio background with gradient lighting',
      'dark': 'on a dark moody background with dramatic rim lighting',
    };

    const deviceDesc = deviceDescriptions[deviceType] || deviceDescriptions['ipad'];
    const bgDesc = backgroundDescriptions[background] || backgroundDescriptions['transparent'];

    const prompt = `Place this book cover / ebook cover image onto ${deviceDesc}. 
The cover image should be clearly visible and perfectly displayed on the device screen or as the book cover.
Setting: ${bgDesc}.
Style: Ultra-realistic professional product photography, shot with a Canon EOS R5, 85mm f/1.4 lens, 
perfect studio lighting, sharp details, high-end commercial quality.
The mockup must look completely photorealistic - indistinguishable from a real product photo.
Keep the original image content perfectly visible and undistorted on the device.`;

    console.log('Generating mockup:', { deviceType, background });

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-pro-image-preview',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              {
                type: 'image_url',
                image_url: { url: imageBase64 }
              }
            ]
          }
        ],
        modalities: ['image', 'text']
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Limite de requêtes atteinte. Réessayez dans quelques instants.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Crédits épuisés. Ajoutez des crédits à votre espace Lovable.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      throw new Error(`Erreur API: ${response.status}`);
    }

    const data = await response.json();
    const mockupUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!mockupUrl) {
      throw new Error('Aucune image générée');
    }

    console.log('Mockup generated successfully');

    return new Response(
      JSON.stringify({ mockupUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-mockup:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Erreur interne' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
