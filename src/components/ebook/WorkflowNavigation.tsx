import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, Lock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
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
  { id: 1, label: 'Préparation', emoji: '📋', steps: ['P1', 'P2', 'P3'] },
  { id: 2, label: 'Rédaction', emoji: '✍️', steps: ['P4', 'P5', 'P6', 'P7', 'P8'] },
  { id: 3, label: 'Optimisation', emoji: '🔍', steps: ['P9', 'P10', 'P11', 'P12', 'P13', 'P14'] },
  { id: 4, label: 'Bonus', emoji: '🎁', steps: ['P15'] },
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
  const [activePhase, setActivePhase] = useState<number | null>(null);

  const currentStepId = TAB_TO_STEP[currentTabId];
  const currentStepIndex = WORKFLOW_STEPS.findIndex(s => s.id === currentStepId);
  const isWorkflowTab = currentStepIndex >= 0;

  if (!isWorkflowTab) return null;

  const completedCount = getCompletedStepsCount();
  const progressPercentage = (completedCount / WORKFLOW_STEPS.length) * 100;
  const currentStep = WORKFLOW_STEPS[currentStepIndex];
  const currentAgent = AGENT_STEPS[currentStepIndex];
  const currentPhase = PHASES.find(p => p.steps.includes(currentStepId));

  // Auto-detect active phase from current step
  const displayPhase = activePhase ?? currentPhase?.id ?? 1;

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

  return (
    <div className={cn("space-y-0 mb-6", className)}>
      {/* ── Agent Card (like the screenshot style) ── */}
      {currentAgent && (
        <div className="bg-card border border-border rounded-t-xl p-5 flex items-start gap-4">
          {/* Agent Icon / Avatar */}
          <div className={cn(
            "flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl shadow-md",
            "bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20"
          )}>
            {isGenerating 
              ? <Loader2 className="h-7 w-7 animate-spin text-primary" />
              : <currentAgent.icon className="h-7 w-7 text-primary" />
            }
          </div>

          {/* Agent Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="text-base font-bold text-foreground">
                {currentAgent.agentTitle} {currentAgent.agentSubtitle && `— ${currentAgent.agentSubtitle}`}
              </h3>
              {hasStepResult(currentStepId) && (
                <Badge className="bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/30 text-xs">
                  <Check className="w-3 h-3 mr-1" />Terminé
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {currentAgent.agentMission}
            </p>
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Badge variant="outline" className="text-[11px] font-semibold border-primary/30 text-primary px-1.5 py-0">
                  Étape {currentStep.shortLabel}
                </Badge>
              </span>
              <span>⏱️ ~{currentStep.estimatedMinutes} min</span>
              <span className="text-muted-foreground/60">•</span>
              <span>{completedCount}/{WORKFLOW_STEPS.length} complétées</span>
              <span className="text-muted-foreground/60">•</span>
              <span className="font-semibold text-primary">{Math.round(progressPercentage)}%</span>
            </div>
            {/* Prerequisites */}
            {currentStep.requiredSteps && currentStep.requiredSteps.length > 0 && !hasStepResult(currentStepId) && (
              <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                <span className="text-xs text-muted-foreground">Prérequis :</span>
                {currentStep.requiredSteps.map(reqId => (
                  <Badge
                    key={reqId}
                    variant="outline"
                    className={cn(
                      "text-[10px] px-1.5 py-0",
                      hasStepResult(reqId)
                        ? "bg-green-500/15 text-green-600 border-green-500/30"
                        : "bg-amber-500/15 text-amber-600 border-amber-500/30"
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
      )}

      {/* ── Progress bar ── */}
      <Progress value={progressPercentage} className="h-1.5 rounded-none" />

      {/* ── Phase Tabs (like "Thématiques | Calendrier éditorial") ── */}
      <div className="bg-card border-x border-border">
        <div className="flex">
          {PHASES.map((phase) => {
            const phaseCompleted = phase.steps.filter(id => hasStepResult(id)).length;
            const isActive = displayPhase === phase.id;
            
            return (
              <button
                key={phase.id}
                onClick={() => setActivePhase(phase.id)}
                className={cn(
                  "flex-1 px-4 py-2.5 text-sm font-medium transition-all border-b-2 relative",
                  isActive
                    ? "border-primary text-primary bg-primary/5"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <span>{phase.emoji} {phase.label}</span>
                <span className="ml-1.5 text-[11px] opacity-60">{phaseCompleted}/{phase.steps.length}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Steps of the active phase (simple clickable tabs) ── */}
      <div className="bg-card border-x border-b border-border rounded-b-xl p-3">
        <div className="flex flex-wrap gap-2">
          {PHASES.find(p => p.id === displayPhase)?.steps.map((stepId) => {
            const step = WORKFLOW_STEPS.find(s => s.id === stepId)!;
            const agent = AGENT_STEPS.find(a => a.id === stepId);
            const status = getStepStatus(step);
            const tabId = STEP_TO_TAB[step.id];
            const AgentIcon = agent?.icon;

            return (
              <button
                key={step.id}
                onClick={() => status !== 'locked' && handleNavigate(tabId)}
                disabled={status === 'locked' || isGenerating}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border",
                  status === 'completed' && "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
                  status === 'current' && "bg-primary text-primary-foreground border-primary shadow-sm",
                  status === 'available' && "bg-muted/50 hover:bg-accent text-muted-foreground border-border hover:text-foreground cursor-pointer",
                  status === 'locked' && "bg-muted/30 text-muted-foreground/40 border-transparent cursor-not-allowed opacity-50"
                )}
              >
                {status === 'completed' ? (
                  <Check className="w-4 h-4 shrink-0" />
                ) : status === 'locked' ? (
                  <Lock className="w-3.5 h-3.5 shrink-0" />
                ) : AgentIcon ? (
                  <AgentIcon className="w-4 h-4 shrink-0" />
                ) : null}
                <span className="whitespace-nowrap">{step.shortLabel} — {agent?.agentTitle || step.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Prev / Next Navigation ── */}
      <div className="flex items-center justify-between gap-3 mt-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => prevStep && handleNavigate(STEP_TO_TAB[prevStep.id])}
          disabled={!prevStep || isGenerating}
          className="flex items-center gap-1.5"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">
            {prevStep ? `${prevStep.shortLabel} — ${AGENT_STEPS.find(a => a.id === prevStep.id)?.agentTitle || prevStep.label}` : 'Précédent'}
          </span>
        </Button>

        <div className="text-xs text-muted-foreground">
          {currentStep.tip && <span>💡 {currentStep.tip}</span>}
        </div>

        <Button
          size="sm"
          onClick={() => nextStep && handleNavigate(STEP_TO_TAB[nextStep.id])}
          disabled={!nextStep || isGenerating || (nextStep && !canProceedToNext(nextStep))}
          className="flex items-center gap-1.5"
        >
          <span className="hidden sm:inline">
            {nextStep ? `${nextStep.shortLabel} — ${AGENT_STEPS.find(a => a.id === nextStep.id)?.agentTitle || nextStep.label}` : 'Suivant'}
          </span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default WorkflowNavigation;
