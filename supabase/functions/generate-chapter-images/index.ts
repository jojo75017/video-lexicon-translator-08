import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mapping des ratios vers les tailles
const RATIO_SIZES: Record<string, { openai: string; lovable: string }> = {
  'square': { openai: '1024x1024', lovable: '1024x1024' },
  'landscape': { openai: '1792x1024', lovable: '1792x1024' },
  'portrait': { openai: '1024x1792', lovable: '1024x1792' },
  'wide': { openai: '1792x1024', lovable: '1536x768' },
};

// Mapping des qualités
const QUALITY_MAP: Record<string, { openai: string; description: string }> = {
  'standard': { openai: 'standard', description: 'bonne qualité' },
  'high': { openai: 'hd', description: 'haute qualité avec détails fins' },
  'ultra': { openai: 'hd', description: 'ultra haute définition, maximum de détails et netteté' },
};

// Mapping des palettes de couleurs
const COLOR_SCHEME_PROMPTS: Record<string, string> = {
  'auto': '',
  'vibrant': 'Utiliser une palette de couleurs vives, saturées et énergiques.',
  'muted': 'Utiliser des tons doux, pastel et subtils.',
  'monochrome': 'Utiliser des nuances monochromatiques d\'une seule couleur.',
  'warm': 'Utiliser des tons chauds: oranges, rouges, dorés, ambrés.',
  'cool': 'Utiliser des tons froids: bleus, verts, cyans, argentés.',
  'sepia': 'Appliquer un effet sépia vintage avec des tons bruns et beiges.',
};

// Styles optimisés pour le photoréalisme humain
const PHOTOREALISTIC_STYLES = [
  'photorealistic',
  'cinematic movie scene',
  'portrait photography',
  'documentary style',
  'hyperrealistic portrait',
  'realistic human',
  'photo portrait',
];

const getPhotorealisticEnhancement = (style: string): string => {
  if (PHOTOREALISTIC_STYLES.some(s => style.toLowerCase().includes(s.toLowerCase()))) {
    return `
INSTRUCTIONS CRITIQUES POUR RÉALISME HUMAIN:
- Générer des êtres humains PHOTORÉALISTES avec une qualité de photographie professionnelle
- Peau avec texture naturelle: pores, imperfections subtiles, rides d'expression
- Yeux réalistes avec reflets de lumière, iris détaillé, cils individuels
- Cheveux avec mèches individuelles, reflets naturels, volume réaliste
- Éclairage cinématographique: lumière principale, fill light, rim light
- Profondeur de champ photographique avec bokeh naturel
- Expression faciale authentique et émotionnelle
- Proportions anatomiques parfaites
- Qualité équivalente à une photo prise avec un Canon EOS R5 ou Sony A7R IV
- Résolution 8K, netteté maximale sur le sujet principal`;
  }
  return '';
};

