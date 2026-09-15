// Déduit les détails visuels d'un livre (public, époque, lieu, sujet central,
// émotion, éléments à inclure/éviter) à partir du titre et du synopsis.
//
// Analyse de TEXTE uniquement : aucune image générée, aucun crédit
// `cover_pro_credits` débité, aucune écriture en base.
import { authenticate, corsHeaders, json } from "../_shared/coverPro.ts";

const MODEL = "google/gemini-3.6-flash";
const KEYS = [
  "targetAudience",
  "era",
  "location",
  "focalSubject",
  "emotion",
  "mustInclude",
  "mustAvoid",
] as const;

const str = (value: unknown): string => {
  if (typeof value === "string") return value.trim().slice(0, 200);
  if (Array.isArray(value)) return value.map((v) => str(v)).filter(Boolean).join(", ").slice(0, 200);
  if (value && typeof value === "object") {
    return Object.values(value as Record<string, unknown>).map((v) => str(v)).filter(Boolean).join(", ").slice(0, 200);
  }
  return "";
};

/** Récupère une clé quel que soit son emballage (details, data, casse). */
function pick(source: Record<string, unknown>, key: string): string {
  const direct = str(source[key]);
  if (direct) return direct;
  for (const value of Object.values(source)) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      const nested = str((value as Record<string, unknown>)[key]);
      if (nested) return nested;
    }
  }
  return "";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const user = await authenticate(req);
    if (!user) return json({ error: "Non authentifié" }, 401);

    const body = await req.json().catch(() => ({}));
    const synopsis = str(typeof body?.synopsis === "string" ? body.synopsis.slice(0, 6000) : "");
    if (synopsis.length < 20) {
      return json({ error: "Ajoutez un synopsis un peu plus détaillé (20 caractères minimum)." }, 400);
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) return json({ error: "Passerelle IA non configurée." }, 500);

    const context = [
      body?.title ? `Titre : ${str(body.title)}` : "",
      body?.subtitle ? `Sous-titre : ${str(body.subtitle)}` : "",
      body?.genre ? `Genre : ${str(body.genre)}` : "",
      `Synopsis : ${typeof body?.synopsis === "string" ? body.synopsis.slice(0, 6000) : ""}`,
    ].filter(Boolean).join("\n");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 900,
        
        messages: [
          {
            role: "system",
            content:
              "Tu es directeur artistique dans une maison d'édition française. À partir du titre et " +
              "du synopsis d'un livre, tu déduis les informations utiles à l'illustration de sa " +
              "couverture. Réponds uniquement en JSON valide, entièrement en français, sans latin " +
              "ni mots inventés, avec exactement ces clés : targetAudience, era, location, " +
              "focalSubject, emotion, mustInclude, mustAvoid. Chaque valeur est une phrase très " +
              "courte (2 à 10 mots). Reste strictement fidèle au synopsis : n'invente aucun " +
              "personnage, lieu ni époque absents. mustAvoid doit toujours interdire le texte et " +
              "les logos dans l'image.",
          },
          { role: "user", content: context },
        ],
      }),
    });

    if (!res.ok) {
      if (res.status === 429) return json({ error: "Trop de demandes, réessayez dans un instant." }, 429);
      if (res.status === 402) return json({ error: "Crédits IA épuisés sur l'espace de travail." }, 402);
      return json({ error: `Analyse indisponible (${res.status}).` }, 502);
    }

    const payload = await res.json();
    const raw: string = payload?.choices?.[0]?.message?.content ?? "";
    const cleaned = raw.replace(/```json|```/g, "").trim();
    let parsed: Record<string, unknown> = {};
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          parsed = JSON.parse(match[0]);
        } catch {
          parsed = {};
        }
      }
    }

    const details: Record<string, string> = {};
    for (const key of KEYS) details[key] = pick(parsed, key);

    // Repli ligne par ligne si le modèle a répondu en texte simple.
    if (!Object.values(details).some(Boolean) && cleaned) {
      const labels: Record<string, RegExp> = {
        targetAudience: /(targetAudience|lecteurs?|public)/i,
        era: /(era|époque|epoque)/i,
        location: /(location|lieu)/i,
        focalSubject: /(focalSubject|sujet|personnage)/i,
        emotion: /(emotion|émotion)/i,
        mustInclude: /(mustInclude|obligatoire|inclure)/i,
        mustAvoid: /(mustAvoid|interdit|éviter|eviter)/i,
      };
      for (const line of cleaned.split(/\n+/)) {
        const parts = line.split(/\s*[:：]\s*/);
        if (parts.length < 2) continue;
        const value = str(parts.slice(1).join(": ").replace(/^["'“]|["'”],?$/g, ""));
        if (!value) continue;
        for (const key of KEYS) {
          if (!details[key] && labels[key].test(parts[0])) details[key] = value;
        }
      }
    }

    if (!Object.values(details).some(Boolean)) {
      return json({ error: "Analyse illisible, réessayez dans un instant." }, 502);
    }
    if (!details.mustAvoid) details.mustAvoid = "Aucun texte ni logo dans l'image";

    return json({ details });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inattendue";
    return json({ error: message }, 500);
  }
});
