import React from 'react';
import { ChevronLeft, ChevronRight, Check, Lock, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useWorkflowResults } from '@/hooks/useWorkflowResults';

export interface WorkflowStep {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  requiredSteps?: string[];
  estimatedMinutes?: number;
  tip?: string;
  phase?: number;
}

export const WORKFLOW_STEPS: WorkflowStep[] = [
  { id: 'P1', label: 'Directeur Éditorial', shortLabel: 'P1', description: 'Analyse du titre et positionnement stratégique', requiredSteps: [], estimatedMinutes: 2, tip: "Définissez bien votre titre et sous-titre.", phase: 1 },
  { id: 'P2', label: 'Analyse Marché', shortLabel: 'P2', description: 'Mots-clés KDP et analyse concurrentielle', requiredSteps: ['P1'], estimatedMinutes: 3, tip: "Les 7 mots-clés KDP sont cruciaux.", phase: 1 },
  { id: 'P3', label: 'Architecte Contenu', shortLabel: 'P3', description: 'Structure des chapitres et personnages', requiredSteps: ['P1', 'P2'], estimatedMinutes: 3, tip: "Visez 8-15 chapitres.", phase: 1 },
  { id: 'P4', label: 'Rédaction Expert', shortLabel: 'P4', description: 'Génération du contenu des chapitres', requiredSteps: ['P3'], estimatedMinutes: 15, tip: "L'étape la plus longue.", phase: 2 },
  { id: 'P5', label: 'Réécriture Naturelle', shortLabel: 'P5', description: 'Humanisation du texte généré', requiredSteps: ['P4'], estimatedMinutes: 5, tip: "Rend votre texte naturel.", phase: 2 },
  { id: 'P6', label: 'Qualité Éditoriale', shortLabel: 'P6', description: 'Analyse qualité et suggestions', requiredSteps: ['P4'], estimatedMinutes: 3, tip: "Grammaire, cohérence et style.", phase: 2 },
  { id: 'P7', label: 'Packaging Éditorial', shortLabel: 'P7', description: 'Description et métadonnées KDP', requiredSteps: ['P1', 'P2'], estimatedMinutes: 2, tip: "Optimisé pour Amazon.", phase: 2 },
  { id: 'P8', label: 'Diagnostic Final', shortLabel: 'P8', description: 'Vérification complète avant publication', requiredSteps: ['P4', 'P7'], estimatedMinutes: 3, tip: "Vérification globale.", phase: 2 },
  { id: 'P9', label: 'Mémoire Éditoriale', shortLabel: 'P9', description: 'Cohérence globale du projet', requiredSteps: ['P4'], estimatedMinutes: 2, tip: "Votre voix d'auteur.", phase: 3 },
  { id: 'P10', label: 'Cohérence Chapitres', shortLabel: 'P10', description: 'Liens entre les chapitres', requiredSteps: ['P4'], estimatedMinutes: 3, tip: "Transitions fluides.", phase: 3 },
  { id: 'P11', label: 'Auto-Critique', shortLabel: 'P11', description: 'Analyse critique du manuscrit', requiredSteps: ['P4'], estimatedMinutes: 3, tip: "Analyse sans complaisance.", phase: 3 },
  { id: 'P12', label: 'Boucle Itérative', shortLabel: 'P12', description: 'Amélioration continue', requiredSteps: ['P11'], estimatedMinutes: 5, tip: "Améliorations auto.", phase: 3 },
  { id: 'P13', label: 'Signature Style', shortLabel: 'P13', description: 'Cohérence stylistique', requiredSteps: ['P4'], estimatedMinutes: 2, tip: "Style unifié.", phase: 3 },
  { id: 'P14', label: 'Verdict Ultime', shortLabel: 'P14', description: 'Évaluation finale et recommandations', requiredSteps: ['P8'], estimatedMinutes: 2, tip: "Validation finale.", phase: 3 },
  { id: 'P15', label: 'Humanisation Anti-IA', shortLabel: 'P15', description: '🎁 BONUS — Rend le texte indétectable', requiredSteps: ['P5'], estimatedMinutes: 5, tip: "Anti-détection IA.", phase: 4 },
];

