import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version' };

async function callGemini(sys: string, user: string, opts: { maxTokens?: number; temperature?: number } = {}) {
  const k = Deno.env.get("GEMINI_API_KEY"); if (!k) throw new Error("GEMINI_API_KEY non configurée.");
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${k}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ system_instruction: { parts: [{ text: sys }] }, contents: [{ role: "user", parts: [{ text: user }] }], generationConfig: { temperature: opts.temperature ?? 0.7, maxOutputTokens: opts.maxTokens ?? 2000 } }) });
  if (!r.ok) { const e = await r.text(); if (r.status === 429) throw { status: 429, message: "Limite Gemini." }; throw new Error(`Gemini: ${r.status}`); }
  const d = await r.json(); return d.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  try {
    const { niche } = await req.json();
    if (!niche || niche.trim().length === 0) return new Response(JSON.stringify({ error: 'Niche requise' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const prompt = `Tu es un expert en édition de livres numériques et marketing Amazon KDP avec 10 ans d'expérience. Analyse en profondeur la niche suivante pour un ebook : "${niche.trim()}"\n\nRéponds en JSON avec: scoreRentabilite, scoreDetails, niveauConcurrence, forces, pointsAttention, demarquer, motsClesKdp, estimationRevenus.\n\nIMPORTANT : Les mots-clés doivent être des expressions longue traîne spécifiques à Amazon KDP. Sois précis et concret.`;

    const content = await callGemini('Tu es un expert en édition de livres numériques et marketing KDP Amazon. Réponds uniquement en JSON valide sans markdown.', prompt);
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Could not parse AI response');
    const analysis = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify({ analysis }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error in analyze-niche:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: error.status || 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
