// Génération du sommaire (table des matières) pour le workflow V3.
// Fonctionne SANS clé personnelle : repli sur la clé serveur puis sur Lovable AI,
// afin qu'un abonné puisse toujours créer un livre.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

interface Body {
  title?: string;
  subtitle?: string;
  category?: string;
  tone?: string;
  description?: string;
  promesseCentrale?: string;
  chapters?: number;
  userApiKey?: string;
  /** 'full' (défaut) = sommaire complet ; 'next' = propositions pour le prochain chapitre */
  step?: "full" | "next";
  /** Chapitres déjà validés par l'auteur (mode dialogue) */
  accepted?: Array<{ numero?: number; titre?: string; objectif?: string }>;
  /** Consigne libre de l'auteur pour orienter les propositions */
  guidance?: string;
}


function sanitizeApiKey(value: unknown): string {
  return typeof value === "string"
    ? value.replace(/[\u200B-\u200D\uFEFF\u00A0]/g, "").replace(/["'`]/g, "").replace(/\s+/g, "").trim()
    : "";
}

function isValidGoogleKey(key: string): boolean {
  const k = sanitizeApiKey(key);
  if (!k) return false;
  if (/^AIza[A-Za-z0-9_-]{20,}$/.test(k)) return true;
  return /^[A-Za-z0-9._-]{30,}$/.test(k);
}

async function callGemini(prompt: string, apiKey: string, maxTokens: number) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${encodeURIComponent(sanitizeApiKey(apiKey))}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json", temperature: 0.55, maxOutputTokens: maxTokens },
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
      temperature: 0.55,
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

function parseChapters(raw: string, expected: number) {
  let parsed: any = null;
  try {
    parsed = JSON.parse(raw);
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) { try { parsed = JSON.parse(match[0]); } catch { /* noop */ } }
  }
  const list = Array.isArray(parsed?.chapters) ? parsed.chapters : Array.isArray(parsed) ? parsed : [];
  const out = list
    .map((c: any, i: number) => ({
      numero: Number(c?.numero) || i + 1,
      titre: String(c?.titre ?? c?.title ?? "").trim(),
      objectif: String(c?.objectif ?? c?.objective ?? "").trim(),
    }))
    .filter((c: { titre: string }) => c.titre.length > 1)
    .slice(0, expected);
  return out;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json(405, { error: "Method not allowed" });

  try {
    const body = (await req.json()) as Body;
    const title = (body.title || "").trim();
    if (title.length < 3) return json(400, { error: "Titre requis" });

    const count = Math.min(60, Math.max(3, Number(body.chapters) || 12));
    const maxTokens = Math.min(12000, 1800 + count * 180);
    const userKey = sanitizeApiKey(body.userApiKey);

    const prompt = `Tu es directeur éditorial KDP. Crée une table des matières professionnelle en français.
Titre : ${title}
Sous-titre : ${(body.subtitle || "").trim() || "Non défini"}
Catégorie : ${(body.category || "").trim() || "Non définie"}
Ton : ${(body.tone || "").trim() || "Inspirant"}
Synopsis : ${(body.description || "").trim().slice(0, 4000) || "Non fourni — déduis un fil conducteur cohérent à partir du titre et de la catégorie."}
Promesse centrale : ${(body.promesseCentrale || "").trim() || "Non définie"}
Nombre exact de chapitres : ${count}

Réponds STRICTEMENT en JSON valide, sans markdown, avec ce schéma :
{"chapters":[{"numero":1,"titre":"Titre spécifique non générique","objectif":"Objectif éditorial clair en une phrase"}]}

Règles :
- exactement ${count} chapitres ;
- jamais de titre générique comme "Chapitre 1" ;
- 100 % français : aucun titre en latin ou faux latin, aucune langue morte, aucun mot inventé, aucune expression étrangère décorative ;
- jamais deux titres identiques ;
- titres courts, vendeurs, cohérents avec le synopsis.`;

    const serverKey = sanitizeApiKey(Deno.env.get("GEMINI_API_KEY") || "");
    let result: { ok: boolean; status?: number; text?: string } | null = null;

    if (isValidGoogleKey(userKey)) result = await callGemini(prompt, userKey, maxTokens);
    if (!result?.ok && isValidGoogleKey(serverKey)) result = await callGemini(prompt, serverKey, maxTokens);
    if (!result?.ok) result = await callLovableAI(prompt, maxTokens);

    if (!result?.ok) {
      const status = result?.status === 429 ? 429 : result?.status === 402 ? 402 : 502;
      return json(status, {
        error:
          status === 429
            ? "Limite IA atteinte. Réessaie dans quelques secondes."
            : status === 402
              ? "Crédits IA indisponibles pour le moment."
              : "Service IA temporairement indisponible.",
      });
    }

    const chapters = parseChapters(result.text || "", count);
    if (chapters.length < 3) return json(502, { error: "L'IA n'a pas renvoyé de sommaire exploitable. Réessaie." });

    return json(200, { chapters });
  } catch (e: any) {
    console.error("v3-generate-outline error:", e?.message);
    return json(500, { error: e?.message || "Erreur serveur" });
  }
});
