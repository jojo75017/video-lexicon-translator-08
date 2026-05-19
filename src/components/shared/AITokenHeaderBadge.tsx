import React, { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getCostEntry, onCostUpdate, formatEUR, resetCostEntry } from '@/lib/aiCostTracker';

/**
 * Badge compteur de jetons IA — affiché dans le header.
 * Lit le tracker cumulé du projet courant (localStorage).
 */
export const AITokenHeaderBadge: React.FC = () => {
  const [entry, setEntry] = useState(() => getCostEntry());

  useEffect(() => {
    const refresh = () => setEntry(getCostEntry());
    refresh();
    return onCostUpdate(refresh);
  }, []);

  const tokens = entry.totalTokens;
  const display =
    tokens >= 1_000_000
      ? `${(tokens / 1_000_000).toFixed(2)}M`
      : tokens >= 1000
      ? `${(tokens / 1000).toFixed(1)}k`
      : `${tokens}`;

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onDoubleClick={() => {
              if (confirm('Réinitialiser le compteur de jetons IA de ce projet ?')) {
                resetCostEntry();
              }
            }}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border transition-all hover:scale-[1.02]"
            style={{
              borderColor: 'rgba(0,130,150,0.35)',
              background: 'linear-gradient(135deg, rgba(0,130,150,0.08), rgba(255,158,45,0.08))',
              color: '#0d1117',
            }}
            aria-label="Compteur de jetons IA"
          >
            <Zap className="h-3.5 w-3.5" style={{ color: '#FF9E2D' }} />
            <span className="tabular-nums">{display}</span>
            <span className="hidden sm:inline text-[10px] font-normal opacity-70">
              · {formatEUR(entry.totalCostEUR)}
            </span>
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          <div className="space-y-0.5">
            <div><strong>{tokens.toLocaleString('fr-FR')}</strong> jetons IA · {entry.callsCount} appels</div>
            <div className="opacity-70">Coût estimé : {formatEUR(entry.totalCostEUR)}</div>
            <div className="opacity-50 text-[10px]">Double-clic pour réinitialiser</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AITokenHeaderBadge;
