import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
    const body = await req.json();
    const {
      title,
      subtitle = '',
      author,
      genre,
      style,
      colorScheme,
      description,
      format = 'kindle',
      kdpBrief = '',
      referenceImage,
      openrouterKey,
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

    // ===== Build the two reusable prompts (recto + verso) =====
    const baseArt = `Style: ${style || 'cinematic photorealistic'}. Palette: ${colorScheme || 'deep blacks, brilliant gold accents, dramatic high contrast'}. Genre: ${genre || 'non-fiction'}.${description ? ` Concept to depict literally: ${description}.` : ''} MUST be a real PHOTOGRAPHIC scene with relevant objects/environment shot with Phase One IQ4 + 85mm f/1.4 lens equivalent — sharp foreground subject, cinematic lighting (key + rim + volumetric haze), shallow depth of field, golden hour or dramatic spotlight, magazine-grade detail. NO cartoon, NO illustration, NO flat gradient background, NO empty pastel canvas, NO watercolor, NO low-fidelity. Title typography sharp, perfectly legible, bestseller hierarchy.`;

    const rectoPrompt = `FRONT COVER (recto) for the book "${title}"${subtitle ? `, subtitle "${subtitle}"` : ''}, by ${author || 'Author'}. Vertical portrait artwork, ratio 1.6:1, flat 2D print-ready. Title HUGE centered at top third, ${subtitle ? 'subtitle clearly below in smaller elegant type, ' : ''}author name at the bottom. ${baseArt}`;

    const versoPrompt = `BACK COVER (verso / 4ème de couverture) for the same book "${title}" by ${author || 'Author'}. Same visual universe as the front cover (same palette, lighting, typography). Vertical portrait, same dimensions as the front. Compose a clean back panel with: a short hook headline at the top, a 3–5 line synopsis area in readable body text, a small author bio block at the bottom-left, and a CLEAN EMPTY rectangular zone of 50 x 30 mm in the BOTTOM-RIGHT reserved for ISBN barcode (do not draw a barcode, leave it white/neutral). ${baseArt}`;

    // === STEP 1: generate a unique cinematic scene concept ===
    const conceptEndpoint = useOpenRouter
      ? 'https://openrouter.ai/api/v1/chat/completions'
      : 'https://ai.gateway.lovable.dev/v1/chat/completions';
    const conceptHeaders: Record<string, string> = useOpenRouter
      ? { 'Authorization': `Bearer ${openrouterKey.trim()}`, 'Content-Type': 'application/json', 'HTTP-Referer': 'https://ebookstudio.fr', 'X-Title': 'EbookStudio' }
      : { 'Lovable-API-Key': LOVABLE_API_KEY!, 'Content-Type': 'application/json' };

    const sceneConcept = await generateSceneConcept({
      title, subtitle, genre, description, style, colorScheme,
      endpoint: conceptEndpoint, authHeaders: conceptHeaders,
    });

    const variationSeed = Math.floor(Math.random() * 999999);
    const baseArt = sceneConcept || `Cinematic photorealistic scene relevant to "${title}". Real subject + environment, dramatic lighting (rim light, golden hour or chiaroscuro), shallow depth of field, magazine-grade detail.`;

    const rectoPrompt = `FRONT COVER (recto) for "${title}"${subtitle ? `, subtitle "${subtitle}"` : ''}, by ${author || 'Author'}. ${baseArt}`;
    const versoPrompt = `BACK COVER for the same book "${title}" by ${author || 'Author'}. Same visual universe as the front. Clean back panel with hook headline top, 3-5 line synopsis, author bio bottom-left, empty 50x30 mm white zone bottom-right for ISBN. ${baseArt}`;

    // === STEP 2: image prompt — short, positive, scene-led ===
    const textPrompt = `Create a PROFESSIONAL Amazon best-seller book cover.

SCENE TO PHOTOGRAPH (mandatory, do not replace with a flat color or gradient):
${baseArt}

BOOK:
- Title: "${title}" — render HUGE bold sans-serif at top, brilliant white or gold, sharp legible glyphs, dark vignette behind if needed.
${subtitle ? `- Subtitle: "${subtitle}" — smaller elegant type below the title.\n` : ''}- Author: "${author || 'Author'}" — clean at the bottom.

ART DIRECTION:
- Style: ${style || 'cinematic photorealistic, Phase One IQ4 + 85mm f/1.4 look'}
- Palette: ${colorScheme || 'deep contrast, dramatic light'}
- Genre: ${genre || 'non-fiction'}

FORMAT:
${formatGuidance}

Render variation #${variationSeed}. Photograph the scene above — real depicted subject matter, NOT an empty colored background.${referenceImage ? ' Use attached reference for mood only, do not copy.' : ''}`;

    let messageContent: string | any[] = textPrompt;
    if (referenceImage && typeof referenceImage === 'string' && referenceImage.length < 6_000_000) {
      messageContent = [
        { type: "text", text: textPrompt },
        { type: "image_url", image_url: { url: referenceImage } },
      ];
    }

    const endpoint = conceptEndpoint;
    const authHeaders = conceptHeaders;
    const modelId = useOpenRouter ? 'google/gemini-2.5-flash-image-preview' : 'google/gemini-3.1-flash-image-preview';

    const response = await fetch(endpoint, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        model: modelId,
        messages: [{ role: "user", content: messageContent }],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) return new Response(JSON.stringify({ error: "Limite atteinte, réessayez dans 1 minute" }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      if (status === 402) return new Response(JSON.stringify({ error: "Crédits IA insuffisants" }), { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      const t = await response.text();
      console.error("AI gateway error:", status, t);
      throw new Error(`Erreur génération: ${status}`);
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
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
