import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };

async function callGemini(apiKey: string, sys: string, user: string, opts: { maxTokens?: number; temperature?: number; timeout?: number } = {}) {
  const c = new AbortController(); const t = setTimeout(() => c.abort(), opts.timeout || 60000);
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ system_instruction: { parts: [{ text: sys }] }, contents: [{ role: "user", parts: [{ text: user }] }], generationConfig: { temperature: opts.temperature ?? 0.7, maxOutputTokens: opts.maxTokens ?? 2000 } }), signal: c.signal });
  clearTimeout(t); if (!r.ok) { const e = await r.text(); if (r.status === 429) throw { status: 429, message: "Limite Gemini." }; throw new Error(`Gemini: ${r.status}`); }
  const d = await r.json(); return d.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  try {
    const { title, content, userApiKey} = await req.json();
    if (!userApiKey) return new Response(JSON.stringify({ error: "Clé API Gemini requise. Configurez votre clé dans Paramètres > Clés API." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!title) return new Response(JSON.stringify({ error: 'Title is required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const systemPrompt = `Tu es un éditeur numérique professionnel.\n\nMISSION : Créer une signature stylistique unique.\n\nRéponds UNIQUEMENT en JSON valide:\n{\n  "contenuUnifie": "le contenu avec style unifié",\n  "signatureStylistique": {\n    "ton": "description du ton adopté",\n    "rythme": "description du rythme",\n    "vocabulaire": "type de vocabulaire utilisé",\n    "structures": "type de structures de phrases"\n  },\n  "correctionsAppliquees": ["correction 1", "correction 2"],\n  "identiteEditoriale": "description de l'identité éditoriale créée"\n}`;

    const userContent = content ? `Titre: "${title}"\n\nContenu à uniformiser:\n${content}` : `Titre: "${title}"\n\nDéfinis la signature stylistique idéale pour ce projet.`;
    const responseContent = await callGemini(userApiKey, systemPrompt, userContent);
    let result;
    try { const m = responseContent.match(/\{[\s\S]*\}/); result = m ? JSON.parse(m[0]) : null; if (!result) throw 0; } catch { result = { contenuUnifie: "Contenu avec signature stylistique...", signatureStylistique: { ton: "Professionnel et accessible", rythme: "Fluide", vocabulaire: "Précis sans jargon", structures: "Variées" }, correctionsAppliquees: [], identiteEditoriale: "Voix d'expert pédagogue" }; }

    return new Response(JSON.stringify({ result }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error in style-signature:', error);
    return new Response(JSON.stringify({ error: error.name === 'AbortError' ? 'Timeout' : (error.message || 'Erreur') }), { status: error.status || 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
