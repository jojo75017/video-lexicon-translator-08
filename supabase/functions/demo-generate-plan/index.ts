import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// SECURITY: Simple in-memory rate limiting (5 requests per hour per IP)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 5; // max 5 demo generations per hour

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  // Clean up old entries periodically
  if (rateLimitStore.size > 10000) {
    for (const [key, value] of rateLimitStore.entries()) {
      if (value.resetTime < now) {
        rateLimitStore.delete(key);
      }
    }
  }

  if (!record || record.resetTime < now) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX - record.count };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // SECURITY: Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    
    const { allowed, remaining } = checkRateLimit(clientIP);
    
    if (!allowed) {
      console.warn(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ 
          error: "Limite de génération démo atteinte (5/heure). Passez à la version complète pour des générations illimitées." 
        }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": new Date(Date.now() + RATE_LIMIT_WINDOW).toISOString()
          } 
        }
      );
    }

    const { title, genre, targetAudience, numberOfChapters } = await req.json();

    // SECURITY: Validate inputs
    if (!title || typeof title !== 'string') {
      return new Response(
        JSON.stringify({ error: "Le titre est requis" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (title.length > 200) {
      return new Response(
        JSON.stringify({ error: "Le titre est trop long (max 200 caractères)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const chaptersCount = Math.min(Math.max(Number(numberOfChapters) || 5, 3), 10);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const prompt = `Génère un plan détaillé pour un ebook avec les informations suivantes:
- Titre: ${title.substring(0, 200)}
- Genre: ${(genre || "Non spécifié").substring(0, 50)}
- Public cible: ${(targetAudience || "Grand public").substring(0, 100)}
- Nombre de chapitres: ${chaptersCount}

Le plan doit inclure:
1. Un résumé accrocheur de l'ebook (2-3 phrases)
2. Les ${chaptersCount} chapitres avec:
   - Un titre de chapitre engageant
   - 3-4 sous-sections par chapitre
   - Une brève description de ce que chaque chapitre couvrira

Format le plan de manière claire et professionnelle. Réponds en français.`;

    console.log(`Demo plan generation for: "${title}" (IP: ${clientIP}, remaining: ${remaining})`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "Tu es un expert en création de contenu et en structuration d'ebooks. Tu génères des plans d'ebooks professionnels et bien structurés. Réponds toujours en français.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Service temporairement surchargé, réessayez plus tard" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporairement indisponible" }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const plan = data.choices?.[0]?.message?.content;

    if (!plan) {
      throw new Error("Aucune réponse de l'IA");
    }

    return new Response(
      JSON.stringify({ plan }),
      { 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json",
          "X-RateLimit-Remaining": String(remaining)
        } 
      }
    );
  } catch (error) {
    console.error("Error in demo-generate-plan:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erreur inconnue" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
