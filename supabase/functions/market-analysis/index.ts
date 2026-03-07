import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" };

async function callGemini(sys: string, user: string, opts: { maxTokens?: number; temperature?: number } = {}) {
  const k = Deno.env.get("GEMINI_API_KEY"); if (!k) throw new Error("GEMINI_API_KEY non configurée.");
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${k}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ system_instruction: { parts: [{ text: sys }] }, contents: [{ role: "user", parts: [{ text: user }] }], generationConfig: { temperature: opts.temperature ?? 0.7, maxOutputTokens: opts.maxTokens ?? 2000 } }) });
  if (!r.ok) { const e = await r.text(); if (r.status === 429) throw { status: 429, message: "Limite Gemini." }; throw new Error(`Gemini: ${r.status}`); }
  const d = await r.json(); return d.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { sujet, contexte } = await req.json();
    if (!sujet) return new Response(JSON.stringify({ error: "Le sujet est requis" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const systemPrompt = `Tu es un expert en SEO Amazon KDP et en analyse de marché pour ebooks numériques.\n\nIMPORTANT: Réponds UNIQUEMENT en JSON valide avec cette structure exacte:\n{\n  "nichePrincipale": "...",\n  "tailleMarche": "grand|moyen|niche",\n  "concurrenceNiveau": "faible|moyenne|forte",\n  "opportunite": "...",\n  "motsClésKDP": ["7 mots-clés"],\n  "justificationMotsCles": ["justification par mot-clé"],\n  "categoriesKDP": ["2 catégories Amazon"],\n  "categoriesSecondaires": ["3 catégories cachées"],\n  "prixOptimal": "...",\n  "potentielVentes": "...",\n  "attentesLecteurs": [{"element": "...", "impact": "élevé|moyen|faible"}],\n  "frustrationsNonResolues": [{"element": "...", "impact": "élevé|moyen|faible"}],\n  "anglesSousExploites": [{"element": "...", "impact": "élevé|moyen|faible"}],\n  "erreursFrequentes": [{"element": "...", "impact": "élevé|moyen|faible"}]\n}`;

    const userPrompt = `Analyse ce sujet d'ebook et génère 7 mots-clés KDP stratégiques:\n\nSUJET/TITRE: ${sujet}\n${contexte ? `CONTEXTE: ${contexte}` : ""}`;

    const content = await callGemini(systemPrompt, userPrompt);
    let analysis;
    try { const c = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim(); analysis = JSON.parse(c); } catch { analysis = { nichePrincipale: "Non déterminée", tailleMarche: "moyen", concurrenceNiveau: "moyenne", opportunite: "Analyse requise", motsClésKDP: [], categoriesKDP: [], prixOptimal: "À déterminer", potentielVentes: "À évaluer", attentesLecteurs: [{ element: "Contenu pratique", impact: "élevé" }], frustrationsNonResolues: [{ element: "Trop de théorie", impact: "élevé" }], anglesSousExploites: [{ element: "Approche personnalisée", impact: "élevé" }], erreursFrequentes: [{ element: "Structure trop complexe", impact: "élevé" }] }; }

    return new Response(JSON.stringify({ success: true, analysis }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Erreur market-analysis:", error);
    return new Response(JSON.stringify({ error: error.message || "Erreur interne" }), { status: error.status || 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
