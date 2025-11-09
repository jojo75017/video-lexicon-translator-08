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
    const { chapterTitle, chapterContent, ebookTitle, style = "professional illustration", characters = [] } = await req.json();
    
    if (!chapterTitle) {
      return new Response(
        JSON.stringify({ error: 'Titre du chapitre requis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Ajouter les descriptions de personnages au prompt pour la cohérence
    let charactersContext = '';
    if (characters && characters.length > 0) {
      charactersContext = '\n\nIMPORTANT - Personnages à représenter de manière cohérente:\n';
      characters.forEach((char: any) => {
        if (char.name && char.description) {
          charactersContext += `- ${char.name}: ${char.description}\n`;
        }
      });
      charactersContext += '\nCes personnages doivent TOUJOURS avoir exactement la même apparence physique dans toutes les images.';
    }

    // Créer un prompt optimisé pour l'image du chapitre
    const imagePrompt = `Create a ${style} for an ebook chapter titled "${chapterTitle}" from the book "${ebookTitle}".${charactersContext}
    ${chapterContent ? `Chapter context: ${chapterContent.substring(0, 200)}...` : ''}
    Style: High quality, professional, suitable for an ebook illustration. Clear composition, engaging visual.`;

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
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Limite de requêtes atteinte. Veuillez réessayer dans quelques instants.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Crédits épuisés. Veuillez ajouter des crédits à votre espace de travail Lovable.' }),
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
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});