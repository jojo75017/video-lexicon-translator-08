import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };

async function callGemini(sys: string, user: string, opts: { maxTokens?: number; temperature?: number; timeout?: number } = {}) {
  const k = Deno.env.get("GEMINI_API_KEY"); if (!k) throw new Error("GEMINI_API_KEY non configurée.");
  const c = new AbortController(); const t = setTimeout(() => c.abort(), opts.timeout || 90000);
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${k}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ system_instruction: { parts: [{ text: sys }] }, contents: [{ role: "user", parts: [{ text: user }] }], generationConfig: { temperature: opts.temperature ?? 0.7, maxOutputTokens: opts.maxTokens ?? 4000 } }), signal: c.signal });
  clearTimeout(t); if (!r.ok) { const e = await r.text(); if (r.status === 429) throw { status: 429, message: "Limite Gemini." }; throw new Error(`Gemini: ${r.status}`); }
  const d = await r.json(); return d.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  try {
    const { text, style, preserveStructure } = await req.json();
    if (!text) return new Response(JSON.stringify({ error: "Le texte à réécrire est requis" }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const systemPrompt = `Tu es un expert en réécriture éditoriale. Ta mission est de transformer des textes pour les rendre naturels et humains.\n\nÉléments à SUPPRIMER systématiquement :\n- "Il est important de noter que..."\n- "En conclusion..."\n- "Dans le monde actuel..."\n- Listes à puces excessives\n- Répétitions de mots-clés\n- Phrases trop longues (+ de 25 mots)\n- Adverbes inutiles\n\nÉléments à AJOUTER :\n- Transitions naturelles\n- Variations de longueur de phrases\n- Questions rhétoriques\n- Anecdotes ou exemples vivants\n\nRéponds en JSON :\n{\n  "texteReecrit": "...",\n  "modificationsApportees": ["...", "..."],\n  "scoreNaturalite": 85,\n  "suggestions": ["...", "..."]\n}`;

    const userPrompt = `Réécris ce texte pour qu'il soit naturel, fluide et crédible :\n\n---\n${text}\n---\n\n${style ? `Style souhaité : ${style}` : ''}\n${preserveStructure ? 'Préserve la structure globale du texte.' : ''}`;

    const content = await callGemini(systemPrompt, userPrompt);
    let result;
    try { const m = content.match(/\{[\s\S]*\}/); result = m ? JSON.parse(m[0]) : null; if (!result) throw 0; } catch { result = { texteReecrit: content, modificationsApportees: [], scoreNaturalite: 0, suggestions: [] }; }

    return new Response(JSON.stringify(result), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error("Error in natural-rewrite:", error);
    return new Response(JSON.stringify({ error: error.name === 'AbortError' ? 'Timeout' : (error.message || 'Erreur') }), { status: error.status || 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
