import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  BarChart3, CheckCircle2, Clock, Eye, AlertCircle, Lock, Play, 
  Trash2, Cloud, RefreshCw, Loader2
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
  const remainingMinutes = WORKFLOW_STEPS.filter(s => !hasStepResult(s.id))
    .reduce((sum, s) => sum + (STEP_ESTIMATES[s.id]?.minutes || 3), 0);

  const handleCloudSync = async () => {
    if (!ebookTitle) { toast.error('Titre du projet requis pour la synchronisation'); return; }
    const formattedResults: Record<string, { result: any; displayContent: string; generatedAt?: string }> = {};
    Object.entries(results).forEach(([key, val]) => {
      if (val) {
        formattedResults[key] = { result: val.result, displayContent: val.displayContent, generatedAt: val.generatedAt };
      }
    });
    const success = await saveAllToCloud(ebookTitle, formattedResults);
    if (success) { setIsCloudSynced(true); toast.success('☁️ Résultats synchronisés dans le cloud'); }
  };

  const handleCloudRestore = async () => {
    if (!ebookTitle) { toast.error('Titre du projet requis'); return; }
    const cloudResults = await loadFromCloud(ebookTitle);
    if (cloudResults.length === 0) { toast.info('Aucun résultat cloud trouvé pour ce projet'); return; }
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
          <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
            <BarChart3 className="h-6 w-6 text-cyan-400" />
            Tableau de Bord Workflow
          </h2>
          <p className="text-white/50 text-sm mt-1">
            Vue d'ensemble de votre processus éditorial
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCloudSync}
            disabled={isSyncing || completedCount === 0}
            className="gap-2 border-white/20 text-white/70 hover:text-white bg-slate-800/50"
          >
            {isSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Cloud className="h-4 w-4" />}
            Sauvegarder Cloud
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCloudRestore}
            className="gap-2 border-white/20 text-white/70 hover:text-white bg-slate-800/50"
          >
            <RefreshCw className="h-4 w-4" />
            Restaurer
          </Button>
          {onStartAutoWorkflow && (
            <Button onClick={onStartAutoWorkflow} className="gap-2 bg-cyan-600 hover:bg-cyan-700 text-white" disabled={completedCount === totalSteps}>
              <Play className="h-4 w-4" />
              Lancer Auto P1→P14
            </Button>
          )}
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="border-2 border-cyan-500/20 bg-slate-900/80 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-2">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-white/70">Progression globale</span>
                <span className="text-sm font-bold text-cyan-400">{Math.round(progressPercent)}%</span>
              </div>
              <Progress value={progressPercent} className="h-4 mb-3" />
              <p className="text-xs text-white/50">
                {completedCount}/{totalSteps} étapes complétées
              </p>
            </div>
            <div className="text-center p-4 bg-slate-800/60 rounded-lg border border-white/10">
              <Clock className="h-6 w-6 mx-auto mb-1 text-cyan-400" />
              <p className="text-2xl font-bold text-white">{remainingMinutes}</p>
              <p className="text-xs text-white/50">min restantes</p>
            </div>
            <div className="text-center p-4 bg-slate-800/60 rounded-lg border border-white/10">
              <CheckCircle2 className="h-6 w-6 mx-auto mb-1 text-emerald-400" />
              <p className="text-2xl font-bold text-white">{completedCount}</p>
              <p className="text-xs text-white/50">étapes terminées</p>
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
                  "transition-all duration-200 cursor-pointer hover:shadow-lg bg-slate-900/60 backdrop-blur-sm",
                  status === 'completed' && "border-emerald-500/30 bg-emerald-500/5",
                  status === 'available' && "border-white/10 hover:border-cyan-500/30",
                  status === 'locked' && "opacity-50 border-white/5",
                  expandedPreview === step.id && "ring-2 ring-cyan-500/50"
                )}
                onClick={() => { if (status !== 'locked') onNavigate(tabId); }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold",
                        status === 'completed' && "bg-emerald-500 text-white",
                        status === 'available' && "bg-cyan-500/20 text-cyan-400",
                        status === 'locked' && "bg-slate-800 text-white/30"
                      )}>
                        {status === 'completed' ? <CheckCircle2 className="h-5 w-5" /> :
                         status === 'locked' ? <Lock className="h-4 w-4" /> :
                         idx + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-sm text-white">{step.id}: {step.label}</h3>
                          {status === 'completed' && (
                            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                              Fait
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-white/40 mt-0.5">{step.description}</p>
                        
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs flex items-center gap-1 text-white/40">
                            <Clock className="h-3 w-3" />
                            ~{estimate?.minutes} min
                          </span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="text-xs text-cyan-400 cursor-help flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                Conseil
                              </span>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="max-w-xs bg-slate-800 border-white/10 text-white">
                              <p className="text-xs">{estimate?.tip}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>

                        {result && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedPreview(expandedPreview === step.id ? null : step.id);
                            }}
                            className="mt-2 text-xs text-cyan-400 hover:underline flex items-center gap-1"
                          >
                            <Eye className="h-3 w-3" />
                            {expandedPreview === step.id ? 'Masquer' : 'Aperçu'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {expandedPreview === step.id && result && (
                    <div className="mt-3 p-3 bg-slate-800/60 rounded-lg text-xs max-h-40 overflow-y-auto border border-white/10">
                      <p className="whitespace-pre-wrap text-white/70">
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
        <Card className="bg-slate-900/60 border-white/10">
          <CardContent className="p-4 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 text-sm text-white/40">
              {isCloudSynced && lastSyncedAt && (
                <span className="flex items-center gap-1 text-emerald-400">
                  <Cloud className="h-4 w-4" />
                  Synchronisé
                </span>
              )}
            </div>
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
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WorkflowDashboard;