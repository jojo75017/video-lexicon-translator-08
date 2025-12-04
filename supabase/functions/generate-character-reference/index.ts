import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function generateWithOpenAI(characterName: string, characterDescription: string, apiKey: string) {
  const imagePrompt = `Portrait de personnage pour livre/ebook:

Personnage: "${characterName}"
Description détaillée: ${characterDescription}

Instructions CRITIQUES:
- Portrait en buste ou portrait complet du personnage
- Style: illustration professionnelle de haute qualité pour livre
- Fond neutre ou légèrement stylisé
- Expression faciale neutre mais engageante
- Éclairage doux et flatteur
- Le personnage doit être mémorable et reconnaissable
- Tous les détails de la description doivent être respectés EXACTEMENT
- Ce portrait servira de RÉFÉRENCE pour maintenir la cohérence dans toutes les futures illustrations`;

  console.log('Generating character reference with OpenAI:', characterName);

  const generateViaImagesAPI = async (model: string) => {
    const payload: any = {
      model,
      prompt: imagePrompt,
      n: 1,
      size: '1024x1024',
      response_format: 'b64_json',
    };

    if (model === 'gpt-image-1') {
      payload.quality = 'high';
    } else if (model === 'dall-e-3') {
      payload.quality = 'hd';
    }

    return await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  };

  // Try gpt-image-1 first, then fall back to dall-e-3
  let response = await generateViaImagesAPI('gpt-image-1');

  if (!response.ok) {
    const status = response.status;
    const errorText = await response.text();
    console.error('OpenAI error (gpt-image-1):', status, errorText);

    if (status === 403 || /must be verified|permission/i.test(errorText)) {
      console.log('Falling back to dall-e-3...');
      response = await generateViaImagesAPI('dall-e-3');
    }
  }

  if (!response.ok) {
    const finalError = await response.text();
    console.error('OpenAI final error:', finalError);
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  
  let imageUrl: string | null = null;
  if (data.data?.[0]?.b64_json) {
    imageUrl = `data:image/png;base64,${data.data[0].b64_json}`;
  } else if (data.data?.[0]?.url) {
    imageUrl = data.data[0].url;
  }

  if (!imageUrl) {
    throw new Error('No image URL in OpenAI response');
  }

  console.log('Character reference generated successfully with OpenAI');
  return imageUrl;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { characterName, characterDescription, useOpenAI = false, openaiApiKey } = await req.json();
    
    if (!characterName || !characterDescription) {
      return new Response(
        JSON.stringify({ error: 'Nom et description du personnage requis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use OpenAI if API key provided
    if (useOpenAI && openaiApiKey) {
      try {
        const imageUrl = await generateWithOpenAI(characterName, characterDescription, openaiApiKey);
        return new Response(
          JSON.stringify({ imageUrl, characterName }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (err) {
        console.error('OpenAI generation failed:', err);
        // Fall through to Lovable AI
      }
    }

    // Use Lovable AI
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const imagePrompt = `Portrait de personnage pour livre/ebook:

Personnage: "${characterName}"
Description détaillée: ${characterDescription}

Instructions CRITIQUES:
- Portrait en buste ou portrait complet du personnage
- Style: illustration professionnelle de haute qualité pour livre
- Fond neutre ou légèrement stylisé
- Expression faciale neutre mais engageante
- Éclairage doux et flatteur
- Le personnage doit être mémorable et reconnaissable
- Tous les détails de la description doivent être respectés EXACTEMENT
- Ce portrait servira de RÉFÉRENCE pour maintenir la cohérence dans toutes les futures illustrations`;

    console.log('Generating character reference with Lovable AI:', characterName);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
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
        return new Response(
          JSON.stringify({ error: 'Limite de requêtes atteinte. Réessayez dans quelques instants.', code: 'RATE_LIMITED' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Crédits Lovable AI épuisés. Ajoutez des crédits ou utilisez une clé OpenAI.', code: 'PAYMENT_REQUIRED' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      throw new Error('Erreur lors de la génération');
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      throw new Error('No image URL in response');
    }

    console.log('Character reference generated successfully with Lovable AI');
    return new Response(
      JSON.stringify({ imageUrl, characterName }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-character-reference:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        details: 'Vérifiez vos crédits Lovable AI ou votre clé OpenAI'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
