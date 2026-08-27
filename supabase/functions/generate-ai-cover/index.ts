import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const requireUser = async (req: Request) => {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } },
  );
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) return null;
  return data.user;
};


// Try to extract page count + paper type + trim from a free-text KDP brief
function parseKdpBrief(brief: string) {
  const result: { pages?: number; paper?: string; trim?: string; spineMm?: number; widthMm?: number; heightMm?: number } = {};
  if (!brief) return result;
  const pagesMatch = brief.match(/(\d{2,4})\s*pages?/i);
  if (pagesMatch) result.pages = parseInt(pagesMatch[1], 10);
  if (/cr[eè]me|cream/i.test(brief)) result.paper = 'cream';
  else if (/blanc|white/i.test(brief)) result.paper = 'white';
  const trimMatch = brief.match(/(\d{1,2}[.,]?\d?)\s*[x×]\s*(\d{1,2}[.,]?\d?)\s*cm/i);
  if (trimMatch) {
    result.widthMm = parseFloat(trimMatch[1].replace(',', '.')) * 10;
    result.heightMm = parseFloat(trimMatch[2].replace(',', '.')) * 10;
    result.trim = `${trimMatch[1]}x${trimMatch[2]} cm`;
  }
  // KDP spine formula approx : pages * (cream 0.0573mm | white 0.0524mm)
  if (result.pages) {
    const factor = result.paper === 'white' ? 0.0524 : 0.0573;
    result.spineMm = +(result.pages * factor).toFixed(2);
  }
  return result;
}

function buildPaperbackSpec(parsed: ReturnType<typeof parseKdpBrief>) {
  const w = parsed.widthMm ?? 152;   // 15.24 cm default 6x9"
  const h = parsed.heightMm ?? 229;  // 22.86 cm
  const spine = parsed.spineMm ?? 12;
  const bleed = 3.175; // 0.125"
  const totalW = w * 2 + spine + bleed * 2;
  const totalH = h + bleed * 2;
  return {
    widthMm: w, heightMm: h, spineMm: spine, bleed,
    totalWmm: +totalW.toFixed(2), totalHmm: +totalH.toFixed(2),
    pages: parsed.pages, paper: parsed.paper,
    trim: parsed.trim ?? `${(w/10).toFixed(2)}x${(h/10).toFixed(2)} cm`,
  };
}

const KINDLE_SPEC = `Vertical portrait flat 2D print-ready artwork, aspect ratio 1.6:1 (1600x2560 px), full-bleed edge to edge, no border, no 3D mockup, no tilted device.`;

const OPENROUTER_IMAGE_MODEL = 'google/gemini-2.5-flash-image';
const LOVABLE_IMAGE_MODEL = 'google/gemini-3.1-flash-image';

function extractImageUrl(data: any): string | undefined {
  const message = data?.choices?.[0]?.message;
  const directImage = message?.images?.[0]?.image_url?.url;
  if (directImage) return directImage;

  if (Array.isArray(message?.content)) {
    const imagePart = message.content.find((part: any) =>
      part?.type === 'image_url' || part?.type === 'output_image' || part?.image_url || part?.url,
    );
    return imagePart?.image_url?.url || imagePart?.url;
  }

  return data?.images?.[0]?.url || data?.image?.url;
}

function paperbackSpecPrompt(spec: ReturnType<typeof buildPaperbackSpec>) {
  return `AMAZON KDP PAPERBACK FULL WRAP — single continuous landscape artwork.
- Total wrap: ${spec.totalWmm} mm wide x ${spec.totalHmm} mm tall (3.175 mm bleed each side).
- LEFT = BACK COVER (${spec.widthMm} mm). CENTER = SPINE (${spec.spineMm} mm${spec.pages ? `, ${spec.pages} pages ${spec.paper ?? 'cream'}` : ''}). RIGHT = FRONT COVER (${spec.widthMm} mm).
- SPINE: title vertical top-to-bottom + author, 5 mm safe from edges.
- BACK: clean 50x30 mm zone bottom-right for ISBN.
- Seamless artwork across all 3 panels. Flat 2D wrap, not a 3D mockup.`;
}

