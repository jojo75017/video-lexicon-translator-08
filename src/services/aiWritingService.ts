/**
 * Service de rédaction multi-providers (BYOK).
 * Permet à l'abonné de choisir Gemini, Claude (Anthropic), ChatGPT (OpenAI)
 * ou OpenRouter (avec choix libre du modèle).
 */
import { callGemini } from './geminiService';

export type AIProvider = 'gemini' | 'claude' | 'openai' | 'openrouter';

export interface AIWritingOptions {
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
  timeout?: number;
}

const LS_KEYS: Record<AIProvider, string> = {
  gemini: 'openai_api_key',         // legacy key name (Gemini), conservée pour compat
  claude: 'anthropic_api_key',
  openai: 'openai_real_api_key',
  openrouter: 'openrouter_image_api_key', // partagée avec les images (une seule clé sk-or-)
};

const LS_PROVIDER = 'ai_writing_provider';
const LS_OPENROUTER_MODEL = 'openrouter_writing_model';

export const getProvider = (): AIProvider => {
  if (typeof window === 'undefined') return 'gemini';
  const v = localStorage.getItem(LS_PROVIDER);
  return (v === 'claude' || v === 'openai' || v === 'gemini' || v === 'openrouter') ? v : 'gemini';
};

export const setProvider = (p: AIProvider) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LS_PROVIDER, p);
};

