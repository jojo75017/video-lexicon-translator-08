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

    const systemPrompt = `Tu es un copywriter Amazon KDP avec 10 ans d'expérience en conversion de fiches produits Kindle. Tu crées des descriptions qui CONVERTISSENT les visiteurs en acheteurs.

CONTRAINTES TECHNIQUES AMAZON KDP (non-respect = suppression) :
- Maximum 4000 caractères (espaces inclus) — COMPTE CHAQUE CARACTÈRE
- HTML autorisé UNIQUEMENT : <b>, <i>, <br>, <h2>
- INTERDIT : <p>, <ul>, <li>, <a>, <img>, <div>, <span>, liens, images, prix, promotions
- Les 3 premières lignes sont visibles SANS cliquer "Lire plus" — elles doivent ACCROCHER

STRUCTURE DE CONVERSION ÉPROUVÉE (méthode AIDA adaptée Amazon) :
1. HOOK (2 phrases max) : Question provocante ou stat choc liée au problème du lecteur
2. PROBLÈME : Décris la douleur/frustration que le lecteur vit (empathie)
3. SOLUTION : Présente le livre comme LA solution — utilise "Dans ce guide, vous découvrirez..."
4. BÉNÉFICES : 5-7 bullet points commençant par ✅ — chaque point = un résultat CONCRET
5. CRÉDIBILITÉ : Mention subtile d'expertise ou de résultats ("Basé sur X années de recherche...")
6. CTA : "Scrollez vers le haut et cliquez sur ACHETER pour commencer dès aujourd'hui !"

RÈGLES DE COPYWRITING AMAZON :
- JAMAIS de superlatifs non vérifiables ("le meilleur livre du monde")
- Utiliser le VOUS, pas le "on" ou le "nous"
- Chaque bullet point = 1 bénéfice mesurable ou actionnable
- Intégrer naturellement 3-5 mots-clés SEO dans le texte (pas de keyword stuffing)
- Ton professionnel mais chaleureux — comme un expert qui aide un ami

ANTI-PATTERNS À ÉVITER :
- ❌ "Ce livre est parfait pour..." (trop générique)
- ❌ Lister le sommaire (pas de valeur)
- ❌ "Achetez maintenant" en premier (trop agressif)
- ✅ Montrer le RÉSULTAT que le lecteur obtiendra

Génère le résultat en JSON strict :
{
  "descriptionComplete": "Description HTML complète (max 4000 chars, vérifie le compte)",
  "descriptionCourte": "Version réseaux sociaux (max 300 chars, sans HTML)",
  "hook": "L'accroche seule (2 phrases max)",
  "bulletPoints": ["✅ Bénéfice concret 1", "✅ Bénéfice concret 2", "✅ Bénéfice concret 3", "✅ Bénéfice concret 4", "✅ Bénéfice concret 5"],
  "callToAction": "Le CTA final",
  "scorePersuasion": 85,
  "conseilsAmelioration": ["Conseil actionnable 1", "Conseil actionnable 2", "Conseil actionnable 3"],
  "motsClesSeo": ["mot1", "mot2", "mot3", "mot4", "mot5", "mot6", "mot7"],
  "tonaliteDetectee": "Informatif / Inspirant / Autoritaire / etc.",
  "structureAnalysis": {
    "hookScore": 85,
    "beneficesScore": 80,
    "ctaScore": 75,
    "seoScore": 90,
    "lisibiliteScore": 88
  },
  "charCount": 2500,
  "amazonCompliant": true,
  "complianceNotes": ["Note sur conformité"]
}`;

    const userPrompt = `Génère une description Amazon KDP PRÊTE À COLLER dans le tableau de bord KDP :

Titre : ${title}
${subtitle ? `Sous-titre : ${subtitle}` : ''}
${genre ? `Genre : ${genre}` : ''}
${targetAudience ? `Public cible : ${targetAudience}` : ''}
${keywords ? `Mots-clés SEO à intégrer naturellement : ${keywords}` : ''}
${additionalInfo ? `Contexte supplémentaire : ${additionalInfo}` : ''}

IMPORTANT : 
- La description DOIT faire entre 1500 et 3900 caractères (marge de sécurité sous les 4000)
- Utilise UNIQUEMENT <b>, <i>, <br>, <h2> comme balises HTML
- Les 3 premières lignes doivent donner envie de cliquer "Lire plus"
- Intègre les mots-clés naturellement, jamais de keyword stuffing`;

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
        temperature: 0.7,
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
        structureAnalysis: { hookScore: 70, beneficesScore: 70, ctaScore: 70, seoScore: 70, lisibiliteScore: 70 },
        charCount: content.length,
        amazonCompliant: false,
        complianceNotes: ["Parsing échoué — vérifiez manuellement"]
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
