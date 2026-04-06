import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  CheckCircle2, Lock, Clock, Play, LayoutList, Search,
  FolderOpen, CreditCard, Settings, Sparkles
} from 'lucide-react';
import { useWorkflowResults } from '@/hooks/useWorkflowResults';
import {
  TRELLO_COLUMNS,
  TAB_TO_WORKFLOW_STEP,
  COLUMN_COLORS,
  ACCOUNT_QUICK_ITEMS,
  type TrelloCard,
  type TrelloColumn,
} from './TrelloBoardColumns';

interface TrelloBoardViewProps {
  ebookTitle: string;
  onNavigate: (tabId: string) => void;
  onSwitchToClassic: () => void;
}

type CardStatus = 'completed' | 'in-progress' | 'available' | 'locked';

export const TrelloBoardView: React.FC<TrelloBoardViewProps> = ({
  ebookTitle,
  onNavigate,
  onSwitchToClassic,
}) => {
  const { hasStepResult, getCompletedStepsCount } = useWorkflowResults();

  const getCardStatus = (card: TrelloCard): CardStatus => {
    if (!card.isWorkflowStep) return 'available';

    const stepId = TAB_TO_WORKFLOW_STEP[card.id];
    if (!stepId) return 'available';

    if (hasStepResult(stepId)) return 'completed';

    if (card.requiredSteps) {
      const allMet = card.requiredSteps.every(req => hasStepResult(req));
      if (!allMet) return 'locked';
    }

    return 'available';
  };

  const completedCount = getCompletedStepsCount();
  const totalAgents = 15;
  const progressPercent = Math.round((completedCount / totalAgents) * 100);

  const statusConfig: Record<CardStatus, { icon: React.ReactNode; label: string; class: string }> = {
    completed: { icon: <CheckCircle2 className="w-3.5 h-3.5" />, label: 'Fait', class: 'text-emerald-400' },
    'in-progress': { icon: <Play className="w-3.5 h-3.5" />, label: 'En cours', class: 'text-amber-400' },
    available: { icon: <Clock className="w-3.5 h-3.5" />, label: 'Dispo', class: 'text-blue-400' },
    locked: { icon: <Lock className="w-3.5 h-3.5" />, label: 'Bloqué', class: 'text-muted-foreground/50' },
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              {ebookTitle || 'Mon Projet'}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {completedCount}/{totalAgents} agents terminés · {progressPercent}%
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Quick account access */}
            {ACCOUNT_QUICK_ITEMS.map(item => (
              <Button
                key={item.id}
                variant="outline"
                size="sm"
                onClick={() => onNavigate(item.id)}
                className="rounded-xl text-xs border-border"
              >
                <item.icon className="w-3.5 h-3.5 mr-1.5" />
                {item.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="bg-card rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Progression du workflow</span>
            <span className="text-sm font-bold text-primary">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        {/* Kanban columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {TRELLO_COLUMNS.map(column => {
            const colors = COLUMN_COLORS[column.color] || COLUMN_COLORS.blue;
            const completedInCol = column.cards.filter(c => getCardStatus(c) === 'completed').length;

            return (
              <div
                key={column.id}
                className={cn(
                  "rounded-2xl border p-3 flex flex-col",
                  colors.bg,
                  colors.border
                )}
              >
                {/* Column header */}
                <div className={cn("rounded-xl px-3 py-2 mb-3", colors.header)}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-foreground">
                      {column.emoji} {column.label}
                    </span>
                    <Badge variant="secondary" className={cn("text-[10px] px-1.5 py-0", colors.badge)}>
                      {completedInCol}/{column.cards.length}
                    </Badge>
                  </div>
                </div>

                {/* Cards */}
                <div className="space-y-2 flex-1">
                  {column.cards.map(card => {
                    const status = getCardStatus(card);
                    const config = statusConfig[status];
                    const isLocked = status === 'locked';
                    const Icon = card.icon;

                    return (
                      <Tooltip key={card.id}>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => !isLocked && onNavigate(card.id)}
                            disabled={isLocked}
                            className={cn(
                              "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all text-left group",
                              colors.card,
                              isLocked
                                ? "opacity-50 cursor-not-allowed"
                                : cn(colors.cardHover, "hover:shadow-md cursor-pointer"),
                              status === 'completed' && "border-emerald-500/30 bg-emerald-500/5"
                            )}
                          >
                            <Icon className={cn(
                              "w-4 h-4 flex-shrink-0",
                              status === 'completed' ? 'text-emerald-400' :
                              isLocked ? 'text-muted-foreground/40' :
                              colors.text
                            )} />
                            <span className={cn(
                              "text-xs font-medium flex-1 truncate",
                              isLocked ? "text-muted-foreground/50" : "text-foreground"
                            )}>
                              {card.label}
                            </span>
                            <span className={cn("flex-shrink-0", config.class)}>
                              {config.icon}
                            </span>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs">
                          {isLocked
                            ? `Prérequis : ${card.requiredSteps?.join(', ')}`
                            : config.label
                          }
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onSwitchToClassic}
            className="rounded-xl border-border"
          >
            <LayoutList className="w-4 h-4 mr-2" />
            Tous les outils (127)
          </Button>
          <Button
            variant="outline"
            onClick={onSwitchToClassic}
            className="rounded-xl border-border"
          >
            <Search className="w-4 h-4 mr-2" />
            Vue classique
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default TrelloBoardView;
