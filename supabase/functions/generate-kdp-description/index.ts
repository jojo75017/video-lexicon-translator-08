import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };

async function callGemini(apiKey: string, sys: string, user: string, opts: { maxTokens?: number; temperature?: number; timeout?: number } = {}) {
  const c = new AbortController(); const t = setTimeout(() => c.abort(), opts.timeout || 60000);
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ system_instruction: { parts: [{ text: sys }] }, contents: [{ role: "user", parts: [{ text: user }] }], generationConfig: { temperature: opts.temperature ?? 0.7, maxOutputTokens: opts.maxTokens ?? 3000 } }), signal: c.signal });
  clearTimeout(t); if (!r.ok) { const e = await r.text(); if (r.status === 429) throw { status: 429, message: "Limite Gemini." }; throw new Error(`Gemini: ${r.status}`); }
  const d = await r.json(); return d.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  try {
    const { title, subtitle, genre, targetAudience, keywords, additionalInfo, userApiKey} = await req.json();
    if (!userApiKey) return new Response(JSON.stringify({ error: "Clé API Gemini requise. Configurez votre clé dans Paramètres > Clés API." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!title) return new Response(JSON.stringify({ error: "Le titre de l'ebook est requis" }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const systemPrompt = `Tu es un copywriter Amazon KDP avec 10 ans d'expérience en conversion de fiches produits Kindle.\n\nCONTRAINTES TECHNIQUES AMAZON KDP :\n- Maximum 4000 caractères\n- HTML autorisé UNIQUEMENT : <b>, <i>, <br>, <h2>\n- Les 3 premières lignes visibles sans cliquer "Lire plus"\n\nSTRUCTURE DE CONVERSION (AIDA) :\n1. HOOK (2 phrases max)\n2. PROBLÈME\n3. SOLUTION\n4. BÉNÉFICES (5-7 bullet points ✅)\n5. CRÉDIBILITÉ\n6. CTA\n\nGénère le résultat en JSON strict :\n{\n  "descriptionComplete": "Description HTML complète (max 4000 chars)",\n  "descriptionCourte": "Version réseaux sociaux (max 300 chars, sans HTML)",\n  "hook": "L'accroche seule",\n  "bulletPoints": ["✅ Bénéfice 1", "✅ Bénéfice 2"],\n  "callToAction": "Le CTA final",\n  "scorePersuasion": 85,\n  "conseilsAmelioration": ["Conseil 1", "Conseil 2"],\n  "motsClesSeo": ["mot1", "mot2"],\n  "tonaliteDetectee": "Informatif",\n  "structureAnalysis": { "hookScore": 85, "beneficesScore": 80, "ctaScore": 75, "seoScore": 90, "lisibiliteScore": 88 },\n  "charCount": 2500,\n  "amazonCompliant": true,\n  "complianceNotes": ["Note"]\n}`;

    const userPrompt = `Génère une description Amazon KDP pour :\n\nTitre : ${title}\n${subtitle ? `Sous-titre : ${subtitle}` : ''}\n${genre ? `Genre : ${genre}` : ''}\n${targetAudience ? `Public cible : ${targetAudience}` : ''}\n${keywords ? `Mots-clés SEO : ${keywords}` : ''}\n${additionalInfo ? `Contexte : ${additionalInfo}` : ''}`;

    const content = await callGemini(userApiKey, systemPrompt, userPrompt, { temperature: 0.7 });
    let result;
    try { const m = content.match(/\{[\s\S]*\}/); result = m ? JSON.parse(m[0]) : null; if (!result) throw 0; } catch { result = { descriptionComplete: content, descriptionCourte: content.substring(0, 300), hook: "", bulletPoints: [], callToAction: "", scorePersuasion: 70, conseilsAmelioration: [], motsClesSeo: [], tonaliteDetectee: "Non déterminée", structureAnalysis: { hookScore: 70, beneficesScore: 70, ctaScore: 70, seoScore: 70, lisibiliteScore: 70 }, charCount: content.length, amazonCompliant: false, complianceNotes: ["Vérifiez manuellement"] }; }

    return new Response(JSON.stringify(result), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error("Error in generate-kdp-description:", error);
    return new Response(JSON.stringify({ error: error.name === 'AbortError' ? 'Timeout' : (error.message || 'Erreur') }), { status: error.status || 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
