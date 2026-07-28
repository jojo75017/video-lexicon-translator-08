// Génère la fiche KDP (description + 7 mots-clés + 3 catégories Amazon)
// pour un livre jeunesse. Utilise Lovable AI Gateway (aucune clé requise).
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY") ?? "";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const {
      title,
      subtitle,
      authorName,
      synopsis,
      targetAge,
      characterName,
      storyTitles = [],
    } = await req.json();

    if (!title) {
      return new Response(JSON.stringify({ error: "title requis" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY manquante" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const sys = `Tu es un expert Amazon KDP spécialisé dans les livres jeunesse français (0-8 ans).
Tu produis des fiches produit optimisées pour la découvrabilité Amazon.
Tu réponds UNIQUEMENT avec un JSON strict, sans texte autour, sans balises markdown.

Schéma :
{
  "description": "string — description Amazon en français, 1200 à 2500 caractères, structure : accroche émotionnelle (2 lignes), ce que l'enfant va vivre, points clés en 5 puces courtes commençant par ✨, phrase pour les parents, appel à l'action. HTML autorisé : <b>, <i>, <br>.",
  "keywords": ["7 mots-clés OU expressions performants Amazon KDP, en français, ≤ 50 caractères chacun, sans doublon, sans le titre ni le nom de l'auteur, pensés recherche parents (ex : 'histoire du soir 4 ans', 'livre pour apprendre à dormir seul')"],
  "categories": ["3 catégories Amazon.fr — chemin COMPLET tel qu'affiché sur KDP", "ex : 'Livres > Livres pour enfants > 3-5 ans > Histoires du soir'", "3 catégories DIFFÉRENTES et pertinentes au thème"]
}

Contraintes strictes :
- keywords : exactement 7 éléments
- categories : exactement 3 éléments, chemins Amazon RÉELS existants sur KDP (rayon Livres jeunesse)
- Aucun texte hors JSON.`;

    const user = `Livre jeunesse à publier sur Amazon KDP.
Titre : ${title}
${subtitle ? `Sous-titre : ${subtitle}` : ""}
Auteur : ${authorName || "(non précisé)"}
Tranche d'âge : ${targetAge || "3-6 ans"}
Personnage principal : ${characterName || "(non précisé)"}
Synopsis : ${synopsis || "(non précisé)"}
${storyTitles.length ? `Histoires incluses :\n- ${storyTitles.slice(0, 15).join("\n- ")}` : ""}

Génère la fiche produit KDP JSON.`;

    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: sys },
          { role: "user", content: user },
        ],
        temperature: 0.7,
      }),
    });

    if (!r.ok) {
      const t = await r.text();
      return new Response(JSON.stringify({ error: `AI Gateway ${r.status}: ${t.slice(0, 200)}` }), {
        status: r.status === 429 ? 429 : 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await r.json();
    const raw: string = data?.choices?.[0]?.message?.content ?? "";
    const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
    const match = cleaned.match(/\{[\s\S]*\}/);
    let parsed: any = null;
    try {
      parsed = match ? JSON.parse(match[0]) : JSON.parse(cleaned);
    } catch {
      parsed = null;
    }
    if (!parsed || !parsed.description) {
      return new Response(JSON.stringify({ error: "Réponse IA non exploitable", raw }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Normalisation sécuritaire
    const keywords: string[] = Array.isArray(parsed.keywords) ? parsed.keywords.slice(0, 7) : [];
    while (keywords.length < 7) keywords.push("");
    const categories: string[] = Array.isArray(parsed.categories) ? parsed.categories.slice(0, 3) : [];
    while (categories.length < 3) categories.push("");

    return new Response(
      JSON.stringify({
        description: String(parsed.description || "").slice(0, 4000),
        keywords: keywords.map((k) => String(k).slice(0, 50)),
        categories: categories.map((c) => String(c).slice(0, 200)),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "Erreur inconnue" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
