import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const poseDescriptions: Record<string, string> = {
  // Device poses
  'ipad-straight': 'a modern Apple iPad Pro (silver, thin bezels) held perfectly straight, facing the camera head-on, on a clean surface, the screen displays the image',
  'ipad-tilted-left': 'a modern Apple iPad Pro tilted 30 degrees to the left, showing a 3/4 perspective view from the right side, the screen displays the image clearly',
  'ipad-tilted-right': 'a modern Apple iPad Pro tilted 30 degrees to the right, showing a 3/4 perspective view from the left side, the screen displays the image clearly',
  'kindle-straight': 'an Amazon Kindle Paperwhite e-reader lying flat on a surface, front-facing view, the screen displays the image',
  'macbook-screen': 'a MacBook Pro laptop opened at 110 degrees on a minimalist desk, the screen displays the image in full',
  'iphone-stand': 'an Apple iPhone 15 Pro standing upright in a sleek phone stand, the screen displays the image',
  // Book poses
  'ebook-floating': 'a realistic 3D hardcover book floating in mid-air at a slight angle, with the image as the front cover, soft shadow below, dramatic lighting',
  'ebook-tilted-left': 'a realistic 3D hardcover book tilted 25 degrees to the left, showing the front cover and spine, the image is the front cover, perspective view from the right',
  'ebook-tilted-right': 'a realistic 3D hardcover book tilted 25 degrees to the right, showing the front cover and spine, the image is the front cover, perspective view from the left',
  'book-3d-standing': 'a realistic 3D hardcover book standing upright on a surface, front cover facing camera with visible spine and page edges on the right side, the image is the cover',
  'book-3d-floating': 'a realistic 3D hardcover book floating at a dynamic 45-degree angle with dramatic shadow and rim lighting below, the image is the front cover',
  'book-open-flat': 'a printed book lying flat on a marble surface, top-down bird\'s eye view, the image is displayed as the book cover',
  // Creative
  'multi-device': 'multiple devices arranged together - an iPad, iPhone, and MacBook - all displaying the same image on their screens, professional product photography arrangement',
  'book-stack': 'a stack of 3 identical hardcover books with the image as the cover, the top book slightly offset, on a clean surface with soft lighting',
};

const viewModeInstructions: Record<string, string> = {
  '3d': `Style: Ultra-realistic 3D render with volumetric lighting, realistic shadows, depth of field (f/2.8 bokeh), 
and subtle reflections. The scene should have cinematic studio lighting with a key light, fill light, and rim light.
Background: Professional studio setting with soft gradient backdrop.`,
  'transparent': `Style: Product photography on a completely pure white/transparent background (#FFFFFF). 
No other objects, no shadows on the background, only a very subtle contact shadow directly under the device.
The device/book should be perfectly isolated as if cut out for compositing.
Background: Pure white, transparent, isolated product shot.`,
  'hd': `Style: Ultra high resolution 8K commercial photography. Shot with a Phase One IQ4 150MP medium format camera, 
Schneider Kreuznach 80mm f/2.8 LS lens. Extreme sharpness, rich micro-contrast, professional color grading.
Every texture detail must be razor sharp - screen pixels, book paper texture, device metal finish.
Background: Premium studio setting with elegant gradient lighting and subtle reflections.`,
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, pose = 'ipad-straight', viewMode = '3d' } = await req.json();

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

    const poseDesc = poseDescriptions[pose] || poseDescriptions['ipad-straight'];
    const modeInstr = viewModeInstructions[viewMode] || viewModeInstructions['3d'];

    const prompt = `Create a photorealistic mockup: Place this book cover / ebook cover image onto ${poseDesc}.

The cover image MUST be clearly visible, perfectly displayed, and undistorted on the device screen or as the book cover.
Preserve all text, graphics, and colors from the original image exactly.

${modeInstr}

Technical requirements:
- Shot with Canon EOS R5, 85mm f/1.4 lens equivalent quality
- Perfect studio lighting setup
- The mockup must look completely photorealistic - indistinguishable from a real product photo
- High-end commercial quality, suitable for Amazon KDP listings and professional marketing`;

    console.log('Generating mockup:', { pose, viewMode });

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
