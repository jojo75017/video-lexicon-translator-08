// Studio Pro — Phase 2 : Gemini analyse un chapitre rédigé et produit sa MÉMOIRE.
// Rôle Gemini = analyse et contrôle de cohérence (jamais la rédaction).

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

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
      generationConfig: { responseMimeType: "application/json", temperature: 0.2, maxOutputTokens: maxTokens },
    }),
  });
  if (!res.ok) {
    console.error("Gemini error:", res.status, (await res.text()).slice(0, 400));
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
        { role: "system", content: "Tu réponds uniquement en JSON valide, sans markdown, en français." },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
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
    if (m) { try { return JSON.parse(m[0]); } catch { /* noop */ } }
    return null;
  }
}

const arr = (v: unknown): string[] =>
  Array.isArray(v) ? v.map((x) => (typeof x === "string" ? x : JSON.stringify(x))).filter(Boolean).slice(0, 30) : [];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json(405, { error: "Method not allowed" });

  try {
    const body = await req.json();
    const content = String(body?.content || "").trim();
    if (content.length < 200) return json(400, { error: "Chapitre trop court pour être analysé." });

    const position = Number(body?.position) || 1;
    const planned = String(body?.planned_summary || "");
    const previous = Array.isArray(body?.memory) ? body.memory : [];

    const prompt = `Tu es DIRECTEUR ÉDITORIAL chargé du contrôle de cohérence d'un livre.
Analyse le chapitre ${position} ci-dessous et extrait sa mémoire factuelle, qui servira à rédiger les chapitres suivants sans contradiction.
Réponds en français, uniquement en JSON valide, sans markdown.

RÉSUMÉ PRÉVU AU PLAN (pour vérifier l'écart)
${planned || "non renseigné"}

MÉMOIRE DES CHAPITRES PRÉCÉDENTS (pour repérer les contradictions)
${JSON.stringify(previous).slice(0, 8000)}

CHAPITRE ${position}
${content.slice(0, 45000)}

Forme attendue :
{
  "summary": "résumé factuel de 120 à 200 mots de ce qui se passe réellement",
  "events": ["fait établi 1", "fait établi 2"],
  "characters_present": ["nom — état / évolution"],
  "revealed_info": ["information révélée au lecteur"],
  "places": ["lieu utilisé"],
  "dates": ["repère temporel"],
  "objects": ["objet ou élément important introduit"],
  "clues": ["indice planté à récolter plus tard"],
  "decisions": ["décision prise par un personnage"],
  "relationship_changes": ["relation modifiée"],
  "open_questions": ["question laissée en suspens"],
  "coherence_alerts": ["contradiction ou écart repéré avec le plan ou les chapitres précédents"]
}`;

    const userKey = sanitizeApiKey(body?.userApiKey);
    const serverKey = sanitizeApiKey(Deno.env.get("GEMINI_API_KEY") || "");

    let raw = "";
    let engine = "gemini";
    for (const k of [userKey, serverKey].filter(isValidGoogleKey)) {
      const r = await callGemini(prompt, k, 4000);
      if (r.ok && r.text) { raw = r.text; break; }
    }
    if (!raw) {
      const r = await callLovableAI(prompt, 4000);
      if (r.ok && r.text) { raw = r.text; engine = "gemini-lovable"; }
    }
    if (!raw) return json(502, { error: "L'analyse de cohérence n'a pas abouti." });

    const parsed = parseJson(raw);
    if (!parsed) return json(502, { error: "Réponse d'analyse illisible." });

    return json(200, {
      engine,
      memory: {
        summary: String(parsed.summary || "").slice(0, 4000),
        events: arr(parsed.events),
        characters_present: arr(parsed.characters_present),
        revealed_info: arr(parsed.revealed_info),
        places: arr(parsed.places),
        dates: arr(parsed.dates),
        objects: arr(parsed.objects),
        clues: arr(parsed.clues),
        decisions: arr(parsed.decisions),
        relationship_changes: arr(parsed.relationship_changes),
        open_questions: arr(parsed.open_questions),
      },
      coherence_alerts: arr(parsed.coherence_alerts),
    });
  } catch (e) {
    console.error("book-memory-extract error:", e);
    return json(500, { error: (e as Error)?.message || "Erreur interne" });
  }
});