// Nettoie une clé collée : enlève espaces, retours à la ligne, guillemets
// et caractères invisibles (zéro-width, BOM, espaces insécables) souvent
// introduits lors d'un copier-coller depuis Google AI Studio.
export const sanitizeKey = (key: string): string => {
  return (key || '')
    .replace(/[\u200B-\u200D\uFEFF\u00A0]/g, '') // zero-width + nbsp
    .replace(/["'`]/g, '')                        // guillemets parasites
    .replace(/\s+/g, '')                          // tout espace/retour ligne
    .trim();
};

export const getProviderKey = (p: AIProvider): string => {
  if (typeof window === 'undefined') return '';
  return sanitizeKey(localStorage.getItem(LS_KEYS[p]) || '');
};

export const setProviderKey = (p: AIProvider, key: string) => {
  if (typeof window === 'undefined') return;
  const k = sanitizeKey(key);
  if (k) localStorage.setItem(LS_KEYS[p], k);
  else localStorage.removeItem(LS_KEYS[p]);
};

export const validateKeyFormat = (p: AIProvider, key: string): boolean => {
  const k = sanitizeKey(key);
  if (!k) return false;
  switch (p) {
    case 'gemini': return isValidGoogleKey(k);
    case 'claude': return k.startsWith('sk-ant-') && k.length > 20;
    case 'openai': return k.startsWith('sk-') && k.length > 20;
    case 'openrouter': return k.startsWith('sk-or-') && k.length > 20;
  }
};

/**
 * Accepte les DEUX formats de clé Google :
 *  - Ancien format "hérité" : préfixe AIza...
 *  - Nouveau format : préfixe AQ.Ab / AQ.Ab8... (contient un point)
 * + repli tolérant pour les clés Google Cloud plausibles.
 */
export const isValidGoogleKey = (key: string): boolean => {
  const k = sanitizeKey(key);
  if (!k) return false;
  if (/^AIza[A-Za-z0-9_-]{20,}$/.test(k)) return true;        // ancien format (AIza)
  if (/^AQ\.[A-Za-z0-9._-]{15,}$/i.test(k)) return true;      // nouveau format (AQ.Ab...)
  return /^[A-Za-z0-9._-]{30,}$/.test(k);                      // autre clé plausible
};

/** True si le provider IA actif possède une clé au format valide
 *  (Gemini, Claude, OpenAI ou OpenRouter — peu importe lequel). */
export const isAIConfigured = (): boolean => {
  const p = getProvider();
  const k = getProviderKey(p);
  return !!k && validateKeyFormat(p, k);
};

/** Clé à transmettre à callGemini : la clé Gemini si le provider actif est
 *  Gemini, sinon la clé du provider sélectionné (callGemini route ensuite
 *  automatiquement vers le bon provider). */
export const getActiveAIKey = (geminiFallback?: string): string => {
  const p = getProvider();
  if (p === 'gemini') return getProviderKey('gemini') || sanitizeKey(geminiFallback || '');
  return getProviderKey(p);
};



export const PROVIDER_LABELS: Record<AIProvider, string> = {
  gemini: 'Google Gemini',
  claude: 'Anthropic Claude',
  openai: 'OpenAI ChatGPT',
  openrouter: 'OpenRouter (multi-modèles)',
};

export const PROVIDER_KEY_HINT: Record<AIProvider, string> = {
  gemini: "Clé commençant par AIza... (aistudio.google.com)",
  claude: "Clé commençant par sk-ant-... (console.anthropic.com)",
  openai: "Clé commençant par sk-... (platform.openai.com)",
  openrouter: "Clé commençant par sk-or-... (openrouter.ai)",
};

/** Modèles OpenRouter recommandés (slug officiel).
 *  pricing = $ par 1M tokens (input / output) — indicatif, à jour 2026-05. */
export interface OpenRouterModelInfo {
  id: string;
  label: string;
  pricing?: { in: number; out: number };
  recommended?: boolean;
  tag?: string; // ex: "Premium", "Économique", "Rapide"
}
export const OPENROUTER_MODELS: OpenRouterModelInfo[] = [
  // ===== Anthropic Claude =====
  { id: 'anthropic/claude-sonnet-4.5',         label: 'Claude Sonnet 4.5',       pricing: { in: 3,    out: 15 },   recommended: true, tag: 'Premium · rédaction longue' },
  { id: 'anthropic/claude-sonnet-4',           label: 'Claude Sonnet 4',         pricing: { in: 3,    out: 15 },   tag: 'Premium' },
  { id: 'anthropic/claude-opus-4.1',           label: 'Claude Opus 4.1',         pricing: { in: 15,   out: 75 },   tag: 'Premium · maximal' },
  { id: 'anthropic/claude-3.7-sonnet',         label: 'Claude 3.7 Sonnet',       pricing: { in: 3,    out: 15 },   tag: 'Premium' },
  { id: 'anthropic/claude-3.5-sonnet',         label: 'Claude 3.5 Sonnet',       pricing: { in: 3,    out: 15 },   tag: 'Premium' },
  { id: 'anthropic/claude-3.5-haiku',          label: 'Claude 3.5 Haiku',        pricing: { in: 0.80, out: 4 },    tag: 'Rapide & économique' },
  // ===== OpenAI =====
  { id: 'openai/gpt-5',                         label: 'GPT-5',                   pricing: { in: 1.25, out: 10 },   tag: 'Premium' },
  { id: 'openai/gpt-5-mini',                    label: 'GPT-5 mini',              pricing: { in: 0.25, out: 2 },    tag: 'Rapide & économique' },
  { id: 'openai/gpt-4.1',                       label: 'GPT-4.1',                 pricing: { in: 2,    out: 8 },    tag: 'Polyvalent' },
  { id: 'openai/gpt-4.1-mini',                 label: 'GPT-4.1 mini',            pricing: { in: 0.40, out: 1.60 }, tag: 'Rapide & économique' },
  { id: 'openai/gpt-4o',                        label: 'GPT-4o',                  pricing: { in: 2.5,  out: 10 },   tag: 'Polyvalent' },
  { id: 'openai/gpt-4o-mini',                  label: 'GPT-4o mini',             pricing: { in: 0.15, out: 0.60 }, tag: 'Rapide & économique' },
  { id: 'openai/o3',                            label: 'OpenAI o3',               pricing: { in: 2,    out: 8 },    tag: 'Raisonnement' },
  { id: 'openai/o4-mini',                       label: 'OpenAI o4-mini',          pricing: { in: 1.10, out: 4.40 }, tag: 'Raisonnement · rapide' },
  // ===== Google Gemini =====
  { id: 'google/gemini-2.5-pro',               label: 'Gemini 2.5 Pro',          pricing: { in: 1.25, out: 5 },    tag: 'Long contexte' },
  { id: 'google/gemini-2.5-flash',             label: 'Gemini 2.5 Flash',        pricing: { in: 0.30, out: 2.5 },  tag: 'Rapide' },
  { id: 'google/gemini-2.5-flash-lite',        label: 'Gemini 2.5 Flash Lite',   pricing: { in: 0.10, out: 0.40 }, tag: 'Ultra-économique' },
  // ===== DeepSeek =====
  { id: 'deepseek/deepseek-chat',              label: 'DeepSeek V3',             pricing: { in: 0.27, out: 1.10 }, tag: 'Économique' },
  { id: 'deepseek/deepseek-r1',                label: 'DeepSeek R1',             pricing: { in: 0.55, out: 2.19 }, tag: 'Raisonnement · économique' },
  // ===== Meta Llama =====
  { id: 'meta-llama/llama-3.3-70b-instruct',   label: 'Llama 3.3 70B',           pricing: { in: 0.20, out: 0.60 }, tag: 'Open-source' },
  { id: 'meta-llama/llama-4-maverick',         label: 'Llama 4 Maverick',        pricing: { in: 0.20, out: 0.85 }, tag: 'Open-source' },
  // ===== Mistral =====
  { id: 'mistralai/mistral-large',             label: 'Mistral Large',           pricing: { in: 2,    out: 6 },    tag: 'Européen' },
  { id: 'mistralai/mistral-medium-3',          label: 'Mistral Medium 3',        pricing: { in: 0.40, out: 2 },    tag: 'Européen · équilibré' },
  // ===== xAI =====
  { id: 'x-ai/grok-4',                          label: 'Grok 4',                  pricing: { in: 3,    out: 15 },   tag: 'Premium' },
  { id: 'x-ai/grok-3-mini',                     label: 'Grok 3 mini',             pricing: { in: 0.30, out: 0.50 }, tag: 'Rapide & économique' },
  // ===== Qwen =====
  { id: 'qwen/qwen-2.5-72b-instruct',          label: 'Qwen 2.5 72B',            pricing: { in: 0.23, out: 0.40 }, tag: 'Open-source · économique' },
  // ===== Modèles gratuits (:free) =====
  { id: 'moonshotai/kimi-k2.6:free',           label: 'Kimi K2.6 (gratuit)',     pricing: { in: 0,    out: 0 },    tag: 'Gratuit' },
  { id: 'google/gemma-4-31b-it:free',          label: 'Gemma 4 31B (gratuit)',   pricing: { in: 0,    out: 0 },    tag: 'Gratuit' },
  { id: 'openrouter/owl-alpha',                label: 'OpenRouter Owl Alpha',    pricing: { in: 0,    out: 0 },    tag: 'Gratuit · bêta' },
  { id: 'openrouter/free',                      label: 'OpenRouter Free (auto)',  pricing: { in: 0,    out: 0 },    tag: 'Gratuit' },
];


export const formatModelPricing = (m: OpenRouterModelInfo): string => {
  if (!m.pricing) return '';
  return `~$${m.pricing.in}/M in · $${m.pricing.out}/M out`;
};

export const getOpenRouterModel = (): string => {
  if (typeof window === 'undefined') return OPENROUTER_MODELS[0].id;
  return (localStorage.getItem(LS_OPENROUTER_MODEL) || OPENROUTER_MODELS[0].id).trim();
};
export const setOpenRouterModel = (m: string) => {
  if (typeof window === 'undefined') return;
  const v = (m || '').trim();
  if (v) localStorage.setItem(LS_OPENROUTER_MODEL, v);
  else localStorage.removeItem(LS_OPENROUTER_MODEL);
};

const DEFAULT_MODELS: Record<Exclude<AIProvider, 'openrouter'>, string> = {
  gemini: 'gemini-2.5-flash',
  claude: 'claude-3-5-sonnet-20241022',
  openai: 'gpt-4o-mini',
};

const tryExtractJson = (s: string): string => {
  const m = s.match(/```json\s*([\s\S]*?)\s*```/i) || s.match(/```\s*([\s\S]*?)\s*```/);
  return (m ? m[1] : s).trim();
};

async function callClaude(apiKey: string, prompt: string, opts: AIWritingOptions): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), opts.timeout ?? 120000);
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: DEFAULT_MODELS.claude,
        max_tokens: opts.maxTokens ?? 8192,
        temperature: opts.temperature ?? 0.7,
        system: opts.systemPrompt || undefined,
        messages: [{ role: 'user', content: prompt }],
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      const txt = await res.text();
      console.error('[Claude] error', res.status, txt);
      if (res.status === 401 || res.status === 403) throw new Error('Clé Claude invalide.');
      if (res.status === 429) throw new Error('Limite Claude atteinte. Réessayez plus tard.');
      throw new Error(`Erreur Claude: ${res.status}`);
    }
    const data = await res.json();
    const text = (data?.content || []).map((p: any) => p?.text || '').join('\n').trim();
    if (!text) throw new Error('Réponse Claude vide');
    return opts.jsonMode ? tryExtractJson(text) : text;
  } finally { clearTimeout(timeout); }
}

