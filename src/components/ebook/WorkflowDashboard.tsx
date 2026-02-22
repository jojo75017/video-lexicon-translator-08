import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  BarChart3, CheckCircle2, Clock, Eye, AlertCircle, Lock, Play, 
  Trash2, Cloud, CloudOff, RefreshCw, FileText, Download, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWorkflowResults } from '@/hooks/useWorkflowResults';
import { useWorkflowCloudSync } from '@/hooks/useWorkflowCloudSync';
import { WORKFLOW_STEPS, STEP_TO_TAB } from './WorkflowNavigation';
import { toast } from 'sonner';

interface WorkflowDashboardProps {
  ebookTitle: string;
  onNavigate: (tabId: string) => void;
  onStartAutoWorkflow?: () => void;
}

const STEP_ESTIMATES: Record<string, { minutes: number; tip: string }> = {
  P1: { minutes: 2, tip: "Définissez bien votre titre et sous-titre pour un meilleur positionnement." },
  P2: { minutes: 3, tip: "Les 7 mots-clés KDP sont cruciaux pour la visibilité sur Amazon." },
  P3: { minutes: 3, tip: "Une bonne structure = un livre plus facile à rédiger. Visez 8-15 chapitres." },
  P4: { minutes: 15, tip: "L'étape la plus longue. Chaque chapitre est rédigé individuellement." },
  P5: { minutes: 5, tip: "L'humanisation rend votre texte naturel et engageant." },
  P6: { minutes: 3, tip: "Vérifiez la cohérence, la grammaire et le style." },
  P7: { minutes: 2, tip: "Description et accroche optimisées pour Amazon." },
  P8: { minutes: 3, tip: "Diagnostic complet avant publication." },
  P9: { minutes: 2, tip: "Capture de votre voix d'auteur unique." },
  P10: { minutes: 3, tip: "Transitions fluides entre tous les chapitres." },
  P11: { minutes: 3, tip: "Analyse critique sans complaisance." },
  P12: { minutes: 5, tip: "Améliorations automatiques basées sur P11." },
  P13: { minutes: 2, tip: "Unification du style sur l'ensemble du manuscrit." },
  P14: { minutes: 2, tip: "Validation finale par l'éditeur IA." },
  P15: { minutes: 5, tip: "🎁 BONUS — Rend le texte indétectable par les outils anti-IA." },
};

