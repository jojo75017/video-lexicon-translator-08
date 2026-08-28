/**
 * Helper partagé ContentStudio — appels à la passerelle Lovable AI.
 * Réutilise le pattern de `complete-book-workflow` (header Lovable-API-Key).
 */
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const MAX_RETRIES = 2;

/** Règles éditoriales injectées dans tout prompt de rédaction (français strict). */
export const LANGUE_RULE =
  'Tous les textes générés doivent être 100 % en français courant. ' +
  'Interdit : latin, faux latin, langues mortes, mots inventés, pseudo-langues, ' +
  'anglicismes et mots étrangers décoratifs. ' +
  'Exceptions : noms propres réels, titres d’œuvres réelles, au maximum une locution ' +
  'latine réellement courante en français par chapitre. ' +
  'Les fins de chapitre doivent se terminer par une phrase complète avec un point.';

/** Appelle la passerelle Lovable AI (chat completions) avec retry borné. */
export async function callLovableAI(
  systemPrompt: string,
  userPrompt: string,
  maxTokens = 4096,
  retryCount = 0,
): Promise<string> {
  const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
  if (!lovableApiKey) {
    throw new Error('LOVABLE_AI_UNAVAILABLE: Le backend IA n’est pas configuré.');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 120000);

  try {
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Lovable-API-Key': lovableApiKey,
        'X-Lovable-AIG-SDK': 'edge-function-direct',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3.7-flash',
        messages: [
          { role: 'system', content: `${systemPrompt}\n\n${LANGUE_RULE}` },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: maxTokens,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const status = response.status;
      const errText = await response.text();
      console.error(`Lovable AI error ${status}: ${errText}`);

      if ((status === 429 || status === 503) && retryCount < MAX_RETRIES) {
        const waitSeconds = Math.min(10 * Math.pow(2, retryCount), 45);
        await new Promise((resolve) => setTimeout(resolve, waitSeconds * 1000));
        return await callLovableAI(systemPrompt, userPrompt, maxTokens, retryCount + 1);
      }
      if (status === 402) throw new Error('CREDITS_EXHAUSTED');
      throw new Error(`AI_GATEWAY_${status}: ${errText.slice(0, 300)}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) throw new Error('AI_GATEWAY_EMPTY: réponse vide.');
    return content as string;
  } finally {
    clearTimeout(timeoutId);
  }
}

/** Appelle la passerelle Lovable AI en demandant du JSON structuré. */
export async function callLovableAIJson<T>(
  systemPrompt: string,
  userPrompt: string,
  maxTokens = 4096,
): Promise<T> {
  const raw = await callLovableAI(
    `${systemPrompt}\n\nRéponds UNIQUEMENT avec un JSON valide, sans texte autour, sans bloc de code.`,
    userPrompt,
    maxTokens,
  );
  try {
    return JSON.parse(raw) as T;
  } catch {
    // Tente d'extraire le JSON d'un bloc markdown éventuel
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]) as T;
    throw new Error('AI_GATEWAY_JSON_INVALID: réponse non parsable.');
  }
}

/** Réponse JSON uniforme avec CORS. */
export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

/** Réponse d'erreur JSON uniforme avec CORS. */
export function jsonError(message: string, status = 500): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