const PHASES = [
  { id: 1, label: '📋 Préparation', color: 'bg-blue-500', steps: ['P1', 'P2', 'P3'] },
  { id: 2, label: '✍️ Rédaction', color: 'bg-amber-500', steps: ['P4', 'P5', 'P6', 'P7', 'P8'] },
  { id: 3, label: '🔍 Optimisation', color: 'bg-purple-500', steps: ['P9', 'P10', 'P11', 'P12', 'P13', 'P14'] },
  { id: 4, label: '🎁 Bonus', color: 'bg-emerald-500', steps: ['P15'] },
];

export const STEP_TO_TAB: Record<string, string> = {
  'P1': 'editorial-director', 'P2': 'market-analysis', 'P3': 'content-architect',
  'P4': 'expert-writing', 'P5': 'natural-rewrite', 'P6': 'editorial-quality',
  'P7': 'editorial-packaging', 'P8': 'final-diagnosis', 'P9': 'editorial-memory',
  'P10': 'chapter-coherence', 'P11': 'self-critique', 'P12': 'iterative-loop',
  'P13': 'style-signature', 'P14': 'ultimate-verdict', 'P15': 'humanize-anti-ia',
};

export const TAB_TO_STEP: Record<string, string> = Object.fromEntries(
  Object.entries(STEP_TO_TAB).map(([k, v]) => [v, k])
);

interface WorkflowNavigationProps {
  currentTabId: string;
  onNavigate: (tabId: string) => void;
  isGenerating?: boolean;
  className?: string;
}

