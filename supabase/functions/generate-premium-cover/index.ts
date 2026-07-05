import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CoverRequest {
  title?: string;
  subtitle?: string;
  author?: string;
  genre?: string;
  niche?: string;            // registre/preset artistique
  registrePrompt?: string;   // brief artistique du preset choisi
  customPrompt?: string;
  count?: number;            // nombre de variations 1..4
  showAuthor?: boolean;
  openrouterKey?: string;    // BYOK OpenRouter (sk-or-...) — prioritaire si fourni
}

async function buildArtDirection(
  lovableKey: string,
  req: CoverRequest,
): Promise<string> {
  // Étape 1 — Direction artistique IA (texte) pour enrichir le prompt image.
  const sys = `Tu es directeur artistique senior pour une grande maison d'édition (Penguin, HarperCollins).
Tu écris un brief visuel COURT et PRÉCIS (en anglais, 4 à 6 phrases) pour générer une couverture de livre PHOTORÉALISTE haut de gamme.
Inclure: concept visuel central, palette de couleurs, éclairage, composition, ambiance, et style typographique suggéré.
Interdits absolus: cartoon, illustration enfantine, rendu 3D plastique, watermark. Cible: bestseller Amazon, qualité magazine.`;

  const user = `Titre: "${req.title}"
${req.subtitle ? `Sous-titre: "${req.subtitle}"` : ''}
Genre: ${req.genre || 'non précisé'}
Niche/registre: ${req.niche || 'auto'}
${req.registrePrompt ? `Direction de référence: ${req.registrePrompt}` : ''}
${req.customPrompt ? `Souhait de l'auteur: ${req.customPrompt}` : ''}

Donne uniquement le brief visuel, sans préambule.`;

  try {
    const resp = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${lovableKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: sys },
          { role: 'user', content: user },
        ],
      }),
    });
    if (!resp.ok) return req.registrePrompt || req.customPrompt || '';
    const data = await resp.json();
    return data.choices?.[0]?.message?.content?.trim() || req.registrePrompt || '';
  } catch (_e) {
    return req.registrePrompt || req.customPrompt || '';
  }
}

function buildImagePrompt(req: CoverRequest, artDirection: string): string {
  const showAuthor = req.showAuthor !== false;
  return `Create an ULTRA-REALISTIC, PHOTOREALISTIC, premium front book cover for Amazon KDP — the quality of a flagship Penguin Random House / HarperCollins release.

ABSOLUTE REQUIREMENT — REAL PHOTOGRAPH LOOK:
This must be indistinguishable from a professionally photographed and designed book cover. NO cartoon, NO childish illustration, NO plastic 3D render, NO visible AI artifacts, NO watermark. Real textures, real light, cinematic depth of field.

ART DIRECTION:
${artDirection}

BOOK DETAILS:
- Title: "${req.title}"
${req.subtitle ? `- Subtitle: "${req.subtitle}"` : ''}
${showAuthor && req.author ? `- Author: "${req.author}"` : '- No author name on cover'}
- Genre: ${req.genre || 'general'}

TYPOGRAPHY (CRITICAL — MUST BE PERFECT):
1. TITLE "${req.title}" — large, razor-sharp, professional font with perfect kerning, readable even as a small Amazon thumbnail.
${req.subtitle ? `2. SUBTITLE "${req.subtitle}" — elegant, lighter weight, below the title.` : ''}
${showAuthor && req.author ? `3. AUTHOR "${req.author}" — refined typography, smaller than title, at the bottom.` : ''}

PHOTOGRAPHIC STANDARDS:
- As if shot on Canon EOS R5 / Sony A7R V, 85mm f/1.4 prime lens
- Professional studio or golden-hour lighting, dramatic soft shadows
- Rich, deep, film-like color grading; real materials with visible grain
- Rule-of-thirds composition, strong visual hierarchy, beautiful bokeh

TECHNICAL:
- Portrait 2:3 ratio (1024x1536)
- Full bleed, ABSOLUTELY NO white borders, NO barcode, NO ISBN
- Print-ready 300 DPI equivalent, CMYK-safe colors

${req.customPrompt ? `CREATIVE DIRECTION: ${req.customPrompt}` : ''}

QUALITY BENCHMARK: A cover that could win a publishing design award.`;
}

async function generateOpenAI(
  openaiKey: string,
  prompt: string,
): Promise<string | null> {
  const tryModel = async (model: string) => {
    const payload: Record<string, unknown> = {
      model,
      prompt: model === 'dall-e-3' ? prompt.slice(0, 4000) : prompt,
      n: 1,
      size: '1024x1536',
    };
    if (model === 'dall-e-3') {
      payload.response_format = 'b64_json';
      payload.quality = 'hd';
      payload.size = '1024x1792';
    } else {
      // "medium" est nettement plus rapide que "high" (évite les timeouts
      // de la fonction quand on génère plusieurs variations).
      payload.quality = 'medium';
      payload.output_format = 'png';
    }
    const resp = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${openaiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!resp.ok) {
      const errorText = await resp.text();
      console.error(`OpenAI ${model} error:`, resp.status, errorText.slice(0, 300));
      return { ok: false, status: resp.status, errorText };
    }
    const data = await resp.json();
    const b64 = data?.data?.[0]?.b64_json;
    const url = data?.data?.[0]?.url;
    return { ok: true, b64, url };
  };

  // gpt-image-2 prioritaire, fallback gpt-image-1, puis dall-e-3.
  for (const model of ['gpt-image-2', 'gpt-image-1', 'dall-e-3']) {
    const r = await tryModel(model);
    if (r.ok) {
      if (r.b64) return `data:image/png;base64,${r.b64}`;
      if (r.url) return r.url;
    }
    // si erreur d'accès/param, on tente le modèle suivant
    if (!r.ok && !(r.status === 403 || r.status === 400 || /verified|permission|unknown_parameter|model/i.test(r.errorText || ''))) {
      break;
    }
  }
  return null;
}

async function generateGemini(lovableKey: string, prompt: string): Promise<string | null> {
  const resp = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${lovableKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash-image',
      messages: [{ role: 'user', content: prompt }],
      modalities: ['image', 'text'],
    }),
  });
  if (!resp.ok) {
    console.error('Gemini image error:', resp.status, (await resp.text()).slice(0, 200));
    return null;
  }
  const data = await resp.json();
  return data.choices?.[0]?.message?.images?.[0]?.image_url?.url || null;
}

async function generateOpenRouter(openrouterKey: string, prompt: string): Promise<string | null> {
  try {
    const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openrouterKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://ebookstudio.fr',
        'X-Title': 'EbookStudio',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [{ role: 'user', content: prompt }],
        modalities: ['image', 'text'],
      }),
    });
    if (!resp.ok) {
      console.error('OpenRouter image error:', resp.status, (await resp.text()).slice(0, 200));
      return null;
    }
    const data = await resp.json();
    return data.choices?.[0]?.message?.images?.[0]?.image_url?.url || null;
  } catch (e) {
    console.error('OpenRouter image exception:', (e as Error).message);
    return null;
  }
}

async function uploadCover(
  supabaseUrl: string,
  serviceKey: string,
  dataUrl: string,
): Promise<string> {
  // Si déjà une URL http (cas dall-e url), on renvoie tel quel.
  if (dataUrl.startsWith('http')) return dataUrl;
  const base64 = dataUrl.split(',')[1];
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const supabase = createClient(supabaseUrl, serviceKey);
  const path = `premium-covers/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.png`;
  const { error } = await supabase.storage.from('ebook-images').upload(path, bytes, {
    contentType: 'image/png',
    upsert: false,
  });
  if (error) {
    console.error('Upload error:', error.message);
    return dataUrl; // fallback: renvoyer le base64
  }
  const { data } = supabase.storage.from('ebook-images').getPublicUrl(path);
  return data.publicUrl;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as CoverRequest;

    if (!body.title || typeof body.title !== 'string' || body.title.trim().length === 0) {
      return new Response(JSON.stringify({ error: "Le titre du livre est requis." }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const count = Math.min(Math.max(Number(body.count) || 1, 1), 4);

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const openrouterKey = typeof body.openrouterKey === 'string' && body.openrouterKey.trim().startsWith('sk-or-')
      ? body.openrouterKey.trim()
      : null;

    if (!OPENAI_API_KEY && !LOVABLE_API_KEY && !openrouterKey) {
      return new Response(JSON.stringify({ error: 'Aucune clé API image configurée.' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Direction artistique (une seule fois, partagée pour les variations).
    const artDirection = LOVABLE_API_KEY
      ? await buildArtDirection(LOVABLE_API_KEY, body)
      : (body.registrePrompt || body.customPrompt || '');

    // Génération EN PARALLÈLE des variations pour rester sous la limite de temps.
    const results = await Promise.all(
      Array.from({ length: count }, async (_v, i) => {
        const prompt = buildImagePrompt(body, artDirection)
          + `\n\nVARIATION ${i + 1}/${count}: propose une interprétation visuelle UNIQUE.`;

        let imageUrl: string | null = null;
        // BYOK OpenRouter prioritaire (économise les crédits) si fourni.
        if (openrouterKey) {
          imageUrl = await generateOpenRouter(openrouterKey, prompt);
        }
        if (!imageUrl && OPENAI_API_KEY) {
          imageUrl = await generateOpenAI(OPENAI_API_KEY, prompt);
        }
        if (!imageUrl && LOVABLE_API_KEY) {
          imageUrl = await generateGemini(LOVABLE_API_KEY, prompt);
        }
        if (!imageUrl) return null;
        return await uploadCover(SUPABASE_URL, SERVICE_KEY, imageUrl);
      }),
    );

    const covers: string[] = results.filter((u): u is string => !!u);
    const errors: string[] = results
      .map((u, i) => (u ? null : `Variation ${i + 1} échouée`))
      .filter((e): e is string => !!e);

    if (covers.length === 0) {
      return new Response(JSON.stringify({ error: 'Aucune couverture générée. Réessayez dans un instant.' }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ covers, artDirection, errors }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-premium-cover:', error);
    return new Response(JSON.stringify({ error: (error as Error).message || 'Erreur interne' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
