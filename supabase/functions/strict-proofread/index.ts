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
    const { chapterTitle, chapterContent, mode } = await req.json();
    const polish = mode === 'polish';

    if (!chapterContent || chapterContent.length < 20) {
      return new Response(
        JSON.stringify({ error: "Le contenu du chapitre est requis (minimum 20 caractères)" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY non configurée");
    }

    const strictRules = `RÈGLES ABSOLUES — TU NE DOIS JAMAIS :
- Modifier l'intrigue ou le sens
- Ajouter du contenu
- Supprimer des passages
- Reformuler de manière créative
- Modifier les dialogues (sauf fautes d'orthographe/grammaire)
- Changer la structure des chapitres
- Moderniser le style ou interpréter littérairement

TU DOIS UNIQUEMENT :
1. Corriger les fautes d'orthographe
2. Corriger les fautes de grammaire
3. Corriger les accords (genre, nombre, temps)
4. Corriger la ponctuation (virgules manquantes, points, tirets de dialogue)
5. Supprimer les anglicismes involontaires (remplacer par l'équivalent français)
6. Harmoniser les temps narratifs UNIQUEMENT en cas d'incohérence manifeste
7. Alléger les répétitions UNIQUEMENT si elles sont manifestement fautives (même mot 3+ fois dans la même phrase/paragraphe immédiat)

Le style de l'auteur doit rester STRICTEMENT identique.`;

    const polishRules = `RÈGLES ABSOLUES — TU NE DOIS JAMAIS :
- Modifier l'intrigue, les faits ou le sens
- Ajouter une idée, une scène ou un personnage
- Supprimer un passage narratif
- Changer la structure des chapitres
- Réécrire les dialogues sur le fond (seule la forme est corrigée)

TU DOIS :
1. Corriger l'orthographe, la grammaire, les accords et la ponctuation
2. Supprimer les anglicismes involontaires
3. Alléger les répétitions de mots et de tournures
4. Alléger les lourdeurs : phrases trop longues coupées, adverbes inutiles retirés, voix passive remplacée quand c'est plus net
5. Harmoniser les temps narratifs sur l'ensemble du chapitre
6. Fluidifier les enchaînements entre paragraphes sans changer leur contenu

La voix de l'auteur doit rester reconnaissable : polissage, pas réécriture.
Le nombre de mots doit rester dans une marge de ±10 % du texte original.`;

    const systemPrompt = `Tu es un correcteur éditorial professionnel francophone. Tu appliques une correction ${polish ? 'STRICTE PUIS un polissage de style mesuré' : 'STRICTE sans aucune réécriture'}.

${polish ? polishRules : strictRules}

Le texte corrigé doit être prêt pour publication Amazon KDP.

FORMAT DE RÉPONSE — JSON STRICT :
{
  "texteCorrige": "Le texte intégral corrigé",
  "corrections": [
    {
      "type": "orthographe|grammaire|accord|ponctuation|anglicisme|temps|repetition|style",
      "original": "texte original fautif",
      "corrige": "texte corrigé",
      "explication": "brève explication de la correction"
    }
  ],
  "nombreCorrections": 12,
  "qualiteOrthographe": 95
}`;


    const userPrompt = `Corrige ce chapitre en respectant STRICTEMENT les consignes de correction éditoriale (zéro réécriture, zéro ajout, zéro suppression) :

${chapterTitle ? `Titre du chapitre : "${chapterTitle}"\n` : ''}
---
${chapterContent}
---

Retourne le JSON avec le texte corrigé et la liste exhaustive des corrections effectuées.`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_tokens: 8000,
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requêtes atteinte, réessayez dans quelques instants." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Crédits insuffisants. Rechargez votre compte." }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error(`AI error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    let result;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        result = {
          texteCorrige: content,
          corrections: [],
          nombreCorrections: 0,
          qualiteOrthographe: 0
        };
      }
    } catch {
      console.log("JSON parsing failed, using raw content");
      result = {
        texteCorrige: content,
        corrections: [],
        nombreCorrections: 0,
        qualiteOrthographe: 0
      };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Error in strict-proofread:", error);
    const errorMessage = error.name === 'AbortError' ? 'Timeout — correction trop longue' : error.message;
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