export const WorkflowDashboard: React.FC<WorkflowDashboardProps> = ({
  ebookTitle,
  onNavigate,
  onStartAutoWorkflow,
}) => {
  const { results, hasStepResult, getStepResult, clearResults, getCompletedStepsCount } = useWorkflowResults();
  const { isSyncing, saveAllToCloud, loadFromCloud, lastSyncedAt } = useWorkflowCloudSync();
  const [isCloudSynced, setIsCloudSynced] = useState(false);
  const [expandedPreview, setExpandedPreview] = useState<string | null>(null);

  const completedCount = getCompletedStepsCount();
  const totalSteps = WORKFLOW_STEPS.length;
  const progressPercent = (completedCount / totalSteps) * 100;
  const totalMinutes = Object.values(STEP_ESTIMATES).reduce((sum, e) => sum + e.minutes, 0);
  const remainingMinutes = WORKFLOW_STEPS.filter(s => !hasStepResult(s.id))
    .reduce((sum, s) => sum + (STEP_ESTIMATES[s.id]?.minutes || 3), 0);

  const handleCloudSync = async () => {
    if (!ebookTitle) {
      toast.error('Titre du projet requis pour la synchronisation');
      return;
    }
    const formattedResults: Record<string, { result: any; displayContent: string; generatedAt?: string }> = {};
    Object.entries(results).forEach(([key, val]) => {
      if (val) {
        formattedResults[key] = {
          result: val.result,
          displayContent: val.displayContent,
          generatedAt: val.generatedAt,
        };
      }
    });
    const success = await saveAllToCloud(ebookTitle, formattedResults);
    if (success) {
      setIsCloudSynced(true);
      toast.success('☁️ Résultats synchronisés dans le cloud');
    }
  };

  const handleCloudRestore = async () => {
    if (!ebookTitle) {
      toast.error('Titre du projet requis');
      return;
    }
    const cloudResults = await loadFromCloud(ebookTitle);
    if (cloudResults.length === 0) {
      toast.info('Aucun résultat cloud trouvé pour ce projet');
      return;
    }
    // TODO: merge cloud results into local
    toast.success(`☁️ ${cloudResults.length} étapes restaurées depuis le cloud`);
  };

  const getStepStatus = (stepId: string): 'completed' | 'available' | 'locked' => {
    if (hasStepResult(stepId)) return 'completed';
    const step = WORKFLOW_STEPS.find(s => s.id === stepId);
    if (!step?.requiredSteps?.length) return 'available';
    const allReqsMet = step.requiredSteps.every(r => hasStepResult(r));
    return allReqsMet ? 'available' : 'locked';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            Tableau de Bord Workflow
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Vue d'ensemble de votre processus éditorial
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCloudSync}
            disabled={isSyncing || completedCount === 0}
            className="gap-2"
          >
            {isSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Cloud className="h-4 w-4" />}
            Sauvegarder Cloud
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCloudRestore}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Restaurer
          </Button>
          {onStartAutoWorkflow && (
            <Button onClick={onStartAutoWorkflow} className="gap-2" disabled={completedCount === totalSteps}>
              <Play className="h-4 w-4" />
              Lancer Auto P1→P14
            </Button>
          )}
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-2">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Progression globale</span>
                <span className="text-sm font-bold text-primary">{Math.round(progressPercent)}%</span>
              </div>
              <Progress value={progressPercent} className="h-4 mb-3" />
              <p className="text-xs text-muted-foreground">
                {completedCount}/{totalSteps} étapes complétées
              </p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Clock className="h-6 w-6 mx-auto mb-1 text-primary" />
              <p className="text-2xl font-bold">{remainingMinutes}</p>
              <p className="text-xs text-muted-foreground">min restantes</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <CheckCircle2 className="h-6 w-6 mx-auto mb-1 text-green-500" />
              <p className="text-2xl font-bold">{completedCount}</p>
              <p className="text-xs text-muted-foreground">étapes terminées</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Steps Grid */}
      <TooltipProvider delayDuration={200}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {WORKFLOW_STEPS.map((step, idx) => {
            const status = getStepStatus(step.id);
            const estimate = STEP_ESTIMATES[step.id];
            const result = getStepResult(step.id);
            const tabId = STEP_TO_TAB[step.id];

            return (
              <Card
                key={step.id}
                className={cn(
                  "transition-all duration-200 cursor-pointer hover:shadow-md",
                  status === 'completed' && "border-green-500/30 bg-green-500/5",
                  status === 'locked' && "opacity-60",
                  expandedPreview === step.id && "ring-2 ring-primary"
                )}
                onClick={() => {
                  if (status !== 'locked') {
                    onNavigate(tabId);
                  }
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold",
                        status === 'completed' && "bg-green-500 text-white",
                        status === 'available' && "bg-primary/10 text-primary",
                        status === 'locked' && "bg-muted text-muted-foreground"
                      )}>
                        {status === 'completed' ? <CheckCircle2 className="h-5 w-5" /> :
                         status === 'locked' ? <Lock className="h-4 w-4" /> :
                         idx + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-sm">{step.id}: {step.label}</h3>
                          {status === 'completed' && (
                            <Badge variant="default" className="bg-green-500 text-white text-xs">
                              Fait
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                        
                        {/* Time estimate & tip */}
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            ~{estimate?.minutes} min
                          </span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="text-xs text-primary cursor-help flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                Conseil
                              </span>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="max-w-xs">
                              <p className="text-xs">{estimate?.tip}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>

                        {/* Preview of result */}
                        {result && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedPreview(expandedPreview === step.id ? null : step.id);
                            }}
                            className="mt-2 text-xs text-primary hover:underline flex items-center gap-1"
                          >
                            <Eye className="h-3 w-3" />
                            {expandedPreview === step.id ? 'Masquer' : 'Aperçu'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded preview */}
                  {expandedPreview === step.id && result && (
                    <div className="mt-3 p-3 bg-muted/50 rounded-lg text-xs max-h-40 overflow-y-auto border">
                      <p className="whitespace-pre-wrap">
                        {result.displayContent?.substring(0, 500)}
                        {(result.displayContent?.length || 0) > 500 && '...'}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </TooltipProvider>

      {/* Actions */}
      {completedCount > 0 && (
        <Card>
          <CardContent className="p-4 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {isCloudSynced && lastSyncedAt && (
                <span className="flex items-center gap-1 text-green-600">
                  <Cloud className="h-4 w-4" />
                  Synchronisé
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (confirm('Supprimer tous les résultats du workflow ?')) {
                    clearResults();
                    setExpandedPreview(null);
                    toast.success('Résultats effacés');
                  }
                }}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Réinitialiser
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WorkflowDashboard;