// Upload une image (base64 ou URL) vers Supabase Storage et retourne l'URL publique
async function uploadImageToStorage(imageData: string, chapterTitle: string): Promise<string> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  let imageBytes: Uint8Array;
  let contentType = 'image/png';

  if (imageData.startsWith('data:image/')) {
    // Image base64
    const matches = imageData.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches) throw new Error('Invalid base64 image format');
    contentType = `image/${matches[1]}`;
    const base64Data = matches[2];
    const binaryString = atob(base64Data);
    imageBytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      imageBytes[i] = binaryString.charCodeAt(i);
    }
  } else if (imageData.startsWith('http')) {
    // URL externe - télécharger l'image
    const response = await fetch(imageData);
    if (!response.ok) throw new Error('Failed to download image from URL');
    const blob = await response.blob();
    imageBytes = new Uint8Array(await blob.arrayBuffer());
    contentType = blob.type || 'image/png';
  } else {
    throw new Error('Unsupported image format');
  }

  // Générer un nom de fichier unique
  const timestamp = Date.now();
  const safeTitle = chapterTitle.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
  const extension = contentType.split('/')[1] || 'png';
  const fileName = `chapter-images/${timestamp}-${safeTitle}.${extension}`;

  console.log(`Uploading image to storage: ${fileName}`);

  const { data, error } = await supabase.storage
    .from('ebook-images')
    .upload(fileName, imageBytes, {
      contentType,
      upsert: true,
    });

  if (error) {
    console.error('Storage upload error:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  // Obtenir l'URL publique
  const { data: publicData } = supabase.storage
    .from('ebook-images')
    .getPublicUrl(fileName);

  const publicUrl = publicData?.publicUrl;
  if (!publicUrl) throw new Error('Failed to get public URL');

  console.log(`Image uploaded successfully: ${publicUrl}`);
  return publicUrl;
}

async function generateWithOpenAI(
  chapterTitle: string, 
  chapterContent: string, 
  ebookTitle: string, 
  style: string, 
  characters: any[], 
  apiKey: string,
  ratio: string = 'square',
  quality: string = 'high',
  colorScheme: string = 'auto',
  visualCoherence: boolean = false,
  coherenceIntensity: string = 'medium',
  referenceImageUrl: string | null = null
): Promise<string> {
  let charactersContext = '';
  if (characters && characters.length > 0) {
    charactersContext = '\n\nIMPORTANT - Personnages principaux de l\'histoire (à représenter de manière STRICTEMENT cohérente):\n';
    characters.forEach((char: any) => {
      if (char.name && char.description) {
        charactersContext += `\n🎭 ${char.name}:\n`;
        charactersContext += `   Description: ${char.description}\n`;
        if (char.referenceImageUrl) {
          charactersContext += `   [IMAGE DE RÉFÉRENCE FOURNIE - REPRODUIRE EXACTEMENT cette apparence]\n`;
        }
        charactersContext += `   ⚠️ Cette apparence DOIT être identique dans TOUTES les images\n`;
      }
    });
    charactersContext += '\n⚠️ RÈGLE ABSOLUE: Les mêmes personnages doivent avoir EXACTEMENT la même apparence physique, les mêmes vêtements, la même coiffure dans chaque image de l\'ebook. Continuité visuelle OBLIGATOIRE.';
  }

  const colorPrompt = COLOR_SCHEME_PROMPTS[colorScheme] || '';
  const qualityDesc = QUALITY_MAP[quality]?.description || QUALITY_MAP['high'].description;
  const size = RATIO_SIZES[ratio]?.openai || '1024x1024';
  const photorealisticEnhancement = getPhotorealisticEnhancement(style);
  
  // Instructions de cohérence selon l'intensité
  const coherenceInstructions: Record<string, string> = {
    light: 'Maintenir une ambiance visuelle similaire, style reconnaissable, variations créatives permises.',
    medium: 'Style artistique IDENTIQUE, même palette de couleurs dominante, même niveau de détail.',
    strict: 'Style artistique IDENTIQUE pixel par pixel, palette EXACTEMENT la même, AUCUNE variation permise.'
  };
  
  const coherencePrompt = visualCoherence ? `
COHÉRENCE VISUELLE (${coherenceIntensity.toUpperCase()}):
${coherenceInstructions[coherenceIntensity] || coherenceInstructions.medium}` : '';
  
  const referencePrompt = referenceImageUrl ? `
RÉFÉRENCE VISUELLE:
- Reproduire EXACTEMENT le même style que l'image de référence
- Utiliser la même palette de couleurs et technique de rendu` : '';

  const imagePrompt = `Contexte de l'ebook: "${ebookTitle}"
Chapitre à illustrer: "${chapterTitle}"
${chapterContent ? `Résumé du chapitre: ${chapterContent.substring(0, 300)}...` : ''}
${charactersContext}

Style artistique demandé: ${style}
Qualité: ${qualityDesc}
${colorPrompt ? `Palette de couleurs: ${colorPrompt}` : ''}
${photorealisticEnhancement}
${coherencePrompt}
${referencePrompt}

Instructions de génération:
- Créer une illustration de haute qualité adaptée à un ebook professionnel
- Composition claire et visuellement engageante
- Si des personnages sont mentionnés ci-dessus, les représenter avec EXACTEMENT les mêmes caractéristiques physiques que décrites
- COHÉRENCE VISUELLE ABSOLUE pour tous les personnages récurrents
- L'illustration doit refléter le thème et l'atmosphère du titre de l'ebook "${ebookTitle}"`;

  console.log('Generating image with OpenAI:', imagePrompt);

  const generateViaImagesAPI = async (model: string): Promise<{ ok: boolean; status: number; data?: any; errorText?: string }> => {
    const payload: any = {
      model,
      prompt: imagePrompt,
      n: 1,
      size,
    };

    // gpt-image-1 ne supporte PAS response_format, mais dall-e-3 le supporte
    if (model === 'dall-e-3') {
      payload.response_format = 'b64_json';
      payload.quality = QUALITY_MAP[quality]?.openai || 'hd';
    } else if (model === 'gpt-image-1') {
      payload.quality = quality === 'standard' ? 'medium' : 'high';
      // gpt-image-1 retourne directement une URL, pas de response_format
    }

    const resp = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      return { ok: false, status: resp.status, errorText };
    }

    const data = await resp.json();
    return { ok: true, status: resp.status, data };
  };

  // Try gpt-image-1 first, then automatically fall back to dall-e-3 on errors
  let result = await generateViaImagesAPI('gpt-image-1');

  if (!result.ok) {
    console.error('OpenAI error (gpt-image-1):', result.status, result.errorText);

    // Fallback to dall-e-3 for permission issues or parameter errors
    if (result.status === 403 || result.status === 400 || /must be verified|permission|unknown_parameter/i.test(result.errorText || '')) {
      console.log('Falling back to OpenAI dall-e-3 image generation...');
      result = await generateViaImagesAPI('dall-e-3');
    }
  }

  if (!result.ok) {
    console.error('OpenAI error (final):', result.status, result.errorText);
    throw new Error(`OpenAI API error: ${result.status}`);
  }

  const data = result.data;
  
  // Gérer les deux formats possibles (base64 et URL)
  let imageUrl: string | null = null;
  if (data.data?.[0]?.b64_json) {
    imageUrl = `data:image/jpeg;base64,${data.data[0].b64_json}`;
  } else if (data.data?.[0]?.url) {
    imageUrl = data.data[0].url;
  }

  if (!imageUrl) {
    console.error('No image in OpenAI response:', JSON.stringify(data));
    throw new Error('No image URL in OpenAI response');
  }

  console.log('Image generated successfully with OpenAI');
  return imageUrl;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      chapterTitle, 
      chapterContent, 
      ebookTitle, 
      style = "professional illustration", 
      ratio = "square",
      quality = "high",
      colorScheme = "auto",
      visualCoherence = false,
      coherenceIntensity = "medium",
      referenceImageUrl = null,
      seed = null,
      characters = [], 
      useOpenAI = false, 
      openaiApiKey, 
      disableOpenAIFallback = false, 
      forceLovable = false,
      uploadToStorage = true
    } = await req.json();
    
    if (!chapterTitle) {
      return new Response(
        JSON.stringify({ error: 'Titre du chapitre requis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let generatedImageUrl: string;
    // Générer un seed pour cohérence visuelle
    const generatedSeed = seed || (visualCoherence ? Math.floor(Math.random() * 2147483647) : null);
    
    // Instructions de cohérence selon l'intensité
    const coherenceInstructions: Record<string, string> = {
      light: `
COHÉRENCE LÉGÈRE:
- Maintenir une ambiance visuelle similaire aux autres chapitres
- Le style artistique doit rester reconnaissable
- Des variations créatives sont permises pour chaque scène`,
      medium: `
COHÉRENCE MOYENNE:
- Maintenir EXACTEMENT le même style artistique
- Utiliser la MÊME palette de couleurs dominante
- Garder le même niveau de détail et rendu
- Les personnages doivent être immédiatement reconnaissables`,
      strict: `
COHÉRENCE STRICTE ABSOLUE:
- Style artistique IDENTIQUE pixel par pixel
- Palette de couleurs EXACTEMENT la même
- Même technique de rendu, même éclairage
- AUCUNE variation stylistique permise
- Les personnages sont des clones visuels parfaits entre les images`
    };

    // Si useOpenAI est true et non forcé à Lovable, utiliser EXCLUSIVEMENT OpenAI
    if (useOpenAI && openaiApiKey && !forceLovable) {
      try {
        generatedImageUrl = await generateWithOpenAI(
          chapterTitle,
          chapterContent,
          ebookTitle,
          style,
          characters,
          openaiApiKey,
          ratio,
          quality,
          colorScheme,
          visualCoherence,
          coherenceIntensity,
          referenceImageUrl
        );
      } catch (err) {
        console.error('OpenAI image generation failed:', err);
        return new Response(
          JSON.stringify({
            error: "Erreur OpenAI lors de la génération de l'image",
            details: err instanceof Error ? err.message : String(err),
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else {
      // Utiliser Lovable AI
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
            charactersContext += `\n🎭 ${char.name}:\n`;
            charactersContext += `   Description: ${char.description}\n`;
            if (char.referenceImageUrl) {
              charactersContext += `   [IMAGE DE RÉFÉRENCE FOURNIE - REPRODUIRE EXACTEMENT cette apparence]\n`;
            }
            charactersContext += `   ⚠️ Cette apparence DOIT être identique dans TOUTES les images\n`;
          }
        });
        charactersContext += '\n⚠️ RÈGLE ABSOLUE: Les mêmes personnages doivent avoir EXACTEMENT la même apparence physique, les mêmes vêtements, la même coiffure dans chaque image de l\'ebook. Continuité visuelle OBLIGATOIRE.';
      }

      // Créer un prompt optimisé pour l'image du chapitre
      const colorPrompt = COLOR_SCHEME_PROMPTS[colorScheme] || '';
      const qualityDesc = QUALITY_MAP[quality]?.description || QUALITY_MAP['high'].description;
      const photorealisticEnhancement = getPhotorealisticEnhancement(style);
      const coherencePrompt = visualCoherence ? coherenceInstructions[coherenceIntensity] || coherenceInstructions.medium : '';
      
      // Instruction pour image de référence si fournie
      const referencePrompt = referenceImageUrl ? `
RÉFÉRENCE VISUELLE OBLIGATOIRE:
- Une image de référence est fournie comme modèle
- Reproduire EXACTEMENT le même style artistique
- Utiliser la même palette de couleurs
- Maintenir le même niveau de détail et technique de rendu
- Cette image définit le standard visuel pour tout l'ebook` : '';

      const imagePrompt = `Contexte de l'ebook: "${ebookTitle}"
Chapitre à illustrer: "${chapterTitle}"
${chapterContent ? `Résumé du chapitre: ${chapterContent.substring(0, 300)}...` : ''}
${charactersContext}

Style artistique demandé: ${style}
Qualité: ${qualityDesc}
${colorPrompt ? `Palette de couleurs: ${colorPrompt}` : ''}
${photorealisticEnhancement}
${coherencePrompt}
${referencePrompt}

Instructions de génération:
- Créer une illustration de haute qualité adaptée à un ebook professionnel
- Composition claire et visuellement engageante
- Si des personnages sont mentionnés ci-dessus, les représenter avec EXACTEMENT les mêmes caractéristiques physiques que décrites
- COHÉRENCE VISUELLE ABSOLUE pour tous les personnages récurrents
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
        // Si erreur 429 ou 402 (crédits Lovable), ne PAS fallback vers OpenAI si déjà en limite
        if (response.status === 429 || response.status === 402) {
          console.log('Lovable AI credits/rate limit reached, returning placeholder');
          // Retourner une image placeholder au lieu d'une erreur
          generatedImageUrl = `https://placehold.co/1024x1024/374151/ffffff?text=${encodeURIComponent(chapterTitle.substring(0, 30))}`;
        } else if (!disableOpenAIFallback) {
          const ENV_OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
          const FALLBACK_OPENAI_KEY = ENV_OPENAI_API_KEY || openaiApiKey;
          if (FALLBACK_OPENAI_KEY) {
            console.log('Lovable AI error, attempting automatic fallback to OpenAI...');
            try {
              generatedImageUrl = await generateWithOpenAI(chapterTitle, chapterContent, ebookTitle, style, characters, FALLBACK_OPENAI_KEY, ratio, quality, colorScheme, visualCoherence, coherenceIntensity, referenceImageUrl);
            } catch (openaiErr: any) {
              // Si OpenAI aussi en limite, retourner placeholder plutôt qu'erreur
              if (openaiErr?.message?.includes('billing') || openaiErr?.message?.includes('limit')) {
                console.log('OpenAI billing limit, returning placeholder');
                generatedImageUrl = `https://placehold.co/1024x1024/374151/ffffff?text=${encodeURIComponent(chapterTitle.substring(0, 30))}`;
              } else {
                console.error('OpenAI fallback failed:', openaiErr);
                throw openaiErr;
              }
            }
          } else {
            // Pas de clé fallback, retourner placeholder
            generatedImageUrl = `https://placehold.co/1024x1024/374151/ffffff?text=${encodeURIComponent(chapterTitle.substring(0, 30))}`;
          }
        } else {
          const errorText = await response.text();
          console.error('AI Gateway error:', response.status, errorText);
          // Retourner placeholder au lieu d'erreur
          generatedImageUrl = `https://placehold.co/1024x1024/374151/ffffff?text=${encodeURIComponent(chapterTitle.substring(0, 30))}`;
        }
      } else {
        // Réponse OK - extraire l'image base64 de la réponse Gemini
        const data = await response.json();
        console.log('Lovable AI response received successfully');
        
        // Le modèle gemini-2.5-flash-image-preview renvoie les images en base64
        const imageData = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
        
        if (imageData) {
          generatedImageUrl = imageData;
          console.log('Image extracted from Lovable AI response (base64 length:', imageData.length, ')');
        } else {
          // Fallback: vérifier d'autres formats de réponse possibles
          const content = data.choices?.[0]?.message?.content;
          if (typeof content === 'string' && content.startsWith('data:image')) {
            generatedImageUrl = content;
          } else {
            console.error('No image in Lovable AI response:', JSON.stringify(data).substring(0, 500));
            throw new Error('No image URL in response');
          }
        }
      }
    }

    // Upload vers Supabase Storage si activé (mais pas les placeholders)
    let finalImageUrl = generatedImageUrl;
    const isPlaceholder = generatedImageUrl.includes('placehold.co');
    
    if (uploadToStorage && !isPlaceholder) {
      try {
        finalImageUrl = await uploadImageToStorage(generatedImageUrl, chapterTitle);
        console.log('Image uploaded to storage:', finalImageUrl);
      } catch (uploadErr) {
        console.error('Failed to upload to storage, returning original URL:', uploadErr);
        // En cas d'erreur d'upload, on retourne quand même l'image générée
      }
    } else if (isPlaceholder) {
      console.log('Placeholder image detected, skipping storage upload');
    }

    console.log('Image generated successfully');
    return new Response(
      JSON.stringify({ 
        imageUrl: finalImageUrl,
        chapterTitle,
        seed: typeof generatedSeed !== 'undefined' ? generatedSeed : null,
        storedInCloud: uploadToStorage && finalImageUrl !== generatedImageUrl
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-chapter-images:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Erreur inconnue lors de la génération de l\'image',
        details: 'Vérifiez vos crédits Lovable AI ou votre clé OpenAI'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
