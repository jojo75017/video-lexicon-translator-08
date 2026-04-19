/**
 * Service centralisé pour les appels à l'API Gemini (Google AI Studio)
 * Remplace tous les appels directs à api.openai.com
 */

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

interface GeminiCallOptions {
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  timeout?: number;
}

/**
 * Appelle l'API Gemini avec un prompt et retourne le texte généré
 */
export async function callGemini(
  apiKey: string,
  prompt: string,
  options: GeminiCallOptions = {}
): Promise<string> {
  const {
    systemPrompt,
    temperature = 0.7,
    maxTokens = 2000,
    timeout = 60000,
  } = options;

  const model = 'gemini-2.5-flash';
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const body: any = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature,
      maxOutputTokens: maxTokens,
    },
  };

  if (systemPrompt) {
    body.system_instruction = { parts: [{ text: systemPrompt }] };
  }

  const doFetch = () => fetch(
    `${GEMINI_API_BASE}/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    }
  );

  try {
    let response = await doFetch();

    // Retry automatique en cas de 429 (quota momentané)
    if (response.status === 429) {
      console.warn('Gemini 429 — retry dans 30s...');
      await new Promise(r => setTimeout(r, 30000));
      response = await doFetch();
    }

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API error:', response.status, errText);
      if (response.status === 429) {
        throw new Error('Quota Gemini atteint. Patientez ~60s puis relancez la génération.');
      }
      if (response.status === 400 || response.status === 401 || response.status === 403) {
        throw new Error('Clé API Gemini invalide. Vérifiez votre clé sur aistudio.google.com');
      }
      throw new Error(`Erreur Gemini: ${response.status}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) throw new Error('Aucune réponse de Gemini');
    return content;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Timeout - la génération a pris trop de temps. Réessayez.');
    }
    throw error;
  }
}

/**
 * Appelle Gemini avec un historique de conversation multi-turn
 */
export async function callGeminiWithHistory(
  apiKey: string,
  messages: Array<{ role: 'user' | 'model'; text: string }>,
  options: GeminiCallOptions = {}
): Promise<string> {
  const {
    systemPrompt,
    temperature = 0.7,
    maxTokens = 2000,
    timeout = 60000,
  } = options;

  const model = 'gemini-2.5-flash';
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const body: any = {
    contents: messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
    generationConfig: {
      temperature,
      maxOutputTokens: maxTokens,
    },
  };

  if (systemPrompt) {
    body.system_instruction = { parts: [{ text: systemPrompt }] };
  }

  const doFetch = () => fetch(
    `${GEMINI_API_BASE}/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    }
  );

  try {
    let response = await doFetch();

    if (response.status === 429) {
      console.warn('Gemini 429 — retry dans 30s...');
      await new Promise(r => setTimeout(r, 30000));
      response = await doFetch();
    }

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API error:', response.status, errText);
      if (response.status === 429) {
        throw new Error('Quota Gemini atteint. Patientez ~60s puis relancez la génération.');
      }
      if (response.status === 400 || response.status === 401 || response.status === 403) {
        throw new Error('Clé API Gemini invalide. Vérifiez votre clé sur aistudio.google.com');
      }
      throw new Error(`Erreur Gemini: ${response.status}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) throw new Error('Aucune réponse de Gemini');
    return content;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Timeout - la génération a pris trop de temps. Réessayez.');
    }
    throw error;
  }
}

/**
 * Appelle Gemini et parse la réponse comme JSON
 */
export async function callGeminiJSON<T = any>(
  apiKey: string,
  prompt: string,
  options: GeminiCallOptions = {}
): Promise<T> {
  const content = await callGemini(apiKey, prompt, options);
  const cleanContent = content
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();
  
  try {
    return JSON.parse(cleanContent);
  } catch {
    // Try to extract JSON from the response
    const start = cleanContent.indexOf('{');
    const end = cleanContent.lastIndexOf('}');
    if (start !== -1 && end !== -1) {
      return JSON.parse(cleanContent.substring(start, end + 1));
    }
    // Try array
    const arrStart = cleanContent.indexOf('[');
    const arrEnd = cleanContent.lastIndexOf(']');
    if (arrStart !== -1 && arrEnd !== -1) {
      return JSON.parse(cleanContent.substring(arrStart, arrEnd + 1));
    }
    throw new Error('Impossible de parser la réponse JSON de Gemini');
  }
}
