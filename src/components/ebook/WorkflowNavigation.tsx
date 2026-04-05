import React from 'react';
import { ChevronLeft, ChevronRight, Check, Lock, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useWorkflowResults } from '@/hooks/useWorkflowResults';
import { WORKFLOW_STEPS as AGENT_STEPS } from './workflow/workflowAgents';

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
  const currentAgent = AGENT_STEPS[currentStepIndex];
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
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">🚀</span>
              <span className="text-sm font-bold text-primary">Workflow Éditorial</span>
              <Badge variant="outline" className="text-xs font-semibold border-primary/30 text-primary">
                {completedCount}/{WORKFLOW_STEPS.length}
              </Badge>
            </div>
            <span className="text-lg font-bold text-primary">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2.5 mb-4" />

          {/* Phases with agent steps */}
          <div className="space-y-2">
            {PHASES.map((phase) => {
              const phaseCompleted = getPhaseCompletedCount(phase);
              const phaseTotal = phase.steps.length;
              const isPhaseComplete = phaseCompleted === phaseTotal;

              return (
                <div key={phase.id} className="flex items-center gap-2">
                  <div className={cn(
                    "flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold shrink-0 min-w-[130px]",
                    isPhaseComplete ? "bg-green-500/15 text-green-600 dark:text-green-400" : "bg-muted text-muted-foreground"
                  )}>
                    <span>{phase.label}</span>
                    <span className="text-[10px] opacity-70">({phaseCompleted}/{phaseTotal})</span>
                  </div>

                  <div className="flex items-center gap-1 flex-wrap">
                    {phase.steps.map((stepId) => {
                      const step = WORKFLOW_STEPS.find(s => s.id === stepId)!;
                      const agentDef = AGENT_STEPS.find(a => a.id === stepId);
                      const status = getStepStatus(step);
                      const tabId = STEP_TO_TAB[step.id];
                      const AgentIcon = agentDef?.icon;

                      return (
                        <Tooltip key={step.id}>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => status !== 'locked' && handleNavigate(tabId)}
                              disabled={status === 'locked' || isGenerating}
                              className={cn(
                                "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all duration-200 border",
                                status === 'completed' && "bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30 shadow-sm",
                                status === 'current' && "bg-primary text-primary-foreground border-primary shadow-sm ring-2 ring-primary/30 ring-offset-1 ring-offset-background",
                                status === 'available' && "bg-muted hover:bg-accent text-muted-foreground border-border hover:text-foreground cursor-pointer",
                                status === 'locked' && "bg-muted/50 text-muted-foreground/40 border-transparent cursor-not-allowed"
                              )}
                            >
                              {status === 'completed' ? <Check className="w-3 h-3" /> : 
                               status === 'locked' ? <Lock className="w-3 h-3" /> : 
                               AgentIcon ? <AgentIcon className="w-3 h-3" /> : null}
                              <span>{step.shortLabel}</span>
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="max-w-xs">
                            <div className="space-y-1">
                              <p className="font-semibold">{step.id}: {agentDef?.agentTitle || step.label}</p>
                              <p className="text-xs text-muted-foreground">{agentDef?.agentMission || step.description}</p>
                              {step.estimatedMinutes && <p className="text-xs">⏱️ ~{step.estimatedMinutes} min</p>}
                              {status === 'locked' && step.requiredSteps && step.requiredSteps.length > 0 && (
                                <p className="text-xs text-amber-500 flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  Requiert: {step.requiredSteps.join(', ')}
                                </p>
                              )}
                              {status === 'completed' && (
                                <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
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

        {/* Current Agent Card */}
        {currentAgent && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                {isGenerating ? <Loader2 className="h-5 w-5 animate-spin" /> : <currentAgent.icon className="h-5 w-5" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="border-primary/30 text-primary text-xs">{currentStep.shortLabel}</Badge>
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">Agent {currentStepIndex + 1}/{WORKFLOW_STEPS.length}</span>
                  {hasStepResult(currentStepId) && (
                    <Badge className="bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/30 text-[10px] px-1.5 py-0">
                      <Check className="w-3 h-3 mr-0.5" />Fait
                    </Badge>
                  )}
                </div>
                <h3 className="mt-1 text-lg font-semibold text-foreground">{currentAgent.agentTitle}</h3>
                <p className="text-sm font-medium text-foreground/80">{currentAgent.agentSubtitle}</p>
                <p className="text-sm text-muted-foreground mt-1">{currentAgent.agentMission}</p>
                {currentStep.tip && (
                  <p className="text-xs text-muted-foreground mt-2 italic">💡 {currentStep.tip}</p>
                )}
                {currentStep.requiredSteps && currentStep.requiredSteps.length > 0 && !hasStepResult(currentStepId) && (
                  <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs text-muted-foreground">Prérequis:</span>
                    {currentStep.requiredSteps.map(reqId => (
                      <Badge
                        key={reqId}
                        variant="outline"
                        className={cn(
                          "text-[10px] px-1.5 py-0",
                          hasStepResult(reqId)
                            ? "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/30"
                            : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
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
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => prevStep && handleNavigate(STEP_TO_TAB[prevStep.id])}
            disabled={!prevStep || isGenerating}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{prevStep?.shortLabel || 'Préc.'}</span>
          </Button>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg border border-border">
            {isGenerating && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
            <span className="text-sm font-semibold text-foreground">
              {currentStep.shortLabel}: {currentStep.label}
            </span>
          </div>

          <Button
            size="sm"
            onClick={() => nextStep && handleNavigate(STEP_TO_TAB[nextStep.id])}
            disabled={!nextStep || isGenerating || (nextStep && !canProceedToNext(nextStep))}
            className="flex items-center gap-1"
          >
            <span className="hidden sm:inline">{nextStep?.shortLabel || 'Suiv.'}</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default WorkflowNavigation;
