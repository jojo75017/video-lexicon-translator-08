import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };

async function callGemini(sys: string, user: string, opts: { maxTokens?: number; temperature?: number } = {}) {
  const k = Deno.env.get("GEMINI_API_KEY"); if (!k) throw new Error("GEMINI_API_KEY non configurée.");
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${k}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ system_instruction: { parts: [{ text: sys }] }, contents: [{ role: "user", parts: [{ text: user }] }], generationConfig: { temperature: opts.temperature ?? 0.7, maxOutputTokens: opts.maxTokens ?? 2000 } }) });
  if (!r.ok) { const e = await r.text(); if (r.status === 429) throw { status: 429, message: "Limite Gemini." }; throw new Error(`Gemini: ${r.status}`); }
  const d = await r.json(); return d.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  try {
    const { title, subtitle, category, pages, format, targetAudience, language = 'fr' } = await req.json();
    if (!title || !category || !pages) return new Response(JSON.stringify({ error: 'Titre, catégorie et nombre de pages requis' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const prompt = `Tu es un expert en tarification Amazon KDP.\n\nAnalyse ce livre :\n- Titre : ${title}\n- Sous-titre : ${subtitle || 'Non spécifié'}\n- Catégorie : ${category}\n- Pages : ${pages}\n- Format : ${format || 'ebook + broché'}\n- Public : ${targetAudience || 'Grand public'}\n\nGénère un JSON avec: ebookPrice, paperbackPrice, competitorAnalysis, launchStrategy, revenueProjection, tips, kdpCategories, priceScore.\n\nRéponds UNIQUEMENT avec le JSON, sans markdown.`;

    const content = await callGemini('Tu es un expert en tarification Amazon KDP. Réponds uniquement en JSON valide.', prompt);
    let parsed;
    try { const c = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim(); parsed = JSON.parse(c); } catch { const s = content.indexOf('{'); const e = content.lastIndexOf('}'); if (s !== -1 && e !== -1) parsed = JSON.parse(content.substring(s, e + 1)); else throw new Error('Parse error'); }

    return new Response(JSON.stringify({ strategy: parsed }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error in generate-price-strategy:', error);
    return new Response(JSON.stringify({ error: error.message || 'Erreur interne' }), { status: error.status || 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
