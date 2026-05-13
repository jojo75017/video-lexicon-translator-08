import React from 'react';
import { Sparkles, FileText, ImageIcon, MoreHorizontal, Megaphone, Download, ListChecks, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface QuickModeBarProps {
  activeTab: string;
  onNavigate: (tabId: string) => void;
}

const MAIN_MODES = [
  {
    id: 'workflow-dashboard',
    label: 'Atelier IA',
    sub: 'P1 → P15',
    icon: Sparkles,
    matches: ['workflow-dashboard', 'editorial-director', 'market-analysis', 'content-architect', 'expert-writing', 'natural-rewrite', 'editorial-quality', 'editorial-packaging', 'final-diagnosis', 'editorial-memory', 'chapter-coherence', 'self-critique', 'iterative-loop', 'style-signature', 'ultimate-verdict', 'humanize-anti-ia', 'complete-workflow'],
    color: 'from-joy-mint to-joy-sun',
  },
  {
    id: 'writing',
    label: 'Mon manuscrit',
    sub: 'Texte & chapitres',
    icon: FileText,
    matches: ['writing', 'planner'],
    color: 'from-joy-peach to-joy-sun',
  },
  {
    id: 'images-cover',
    label: 'Images & Couverture',
    sub: 'Studio visuel',
    icon: ImageIcon,
    matches: ['images-cover', 'images-generator', 'images-library'],
    color: 'from-joy-sun to-joy-peach',
  },
];

const MORE_TOOLS = [
  { id: 'projects', label: 'Mes projets', icon: FolderOpen },
  { id: 'planner', label: 'Plan & idées', icon: ListChecks },
  { id: 'export', label: 'Export KDP', icon: Download },
  { id: 'marketing', label: 'Marketing & ventes', icon: Megaphone },
];

export const QuickModeBar: React.FC<QuickModeBarProps> = ({ activeTab, onNavigate }) => {
  return (
    <div className="sticky top-[52px] z-30 bg-joy-cream/95 backdrop-blur border-b-2 border-joy-ink/10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-stretch gap-2 overflow-x-auto">
          {MAIN_MODES.map((mode) => {
            const isActive = mode.matches.includes(activeTab);
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                onClick={() => onNavigate(mode.id)}
                className={cn(
                  'flex-1 min-w-[160px] rounded-2xl border-2 px-4 py-3 text-left transition-all hover-scale',
                  isActive
                    ? 'border-joy-ink bg-white shadow-md'
                    : 'border-joy-ink/15 bg-white/60 hover:bg-white'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn('h-10 w-10 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0', mode.color)}>
                    <Icon className="h-5 w-5 text-joy-ink" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-joy-ink leading-tight">{mode.label}</div>
                    <div className="text-xs text-joy-ink/60">{mode.sub}</div>
                  </div>
                </div>
              </button>
            );
          })}

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-auto rounded-2xl border-2 border-joy-ink/15 bg-white/60 hover:bg-white px-4 py-3 flex flex-col items-center justify-center gap-1 min-w-[80px]"
              >
                <MoreHorizontal className="h-5 w-5 text-joy-ink" />
                <span className="text-xs font-bold text-joy-ink">Plus</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-64 p-2 rounded-2xl border-2 border-joy-ink/15">
              <div className="text-xs font-bold text-joy-ink/60 px-2 py-1.5 uppercase tracking-wide">
                Outils complémentaires
              </div>
              <div className="grid gap-1">
                {MORE_TOOLS.map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => onNavigate(t.id)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-joy-cream text-left transition-colors"
                    >
                      <Icon className="h-4 w-4 text-joy-ink/70" />
                      <span className="text-sm font-medium text-joy-ink">{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default QuickModeBar;
