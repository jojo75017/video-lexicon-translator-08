/**
 * Moteur « 2 temps » partagé de la V3.
 *
 *  Temps 1 — Gemini analyse et produit un brief structuré (l'architecte).
 *  Temps 2 — ChatGPT (via OpenRouter) produit le livrable à partir du brief.
 *
 * Les clés restent celles de l'abonné (BYOK) : Gemini pour le temps 1,
 * OpenRouter pour le temps 2. Aucune clé ne quitte le navigateur.
 */
import { callGemini } from '@/services/geminiService';
import {
  getProviderKey,
  validateKeyFormat,
  getOpenRouterModel,
} from '@/services/aiWritingService';

export const LANGUE_RULE =
  'Tous les textes doivent être 100 % en français courant. Interdit : latin, faux latin, ' +
  'mots inventés, pseudo-langues et mots étrangers décoratifs. Les paragraphes se terminent ' +
  'par une phrase complète.';

export type TwoStepStage = 'idle' | 'analyzing' | 'briefReady' | 'producing' | 'done';

export class TwoStepKeyError extends Error {
  constructor(public readonly which: 'gemini' | 'openrouter') {
    super(
      which === 'gemini'
        ? 'Clé Gemini manquante : elle sert au temps 1 (analyse). Renseignez-la dans les réglages IA.'
        : 'Clé OpenRouter manquante : elle sert au temps 2 (rédaction ChatGPT). Renseignez-la dans les réglages IA.',
    );
    this.name = 'TwoStepKeyError';
  }
}

export interface TwoStepKeyState {
  gemini: boolean;
  openrouter: boolean;
  ready: boolean;
}

/** État des deux clés de l'abonné, pour l'afficher en tête de module. */
export function getTwoStepKeyState(): TwoStepKeyState {
  const gemini = validateKeyFormat('gemini', getProviderKey('gemini'));
  const openrouter = validateKeyFormat('openrouter', getProviderKey('openrouter'));
  return { gemini, openrouter, ready: gemini && openrouter };
}

export interface TwoStepOptions {
  /** Consigne système du temps 1 (analyse). */
  analysisSystem: string;
  /** Demande d'analyse envoyée à Gemini. */
  analysisPrompt: string;
  /** Consigne système du temps 2 (production). */
  productionSystem: string;
  /**
   * Demande de production. Reçoit le brief du temps 1 pour construire
   * le prompt final envoyé à ChatGPT.
   */
  productionPrompt: (brief: string) => string;
  maxTokensAnalysis?: number;
  maxTokensProduction?: number;
  temperatureProduction?: number;
  /** Brief déjà obtenu (ou corrigé à la main) : le temps 1 est alors sauté. */
  brief?: string;
  onStage?: (stage: TwoStepStage) => void;
}

export interface TwoStepResult {
  brief: string;
  output: string;
}

/** Temps 1 seul : Gemini analyse et renvoie le brief. */
export async function runAnalysisStep(options: {
  analysisSystem: string;
  analysisPrompt: string;
  maxTokens?: number;
}): Promise<string> {
  const key = getProviderKey('gemini');
  if (!validateKeyFormat('gemini', key)) throw new TwoStepKeyError('gemini');

  const brief = await callGemini(key, options.analysisPrompt, {
    systemPrompt: `${options.analysisSystem}\n\n${LANGUE_RULE}`,
    temperature: 0.4,
    maxTokens: options.maxTokens ?? 4096,
    skipProviderRouting: true,
  });
  return (brief || '').trim();
}

/** Temps 2 seul : ChatGPT produit le livrable à partir du brief. */
export async function runProductionStep(options: {
  productionSystem: string;
  prompt: string;
  maxTokens?: number;
  temperature?: number;
}): Promise<string> {
  const key = getProviderKey('openrouter');
  if (!validateKeyFormat('openrouter', key)) throw new TwoStepKeyError('openrouter');

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
      'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://ebookstudio.fr',
      'X-Title': 'EbookStudio',
    },
    body: JSON.stringify({
      model: getOpenRouterModel(),
      messages: [
        { role: 'system', content: `${options.productionSystem}\n\n${LANGUE_RULE}` },
        { role: 'user', content: options.prompt },
      ],
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 8192,
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    console.error('[2 temps] OpenRouter', res.status, txt);
    if (res.status === 401 || res.status === 403) throw new Error('Clé OpenRouter refusée.');
    if (res.status === 402) throw new Error('Crédits OpenRouter insuffisants.');
    if (res.status === 429) throw new Error('Limite OpenRouter atteinte, réessayez dans une minute.');
    throw new Error(`Temps 2 indisponible (erreur ${res.status}).`);
  }

  const data = await res.json();
  const text = (data?.choices?.[0]?.message?.content || '').trim();
  if (!text) throw new Error('Le temps 2 n’a renvoyé aucun texte.');
  return text;
}

/** Enchaîne les deux temps, en suivant le coût IA comme les autres modules. */
export async function runTwoStep(options: TwoStepOptions): Promise<TwoStepResult> {
  const stage = options.onStage ?? (() => {});

  let brief = options.brief?.trim() || '';
  if (!brief) {
    stage('analyzing');
    brief = await runAnalysisStep({
      analysisSystem: options.analysisSystem,
      analysisPrompt: options.analysisPrompt,
      maxTokens: options.maxTokensAnalysis,
    });
    stage('briefReady');
  }

  stage('producing');
  const output = await runProductionStep({
    productionSystem: options.productionSystem,
    prompt: options.productionPrompt(brief),
    maxTokens: options.maxTokensProduction,
    temperature: options.temperatureProduction,
  });
  stage('done');

  try {
    const { trackAIUsage } = await import('@/lib/aiCostTracker');
    trackAIUsage({
      provider: 'openrouter',
      promptChars: options.analysisPrompt.length + brief.length,
      responseChars: output.length,
    });
  } catch {
    /* le suivi de coût ne doit jamais bloquer une génération */
  }

  return { brief, output };
}
