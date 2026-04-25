import React, { useEffect, useState } from 'react';
import { ListChecks, PenTool, Palette, Download, X, Sparkles, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const STORAGE_KEY = 'sidebar_onboarding_dismissed_v1';

interface OnboardingStep {
  id: string;
  num: number;
  label: string;
  hint: string;
  tabId: string;
  icon: React.ElementType;
  color: string;
}

const STEPS: OnboardingStep[] = [
  { id: 'step-plan',  num: 1, label: 'Créer mon plan',     hint: 'Structure ton ebook',    tabId: 'planner',             icon: ListChecks, color: 'text-emerald-600 bg-emerald-500/10' },
  { id: 'step-write', num: 2, label: 'Écrire les chapitres', hint: 'Rédige avec l\'IA',     tabId: 'writing',             icon: PenTool,    color: 'text-violet-600 bg-violet-500/10' },
  { id: 'step-cover', num: 3, label: 'Générer la couverture', hint: 'Éditeur visuel',      tabId: 'cover-design-editor', icon: Palette,    color: 'text-blue-600 bg-blue-500/10' },
  { id: 'step-export', num: 4, label: 'Exporter pour KDP',  hint: 'PDF, Word, ePub',      tabId: 'export',              icon: Download,   color: 'text-orange-600 bg-orange-500/10' },
];

interface SidebarOnboardingProps {
  isCollapsed: boolean;
  onStepClick: (tabId: string) => void;
}

export const SidebarOnboarding: React.FC<SidebarOnboardingProps> = ({
  isCollapsed,
  onStepClick,
}) => {
  const [dismissed, setDismissed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(STORAGE_KEY) === '1';
  });
  const [open, setOpen] = useState(false);

  // Permet de réafficher le guide depuis ailleurs (paramètres) via custom event
  useEffect(() => {
    const handler = () => {
      localStorage.removeItem(STORAGE_KEY);
      setDismissed(false);
      setOpen(true);
    };
    window.addEventListener('sidebar-onboarding-show', handler);
    return () => window.removeEventListener('sidebar-onboarding-show', handler);
  }, []);

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    localStorage.setItem(STORAGE_KEY, '1');
    setDismissed(true);
    setOpen(false);
  };

  const handleStepClick = (tabId: string) => {
    onStepClick(tabId);
    setOpen(false);
  };

  if (dismissed || isCollapsed) return null;

  return (
    <div className="px-3 pt-1 pb-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            className={cn(
              'w-full flex items-center gap-2 px-3 py-2 rounded-lg',
              'border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors'
            )}
          >
            <Sparkles className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            <span className="text-[12px] font-semibold text-foreground flex-1 text-left truncate">
              Par où commencer ?
            </span>
            <ChevronDown className={cn(
              "w-3 h-3 text-muted-foreground transition-transform",
              open && "rotate-180"
            )} />
            <button
              onClick={handleDismiss}
              aria-label="Masquer le guide"
              className="p-0.5 rounded hover:bg-background/60 flex-shrink-0"
            >
              <X className="w-3 h-3 text-muted-foreground" />
            </button>
          </button>
        </PopoverTrigger>
        <PopoverContent side="right" align="start" className="w-72 p-2 bg-popover z-50">
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary px-2 pt-1 pb-2">
            🚀 Guide de démarrage
          </p>
          <div className="space-y-1">
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <button
                  key={step.id}
                  onClick={() => handleStepClick(step.tabId)}
                  className="group w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-muted transition-all text-left"
                >
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-xs',
                    step.color
                  )}>
                    {step.num}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-foreground truncate">
                      {step.label}
                    </p>
                    <p className="text-[10.5px] text-muted-foreground truncate">
                      {step.hint}
                    </p>
                  </div>
                  <Icon className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </button>
              );
            })}
          </div>
          <button
            onClick={handleDismiss}
            className="w-full text-[10.5px] text-muted-foreground hover:text-foreground py-2 mt-1 border-t border-border transition-colors"
          >
            Ne plus afficher
          </button>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SidebarOnboarding;