// Generate a unique cinematic SCENE concept so each cover is visually different.
async function generateSceneConcept(opts: {
  title: string; subtitle?: string; genre?: string; description?: string; style?: string; colorScheme?: string;
  endpoint: string; authHeaders: Record<string, string>;
}): Promise<string> {
  const seed = Math.floor(Math.random() * 999999);
  const sysPrompt = `You are an award-winning art director for Amazon best-seller book covers (Penguin, HarperCollins). Describe ONE precise, UNIQUE cinematic photographic scene for the book cover. No generalities, no "gradient background" — a REAL scene with subject, setting, props, lighting. Reply in 3-4 sentences max, in English, ultra concrete and visual. Variation seed #${seed}.`;
  const userPrompt = `Book: "${opts.title}"${opts.subtitle ? ` — ${opts.subtitle}` : ''}
Genre: ${opts.genre || 'non-fiction'}
${opts.description ? `Topic: ${opts.description}` : ''}
${opts.style ? `Style: ${opts.style}` : ''}
${opts.colorScheme ? `Palette: ${opts.colorScheme}` : ''}

Describe ONE original photorealistic cinematic scene that powerfully evokes this book. Include: foreground subject, environment/setting, dramatic lighting (golden hour, chiaroscuro, neon, backlight…), atmosphere. AVOID generic clichés (just a gradient, empty silhouette, flat color). Be SPECIFIC about objects and composition.`;

  try {
    const res = await fetch(opts.endpoint, {
      method: "POST",
      headers: opts.authHeaders,
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [{ role: "system", content: sysPrompt }, { role: "user", content: userPrompt }],
        temperature: 1.1,
      }),
    });
    if (!res.ok) return '';
    const j = await res.json();
    return (j.choices?.[0]?.message?.content || '').trim();
  } catch { return ''; }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const user = await requireUser(req);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Non authentifié' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const body = await req.json();

    const {
      title,
      subtitle = '',
      author,
      genre,
      style,
      colorScheme,
      description,
      userPrompt = '',
      registre = '',
      format = 'kindle',
      kdpBrief = '',
      referenceImage,
      openrouterKey,
      customPrompt = '',
    } = body;

    if (!title) {
      return new Response(JSON.stringify({ error: "Titre requis" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const useOpenRouter = typeof openrouterKey === 'string' && openrouterKey.trim().startsWith('sk-or-');
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!useOpenRouter && !LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY non configurée");

    const parsed = parseKdpBrief(kdpBrief);
    const paperbackSpec = format === 'paperback' ? buildPaperbackSpec(parsed) : null;
    const formatGuidance = format === 'paperback'
      ? paperbackSpecPrompt(paperbackSpec!)
      : KINDLE_SPEC;


    // === STEP 1: generate a unique cinematic scene concept ===
    const conceptEndpoint = useOpenRouter
      ? 'https://openrouter.ai/api/v1/chat/completions'
      : 'https://ai.gateway.lovable.dev/v1/chat/completions';
    const conceptHeaders: Record<string, string> = useOpenRouter
      ? { 'Authorization': `Bearer ${openrouterKey.trim()}`, 'Content-Type': 'application/json', 'HTTP-Referer': 'https://ebookstudio.fr', 'X-Title': 'EbookStudio' }
      : { 'Lovable-API-Key': LOVABLE_API_KEY!, 'Content-Type': 'application/json' };

    // Si l'utilisateur fournit son propre prompt, on s'en sert COMME SCÈNE et on saute la génération d'idée.
    let sceneConcept = '';
    if (userPrompt && userPrompt.trim().length > 10) {
      sceneConcept = userPrompt.trim();
    } else {
      sceneConcept = await generateSceneConcept({
        title, subtitle, genre, description: description || userPrompt, style, colorScheme,
        endpoint: conceptEndpoint, authHeaders: conceptHeaders,
      });
    }

    const variationSeed = Math.floor(Math.random() * 999999);
    const baseArt = sceneConcept || `Cinematic photorealistic scene relevant to "${title}". Real subject + environment, dramatic lighting (rim light, golden hour or chiaroscuro), shallow depth of field, magazine-grade detail.`;

    const rectoPrompt = `FRONT COVER (recto) for "${title}"${subtitle ? `, subtitle "${subtitle}"` : ''}, by ${author || 'Author'}. ${baseArt}`;
    const versoPrompt = `BACK COVER for the same book "${title}" by ${author || 'Author'}. Same visual universe as the front. Clean back panel with hook headline top, 3-5 line synopsis, author bio bottom-left, empty 50x30 mm white zone bottom-right for ISBN. ${baseArt}`;

    // === STEP 2: image prompt — bestseller Amazon, photoréaliste ===
    const textPrompt = `You are generating a PROFESSIONAL Amazon BESTSELLER book cover (the kind sold for $20+ on Amazon by Penguin, HarperCollins, Hachette). Quality target: indistinguishable from a real published cover by a top art director.

═══ MANDATORY SCENE (render EXACTLY — do NOT replace with a generic background, gradient, plain color, abstract pattern, or default office/desk/sunset) ═══
${baseArt}

═══ TYPOGRAPHY (must be rendered cleanly on the cover, perfectly legible, no AI gibberish letters) ═══
- TITLE: "${title}" — MASSIVE bold condensed sans-serif (think Impact / Bebas Neue / Oswald), pure white, centered, occupying ~35–45% of cover height, slightly textured / grainy print finish, sharp letterforms.
${subtitle ? `- TAGLINE: "${subtitle}" — smaller bold uppercase, accent color (blood red or gold depending on genre), placed just below the title.\n` : ''}- AUTHOR: "${author || 'Author'}" — clean uppercase tracked-out sans-serif at the very bottom, smaller than the title, gold or white.

═══ ART DIRECTION ═══
- Register: ${registre || 'commercial bestseller'}
- Style: ${style || 'cinematic photorealistic, Phase One IQ4 + 85mm f/1.4'}
- Palette: ${colorScheme || 'deep contrast, dramatic light'}
- Genre: ${genre || 'non-fiction'}
- Composition: full-bleed photographic image, subject occupies upper 50%, title occupies lower-middle, author at bottom — Amazon thumbnail must remain readable at 200 px wide.

═══ ABSOLUTE BANS — failing any of these = unusable cover ═══
- NO flat color or simple gradient background
- NO empty silhouette in empty space
- NO cartoon, illustration, anime, 3D-render look
- NO AI artifacts (melted hands, extra fingers, distorted faces, gibberish text)
- NO watermark, Amazon badge, fake price tag, 3D book mockup, tilted device
- NO generic stock-photo feel — must look like a CURATED art-directed bestseller cover

═══ FORMAT ═══
${formatGuidance}

Render variation #${variationSeed}. The output MUST be a finished, print-ready, photorealistic bestseller cover with the scene above as the hero image and the title/author rendered as real legible typography.${referenceImage ? ' Use the attached reference for mood/lighting only — do not copy its subject.' : ''}`;

    // Si l'utilisateur a édité manuellement le prompt final, on l'utilise tel quel.
    const finalTextPrompt = (customPrompt && customPrompt.trim().length > 30) ? customPrompt.trim() : textPrompt;

    let messageContent: string | any[] = finalTextPrompt;
    if (referenceImage && typeof referenceImage === 'string' && referenceImage.length < 6_000_000) {
      messageContent = [
        { type: "text", text: finalTextPrompt },
        { type: "image_url", image_url: { url: referenceImage } },
      ];
    }

    // Helper: attempt image generation with a given provider config
    const attemptGeneration = async (endpoint: string, headers: Record<string, string>, modelId: string) => {
      const resp = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({
          model: modelId,
          messages: [{ role: "user", content: messageContent }],
          modalities: ["image", "text"],
        }),
      });
      if (!resp.ok) {
        return { ok: false as const, status: resp.status, text: await resp.text() };
      }
      return { ok: true as const, data: await resp.json() };
    };

    let imageData: { ok: true; data: any } | { ok: false; status: number; text: string } | undefined;
    let usedProvider: 'openrouter' | 'lovable-ai' = 'lovable-ai';
    let usedModel = LOVABLE_IMAGE_MODEL;

    // 1. Try OpenRouter BYOK first if provided
    if (useOpenRouter) {
      imageData = await attemptGeneration(conceptEndpoint, conceptHeaders, OPENROUTER_IMAGE_MODEL);
      if (imageData.ok) {
        usedProvider = 'openrouter';
        usedModel = OPENROUTER_IMAGE_MODEL;
      } else {
        console.error('OpenRouter image failed, falling back to Lovable AI:', imageData.status, imageData.text.slice(0, 300));
      }
    }

    // 2. Fall back to Lovable AI (or use it directly if no OpenRouter key)
    if (!imageData?.ok && LOVABLE_API_KEY) {
      const lovableEndpoint = 'https://ai.gateway.lovable.dev/v1/chat/completions';
      const lovableHeaders = { 'Lovable-API-Key': LOVABLE_API_KEY, 'Content-Type': 'application/json' };
      imageData = await attemptGeneration(lovableEndpoint, lovableHeaders, LOVABLE_IMAGE_MODEL);
      if (imageData.ok) usedProvider = 'lovable-ai';
    }

    if (!imageData?.ok) {
      const status = imageData?.status ?? 500;
      const t = imageData?.text ?? '';
      if (status === 429) return new Response(JSON.stringify({ error: "Limite atteinte, réessayez dans 1 minute" }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      if (status === 402) return new Response(JSON.stringify({ error: "Crédits IA insuffisants" }), { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      console.error("AI gateway error:", status, t);
      return new Response(JSON.stringify({
        error: useOpenRouter
          ? `Échec de génération (${status}). OpenRouter et Lovable AI ont tous deux échoué. Vérifiez votre clé OpenRouter et vos crédits.`
          : `Erreur génération Lovable AI (${status})`,
        details: t.slice(0, 800),
        provider: usedProvider,
        model: usedModel,
      }), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const data = imageData.data;
    const imageUrl = extractImageUrl(data);
    const textResponse = data.choices?.[0]?.message?.content || "";

    if (!imageUrl) throw new Error("Aucune image générée");

    return new Response(JSON.stringify({
      imageUrl,
      description: textResponse,
      format,
      paperbackSpec,
      prompts: { recto: rectoPrompt, verso: versoPrompt },
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Erreur" }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
