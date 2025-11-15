import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function generateWithOpenAI(chapterTitle: string, chapterContent: string, ebookTitle: string, style: string, characters: any[], apiKey: string) {
  let charactersContext = '';
  if (characters && characters.length > 0) {
    charactersContext = '\n\nIMPORTANT - Personnages principaux de l\'histoire (à représenter de manière STRICTEMENT cohérente):\n';
    characters.forEach((char: any) => {
      if (char.name && char.description) {
        charactersContext += `- ${char.name}: ${char.description} [Cette apparence DOIT être identique dans TOUTES les images]\n`;
      }
    });
    charactersContext += '\n⚠️ RÈGLE ABSOLUE: Les mêmes personnages doivent avoir EXACTEMENT la même apparence physique, les mêmes vêtements, la même coiffure dans chaque image de l\'ebook. Continuité visuelle OBLIGATOIRE.';
  }

  const imagePrompt = `Contexte de l'ebook: "${ebookTitle}"
Chapitre à illustrer: "${chapterTitle}"
${chapterContent ? `Résumé du chapitre: ${chapterContent.substring(0, 300)}...` : ''}
${charactersContext}

Style artistique demandé: ${style}

Instructions de génération:
- Créer une illustration de haute qualité adaptée à un ebook professionnel
- Composition claire et visuellement engageante
- Si des personnages sont mentionnés ci-dessus, les représenter avec EXACTEMENT les mêmes caractéristiques physiques que décrites
- Cohérence visuelle absolue pour tous les personnages récurrents
- L'illustration doit refléter le thème et l'atmosphère du titre de l'ebook "${ebookTitle}"`;

  console.log('Generating image with OpenAI:', imagePrompt);

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-image-1',
      prompt: imagePrompt,
      n: 1,
      size: '1024x1024',
      quality: 'high',
      output_format: 'png'
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('OpenAI error:', response.status, errorText);
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const imageUrl = data.data?.[0]?.b64_json ? `data:image/png;base64,${data.data[0].b64_json}` : null;

  if (!imageUrl) {
    throw new Error('No image URL in OpenAI response');
  }

  console.log('Image generated successfully with OpenAI');
  return new Response(
    JSON.stringify({ 
      imageUrl,
      chapterTitle 
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { chapterTitle, chapterContent, ebookTitle, style = "professional illustration", characters = [], useOpenAI = false, openaiApiKey } = await req.json();
    
    if (!chapterTitle) {
      return new Response(
        JSON.stringify({ error: 'Titre du chapitre requis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Si useOpenAI est true, tenter OpenAI d'abord, sinon fallback vers Lovable AI
    if (useOpenAI && openaiApiKey) {
      try {
        return await generateWithOpenAI(chapterTitle, chapterContent, ebookTitle, style, characters, openaiApiKey);
      } catch (err) {
        console.error('OpenAI image generation failed, falling back to Lovable AI:', err);
        // Poursuite vers génération Lovable AI ci-dessous
      }
    }
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Ajouter les descriptions de personnages au prompt pour la cohérence
    let charactersContext = '';
    if (characters && characters.length > 0) {
      charactersContext = '\n\nIMPORTANT - Personnages principaux de l\'histoire (à représenter de manière STRICTEMENT cohérente):\n';
      characters.forEach((char: any) => {
        if (char.name && char.description) {
          charactersContext += `- ${char.name}: ${char.description} [Cette apparence DOIT être identique dans TOUTES les images]\n`;
        }
      });
      charactersContext += '\n⚠️ RÈGLE ABSOLUE: Les mêmes personnages doivent avoir EXACTEMENT la même apparence physique, les mêmes vêtements, la même coiffure dans chaque image de l\'ebook. Continuité visuelle OBLIGATOIRE.';
    }

    // Créer un prompt optimisé pour l'image du chapitre
    const imagePrompt = `Contexte de l'ebook: "${ebookTitle}"
Chapitre à illustrer: "${chapterTitle}"
${chapterContent ? `Résumé du chapitre: ${chapterContent.substring(0, 300)}...` : ''}
${charactersContext}

Style artistique demandé: ${style}

Instructions de génération:
- Créer une illustration de haute qualité adaptée à un ebook professionnel
- Composition claire et visuellement engageante
- Si des personnages sont mentionnés ci-dessus, les représenter avec EXACTEMENT les mêmes caractéristiques physiques que décrites
- Cohérence visuelle absolue pour tous les personnages récurrents
- L'illustration doit refléter le thème et l'atmosphère du titre de l'ebook "${ebookTitle}"`;

    console.log('Generating image with prompt:', imagePrompt);

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
      // Si erreur 429 ou 402, tenter automatiquement le fallback vers OpenAI
      if (response.status === 429 || response.status === 402) {
        const ENV_OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
        const FALLBACK_OPENAI_KEY = ENV_OPENAI_API_KEY || openaiApiKey;
        if (FALLBACK_OPENAI_KEY) {
          console.log('Lovable AI error, attempting automatic fallback to OpenAI using', ENV_OPENAI_API_KEY ? 'env' : 'client', 'key...');
          try {
            return await generateWithOpenAI(chapterTitle, chapterContent, ebookTitle, style, characters, FALLBACK_OPENAI_KEY);
          } catch (openaiErr) {
            console.error('OpenAI fallback failed:', openaiErr);
            // Continuer vers l'erreur d'origine si le fallback échoue
          }
        }
        
        // Si pas de clé OpenAI ou fallback échoué, retourner l'erreur appropriée
        if (response.status === 429) {
          return new Response(
            JSON.stringify({ error: 'Limite de requêtes atteinte. Veuillez réessayer dans quelques instants ou configurer une clé OpenAI.' }),
            { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        return new Response(
          JSON.stringify({ error: 'Crédits épuisés. Veuillez ajouter des crédits ou configurer une clé OpenAI.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la génération de l\'image' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      throw new Error('No image URL in response');
    }

    console.log('Image generated successfully');
    return new Response(
      JSON.stringify({ 
        imageUrl,
        chapterTitle 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-chapter-images:', error);
    
    // Log détaillé pour déboguer
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown',
      stack: error instanceof Error ? error.stack : undefined,
      chapterTitle,
      ebookTitle
    });
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Erreur inconnue lors de la génération de l\'image',
        details: 'Vérifiez vos crédits Lovable AI ou votre clé OpenAI'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});