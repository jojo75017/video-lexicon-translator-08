// Générateur de livres de jeux & énigmes (Puzzle / Activity Books KDP).
// Génère un lot de puzzles structurés (titre, contexte, énoncé, indices, solution).
// BYOK Gemini prioritaire (clé abonné), sinon repli sur Lovable AI.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PUZZLE_TYPES: Record<string, string> = {
  "enigmes-policieres":
    "Énigmes policières : mini-enquêtes où le lecteur doit identifier le coupable, l'arme ou le mobile à partir d'indices disséminés dans l'énoncé.",
  "chasses-tresor":
    "Chasses au trésor textuelles : suite d'énigmes à résoudre pas à pas, chaque solution débloque l'étape suivante.",
  "logique-narrative":
    "Jeux de logique narrative : situations présentées comme une histoire avec des contraintes ; le lecteur déduit la seule solution possible (qui fait quoi, ordre des événements, etc.).",
  "thematiques":
    "Puzzles thématiques : énigmes variées (devinettes, anagrammes, suites logiques, codes simples) toutes liées au thème choisi.",
};

const DIFFICULTIES: Record<string, string> = {
  facile: "Facile : accessible à tous, solution trouvable en quelques minutes, indices très guidants.",
  moyen: "Moyen : demande de la réflexion, pièges légers, indices utiles mais non révélateurs.",
  difficile: "Difficile : pour amateurs de casse-têtes, raisonnement en plusieurs étapes, indices subtils.",
};

function sanitizeApiKey(k: string): string {
  return String(k || "").trim().replace(/[^\x20-\x7E]/g, "");
}
function isValidGeminiKey(k: string): boolean {
  return /^AIza[A-Za-z0-9._-]{20,}$/.test(k);
}

async function callGemini(prompt: string, apiKey: string, maxTokens: number) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${encodeURIComponent(sanitizeApiKey(apiKey))}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json", temperature: 0.8, maxOutputTokens: maxTokens },
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error("Gemini error:", res.status, text.slice(0, 400));
    return { ok: false as const, status: res.status };
  }
  const data = await res.json();
  return { ok: true as const, text: data?.candidates?.[0]?.content?.parts?.[0]?.text || "" };
}

async function callLovableAI(prompt: string, maxTokens: number) {
  const key = Deno.env.get("LOVABLE_API_KEY");
  if (!key) return { ok: false as const, status: 500 };
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Lovable-API-Key": key,
      "X-Lovable-AIG-SDK": "edge-function-direct",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3.6-flash",
      messages: [
        { role: "system", content: "Tu réponds uniquement en JSON valide, sans markdown." },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: maxTokens,
    }),
  });
  const text = await res.text();
  if (!res.ok) {
    console.error("Lovable AI error:", res.status, text.slice(0, 400));
    return { ok: false as const, status: res.status };
  }
  try {
    const data = JSON.parse(text);
    return { ok: true as const, text: data?.choices?.[0]?.message?.content || "" };
  } catch {
    return { ok: true as const, text };
  }
}

function parseJson(raw: string): any {
  try {
    return JSON.parse(raw);
  } catch {
    const m = raw.match(/\{[\s\S]*\}/);
    if (m) {
      try { return JSON.parse(m[0]); } catch { /* noop */ }
    }
    return null;
  }
}

const FR_RULE = `RÈGLE ABSOLUE DE LANGUE : tout est rédigé en français courant.
INTERDIT : latin, faux latin, langues mortes, pseudo-langues, mots inventés, mots étrangers décoratifs.
Seules exceptions : noms propres réels.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const puzzleType = String(body.puzzleType || "thematiques");
    const theme = String(body.theme || "").trim().slice(0, 200);
    const difficulty = String(body.difficulty || "moyen");
    const language = body.language === "en" ? "en" : "fr";
    const startIndex = Math.max(0, parseInt(body.startIndex) || 0);
    const count = Math.min(Math.max(parseInt(body.count) || 5, 1), 5);
    const geminiApiKey = typeof body.geminiApiKey === "string" ? body.geminiApiKey : "";

    if (!theme) {
      return new Response(JSON.stringify({ error: "Le thème est requis" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const typeDesc = PUZZLE_TYPES[puzzleType] || PUZZLE_TYPES["thematiques"];
    const diffDesc = DIFFICULTIES[difficulty] || DIFFICULTIES["moyen"];
    const langRule = language === "en"
      ? "LANGUAGE RULE: write EVERYTHING in natural, fluent English."
      : FR_RULE;

    const prompt = `Tu es un auteur professionnel de livres de jeux et d'énigmes publiés sur Amazon KDP.

TYPE DE PUZZLE : ${typeDesc}
THÈME / NICHE : ${theme}
NIVEAU : ${diffDesc}

${langRule}

Génère EXACTEMENT ${count} puzzles numérotés de ${startIndex + 1} à ${startIndex + count}.
Chaque puzzle DOIT être unique, autocontenu et directement publiable.

Réponds UNIQUEMENT avec un JSON valide de cette forme exacte :
{
  "puzzles": [
    {
      "titre": "Titre accrocheur de l'énigme",
      "contexte": "Mise en situation immersive en 2 à 4 phrases.",
      "enonce": "Le défi précis posé au lecteur, formulé clairement.",
      "indices": ["Indice 1 (léger)", "Indice 2 (plus orienté)", "Indice 3 (presque révélateur)"],
      "solution": "Solution détaillée en 3 à 6 phrases, avec l'explication du raisonnement."
    }
  ]
}

Contraintes :
- 1 à 3 indices par puzzle, du plus subtil au plus explicite.
- La solution ne doit JAMAIS apparaître dans l'énoncé ou les indices.
- Vérifie que chaque solution est cohérente avec son énoncé.
- Aucun texte hors du JSON.`;

    const maxTokens = 6000;
    let result: { ok: boolean; status: number; text?: string } = { ok: false, status: 500 };

    if (isValidGeminiKey(geminiApiKey)) {
      result = await callGemini(prompt, geminiApiKey, maxTokens);
      if (!result.ok) console.log("BYOK Gemini failed, fallback to Lovable AI:", result.status);
    }
    if (!result.ok) {
      result = await callLovableAI(prompt, maxTokens);
    }
    if (!result.ok || !result.text) {
      return new Response(JSON.stringify({ error: "Génération IA indisponible", status: result.status }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const parsed = parseJson(result.text);
    const rawPuzzles = Array.isArray(parsed?.puzzles) ? parsed.puzzles : null;
    if (!rawPuzzles || rawPuzzles.length === 0) {
      return new Response(JSON.stringify({ error: "Réponse IA invalide" }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const puzzles = rawPuzzles.slice(0, count).map((p: any, i: number) => ({
      numero: startIndex + i + 1,
      titre: String(p?.titre || `Énigme ${startIndex + i + 1}`).trim(),
      contexte: String(p?.contexte || "").trim(),
      enonce: String(p?.enonce || "").trim(),
      indices: (Array.isArray(p?.indices) ? p.indices : [])
        .map((s: any) => String(s || "").trim())
        .filter(Boolean)
        .slice(0, 3),
      solution: String(p?.solution || "").trim(),
    }));

    return new Response(JSON.stringify({ puzzles }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("puzzle-book-generate error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
