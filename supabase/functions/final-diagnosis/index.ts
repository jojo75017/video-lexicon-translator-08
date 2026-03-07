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
    const { title, author } = await req.json();
    if (!title) return new Response(JSON.stringify({ error: "Le titre est requis" }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const systemPrompt = `Tu es un consultant éditorial senior qui réalise le diagnostic final d'un projet de livre avant publication.\n\nRéponds UNIQUEMENT en JSON valide avec cette structure exacte :\n{\n  "verdictGlobal": "pret" ou "a_ameliorer",\n  "verdictMessage": "Message explicatif du verdict en 1-2 phrases",\n  "scoreClarte": 8,\n  "scoreValeurPercue": 7,\n  "scoreMoyen": 7.5,\n  "ameliorationsPrioritaires": [\n    {\n      "titre": "Titre court de l'amélioration",\n      "description": "Description détaillée de l'action à mener",\n      "impact": "critique" ou "important" ou "recommande"\n    }\n  ],\n  "recommandationsFinales": ["Recommandation 1", "Recommandation 2", "Recommandation 3"],\n  "conclusionEditoriale": "Conclusion professionnelle sur le projet"\n}\n\nLe verdict "pret" ne s'applique que si le score moyen est >= 7.5 et qu'il n'y a pas d'amélioration "critique".`;

    const userPrompt = `Fournis un diagnostic éditorial final pour ce projet de livre :\n\nTitre : "${title}"\nAuteur : ${author || 'Non spécifié'}`;

    const content = await callGemini(systemPrompt, userPrompt);
    let result;
    try { const m = content.match(/\{[\s\S]*\}/); result = m ? JSON.parse(m[0]) : null; if (!result) throw 0; } catch { result = { verdictGlobal: "a_ameliorer", verdictMessage: "Le projet nécessite quelques ajustements.", scoreClarte: 7, scoreValeurPercue: 7, scoreMoyen: 7, ameliorationsPrioritaires: [{ titre: "Clarifier la promesse", description: "Renforcer le message central", impact: "important" }], recommandationsFinales: ["Révision complète", "Test lecteur"], conclusionEditoriale: "Projet prometteur nécessitant des finitions." }; }

    return new Response(JSON.stringify(result), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error("Error in final-diagnosis:", error);
    return new Response(JSON.stringify({ error: error.name === 'AbortError' ? 'Timeout' : (error.message || 'Erreur') }), { status: error.status || 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
