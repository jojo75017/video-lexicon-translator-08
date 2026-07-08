import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

async function callLovableAI(system: string, user: string, jsonMode: boolean) {
  const key = Deno.env.get("LOVABLE_API_KEY");
  if (!key) return { ok: false as const, status: 500, text: "LOVABLE_API_KEY missing" };
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.8,
      max_tokens: 3000,
      ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
    }),
  });
  const text = await res.text();
  if (!res.ok) {
    console.error("Lovable AI error:", res.status, text.slice(0, 500));
    return { ok: false as const, status: res.status, text };
  }
  try {
    const data = JSON.parse(text);
    return { ok: true as const, text: data?.choices?.[0]?.message?.content || "" };
  } catch {
    return { ok: true as const, text };
  }
}

function aiError(status: number) {
  const s = status === 429 ? 429 : status === 402 ? 402 : 502;
  const message = s === 429
    ? "Limite IA atteinte. Réessayez dans quelques instants."
    : s === 402
      ? "Crédits IA indisponibles pour le moment."
      : "Service IA temporairement indisponible.";
  return json(s, { error: message });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json(405, { error: "Method not allowed" });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json(401, { error: "Authentification requise" });
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) return json(401, { error: "Session invalide" });

    const body = await req.json().catch(() => ({}));
    const action = String(body?.action || "");

    /* ===== Génération intelligente : remplit le formulaire à partir d'une description ===== */
    if (action === "autofill") {
      const description = String(body?.description || "").trim();
      const productType = String(body?.productType || "produit numérique").trim();
      if (description.length < 15) return json(400, { error: "Décrivez votre produit en quelques phrases." });

      const system = "Tu es un expert en documentation produit et branding SaaS. Tu réponds STRICTEMENT en JSON valide, sans markdown, en français.";
      const prompt = `À partir de la description d'un produit de type "${productType}", génère une structure de documentation complète.

DESCRIPTION:
${description.slice(0, 4000)}

Renvoie UNIQUEMENT cet objet JSON (des chaînes concises et professionnelles):
{
  "project": { "name": "", "slogan": "", "company": "" },
  "positioning": { "vision": "", "mission": "", "values": "", "audience": "", "problem": "", "promise": "", "advantages": "" },
  "modules": [ { "name": "", "description": "", "fonction": "", "audience": "", "icon": "📦" } ],
  "features": [ { "name": "", "description": "", "example": "", "tip": "" } ],
  "agents": [ { "name": "", "mission": "", "personality": "", "skills": "", "workflow": "", "systemPrompt": "", "useCases": "" } ]
}
Règles: 3 à 6 modules, 4 à 8 fonctionnalités, 0 à 2 agents IA (uniquement si pertinent pour ce produit). "icon" doit être un emoji.`;

      const r = await callLovableAI(system, prompt, true);
      if (!r.ok) return aiError(r.status);
      let parsed: unknown;
      try { parsed = JSON.parse(r.text); }
      catch {
        const m = r.text.match(/\{[\s\S]*\}/);
        if (!m) return json(502, { error: "Réponse IA non exploitable." });
        try { parsed = JSON.parse(m[0]); } catch { return json(502, { error: "JSON IA invalide." }); }
      }
      return json(200, { data: parsed });
    }

    /* ===== Copilot : suggestion ciblée sur un champ ou une question ===== */
    if (action === "copilot") {
      const question = String(body?.question || "").trim();
      const context = String(body?.context || "").slice(0, 4000);
      if (!question) return json(400, { error: "Posez une question au Copilot." });
      const system = "Tu es Documentation Copilot, un assistant premium qui aide à rédiger la documentation d'un produit numérique. Tu proposes, améliores et complètes, mais tu ne remplaces jamais l'utilisateur. Réponses concises, actionnables, en français. Pas de markdown superflu.";
      const prompt = `CONTEXTE DU PROJET:\n${context}\n\nDEMANDE:\n${question}`;
      const r = await callLovableAI(system, prompt, false);
      if (!r.ok) return aiError(r.status);
      return json(200, { text: r.text });
    }

    return json(400, { error: "Action inconnue." });
  } catch (e) {
    console.error("documentation-studio-assist error:", e);
    return json(500, { error: "Erreur interne." });
  }
});
