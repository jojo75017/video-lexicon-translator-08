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
    const { chapterTitle, chapterContent, mode, userProvider, userApiKey, userModel } = await req.json();
    const polish = mode === 'polish';

    if (!chapterContent || chapterContent.length < 20) {
      return new Response(
        JSON.stringify({ error: "Le contenu du chapitre est requis (minimum 20 caractères)" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
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
8. Remplacer par du français clair toute expression en latin, faux latin, langue morte, pseudo-langue ou mot inventé (ex. « Pactum intra cruorem, matrimonium intra cineres » → « Un pacte scellé dans le sang, un mariage scellé dans les cendres »), ainsi que les mots étrangers décoratifs. Exceptions : noms propres réels, titres d'œuvres réelles et locutions latines réellement courantes en français (a priori, etc.). Type de correction : "anglicisme".

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
7. Remplacer par du français clair toute expression en latin, faux latin, langue morte, pseudo-langue ou mot inventé, ainsi que les mots étrangers décoratifs, en conservant le sens et l'effet voulu. Exceptions : noms propres réels, titres d'œuvres réelles et locutions latines courantes en français.

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


    const userPrompt = `Corrige ce chapitre en respectant STRICTEMENT les consignes ${polish ? 'de correction et de polissage (zéro ajout d\'idée, zéro suppression de passage)' : 'de correction éditoriale (zéro réécriture, zéro ajout, zéro suppression)'} :

${chapterTitle ? `Titre du chapitre : "${chapterTitle}"\n` : ''}
---
${chapterContent}
---

Retourne le JSON avec le texte corrigé et la liste exhaustive des corrections effectuées.`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000);

    // Clé de l'abonné (BYOK) en priorité : aucun crédit Lovable consommé.
    const provider = (userProvider || '').toString().trim();
    const byoKey = (userApiKey || '').toString().trim();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    let endpoint = '';
    let headers: Record<string, string> = { 'Content-Type': 'application/json' };
    let body: Record<string, unknown> = {};
    let engine = 'lovable';

    if (byoKey && provider === 'gemini') {
      engine = 'gemini';
      endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${encodeURIComponent(byoKey)}`;
      body = {
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 8000 },
      };
    } else if (byoKey && provider === 'openai') {
      engine = 'openai';
      endpoint = 'https://api.openai.com/v1/chat/completions';
      headers.Authorization = `Bearer ${byoKey}`;
      body = { model: userModel || 'gpt-4o-mini', messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }], max_tokens: 8000 };
    } else if (byoKey && provider === 'claude') {
      engine = 'claude';
      endpoint = 'https://api.anthropic.com/v1/messages';
      headers['x-api-key'] = byoKey;
      headers['anthropic-version'] = '2023-06-01';
      body = { model: userModel || 'claude-3-5-haiku-20241022', max_tokens: 8000, system: systemPrompt, messages: [{ role: 'user', content: userPrompt }] };
    } else if (byoKey && provider === 'openrouter') {
      engine = 'openrouter';
      endpoint = 'https://openrouter.ai/api/v1/chat/completions';
      headers.Authorization = `Bearer ${byoKey}`;
      headers['HTTP-Referer'] = 'https://ebookstudio.fr';
      headers['X-Title'] = 'Correcteur - eBook Studio';
      body = { model: userModel || 'google/gemini-2.5-flash-lite', messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }], max_tokens: 8000 };
    } else {
      if (!LOVABLE_API_KEY) throw new Error("Aucune clé IA : configurez votre clé Gemini, ChatGPT, Claude ou OpenRouter dans Paramètres > Clés API.");
      endpoint = 'https://ai.gateway.lovable.dev/v1/chat/completions';
      headers.Authorization = `Bearer ${LOVABLE_API_KEY}`;
      body = { model: 'google/gemini-2.5-flash', messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }], max_tokens: 8000 };
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`AI error (${engine}):`, response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requêtes atteinte, réessayez dans quelques instants." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 401 || response.status === 403) {
        return new Response(
          JSON.stringify({ error: "Clé API refusée. Vérifiez votre clé dans Paramètres > Clés API." }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Crédits insuffisants sur votre compte IA." }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error(`AI error: ${response.status}`);
    }

    const data = await response.json();
    const content =
      engine === 'gemini'
        ? (data?.candidates?.[0]?.content?.parts?.[0]?.text || '')
        : engine === 'claude'
          ? (Array.isArray(data?.content) ? data.content.map((c: any) => c?.text || '').join('') : '')
          : (data?.choices?.[0]?.message?.content || '');

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

    return new Response(JSON.stringify({ ...result, engine }), {
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
