import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sheetTitle, sheetContent, visualStyle, imagePrompt } = await req.json();

    if (!sheetTitle) {
      return new Response(
        JSON.stringify({ error: 'Le titre de la fiche est requis' }),
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

    // Build the image generation prompt
    const baseStyle = visualStyle || 'Soft watercolor illustration style. Hand-drawn look, colored pencil texture. Minimalist, calm, cozy atmosphere. Pastel colors: soft blue, cream, beige, sage green. Gentle, reassuring, non-realistic style. White background with lots of negative space. Wellness illustration for adults. No strong contrast, no sharp lines. Warm, peaceful, safe mood.';
    
    const prompt = imagePrompt || `${baseStyle} Illustration for a wellness worksheet titled "${sheetTitle}". The scene should evoke calm, safety, and gentle self-care. No text in the image.`;

    console.log(`Generating image for sheet: ${sheetTitle}`);

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
            content: prompt
          }
        ],
        modalities: ['image', 'text']
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Image generation error:', errorText);
      throw new Error('Erreur lors de la génération de l\'image');
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      throw new Error('Aucune image générée');
    }

    // Upload to Supabase Storage
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Convert base64 to blob
    const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    const fileName = `practical-sheets/${Date.now()}-${sheetTitle.replace(/[^a-zA-Z0-9]/g, '-').substring(0, 30)}.png`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('ebook-images')
      .upload(fileName, imageBuffer, {
        contentType: 'image/png',
        upsert: true
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      // Return the base64 URL as fallback
      return new Response(
        JSON.stringify({ imageUrl }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('ebook-images')
      .getPublicUrl(fileName);

    console.log(`Image uploaded successfully: ${publicUrlData.publicUrl}`);

    return new Response(
      JSON.stringify({ imageUrl: publicUrlData.publicUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-sheet-image:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Erreur inconnue' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
