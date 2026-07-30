import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function callGemini(apiKey: string, sys: string, user: string, maxTokens = 2200): Promise<string> {
  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: sys }] },
        contents: [{ role: "user", parts: [{ text: user }] }],
        generationConfig: { temperature: 0.6, maxOutputTokens: maxTokens },
      }),
    },
  );
  if (!r.ok) {
    const e = await r.text();
    if (r.status === 429) throw { status: 429, message: "Limite Gemini atteinte. Réessayez dans quelques minutes." };
    if (r.status === 400 || r.status === 401 || r.status === 403)
      throw { status: r.status, message: "Clé API Gemini invalide ou expirée." };
    throw new Error(`Gemini ${r.status}: ${e.substring(0, 200)}`);
  }
  const d = await r.json();
  return d.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

function parseJson(text: string): any {
  const clean = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  const match = clean.match(/[\{\[][\s\S]*[\}\]]/);
  if (!match) throw new Error("Réponse IA illisible.");
  return JSON.parse(match[0]);
}

const SYS = "Tu es un expert en édition Amazon KDP et étude de marché du livre francophone avec 10 ans d'expérience. Réponds UNIQUEMENT en JSON valide sans markdown, sans commentaire.";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { tool, input, marketplace = "fr", userApiKey } = await req.json();
    const apiKey = (userApiKey || "").trim() || Deno.env.get("GEMINI_API_KEY");
    if (!apiKey)
      return json({ error: "Clé API Gemini requise. Configurez-la dans Paramètres > Clés API." }, 400);
    if (!tool) return json({ error: "Outil manquant" }, 400);

    let prompt = "";
    switch (tool) {
      case "keyword-explorer":
        prompt = `Analyse le potentiel du mot-clé Amazon KDP "${input}" (marché ${marketplace}). Renvoie ce JSON :
{"seed":"${input}","keywords":[{"keyword":"...","volume":"faible|moyen|élevé","competition":"faible|moyenne|élevée","score":0-100,"intent":"..."}],"longtail":["..."],"questions":["..."]}
Donne 12 mots-clés longue traîne pertinents et réalistes pour ce marché.`;
        break;
      case "ads-keywords":
        prompt = `Génère une liste de mots-clés Amazon Ads (Sponsored Products) pour un livre sur "${input}" (marché ${marketplace}). Renvoie ce JSON :
{"exact":["..."],"phrase":["..."],"broad":["..."],"negative":["..."],"suggestedBid":"fourchette €"}
15 mots-clés exact, 10 phrase, 10 broad, 8 négatifs.`;
        break;
      case "review-analysis":
        prompt = `Analyse les avis clients probables d'un livre Amazon KDP dans la niche "${input}" (marché ${marketplace}). Identifie ce que les lecteurs adorent et détestent, et les manques à combler. Renvoie ce JSON :
{"loved":["..."],"complaints":["..."],"gaps":["..."],"differentiation":["..."],"summary":"..."}`;
        break;
      case "niche-score":
        prompt = `Évalue la niche Amazon KDP "${input}" (marché ${marketplace}). Renvoie ce JSON :
{"niche":"${input}","profitability":0-100,"competition":0-100,"demand":0-100,"barrier":0-100,"verdict":"...","opportunities":["..."],"risks":["..."],"suggestedAngles":["..."],"keywords":["..."]}`;
        break;
      case "trademark":
        prompt = `Évalue le risque de marque déposée pour le titre/nom "${input}" à utiliser sur un livre (marché ${marketplace}, INPI France / EUIPO). Renvoie ce JSON :
{"term":"${input}","riskLevel":"faible|moyen|élevé","reasoning":"...","commonWordUse":true,"recommendations":["..."],"safeAlternatives":["..."],"officialCheck":"https://www.tmdn.org/tmview/"}
Rappelle que ce n'est pas un avis juridique.`;
        break;
      default:
        return json({ error: "Outil inconnu" }, 400);
    }

    const text = await callGemini(apiKey, SYS, prompt, 2600);
    const data = parseJson(text);
    return json({ success: true, data });
  } catch (error: any) {
    console.error("market-research error:", error);
    return json({ error: error?.message || "Erreur interne" }, error?.status || 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
