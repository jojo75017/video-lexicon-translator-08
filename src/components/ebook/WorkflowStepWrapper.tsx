import React from 'react';
import { ChevronRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { WorkflowNavigation, TAB_TO_STEP, STEP_TO_TAB, WORKFLOW_STEPS } from './WorkflowNavigation';
import { useWorkflowResults } from '@/hooks/useWorkflowResults';

interface WorkflowStepWrapperProps {
  currentTabId: string;
  onNavigate: (tabId: string) => void;
  isGenerating?: boolean;
  children: React.ReactNode;
}

/**
 * Wrapper component that adds navigation controls to workflow steps (P1-P14).
 * This component wraps individual workflow modules and provides:
 * - Progress bar showing completion status
 * - Previous/Next navigation buttons
 * - Step indicators with prerequisites
 * - Current step guidance
 */
export const WorkflowStepWrapper: React.FC<WorkflowStepWrapperProps> = ({
  currentTabId,
  onNavigate,
  isGenerating = false,
  children,
}) => {
  const isWorkflowTab = !!TAB_TO_STEP[currentTabId];
  const { hasStepResult, saveStepResult } = useWorkflowResults();

  // Only render navigation for workflow tabs
  if (!isWorkflowTab) {
    return <>{children}</>;
  }

  const currentStepId = TAB_TO_STEP[currentTabId];
  const currentStepIndex = WORKFLOW_STEPS.findIndex((step) => step.id === currentStepId);
  const currentStep = WORKFLOW_STEPS[currentStepIndex];
  const nextStep = currentStepIndex >= 0 && currentStepIndex < WORKFLOW_STEPS.length - 1
    ? WORKFLOW_STEPS[currentStepIndex + 1]
    : null;
  const currentStepCompleted = currentStepId ? hasStepResult(currentStepId) : false;

  const validateAndContinue = () => {
    if (!currentStepId || !currentStep) return;

    if (!currentStepCompleted) {
      saveStepResult(
        currentStepId,
        { validatedManually: true, stepId: currentStepId, label: currentStep.label },
        `# ${currentStepId} — ${currentStep.label}\n\nÉtape validée manuellement pour débloquer la suite du workflow.`
      );
      toast.success(`${currentStepId} validé — workflow débloqué.`);
    }

    if (nextStep) {
      onNavigate(STEP_TO_TAB[nextStep.id]);
    } else {
      toast.success('Workflow P1 → P15 terminé.');
    }
  };

  return (
    <div className="space-y-0">
      <WorkflowNavigation
        currentTabId={currentTabId}
        onNavigate={onNavigate}
        isGenerating={isGenerating}
      />
      {children}
      <Card className="mt-4 border-primary/20 bg-primary/5">
        <CardContent className="grid gap-3 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="min-w-0 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {currentStepCompleted ? `${currentStepId} est validé.` : `Si ${currentStepId} bloque, validez l'étape pour continuer.`}
            </span>{' '}
            {nextStep ? `Prochaine étape : ${nextStep.id} — ${nextStep.label}.` : 'Dernière étape du workflow.'}
          </div>
          <Button
            type="button"
            onClick={validateAndContinue}
            disabled={isGenerating}
            className="h-auto min-h-10 w-full whitespace-normal px-4 py-2 leading-snug sm:w-auto"
          >
            {currentStepCompleted ? <ChevronRight className="mr-2 h-4 w-4" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
            {nextStep
              ? currentStepCompleted
                ? `Continuer vers ${nextStep.id}`
                : `Valider et continuer vers ${nextStep.id}`
              : currentStepCompleted
                ? 'Workflow terminé'
                : 'Valider P15'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkflowStepWrapper;