export const WorkflowNavigation: React.FC<WorkflowNavigationProps> = ({
  currentTabId,
  onNavigate,
  isGenerating = false,
  className,
}) => {
  const { hasStepResult, getCompletedStepsCount } = useWorkflowResults();

  const currentStepId = TAB_TO_STEP[currentTabId];
  const currentStepIndex = WORKFLOW_STEPS.findIndex(s => s.id === currentStepId);
  const isWorkflowTab = currentStepIndex >= 0;

  if (!isWorkflowTab) return null;

  const completedCount = getCompletedStepsCount();
  const progressPercentage = (completedCount / WORKFLOW_STEPS.length) * 100;

  const currentStep = WORKFLOW_STEPS[currentStepIndex];
  const prevStep = currentStepIndex > 0 ? WORKFLOW_STEPS[currentStepIndex - 1] : null;
  const nextStep = currentStepIndex < WORKFLOW_STEPS.length - 1 ? WORKFLOW_STEPS[currentStepIndex + 1] : null;

  const canProceedToNext = (step: WorkflowStep): boolean => {
    if (!step.requiredSteps || step.requiredSteps.length === 0) return true;
    return step.requiredSteps.every(reqId => hasStepResult(reqId));
  };

  const getStepStatus = (step: WorkflowStep): 'completed' | 'current' | 'locked' | 'available' => {
    if (hasStepResult(step.id)) return 'completed';
    if (step.id === currentStepId) return 'current';
    if (!canProceedToNext(step)) return 'locked';
    return 'available';
  };

  const handleNavigate = (tabId: string) => {
    if (!isGenerating) onNavigate(tabId);
  };

  const getPhaseCompletedCount = (phase: typeof PHASES[0]) => {
    return phase.steps.filter(id => hasStepResult(id)).length;
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className={cn("space-y-3 mb-6", className)}>
        {/* Header with progress */}
        <div className="bg-slate-900/80 border-2 border-gold/20 rounded-xl p-4 shadow-lg shadow-gold/5 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">🚀</span>
              <span className="text-sm font-bold text-gradient-gold">Workflow Éditorial</span>
              <Badge className="text-xs font-semibold bg-gold/20 text-gold border-gold/30">
                {completedCount}/{WORKFLOW_STEPS.length}
              </Badge>
            </div>
            <span className="text-lg font-bold text-gold">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2.5 mb-4 gold-progress" />

          {/* Phases with steps */}
          <div className="space-y-2">
            {PHASES.map((phase) => {
              const phaseCompleted = getPhaseCompletedCount(phase);
              const phaseTotal = phase.steps.length;
              const isPhaseComplete = phaseCompleted === phaseTotal;

              return (
                <div key={phase.id} className="flex items-center gap-2">
                  <div className={cn(
                    "flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold shrink-0 min-w-[120px]",
                    isPhaseComplete ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800/60 text-white/50"
                  )}>
                    <span>{phase.label}</span>
                    <span className="text-[10px] opacity-70">({phaseCompleted}/{phaseTotal})</span>
                  </div>

                  <div className="flex items-center gap-1 flex-wrap">
                    {phase.steps.map((stepId) => {
                      const step = WORKFLOW_STEPS.find(s => s.id === stepId)!;
                      const status = getStepStatus(step);
                      const tabId = STEP_TO_TAB[step.id];

                      return (
                        <Tooltip key={step.id}>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => status !== 'locked' && handleNavigate(tabId)}
                              disabled={status === 'locked' || isGenerating}
                              className={cn(
                                "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all duration-200 border",
                                status === 'completed' && "bg-emerald-500 text-white border-emerald-600 shadow-sm",
                                status === 'current' && "bg-gold text-slate-900 border-gold shadow-sm ring-2 ring-gold/30 ring-offset-1 ring-offset-slate-900",
                                status === 'available' && "bg-slate-800/60 hover:bg-slate-700/60 text-white/60 border-white/10 hover:text-white cursor-pointer",
                                status === 'locked' && "bg-slate-800/30 text-white/20 border-transparent cursor-not-allowed"
                              )}
                            >
                              {status === 'completed' ? <Check className="w-3 h-3" /> : status === 'locked' ? <Lock className="w-3 h-3" /> : null}
                              <span>{step.shortLabel}</span>
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="max-w-xs bg-slate-800 border-white/10 text-white">
                            <div className="space-y-1">
                              <p className="font-semibold">{step.id}: {step.label}</p>
                              <p className="text-xs text-white/60">{step.description}</p>
                              {step.estimatedMinutes && <p className="text-xs">⏱️ ~{step.estimatedMinutes} min</p>}
                              {status === 'locked' && step.requiredSteps && step.requiredSteps.length > 0 && (
                                <p className="text-xs text-amber-400 flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  Requiert: {step.requiredSteps.join(', ')}
                                </p>
                              )}
                              {status === 'completed' && (
                                <p className="text-xs text-emerald-400 flex items-center gap-1">
                                  <Check className="w-3 h-3" /> Complété
                                </p>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation Buttons + Current Step */}
        <div className="flex items-center justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => prevStep && handleNavigate(STEP_TO_TAB[prevStep.id])}
            disabled={!prevStep || isGenerating}
            className="flex items-center gap-1 border-gold/30 text-gold/70 hover:text-gold bg-slate-800/50"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{prevStep?.shortLabel || 'Préc.'}</span>
          </Button>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/60 rounded-lg border border-gold/20">
            {isGenerating && <Loader2 className="w-4 h-4 animate-spin text-gold" />}
            <span className="text-sm font-semibold text-white">
              {currentStep.shortLabel}: {currentStep.label}
            </span>
            {hasStepResult(currentStepId) && (
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px] px-1.5 py-0">
                <Check className="w-3 h-3 mr-0.5" />Fait
              </Badge>
            )}
          </div>

          <Button
            size="sm"
            onClick={() => nextStep && handleNavigate(STEP_TO_TAB[nextStep.id])}
            disabled={!nextStep || isGenerating || (nextStep && !canProceedToNext(nextStep))}
            className="flex items-center gap-1 bg-gold hover:bg-gold-dark text-slate-900 font-semibold"
          >
            <span className="hidden sm:inline">{nextStep?.shortLabel || 'Suiv.'}</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Current Step Details */}
        <div className="bg-gold/10 border border-gold/20 rounded-lg p-3">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-gold">{currentStepIndex + 1}</span>
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-sm text-white">{currentStep.label}</h4>
              <p className="text-xs text-white/50 mt-0.5">{currentStep.description}</p>
              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                {currentStep.estimatedMinutes && (
                  <span className="text-xs text-gold">⏱️ ~{currentStep.estimatedMinutes} min</span>
                )}
                {currentStep.tip && (
                  <span className="text-xs text-white/40 italic">💡 {currentStep.tip}</span>
                )}
              </div>
              {currentStep.requiredSteps && currentStep.requiredSteps.length > 0 && !hasStepResult(currentStepId) && (
                <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs text-white/40">Prérequis:</span>
                  {currentStep.requiredSteps.map(reqId => (
                    <Badge
                      key={reqId}
                      className={cn(
                        "text-[10px] px-1.5 py-0",
                        hasStepResult(reqId)
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                      )}
                    >
                      {hasStepResult(reqId) && <Check className="w-2.5 h-2.5 mr-0.5" />}
                      {reqId}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default WorkflowNavigation;