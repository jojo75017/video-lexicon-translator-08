import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Rocket, Target, PenTool, Package, Brain, 
  Sparkles, Play, BookOpen, CheckCircle2, ArrowRight, Zap,
  TrendingUp, Shield, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useWorkflowResults } from '@/hooks/useWorkflowResults';

interface WorkflowOnboardingProps {
  onStartWorkflow: () => void;
  onNavigateToStep: (tabId: string) => void;
  ebookTitle?: string;
  hasExistingProject?: boolean;
}

const PHASES = [
  {
    id: 'direction',
    title: 'Positionner',
    subtitle: 'Positionnez votre livre sur le marché',
    icon: Target,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    textColor: 'text-blue-400',
    steps: [
      { id: 'P1', label: 'Directeur Éditorial', desc: 'Analyse & score du titre', tabId: 'editorial-director', time: '2 min' },
      { id: 'P2', label: 'Analyse Marché', desc: 'Mots-clés & concurrence KDP', tabId: 'market-analysis', time: '3 min' },
    ]
  },
  {
    id: 'production',
    title: 'Produire',
    subtitle: 'Créez le contenu de votre livre',
    icon: PenTool,
    color: 'from-violet-500 to-purple-500',
    bgColor: 'bg-violet-500/10',
    borderColor: 'border-violet-500/30',
    textColor: 'text-violet-400',
    steps: [
      { id: 'P3', label: 'Architecte Contenu', desc: 'Structure & chapitres', tabId: 'content-architect', time: '3 min' },
      { id: 'P4', label: 'Rédaction Expert', desc: 'Génération du contenu', tabId: 'expert-writing', time: '15 min' },
      { id: 'P5', label: 'Réécriture Naturelle', desc: 'Humanisation du texte', tabId: 'natural-rewrite', time: '5 min' },
    ]
  },
  {
    id: 'publication',
    title: 'Optimiser',
    subtitle: 'Préparez votre publication KDP',
    icon: Package,
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    textColor: 'text-emerald-400',
    steps: [
      { id: 'P6', label: 'Qualité Éditoriale', desc: 'Grammaire & cohérence', tabId: 'editorial-quality', time: '3 min' },
      { id: 'P7', label: 'Packaging Éditorial', desc: 'Description & métadonnées', tabId: 'editorial-packaging', time: '2 min' },
      { id: 'P8', label: 'Diagnostic Final', desc: 'Vérification pré-publication', tabId: 'final-diagnosis', time: '3 min' },
    ]
  },
  {
    id: 'intelligence',
    title: 'Perfectionner',
    subtitle: 'Intelligence avancée & finition',
    icon: Brain,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    textColor: 'text-amber-400',
    steps: [
      { id: 'P9', label: 'Mémoire Éditoriale', desc: 'Cohérence globale', tabId: 'editorial-memory', time: '2 min' },
      { id: 'P10', label: 'Cohérence Chapitres', desc: 'Liens inter-chapitres', tabId: 'chapter-coherence', time: '3 min' },
      { id: 'P11', label: 'Auto-Critique', desc: 'Analyse critique IA', tabId: 'self-critique', time: '3 min' },
      { id: 'P12', label: 'Boucle Itérative', desc: 'Amélioration auto', tabId: 'iterative-loop', time: '5 min' },
      { id: 'P13', label: 'Signature Style', desc: 'Style unifié', tabId: 'style-signature', time: '2 min' },
      { id: 'P14', label: 'Verdict Ultime', desc: 'Validation finale', tabId: 'ultimate-verdict', time: '2 min' },
      { id: 'P15', label: 'Humanisation Anti-IA', desc: '🎁 BONUS', tabId: 'humanize-anti-ia', time: '5 min' },
    ]
  }
];

