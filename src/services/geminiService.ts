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
  jsonMode?: boolean;
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
    maxTokens = 8192,
    timeout = 60000,
    jsonMode = false,
  } = options;

  const model = 'gemini-2.5-flash';
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const generationConfig: any = {
    temperature,
    maxOutputTokens: maxTokens,
  };
  if (jsonMode) {
    generationConfig.responseMimeType = 'application/json';
  }

  const body: any = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig,
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
    const finishReason = data.candidates?.[0]?.finishReason;
    if (!content) {
      console.error('Gemini réponse vide. finishReason:', finishReason, 'data:', JSON.stringify(data).slice(0, 500));
      if (finishReason === 'MAX_TOKENS') {
        throw new Error('Réponse Gemini tronquée (limite de tokens). Réessayez ou réduisez la longueur du prompt.');
      }
      if (finishReason === 'SAFETY') {
        throw new Error('Réponse Gemini bloquée par les filtres de sécurité. Reformulez votre demande.');
      }
      throw new Error('Aucune réponse de Gemini');
    }
    if (finishReason === 'MAX_TOKENS') {
      console.warn('[Gemini] Réponse possiblement tronquée (MAX_TOKENS)');
    }
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
 * Tente de réparer une chaîne JSON potentiellement tronquée ou malformée
 */
function tryRepairJson(input: string): string {
  let s = input
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim();

  // Trouver la borne d'ouverture
  const firstBrace = s.indexOf('{');
  const firstBracket = s.indexOf('[');
  let start = -1;
  let isArray = false;
  if (firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) {
    start = firstBracket;
    isArray = true;
  } else if (firstBrace !== -1) {
    start = firstBrace;
  }
  if (start === -1) return s;

  s = s.substring(start);

  // Borne de fermeture explicite si présente
  const lastClose = isArray ? s.lastIndexOf(']') : s.lastIndexOf('}');
  if (lastClose !== -1) {
    s = s.substring(0, lastClose + 1);
  }

  // Supprimer virgules trailing
  s = s.replace(/,(\s*[}\]])/g, '$1');

  // Si JSON tronqué, fermer en équilibrant les braces/brackets ouverts (en ignorant ceux dans les strings)
  let openBrace = 0, openBracket = 0;
  let inString = false, escape = false;
  let lastValidEnd = -1;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (escape) { escape = false; continue; }
    if (c === '\\') { escape = true; continue; }
    if (c === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (c === '{') openBrace++;
    else if (c === '}') openBrace--;
    else if (c === '[') openBracket++;
    else if (c === ']') openBracket--;
    if (openBrace === 0 && openBracket === 0) lastValidEnd = i;
  }

  // Si déséquilibré, on tronque à la dernière virgule avant le déséquilibre puis on ferme
  if (openBrace > 0 || openBracket > 0 || inString) {
    // Tronquer à la dernière virgule "saine"
    let truncateAt = -1;
    let ob = 0, obk = 0, str = false, esc = false;
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (esc) { esc = false; continue; }
      if (c === '\\') { esc = true; continue; }
      if (c === '"') { str = !str; continue; }
      if (str) continue;
      if (c === '{') ob++;
      else if (c === '}') ob--;
      else if (c === '[') obk++;
      else if (c === ']') obk--;
      if (c === ',' && ((isArray && obk === 1 && ob === 0) || (!isArray && ob === 1 && obk === 0))) {
        truncateAt = i;
      }
    }
    if (truncateAt > 0) {
      s = s.substring(0, truncateAt);
    }
    // Fermer ce qui reste
    let ob2 = 0, obk2 = 0, str2 = false, esc2 = false;
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (esc2) { esc2 = false; continue; }
      if (c === '\\') { esc2 = true; continue; }
      if (c === '"') { str2 = !str2; continue; }
      if (str2) continue;
      if (c === '{') ob2++;
      else if (c === '}') ob2--;
      else if (c === '[') obk2++;
      else if (c === ']') obk2--;
    }
    if (str2) s += '"';
    while (ob2-- > 0) s += '}';
    while (obk2-- > 0) s += ']';
  }

  return s;
}

