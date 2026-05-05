import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PhaseCard } from './journey/PhaseCard';
import {
  JOURNEY_PHASES,
  getActivePhaseId,
  getOverallProgress,
  getNextStep,
  type JourneyContext,
} from '@/data/ebookJourneySteps';
import type { Chapter } from '@/hooks/useSubscriptionGeneration';

interface EbookJourneyDashboardProps {
  ebookTitle: string;
  authorName: string;
  bookDescription: string;
  targetAudience: string;
  genre: string;
  chapters: Chapter[];
  preface: string;
  conclusion: string;
  coverImageUrl?: string;
  kdpDescription?: string;
  kdpKeywords?: string;
  kdpCategories?: string[] | string;
  onNavigateToTab: (tabId: string) => void;
  onStartAutoWorkflow: () => void;
}

export const EbookJourneyDashboard: React.FC<EbookJourneyDashboardProps> = (props) => {
  const navigate = useNavigate();

  const ctx: JourneyContext = useMemo(() => ({
    ebookTitle: props.ebookTitle,
    authorName: props.authorName,
    bookDescription: props.bookDescription,
    targetAudience: props.targetAudience,
    genre: props.genre,
    chapters: props.chapters,
    preface: props.preface,
    conclusion: props.conclusion,
    coverImageUrl: props.coverImageUrl,
    kdpDescription: props.kdpDescription,
    kdpKeywords: props.kdpKeywords,
    kdpCategories: props.kdpCategories,
  }), [props]);

  const activePhaseId = getActivePhaseId(ctx);
  const overall = getOverallProgress(ctx);
  const nextStep = getNextStep(ctx);
  const activePhase = JOURNEY_PHASES.find(p => p.id === activePhaseId)!;

  const handleNavigate = (tabId: string, externalRoute?: string) => {
    if (externalRoute) {
      navigate(externalRoute);
    } else {
      props.onNavigateToTab(tabId);
    }
  };

  const handleContinue = () => {
    if (!nextStep) return;
    handleNavigate(nextStep.tabId, nextStep.externalRoute);
  };

  return (
    <div className="space-y-6">
      {/* HEADER COMPACT */}
      <div
        className="rounded-2xl p-6 text-white relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #008296 0%, #FF9E2D 100%)',
        }}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-sm opacity-90 mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Votre parcours de A à Z</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold truncate">
              {props.ebookTitle || 'Nouveau projet'}
            </h2>
            <p className="text-sm opacity-90 mt-1">
              Phase actuelle : <strong>{activePhase.title}</strong> · {overall}% du parcours complété
            </p>
            {/* Progress bar */}
            <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden max-w-md">
              <div
                className="h-full bg-white rounded-full transition-all duration-700"
                style={{ width: `${overall}%` }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {nextStep ? (
              <Button
                size="lg"
                onClick={handleContinue}
                className="bg-white hover:bg-white/90 font-semibold shadow-lg"
                style={{ color: '#232F3E' }}
              >
                ▶ Continuer : {nextStep.label}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                size="lg"
                className="bg-white font-semibold shadow-lg"
                style={{ color: '#232F3E' }}
                disabled
              >
                <Trophy className="w-4 h-4 mr-2" />
                Parcours complété !
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={props.onStartAutoWorkflow}
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white"
            >
              🪄 Lancer le Workflow IA 15 Agents
            </Button>
          </div>
        </div>
        {/* Decorative shapes */}
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute -right-20 -bottom-20 w-60 h-60 rounded-full bg-white/5" />
      </div>

      {/* TIMELINE LEGEND */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground px-2 flex-wrap">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-green-500 inline-block" /> Terminé
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-orange-500 inline-block" /> En cours
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-gray-300 inline-block" /> À faire
        </span>
        <span className="ml-auto italic">Cliquez sur une phase pour voir ses étapes</span>
      </div>

      {/* PHASES TIMELINE */}
      <div className="relative space-y-4">
        {/* Vertical connector line */}
        <div
          className="absolute left-[34px] top-12 bottom-12 w-0.5 hidden md:block"
          style={{
            background: 'linear-gradient(to bottom, #008296 0%, #FF9E2D 50%, #16A34A 100%)',
            opacity: 0.3,
          }}
        />
        {JOURNEY_PHASES.map((phase) => (
          <PhaseCard
            key={phase.id}
            phase={phase}
            ctx={ctx}
            isActive={phase.id === activePhaseId}
            onNavigate={handleNavigate}
          />
        ))}
      </div>
    </div>
  );
};
