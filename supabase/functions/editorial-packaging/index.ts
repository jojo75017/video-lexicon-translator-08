import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };

async function callGemini(sys: string, user: string, opts: { maxTokens?: number; temperature?: number; timeout?: number } = {}) {
  const k = Deno.env.get("GEMINI_API_KEY"); if (!k) throw new Error("GEMINI_API_KEY non configurée.");
  const c = new AbortController(); const t = setTimeout(() => c.abort(), opts.timeout || 60000);
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${k}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ system_instruction: { parts: [{ text: sys }] }, contents: [{ role: "user", parts: [{ text: user }] }], generationConfig: { temperature: opts.temperature ?? 0.7, maxOutputTokens: opts.maxTokens ?? 2500 } }), signal: c.signal });
  clearTimeout(t); if (!r.ok) { const e = await r.text(); if (r.status === 429) throw { status: 429, message: "Limite Gemini." }; throw new Error(`Gemini: ${r.status}`); }
  const d = await r.json(); return d.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  try {
    const { bookTitle, bookSummary, authorName, targetAudience, genre } = await req.json();
    if (!bookTitle) return new Response(JSON.stringify({ error: "Le titre du livre est requis" }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const systemPrompt = `Tu es un expert en marketing éditorial et copywriting. Tu crées des éléments marketing qui convertissent.\n\nGénère les éléments suivants en JSON :\n{\n  "descriptionPersuasive": {\n    "courte": "... (max 150 caractères)",\n    "moyenne": "... (max 500 caractères)", \n    "longue": "... (max 1500 caractères)"\n  },\n  "texteCouverture": {\n    "quatriemeCouverture": "...",\n    "bandeauPromo": "..."\n  },\n  "presentationAuteur": {\n    "courte": "... (50 mots)",\n    "complete": "... (150 mots)"\n  },\n  "accroches": {\n    "principale": "...",\n    "alternatives": ["...", "...", "..."],\n    "reseauxSociaux": {\n      "twitter": "...",\n      "linkedin": "...",\n      "instagram": "..."\n    }\n  },\n  "argumentsVente": ["...", "...", "..."],\n  "objectionsBrisees": [\n    {\n      "objection": "...",\n      "reponse": "..."\n    }\n  ]\n}`;

    const userPrompt = `Génère le packaging marketing complet pour ce livre :\n\nTitre : ${bookTitle}\n${bookSummary ? `Résumé : ${bookSummary}` : ''}\n${authorName ? `Auteur : ${authorName}` : ''}\n${targetAudience ? `Public cible : ${targetAudience}` : ''}\n${genre ? `Genre : ${genre}` : ''}`;

    console.log("Gemini 3 Flash: editorial packaging...");
    const content = await callGemini(systemPrompt, userPrompt);
    let result;
    try { const m = content.match(/\{[\s\S]*\}/); result = m ? JSON.parse(m[0]) : null; if (!result) throw 0; } catch { result = { descriptionPersuasive: { courte: content.substring(0, 150), moyenne: content.substring(0, 500), longue: content }, texteCouverture: { quatriemeCouverture: "", bandeauPromo: "" }, presentationAuteur: { courte: "", complete: "" }, accroches: { principale: "", alternatives: [], reseauxSociaux: {} }, argumentsVente: [], objectionsBrisees: [] }; }

    return new Response(JSON.stringify(result), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error("Error in editorial-packaging:", error);
    return new Response(JSON.stringify({ error: error.name === 'AbortError' ? 'Timeout' : (error.message || 'Erreur') }), { status: error.status || 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
