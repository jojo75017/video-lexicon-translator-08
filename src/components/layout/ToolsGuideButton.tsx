import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Map } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ToolsGuideButtonProps {
  isCollapsed: boolean;
}

export const ToolsGuideButton: React.FC<ToolsGuideButtonProps> = ({ isCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === '/guide-outils';

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => navigate('/guide-outils')}
            className={cn(
              'w-full flex items-center justify-center p-2.5 rounded-xl transition-all',
              isActive
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-primary/10 text-primary hover:bg-primary/20'
            )}
            aria-label="Guide des outils"
          >
            <Map className="w-4 h-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" className="font-medium">
          🗺️ Guide des outils
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <button
      onClick={() => navigate('/guide-outils')}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all border',
        isActive
          ? 'bg-primary text-primary-foreground border-primary shadow-md'
          : 'bg-primary/5 border-primary/20 text-foreground hover:bg-primary/10 hover:border-primary/40'
      )}
    >
      <div
        className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
          isActive ? 'bg-primary-foreground/20' : 'bg-primary/15'
        )}
      >
        <Map className={cn('w-4 h-4', isActive ? 'text-primary-foreground' : 'text-primary')} />
      </div>
      <div className="flex-1 text-left min-w-0">
        <p className={cn('text-sm font-semibold', isActive ? 'text-primary-foreground' : 'text-foreground')}>
          🗺️ Guide des outils
        </p>
        <p className={cn('text-[10px]', isActive ? 'text-primary-foreground/80' : 'text-muted-foreground')}>
          Première visite ? Commence ici
        </p>
      </div>
    </button>
  );
};

export default ToolsGuideButton;
