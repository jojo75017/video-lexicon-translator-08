import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { title, author, genre, style, colorScheme, description } = await req.json();
    if (!title) return new Response(JSON.stringify({ error: "Titre requis" }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY non configurée");

    const prompt = `Create a professional Amazon KDP book cover for:
Title: "${title}"
Author: "${author || 'Author'}"
Genre: ${genre || 'non-fiction'}
Style: ${style || 'professional'}
Color scheme: ${colorScheme || 'modern and elegant'}
${description ? `Additional details: ${description}` : ''}

Requirements:
- Professional book cover design suitable for Amazon KDP
- Title "${title}" prominently displayed with elegant typography
- Author name "${author || 'Author'}" at the bottom
- High contrast, readable text
- ${style || 'Professional'} aesthetic
- No watermarks or logos
- Portrait orientation (book cover ratio)
- Photorealistic quality, magazine-grade design`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-pro-image-preview",
        messages: [{ role: "user", content: prompt }],
        modalities: ["image", "text"]
      })
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) return new Response(JSON.stringify({ error: "Limite atteinte, réessayez" }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      if (status === 402) return new Response(JSON.stringify({ error: "Crédits insuffisants" }), { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      const t = await response.text();
      console.error("AI gateway error:", status, t);
      throw new Error(`Erreur génération: ${status}`);
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    const textResponse = data.choices?.[0]?.message?.content || "";

    if (!imageUrl) throw new Error("Aucune image générée");

    return new Response(JSON.stringify({ imageUrl, description: textResponse }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message || "Erreur" }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
