/**
 * Brief de couverture proposé par IA (analyse de texte uniquement).
 *
 * - authentification obligatoire (`supabase.auth.getUser()`) ;
 * - lecture d'un livre de l'utilisateur (`ebook_projects` puis `book_projects`)
 *   ou d'un résumé libre fourni par l'utilisateur ;
 * - aucune génération d'image ici, aucun crédit `cover_pro_credits` débité :
 *   la génération d'illustration reste exclusivement dans `cover-pro-generate`.
 */
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const MODEL = "google/gemini-3.6-flash";
const MAX_INPUT = 8000;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2.49.4");
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } } },
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return json({ error: "Non authentifié" }, 401);

    const body = await req.json().catch(() => ({}));
    const sourceKind = typeof body?.sourceKind === "string" ? body.sourceKind : "manual";
    const bookId = typeof body?.bookId === "string" ? body.bookId : null;
    let context = typeof body?.text === "string" ? body.text : "";
    let bookTitle = typeof body?.title === "string" ? body.title : "";
    let author = "";

    if (sourceKind === "ebook" && bookId) {
      const { data } = await supabase
        .from("ebook_projects")
        .select("title, author_name, book_summary, target_audience, tone, writing_style")
        .eq("id", bookId)
        .maybeSingle();
      if (!data) return json({ error: "Livre introuvable ou non autorisé." }, 403);
      bookTitle = data.title ?? bookTitle;
      author = data.author_name ?? "";
      context = [
        `Titre : ${data.title ?? ""}`,
        `Résumé : ${data.book_summary ?? ""}`,
        `Public visé : ${data.target_audience ?? ""}`,
        `Ton : ${data.tone ?? ""}`,
        `Style : ${data.writing_style ?? ""}`,
      ].join("\n");
    } else if (sourceKind === "book" && bookId) {
      const { data } = await supabase
        .from("book_projects")
        .select("title, subtitle, genre, target_audience, tone, era, places")
        .eq("id", bookId)
        .maybeSingle();
      if (!data) return json({ error: "Livre introuvable ou non autorisé." }, 403);
      bookTitle = data.title ?? bookTitle;
      context = [
        `Titre : ${data.title ?? ""}`,
        `Sous-titre : ${data.subtitle ?? ""}`,
        `Genre : ${data.genre ?? ""}`,
        `Public visé : ${data.target_audience ?? ""}`,
        `Ton : ${data.tone ?? ""}`,
        `Époque : ${data.era ?? ""}`,
        `Lieux : ${Array.isArray(data.places) ? data.places.join(", ") : (data.places ?? "")}`,
      ].join("\n");
    }

    context = context.slice(0, MAX_INPUT).trim();
    if (!context) return json({ error: "Aucune information exploitable pour ce livre." }, 400);

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) return json({ error: "Passerelle IA non configurée." }, 500);

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 2500,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "Tu es directeur artistique d'une maison d'édition française. Tu proposes un brief " +
              "d'illustration de couverture, SANS AUCUN TEXTE dans l'image. Réponds uniquement en " +
              "JSON valide, entièrement en français, sans latin ni mots inventés, avec les clés : " +
              "genre, mood, palette, scene, style, include, avoid, templateGenre. " +
              "templateGenre doit valoir exactement l'une de ces valeurs : roman, thriller, " +
              "romance, fantasy, developpement, guide, business, jeunesse, cuisine, biographie.",
          },
          { role: "user", content: context },
        ],
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      if (res.status === 429) return json({ error: "Trop de demandes, réessayez dans un instant." }, 429);
      if (res.status === 402) return json({ error: "Crédits IA épuisés sur l'espace de travail." }, 402);
      return json({ error: `Analyse indisponible (${res.status}). ${detail.slice(0, 200)}` }, 502);
    }

    const payload = await res.json();
    const raw: string = payload?.choices?.[0]?.message?.content ?? "";
    const cleaned = raw.replace(/```json|```/g, "").trim();
    let brief: Record<string, unknown> = {};
    try {
      brief = JSON.parse(cleaned);
    } catch {
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (match) brief = JSON.parse(match[0]);
    }
    if (!brief || typeof brief !== "object") {
      return json({ error: "Brief illisible, réessayez." }, 502);
    }

    return json({ brief, bookTitle, author });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inattendue";
    return json({ error: message }, 500);
  }
});
