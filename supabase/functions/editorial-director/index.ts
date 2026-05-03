import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function callGemini(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  opts: { maxTokens?: number; temperature?: number; timeout?: number; jsonMode?: boolean } = {}
) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), opts.timeout || 90000);
  const generationConfig: any = {
    temperature: opts.temperature ?? 0.6,
    maxOutputTokens: opts.maxTokens ?? 3000,
  };
  if (opts.jsonMode) generationConfig.responseMimeType = "application/json";

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        generationConfig,
      }),
      signal: controller.signal,
    }
  );
  clearTimeout(timeoutId);
  if (!response.ok) {
    const errText = await response.text();
    console.error("Gemini error:", response.status, errText);
    if (response.status === 429) throw { status: 429, message: "Limite Gemini atteinte." };
    throw new Error(`Erreur Gemini: ${response.status}`);
  }
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

function tryParseJSON(content: string): any | null {
  try {
    let cleaned = content.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
    if (cleaned.startsWith("{")) return JSON.parse(cleaned);
    const m = cleaned.match(/\{[\s\S]*\}/);
    if (m) return JSON.parse(m[0]);
  } catch (e) {
    console.error("JSON parse failed:", e);
  }
  return null;
}

async function generateTitlesOnly(apiKey: string, sujet: string): Promise<any[]> {
  const systemPrompt = `Tu es un expert en titres de livres Amazon KDP best-sellers. Génère EXACTEMENT 5 titres alternatifs PERCUTANTS, tous différents du titre original et tous différents entre eux.

5 ANGLES OBLIGATOIRES (un par suggestion, dans cet ordre) :
1. Bénéfice chiffré ou résultat concret (ex: "en 30 jours", "x10", "+50%")
2. Urgence / FOMO (ex: "Avant qu'il soit trop tard", "2026", "Maintenant")
3. Méthode signature / système nommé (ex: "La Méthode X", "Le système Y")
4. Transformation identitaire (ex: "Devenez", "Pensez comme", "Le secret des")
5. Contre-intuitif / provocateur (ex: "Ce que personne ne dit sur", "Arrêtez de")

Réponds UNIQUEMENT avec ce JSON :
{"suggestionsTitle":[{"titre":"...","sousTitre":"...","scoreKdp":85,"raison":"..."},...5 items...]}

RÈGLES:
- titre: 3-7 mots accrocheurs
- sousTitre: 8-15 mots avec mots-clés Amazon
- scoreKdp: entier 70-95
- raison: 1 phrase courte expliquant l'angle`;

  const userPrompt = `Sujet/titre original: "${sujet}"\n\nGénère 5 titres alternatifs PERCUTANTS et VARIÉS pour ce sujet.`;
  const content = await callGemini(apiKey, systemPrompt, userPrompt, {
    maxTokens: 2000,
    temperature: 0.95,
    jsonMode: true,
    timeout: 45000,
  });
  const parsed = tryParseJSON(content);
  return Array.isArray(parsed?.suggestionsTitle) ? parsed.suggestionsTitle : [];
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { sujet, contexte, userApiKey, onlyTitles } = await req.json();

    if (!userApiKey) {
      return new Response(
        JSON.stringify({ error: "Clé API Gemini requise. Configurez votre clé dans Paramètres > Clés API." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (!sujet) {
      return new Response(JSON.stringify({ error: "Le sujet est requis" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Mode léger: régénérer uniquement les titres
    if (onlyTitles) {
      console.log("Editorial Director - onlyTitles pour:", sujet);
      const titles = await generateTitlesOnly(userApiKey, sujet);
      return new Response(JSON.stringify({ analysis: { suggestionsTitle: titles } }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `Tu es un directeur éditorial senior (20 ans Amazon KDP). Tu produis une stratégie éditoriale CONCISE et SPÉCIFIQUE au sujet donné.

RÈGLES ABSOLUES:
1. Reste sur le sujet exact, jamais de dérive.
2. Les 5 suggestionsTitle doivent être PERCUTANTES, DIFFÉRENTES du titre saisi et DIFFÉRENTES entre elles.
3. 5 ANGLES OBLIGATOIRES pour les 5 titres (un par item, dans l'ordre):
   1) Bénéfice chiffré (en 30j, x10, +50%)
   2) Urgence / FOMO (2026, maintenant)
   3) Méthode signature (La Méthode X)
   4) Transformation identitaire (Devenez, Pensez comme)
   5) Contre-intuitif (Arrêtez de, Ce que personne ne dit)
4. Réponds UNIQUEMENT en JSON valide.

FORMAT JSON STRICT (sois bref):
{
  "promesseCentrale": "1-2 phrases",
  "angleEditorial": "1-2 phrases",
  "cibleIdeale": "2-3 phrases",
  "erreursCourantes": ["e1","e2","e3","e4","e5"],
  "visionGlobale": "2-3 phrases",
  "suggestionsTitle": [
    {"titre":"3-7 mots","sousTitre":"8-15 mots","scoreKdp":85,"raison":"angle 1 - bénéfice chiffré"},
    {"titre":"3-7 mots","sousTitre":"8-15 mots","scoreKdp":80,"raison":"angle 2 - urgence"},
    {"titre":"3-7 mots","sousTitre":"8-15 mots","scoreKdp":90,"raison":"angle 3 - méthode"},
    {"titre":"3-7 mots","sousTitre":"8-15 mots","scoreKdp":82,"raison":"angle 4 - transformation"},
    {"titre":"3-7 mots","sousTitre":"8-15 mots","scoreKdp":88,"raison":"angle 5 - contre-intuitif"}
  ],
  "meilleurTitre": {"index":2,"explication":"1 phrase"},
  "titreOriginalScore": {"scoreKdp":65,"forces":"1 phrase","faiblesses":"1 phrase"}
}`;

    const userPrompt = `SUJET/TITRE ORIGINAL: "${sujet}"
${contexte ? `CONTEXTE: ${contexte}` : ""}

Produis la stratégie éditoriale + 5 titres alternatifs PERCUTANTS et VARIÉS (un par angle obligatoire).`;

    console.log("Editorial Director - Analyse pour:", sujet);

    const content = await callGemini(userApiKey, systemPrompt, userPrompt, {
      maxTokens: 8000,
      temperature: 0.85,
      jsonMode: true,
      timeout: 90000,
    });

    let analysis: any = tryParseJSON(content);

    if (!analysis || !analysis.promesseCentrale) {
      console.warn("Parse failed or incomplete, using fallback structure");
      analysis = {
        promesseCentrale: "Analyse partielle. Relancez pour un résultat complet.",
        angleEditorial: (content || "").substring(0, 300) || "À déterminer",
        cibleIdeale: "Lecteurs intéressés par " + sujet,
        erreursCourantes: ["Trop générique", "Manque de profondeur", "Pas de différenciation", "Structure floue", "Titre faible"],
        visionGlobale: "Vision à affiner.",
        suggestionsTitle: [],
        titreOriginalScore: { scoreKdp: 50, forces: "Sujet pertinent", faiblesses: "Titre à optimiser" },
      };
    }

    if (!Array.isArray(analysis.erreursCourantes)) {
      analysis.erreursCourantes = ["Contenu générique", "Manque de profondeur", "Pas de différenciation"];
    }
    if (!Array.isArray(analysis.suggestionsTitle)) analysis.suggestionsTitle = [];

    // Auto-complétion si moins de 5 titres -> appel sous-prompt dédié
    if (analysis.suggestionsTitle.length < 5) {
      console.log(`Seulement ${analysis.suggestionsTitle.length} titres reçus, génération complémentaire...`);
      try {
        const extra = await generateTitlesOnly(userApiKey, sujet);
        if (extra.length >= analysis.suggestionsTitle.length) {
          // Remplace par la liste plus complète
          analysis.suggestionsTitle = extra;
          if (!analysis.meilleurTitre) {
            const best = extra.reduce((acc, cur, i) => (cur.scoreKdp > (extra[acc]?.scoreKdp ?? 0) ? i : acc), 0);
            analysis.meilleurTitre = { index: best, explication: "Score KDP le plus élevé." };
          }
        }
      } catch (e) {
        console.error("Échec génération titres complémentaires:", e);
      }
    }

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in editorial-director:", error);
    const errorMessage = error.name === "AbortError" ? "Timeout - analyse trop longue, réessayez" : (error.message || "Erreur inconnue");
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: error.status || 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
