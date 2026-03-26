import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };

async function callGemini(apiKey: string, sys: string, user: string, opts: { maxTokens?: number; temperature?: number; timeout?: number } = {}) {
  const c = new AbortController(); const t = setTimeout(() => c.abort(), opts.timeout || 60000);
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ system_instruction: { parts: [{ text: sys }] }, contents: [{ role: "user", parts: [{ text: user }] }], generationConfig: { temperature: opts.temperature ?? 0.7, maxOutputTokens: opts.maxTokens ?? 1500 } }), signal: c.signal });
  clearTimeout(t); if (!r.ok) { const e = await r.text(); if (r.status === 429) throw { status: 429, message: "Limite Gemini." }; throw new Error(`Gemini: ${r.status}`); }
  const d = await r.json(); return d.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  try {
    const { title, userApiKey} = await req.json();
    if (!userApiKey) return new Response(JSON.stringify({ error: "Clé API Gemini requise. Configurez votre clé dans Paramètres > Clés API." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!title) return new Response(JSON.stringify({ error: 'Title is required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const systemPrompt = `Tu es un éditeur numérique professionnel.\n\nMISSION : Créer la mémoire éditoriale de référence pour ce projet.\n\nDéfinis avec précision :\n1. La promesse centrale\n2. L'angle éditorial\n3. Le ton global\n4. Le niveau de profondeur\n5. Le profil du lecteur cible\n6. Les mots-clés de style\n\nRéponds UNIQUEMENT en JSON valide:\n{\n  "promesseCentrale": "...",\n  "angleEditorial": "...",\n  "tonGlobal": "...",\n  "niveauProfondeur": "...",\n  "lecteurCible": "...",\n  "motsClesStyle": ["mot1", "mot2", "mot3", "mot4", "mot5"]\n}`;

    const content = await callGemini(userApiKey, systemPrompt, `Titre de l'ebook: "${title}"\n\nCrée la mémoire éditoriale complète pour ce projet.`);
    let memory;
    try { const m = content.match(/\{[\s\S]*\}/); memory = m ? JSON.parse(m[0]) : null; if (!memory) throw 0; } catch { memory = { promesseCentrale: "Transformer le lecteur en expert", angleEditorial: "Approche pratique", tonGlobal: "Professionnel mais accessible", niveauProfondeur: "Intermédiaire à avancé", lecteurCible: "Professionnel cherchant à monter en compétence", motsClesStyle: ["clarté", "précision", "actionnable", "professionnel", "expert"] }; }

    return new Response(JSON.stringify({ memory }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error in editorial-memory:', error);
    return new Response(JSON.stringify({ error: error.name === 'AbortError' ? 'Timeout' : (error.message || 'Erreur') }), { status: error.status || 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
