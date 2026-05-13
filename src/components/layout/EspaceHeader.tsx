import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, LogOut, BookOpen } from 'lucide-react';

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
      className="sticky top-0 z-40 w-full border-b backdrop-blur"
      style={{ backgroundColor: 'rgba(250,250,250,0.92)', borderColor: '#E5E7EB' }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-2 sm:px-6">
        <div className="flex min-w-0 items-center gap-2 text-sm">
          <Link
            to="/espace"
            className="flex items-center gap-1.5 font-semibold transition-colors hover:opacity-80"
            style={{ color: '#008296' }}
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Mon espace</span>
          </Link>
          {projectTitle && (
            <>
              <span className="text-muted-foreground">›</span>
              <span className="flex min-w-0 items-center gap-1 truncate" style={{ color: '#232F3E' }}>
                <BookOpen className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate font-medium">{projectTitle}</span>
              </span>
            </>
          )}
          {currentStepLabel && (
            <>
              <span className="hidden text-muted-foreground sm:inline">›</span>
              <span className="hidden truncate text-muted-foreground sm:inline">{currentStepLabel}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/espace')}
            className="hidden sm:inline-flex"
          >
            Mon espace
          </Button>
          {onLogout && (
            <Button variant="outline" size="sm" onClick={onLogout} className="gap-1.5">
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Déconnexion</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default EspaceHeader;
