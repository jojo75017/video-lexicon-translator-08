import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowLeft, LogOut, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EspaceHeaderProps {
  projectTitle?: string | null;
  currentStepLabel?: string | null;
  onLogout?: () => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const PLANNER_TABS: Array<{ id: string; label: string; match: string[] }> = [
  { id: 'planner', label: 'Plan', match: ['planner', 'characters', 'templates', 'workflow-dashboard'] },
  { id: 'writing', label: 'Écrire', match: ['writing', 'strict-proofread', 'toc', 'aichat'] },
  { id: 'images', label: 'Habiller', match: ['images', 'cover', 'cover-design-editor', 'back-cover', 'backcover', 'images-cover', 'images-generator', 'images-library'] },
  { id: 'export', label: 'Publier', match: ['export', 'kdp', 'kdp-prepublish-checklist', 'workflow-export', 'calibre-epub'] },
  { id: 'marketing', label: 'Vendre', match: ['marketing', 'monetization', 'advanced', 'launch-plan'] },
];

const HIDE_TABBAR_ON = new Set([
  'onboarding',
  'projects',
  'audiobook',
  'audio-express',
  'audio',
  'coloring',
  'bd-studio',
  'settings',
]);

/**
 * Header commun à toutes les pages abonnées.
 * Donne un repère visuel constant : retour à "Mon espace", projet en cours, déconnexion.
 * Quand activeTab/onTabChange sont fournis, affiche aussi une mini-barre d'onglets contextuelle.
 */
export const EspaceHeader: React.FC<EspaceHeaderProps> = ({
  projectTitle,
  currentStepLabel,
  onLogout,
  activeTab,
  onTabChange,
}) => {
  const navigate = useNavigate();

  const showTabBar =
    !!activeTab && !!onTabChange && !HIDE_TABBAR_ON.has(activeTab);

  const isTabActive = (tab: { id: string; match: string[] }) =>
    !!activeTab && (tab.id === activeTab || tab.match.includes(activeTab));

  return (
    <header
      className="sticky top-0 z-40 w-full backdrop-blur-md"
      style={{
        backgroundColor: 'rgba(250,250,250,0.85)',
        borderBottom: '1px solid hsl(var(--joy-ink) / 0.08)',
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
        <div className="flex min-w-0 items-center gap-2 text-sm">
          <Link
            to="/espace"
            className="flex items-center gap-1.5 font-semibold text-joy-ink rounded-full px-2.5 py-1 -ml-2 transition-all hover:bg-joy-ink/5"
            title="Retour à mon espace"
          >
            <ArrowLeft className="h-4 w-4" style={{ color: '#008296' }} />
            <span className="hidden sm:inline tracking-tight">Mon espace</span>
            <Sparkles className="h-3.5 w-3.5 sm:hidden" style={{ color: '#008296' }} />
          </Link>
          {projectTitle && (
            <>
              <span className="text-joy-ink/30 text-base">›</span>
              <span
                className="truncate font-serif italic text-joy-ink/90"
                title={projectTitle}
              >
                {projectTitle}
              </span>
            </>
          )}
          {currentStepLabel && (
            <>
              <span className="hidden text-joy-ink/30 sm:inline">·</span>
              <span className="hidden truncate text-xs text-joy-ink/55 sm:inline">
                {currentStepLabel}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-1">
          {onLogout && (
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onLogout}
                    aria-label="Déconnexion"
                    className="text-joy-ink/70 hover:text-joy-ink hover:bg-joy-ink/5 rounded-full h-9 w-9"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Déconnexion</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      {showTabBar && (
        <nav
          className="border-t border-joy-ink/5 bg-white/60"
          aria-label="Étapes du livre"
        >
          <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-3 py-2 sm:px-6 scrollbar-thin">
            {PLANNER_TABS.map((tab) => {
              const active = isTabActive(tab);
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange?.(tab.id)}
                  className={cn(
                    'flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-all',
                    active
                      ? 'text-white shadow-sm'
                      : 'text-joy-ink/70 hover:bg-joy-cream hover:text-joy-ink',
                  )}
                  style={
                    active
                      ? { backgroundColor: 'hsl(var(--joy-teal))' }
                      : undefined
                  }
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
};

export default EspaceHeader;
