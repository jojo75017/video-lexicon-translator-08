import { ArrowRight, BrainCircuit, Check, PenLine, TriangleAlert } from 'lucide-react';
import { getTwoStepEngine } from '@/data/v3TwoStepEngines';
import { getTwoStepKeyState } from '@/lib/v3/twoStepEngine';

const EMERALD = '#064e3b';
const GOLD_DEEP = '#8a6d16';
const LINE = 'rgba(6,78,59,0.14)';

/**
 * Repère « 2 temps » affiché en tête d'un module : Gemini analyse, puis
 * ChatGPT produit — avec l'état des deux clés de l'abonné.
 */
export function V3TwoStepBadge({
  engineId,
  className = '',
  showKeys = true,
}: {
  engineId: string;
  className?: string;
  showKeys?: boolean;
}) {
  const engine = getTwoStepEngine(engineId);
  if (!engine) return null;
  const keys = getTwoStepKeyState();

  return (
    <div
      className={`rounded-2xl px-4 py-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 ${className}`}
      style={{ background: '#fbf6ec', border: `1px solid ${LINE}` }}
    >
      <div className="flex items-center gap-2 min-w-0">
        <BrainCircuit className="w-4 h-4 shrink-0" style={{ color: EMERALD }} />
        <span className="text-[12px]" style={{ color: '#334155' }}>
          <strong style={{ color: GOLD_DEEP }}>Temps 1 · {engine.temps1.label}</strong>{' '}
          {engine.temps1.output}
        </span>
      </div>
      <ArrowRight className="w-4 h-4 shrink-0 hidden sm:block" style={{ color: GOLD_DEEP }} />
      <div className="flex items-center gap-2 min-w-0">
        <PenLine className="w-4 h-4 shrink-0" style={{ color: EMERALD }} />
        <span className="text-[12px]" style={{ color: '#334155' }}>
          <strong style={{ color: GOLD_DEEP }}>Temps 2 · {engine.temps2.label}</strong>{' '}
          {engine.temps2.output}
        </span>
      </div>

      {showKeys && (
        <div className="sm:ml-auto flex items-center gap-3 text-[11.5px] font-semibold">
          <span className="inline-flex items-center gap-1" style={{ color: keys.gemini ? EMERALD : '#b45309' }}>
            {keys.gemini ? <Check className="w-3.5 h-3.5" /> : <TriangleAlert className="w-3.5 h-3.5" />}
            Clé Gemini
          </span>
          <span className="inline-flex items-center gap-1" style={{ color: keys.openrouter ? EMERALD : '#b45309' }}>
            {keys.openrouter ? <Check className="w-3.5 h-3.5" /> : <TriangleAlert className="w-3.5 h-3.5" />}
            Clé OpenRouter
          </span>
        </div>
      )}
    </div>
  );
}

export default V3TwoStepBadge;
