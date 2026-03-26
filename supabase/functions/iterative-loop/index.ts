import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };

async function callGemini(apiKey: string, sys: string, user: string, opts: { maxTokens?: number; temperature?: number; timeout?: number } = {}) {
  const c = new AbortController(); const t = setTimeout(() => c.abort(), opts.timeout || 90000);
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ system_instruction: { parts: [{ text: sys }] }, contents: [{ role: "user", parts: [{ text: user }] }], generationConfig: { temperature: opts.temperature ?? 0.7, maxOutputTokens: opts.maxTokens ?? 3000 } }), signal: c.signal });
  clearTimeout(t); if (!r.ok) { const e = await r.text(); if (r.status === 429) throw { status: 429, message: "Limite Gemini." }; throw new Error(`Gemini: ${r.status}`); }
  const d = await r.json(); return d.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  try {
    const { title, originalContent, recommendations, userApiKey} = await req.json();
    if (!userApiKey) return new Response(JSON.stringify({ error: "Clé API Gemini requise. Configurez votre clé dans Paramètres > Clés API." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!title) return new Response(JSON.stringify({ error: 'Title is required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const systemPrompt = `Tu es un éditeur numérique professionnel.\n\nMISSION : Amélioration itérative du contenu.\n\nObjectifs :\n- Plus de clarté\n- Plus de valeur\n- Plus de précision\n- Moins de longueur inutile\n\nRéponds UNIQUEMENT en JSON valide:\n{\n  "contenuAmeliore": "le contenu amélioré complet",\n  "changements": ["changement 1", "changement 2"],\n  "metriques": {\n    "clarte": {"avant": 6, "apres": 8},\n    "valeur": {"avant": 7, "apres": 9},\n    "precision": {"avant": 6, "apres": 8},\n    "concision": {"avant": 5, "apres": 8}\n  }\n}`;

    let userContent = `Titre: "${title}"\n\n`;
    if (originalContent) userContent += `Contenu original:\n${originalContent}\n\n`;
    if (recommendations) userContent += `Recommandations à appliquer:\n${recommendations}\n\n`;
    userContent += "Produis une version améliorée.";

    const content = await callGemini(userApiKey, systemPrompt, userContent);
    let improvement;
    try { const m = content.match(/\{[\s\S]*\}/); improvement = m ? JSON.parse(m[0]) : null; if (!improvement) throw 0; } catch { improvement = { contenuAmeliore: "Contenu amélioré...", changements: ["Amélioration de la structure"], metriques: { clarte: { avant: 6, apres: 8 }, valeur: { avant: 7, apres: 8 }, precision: { avant: 6, apres: 8 }, concision: { avant: 6, apres: 8 } } }; }

    return new Response(JSON.stringify({ improvement }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error in iterative-loop:', error);
    return new Response(JSON.stringify({ error: error.name === 'AbortError' ? 'Timeout' : (error.message || 'Erreur') }), { status: error.status || 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