async function callOpenAI(apiKey: string, prompt: string, opts: AIWritingOptions): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), opts.timeout ?? 120000);
  try {
    const messages: any[] = [];
    if (opts.systemPrompt) messages.push({ role: 'system', content: opts.systemPrompt });
    messages.push({ role: 'user', content: prompt });
    const body: any = {
      model: DEFAULT_MODELS.openai,
      messages,
      temperature: opts.temperature ?? 0.7,
      max_tokens: opts.maxTokens ?? 8192,
    };
    if (opts.jsonMode) body.response_format = { type: 'json_object' };
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) {
      const txt = await res.text();
      console.error('[OpenAI] error', res.status, txt);
      if (res.status === 401 || res.status === 403) throw new Error('Clé OpenAI invalide.');
      if (res.status === 429) throw new Error('Limite OpenAI atteinte. Réessayez plus tard.');
      throw new Error(`Erreur OpenAI: ${res.status}`);
    }
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content || '';
    if (!text) throw new Error('Réponse OpenAI vide');
    return text.trim();
  } finally { clearTimeout(timeout); }
}

async function callOpenRouter(apiKey: string, prompt: string, opts: AIWritingOptions): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), opts.timeout ?? 120000);
  try {
    const model = getOpenRouterModel();
    const messages: any[] = [];
    if (opts.systemPrompt) messages.push({ role: 'system', content: opts.systemPrompt });
    messages.push({ role: 'user', content: prompt });
    const body: any = {
      model,
      messages,
      temperature: opts.temperature ?? 0.7,
      max_tokens: opts.maxTokens ?? 8192,
    };
    if (opts.jsonMode) body.response_format = { type: 'json_object' };
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://ebookstudio.fr',
        'X-Title': 'EbookStudio',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) {
      const txt = await res.text();
      console.error('[OpenRouter] error', res.status, txt);
      if (res.status === 401 || res.status === 403) throw new Error('Clé OpenRouter invalide.');
      if (res.status === 402) throw new Error('Crédits OpenRouter insuffisants.');
      if (res.status === 429) throw new Error('Limite OpenRouter atteinte.');
      throw new Error(`Erreur OpenRouter: ${res.status}`);
    }
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content || '';
    if (!text) throw new Error('Réponse OpenRouter vide');
    return opts.jsonMode ? tryExtractJson(text.trim()) : text.trim();
  } finally { clearTimeout(timeout); }
}

