// Nomme les chapitres dépourvus de titre, à partir d'un extrait de leur contenu.
// Utilise Lovable AI (aucune clé côté abonné requise).

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

interface ChapterIn {
  number: number;
  excerpt?: string;
}

/** Appel Gemini avec la clé de l'abonné (BYOK) — aucun crédit Lovable consommé. */
async function callGeminiDirect(key: string, prompt: string): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(key)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.8, responseMimeType: "application/json" },
      }),
    },
  );
  if (!res.ok) throw new Error(`Gemini (${res.status}) : ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  return String(data?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text ?? "").join("") ?? "");
}

/** Appel OpenRouter avec la clé de l'abonné (BYOK). */
async function callOpenRouter(key: string, prompt: string, system: string): Promise<string> {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash-lite",
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt },
      ],
    }),
  });
  if (!res.ok) throw new Error(`OpenRouter (${res.status}) : ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  return String(data?.choices?.[0]?.message?.content ?? "");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const {
      bookTitle = "",
      genre = "",
      chapters = [],
      userApiKey = "",
      openrouterKey = "",
    } = (await req.json()) as {
      bookTitle?: string;
      genre?: string;
      chapters?: ChapterIn[];
      userApiKey?: string;
      openrouterKey?: string;
    };

    const list = (chapters || [])
      .filter((c) => c && Number.isFinite(c.number))
      .slice(0, 60)
      .map((c) => ({ number: Number(c.number), excerpt: String(c.excerpt || "").slice(0, 900) }));

    if (list.length === 0) return json(400, { error: "Aucun chapitre à nommer." });

    const system =
      "Tu es un éditeur littéraire francophone. Tu réponds uniquement en JSON valide.";

    const prompt = [
      `Livre : « ${bookTitle || "Sans titre"} »${genre ? ` (${genre})` : ""}.`,
      "Pour chaque extrait de chapitre ci-dessous, propose UN titre de chapitre littéraire, évocateur,",
      "de 2 à 6 mots, sans numéro, sans guillemets, sans le mot « Chapitre », en français.",
      "Les titres doivent être tous différents et fidèles au contenu de l'extrait.",
      "INTERDIT : latin ou faux latin, langue morte, mot inventé, expression en langue étrangère. 100 % français.",
      "Réponds STRICTEMENT en JSON : {\"titles\":[{\"number\":1,\"title\":\"...\"}]}",
      "",
      ...list.map((c) => `--- Chapitre ${c.number} ---\n${c.excerpt}`),
    ].join("\n");

    // 1) clé de l'abonné (aucun crédit IA Lovable), 2) repli sur Lovable AI.
    const ownKey = String(userApiKey || "").trim();
    const orKey = String(openrouterKey || "").trim();
    let raw = "";

    if (orKey.startsWith("sk-or-")) {
      raw = await callOpenRouter(orKey, prompt, system);
    } else if (ownKey.startsWith("sk-or-")) {
      raw = await callOpenRouter(ownKey, prompt, system);
    } else if (ownKey.length > 20) {
      raw = await callGeminiDirect(ownKey, prompt);
    } else {
      const apiKey = Deno.env.get("LOVABLE_API_KEY");
      if (!apiKey) return json(500, { error: "Service IA indisponible." });

      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-lite",
          messages: [
            { role: "system", content: system },
            { role: "user", content: prompt },
          ],
        }),
      });

      if (res.status === 429) return json(429, { error: "Trop de requêtes, réessaie dans un instant." });
      if (res.status === 402) {
        return json(402, {
          error:
            "Crédits IA épuisés côté serveur. Ajoutez votre clé Gemini ou OpenRouter dans « Clés API » : les titres seront générés avec votre propre clé.",
        });
      }
      if (!res.ok) return json(502, { error: `Erreur IA (${res.status}).` });

      const data = await res.json();
      raw = data?.choices?.[0]?.message?.content ?? "";
    }
    const cleaned = String(raw).replace(/```json|```/gi, "").trim();

    const match = cleaned.match(/\{[\s\S]*\}/);

    let titles: { number: number; title: string }[] = [];
    try {
      const parsed = JSON.parse(match ? match[0] : cleaned);
      titles = Array.isArray(parsed?.titles) ? parsed.titles : [];
    } catch {
      return json(502, { error: "Réponse IA illisible." });
    }

    const seen = new Set<string>();
    const out = titles
      .map((t) => ({
        number: Number(t?.number),
        title: String(t?.title || "")
          .replace(/^\s*chapitre\s*\d*\s*[:–—-]?\s*/i, "")
          .replace(/["«»*#]/g, "")
          .trim()
          .slice(0, 90),
      }))
      .filter((t) => Number.isFinite(t.number) && t.title.length >= 3)
      .filter((t) => {
        const k = t.title.toLowerCase();
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });

    return json(200, { titles: out });
  } catch (e) {
    return json(500, { error: e instanceof Error ? e.message : "Erreur inconnue" });
  }
});
