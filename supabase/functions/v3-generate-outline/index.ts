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
  /** 'full' (défaut) = sommaire complet ; 'next' = propositions pour le prochain chapitre ; 'enrich' = enrichissement éditorial */
  step?: "full" | "next" | "enrich";

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
    const serverKeyEarly = sanitizeApiKey(Deno.env.get("GEMINI_API_KEY") || "");

    // ---- Mode dialogue : propositions pour le prochain chapitre ----
    if (body.step === "next") {
      const accepted = Array.isArray(body.accepted) ? body.accepted : [];
      const nextNum = accepted.length + 1;
      const acceptedList = accepted.length
        ? accepted
            .map((c, i) => `${i + 1}. ${String(c?.titre || "").trim()}${c?.objectif ? ` — ${String(c.objectif).trim()}` : ""}`)
            .join("\n")
        : "Aucun chapitre validé pour l'instant.";

      const nextPrompt = `Tu es directeur éditorial KDP. Nous construisons ensemble, chapitre par chapitre, le sommaire d'un livre en français.
Titre : ${title}
Sous-titre : ${(body.subtitle || "").trim() || "Non défini"}
Catégorie : ${(body.category || "").trim() || "Non définie"}
Ton : ${(body.tone || "").trim() || "Inspirant"}
Synopsis : ${(body.description || "").trim().slice(0, 4000) || "Non fourni"}
Promesse centrale : ${(body.promesseCentrale || "").trim() || "Non définie"}
Nombre total de chapitres prévus : ${count}

Chapitres déjà validés par l'auteur :
${acceptedList}

${(body.guidance || "").trim() ? `Consigne de l'auteur pour ce chapitre : ${(body.guidance || "").trim()}` : ""}

Propose 3 options DIFFÉRENTES pour le chapitre ${nextNum} (et seulement celui-là).
Réponds STRICTEMENT en JSON valide, sans markdown :
{"suggestions":[{"titre":"Titre spécifique","objectif":"Objectif éditorial en une phrase"}]}

Règles :
- exactement 3 options ;
- progression logique après les chapitres validés, sans répéter leurs titres ;
- jamais de titre générique comme "Chapitre ${nextNum}" ;
- 100 % français : aucun latin ou faux latin, aucune langue morte, aucun mot inventé, aucune expression étrangère décorative ;
- titres courts et vendeurs.`;

      let r: { ok: boolean; status?: number; text?: string } | null = null;
      if (isValidGoogleKey(userKey)) r = await callGemini(nextPrompt, userKey, 1200);
      if (!r?.ok && isValidGoogleKey(serverKeyEarly)) r = await callGemini(nextPrompt, serverKeyEarly, 1200);
      if (!r?.ok) r = await callLovableAI(nextPrompt, 1200);
      if (!r?.ok) {
        const status = r?.status === 429 ? 429 : r?.status === 402 ? 402 : 502;
        return json(status, {
          error:
            status === 429
              ? "Limite IA atteinte. Réessaie dans quelques secondes."
              : status === 402
                ? "Crédits IA indisponibles pour le moment."
                : "Service IA temporairement indisponible.",
        });
      }

      let parsed: any = null;
      const raw = String(r.text || "").replace(/```json|```/gi, "").trim();
      

      try {
        parsed = JSON.parse(raw);
      } catch {
        const m = raw.match(/\{[\s\S]*\}/);
        if (m) { try { parsed = JSON.parse(m[0]); } catch { /* noop */ } }
      }
      const list = Array.isArray(parsed?.suggestions) ? parsed.suggestions : Array.isArray(parsed) ? parsed : [];
      const suggestions = list
        .map((c: any) => ({
          titre: String(c?.titre ?? c?.title ?? "").trim(),
          objectif: String(c?.objectif ?? c?.objective ?? "").trim(),
        }))
        .filter((c: { titre: string }) => c.titre.length > 1)
        .slice(0, 3);

      if (!suggestions.length) return json(502, { error: "Aucune proposition exploitable. Réessaie." });
      return json(200, { suggestions, numero: nextNum });
    }

    /* ---- Mode « enrichir » : points à traiter, question du lecteur, mot-clé ---- */
    if (body.step === "enrich") {
      const toEnrich = (Array.isArray(body.accepted) ? body.accepted : []).slice(0, 40);
      if (!toEnrich.length) return json(400, { error: "Aucun chapitre à enrichir." });

      const list = toEnrich
        .map((c, i) => `${i + 1}. ${String(c?.titre || "").trim()}${c?.objectif ? ` — ${String(c.objectif).trim()}` : ""}`)
        .join("\n");

      const enrichPrompt = `Tu es directeur éditorial KDP. Voici le sommaire d'un livre en français.
Titre : ${title}
Sous-titre : ${(body.subtitle || "").trim() || "Non défini"}
Catégorie : ${(body.category || "").trim() || "Non définie"}
Promesse centrale : ${(body.promesseCentrale || "").trim() || "Non définie"}
Consigne de l'auteur : ${(body.guidance || "").trim() || "Aucune"}

SOMMAIRE :
${list}

Pour CHAQUE chapitre, produis un plan de travail concret pour l'IA rédactrice.
Réponds STRICTEMENT en JSON valide, sans markdown :
{"chapters":[{"numero":1,"objectif":"...","points":["...","...","..."],"readerQuestion":"...","keyword":"..."}]}

Règles :
- exactement ${toEnrich.length} entrées, dans le même ordre ;
- 3 à 5 "points" par chapitre : chacun est une phrase concrète et utile, jamais un mot seul ;
- "readerQuestion" : une vraie question que le lecteur se pose sur ce chapitre ;
- "keyword" : une expression de recherche Amazon crédible en français (2 à 4 mots) ;
- "objectif" : reformule l'objectif du chapitre en une phrase claire s'il manque ;
- 100 % français : aucun latin, aucun faux latin, aucun mot inventé, aucune langue étrangère.`;

      const enrichTokens = Math.min(14000, 1200 + toEnrich.length * 260);
      let enrichResult: { ok: boolean; status?: number; text?: string } | null = null;
      if (isValidGoogleKey(userKey)) enrichResult = await callGemini(enrichPrompt, userKey, enrichTokens);
      if (!enrichResult?.ok && isValidGoogleKey(serverKeyEarly)) enrichResult = await callGemini(enrichPrompt, serverKeyEarly, enrichTokens);
      if (!enrichResult?.ok) enrichResult = await callLovableAI(enrichPrompt, enrichTokens);

      if (!enrichResult?.ok) {
        const status = enrichResult?.status === 429 ? 429 : enrichResult?.status === 402 ? 402 : 502;
        return json(status, {
          error:
            status === 429
              ? "Limite IA atteinte. Réessaie dans quelques secondes."
              : status === 402
                ? "Crédits IA indisponibles pour le moment."
                : "Service IA temporairement indisponible.",
        });
      }

      const raw = String(enrichResult.text || "").replace(/```json|```/gi, "").trim();
      let parsed: any = null;
      try {
        parsed = JSON.parse(raw);
      } catch {
        const m = raw.match(/\{[\s\S]*\}/);
        if (m) { try { parsed = JSON.parse(m[0]); } catch { /* ignoré */ } }
      }
      const items = Array.isArray(parsed?.chapters) ? parsed.chapters : Array.isArray(parsed) ? parsed : [];
      const enriched = items
        .map((item: any, i: number) => ({
          numero: Number(item?.numero) > 0 ? Number(item.numero) : i + 1,
          objectif: String(item?.objectif || "").trim(),
          points: Array.isArray(item?.points)
            ? item.points.map((p: unknown) => String(p || "").trim()).filter((p: string) => p.length > 3).slice(0, 6)
            : [],
          readerQuestion: String(item?.readerQuestion || "").trim(),
          keyword: String(item?.keyword || "").trim(),
        }))
        .filter((item: { points: string[]; objectif: string }) => item.points.length || item.objectif);

      if (!enriched.length) return json(502, { error: "Enrichissement illisible. Réessaie." });
      return json(200, { enriched });
    }





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
