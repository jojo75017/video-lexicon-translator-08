import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Wallet } from 'lucide-react';
import {
  formatEUR,
  getBudgetState,
  getCostEntry,
  onCostUpdate,
  setBudgetCapEUR,
  type BudgetState,
} from '@/lib/aiCostTracker';

/**
 * Garde-fou de dépense : affiche le coût IA cumulé du projet et permet à
 * l'auteur de fixer son plafond. Au-delà, la rédaction est bloquée.
 */
const StudioProBudgetPanel: React.FC<{ projectId?: string | null }> = ({ projectId }) => {
  const [state, setState] = useState<BudgetState>(() => getBudgetState(projectId || undefined));
  const [calls, setCalls] = useState(() => getCostEntry(projectId || undefined).callsCount);
  const [capInput, setCapInput] = useState(String(state.capEUR));

  useEffect(() => {
    const refresh = () => {
      setState(getBudgetState(projectId || undefined));
      setCalls(getCostEntry(projectId || undefined).callsCount);
    };
    refresh();
    return onCostUpdate(refresh);
  }, [projectId]);

  const applyCap = () => {
    const n = Number(capInput.replace(',', '.'));
    if (Number.isFinite(n) && n > 0) setBudgetCapEUR(n);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Wallet className="h-4 w-4" /> Coût IA de ce livre
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">
            {formatEUR(state.spentEUR)} dépensés sur {formatEUR(state.capEUR)}
          </span>
          <span className="text-muted-foreground">{calls} appels IA</span>
        </div>
        <Progress value={Math.min(100, Math.round(state.ratio * 100))} />

        {state.exceeded ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Plafond atteint : la rédaction IA est bloquée. Votre texte est conservé. Augmentez le
              plafond pour continuer.
            </AlertDescription>
          </Alert>
        ) : state.nearLimit ? (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>Vous approchez de votre plafond de dépense IA.</AlertDescription>
          </Alert>
        ) : null}

        <div className="flex items-end gap-2">
          <div className="flex-1">
            <label className="text-xs font-medium text-muted-foreground" htmlFor="cap">
              Mon plafond (€)
            </label>
            <Input id="cap" value={capInput} onChange={(e) => setCapInput(e.target.value)} inputMode="decimal" />
          </div>
          <Button variant="outline" onClick={applyCap}>
            Mettre à jour
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Estimation informative (jetons × tarif du modèle). Un livre de 20 chapitres coûte
          généralement 0,15 € à 0,30 €.
        </p>
      </CardContent>
    </Card>
  );
};

export default StudioProBudgetPanel;
