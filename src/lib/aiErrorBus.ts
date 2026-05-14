/**
 * Bus d'événements pour les erreurs IA — alimente le SOS modal.
 * Additif : aucun impact sur les flux existants.
 */
import type { AIProvider } from '@/services/aiWritingService';

export interface AIErrorEventDetail {
  provider: AIProvider;
  message: string;
  raw?: unknown;
  timestamp: number;
}

const EVENT_NAME = 'ai:error';

export const emitAIError = (provider: AIProvider, error: unknown) => {
  if (typeof window === 'undefined') return;
  const message =
    error instanceof Error ? error.message : typeof error === 'string' ? error : 'Erreur IA inconnue';
  const detail: AIErrorEventDetail = {
    provider,
    message,
    raw: error,
    timestamp: Date.now(),
  };
  window.dispatchEvent(new CustomEvent<AIErrorEventDetail>(EVENT_NAME, { detail }));
};

export const onAIError = (handler: (detail: AIErrorEventDetail) => void) => {
  if (typeof window === 'undefined') return () => {};
  const listener = (e: Event) => {
    const ce = e as CustomEvent<AIErrorEventDetail>;
    if (ce.detail) handler(ce.detail);
  };
  window.addEventListener(EVENT_NAME, listener);
  return () => window.removeEventListener(EVENT_NAME, listener);
};

/** Classifie une erreur IA pour produire un conseil humain. */
export type AIErrorKind = 'key-missing' | 'key-invalid' | 'quota' | 'timeout' | 'network' | 'unknown';

export const classifyAIError = (message: string): AIErrorKind => {
  const m = (message || '').toLowerCase();
  if (m.includes('manquante') || m.includes('missing') || m.includes('non configurée')) return 'key-missing';
  if (m.includes('invalide') || m.includes('invalid') || m.includes('401') || m.includes('403') || m.includes('expirée'))
    return 'key-invalid';
  if (m.includes('quota') || m.includes('limite') || m.includes('429') || m.includes('insuffisants') || m.includes('rate'))
    return 'quota';
  if (m.includes('timeout') || m.includes('abort')) return 'timeout';
  if (m.includes('network') || m.includes('fetch') || m.includes('failed to fetch')) return 'network';
  return 'unknown';
};

export const PROVIDER_CONSOLE_URL: Record<AIProvider, string> = {
  gemini: 'https://aistudio.google.com/app/apikey',
  claude: 'https://console.anthropic.com/settings/keys',
  openai: 'https://platform.openai.com/api-keys',
  openrouter: 'https://openrouter.ai/keys',
};
