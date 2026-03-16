import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function callAI(systemPrompt: string, userPrompt: string, opts: { maxTokens?: number; temperature?: number; timeout?: number } = {}) {
  // Prefer GEMINI_API_KEY (user's own key), fallback to Lovable Gateway
  const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
  if (GEMINI_API_KEY) {
    return callGeminiFallback(GEMINI_API_KEY, systemPrompt, userPrompt, opts);
  }

  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("Aucune clé API configurée.");

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), opts.timeout || 90000);

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${LOVABLE_API_KEY}`,
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: opts.temperature ?? 0.6,
      max_tokens: opts.maxTokens ?? 3000,
    }),
    signal: controller.signal,
  });

  clearTimeout(timeoutId);

  if (!response.ok) {
    const errText = await response.text();
    console.error("AI Gateway error:", response.status, errText);
    if (response.status === 429) throw { status: 429, message: "Limite de requêtes atteinte. Réessayez dans quelques secondes." };
    throw new Error(`Erreur AI: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Aucune réponse de l'IA");
  return content;
}

async function callGeminiFallback(apiKey: string, systemPrompt: string, userPrompt: string, opts: any) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), opts.timeout || 90000);
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ system_instruction: { parts: [{ text: systemPrompt }] }, contents: [{ role: "user", parts: [{ text: userPrompt }] }], generationConfig: { temperature: opts.temperature ?? 0.6, maxOutputTokens: opts.maxTokens ?? 3000 } }), signal: controller.signal }
  );
  clearTimeout(timeoutId);
  if (!response.ok) { const errText = await response.text(); console.error("Gemini error:", response.status, errText); if (response.status === 429) throw { status: 429, message: "Limite Gemini atteinte." }; throw new Error(`Erreur Gemini: ${response.status}`); }
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sujet, contexte } = await req.json();

    if (!sujet) {
      return new Response(JSON.stringify({ error: "Le sujet est requis" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const systemPrompt = `Tu es un directeur éditorial senior avec 20 ans d'expérience dans l'édition de livres pratiques et de non-fiction. Tu es spécialisé dans la transformation d'expertise en ebooks professionnels à forte valeur commerciale sur Amazon KDP.

MISSION : Analyser le sujet/titre fourni et produire une stratégie éditoriale complète, précise et actionnable.

RÈGLES ABSOLUES :
1. Analyse UNIQUEMENT le sujet exact fourni par l'utilisateur. Ne dévie JAMAIS vers un autre sujet.
2. Chaque élément de ta réponse doit être SPÉCIFIQUE au sujet donné, pas générique.
3. Les suggestions de titres doivent rester dans la MÊME thématique que le sujet original.
4. Réponds UNIQUEMENT en JSON valide, sans texte avant ou après.

FORMAT DE RÉPONSE (JSON strict) :
{
  "promesseCentrale": "La promesse unique et spécifique que CE livre fait au lecteur (1-2 phrases, directement liée au sujet)",
  "angleEditorial": "L'angle différenciant qui distingue CE livre de la concurrence existante sur CE sujet (2-3 phrases concrètes)",
  "cibleIdeale": "Description précise du lecteur idéal pour CE sujet : son profil, ses besoins spécifiques, ses frustrations actuelles (3-4 phrases)",
  "erreursCourantes": ["Erreur spécifique au marché de CE sujet 1", "Erreur 2", "Erreur 3", "Erreur 4", "Erreur 5"],
  "visionGlobale": "Positionnement stratégique de CE livre sur le marché Amazon KDP, comment il se différencie et pourquoi il réussira (3-4 phrases)",
  "suggestionsTitle": [
    {"titre": "Titre Court (2-4 mots)", "sousTitre": "Sous-titre avec promesse et mots-clés (8-15 mots)", "scoreKdp": 85, "raison": "Justification du score en 1 phrase"},
    {"titre": "Titre Court 2", "sousTitre": "Sous-titre accrocheur", "scoreKdp": 78, "raison": "Justification"},
    {"titre": "Titre Court 3", "sousTitre": "Sous-titre avec bénéfice clair", "scoreKdp": 92, "raison": "Justification"},
    {"titre": "Titre Court 4", "sousTitre": "Sous-titre émotionnel", "scoreKdp": 70, "raison": "Justification"},
    {"titre": "Titre Court 5", "sousTitre": "Sous-titre pratique", "scoreKdp": 88, "raison": "Justification"}
  ],
  "meilleurTitre": {"index": 2, "explication": "Pourquoi ce titre est le meilleur choix (2-3 phrases)"},
  "titreOriginalScore": {"scoreKdp": 65, "forces": "Points forts concrets du titre actuel", "faiblesses": "Points faibles précis à améliorer"}
}

CRITÈRES DE SCORING KDP (0-100) :
- Titre court et mémorable, facile à retenir (brandable) : +20 pts
- Sous-titre contenant des mots-clés que les gens recherchent sur Amazon : +25 pts  
- Promesse claire et spécifique (pas vague) : +20 pts
- Différenciation par rapport aux livres existants sur le sujet : +15 pts
- Aspect émotionnel ou urgence (curiosité, désir, peur de rater) : +10 pts
- Langue naturelle, pas de jargon inutile : +10 pts

EXEMPLES DE BONS TITRES KDP :
- "Atomic Habits : Tiny Changes, Remarkable Results"
- "Deep Work : Rules for Focused Success in a Distracted World"  
- "IA Business : Automatisez Votre Entreprise et Gagnez 10h Par Semaine"
- "Copywriting : Les Mots Qui Vendent et Convertissent Vos Prospects en Clients"

IMPORTANT : Les 5 suggestions doivent toutes traiter du MÊME sujet que celui donné par l'utilisateur. Varie les angles (pratique, émotionnel, résultat, méthode, transformation) mais garde le même thème.`;

    const userPrompt = `Analyse ce sujet d'ebook et produis la stratégie éditoriale complète en JSON :

SUJET/TITRE : "${sujet}"
${contexte ? `\nCONTEXTE : ${contexte}` : ""}

Rappel : ta réponse doit être UNIQUEMENT du JSON valide, spécifique à "${sujet}".`;

    console.log("Editorial Director - Analyse pour:", sujet);

    const content = await callAI(systemPrompt, userPrompt, { maxTokens: 3000, temperature: 0.6 });

    let analysis;
    try {
      // Clean markdown fences and extract JSON
      let cleaned = content.trim();
      cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '');
      cleaned = cleaned.trim();
      
      if (cleaned.startsWith('{')) {
        analysis = JSON.parse(cleaned);
      } else {
        const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysis = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("No JSON found");
        }
      }

      // Validate required fields
      if (!analysis.promesseCentrale || !analysis.angleEditorial) {
        throw new Error("Missing required fields");
      }

      // Ensure arrays exist
      if (!Array.isArray(analysis.erreursCourantes)) {
        analysis.erreursCourantes = ["Contenu trop générique", "Manque de profondeur", "Pas de différenciation"];
      }
      if (!Array.isArray(analysis.suggestionsTitle)) {
        analysis.suggestionsTitle = [];
      }
    } catch (parseError) {
      console.error("JSON parse error:", parseError, "Content:", content.substring(0, 500));
      // Build a structured fallback from the text
      analysis = {
        promesseCentrale: "Analyse en cours de traitement. Veuillez relancer l'analyse.",
        angleEditorial: content.substring(0, 400) || "Angle à déterminer",
        cibleIdeale: "Lecteurs intéressés par " + sujet,
        erreursCourantes: ["Contenu générique", "Manque de profondeur", "Pas de différenciation", "Structure incohérente", "Titre mal optimisé"],
        visionGlobale: "Vision à affiner avec une nouvelle analyse.",
        suggestionsTitle: [],
        titreOriginalScore: { scoreKdp: 50, forces: "Sujet pertinent", faiblesses: "Titre à optimiser pour le référencement KDP" }
      };
    }

    return new Response(JSON.stringify({ analysis }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Error in editorial-director:", error);
    const errorMessage = error.name === 'AbortError' ? 'Timeout - analyse trop longue, réessayez' : (error.message || "Erreur inconnue");
    return new Response(JSON.stringify({ error: errorMessage }), { status: error.status || 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
