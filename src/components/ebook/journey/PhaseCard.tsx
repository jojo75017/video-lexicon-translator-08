import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, Circle, Loader2, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { JourneyPhase, JourneyContext, StepStatus } from '@/data/ebookJourneySteps';
import { getPhaseStatus } from '@/data/ebookJourneySteps';

interface PhaseCardProps {
  phase: JourneyPhase;
  ctx: JourneyContext;
  isActive: boolean;
  onNavigate: (tabId: string, externalRoute?: string) => void;
}

const statusLabel: Record<StepStatus, string> = {
  done: 'Terminé',
  in_progress: 'En cours',
  todo: 'À faire',
};

export const PhaseCard: React.FC<PhaseCardProps> = ({ phase, ctx, isActive, onNavigate }) => {
  const status = getPhaseStatus(phase, ctx);
  const [open, setOpen] = useState(isActive || status === 'in_progress');
  const PhaseIcon = phase.icon;

  const doneCount = phase.steps.filter(s => s.isDone(ctx)).length;
  const totalCount = phase.steps.length;
  const progress = Math.round((doneCount / totalCount) * 100);

  return (
    <div
      className={`relative rounded-2xl border-2 transition-all duration-300 ${
        isActive ? 'shadow-lg' : 'shadow-sm'
      }`}
      style={{
        borderColor: isActive ? phase.color : '#E5E7EB',
        background: isActive ? `linear-gradient(135deg, ${phase.bg} 0%, #FFFFFF 100%)` : '#FFFFFF',
      }}
    >
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-5 text-left"
      >
        {/* Number + Icon */}
        <div
          className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center relative"
          style={{ backgroundColor: phase.color }}
        >
          <PhaseIcon className="w-7 h-7 text-white" />
          <span
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border-2 flex items-center justify-center text-xs font-bold"
            style={{ borderColor: phase.color, color: phase.color }}
          >
            {phase.number}
          </span>
        </div>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-bold" style={{ color: '#232F3E' }}>
              Phase {phase.number} - {phase.title}
            </h3>
            {status === 'done' && (
              <Badge className="bg-green-100 text-green-700 border-green-200">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Terminé
              </Badge>
            )}
            {status === 'in_progress' && (
              <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                <Loader2 className="w-3 h-3 mr-1 animate-spin" /> En cours
              </Badge>
            )}
            {isActive && status !== 'done' && (
              <Badge style={{ backgroundColor: '#FF9E2D', color: 'white' }}>
                <Sparkles className="w-3 h-3 mr-1" /> Étape actuelle
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">{phase.subtitle}</p>
          {/* Mini progress */}
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-xs">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, backgroundColor: phase.color }}
              />
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              {doneCount}/{totalCount}
            </span>
          </div>
        </div>

        {open ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
      </button>

      {/* Steps */}
      {open && (
        <div className="px-5 pb-5 space-y-2 animate-fade-in">
          <div className={`grid gap-3 ${phase.id === 'visuels' ? 'md:grid-cols-3' : 'md:grid-cols-1'}`}>
            {phase.steps.map((step) => {
              const StepIcon = step.icon;
              const done = step.isDone(ctx);
              return (
                <div
                  key={step.id}
                  className={`group rounded-xl border p-4 transition-all hover:shadow-md cursor-pointer ${
                    step.highlight ? 'border-2' : 'border'
                  } ${done ? 'bg-green-50/50' : 'bg-white hover:bg-gray-50'}`}
                  style={{
                    borderColor: step.highlight ? phase.color : done ? '#86EFAC' : '#E5E7EB',
                  }}
                  onClick={() => onNavigate(step.tabId, step.externalRoute)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: done ? '#DCFCE7' : phase.bg }}
                    >
                      {done ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <StepIcon className="w-5 h-5" style={{ color: phase.color }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-sm" style={{ color: '#232F3E' }}>
                          {step.label}
                        </h4>
                        {step.highlight && (
                          <Badge variant="outline" className="text-[10px] py-0 h-4" style={{ borderColor: phase.color, color: phase.color }}>
                            ⭐ Recommandé
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                      {step.estimate && (
                        <span className="text-[11px] text-muted-foreground mt-1 inline-block">
                          ⏱ {step.estimate}
                        </span>
                      )}
                    </div>
                    <ArrowRight
                      className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1"
                      style={{ color: phase.color }}
                    />
                  </div>
                  {!done && (
                    <Button
                      size="sm"
                      variant={step.highlight ? 'default' : 'outline'}
                      className={`w-full mt-3 ${step.highlight ? 'text-white hover:opacity-90' : ''}`}
                      style={
                        step.highlight
                          ? { backgroundColor: phase.color }
                          : { borderColor: phase.color, color: phase.color }
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate(step.tabId, step.externalRoute);
                      }}
                    >
                      {step.highlight ? 'Ouvrir (recommandé)' : 'Choisir cette option'}
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
