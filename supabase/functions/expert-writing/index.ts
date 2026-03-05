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
    const { chapterTitle, chapterContext, targetAudience, expertise } = await req.json();

    if (!chapterTitle) {
      return new Response(
        JSON.stringify({ error: "Le titre du chapitre est requis" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY non configurée");
    }

    const systemPrompt = `Tu es un auteur professionnel publié sur Amazon KDP avec des milliers de ventes. Tu rédiges des chapitres de qualité PUBLICATION, prêts à être exportés en PDF et vendus.

STANDARDS DE QUALITÉ KDP (score minimum 9/10) :

1. STRUCTURE PROFESSIONNELLE :
   - Introduction engageante (2-3 phrases qui accrochent — PAS de "Dans ce chapitre, nous allons...")
   - Corps structuré avec sous-sections titrées (H2/H3)
   - Transitions fluides entre chaque section
   - Conclusion qui donne envie de lire le chapitre suivant (micro-cliffhanger)

2. STYLE D'ÉCRITURE HUMAIN (ANTI-IA OBLIGATOIRE) :
   - INTERDIT : "Il est important de noter que", "En effet", "De plus", "Par conséquent", "Il convient de", "Force est de constater", "Dans un monde où"
   - INTERDIT : phrases de plus de 25 mots consécutives sans ponctuation
   - INTERDIT : 3 phrases consécutives commençant par le même mot
   - OBLIGATOIRE : varier la longueur des phrases (courtes percutantes + longues descriptives)
   - OBLIGATOIRE : utiliser des métaphores originales (pas les clichés)
   - OBLIGATOIRE : inclure au moins 1 anecdote ou cas concret par section
   - Ton : conversationnel expert (comme un mentor qui partage son savoir)

3. VALEUR ACTIONNABLE :
   - Chaque section doit contenir au moins 1 conseil SPÉCIFIQUE et MESURABLE
   - Pas de généralités ("il faut être motivé") → Du concret ("consacrez 20 minutes chaque matin à...")
   - Inclure des exemples réels ou des études de cas
   - Terminer par une action concrète que le lecteur peut faire IMMÉDIATEMENT

4. LONGUEUR KDP :
   - Minimum 1500 mots par chapitre (idéal : 2000-3000)
   - Une page KDP ≈ 250 mots
   - Viser 6-12 pages par chapitre

5. FORMATAGE :
   - Sous-titres clairs et engageants (pas "Section 1" → "Les 3 erreurs qui vous coûtent cher")
   - Listes à puces pour les étapes/conseils
   - Citations ou encadrés pour les points clés
   - Espacement aéré pour la lisibilité sur Kindle

Réponds en JSON :
{
  "introduction": "Introduction engageante (2-3 phrases)",
  "sections": [
    {
      "titre": "Sous-titre accrocheur",
      "contenu": "Contenu détaillé avec exemples concrets (min 300 mots)",
      "exemple": "Anecdote ou cas pratique illustrant le point"
    }
  ],
  "synthese": "Résumé des 3 points clés à retenir",
  "actionConcrete": "UNE action spécifique à faire dans les 24h",
  "contenuComplet": "Le chapitre complet formaté, prêt pour export",
  "wordCount": 2000,
  "qualityScore": 9
}`;

    const userPrompt = `Rédige un chapitre PRÊT À PUBLIER sur Amazon KDP :

Titre du chapitre : ${chapterTitle}
${chapterContext ? `Contexte du livre : ${chapterContext}` : ''}
${targetAudience ? `Public cible : ${targetAudience}` : ''}
${expertise ? `Domaine d'expertise : ${expertise}` : ''}

RAPPELS CRITIQUES :
- Minimum 1500 mots (idéal 2000+)
- Style humain naturel — ZÉRO tic de langage IA
- Exemples concrets et actionnables
- Micro-cliffhanger en fin de chapitre`;

    console.log("Calling OpenAI for expert writing...");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000);

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
        max_tokens: 4000,
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

    console.log("OpenAI response received");

    let result;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        result = {
          contenuComplet: content,
          synthese: "",
          actionConcrete: ""
        };
      }
    } catch (e) {
      console.log("JSON parsing failed, using raw content");
      result = {
        contenuComplet: content,
        synthese: "",
        actionConcrete: ""
      };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Error in expert-writing:", error);
    const errorMessage = error.name === 'AbortError' ? 'Timeout - rédaction trop longue' : error.message;
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
