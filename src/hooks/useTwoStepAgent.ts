import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import {
  getTwoStepKeyState,
  runAnalysisStep,
  runProductionStep,
  TwoStepKeyError,
  type TwoStepKeyState,
  type TwoStepStage,
} from '@/lib/v3/twoStepEngine';

interface Prompts {
  analysisSystem: string;
  analysisPrompt: string;
  productionSystem: string;
  productionPrompt: (brief: string) => string;
  maxTokensAnalysis?: number;
  maxTokensProduction?: number;
}

/**
 * Pilote un module en 2 temps : Gemini analyse (temps 1), l'abonné peut relire
 * et corriger le brief, puis ChatGPT produit (temps 2). Le temps 2 peut être
 * relancé seul, sans repayer le temps 1.
 */
export function useTwoStepAgent() {
  const [stage, setStage] = useState<TwoStepStage>('idle');
  const [brief, setBrief] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [keys, setKeys] = useState<TwoStepKeyState>(() => getTwoStepKeyState());

  const refreshKeys = useCallback(() => {
    const state = getTwoStepKeyState();
    setKeys(state);
    return state;
  }, []);

  const handle = useCallback((e: unknown) => {
    const message =
      e instanceof TwoStepKeyError || e instanceof Error
        ? e.message
        : 'Génération impossible pour le moment.';
    setError(message);
    toast.error(message);
    setStage('idle');
    return null;
  }, []);

  /** Temps 1 : analyse Gemini. */
  const analyze = useCallback(
    async (p: Pick<Prompts, 'analysisSystem' | 'analysisPrompt' | 'maxTokensAnalysis'>) => {
      setError(null);
      setStage('analyzing');
      try {
        const result = await runAnalysisStep({
          analysisSystem: p.analysisSystem,
          analysisPrompt: p.analysisPrompt,
          maxTokens: p.maxTokensAnalysis,
        });
        setBrief(result);
        setStage('briefReady');
        return result;
      } catch (e) {
        return handle(e);
      }
    },
    [handle],
  );

  /** Temps 2 : production ChatGPT, à partir du brief affiché (éventuellement corrigé). */
  const produce = useCallback(
    async (
      p: Pick<Prompts, 'productionSystem' | 'productionPrompt' | 'maxTokensProduction'>,
      briefOverride?: string,
    ) => {
      const usedBrief = (briefOverride ?? brief).trim();
      if (!usedBrief) {
        toast.error('Lancez d’abord le temps 1 (analyse).');
        return null;
      }
      setError(null);
      setStage('producing');
      try {
        const result = await runProductionStep({
          productionSystem: p.productionSystem,
          prompt: p.productionPrompt(usedBrief),
          maxTokens: p.maxTokensProduction,
        });
        setOutput(result);
        setStage('done');
        return result;
      } catch (e) {
        return handle(e);
      }
    },
    [brief, handle],
  );

  /** Les deux temps d'affilée. */
  const run = useCallback(
    async (p: Prompts) => {
      const analysed = await analyze(p);
      if (!analysed) return null;
      return produce(p, analysed);
    },
    [analyze, produce],
  );

  const reset = useCallback(() => {
    setStage('idle');
    setBrief('');
    setOutput('');
    setError(null);
  }, []);

  return {
    stage,
    brief,
    setBrief,
    output,
    error,
    keys,
    refreshKeys,
    analyze,
    produce,
    run,
    reset,
    busy: stage === 'analyzing' || stage === 'producing',
  };
}

export default useTwoStepAgent;
