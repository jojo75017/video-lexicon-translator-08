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
    <div className="px-3 pt-2 pb-3 space-y-2 border-b border-border">
      {/* Project selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              'w-full flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card/50 hover:bg-card transition-all text-left'
            )}
          >
            <FolderOpen className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground leading-tight">
                Projet actif
              </p>
              <p className="text-xs font-semibold text-foreground truncate">
                {currentProjectTitle || 'Aucun projet'}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
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

      {/* New project CTA */}
      <Button
        size="sm"
        onClick={onNewProject}
        className="w-full h-9 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm"
      >
        <Plus className="w-4 h-4 mr-1.5" />
        Nouveau projet
      </Button>
    </div>
  );
};
