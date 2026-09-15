// Propose une consigne visuelle (prompt image) à partir de la description du
// livre. Analyse de TEXTE uniquement : aucune image générée, aucun crédit
// `cover_pro_credits` débité, aucune écriture en base.
import { authenticate, corsHeaders, json } from "../_shared/coverPro.ts";
import { buildVisualPrompt } from "../_shared/visualPrompt.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const user = await authenticate(req);
    if (!user) return json({ error: "Non authentifié" }, 401);

    const body = await req.json().catch(() => ({}));
    const visualPrompt = await buildVisualPrompt({
      summary: typeof body?.summary === "string" ? body.summary : "",
      genre: typeof body?.genre === "string" ? body.genre : "",
      mood: typeof body?.mood === "string" ? body.mood : "",
      palette: typeof body?.palette === "string" ? body.palette : "",
      bookTitle: typeof body?.bookTitle === "string" ? body.bookTitle : "",
      subtitle: typeof body?.subtitle === "string" ? body.subtitle : "",
      targetAudience: typeof body?.targetAudience === "string" ? body.targetAudience : "",
      era: typeof body?.era === "string" ? body.era : "",
      location: typeof body?.location === "string" ? body.location : "",
      focalSubject: typeof body?.focalSubject === "string" ? body.focalSubject : "",
      emotion: typeof body?.emotion === "string" ? body.emotion : "",
      symbol: typeof body?.symbol === "string" ? body.symbol : "",
      include: typeof body?.include === "string" ? body.include : "",
      avoid: typeof body?.avoid === "string" ? body.avoid : "",
    });

    if (!visualPrompt) {
      return json(
        { error: "Description trop courte ou analyse indisponible. Détaillez la scène souhaitée." },
        422,
      );
    }
    return json({ visualPrompt });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inattendue";
    return json({ error: message }, 500);
  }
});
