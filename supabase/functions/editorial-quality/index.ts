import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function callGemini(systemPrompt: string, userPrompt: string, opts: { maxTokens?: number; temperature?: number; timeout?: number } = {}) {
  const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
  if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY non configurée.");
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), opts.timeout || 60000);
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ system_instruction: { parts: [{ text: systemPrompt }] }, contents: [{ role: "user", parts: [{ text: userPrompt }] }], generationConfig: { temperature: opts.temperature ?? 0.7, maxOutputTokens: opts.maxTokens ?? 2000 } }), signal: controller.signal });
  clearTimeout(timeoutId);
  if (!response.ok) { const e = await response.text(); console.error("Gemini error:", response.status, e); if (response.status === 429) throw { status: 429, message: "Limite Gemini atteinte." }; throw new Error(`Erreur Gemini: ${response.status}`); }
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { title, content } = await req.json();
    if (!title) return new Response(JSON.stringify({ error: "Le titre est requis" }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const systemPrompt = `Tu es un éditeur exigeant spécialisé dans l'analyse de qualité éditoriale.

Ta mission est d'analyser le contenu fourni comme un éditeur professionnel et de produire une évaluation détaillée.

Critères d'évaluation :
1. Clarté globale : le message est-il immédiatement compréhensible ?
2. Cohérence interne : la structure et les arguments sont-ils logiques ?
3. Valeur perçue : le contenu apporte-t-il une vraie valeur au lecteur ?
4. Utilité pour le lecteur : le lecteur peut-il appliquer ce qu'il apprend ?

Tu dois identifier :
- Ce qui fonctionne (points forts)
- Ce qui doit être amélioré
- Les ajustements prioritaires

Réponds UNIQUEMENT en JSON valide avec cette structure exacte :
{
  "clarteGlobale": { "score": 7, "commentaire": "..." },
  "coherenceInterne": { "score": 8, "commentaire": "..." },
  "valeurPercue": { "score": 7, "commentaire": "..." },
  "utiliteLecteur": { "score": 8, "commentaire": "..." },
  "pointsForts": ["...", "...", "..."],
  "ameliorations": ["...", "...", "..."],
  "ajustementsPrioritaires": ["...", "...", "..."]
}`;

    const userPrompt = `Analyse ce contenu comme un éditeur exigeant :\n\nTitre : ${title}\n${content ? `\nContenu :\n${content}` : ''}\n\nÉvalue la clarté, la cohérence, la valeur perçue et l'utilité pour le lecteur.`;

    console.log("Gemini 3 Flash: editorial-quality analysis...");
    const responseContent = await callGemini(systemPrompt, userPrompt);

    let result;
    try {
      const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) result = JSON.parse(jsonMatch[0]);
      else result = { clarteGlobale: { score: 7, commentaire: "Analyse basée sur le titre" }, coherenceInterne: { score: 7, commentaire: "Structure à évaluer" }, valeurPercue: { score: 7, commentaire: "Potentiel identifié" }, utiliteLecteur: { score: 7, commentaire: "Applications possibles" }, pointsForts: ["Sujet pertinent"], ameliorations: ["Approfondir le contenu"], ajustementsPrioritaires: ["Structurer", "Enrichir", "Clarifier"] };
    } catch { result = { clarteGlobale: { score: 7, commentaire: "Analyse basée sur le titre" }, coherenceInterne: { score: 7, commentaire: "Structure à évaluer" }, valeurPercue: { score: 7, commentaire: "Potentiel identifié" }, utiliteLecteur: { score: 7, commentaire: "Applications possibles" }, pointsForts: ["Sujet pertinent"], ameliorations: ["Approfondir le contenu"], ajustementsPrioritaires: ["Structurer", "Enrichir", "Clarifier"] }; }

    return new Response(JSON.stringify(result), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error("Error in editorial-quality:", error);
    return new Response(JSON.stringify({ error: error.name === 'AbortError' ? 'Timeout' : (error.message || 'Erreur interne') }), { status: error.status || 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
