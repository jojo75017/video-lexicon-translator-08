// Ebookstudio-Génie : à partir d'un seul message libre de l'abonné, on déduit
// toute la fiche du livre (titre, catégorie, ton, longueur, illustrations…).
// Repli : clé personnelle Gemini -> clé serveur -> Lovable AI.

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

async function callGemini(prompt: string, apiKey: string) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${encodeURIComponent(sanitizeApiKey(apiKey))}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json", temperature: 0.5, maxOutputTokens: 4000 },
    }),
  });
  if (!res.ok) {
    console.error("Gemini error:", res.status, (await res.text()).slice(0, 300));
    return { ok: false as const, status: res.status };
  }
  const data = await res.json();
  return { ok: true as const, text: data?.candidates?.[0]?.content?.parts?.[0]?.text || "" };
}

async function callLovableAI(prompt: string) {
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
      temperature: 0.5,
      max_tokens: 4000,
    }),
  });
  const text = await res.text();
  if (!res.ok) {
    console.error("Lovable AI error:", res.status, text.slice(0, 300));
    return { ok: false as const, status: res.status };
  }
  try {
    const data = JSON.parse(text);
    return { ok: true as const, text: data?.choices?.[0]?.message?.content || "" };
  } catch {
    return { ok: true as const, text };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json(405, { error: "Method not allowed" });

  try {
    const body = (await req.json()) as {
      message?: string;
      userApiKey?: string;
      author?: string;
      history?: Array<{ role?: string; content?: string }>;
      mode?: string;
      accepted?: Array<{ titre?: string; objectif?: string }>;
      target?: number;
      bookTitle?: string;
      bookDescription?: string;
      tone?: string;
      language?: string;
    };
    const message = String(body.message || "").trim();
    const mode = String(body.mode || "brief");
    if (mode !== "outline-step" && message.length < 10) {
      return json(400, { error: "Décrivez votre livre en quelques mots." });
    }

    // Mémoire de conversation : le Génie doit tenir compte de tout ce qui a déjà été dit.
    const history = (Array.isArray(body.history) ? body.history : [])
      .filter((m) => m && typeof m.content === "string" && m.content.trim())
      .slice(-12)
      .map((m) => `${m.role === "assistant" ? "Génie" : "Auteur"} : ${String(m.content).slice(0, 900)}`)
      .join("\n");

    const historyBlock = history
      ? `\nHistorique de la conversation (à respecter : ne perds rien de ce qui a déjà été décidé, applique seulement les nouvelles précisions) :\n"""${history}"""\n`
      : "";


    const prompt = `Tu es directeur éditorial KDP francophone. Un auteur te décrit librement son projet de livre.
${historyBlock}
Dernier message de l'auteur :
"""${message.slice(0, 5000)}"""

Déduis la fiche complète du livre. Réponds STRICTEMENT en JSON valide, sans markdown :
{"title":"","subtitle":"","author":"","category":"","tone":"","description":"","chapters":20,"wordsPerChapter":1500,"wantsIllustrations":false,"audience":"","promesseCentrale":"","questions":[""]}

Règles :
- 100 % français : aucun latin, aucune langue étrangère décorative, aucun mot inventé ;
- "title" : titre commercial court et vendeur (invente-le si l'auteur n'en donne pas) ;
- "category" : une catégorie Amazon KDP parmi Roman, Thriller / Policier, Romance, Fantasy / Fantastique, Science-fiction, Développement personnel, Business / Entrepreneuriat, Santé / Bien-être, Cuisine / Recettes, Voyage / Guide, Enfants / Jeunesse, Histoire / Culture ;
- "tone" : un seul mot parmi Inspirant, Pédagogique, Émotionnel, Direct, Humoristique, Premium, Romanesque, Expert ;
- "description" : synopsis clair de 3 à 5 phrases, reformulé proprement à partir du message ;
- "chapters" : entre 8 et 30 selon l'ambition du projet ; "wordsPerChapter" entre 1000 et 2200 ;
- "wantsIllustrations" : true si le sujet appelle des images (enfants, cuisine, voyage, pratique) ;
- "author" : reprends le nom si l'auteur le donne, sinon "" ;
- "questions" : 0 à 2 questions courtes seulement si une information essentielle manque vraiment.`;

    const userKey = sanitizeApiKey(body.userApiKey);
    const serverKey = sanitizeApiKey(Deno.env.get("GEMINI_API_KEY") || "");

    let r: { ok: boolean; status?: number; text?: string } | null = null;
    if (isValidGoogleKey(userKey)) r = await callGemini(prompt, userKey);
    if (!r?.ok && isValidGoogleKey(serverKey)) r = await callGemini(prompt, serverKey);
    if (!r?.ok) r = await callLovableAI(prompt);

    if (!r?.ok) {
      const status = r?.status === 429 ? 429 : r?.status === 402 ? 402 : 502;
      return json(status, {
        error:
          status === 429
            ? "Limite IA atteinte. Réessayez dans quelques secondes."
            : status === 402
              ? "Crédits IA indisponibles pour le moment."
              : "Service IA temporairement indisponible.",
      });
    }

    const raw = String(r.text || "").replace(/```json|```/gi, "").trim();
    let parsed: any = null;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const m = raw.match(/\{[\s\S]*\}/);
      if (m) { try { parsed = JSON.parse(m[0]); } catch { /* noop */ } }
    }
    if (!parsed || typeof parsed !== "object") { console.error("brief parse failed:", raw.slice(0, 600)); }
    if (!parsed || typeof parsed !== "object") return json(502, { error: "Réponse IA illisible. Réessayez." });

    const clamp = (n: unknown, min: number, max: number, fallback: number) => {
      const v = Number(n);
      return Number.isFinite(v) ? Math.min(max, Math.max(min, Math.round(v))) : fallback;
    };

    const brief = {
      title: String(parsed.title || "").trim(),
      subtitle: String(parsed.subtitle || "").trim(),
      author: String(parsed.author || body.author || "").trim(),
      category: String(parsed.category || "").trim(),
      tone: String(parsed.tone || "Inspirant").trim(),
      description: String(parsed.description || message).trim(),
      chapters: clamp(parsed.chapters, 8, 30, 20),
      wordsPerChapter: clamp(parsed.wordsPerChapter, 1000, 2200, 1500),
      wantsIllustrations: Boolean(parsed.wantsIllustrations),
      cibleProfil: String(parsed.audience || "").trim(),
      promesseCentrale: String(parsed.promesseCentrale || "").trim(),
    };

    const questions = (Array.isArray(parsed.questions) ? parsed.questions : [])
      .map((q: unknown) => String(q || "").trim())
      .filter(Boolean)
      .slice(0, 2);

    return json(200, { brief, questions });
  } catch (e) {
    console.error("v3-genie-brief error", e);
    return json(500, { error: "Erreur inattendue." });
  }
});
