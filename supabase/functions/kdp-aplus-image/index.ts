import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3.24.2";

const MODEL = "openai/gpt-image-2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const BodySchema = z.object({
  bookTitle: z.string().trim().min(1).max(300),
  moduleTitle: z.string().trim().min(1).max(300),
  moduleText: z.string().trim().min(1).max(4000),
  visualSuggestion: z.string().trim().min(1).max(1200),
  width: z.number().int().min(150).max(970),
  height: z.number().int().min(180).max(600),
  bookContext: z.string().trim().max(2000).optional(),
  coverImage: z.string().trim().max(8_000_000).optional(),
  stream: z.boolean().default(true),
});

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Méthode non autorisée." }, 405);

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Connectez-vous pour créer une image A+." }, 401);

    const client = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } },
    );
    const token = authHeader.replace(/^Bearer\s+/i, "");
    const { data: { user }, error: authError } = await client.auth.getUser(token);
    if (authError || !user) return json({ error: "Votre session a expiré. Reconnectez-vous." }, 401);

    const parsed = BodySchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return json({ error: "Les informations du module A+ sont incomplètes ou invalides." }, 400);
    }

    const key = Deno.env.get("LOVABLE_API_KEY");
    if (!key) return json({ error: "La création d’images IA n’est pas configurée." }, 500);

    const { bookTitle, moduleTitle, moduleText, visualSuggestion, width, height, stream, bookContext, coverImage } = parsed.data;
    const landscape = width >= height;
    const size = width === height ? "1024x1024" : landscape ? "1536x1024" : "1024x1536";
    const prompt = [
      "Crée une image éditoriale professionnelle destinée à un module Amazon KDP A+ pour un livre réellement publié.",
      `Livre : « ${bookTitle} ».`,
      `Module : « ${moduleTitle} ».`,
      `Idée du module : ${moduleText.slice(0, 1800)}.`,
      `Scène visuelle demandée : ${visualSuggestion}.`,
      ...(bookContext ? [`Contexte du livre (genre, sujet, public) : ${bookContext.slice(0, 1200)}.`] : []),
      ...(coverImage
        ? [
            "Une image de référence est fournie : c’est la couverture du livre. L’image A+ doit appartenir au même univers visuel que cette couverture : mêmes couleurs dominantes, même ambiance lumineuse, même style graphique, mêmes sujets et mêmes personnages s’il y en a.",
            "Ne reproduis jamais la couverture telle quelle, ne recopie aucun de ses textes ni son titre : crée une nouvelle scène cohérente avec elle.",
          ]
        : []),
      `Composition prévue pour un recadrage final exact en ${width} × ${height} pixels (${landscape ? "horizontal" : "vertical"}).`,
      "Rendu photoréaliste ou illustration éditoriale premium selon le sujet, lumineux, net, équilibré, digne d’une grande maison d’édition.",
      "Le sujet essentiel doit rester au centre et conserver des marges sûres pour le recadrage.",
      "AUCUN texte dans l’image, aucune lettre, aucun chiffre, aucun titre, aucun logo, aucune marque Amazon, aucun prix, aucune promotion, aucun avis client, aucune étoile, aucune URL, aucun QR code, aucun filigrane, aucune signature.",
      "Aucun cadre, bouton, faux écran, encart publicitaire ou bandeau sombre. Image seule, jusqu’aux bords.",
    ].join("\n");

    const baseHeaders = {
      "Lovable-API-Key": key,
      "X-Lovable-AIG-SDK": "edge-function-direct",
    };

    let upstream: Response;
    if (coverImage) {
      const match = /^data:(image\/[a-zA-Z+]+);base64,(.+)$/.exec(coverImage);
      if (!match) return json({ error: "La couverture de référence est illisible. Renvoyez un fichier JPG ou PNG." }, 400);
      const bytes = Uint8Array.from(atob(match[2]), (c) => c.charCodeAt(0));
      const form = new FormData();
      form.append("model", MODEL);
      form.append("prompt", prompt);
      form.append("size", size);
      form.append("quality", "high");
      form.append("background", "opaque");
      form.append("image", new Blob([bytes], { type: match[1] }), "couverture.png");
      upstream = await fetch("https://ai.gateway.lovable.dev/v1/images/edits", {
        method: "POST",
        headers: baseHeaders,
        body: form,
      });
    } else {
      upstream = await fetch("https://ai.gateway.lovable.dev/v1/images/generations", {
        method: "POST",
        headers: { ...baseHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: MODEL,
          prompt,
          size,
          quality: "high",
          background: "opaque",
          ...(stream ? { stream: true, partial_images: 1 } : {}),
        }),
      });
    }

    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        ...corsHeaders,
        "Content-Type": upstream.headers.get("Content-Type") ?? "application/json",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Création de l’image impossible.";
    console.error("kdp-aplus-image:", message);
    return json({ error: message }, 500);
  }
});