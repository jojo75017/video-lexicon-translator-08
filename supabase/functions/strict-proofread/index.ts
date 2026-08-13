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
    const { chapterTitle, chapterContent, mode, userProvider, userApiKey, userModel, latinExpressions } =
      await req.json();
    const polish = mode === 'polish';
    const latinFix = mode === 'latin-fix';
    const endingFix = mode === 'ending-fix';

    const minLength = endingFix ? 5 : 20;
    if (!chapterContent || chapterContent.length < minLength) {
      return new Response(
        JSON.stringify({ error: `Le contenu du chapitre est requis (minimum ${minLength} caractères)` }),
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

    const flagged: string[] = Array.isArray(latinExpressions)
      ? latinExpressions.map((e: unknown) => String(e)).filter(Boolean).slice(0, 40)
      : [];

    const latinRules = `MISSION UNIQUE : éliminer tout latin, faux latin, langue morte, pseudo-langue, mot inventé et mot étranger décoratif de ce texte français.

TU DOIS :
1. Remplacer chaque expression concernée par du français clair, en conservant le sens, le rythme et l'effet voulu (ex. « Pactum intra cruorem, matrimonium intra cineres » → « Un pacte scellé dans le sang, un mariage scellé dans les cendres »).
2. Traiter en priorité ces expressions repérées dans le texte :
${flagged.length ? flagged.map((e) => `   - « ${e} »`).join('\n') : '   (aucune liste fournie : repère-les toi-même)'}
3. Parcourir aussi le reste du texte pour supprimer toute autre expression du même type.

TU NE DOIS RIEN CHANGER D'AUTRE : pas une virgule, pas un mot, pas un paragraphe en dehors de ces remplacements.
Exceptions à conserver : noms propres réels, titres d'œuvres réelles, locutions latines réellement courantes en français (a priori, de facto, etc.).
Type de correction à renvoyer pour chacun : "anglicisme".`;

    const endingRules = `MISSION UNIQUE : ce fragment est le DERNIER paragraphe d'un chapitre et sa fin est bancale (mot isolé, phrase sans point, virgule ou tiret orphelin).

TU DOIS :
1. Reprendre ce paragraphe À L'IDENTIQUE et le compléter par une à deux phrases de clôture, dans le même style, le même temps et la même voix narrative.
2. Terminer impérativement par un point (ou un point d'exclamation / d'interrogation si le ton l'exige).
3. Rester dans le prolongement immédiat du texte : aucune information nouvelle, aucun personnage nouveau, aucun événement nouveau, aucune ellipse temporelle.
4. Écrire un français impeccable : aucun mot latin, aucune langue étrangère, aucun mot inventé.

TU NE DOIS PAS : résumer, réécrire, raccourcir ni supprimer une phrase existante du paragraphe.
Type de correction à renvoyer : "style".`;

    const systemPrompt = `Tu es un correcteur éditorial professionnel francophone. ${
      endingFix
        ? "Tu complètes une fin de chapitre inachevée, sans rien réécrire d'autre."
        : latinFix
          ? 'Tu effectues une passe unique de francisation, sans aucune autre correction.'
          : `Tu appliques une correction ${polish ? 'STRICTE PUIS un polissage de style mesuré' : 'STRICTE sans aucune réécriture'}.`
    }

${endingFix ? endingRules : latinFix ? latinRules : polish ? polishRules : strictRules}


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


    const userPrompt = latinFix
      ? `Remplace par du français clair toutes les expressions en latin / faux latin / pseudo-langue de ce texte, et ne modifie rien d'autre :

${chapterTitle ? `Titre du chapitre : "${chapterTitle}"\n` : ''}
---
${chapterContent}
---

Retourne le JSON avec le texte intégral francisé et la liste des expressions remplacées.`
      : `Corrige ce chapitre en respectant STRICTEMENT les consignes ${polish ? 'de correction et de polissage (zéro ajout d\'idée, zéro suppression de passage)' : 'de correction éditoriale (zéro réécriture, zéro ajout, zéro suppression)'} :

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

    type Call = { engine: string; endpoint: string; headers: Record<string, string>; body: Record<string, unknown> };

    const buildByoCall = (): Call | null => {
      if (!byoKey) return null;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (provider === 'gemini') {
        return {
          engine: 'gemini',
          endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${encodeURIComponent(byoKey)}`,
          headers,
          body: {
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
            generationConfig: { temperature: 0.2, maxOutputTokens: 8000 },
          },
        };
      }
      if (provider === 'openai') {
        headers.Authorization = `Bearer ${byoKey}`;
        return {
          engine: 'openai',
          endpoint: 'https://api.openai.com/v1/chat/completions',
          headers,
          body: { model: userModel || 'gpt-4o-mini', messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }], max_tokens: 8000 },
        };
      }
      if (provider === 'claude') {
        headers['x-api-key'] = byoKey;
        headers['anthropic-version'] = '2023-06-01';
        return {
          engine: 'claude',
          endpoint: 'https://api.anthropic.com/v1/messages',
          headers,
          body: { model: userModel || 'claude-3-5-haiku-20241022', max_tokens: 8000, system: systemPrompt, messages: [{ role: 'user', content: userPrompt }] },
        };
      }
      if (provider === 'openrouter') {
        headers.Authorization = `Bearer ${byoKey}`;
        headers['HTTP-Referer'] = 'https://ebookstudio.fr';
        headers['X-Title'] = 'Correcteur - eBook Studio';
        return {
          engine: 'openrouter',
          endpoint: 'https://openrouter.ai/api/v1/chat/completions',
          headers,
          body: { model: userModel || 'google/gemini-2.5-flash-lite', messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }], max_tokens: 8000 },
        };
      }
      return null;
    };

    const buildFallbackCall = (): Call | null => {
      if (!LOVABLE_API_KEY) return null;
      return {
        engine: 'lovable',
        endpoint: 'https://ai.gateway.lovable.dev/v1/chat/completions',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${LOVABLE_API_KEY}` },
        body: { model: 'google/gemini-2.5-flash', messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }], max_tokens: 8000 },
      };
    };

    const runCall = async (call: Call) => {
      const response = await fetch(call.endpoint, {
        method: 'POST',
        headers: call.headers,
        body: JSON.stringify(call.body),
        signal: controller.signal,
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`AI error (${call.engine}):`, response.status, errorText);
        return { ok: false as const, status: response.status };
      }
      const data = await response.json();
      const content =
        call.engine === 'gemini'
          ? (data?.candidates?.[0]?.content?.parts?.[0]?.text || '')
          : call.engine === 'claude'
            ? (Array.isArray(data?.content) ? data.content.map((c: any) => c?.text || '').join('') : '')
            : (data?.choices?.[0]?.message?.content || '');
      return { ok: true as const, content };
    };

    const primary = buildByoCall() || buildFallbackCall();
    if (!primary) {
      throw new Error("Aucune clé IA : configurez votre clé Gemini, ChatGPT, Claude ou OpenRouter dans Paramètres > Clés API.");
    }

    let engine = primary.engine;
    let attempt = await runCall(primary);

    // Quota épuisé / clé refusée / limite de débit sur la clé de l'abonné :
    // on rejoue immédiatement sur le moteur de secours de la plateforme.
    if (!attempt.ok && primary.engine !== 'lovable' && [401, 402, 403, 429].includes(attempt.status)) {
      const fallback = buildFallbackCall();
      if (fallback) {
        console.log(`Repli sur le moteur de secours (${primary.engine} → lovable), statut ${attempt.status}`);
        engine = 'lovable';
        attempt = await runCall(fallback);
      }
    }

    clearTimeout(timeoutId);

    if (!attempt.ok) {
      if (attempt.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requêtes atteinte, réessayez dans quelques instants." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (attempt.status === 401 || attempt.status === 403) {
        return new Response(
          JSON.stringify({ error: "Clé API refusée. Vérifiez votre clé dans Paramètres > Clés API." }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (attempt.status === 402) {
        return new Response(
          JSON.stringify({ error: "Crédits insuffisants sur votre compte IA." }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error(`AI error: ${attempt.status}`);
    }

    const content = attempt.content;

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
