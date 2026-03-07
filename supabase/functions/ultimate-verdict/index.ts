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
    const { title, content } = await req.json();
    if (!title) return new Response(JSON.stringify({ error: 'Title is required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const systemPrompt = `Tu es un éditeur numérique professionnel.\n\nMISSION : Rendre un verdict éditorial final.\n\nRÈGLES :\n- Jamais de flatterie vide\n- Verdict clair et professionnel\n- Focus sur : structure, cohérence, valeur lecteur, crédibilité\n\nRéponds UNIQUEMENT en JSON valide:\n{\n  "publiable": true,\n  "verdictEditorial": "...",\n  "niveauGlobal": "intermediaire",\n  "risques": ["..."],\n  "pointsForts": ["..."],\n  "recommandationFinale": "...",\n  "scoresDetailles": {\n    "coherence": 8,\n    "valeur": 7,\n    "credibilite": 8\n  },\n  "certificat": "Ce projet a été évalué et validé par le système éditorial."\n}`;

    const userContent = content ? `Titre: "${title}"\n\nContenu à évaluer:\n${content}` : `Titre: "${title}"\n\nÉvalue le potentiel éditorial de ce projet.`;
    const responseContent = await callGemini(systemPrompt, userContent);
    let verdict;
    try { const m = responseContent.match(/\{[\s\S]*\}/); verdict = m ? JSON.parse(m[0]) : null; if (!verdict) throw 0; } catch { verdict = { publiable: true, verdictEditorial: "Projet avec potentiel.", niveauGlobal: "intermediaire", risques: ["Évaluation complète requise"], pointsForts: ["Titre pertinent"], recommandationFinale: "Soumettre le contenu complet.", scoresDetailles: { coherence: 7, valeur: 7, credibilite: 7 }, certificat: "Pré-évalué par le système." }; }

    return new Response(JSON.stringify({ verdict }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error in ultimate-verdict:', error);
    return new Response(JSON.stringify({ error: error.name === 'AbortError' ? 'Timeout' : (error.message || 'Erreur') }), { status: error.status || 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
