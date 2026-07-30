import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function callGemini(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  opts: { maxTokens?: number; temperature?: number; timeout?: number; jsonMode?: boolean; label?: string } = {}
): Promise<string> {
  const label = opts.label || "gemini";
  const timeoutMs = opts.timeout || 50000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    console.warn(`[${label}] timeout after ${timeoutMs}ms — aborting`);
    controller.abort();
  }, timeoutMs);

  const generationConfig: any = {
    temperature: opts.temperature ?? 0.6,
    maxOutputTokens: opts.maxTokens ?? 3000,
  };
  if (opts.jsonMode) generationConfig.responseMimeType = "application/json";

  const t0 = Date.now();
  console.log(`[${label}] calling Gemini (maxTokens=${generationConfig.maxOutputTokens}, timeout=${timeoutMs}ms)`);

  let response: Response;
  try {
    response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
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
  } catch (e: any) {
    clearTimeout(timeoutId);
    if (e?.name === "AbortError") {
      console.error(`[${label}] AbortError after ${Date.now() - t0}ms`);
      throw { status: 504, message: "Gemini n'a pas répondu à temps. Réessayez avec un sujet plus court." };
    }
    console.error(`[${label}] fetch failed:`, e?.message || e);
    throw new Error(`Erreur réseau Gemini: ${e?.message || e}`);
  }
  clearTimeout(timeoutId);
  console.log(`[${label}] HTTP ${response.status} in ${Date.now() - t0}ms`);

  if (!response.ok) {
    const errText = await response.text();
    console.error(`[${label}] Gemini error:`, response.status, errText.substring(0, 500));
    if (response.status === 429) throw { status: 429, message: "Limite Gemini atteinte. Patientez 1 min." };
    if (response.status === 400 || response.status === 401 || response.status === 403) {
      throw { status: 401, message: "Clé API Gemini invalide. Vérifiez sur aistudio.google.com (AIza...)." };
    }
    throw new Error(`Erreur Gemini ${response.status}: ${errText.substring(0, 200)}`);
  }
  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  console.log(`[${label}] received ${text.length} chars`);
  return text;
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
    timeout: 35000,
    label: "titles-only",
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

    let content = "";
    try {
      content = await callGemini(userApiKey, systemPrompt, userPrompt, {
        maxTokens: 6000,
        temperature: 0.85,
        jsonMode: true,
        timeout: 55000,
        label: "full-analysis",
      });
    } catch (e: any) {
      console.warn("Full analysis failed, falling back to titles-only:", e?.message || e);
      // Fallback gracieux : au moins renvoyer les 5 titres pour ne pas bloquer l'utilisateur
      try {
        const titles = await generateTitlesOnly(userApiKey, sujet);
        if (titles.length > 0) {
          const best = titles.reduce(
            (acc: number, cur: any, i: number) =>
              (cur?.scoreKdp ?? 0) > (titles[acc]?.scoreKdp ?? 0) ? i : acc,
            0
          );
          return new Response(
            JSON.stringify({
              analysis: {
                promesseCentrale: `Analyse rapide pour "${sujet}". Relancez pour la version complète.`,
                angleEditorial: "À affiner manuellement.",
                cibleIdeale: `Lecteurs intéressés par ${sujet}.`,
                erreursCourantes: ["Trop générique", "Manque de profondeur", "Pas de différenciation"],
                visionGlobale: "Vision à compléter.",
                suggestionsTitle: titles,
                meilleurTitre: { index: best, explication: "Score KDP le plus élevé." },
                titreOriginalScore: { scoreKdp: 60, forces: "Sujet pertinent", faiblesses: "Optimisable" },
              },
              partial: true,
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      } catch (e2) {
        console.error("Titles-only fallback failed too:", e2);
      }
      // Si même le fallback échoue, on renvoie une vraie erreur
      throw e;
    }

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

    const validTitles = (arr: any[]) =>
      arr.filter((t) => t && typeof t === "object" && typeof t.titre === "string" && t.titre.trim().length > 0);

    // Auto-complétion si moins de 5 titres valides -> appel sous-prompt dédié
    if (validTitles(analysis.suggestionsTitle).length < 5) {
      console.log(`Seulement ${validTitles(analysis.suggestionsTitle).length} titres valides, génération complémentaire...`);
      try {
        const extra = await generateTitlesOnly(userApiKey, sujet);
        const extraValid = validTitles(extra);
        if (extraValid.length >= 5) {
          analysis.suggestionsTitle = extraValid.slice(0, 5);
          const best = analysis.suggestionsTitle.reduce(
            (acc: number, cur: any, i: number) =>
              (cur.scoreKdp ?? 0) > (analysis.suggestionsTitle[acc]?.scoreKdp ?? 0) ? i : acc,
            0
          );
          analysis.meilleurTitre = { index: best, explication: "Score KDP le plus élevé." };
        } else if (extraValid.length > analysis.suggestionsTitle.length) {
          analysis.suggestionsTitle = extraValid;
        }
      } catch (e) {
        console.error("Échec génération titres complémentaires:", e);
      }
    }

    // Garantir titreOriginalScore non-null
    if (!analysis.titreOriginalScore || typeof analysis.titreOriginalScore.scoreKdp !== "number") {
      analysis.titreOriginalScore = {
        scoreKdp: 65,
        forces: "Sujet pertinent et compréhensible",
        faiblesses: "Manque d'accroche émotionnelle ou de bénéfice chiffré",
      };
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
