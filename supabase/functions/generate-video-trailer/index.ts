import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, aspectRatio, duration, ebookTitle, clipType } = await req.json();

    if (!prompt || !ebookTitle) {
      return new Response(
        JSON.stringify({ error: "prompt and ebookTitle are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Video trailer request:", { prompt, aspectRatio, duration, ebookTitle, clipType });

    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    // Build enhanced prompt for book trailer
    const enhancedPrompt = buildTrailerPrompt(prompt, ebookTitle, clipType);
    
    // Map aspect ratio to video dimensions
    const dimensions = getVideoDimensions(aspectRatio);

    console.log("Generating video with prompt:", enhancedPrompt);
    console.log("Dimensions:", dimensions, "Duration:", duration);

    // Call Lovable AI Video Generation API
    const response = await fetch("https://api.lovable.dev/v1/videos", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: enhancedPrompt,
        aspect_ratio: aspectRatio,
        duration: duration || 5,
        resolution: "1080p",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Lovable API error:", errorText);
      throw new Error(`Video generation failed: ${response.status}`);
    }

    const result = await response.json();
    console.log("Video generated successfully:", result);

    return new Response(
      JSON.stringify({ 
        success: true,
        videoUrl: result.url || result.video_url,
        status: "completed",
        metadata: {
          prompt: enhancedPrompt,
          aspectRatio,
          duration,
          ebookTitle,
          clipType
        }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Video trailer generation error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function buildTrailerPrompt(basePrompt: string, ebookTitle: string, clipType: string): string {
  const styleGuides: Record<string, string> = {
    teaser: `Cinematic book trailer with dark, mysterious atmosphere. Text "${ebookTitle}" emerges from shadows with dramatic lighting. Slow camera movement, suspenseful mood, professional book promotion style. Ultra high quality, 4K cinematic.`,
    highlights: `Dynamic book trailer with bright, energetic visuals. Bold typography showing "${ebookTitle}". Fast cuts, inspiring mood, motivational feel. Professional marketing video quality.`,
    cta: `Compelling book advertisement with eye-catching visuals. "${ebookTitle}" prominently displayed with urgent, exciting atmosphere. Strong call-to-action energy, professional marketing style.`,
    mystery: `Atmospheric book teaser with ethereal, dreamlike visuals. Soft particles and light rays with "${ebookTitle}" appearing elegantly. Immersive artistic cinematography, high production value.`
  };

  if (basePrompt && basePrompt.trim().length > 0) {
    return `${basePrompt}. Book title: "${ebookTitle}". Ultra high resolution, professional cinematic quality.`;
  }

  return styleGuides[clipType] || styleGuides.teaser;
}

function getVideoDimensions(aspectRatio: string): { width: number; height: number } {
  const dimensions: Record<string, { width: number; height: number }> = {
    "16:9": { width: 1920, height: 1080 },
    "9:16": { width: 1080, height: 1920 },
    "1:1": { width: 1080, height: 1080 },
  };
  return dimensions[aspectRatio] || dimensions["16:9"];
}
