/**
 * Tracker de coût IA cumulé par projet — persisté en localStorage.
 * Estimation BYOK : on ne reçoit pas toujours le tokenUsage exact via les SDK,
 * donc on estime par approximation chars/4 ≈ 1 token, puis on applique le tarif
 * du modèle utilisé. Purement informatif.
 */
import type { AIProvider } from '@/services/aiWritingService';

const LS_KEY = 'ai_cost_tracker_v1';

export interface AICostEntry {
  totalTokens: number;
  totalCostEUR: number;
  callsCount: number;
  lastUpdate: number;
  byProvider: Partial<Record<AIProvider, { tokens: number; cost: number; calls: number }>>;
}

const DEFAULT: AICostEntry = {
  totalTokens: 0,
  totalCostEUR: 0,
  callsCount: 0,
  lastUpdate: 0,
  byProvider: {},
};

// Tarifs $ / 1M tokens (moyenne in+out) — converti en € ~0.92
const RATE_USD_PER_M: Record<AIProvider, number> = {
  gemini: 1.5,
  claude: 9.0,
  openai: 6.25,
  openrouter: 3.0, // moyenne raisonnable, dépend du modèle choisi
};
const USD_TO_EUR = 0.92;

export const getCurrentProjectId = (): string => {
  if (typeof window === 'undefined') return 'default';
  return localStorage.getItem('current_ebook_project_id') || 'default';
};

const storageKey = (projectId: string) => `${LS_KEY}:${projectId}`;

export const getCostEntry = (projectId?: string): AICostEntry => {
  if (typeof window === 'undefined') return { ...DEFAULT };
  const id = projectId || getCurrentProjectId();
  try {
    const raw = localStorage.getItem(storageKey(id));
    if (!raw) return { ...DEFAULT };
    return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT };
  }
};

export const resetCostEntry = (projectId?: string) => {
  if (typeof window === 'undefined') return;
  const id = projectId || getCurrentProjectId();
  localStorage.removeItem(storageKey(id));
  window.dispatchEvent(new CustomEvent('ai:cost:updated'));
};

export const trackAIUsage = (params: { provider: AIProvider; promptChars: number; responseChars: number }) => {
  if (typeof window === 'undefined') return;
  const { provider, promptChars, responseChars } = params;
  const tokens = Math.ceil((promptChars + responseChars) / 4);
  const rate = RATE_USD_PER_M[provider] || 3;
  const costUSD = (tokens / 1_000_000) * rate;
  const costEUR = costUSD * USD_TO_EUR;

  const id = getCurrentProjectId();
  const entry = getCostEntry(id);
  entry.totalTokens += tokens;
  entry.totalCostEUR += costEUR;
  entry.callsCount += 1;
  entry.lastUpdate = Date.now();
  const cur = entry.byProvider[provider] || { tokens: 0, cost: 0, calls: 0 };
  cur.tokens += tokens;
  cur.cost += costEUR;
  cur.calls += 1;
  entry.byProvider[provider] = cur;

  try {
    localStorage.setItem(storageKey(id), JSON.stringify(entry));
    window.dispatchEvent(new CustomEvent('ai:cost:updated'));
  } catch {
    /* quota localStorage : on ignore */
  }
};

export const onCostUpdate = (handler: () => void) => {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('ai:cost:updated', handler);
  return () => window.removeEventListener('ai:cost:updated', handler);
};

export const formatEUR = (n: number) => {
  if (n < 0.01) return '< 0,01 €';
  return n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 });
};
