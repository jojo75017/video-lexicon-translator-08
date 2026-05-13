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
    halo: 'bg-joy-mint/40',
    dot: 'bg-joy-mint',
  },
  {
    id: 'writing',
    label: 'Mon manuscrit',
    sub: 'Texte & chapitres',
    icon: FileText,
    matches: ['writing', 'planner'],
    halo: 'bg-joy-peach/40',
    dot: 'bg-joy-peach',
  },
  {
    id: 'images-cover',
    label: 'Images & Couverture',
    sub: 'Studio visuel',
    icon: ImageIcon,
    matches: ['images-cover', 'images-generator', 'images-library'],
    halo: 'bg-joy-sun/40',
    dot: 'bg-joy-sun',
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
    <div className="sticky top-[52px] z-30 bg-joy-cream/90 backdrop-blur-md border-b border-joy-ink/10">
      <div className="container mx-auto px-4 py-2.5">
        <div className="flex items-stretch gap-2 overflow-x-auto">
          {MAIN_MODES.map((mode) => {
            const isActive = mode.matches.includes(activeTab);
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                onClick={() => onNavigate(mode.id)}
                className={cn(
                  'group relative flex-1 min-w-[170px] rounded-xl px-3.5 py-2.5 text-left transition-all duration-200',
                  isActive
                    ? 'bg-white border border-joy-ink/80 shadow-[0_2px_8px_-2px_hsl(var(--joy-ink)/0.18)]'
                    : 'bg-white/70 border border-transparent hover:bg-white hover:ring-1 hover:ring-joy-ink/15'
                )}
              >
                {isActive && (
                  <span className={cn('absolute top-2 right-2 h-1.5 w-1.5 rounded-full', mode.dot)} />
                )}
                <div className="flex items-center gap-3">
                  <div className="relative h-9 w-9 shrink-0 flex items-center justify-center">
                    <span className={cn('absolute inset-0 rounded-full blur-md opacity-80', mode.halo)} />
                    <Icon className="relative h-[18px] w-[18px] text-joy-ink" strokeWidth={2.2} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-[13px] text-joy-ink leading-tight tracking-tight">{mode.label}</div>
                    <div className="text-[11px] text-joy-ink/55 mt-0.5">{mode.sub}</div>
                  </div>
                </div>
              </button>
            );
          })}

          <div className="flex items-stretch">
            <span className="w-px bg-joy-ink/10 mx-1.5 my-1.5" aria-hidden />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-auto rounded-full bg-white/70 hover:bg-white border border-joy-ink/15 px-4 py-2 flex items-center gap-1.5 self-center"
                >
                  <MoreHorizontal className="h-4 w-4 text-joy-ink" />
                  <span className="text-xs font-semibold text-joy-ink">Plus</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-64 p-2 rounded-2xl border border-joy-ink/10 shadow-lg">
                <div className="text-[10px] font-bold text-joy-ink/50 px-2 py-1.5 uppercase tracking-wider">
                  Outils complémentaires
                </div>
                <div className="grid gap-0.5">
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
    </div>
  );
};

export default QuickModeBar;
