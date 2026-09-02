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

// Prompt spécialisé pour les livres de coloriage - TRÈS STRICT
const getColoringBookPrompt = (subject: string, ageGroup: string = '3-6'): string => {
  const thicknessGuide = {
    '0-3': 'lignes très épaisses (minimum 4-5 pixels), formes ultra-simples, maximum 5-8 éléments',
    '3-6': 'lignes épaisses (3-4 pixels), formes simples et arrondies, 8-15 éléments maximum',
    '6-10': 'lignes moyennes (2-3 pixels), détails modérés, motifs clairs',
    '10+': 'lignes fines à moyennes, détails plus nombreux mais zones bien définies',
  };
  
  const thickness = thicknessGuide[ageGroup as keyof typeof thicknessGuide] || thicknessGuide['3-6'];
  
  return `COLORING BOOK PAGE - CRITICAL REQUIREMENTS:

SUBJECT: ${subject}

MANDATORY STYLE RULES:
- BLACK AND WHITE LINE DRAWING ONLY
- ABSOLUTELY NO colors, NO shading, NO gradients, NO gray tones
- Pure white background (#FFFFFF)
- Clean, bold black outlines (#000000) only
- ${thickness}
- Simple, closed shapes that children can color inside
- Every area must be clearly defined and easy to fill with color
- Cute, friendly, child-safe appearance
- NO realistic shadows or 3D effects
- NO texture or hatching
- NO watermarks or text
- Professional coloring book quality like Melissa & Doug or Crayola coloring books

TECHNICAL REQUIREMENTS:
- High contrast black lines on pure white
- Anti-aliased smooth lines
- Large coloring areas, not tiny details
- Clear separation between all elements
- Style: clean vector-like line art illustration`;
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

// Détecte le fournisseur réel d'une clé API d'après son préfixe.
// Évite d'envoyer une clé Gemini (AIza…) chez OpenAI (erreur 401 systématique).
type KeyProvider = 'gemini' | 'openai' | 'openrouter' | 'unknown';
function detectKeyProvider(key?: string | null): KeyProvider {
  const k = (key || '').trim();
  if (!k) return 'unknown';
  if (k.startsWith('sk-or-')) return 'openrouter';
  if (k.startsWith('sk-')) return 'openai';
  if (k.startsWith('AIza')) return 'gemini';
  // Clés Google AI Studio / Cloud récentes : pas de préfixe AIza, mais jamais sk-
  if (/^[A-Za-z0-9_\-]{30,}$/.test(k)) return 'gemini';
  return 'unknown';
}

// Génération d'image via OpenRouter (BYOK abonné) — modèles Gemini image.
async function tryOpenRouterImage(prompt: string, apiKey?: string): Promise<string | null> {
  if (!apiKey || !apiKey.startsWith('sk-or-')) return null;
  const models = ['google/gemini-2.5-flash-image-preview', 'google/gemini-2.0-flash-exp:free'];
  for (const model of models) {
    try {
      const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://ebookstudio.fr',
          'X-Title': 'EbookStudio',
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          modalities: ['image', 'text'],
        }),
      });
      if (!r.ok) {
        const t = await r.text();
        console.error(`OpenRouter (${model}) ${r.status}:`, t.substring(0, 300));
        continue;
      }
      const data = await r.json();
      const url = data?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
      if (typeof url === 'string' && url.startsWith('data:image')) return url;
      const content = data?.choices?.[0]?.message?.content;
      if (typeof content === 'string' && content.startsWith('data:image')) return content;
      console.error(`OpenRouter (${model}) : aucune image dans la réponse`);
    } catch (e) {
      console.error(`OpenRouter (${model}) error:`, e);
    }
  }
  return null;
}