/**
 * Appelle Gemini et parse la réponse comme JSON (avec responseMimeType + réparation + retry)
 */
export async function callGeminiJSON<T = any>(
  apiKey: string,
  prompt: string,
  options: GeminiCallOptions = {}
): Promise<T> {
  const tryParse = (content: string): T | null => {
    try { return JSON.parse(content) as T; } catch {}
    const repaired = tryRepairJson(content);
    try { return JSON.parse(repaired) as T; } catch {}
    return null;
  };

  // 1ère tentative : jsonMode
  let lastRaw = '';
  try {
    const content = await callGemini(apiKey, prompt, { ...options, jsonMode: true });
    lastRaw = content;
    const parsed = tryParse(content);
    if (parsed !== null) return parsed;
  } catch (e) {
    console.warn('[Gemini JSON] 1ère tentative échouée:', (e as any)?.message);
  }

  // 2e tentative : prompt renforcé strict JSON
  try {
    const stricter = `${prompt}\n\nIMPORTANT : Réponds UNIQUEMENT avec du JSON valide, sans aucun texte avant ni après, sans balises markdown, sans commentaires.`;
    const content = await callGemini(apiKey, stricter, { ...options, jsonMode: true, temperature: 0.3 });
    lastRaw = content;
    const parsed = tryParse(content);
    if (parsed !== null) return parsed;
  } catch (e) {
    console.warn('[Gemini JSON] 2e tentative échouée:', (e as any)?.message);
  }

  console.error('[Gemini JSON] Échec parsing après 2 tentatives. Brut:', lastRaw.slice(0, 800));
  throw new Error('Impossible de parser la réponse JSON de Gemini. Relancez la génération.');
}

/**
 * Extrait des mots-clés depuis une réponse texte libre (fallback ultime).
 * Accepte JSON, listes à puces, lignes simples, séparateurs variés.
 */
export function extractKeywordsFromText(raw: string, max = 7): string[] {
  if (!raw) return [];
  let text = raw.replace(/```json|```/gi, '').trim();

  // Tentative JSON tableau de strings
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) {
      return parsed
        .map((x: any) => (typeof x === 'string' ? x : (x?.keyword || x?.mot || x?.term || '')))
        .map((s: string) => s.trim())
        .filter(Boolean)
        .slice(0, max);
    }
    if (parsed && Array.isArray((parsed as any).keywords)) {
      return (parsed as any).keywords
        .map((x: any) => (typeof x === 'string' ? x : (x?.keyword || '')))
        .map((s: string) => s.trim())
        .filter(Boolean)
        .slice(0, max);
    }
  } catch {}

  // Extraire tout ce qui ressemble à "..." dans la réponse
  const quoted = Array.from(text.matchAll(/"([^"\n]{2,80})"/g)).map(m => m[1].trim());
  if (quoted.length >= 3) {
    return Array.from(new Set(quoted)).slice(0, max);
  }

  // Découpe par lignes / puces / virgules
  const lines = text
    .split(/\r?\n/)
    .map(l => l.replace(/^[\s\-*•\d.\)]+/, '').trim())
    .filter(l => l && !/^[\{\}\[\],]+$/.test(l));

  let candidates: string[] = [];
  if (lines.length >= 3) {
    candidates = lines;
  } else {
    candidates = text.split(/[,;\n]/).map(s => s.trim()).filter(Boolean);
  }

  candidates = candidates
    .map(s => s.replace(/^["'`]+|["'`,.]+$/g, '').trim())
    .filter(s => s.length >= 2 && s.length <= 80 && !/^(json|keywords?|mots?-?cl[eé]s?)\s*[:=]?$/i.test(s));

  return Array.from(new Set(candidates)).slice(0, max);
}