/**
 * Appel unifié — détermine automatiquement le provider courant et sa clé.
 * Compatible drop-in avec callGemini(apiKey, prompt, options).
 * Additif : track coût + emit erreurs SOS (sans changer la signature).
 */
export async function callAIWriting(prompt: string, opts: AIWritingOptions = {}): Promise<string> {
  const provider = getProvider();
  const key = getProviderKey(provider);
  if (!key || !validateKeyFormat(provider, key)) {
    const err = new Error(`Clé ${PROVIDER_LABELS[provider]} manquante ou invalide. Configurez-la dans Paramètres.`);
    try {
      const { emitAIError } = await import('@/lib/aiErrorBus');
      emitAIError(provider, err);
    } catch { /* noop */ }
    throw err;
  }
  try {
    let result: string;
    switch (provider) {
      case 'gemini': result = await callGemini(key, prompt, opts); break;
      case 'claude': result = await callClaude(key, prompt, opts); break;
      case 'openai': result = await callOpenAI(key, prompt, opts); break;
      case 'openrouter': result = await callOpenRouter(key, prompt, opts); break;
    }
    try {
      const { trackAIUsage } = await import('@/lib/aiCostTracker');
      trackAIUsage({
        provider,
        promptChars: (prompt?.length || 0) + (opts.systemPrompt?.length || 0),
        responseChars: result?.length || 0,
      });
    } catch { /* noop */ }
    return result!;
  } catch (e) {
    try {
      const { emitAIError } = await import('@/lib/aiErrorBus');
      emitAIError(provider, e);
    } catch { /* noop */ }
    throw e;
  }
}
