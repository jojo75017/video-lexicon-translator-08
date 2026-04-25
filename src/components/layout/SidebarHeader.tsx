import React from 'react';
import { Plus, FolderOpen, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export interface RecentProject {
  id: string;
  title: string;
}

interface SidebarHeaderProps {
  recentProjects: RecentProject[];
  currentProjectTitle?: string | null;
  onSelectProject: (projectId: string) => void;
  onNewProject: () => void;
  onOpenAllProjects: () => void;
  isCollapsed: boolean;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  recentProjects,
  currentProjectTitle,
  onSelectProject,
  onNewProject,
  onOpenAllProjects,
  isCollapsed,
}) => {
  if (isCollapsed) {
    return (
      <div className="px-2 pt-2 pb-1 space-y-1">
        <Button
          size="sm"
          onClick={onNewProject}
          className="w-full h-10 p-0 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
          aria-label="Nouveau projet"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="px-3 pt-2 pb-2 border-b border-border">
      {/* 1 ligne compacte : sélecteur projet + bouton + */}
      <div className="flex items-center gap-1.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                'flex-1 flex items-center gap-2 px-2.5 py-2 rounded-lg border border-border bg-card/50 hover:bg-card transition-all text-left min-w-0'
              )}
            >
              <FolderOpen className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
              <span className="text-[13px] font-semibold text-foreground truncate flex-1">
                {currentProjectTitle || 'Aucun projet'}
              </span>
              <ChevronDown className="w-3 h-3 text-muted-foreground flex-shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 z-50 bg-popover" align="start">
            <DropdownMenuLabel className="text-xs">Projets récents</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {recentProjects.length === 0 ? (
              <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                Aucun projet récent
              </DropdownMenuItem>
            ) : (
              recentProjects.slice(0, 3).map(project => (
                <DropdownMenuItem
                  key={project.id}
                  onClick={() => onSelectProject(project.id)}
                  className="text-sm cursor-pointer"
                >
                  <FolderOpen className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
                  <span className="truncate">{project.title}</span>
                </DropdownMenuItem>
              ))
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onOpenAllProjects}
              className="text-xs text-muted-foreground cursor-pointer"
            >
              Voir tous les projets…
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              onClick={onNewProject}
              className="h-9 w-9 p-0 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm flex-shrink-0"
              aria-label="Nouveau projet"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Nouveau projet</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};
