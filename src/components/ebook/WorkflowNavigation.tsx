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
}

export const WORKFLOW_STEPS: WorkflowStep[] = [
  { id: 'P1', label: 'Directeur Éditorial', shortLabel: 'P1', description: 'Analyse du titre et positionnement stratégique', requiredSteps: [] },
  { id: 'P2', label: 'Analyse Marché', shortLabel: 'P2', description: 'Mots-clés KDP et analyse concurrentielle', requiredSteps: ['P1'] },
  { id: 'P3', label: 'Architecte Contenu', shortLabel: 'P3', description: 'Structure des chapitres et personnages', requiredSteps: ['P1', 'P2'] },
  { id: 'P4', label: 'Rédaction Expert', shortLabel: 'P4', description: 'Génération du contenu des chapitres', requiredSteps: ['P3'] },
  { id: 'P5', label: 'Réécriture Naturelle', shortLabel: 'P5', description: 'Humanisation du texte généré', requiredSteps: ['P4'] },
  { id: 'P6', label: 'Qualité Éditoriale', shortLabel: 'P6', description: 'Analyse qualité et suggestions', requiredSteps: ['P4'] },
  { id: 'P7', label: 'Packaging Éditorial', shortLabel: 'P7', description: 'Description et métadonnées KDP', requiredSteps: ['P1', 'P2'] },
  { id: 'P8', label: 'Diagnostic Final', shortLabel: 'P8', description: 'Vérification complète avant publication', requiredSteps: ['P4', 'P7'] },
  { id: 'P9', label: 'Mémoire Éditoriale', shortLabel: 'P9', description: 'Cohérence globale du projet', requiredSteps: ['P4'] },
  { id: 'P10', label: 'Cohérence Chapitres', shortLabel: 'P10', description: 'Liens entre les chapitres', requiredSteps: ['P4'] },
  { id: 'P11', label: 'Auto-Critique', shortLabel: 'P11', description: 'Analyse critique du manuscrit', requiredSteps: ['P4'] },
  { id: 'P12', label: 'Boucle Itérative', shortLabel: 'P12', description: 'Amélioration continue', requiredSteps: ['P11'] },
  { id: 'P13', label: 'Signature Style', shortLabel: 'P13', description: 'Cohérence stylistique', requiredSteps: ['P4'] },
  { id: 'P14', label: 'Verdict Ultime', shortLabel: 'P14', description: 'Évaluation finale et recommandations', requiredSteps: ['P8'] },
];

// Mapping between workflow step IDs and tab IDs
export const STEP_TO_TAB: Record<string, string> = {
  'P1': 'editorial-director',
  'P2': 'market-analysis',
  'P3': 'content-architect',
  'P4': 'expert-writing',
  'P5': 'natural-rewrite',
  'P6': 'editorial-quality',
  'P7': 'editorial-packaging',
  'P8': 'final-diagnosis',
  'P9': 'editorial-memory',
  'P10': 'chapter-coherence',
  'P11': 'self-critique',
  'P12': 'iterative-loop',
  'P13': 'style-signature',
  'P14': 'ultimate-verdict',
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
    if (!isGenerating) {
      onNavigate(tabId);
    }
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className={cn("space-y-4 mb-6", className)}>
        {/* Progress Bar */}
        <div className="bg-card border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">Progression du Workflow</span>
              <Badge variant="outline" className="text-xs">
                {completedCount}/{WORKFLOW_STEPS.length} étapes
              </Badge>
            </div>
            <span className="text-sm font-bold text-primary">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          
          {/* Step Indicators */}
          <div className="flex justify-between mt-3 overflow-x-auto pb-1">
            {WORKFLOW_STEPS.map((step, idx) => {
              const status = getStepStatus(step);
              const tabId = STEP_TO_TAB[step.id];
              
              return (
                <Tooltip key={step.id}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => status !== 'locked' && handleNavigate(tabId)}
                      disabled={status === 'locked' || isGenerating}
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 shrink-0",
                        status === 'completed' && "bg-green-500 text-white shadow-md shadow-green-500/30",
                        status === 'current' && "bg-primary text-primary-foreground ring-2 ring-primary/30 ring-offset-2 ring-offset-background",
                        status === 'available' && "bg-muted hover:bg-muted-foreground/20 text-muted-foreground hover:text-foreground cursor-pointer",
                        status === 'locked' && "bg-muted/50 text-muted-foreground/50 cursor-not-allowed"
                      )}
                    >
                      {status === 'completed' ? (
                        <Check className="w-4 h-4" />
                      ) : status === 'locked' ? (
                        <Lock className="w-3 h-3" />
                      ) : (
                        idx + 1
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs">
                    <div className="space-y-1">
                      <p className="font-semibold">{step.id}: {step.label}</p>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                      {status === 'locked' && step.requiredSteps && step.requiredSteps.length > 0 && (
                        <p className="text-xs text-orange-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Requiert: {step.requiredSteps.join(', ')}
                        </p>
                      )}
                      {status === 'completed' && (
                        <p className="text-xs text-green-500 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Complété
                        </p>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={() => prevStep && handleNavigate(STEP_TO_TAB[prevStep.id])}
            disabled={!prevStep || isGenerating}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            {prevStep ? (
              <span className="hidden sm:inline">{prevStep.shortLabel}: {prevStep.label}</span>
            ) : (
              <span>Précédent</span>
            )}
          </Button>

          <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-lg">
            {isGenerating && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
            <span className="text-sm font-medium">
              {currentStep.shortLabel}: {currentStep.label}
            </span>
            {hasStepResult(currentStepId) && (
              <Badge variant="default" className="bg-green-500 text-white text-xs">
                <Check className="w-3 h-3 mr-1" />
                Fait
              </Badge>
            )}
          </div>

          <Button
            onClick={() => nextStep && handleNavigate(STEP_TO_TAB[nextStep.id])}
            disabled={!nextStep || isGenerating || (nextStep && !canProceedToNext(nextStep))}
            className="flex items-center gap-2"
          >
            {nextStep ? (
              <span className="hidden sm:inline">{nextStep.shortLabel}: {nextStep.label}</span>
            ) : (
              <span>Suivant</span>
            )}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Current Step Guide */}
        {currentStep && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-primary">{currentStepIndex + 1}</span>
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-medium text-sm text-foreground">{currentStep.label}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{currentStep.description}</p>
                {currentStep.requiredSteps && currentStep.requiredSteps.length > 0 && !hasStepResult(currentStepId) && (
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-muted-foreground">Prérequis:</span>
                    {currentStep.requiredSteps.map(reqId => (
                      <Badge
                        key={reqId}
                        variant={hasStepResult(reqId) ? "default" : "outline"}
                        className={cn(
                          "text-xs",
                          hasStepResult(reqId) 
                            ? "bg-green-500 text-white" 
                            : "border-orange-300 text-orange-600"
                        )}
                      >
                        {hasStepResult(reqId) && <Check className="w-3 h-3 mr-1" />}
                        {reqId}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default WorkflowNavigation;