export const WorkflowOnboarding: React.FC<WorkflowOnboardingProps> = ({
  onStartWorkflow,
  onNavigateToStep,
  ebookTitle,
  hasExistingProject = false,
}) => {
  const { hasStepResult, getCompletedStepsCount } = useWorkflowResults();
  const completedCount = getCompletedStepsCount();
  const [hoveredPhase, setHoveredPhase] = useState<string | null>(null);

  const getNextStep = () => {
    for (const phase of PHASES) {
      for (const step of phase.steps) {
        if (!hasStepResult(step.id)) return step;
      }
    }
    return PHASES[0].steps[0];
  };

  const nextStep = getNextStep();
  const isFirstTime = completedCount === 0 && !ebookTitle;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Hero Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-amber-950/20 border-2 border-gold/20 p-8 md:p-12"
      >
        {/* Decorative orbs */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-gold/10 rounded-full blur-[80px]" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-gold-dark/10 rounded-full blur-[60px]" />

        <div className="relative text-center space-y-6">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gold/15 border border-gold/30"
          >
            {isFirstTime ? (
              <Rocket className="w-10 h-10 text-gold" />
            ) : (
              <BookOpen className="w-10 h-10 text-gold" />
            )}
          </motion.div>

          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gradient-gold tracking-tight">
              {isFirstTime 
                ? "Créez votre ebook en 4 étapes simples"
                : ebookTitle 
                  ? `Continuez « ${ebookTitle} »` 
                  : "Votre Workflow Éditorial"
              }
            </h1>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              {isFirstTime 
                ? "15 experts IA travaillent pour vous. Suivez le chemin, cliquez, c'est fait."
                : `${completedCount}/15 étapes complétées — Continuez là où vous en étiez.`
              }
            </p>
          </div>

          {/* Main CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              onClick={() => onNavigateToStep(nextStep.tabId)}
              className="text-lg px-8 py-6 h-auto rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg shadow-cyan-500/25 gap-3 group"
            >
              {isFirstTime ? (
                <>
                  <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Commencer par P1
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Continuer → {nextStep.id}: {nextStep.label}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={onStartWorkflow}
              className="rounded-2xl px-6 py-6 h-auto gap-2 border-white/20 text-white/70 hover:text-white bg-slate-800/50"
            >
              <Sparkles className="w-5 h-5" />
              Tout automatiser (P1→P15)
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-6 text-sm text-white/40 pt-2">
            <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-emerald-400" /> Score qualité 9/10</span>
            <span className="flex items-center gap-1.5"><TrendingUp className="w-4 h-4 text-cyan-400" /> Optimisé KDP</span>
            <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-400" /> Anti-détection IA</span>
          </div>
        </div>
      </motion.div>

      {/* 4 Phases Roadmap */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white text-center">
          Le chemin vers votre livre publié
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PHASES.map((phase, phaseIdx) => {
            const PhaseIcon = phase.icon;
            const phaseCompleted = phase.steps.every(s => hasStepResult(s.id));
            const phaseProgress = phase.steps.filter(s => hasStepResult(s.id)).length;
            const isActive = phase.steps.some(s => s.id === nextStep.id);

            return (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * phaseIdx }}
                onMouseEnter={() => setHoveredPhase(phase.id)}
                onMouseLeave={() => setHoveredPhase(null)}
              >
                <Card className={cn(
                  "relative overflow-hidden transition-all duration-300 border-2 p-5 bg-slate-900/80 backdrop-blur-sm",
                  isActive && "ring-2 ring-cyan-500/30 ring-offset-2 ring-offset-slate-950",
                  phaseCompleted ? "border-emerald-500/40" : phase.borderColor,
                  hoveredPhase === phase.id && "shadow-lg shadow-cyan-500/10 -translate-y-0.5"
                )}>
                  {/* Phase Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br",
                      phaseCompleted ? "from-emerald-500 to-green-500" : phase.color
                    )}>
                      {phaseCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      ) : (
                        <PhaseIcon className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-lg">
                          {phaseIdx + 1}. {phase.title}
                        </h3>
                        {isActive && !phaseCompleted && (
                          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs animate-pulse">
                            En cours
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-white/40">{phase.subtitle}</p>
                    </div>
                    <span className="text-sm font-medium text-white/40">
                      {phaseProgress}/{phase.steps.length}
                    </span>
                  </div>

                  {/* Steps list */}
                  <div className="space-y-2">
                    {phase.steps.map((step) => {
                      const isDone = hasStepResult(step.id);
                      const isNext = step.id === nextStep.id;

                      return (
                        <button
                          key={step.id}
                          onClick={() => onNavigateToStep(step.tabId)}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left group",
                            isDone && "bg-emerald-500/10 hover:bg-emerald-500/15",
                            isNext && "bg-cyan-500/10 hover:bg-cyan-500/15 ring-1 ring-cyan-500/30",
                            !isDone && !isNext && "hover:bg-slate-800/50"
                          )}
                        >
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all",
                            isDone && "bg-emerald-500 text-white",
                            isNext && "bg-cyan-600 text-white shadow-md shadow-cyan-500/30",
                            !isDone && !isNext && "bg-slate-800 text-white/40"
                          )}>
                            {isDone ? <CheckCircle2 className="w-4 h-4" /> : step.id.replace('P', '')}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                "font-medium text-sm truncate",
                                isDone && "text-emerald-400",
                                isNext && "text-cyan-400 font-semibold",
                                !isDone && !isNext && "text-white/40"
                              )}>
                                {step.label}
                              </span>
                              {step.id === 'P15' && (
                                <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30 text-[10px] px-1.5">
                                  BONUS
                                </Badge>
                              )}
                            </div>
                            <span className="text-xs text-white/30">{step.desc}</span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[11px] text-white/20">{step.time}</span>
                            {isNext && (
                              <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center pb-8"
      >
        <p className="text-sm text-white/30 mb-3">
          Temps estimé total : <span className="font-semibold text-white/60">~55 minutes</span> • Entièrement guidé par l'IA
        </p>
      </motion.div>
    </div>
  );
};

export default WorkflowOnboarding;