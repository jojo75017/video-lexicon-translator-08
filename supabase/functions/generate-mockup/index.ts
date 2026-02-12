import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const poseDescriptions: Record<string, string> = {
  'ipad-straight': 'a modern Apple iPad Pro (silver, thin bezels) held perfectly straight, facing the camera head-on, on a clean surface, the screen displays the book cover',
  'ipad-tilted-left': 'a modern Apple iPad Pro tilted 30 degrees to the left, showing a 3/4 perspective view from the right side, the screen displays the book cover clearly',
  'ipad-tilted-right': 'a modern Apple iPad Pro tilted 30 degrees to the right, showing a 3/4 perspective view from the left side, the screen displays the book cover clearly',
  'kindle-straight': 'an Amazon Kindle Paperwhite e-reader lying flat on a surface, front-facing view, the screen displays the book cover',
  'macbook-screen': 'a MacBook Pro laptop opened at 110 degrees on a minimalist desk, the screen displays the book cover in full',
  'iphone-stand': 'an Apple iPhone 15 Pro standing upright in a sleek phone stand, the screen displays the book cover',
  'ebook-floating': 'a realistic 3D hardcover book floating in mid-air at a slight angle, with the book cover as the front cover, soft shadow below, dramatic lighting',
  'ebook-tilted-left': 'a realistic 3D hardcover book tilted 25 degrees to the left, showing the front cover and spine, perspective view from the right',
  'ebook-tilted-right': 'a realistic 3D hardcover book tilted 25 degrees to the right, showing the front cover and spine, perspective view from the left',
  'book-3d-standing': 'a realistic 3D hardcover book standing upright on a surface, front cover facing camera with visible spine and page edges on the right side',
  'book-3d-floating': 'a realistic 3D hardcover book floating at a dynamic 45-degree angle with dramatic shadow and rim lighting below',
  'book-open-flat': 'a printed book lying flat on a marble surface, top-down bird\'s eye view, the book cover is displayed as the cover',
  'multi-device': 'multiple devices arranged together - an iPad, iPhone, and MacBook - all displaying the same book cover on their screens, professional product photography arrangement',
  'book-stack': 'a stack of 3 identical hardcover books with the book cover, the top book slightly offset, on a clean surface with soft lighting',
};

const viewModeInstructions: Record<string, string> = {
  '3d': `Style: Ultra-realistic 3D render with volumetric lighting, realistic shadows, depth of field (f/2.8 bokeh), 
and subtle reflections. Cinematic studio lighting with key light, fill light, and rim light.
Background: Professional studio setting with soft gradient backdrop.`,
  'transparent': `Style: Product photography on a completely pure white background. 
No other objects, no shadows on the background, only a very subtle contact shadow directly under the device.
The device/book should be perfectly isolated as if cut out for compositing.
Background: Pure white, isolated product shot.`,
  'hd': `Style: Ultra high resolution 8K commercial photography. Shot with Phase One IQ4 150MP medium format camera, 
Schneider Kreuznach 80mm f/2.8 LS lens. Extreme sharpness, rich micro-contrast, professional color grading.
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

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Clé API OpenAI non configurée' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const poseDesc = poseDescriptions[pose] || poseDescriptions['ipad-straight'];
    const modeInstr = viewModeInstructions[viewMode] || viewModeInstructions['3d'];

    const prompt = `Create a photorealistic mockup: Place this book cover onto ${poseDesc}.

The cover image MUST be clearly visible, perfectly displayed, and undistorted on the device screen or as the book cover.
Preserve all text, graphics, and colors from the original image exactly.

${modeInstr}

Technical requirements:
- Shot with Canon EOS R5, 85mm f/1.4 lens equivalent quality
- Perfect studio lighting setup
- The mockup must look completely photorealistic - indistinguishable from a real product photo
- High-end commercial quality, suitable for Amazon KDP listings and professional marketing`;

    console.log('Generating mockup with OpenAI dall-e-2 edit:', { pose, viewMode });

    // Convert base64 to blob for the edit endpoint
    const base64Data = imageBase64.split(',')[1] || imageBase64;
    const binaryStr = atob(base64Data);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: 'image/png' });

    const formData = new FormData();
    formData.append('image', blob, 'cover.png');
    formData.append('prompt', prompt);
    formData.append('model', 'dall-e-2');
    formData.append('n', '1');
    formData.append('size', '1024x1024');
    formData.append('response_format', 'b64_json');

    const response = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI error:', response.status, errorText);
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Limite de requêtes atteinte. Réessayez dans quelques instants.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error(`Erreur API OpenAI: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const b64 = data.data?.[0]?.b64_json;
    const url = data.data?.[0]?.url;

    if (!b64 && !url) {
      throw new Error('Aucune image générée');
    }

    const finalUrl = b64 ? `data:image/png;base64,${b64}` : url;

    console.log('Mockup generated successfully with OpenAI');

    return new Response(
      JSON.stringify({ mockupUrl: finalUrl }),
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
