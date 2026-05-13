import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Home, LogOut, Sparkles } from 'lucide-react';

interface EspaceHeaderProps {
  projectTitle?: string | null;
  currentStepLabel?: string | null;
  onLogout?: () => void;
}

/**
 * Header commun à toutes les pages abonnées.
 * Donne un repère visuel constant : retour à "Mon espace", projet en cours, déconnexion.
 */
export const EspaceHeader: React.FC<EspaceHeaderProps> = ({
  projectTitle,
  currentStepLabel,
  onLogout,
}) => {
  const navigate = useNavigate();

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
            className="flex items-center gap-1.5 font-semibold text-joy-ink transition-opacity hover:opacity-70"
          >
            <Sparkles className="h-4 w-4" style={{ color: '#008296' }} />
            <span className="hidden sm:inline tracking-tight">Mon espace</span>
            <Home className="h-4 w-4 sm:hidden" />
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
    </header>
  );
};

export default EspaceHeader;