// Direct call to Google Gemini image generation API using user's BYOK key
async function tryGeminiDirect(prompt: string, apiKey?: string): Promise<string | null> {
  if (!apiKey || detectKeyProvider(apiKey) !== 'gemini') return null;

  const models = ['gemini-2.5-flash-image', 'gemini-2.5-flash-image-preview'];
  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseModalities: ['IMAGE'] },
        }),
      });
      if (!r.ok) {
        const t = await r.text();
        console.error(`Gemini direct (${model}) ${r.status}:`, t.substring(0, 300));
        continue;
      }
      const data = await r.json();
      const parts = data?.candidates?.[0]?.content?.parts || [];
      for (const p of parts) {
        const inline = p.inline_data || p.inlineData;
        if (inline?.data) {
          const mime = inline.mime_type || inline.mimeType || 'image/png';
          return `data:${mime};base64,${inline.data}`;
        }
      }
      console.error(`Gemini direct (${model}) no image in response`);
    } catch (e) {
      console.error(`Gemini direct (${model}) error:`, e);
    }
  }
  return null;
}

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
  referenceImageUrl: string | null = null,
  isColoringBook: boolean = false,
  coloringBookAgeGroup: string = '3-6',
  customPrompt: string | null = null
): Promise<string> {
  const size = RATIO_SIZES[ratio]?.openai || '1024x1024';
  
  // MODE LIVRE DE COLORIAGE - Utiliser le prompt spécialisé
  if (isColoringBook) {
    const imagePrompt = getColoringBookPrompt(chapterTitle, coloringBookAgeGroup);
    console.log('🎨 COLORING BOOK MODE (OpenAI) - Using specialized prompt');
    console.log('Generating image with OpenAI:', imagePrompt);

    const generateViaImagesAPI = async (model: string): Promise<{ ok: boolean; status: number; data?: any; errorText?: string }> => {
      const payload: any = {
        model,
        prompt: imagePrompt,
        n: 1,
        size,
      };

      if (model === 'dall-e-3') {
        payload.response_format = 'b64_json';
        payload.quality = 'hd'; // Haute qualité pour des lignes nettes
      } else if (model === 'gpt-image-1') {
        payload.quality = 'high';
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

    let result = await generateViaImagesAPI('gpt-image-1');

    if (!result.ok) {
      console.error('OpenAI error (gpt-image-1):', result.status, result.errorText);
      if (result.status === 403 || result.status === 400 || /must be verified|permission|unknown_parameter/i.test(result.errorText || '')) {
        console.log('Falling back to OpenAI dall-e-3 for coloring book...');
        result = await generateViaImagesAPI('dall-e-3');
      }
    }

    if (!result.ok) {
      console.error('OpenAI error (final):', result.status, result.errorText);
      throw new Error(`OpenAI API error: ${result.status}`);
    }

    const data = result.data;
    let imageUrl: string | null = null;
    if (data.data?.[0]?.b64_json) {
      imageUrl = `data:image/png;base64,${data.data[0].b64_json}`;
    } else if (data.data?.[0]?.url) {
      imageUrl = data.data[0].url;
    }

    if (!imageUrl) {
      throw new Error('No image URL in OpenAI response');
    }

    console.log('Coloring book image generated successfully with OpenAI');
    return imageUrl;
  }

  // MODE STANDARD - Prompt classique pour ebooks illustrés
  
  // Si un customPrompt est fourni (ex: BD avec scènes détaillées), l'utiliser directement
  if (customPrompt) {
    console.log('Using custom prompt for OpenAI image generation');
    const imagePrompt = customPrompt;
    console.log('Generating image with OpenAI (custom prompt):', imagePrompt.substring(0, 500) + '...');

    const generateViaImagesAPI = async (model: string): Promise<{ ok: boolean; status: number; data?: any; errorText?: string }> => {
      const payload: any = {
        model,
        prompt: imagePrompt,
        n: 1,
        size,
      };

      if (model === 'dall-e-3') {
        payload.response_format = 'b64_json';
        payload.quality = QUALITY_MAP[quality]?.openai || 'hd';
      } else if (model === 'gpt-image-1') {
        payload.quality = quality === 'standard' ? 'medium' : 'high';
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

    let result = await generateViaImagesAPI('gpt-image-1');

    if (!result.ok) {
      console.error('OpenAI error (gpt-image-1):', result.status, result.errorText);
      if (result.status === 403 || result.status === 400 || /must be verified|permission|unknown_parameter/i.test(result.errorText || '')) {
        console.log('Falling back to OpenAI dall-e-3 for custom prompt...');
        result = await generateViaImagesAPI('dall-e-3');
      }
    }

    if (!result.ok) {
      console.error('OpenAI error (final):', result.status, result.errorText);
      throw new Error(`OpenAI API error: ${result.status}`);
    }

    const data = result.data;
    let imageUrl: string | null = null;
    if (data.data?.[0]?.b64_json) {
      imageUrl = `data:image/png;base64,${data.data[0].b64_json}`;
    } else if (data.data?.[0]?.url) {
      imageUrl = data.data[0].url;
    }

    if (!imageUrl) {
      throw new Error('No image URL in OpenAI response');
    }

    console.log('Image generated successfully with OpenAI (custom prompt)');
    return imageUrl;
  }
  
  // Sinon, construire le prompt standard pour ebooks
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
  const photorealisticEnhancement = getPhotorealisticEnhancement(style);
  
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

  const imagePrompt = `PROFESSIONAL ILLUSTRATION for published ebook "${ebookTitle}"
Chapter: "${chapterTitle}"
${chapterContent ? `Scene context: ${chapterContent.substring(0, 400)}` : ''}
${charactersContext}

ARTISTIC STYLE: ${style}
QUALITY LEVEL: ${qualityDesc}
${colorPrompt ? `COLOR PALETTE: ${colorPrompt}` : ''}
${photorealisticEnhancement}
${coherencePrompt}
${referencePrompt}

QUALITY STANDARDS (CRITICAL):
- Magazine-quality illustration (National Geographic, Condé Nast level)
- Rich cinematic lighting with dramatic depth
- Sharp details, professional composition following rule of thirds
- NO text, NO watermarks, NO artifacts, NO blurriness
- Vivid, immersive atmosphere matching the chapter mood
- If characters are described above, reproduce them with EXACT visual consistency across all images
- The illustration must feel like professional editorial artwork worthy of a bestselling book`;

  console.log('Generating image with OpenAI:', imagePrompt.substring(0, 200) + '...');

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

  // Helper pour générer un placeholder approprié selon le style
  const getPlaceholderUrl = (title: string, style: string, colorScheme: string): string => {
    const safeTitle = encodeURIComponent(title.substring(0, 30));
    // Pour les livres de coloriage (line art, monochrome), utiliser fond blanc + texte noir
    const isColoringBook = style.toLowerCase().includes('line art') || 
                           style.toLowerCase().includes('coloring') ||
                           colorScheme === 'monochrome';
    if (isColoringBook) {
      return `https://placehold.co/1024x1024/ffffff/000000?text=${safeTitle}`;
    }
    // Placeholder standard avec fond gris clair
    return `https://placehold.co/1024x1024/e5e7eb/374151?text=${safeTitle}`;
  };

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
      userGeminiApiKey,
      openrouterApiKey = null,
      imageEngine = 'auto',
      // Studio BD : jamais de bascule vers les crédits Lovable inclus.
      allowLovable = true,

      disableOpenAIFallback = false, 
      forceLovable = false,
      uploadToStorage = true,
      customPrompt = null,
      isColoringBook = false,
      coloringBookAgeGroup = '3-6',
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

    // ===== ROUTAGE PAR FOURNISSEUR (sécurité clés) =====
    // On classe chaque clé reçue selon son VRAI fournisseur, quel que soit
    // le champ dans lequel le client l'a envoyée. Une clé Gemini ne partira
    // donc jamais chez OpenAI (cause des 401 + images vides du Studio BD).
    const candidateKeys = [openaiApiKey, userGeminiApiKey, openrouterApiKey].filter(
      (k: unknown): k is string => typeof k === 'string' && k.trim().length > 10
    );
    const resolvedKeys: Record<KeyProvider, string | undefined> = {
      gemini: undefined, openai: undefined, openrouter: undefined, unknown: undefined,
    };
    for (const k of candidateKeys) {
      const p = detectKeyProvider(k);
      if (!resolvedKeys[p]) resolvedKeys[p] = k.trim();
    }
    const engine: string = ['auto', 'gemini', 'openai', 'openrouter', 'lovable'].includes(imageEngine)
      ? imageEngine
      : 'auto';
    console.log('🔑 Clés détectées:', {
      gemini: !!resolvedKeys.gemini,
      openai: !!resolvedKeys.openai,
      openrouter: !!resolvedKeys.openrouter,
      engine,
    });

    let usedProvider: string = 'lovable';
    let providerFallback = false;
    let providerError: string | null = null;

    const buildFallbackPrompt = () => isColoringBook
      ? getColoringBookPrompt(chapterTitle, coloringBookAgeGroup)
      : (customPrompt || `Illustration pour le chapitre "${chapterTitle}" du livre "${ebookTitle}". Style: ${style}.`);

    // Essais BYOK dans l'ordre : fournisseur demandé, puis autres clés valides
    const tryUserKeys = async (prompt: string, skip?: KeyProvider): Promise<string | null> => {
      const order: KeyProvider[] = engine === 'gemini'
        ? ['gemini', 'openrouter']
        : engine === 'openrouter'
          ? ['openrouter', 'gemini']
          : ['gemini', 'openrouter'];
      for (const p of order) {
        if (p === skip) continue;
        const key = resolvedKeys[p];
        if (!key) continue;
        const img = p === 'gemini'
          ? await tryGeminiDirect(prompt, key)
          : await tryOpenRouterImage(prompt, key);
        if (img) {
          usedProvider = p;
          return img;
        }
        providerError = `Échec de génération via ${p}`;
      }
      return null;
    };

    const wantsOpenAI = !forceLovable && engine !== 'lovable' && !!resolvedKeys.openai &&
      (engine === 'openai' || (engine === 'auto' && useOpenAI));
    const wantsUserKeyFirst = !forceLovable && engine !== 'lovable' && !!(resolvedKeys.gemini || resolvedKeys.openrouter) &&
      (engine === 'gemini' || engine === 'openrouter' || (engine === 'auto' && useOpenAI));

    if (wantsOpenAI) {
      try {
        generatedImageUrl = await generateWithOpenAI(
          chapterTitle,
          chapterContent,
          ebookTitle,
          style,
          characters,
          resolvedKeys.openai!,
          ratio,
          quality,
          colorScheme,
          visualCoherence,
          coherenceIntensity,
          referenceImageUrl,
          isColoringBook,
          coloringBookAgeGroup,
          customPrompt
        );
        usedProvider = 'openai';
      } catch (err) {
        console.error('OpenAI image generation failed, falling back:', err);
        providerError = err instanceof Error ? err.message : 'Échec OpenAI';
        providerFallback = true;
        const img = await tryUserKeys(buildFallbackPrompt());
        generatedImageUrl = img || getPlaceholderUrl(chapterTitle, style, colorScheme);
        if (!img) usedProvider = 'placeholder';
      }
    } else if (wantsUserKeyFirst) {
      // L'abonné a une clé Gemini et/ou OpenRouter : on l'utilise directement
      const prompt = customPrompt || buildFallbackPrompt();
      const img = await tryUserKeys(prompt);
      if (img) {
        generatedImageUrl = img;
      } else {
        providerFallback = true;
        console.error('Clés abonné indisponibles, bascule vers Lovable AI');
        generatedImageUrl = '';
      }
    } else {
      generatedImageUrl = '';
    }

    if (!generatedImageUrl) {

      // Utiliser Lovable AI (jamais si allowLovable === false : Studio BD)
      const LOVABLE_API_KEY = allowLovable ? Deno.env.get('LOVABLE_API_KEY') : null;


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

      // Détecter si c'est un livre de coloriage (via flag ou style)
      const isColoringMode = isColoringBook || 
        style.toLowerCase().includes('line art') || 
        style.toLowerCase().includes('coloring') ||
        colorScheme === 'monochrome';

      // Utiliser le prompt personnalisé ou le prompt de coloriage si applicable
      let imagePrompt: string;
      
      if (isColoringMode) {
        // MODE LIVRE DE COLORIAGE - Prompt ultra-strict
        imagePrompt = getColoringBookPrompt(chapterTitle, coloringBookAgeGroup);
        console.log('🎨 COLORING BOOK MODE ACTIVATED - Using specialized prompt');
      } else if (customPrompt) {
        // Utiliser le prompt personnalisé fourni par le client
        imagePrompt = customPrompt;
        console.log('📝 Using custom prompt from client');
      } else {
        // Prompt standard pour ebooks illustrés
        imagePrompt = `Contexte de l'ebook: "${ebookTitle}"
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
      }
      
      console.log('Generating image with prompt:', imagePrompt);

      const response = LOVABLE_API_KEY
        ? await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
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
                  content: imagePrompt
                }
              ],
              modalities: ['image', 'text']
            }),
          })
        : null;

      if (!response || !response.ok) {
        if (!response) {
          if (!allowLovable) {
            console.log('allowLovable=false : aucune bascule vers les crédits Lovable');
          } else {
            console.error('LOVABLE_API_KEY missing, trying user keys...');
            providerError = providerError || 'LOVABLE_API_KEY manquante';
          }
        } else if (response.status === 429 || response.status === 402) {
          console.log('Lovable AI credits/rate limit reached, trying user keys...');
          providerError = response.status === 402
            ? 'Crédits Lovable AI épuisés'
            : 'Limite de débit Lovable AI atteinte';
        } else {
          const errorText = await response.text();
          console.error('AI Gateway error:', response.status, errorText);
          providerError = `Lovable AI ${response.status}`;
        }
        if (allowLovable) providerFallback = true;
        const img = await tryUserKeys(imagePrompt);
        if (img) {
          generatedImageUrl = img;
        } else if (!allowLovable) {
          // Aucune clé abonné n'a fonctionné : échec explicite, pas de placeholder
          // et surtout aucun crédit Lovable consommé.
          const hasAnyKey = !!(resolvedKeys.gemini || resolvedKeys.openai || resolvedKeys.openrouter);
          return new Response(
            JSON.stringify({
              error: hasAnyKey
                ? (providerError || 'Votre clé IA a été refusée pour la génération d\'images.')
                : 'Aucune clé IA valide enregistrée (Gemini, OpenAI ou OpenRouter).',
              reason: hasAnyKey ? 'provider_failed' : 'no_key',
              provider: null,
              providerError,
              imageUrl: '',
              chapterTitle,
            }),
            { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } else {
          usedProvider = 'placeholder';
          generatedImageUrl = getPlaceholderUrl(chapterTitle, style, colorScheme);
        }
      } else {
        // Réponse OK - extraire l'image base64 de la réponse Gemini
        const data = await response.json();
        console.log('Lovable AI response received successfully');
        
        const imageData = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
        
        if (imageData) {
          generatedImageUrl = imageData;
          usedProvider = 'lovable';
          console.log('Image extracted from Lovable AI response (base64 length:', imageData.length, ')');
        } else {
          // Fallback: vérifier d'autres formats de réponse possibles
          const content = data.choices?.[0]?.message?.content;
          if (typeof content === 'string' && content.startsWith('data:image')) {
            generatedImageUrl = content;
            usedProvider = 'lovable';
          } else {
            console.error('No image in Lovable AI response:', JSON.stringify(data).substring(0, 500));
            providerError = 'Aucune image renvoyée par Lovable AI';
            providerFallback = true;
            const img = await tryUserKeys(imagePrompt);
            if (img) {
              generatedImageUrl = img;
            } else {
              usedProvider = 'placeholder';
              generatedImageUrl = getPlaceholderUrl(chapterTitle, style, colorScheme);
            }
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

    console.log(`Image generated successfully (provider=${usedProvider}, fallback=${providerFallback})`);
    return new Response(
      JSON.stringify({ 
        imageUrl: finalImageUrl,
        chapterTitle,
        seed: typeof generatedSeed !== 'undefined' ? generatedSeed : null,
        storedInCloud: uploadToStorage && finalImageUrl !== generatedImageUrl,
        provider: usedProvider,
        fallback: providerFallback,
        isPlaceholder,
        providerError,
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
