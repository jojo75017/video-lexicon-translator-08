/**
 * Service centralisé pour les appels à l'API Gemini (Google AI Studio)
 * Remplace tous les appels directs à api.openai.com
 */

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

/** Modèles essayés dans l'ordre : si le 1er sature (429/503) OU n'est plus
 *  disponible (404), on bascule automatiquement sur le suivant. Les alias
 *  "-latest" pointent toujours vers une version servie par Google, ce qui
 *  évite les 404 quand une version datée est retirée. */
const MODEL_FALLBACKS = [
  'gemini-flash-latest',
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-2.5-flash-lite',
  'gemini-flash-lite-latest',
];

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

function sanitizeGeminiApiKey(value: string): string {
  return (value || '')
    .replace(/[\u200B-\u200D\uFEFF\u00A0]/g, '')
    .replace(/["'`]/g, '')
    .replace(/\s+/g, '')
    .trim();
}

interface GeminiCallOptions {
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  timeout?: number;
  jsonMode?: boolean;
}

function extractGeminiText(data: any): string {
  const parts = data?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return '';

  return parts
    .map((part: any) => (typeof part?.text === 'string' ? part.text : ''))
    .join('\n')
    .trim();
}

/**
 * Appelle l'API Gemini avec un prompt et retourne le texte généré
 */
/** Routage multi-provider : si l'abonné a sélectionné Claude/OpenAI dans
 *  les Réglages avancés ET fourni une clé valide, on délègue. Sinon Gemini. */
async function maybeRouteToOtherProvider(
  prompt: string,
  options: GeminiCallOptions
): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  try {
    const provider = localStorage.getItem('ai_writing_provider');
    if (provider !== 'claude' && provider !== 'openai' && provider !== 'openrouter') return null;
    // Import dynamique pour éviter un cycle d'imports.
    const { callAIWriting, getProviderKey, validateKeyFormat } = await import('./aiWritingService');
    const key = getProviderKey(provider);
    if (!key || !validateKeyFormat(provider, key)) return null;
    return await callAIWriting(prompt, options);
  } catch (e) {
    console.warn('[geminiService] routage provider échoué, fallback Gemini', e);
    return null;
  }
}

/** Google refuse certaines régions pour les clés AI Studio (« User location is
 *  not supported for the API use »), ou bloque la clé. Dans ce cas on bascule
 *  automatiquement sur l'IA intégrée d'Ebookstudio (côté serveur), pour que la
 *  génération aboutisse quand même. Vaut pour tous les abonnés. */
function isRegionBlockedError(text: string): boolean {
  return /User location is not supported|location is not supported|FAILED_PRECONDITION/i.test(text || '');
}

async function callServerFallback(
  prompt: string,
  options: GeminiCallOptions,
): Promise<string> {
  const { supabase } = await import('@/integrations/supabase/client');
  const { data, error } = await supabase.functions.invoke('ai-text-fallback', {
    body: {
      prompt,
      systemPrompt: options.systemPrompt,
      temperature: options.temperature,
      maxTokens: options.maxTokens,
      jsonMode: options.jsonMode,
    },
  });
  if (error) throw new Error(error.message || 'IA intégrée indisponible');
  const content = (data as any)?.content;
  if (!content) throw new Error((data as any)?.error || 'IA intégrée : réponse vide');
  return content as string;
}

export async function callGemini(
  apiKey: string,
  prompt: string,
  options: GeminiCallOptions = {}
): Promise<string> {
  // Routage automatique vers Claude/OpenAI si configuré.
  const routed = await maybeRouteToOtherProvider(prompt, options);
  if (routed !== null) return routed;

  const {
    systemPrompt,
    temperature = 0.7,
    maxTokens = 8192,
    timeout = 90000,
    jsonMode = false,
  } = options;

  const controller = new AbortController();
  const effectiveTimeout = Math.max(timeout, maxTokens >= 6000 ? 180000 : 90000);
  const timeoutId = setTimeout(() => controller.abort(), effectiveTimeout);

  const generationConfig: any = {
    temperature,
    maxOutputTokens: maxTokens,
    // Gemini 2.5 consomme des "thinking tokens" cachés dans maxOutputTokens.
    // On désactive le budget de réflexion pour éviter les réponses vides /
    // tronquées (MAX_TOKENS) sur des appels courts type JSON.
    thinkingConfig: { thinkingBudget: 0 },
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

  const cleanedApiKey = sanitizeGeminiApiKey(apiKey);
  let degraded = false; // repli si le modèle refuse thinkingConfig / responseMimeType
  const buildBody = () => {
    if (!degraded) return body;
    const gc: any = { temperature, maxOutputTokens: maxTokens };
    const b: any = { contents: body.contents, generationConfig: gc };
    if (systemPrompt) b.system_instruction = body.system_instruction;
    return b;
  };
  const doFetch = (model: string) => fetch(
    `${GEMINI_API_BASE}/${model}:generateContent?key=${encodeURIComponent(cleanedApiKey)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildBody()),
      signal: controller.signal,
    }
  );

  try {
    let response: Response | null = null;
    let lastStatus = 0;
    let lastErrText = '';

    // On parcourt les modèles de secours ; backoff court (3s puis 8s) pour
    // ne pas bloquer l'interface aussi longtemps qu'avant.
    outer:
    for (let m = 0; m < MODEL_FALLBACKS.length; m++) {
      const model = MODEL_FALLBACKS[m];
      const backoffs = [0, 3000, 8000];
      for (let attempt = 0; attempt < backoffs.length; attempt++) {
        if (backoffs[attempt] > 0) await sleep(backoffs[attempt]);
        response = await doFetch(model);
        lastStatus = response.status;
        if (response.ok) break outer;
        // Surcharge / quota → on tente le modèle suivant (ou un retry court)
        if (response.status === 429 || response.status === 503) {
          console.warn(`Gemini ${response.status} sur ${model} (tentative ${attempt + 1})`);
          await response.text().catch(() => {});
          continue;
        }
        // Modèle retiré / introuvable (404) → inutile de réessayer, on passe
        // directement au modèle de secours suivant.
        if (response.status === 404) {
          console.warn(`Gemini 404 : modèle ${model} indisponible, bascule sur le suivant.`);
          await response.text().catch(() => {});
          continue outer;
        }
        lastErrText = await response.text().catch(() => '');
        // 400 « requête invalide » (thinkingConfig / responseMimeType refusés)
        // ≠ clé invalide : on retente une fois en mode dégradé.
        const looksLikeBadKey = /API_KEY_INVALID|API key not valid|API_KEY_SERVICE_BLOCKED/i.test(lastErrText);
        if (response.status === 400 && !looksLikeBadKey && !degraded) {
          console.warn('[Gemini] 400 sur la requête — nouvelle tentative sans jsonMode/thinkingConfig.', lastErrText.slice(0, 300));
          degraded = true;
          attempt = -1; // relance immédiatement le même modèle
          continue;
        }
        // Erreur non récupérable → on sort pour la traiter ci-dessous
        break outer;
      }
    }


    clearTimeout(timeoutId);

    if (!response || !response.ok) {
      const errText = lastErrText || (response ? await response.text().catch(() => '') : '');
      console.error('Gemini API error:', lastStatus, errText);
      let apiMessage = '';
      try { apiMessage = JSON.parse(errText)?.error?.message || ''; } catch { /* ignore */ }
      if (lastStatus === 429 || lastStatus === 503) {
        throw new Error('Service Google momentanément saturé. Patientez ~30s puis relancez.');
      }
      const badKey = /API_KEY_INVALID|API key not valid|API_KEY_SERVICE_BLOCKED/i.test(errText);
      if (badKey || lastStatus === 401 || (lastStatus === 403 && !apiMessage)) {
        throw new Error('Clé API Gemini invalide. Vérifiez votre clé sur aistudio.google.com');
      }
      throw new Error(apiMessage ? `Gemini (${lastStatus}) : ${apiMessage}` : `Erreur Gemini: ${lastStatus || 'réseau'}`);
    }



    const data = await response.json();
    const content = extractGeminiText(data);
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
    // Track AI usage for the header token counter (non-blocking)
    try {
      const { trackAIUsage } = await import('@/lib/aiCostTracker');
      trackAIUsage({
        provider: 'gemini',
        promptChars: (prompt?.length || 0) + (systemPrompt?.length || 0),
        responseChars: content.length,
      });
    } catch { /* ignore tracking errors */ }
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
    timeout = 90000,
  } = options;

  const controller = new AbortController();
  const effectiveTimeout = Math.max(timeout, maxTokens >= 6000 ? 180000 : 90000);
  const timeoutId = setTimeout(() => controller.abort(), effectiveTimeout);

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

  const cleanedApiKey = sanitizeGeminiApiKey(apiKey);
  const doFetch = (model: string) => fetch(
    `${GEMINI_API_BASE}/${model}:generateContent?key=${encodeURIComponent(cleanedApiKey)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    }
  );

  try {
    let response: Response | null = null;
    let lastStatus = 0;

    outer:
    for (let m = 0; m < MODEL_FALLBACKS.length; m++) {
      const model = MODEL_FALLBACKS[m];
      const backoffs = [0, 3000, 8000];
      for (let attempt = 0; attempt < backoffs.length; attempt++) {
        if (backoffs[attempt] > 0) await sleep(backoffs[attempt]);
        response = await doFetch(model);
        lastStatus = response.status;
        if (response.ok) break outer;
        if (response.status === 429 || response.status === 503) {
          console.warn(`Gemini ${response.status} sur ${model} (tentative ${attempt + 1})`);
          await response.text().catch(() => {});
          continue;
        }
        if (response.status === 404) {
          console.warn(`Gemini 404 : modèle ${model} indisponible, bascule sur le suivant.`);
          await response.text().catch(() => {});
          continue outer;
        }
        break outer;
      }
    }

    clearTimeout(timeoutId);

    if (!response || !response.ok) {
      const errText = response ? await response.text().catch(() => '') : '';
      console.error('Gemini API error:', lastStatus, errText);
      if (lastStatus === 429 || lastStatus === 503) {
        throw new Error('Service Google momentanément saturé. Patientez ~30s puis relancez.');
      }
      if (lastStatus === 400 || lastStatus === 401 || lastStatus === 403) {
        throw new Error('Clé API Gemini invalide. Vérifiez votre clé sur aistudio.google.com');
      }
      throw new Error(`Erreur Gemini: ${lastStatus || 'réseau'}`);
    }

    const data = await response.json();
    const content = extractGeminiText(data);
    if (!content) throw new Error('Aucune réponse de Gemini');
    try {
      const { trackAIUsage } = await import('@/lib/aiCostTracker');
      const promptChars = messages.reduce((n, m) => n + (m.text?.length || 0), 0) + (systemPrompt?.length || 0);
      trackAIUsage({ provider: 'gemini', promptChars, responseChars: content.length });
    } catch { /* ignore */ }
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

