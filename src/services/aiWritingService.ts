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

export const getProviderKey = (p: AIProvider): string => {
  if (typeof window === 'undefined') return '';
  return (localStorage.getItem(LS_KEYS[p]) || '').trim();
};

export const setProviderKey = (p: AIProvider, key: string) => {
  if (typeof window === 'undefined') return;
  const k = key.trim();
  if (k) localStorage.setItem(LS_KEYS[p], k);
  else localStorage.removeItem(LS_KEYS[p]);
};

export const validateKeyFormat = (p: AIProvider, key: string): boolean => {
  const k = (key || '').trim();
  if (!k) return false;
  switch (p) {
    case 'gemini': return k.startsWith('AIza') && k.length > 20;
    case 'claude': return k.startsWith('sk-ant-') && k.length > 20;
    case 'openai': return k.startsWith('sk-') && k.length > 20;
    case 'openrouter': return k.startsWith('sk-or-') && k.length > 20;
  }
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
  { id: 'anthropic/claude-sonnet-4',           label: 'Claude Sonnet 4',         pricing: { in: 3,    out: 15 },   recommended: true, tag: 'Premium · rédaction longue' },
  { id: 'anthropic/claude-3.5-sonnet',         label: 'Claude 3.5 Sonnet',       pricing: { in: 3,    out: 15 },   tag: 'Premium' },
  { id: 'openai/gpt-4o',                       label: 'GPT-4o',                  pricing: { in: 2.5,  out: 10 },   tag: 'Polyvalent' },
  { id: 'openai/gpt-4o-mini',                  label: 'GPT-4o mini',             pricing: { in: 0.15, out: 0.60 }, tag: 'Rapide & économique' },
  { id: 'google/gemini-2.5-pro',               label: 'Gemini 2.5 Pro',          pricing: { in: 1.25, out: 5 },    tag: 'Long contexte' },
  { id: 'google/gemini-2.5-flash',             label: 'Gemini 2.5 Flash',        pricing: { in: 0.30, out: 2.5 },  tag: 'Rapide' },
  { id: 'deepseek/deepseek-chat',              label: 'DeepSeek V3',             pricing: { in: 0.27, out: 1.10 }, tag: 'Économique' },
  { id: 'meta-llama/llama-3.3-70b-instruct',   label: 'Llama 3.3 70B',           pricing: { in: 0.20, out: 0.60 }, tag: 'Open-source' },
  { id: 'mistralai/mistral-large',             label: 'Mistral Large',           pricing: { in: 2,    out: 6 },    tag: 'Européen' },
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
 */
export async function callAIWriting(prompt: string, opts: AIWritingOptions = {}): Promise<string> {
  const provider = getProvider();
  const key = getProviderKey(provider);
  if (!key || !validateKeyFormat(provider, key)) {
    throw new Error(`Clé ${PROVIDER_LABELS[provider]} manquante ou invalide. Configurez-la dans Paramètres.`);
  }
  switch (provider) {
    case 'gemini': return callGemini(key, prompt, opts);
    case 'claude': return callClaude(key, prompt, opts);
    case 'openai': return callOpenAI(key, prompt, opts);
    case 'openrouter': return callOpenRouter(key, prompt, opts);
  }
}
