// Traduction d'une description de livre en consigne visuelle exploitable par le
// générateur d'images. Analyse de TEXTE uniquement : aucun crédit image, aucune
// écriture en base. Utilisé par `cover-visual-prompt` (proposition affichée à
// l'abonné) et par `cover-pro-generate` (repli automatique).

const MODEL = "google/gemini-3.6-flash";

export interface VisualPromptInput {
  summary?: string;
  genre?: string;
  mood?: string;
  palette?: string;
  bookTitle?: string;
  subtitle?: string;
}

const clean = (v?: string) => (typeof v === "string" ? v.trim() : "");

/**
 * Renvoie une consigne visuelle en français (sujet, décor, époque, action,
 * cadrage, lumière, palette) ou `null` si l'analyse n'est pas possible.
 * Ne lève jamais : l'appelant retombe alors sur la description brute.
 */
export async function buildVisualPrompt(input: VisualPromptInput): Promise<string | null> {
  const summary = clean(input.summary);
  if (summary.length < 12) return null;

  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) return null;

  const context = [
    input.bookTitle ? `Titre : ${clean(input.bookTitle)}` : "",
    input.subtitle ? `Sous-titre : ${clean(input.subtitle)}` : "",
    input.genre ? `Genre : ${clean(input.genre)}` : "",
    input.mood ? `Ambiance : ${clean(input.mood)}` : "",
    input.palette ? `Palette : ${clean(input.palette)}` : "",
    `Description fournie par l'auteur : ${summary}`,
  ]
    .filter(Boolean)
    .join("\n")
    .slice(0, 6000);

  try {
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 700,
        messages: [
          {
            role: "system",
            content:
              "Tu es directeur artistique dans une maison d'édition française. À partir des " +
              "informations d'un livre, tu écris UNE SEULE consigne visuelle en français, de 60 à " +
              "120 mots, décrivant précisément l'illustration de couverture à produire : sujet " +
              "principal, décor, époque, action ou instant choisi, cadrage, angle, lumière, " +
              "matières, palette. Reste strictement fidèle à la description de l'auteur : " +
              "n'invente aucun élément d'histoire absent. Interdits dans ta réponse : listes, " +
              "titres, guillemets, mentions de texte, de titre, de logo ou de typographie, mots " +
              "latins ou inventés. Réponds uniquement par la consigne visuelle.",
          },
          { role: "user", content: context },
        ],
      }),
    });

    if (!res.ok) return null;
    const payload = await res.json();
    const text: string = payload?.choices?.[0]?.message?.content ?? "";
    const result = text.replace(/```/g, "").replace(/\s+/g, " ").trim();
    return result.length >= 40 ? result.slice(0, 1200) : null;
  } catch {
    return null;
  }
}
