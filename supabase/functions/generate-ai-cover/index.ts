import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Format-specific guidance for the image model
const FORMAT_PROMPTS: Record<string, string> = {
  kindle: `KINDLE eBOOK COVER FORMAT.
- Single FRONT cover only, vertical portrait orientation, aspect ratio 1.6:1 (width:height = 1:1.6, e.g. 1600x2560 px).
- Composition fully framed for a thumbnail visible at small sizes on Amazon Kindle store.
- Title must be HUGE, bold, perfectly centered horizontally, instantly readable even at 200px wide.
- Author name clearly visible at the bottom.
- NO spine, NO back cover, NO wrap-around — only the front face.
- Margins safe: keep important elements 8% away from each edge.`,

  paperback: `AMAZON KDP PAPERBACK FULL WRAP COVER.
- ONE single continuous landscape image containing in this exact order from LEFT to RIGHT:
  1) BACK COVER (4ème de couverture) on the left third — leave a clean rectangular zone of about 5cm x 3cm in the BOTTOM-RIGHT of this back panel for the ISBN barcode (do not place any text or critical art there).
  2) SPINE in the center — narrow vertical strip with the title written vertically (top to bottom) plus author name. Keep all spine text at least 3mm away from the spine edges.
  3) FRONT COVER on the right third — full hero design with title big and centered, author name at bottom.
- The three panels must share ONE consistent visual universe: same colors, same lighting, same typography family. The artwork should flow naturally across the spine.
- Landscape orientation, wide aspect (roughly 1.6:1 to 1.7:1 in landscape).
- Add a 3mm safe bleed margin around the entire wrap.`,
};

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
      format = 'kindle', // 'kindle' | 'paperback'
      kdpBrief = '',     // optional technical brief from KDP calculator
      referenceImage,    // optional data URL or https URL of an inspiration cover
    } = body;

    if (!title) {
      return new Response(JSON.stringify({ error: "Titre requis" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY non configurée");

    const formatGuidance = FORMAT_PROMPTS[format] || FORMAT_PROMPTS.kindle;

    const textPrompt = `You are an award-winning book-cover art director.
Create a PROFESSIONAL Amazon best-seller quality book cover.

=== BOOK ===
Title: "${title}"
Author: "${author || 'Author'}"
Genre: ${genre || 'non-fiction'}

=== ART DIRECTION ===
Style: ${style || 'professional'}
Color palette: ${colorScheme || 'modern and elegant, high contrast'}
${description ? `Concept: ${description}` : ''}

=== FORMAT ===
${formatGuidance}

=== KDP TECHNICAL SPECS ===
${kdpBrief || 'Standard KDP cover, 300 DPI, photorealistic, print-ready quality.'}

=== QUALITY BAR ===
- Photorealistic, magazine-grade, ZERO cartoonish or low-fidelity rendering.
- Title typography must be perfectly legible — clean, sharp, no warped letters, no fake glyphs.
- Author name perfectly legible.
- Inspired by current Amazon top 100 best-sellers in the genre.
- No watermarks, no logos, no UI mockups, no Amazon badges.
${referenceImage ? '- Use the attached reference image ONLY for stylistic inspiration (mood, palette, composition). Do NOT copy it.' : ''}`;

    const userContent: any[] = [{ type: "text", text: textPrompt }];
    if (referenceImage && typeof referenceImage === 'string' && referenceImage.length < 6_000_000) {
      userContent.push({ type: "image_url", image_url: { url: referenceImage } });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-pro-image-preview",
        messages: [{ role: "user", content: userContent }],
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

    return new Response(JSON.stringify({ imageUrl, description: textResponse, format }), {
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
