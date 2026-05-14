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

const KINDLE_SPEC = `KINDLE eBOOK FRONT COVER — FLAT PRINT-READY ARTWORK.
- Output a FLAT 2D cover artwork only — NOT a 3D mockup, NOT a book photo, NOT a tilted Kindle device, NOT a shelf scene, NO shadow under a fake book.
- Pure rectangular artwork edge to edge, no border, no frame, no perspective.
- Vertical portrait, aspect ratio exactly 1.6:1 (e.g. 1600 x 2560 px).
- Title HUGE, bold, centered, readable at 200px wide thumbnail.
- Author name clean at the bottom.
- 8% safe margin from each edge.`;

function paperbackSpecPrompt(spec: ReturnType<typeof buildPaperbackSpec>) {
  return `AMAZON KDP PAPERBACK FULL WRAP — single continuous landscape artwork.
- Total wrap dimensions: ${spec.totalWmm} mm wide x ${spec.totalHmm} mm tall (includes 3.175 mm bleed each side).
- LEFT panel = BACK COVER, width ${spec.widthMm} mm.
- CENTER = SPINE, width EXACTLY ${spec.spineMm} mm — narrow vertical strip${spec.pages ? ` (calculated for ${spec.pages} pages, ${spec.paper ?? 'cream'} paper)` : ''}.
- RIGHT panel = FRONT COVER, width ${spec.widthMm} mm.
- Trim per cover panel: ${spec.trim}.
- SPINE: title written vertically top-to-bottom + author name, all text 5 mm minimum from spine edges.
- BACK PANEL: leave a clean rectangular zone 50 x 30 mm in the BOTTOM-RIGHT for ISBN barcode (no text, no critical art there).
- Artwork must flow seamlessly across spine — same colors, lighting, typography family on all 3 panels.
- 3 mm safe bleed all around. Add discreet fold guide marks just outside the spine on top/bottom edges.
- Output a FLAT 2D wrap, NOT a 3D mockup of the book.`;
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
    const baseArt = `Style: ${style || 'professional'}. Palette: ${colorScheme || 'modern, high contrast'}. Genre: ${genre || 'non-fiction'}.${description ? ` Concept: ${description}.` : ''} Photorealistic magazine-grade quality, NO cartoon, NO low-fidelity, NO watermark, NO Amazon badge, NO mockup. Title typography sharp and perfectly legible.`;

    const rectoPrompt = `FRONT COVER (recto) for the book "${title}"${subtitle ? `, subtitle "${subtitle}"` : ''}, by ${author || 'Author'}. Vertical portrait artwork, ratio 1.6:1, flat 2D print-ready. Title HUGE centered at top third, ${subtitle ? 'subtitle clearly below in smaller elegant type, ' : ''}author name at the bottom. ${baseArt}`;

    const versoPrompt = `BACK COVER (verso / 4ème de couverture) for the same book "${title}" by ${author || 'Author'}. Same visual universe as the front cover (same palette, lighting, typography). Vertical portrait, same dimensions as the front. Compose a clean back panel with: a short hook headline at the top, a 3–5 line synopsis area in readable body text, a small author bio block at the bottom-left, and a CLEAN EMPTY rectangular zone of 50 x 30 mm in the BOTTOM-RIGHT reserved for ISBN barcode (do not draw a barcode, leave it white/neutral). ${baseArt}`;

    const textPrompt = `You are an award-winning book-cover art director. Create a PROFESSIONAL Amazon best-seller quality book cover.

=== BOOK ===
Title: "${title}"
${subtitle ? `Subtitle: "${subtitle}" — display it clearly BELOW the title, smaller but elegant, hierarchically subordinate.` : ''}
Author: "${author || 'Author'}"
Genre: ${genre || 'non-fiction'}

=== ART DIRECTION ===
Style: ${style || 'professional'}
Color palette: ${colorScheme || 'modern and elegant, high contrast'}
${description ? `Concept: ${description}` : ''}

=== FORMAT ===
${formatGuidance}

=== QUALITY BAR ===
- Photorealistic, magazine-grade. ZERO cartoon, ZERO low-fidelity.
- Title typography perfectly legible — clean, sharp, no warped letters, no fake glyphs.
- Inspired by current Amazon top 100 best-sellers in this genre.
- No watermarks, no logos, no UI mockups, no Amazon badges, NO 3D book mockup.
${referenceImage ? '- Use the attached reference image ONLY for stylistic inspiration (mood, palette, composition). Do NOT copy it.' : ''}`;

    let messageContent: string | any[] = textPrompt;
    if (referenceImage && typeof referenceImage === 'string' && referenceImage.length < 6_000_000) {
      messageContent = [
        { type: "text", text: textPrompt },
        { type: "image_url", image_url: { url: referenceImage } },
      ];
    }

    const endpoint = useOpenRouter
      ? 'https://openrouter.ai/api/v1/chat/completions'
      : 'https://ai.gateway.lovable.dev/v1/chat/completions';
    const authHeaders: Record<string, string> = useOpenRouter
      ? { 'Authorization': `Bearer ${openrouterKey.trim()}`, 'Content-Type': 'application/json', 'HTTP-Referer': 'https://ebookstudio.fr', 'X-Title': 'EbookStudio' }
      : { 'Lovable-API-Key': LOVABLE_API_KEY!, 'Content-Type': 'application/json' };
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
