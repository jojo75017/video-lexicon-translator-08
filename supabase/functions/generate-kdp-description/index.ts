import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, subtitle, genre, targetAudience, keywords, additionalInfo } = await req.json();

    if (!title) {
      return new Response(
        JSON.stringify({ error: "Le titre de l'ebook est requis" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY non configurée");
    }

    const systemPrompt = `Tu es un expert en copywriting Amazon KDP. Tu crées des descriptions de livres qui CONVERTISSENT les visiteurs en acheteurs.

Règles Amazon KDP pour les descriptions :
- Maximum 4000 caractères (espaces inclus)
- HTML autorisé : <b>, <i>, <br>, <h2> uniquement
- Pas de liens, pas d'images, pas de prix
- Les 3 premières lignes sont CRITIQUES (visibles sans cliquer "Lire plus")

Techniques de copywriting à utiliser :
- Hook puissant dans les 2 premières phrases
- Bénéfices > caractéristiques
- Bullet points avec émojis pour la lisibilité
- Preuve sociale implicite
- Appel à l'action subtil en fin

Génère le résultat en JSON strict avec cette structure :
{
  "descriptionComplete": "La description complète formatée en HTML (max 4000 chars)",
  "descriptionCourte": "Version courte pour les réseaux sociaux (max 300 chars)",
  "hook": "L'accroche principale seule",
  "bulletPoints": ["Bénéfice 1", "Bénéfice 2", "Bénéfice 3", "Bénéfice 4", "Bénéfice 5"],
  "callToAction": "L'appel à l'action final",
  "scorePersuasion": 85,
  "conseilsAmelioration": ["Conseil 1", "Conseil 2", "Conseil 3"],
  "motsClesSeo": ["mot1", "mot2", "mot3", "mot4", "mot5", "mot6", "mot7"],
  "tonaliteDetectee": "Informatif / Inspirant / Autoritaire / etc.",
  "structureAnalysis": {
    "hookScore": 85,
    "beneficesScore": 80,
    "ctaScore": 75,
    "seoScore": 90,
    "lisibiliteScore": 88
  }
}`;

    const userPrompt = `Génère une description Amazon KDP ultra-persuasive pour ce livre :

Titre : ${title}
${subtitle ? `Sous-titre : ${subtitle}` : ''}
${genre ? `Genre : ${genre}` : ''}
${targetAudience ? `Public cible : ${targetAudience}` : ''}
${keywords ? `Mots-clés à privilégier : ${keywords}` : ''}
${additionalInfo ? `Informations supplémentaires : ${additionalInfo}` : ''}

IMPORTANT : La description doit être optimisée pour la conversion Amazon ET le référencement.
Utilise les 7 mots-clés naturellement dans la description.`;

    console.log("Calling OpenAI for KDP description generation...");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_tokens: 3000,
        temperature: 0.8,
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI error:", response.status, errorText);
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requêtes atteinte, réessayez dans quelques instants." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error(`OpenAI error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    let result;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found");
      }
    } catch (e) {
      console.log("JSON parsing failed, creating fallback");
      result = {
        descriptionComplete: content,
        descriptionCourte: content.substring(0, 300),
        hook: "",
        bulletPoints: [],
        callToAction: "",
        scorePersuasion: 70,
        conseilsAmelioration: [],
        motsClesSeo: [],
        tonaliteDetectee: "Non déterminée",
        structureAnalysis: { hookScore: 70, beneficesScore: 70, ctaScore: 70, seoScore: 70, lisibiliteScore: 70 }
      };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Error in generate-kdp-description:", error);
    const errorMessage = error.name === 'AbortError' ? 'Timeout' : error.message;
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
