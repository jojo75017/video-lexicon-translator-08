import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };

async function callGemini(sys: string, user: string, opts: { maxTokens?: number; temperature?: number; timeout?: number } = {}) {
  const k = Deno.env.get("GEMINI_API_KEY"); if (!k) throw new Error("GEMINI_API_KEY non configurée.");
  const c = new AbortController(); const t = setTimeout(() => c.abort(), opts.timeout || 60000);
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${k}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ system_instruction: { parts: [{ text: sys }] }, contents: [{ role: "user", parts: [{ text: user }] }], generationConfig: { temperature: opts.temperature ?? 0.9, maxOutputTokens: opts.maxTokens ?? 2000 } }), signal: c.signal });
  clearTimeout(t); if (!r.ok) { const e = await r.text(); if (r.status === 429) throw { status: 429, message: "Limite Gemini." }; throw new Error(`Gemini: ${r.status}`); }
  const d = await r.json(); return d.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  try {
    const { title, category, tone, targetMarket } = await req.json();
    if (!title) return new Response(JSON.stringify({ error: "Le titre de l'ebook est requis" }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const systemPrompt = `Tu es un expert en branding d'auteurs et en stratégie éditoriale Amazon KDP. Tu génères des noms de plume professionnels.\n\nGénère exactement 8 noms de plume en JSON strict :\n{\n  "penNames": [\n    { "name": "Prénom Nom", "style": "Classique / Moderne / etc.", "pourquoi": "Explication", "scoreImpact": 85, "marche": "FR / EN / International", "initiales": "P.N." }\n  ],\n  "conseilsStrategie": ["Conseil 1", "Conseil 2", "Conseil 3"],\n  "tendancesGenre": "Analyse des tendances"\n}`;

    const userPrompt = `Génère 8 noms de plume pour cet ebook :\n\nTitre : ${title}\n${category ? `Catégorie : ${category}` : ''}\n${tone ? `Tonalité : ${tone}` : ''}\n${targetMarket ? `Marché : ${targetMarket}` : 'Marché : Francophone'}`;

    const content = await callGemini(systemPrompt, userPrompt);
    let result;
    try { const m = content.match(/\{[\s\S]*\}/); result = m ? JSON.parse(m[0]) : null; if (!result) throw 0; } catch { result = { penNames: [], conseilsStrategie: [], tendancesGenre: content }; }

    return new Response(JSON.stringify(result), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error("Error in generate-pen-name:", error);
    return new Response(JSON.stringify({ error: error.name === 'AbortError' ? 'Timeout' : (error.message || 'Erreur') }), { status: error.status || 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
