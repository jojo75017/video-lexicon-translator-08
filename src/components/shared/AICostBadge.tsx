import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Coins, RotateCcw, TrendingUp } from 'lucide-react';
import { getCostEntry, formatEUR, onCostUpdate, resetCostEntry, type AICostEntry } from '@/lib/aiCostTracker';
import { PROVIDER_LABELS } from '@/services/aiWritingService';

const VISIBLE_PREFIXES = ['/espace', '/ebook', '/ai-chat', '/audit', '/kdp', '/bd-studio', '/series-tomes'];

const AICostBadge: React.FC = () => {
  const location = useLocation();
  const [entry, setEntry] = useState<AICostEntry>(() => getCostEntry());

  useEffect(() => {
    setEntry(getCostEntry());
    return onCostUpdate(() => setEntry(getCostEntry()));
  }, [location.pathname]);

  const visible = VISIBLE_PREFIXES.some((p) => location.pathname.startsWith(p));
  if (!visible) return null;
  if (entry.callsCount === 0) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="fixed bottom-4 left-4 z-40 flex items-center gap-2 rounded-full bg-white border border-[#008296]/30 shadow-md hover:shadow-lg px-3 py-2 text-xs font-medium text-[#232F3E] hover:border-[#FF9E2D] transition-all"
          aria-label="Coût IA cumulé"
        >
          <Coins className="h-4 w-4 text-[#FF9E2D]" />
          <span className="tabular-nums">{formatEUR(entry.totalCostEUR)}</span>
          <span className="text-muted-foreground hidden sm:inline">· {entry.callsCount} appels</span>
        </button>
      </PopoverTrigger>
      <PopoverContent side="top" align="start" className="w-80">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold flex items-center gap-2 text-[#232F3E]">
              <TrendingUp className="h-4 w-4 text-[#008296]" />
              Coût IA de ce livre
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => resetCostEntry()}
              className="h-7 text-xs gap-1 text-muted-foreground hover:text-destructive"
              title="Remettre à zéro"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-md bg-[#FAFAFA] p-2">
              <div className="text-[10px] text-muted-foreground uppercase">Total</div>
              <div className="text-sm font-bold text-[#008296] tabular-nums">{formatEUR(entry.totalCostEUR)}</div>
            </div>
            <div className="rounded-md bg-[#FAFAFA] p-2">
              <div className="text-[10px] text-muted-foreground uppercase">Tokens</div>
              <div className="text-sm font-bold tabular-nums">{(entry.totalTokens / 1000).toFixed(1)}k</div>
            </div>
            <div className="rounded-md bg-[#FAFAFA] p-2">
              <div className="text-[10px] text-muted-foreground uppercase">Appels</div>
              <div className="text-sm font-bold tabular-nums">{entry.callsCount}</div>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            {(Object.keys(entry.byProvider) as Array<keyof typeof entry.byProvider>).map((p) => {
              const v = entry.byProvider[p];
              if (!v) return null;
              return (
                <div key={p} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{PROVIDER_LABELS[p as keyof typeof PROVIDER_LABELS]}</span>
                  <span className="font-medium tabular-nums">
                    {formatEUR(v.cost)} <span className="text-muted-foreground">· {v.calls}×</span>
                  </span>
                </div>
              );
            })}
          </div>

          <p className="text-[10px] text-muted-foreground leading-tight pt-1 border-t">
            Estimation basée sur ~4 caractères / token et tarifs officiels des providers. Chiffre indicatif —
            vérifie la facturation réelle dans la console du provider.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AICostBadge;
