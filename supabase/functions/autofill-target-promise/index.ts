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

interface Body {
  title?: string;
  subtitle?: string;
  category?: string;
  bookIntroduction?: string;
  language?: string;
  userApiKey?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json(405, { error: "Method not allowed" });

  try {
    // Auth check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json(401, { error: "Authentification requise" });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) return json(401, { error: "Session invalide" });

    const body = (await req.json()) as Body;
    const title = (body.title || "").trim();
    const subtitle = (body.subtitle || "").trim();
    const category = (body.category || "").trim();
    const intro = (body.bookIntroduction || "").trim();
    const language = body.language || "fr";
    const userKey = (body.userApiKey || "").trim();

    if (!title) {
      return json(400, { error: "Titre requis" });
    }
    if (!userKey || !userKey.startsWith("AIza")) {
      return json(400, { error: "Clé Gemini manquante ou invalide (doit commencer par AIza)" });
    }

    const langLabel = language === "en" ? "English" : language === "es" ? "Spanish" : language === "it" ? "Italian" : "French";

    const prompt = `Tu es un expert en marketing éditorial KDP. À partir des informations ci-dessous, déduis la cible idéale du lecteur et la promesse centrale du livre. Adapte le ton et le vocabulaire à la CATÉGORIE du livre. Réponds STRICTEMENT en JSON valide, sans markdown, en ${langLabel}.

TITRE: ${title}
${subtitle ? `SOUS-TITRE: ${subtitle}` : ""}
${category ? `CATÉGORIE: ${category}` : ""}
${intro ? `INTRODUCTION:\n${intro.slice(0, 4000)}` : ""}

Renvoie uniquement cet objet JSON:
{
  "cibleProfil": "string (1-2 phrases: âge, genre, situation, aspiration)",
  "cibleNiveau": "debutant" | "intermediaire" | "avance" | "tous",
  "cibleBesoins": "string (2-3 phrases: ce que le lecteur cherche)",
  "cibleFrustrations": "string (2-3 phrases: douleurs et blocages actuels)",
  "promesseCentrale": "string (1 phrase percutante)",
  "promesseBenefices": "- Bénéfice 1\\n- Bénéfice 2\\n- Bénéfice 3",
  "promesseDifferenciation": "string (1-2 phrases: ce qui rend ce livre unique)",
  "promesseEmotion": "string (3-5 mots: émotion visée)"
}`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${userKey}`;

    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.8,
          maxOutputTokens: 1500,
        },
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini error:", geminiRes.status, errText.slice(0, 500));
      if (geminiRes.status === 429) {
        return json(429, { error: "Limite Gemini atteinte. Réessaye dans quelques secondes." });
      }
      return json(502, { error: `Erreur Gemini (${geminiRes.status})` });
    }

    const geminiData = await geminiRes.json();
    const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    let parsed: Record<string, string>;
    try {
      parsed = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) return json(502, { error: "Réponse IA non parsable" });
      try { parsed = JSON.parse(match[0]); } catch { return json(502, { error: "JSON invalide" }); }
    }

    // Whitelist + sanitize niveau
    const allowedNiveaux = ["debutant", "intermediaire", "avance", "tous"];
    const niveau = allowedNiveaux.includes(parsed.cibleNiveau) ? parsed.cibleNiveau : "tous";

    return json(200, {
      cibleProfil: parsed.cibleProfil || "",
      cibleNiveau: niveau,
      cibleBesoins: parsed.cibleBesoins || "",
      cibleFrustrations: parsed.cibleFrustrations || "",
      promesseCentrale: parsed.promesseCentrale || "",
      promesseBenefices: parsed.promesseBenefices || "",
      promesseDifferenciation: parsed.promesseDifferenciation || "",
      promesseEmotion: parsed.promesseEmotion || "",
    });
  } catch (e: any) {
    console.error("autofill-target-promise error:", e?.message);
    return json(500, { error: e?.message || "Erreur serveur" });
  }
});
