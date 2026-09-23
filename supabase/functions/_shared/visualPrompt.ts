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
  targetAudience?: string;
  era?: string;
  location?: string;
  focalSubject?: string;
  emotion?: string;
  symbol?: string;
  include?: string;
  avoid?: string;
}

const clean = (v?: string) => (typeof v === "string" ? v.trim() : "");

function buildFaithfulFallback(input: VisualPromptInput): string {
  const subject = clean(input.focalSubject) || "le sujet principal décrit dans le synopsis";
  const setting = [clean(input.location), clean(input.era)].filter(Boolean).join(", ");
  const details = [
    setting ? `dans ${setting}` : "dans le décor exact décrit par l'auteur",
    clean(input.symbol) ? `avec ${clean(input.symbol)} intégré naturellement` : "",
    clean(input.include) ? `Les éléments obligatoires sont : ${clean(input.include)}.` : "",
    clean(input.emotion) ? `L'image doit provoquer ${clean(input.emotion)}.` : "",
    clean(input.palette) ? `Palette : ${clean(input.palette)}.` : "",
    clean(input.avoid) ? `Ne pas représenter : ${clean(input.avoid)}.` : "",
  ].filter(Boolean).join(" ");
  return `Composition verticale de couverture centrée sur ${subject}, ${details} Cadrage éditorial précis, profondeur naturelle, lumière cohérente et point focal immédiatement identifiable. Rendu photoréaliste ou pictural haut de gamme selon le genre, anatomie crédible, matières détaillées, sans texte, logo, cadre, bandeau, cartouche ni zone sombre ajoutée. Rester strictement fidèle au synopsis, sans inventer de personnage, de lieu, d'époque, d'objet ou d'événement absent.`;
}

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
    input.targetAudience ? `Lecteurs visés : ${clean(input.targetAudience)}` : "",
    input.era ? `Époque : ${clean(input.era)}` : "",
    input.location ? `Lieu : ${clean(input.location)}` : "",
    input.focalSubject ? `Sujet principal demandé : ${clean(input.focalSubject)}` : "",
    input.emotion ? `Émotion à provoquer : ${clean(input.emotion)}` : "",
    input.symbol ? `Symbole important : ${clean(input.symbol)}` : "",
    input.include ? `Éléments obligatoires : ${clean(input.include)}` : "",
    input.avoid ? `Éléments interdits : ${clean(input.avoid)}` : "",
    `Description fournie par l'auteur : ${summary}`,
  ]
    .filter(Boolean)
    .join("\n")
    .slice(0, 6000);

  try {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1600,
        messages: [
          {
            role: "system",
            content:
              "Tu es directeur artistique dans une maison d'édition française. À partir des " +
              "informations d'un livre, tu rédiges UN SEUL brief visuel en français, de 200 à 300 " +
              "mots, en texte continu, décrivant précisément l'illustration de couverture à " +
              "produire. Développe successivement, sans écrire aucun intitulé de rubrique : la " +
              "scène clé et le sujet focal (personnages, posture, action, regard, vêtements) ; le " +
              "décor, l'époque et l'arrière-plan avec leurs détails d'architecture ou de nature ; " +
              "l'éclairage et l'ambiance (source de lumière, contrastes, ombres portées) ; la " +
              "palette chromatique et les matières (textures, reflets, harmonies) ; enfin le " +
              "cadrage vertical, l'angle et la profondeur de champ. Reste strictement fidèle à la " +
              "description de l'auteur : n'invente aucun personnage, lieu, époque, objet ou " +
              "événement absent. Respecte mot pour mot les éléments obligatoires et interdits. " +
              "Interdits dans ta réponse : listes, puces, titres, guillemets, mentions de texte, " +
              "de titre, de logo ou de typographie, mots latins ou inventés. Réponds uniquement " +
              "par le brief visuel.",
          },
          {
            role: "user",
            content:
              context +
              (attempt === 0
                ? ""
                : "\n\nLa réponse précédente était trop courte. Écris cette fois un brief complet de 200 à 300 mots, terminé par un point."),
          },
        ],
      }),
      });

      if (!res.ok) return null;
      const payload = await res.json();
      const text: string = payload?.choices?.[0]?.message?.content ?? "";
      const result = text.replace(/```/g, "").replace(/\s+/g, " ").trim();
      const wordCount = result.split(/\s+/).filter(Boolean).length;
      if (wordCount >= 45 && /[.!?]$/.test(result)) return result.slice(0, 1200);
    }
    return buildFaithfulFallback(input);
  } catch {
    return buildFaithfulFallback(input);
  }
}
