import React, { useEffect, useState } from 'react';
import { ListChecks, PenTool, Palette, Download, X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  // Permet de réafficher le guide depuis ailleurs (paramètres) via custom event
  useEffect(() => {
    const handler = () => {
      localStorage.removeItem(STORAGE_KEY);
      setDismissed(false);
    };
    window.addEventListener('sidebar-onboarding-show', handler);
    return () => window.removeEventListener('sidebar-onboarding-show', handler);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setDismissed(true);
  };

  if (dismissed || isCollapsed) return null;

  return (
    <div className="mx-3 my-3 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary leading-tight">
              Démarrage
            </p>
            <h3 className="text-sm font-semibold text-foreground leading-tight">
              Par où commencer ?
            </h3>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          aria-label="Masquer le guide de démarrage"
          className="p-1 rounded-md hover:bg-muted transition-colors flex-shrink-0"
        >
          <X className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>

      <div className="px-3 pb-3 space-y-1">
        {STEPS.map((step) => {
          const Icon = step.icon;
          return (
            <button
              key={step.id}
              onClick={() => onStepClick(step.tabId)}
              className={cn(
                'group w-full flex items-center gap-3 px-2 py-2 rounded-xl',
                'hover:bg-card/80 transition-all text-left'
              )}
            >
              <div className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-xs',
                step.color
              )}>
                {step.num}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-foreground group-hover:text-primary transition-colors truncate">
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
        className="w-full text-[10.5px] text-muted-foreground hover:text-foreground py-2 border-t border-border/60 transition-colors"
      >
        Masquer ce guide
      </button>
    </div>
  );
};

export default SidebarOnboarding;
