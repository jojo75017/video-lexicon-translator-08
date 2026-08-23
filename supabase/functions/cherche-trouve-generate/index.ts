// Générateur de concepts "Cherche & Trouve" (Seek-and-Find coloring books KDP).
// Génère un lot de scènes structurées : titre, description, objets cachés,
// et prompt image optimisé EN ANGLAIS (line art noir & blanc).
// BYOK Gemini prioritaire (clé abonné), sinon repli sur Lovable AI.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const STYLES: Record<string, string> = {
  "line-art-cartoon":
    "Line art cartoon : contours noirs francs et réguliers, formes rondes et joyeuses, esprit bande dessinée.",
  kawaii:
    "Kawaii : personnages et objets mignons avec petits visages simples, formes très rondes, ambiance douce.",
  realiste:
    "Réaliste : dessin au trait détaillé et fidèle à la réalité, proportions exactes, textures finement suggérées par le trait.",
  mandala:
    "Mandala : composition riche en motifs ornementaux et répétitifs, esprit zentangle, objets fondus dans les décors.",
};

const DIFFICULTIES: Record<string, { fr: string; en: string }> = {
  facile: {
    fr: "Facile (enfants 3-7 ans) : grandes formes, peu de détails parasites, objets faciles à repérer.",
    en: "easy level for young children aged 3-7: large bold shapes, low background clutter, hidden objects easy to spot",
  },
  moyen: {
    fr: "Moyen (8-12 ans / famille) : densité moyenne, objets partiellement fondus dans le décor.",
    en: "medium level for kids 8-12 and families: moderate detail density, hidden objects partly blended into the scenery",
  },
  difficile: {
    fr: "Difficile (adultes) : densité élevée, nombreux détails, objets bien camouflés.",
    en: "hard level for adults: very high detail density, intricate scenery, hidden objects well camouflaged",
  },
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

const FR_RULE = `RÈGLE ABSOLUE DE LANGUE : titres, descriptions et noms d'objets en français courant.
INTERDIT : latin, faux latin, langues mortes, pseudo-langues, mots inventés.
Seule exception : le champ "promptImage" qui DOIT être rédigé en anglais.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const theme = String(body.theme || "").trim().slice(0, 200);
    const style = String(body.style || "line-art-cartoon");
    const difficulty = String(body.difficulty || "moyen");
    const objectsPerScene = Math.min(Math.max(parseInt(body.objectsPerScene) || 10, 5), 20);
    const startIndex = Math.max(0, parseInt(body.startIndex) || 0);
    const count = Math.min(Math.max(parseInt(body.count) || 5, 1), 5);
    const geminiApiKey = typeof body.geminiApiKey === "string" ? body.geminiApiKey : "";

    if (!theme) {
      return new Response(JSON.stringify({ error: "Le thème de la scène est requis" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const styleDesc = STYLES[style] || STYLES["line-art-cartoon"];
    const diff = DIFFICULTIES[difficulty] || DIFFICULTIES["moyen"];

    const prompt = `Tu es un illustrateur professionnel de livres de coloriage "Cherche & Trouve" (Seek-and-Find) publiés sur Amazon KDP.

THÈME DE LA SCÈNE : ${theme}
STYLE DE DESSIN : ${styleDesc}
NIVEAU DE DIFFICULTÉ : ${diff.fr}

${FR_RULE}

Génère EXACTEMENT ${count} scènes de coloriage Cherche & Trouve, numérotées de ${startIndex + 1} à ${startIndex + count}.
Chaque scène DOIT être unique (lieu, ambiance ou instant différent dans le thème) et directement exploitable.

Pour CHAQUE scène :
- "titre" : titre accrocheur de la page (français).
- "description" : mise en situation en 1 à 2 phrases (français).
- "objets" : liste d'EXACTEMENT ${objectsPerScene} objets à cacher au total (la somme des quantités = ${objectsPerScene}). Forme : {"nom": "clé ancienne", "quantite": 1}. Objets cohérents avec le thème, variés, certains inattendus mais crédibles.
- "promptImage" : prompt EN ANGLAIS optimisé pour Midjourney / DALL-E / Idéogram, qui génère la page de coloriage complète. Il DOIT :
  * commencer par "Seek-and-find hidden objects coloring book page, black and white line art only, clean crisp outlines, no color, no shading, no grayscale fill, pure white background"
  * décrire la scène (${theme}) dans le style demandé
  * intégrer explicitement TOUS les objets cachés avec leurs quantités ("hidden in the scene: 1 old key, 3 apples, ...")
  * préciser la densité : ${diff.en}
  * terminer par "full-page composition, portrait orientation 6x9, coloring book style, high resolution line work"

Réponds UNIQUEMENT avec un JSON valide de cette forme exacte :
{
  "scenes": [
    {
      "titre": "...",
      "description": "...",
      "objets": [{"nom": "...", "quantite": 1}],
      "promptImage": "..."
    }
  ]
}

Contraintes :
- Aucun texte hors du JSON.
- Les objets ne doivent JAMAIS être des marques ou des personnages protégés.
- Vérifie que la somme des quantités de chaque scène vaut exactement ${objectsPerScene}.`;

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
    const rawScenes = Array.isArray(parsed?.scenes) ? parsed.scenes : null;
    if (!rawScenes || rawScenes.length === 0) {
      return new Response(JSON.stringify({ error: "Réponse IA invalide" }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const scenes = rawScenes.slice(0, count).map((s: any, i: number) => ({
      numero: startIndex + i + 1,
      titre: String(s?.titre || `Scène ${startIndex + i + 1}`).trim(),
      description: String(s?.description || "").trim(),
      objets: (Array.isArray(s?.objets) ? s.objets : [])
        .map((o: any) => ({
          nom: String(o?.nom || "").trim(),
          quantite: Math.min(Math.max(parseInt(o?.quantite) || 1, 1), 9),
        }))
        .filter((o: { nom: string }) => o.nom)
        .slice(0, 25),
      promptImage: String(s?.promptImage || "").trim(),
    }));

    return new Response(JSON.stringify({ scenes }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("cherche-trouve-generate error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
