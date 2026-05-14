/**
 * Service de rédaction multi-providers (BYOK).
 * Permet à l'abonné de choisir Gemini, Claude (Anthropic) ou ChatGPT (OpenAI).
 * Chaque provider utilise sa propre clé stockée en localStorage.
 */
import { callGemini } from './geminiService';

export type AIProvider = 'gemini' | 'claude' | 'openai';

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
};

const LS_PROVIDER = 'ai_writing_provider';

export const getProvider = (): AIProvider => {
  if (typeof window === 'undefined') return 'gemini';
  const v = localStorage.getItem(LS_PROVIDER);
  return (v === 'claude' || v === 'openai' || v === 'gemini') ? v : 'gemini';
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
  }
};

export const PROVIDER_LABELS: Record<AIProvider, string> = {
  gemini: 'Google Gemini',
  claude: 'Anthropic Claude',
  openai: 'OpenAI ChatGPT',
};

export const PROVIDER_KEY_HINT: Record<AIProvider, string> = {
  gemini: "Clé commençant par AIza... (aistudio.google.com)",
  claude: "Clé commençant par sk-ant-... (console.anthropic.com)",
  openai: "Clé commençant par sk-... (platform.openai.com)",
};

const DEFAULT_MODELS: Record<AIProvider, string> = {
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
  }
}
