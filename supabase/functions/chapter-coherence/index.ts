import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };

async function callGemini(sys: string, user: string, opts: { maxTokens?: number; temperature?: number; timeout?: number } = {}) {
  const k = Deno.env.get("GEMINI_API_KEY"); if (!k) throw new Error("GEMINI_API_KEY non configurée.");
  const c = new AbortController(); const t = setTimeout(() => c.abort(), opts.timeout || 60000);
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${k}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ system_instruction: { parts: [{ text: sys }] }, contents: [{ role: "user", parts: [{ text: user }] }], generationConfig: { temperature: opts.temperature ?? 0.7, maxOutputTokens: opts.maxTokens ?? 2000 } }), signal: c.signal });
  clearTimeout(t); if (!r.ok) { const e = await r.text(); if (r.status === 429) throw { status: 429, message: "Limite Gemini." }; throw new Error(`Gemini: ${r.status}`); }
  const d = await r.json(); return d.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  try {
    const { title, chaptersContent } = await req.json();
    if (!title) return new Response(JSON.stringify({ error: 'Title is required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const systemPrompt = `Tu es un éditeur numérique professionnel.\n\nMISSION : Analyser la cohérence globale inter-chapitres.\n\nVérifie :\n1. Cohérence des idées principales\n2. Continuité logique entre chapitres\n3. Absence de contradictions\n4. Progression pédagogique fluide\n\nRéponds UNIQUEMENT en JSON valide:\n{\n  "coherenceGlobale": "...",\n  "continuite": "...",\n  "contradictions": [\n    {"chapitre": "nom", "probleme": "description", "correction": "solution"}\n  ],\n  "progressionPedagogique": "...",\n  "score": 8,\n  "recommandations": ["rec1", "rec2", "rec3"]\n}`;

    const userContent = chaptersContent ? `Titre: "${title}"\n\nContenu des chapitres:\n${chaptersContent}` : `Titre: "${title}"\n\nAnalyse la cohérence potentielle basée sur ce titre.`;
    const content = await callGemini(systemPrompt, userContent);
    let analysis;
    try { const m = content.match(/\{[\s\S]*\}/); analysis = m ? JSON.parse(m[0]) : null; if (!analysis) throw 0; } catch { analysis = { coherenceGlobale: "Analyse non disponible", continuite: "Analyse non disponible", contradictions: [], progressionPedagogique: "Analyse non disponible", score: 7, recommandations: ["Fournir le contenu des chapitres pour une analyse détaillée"] }; }

    return new Response(JSON.stringify({ analysis }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error in chapter-coherence:', error);
    return new Response(JSON.stringify({ error: error.name === 'AbortError' ? 'Timeout' : (error.message || 'Erreur') }), { status: error.status || 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
