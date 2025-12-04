import React from 'react';
import { 
  BookOpen, 
  Wand2, 
  Settings, 
  FileText, 
  Image, 
  Users, 
  Download, 
  TrendingUp,
  Palette,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BookMarked,
  PenTool,
  FolderOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ModernSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const menuItems = [
  { 
    id: 'projects', 
    label: 'Mes Projets', 
    icon: FolderOpen,
    color: 'from-violet-500 to-fuchsia-500'
  },
  { 
    id: 'planner', 
    label: 'Planificateur', 
    icon: BookOpen,
    color: 'from-fuchsia-500 to-pink-500'
  },
  { 
    id: 'writing', 
    label: 'Rédaction', 
    icon: PenTool,
    color: 'from-cyan-500 to-blue-500'
  },
  { 
    id: 'characters', 
    label: 'Personnages', 
    icon: Users,
    color: 'from-emerald-500 to-teal-500'
  },
  { 
    id: 'images', 
    label: 'Images IA', 
    icon: Image,
    color: 'from-amber-500 to-orange-500'
  },
  { 
    id: 'cover', 
    label: 'Couverture', 
    icon: Palette,
    color: 'from-rose-500 to-red-500'
  },
  { 
    id: 'tools', 
    label: 'Outils IA', 
    icon: Wand2,
    color: 'from-indigo-500 to-violet-500'
  },
  { 
    id: 'kdp', 
    label: 'Amazon KDP', 
    icon: TrendingUp,
    color: 'from-sky-500 to-cyan-500'
  },
  { 
    id: 'export', 
    label: 'Exporter', 
    icon: Download,
    color: 'from-green-500 to-emerald-500'
  },
  { 
    id: 'settings', 
    label: 'Paramètres', 
    icon: Settings,
    color: 'from-gray-500 to-slate-500'
  },
];

export const ModernSidebar: React.FC<ModernSidebarProps> = ({
  activeTab,
  onTabChange,
  isCollapsed,
  onToggleCollapse
}) => {
  return (
    <TooltipProvider delayDuration={0}>
      <aside 
        className={cn(
          "relative flex flex-col h-screen bg-card/80 backdrop-blur-xl border-r border-border/50 transition-all duration-300 ease-in-out",
          isCollapsed ? "w-20" : "w-72"
        )}
      >
        {/* Header */}
        <div className={cn(
          "flex items-center gap-3 px-4 py-6 border-b border-border/50",
          isCollapsed && "justify-center"
        )}>
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-card flex items-center justify-center">
              <span className="text-[8px] text-white font-bold">AI</span>
            </div>
          </div>
          {!isCollapsed && (
            <div className="animate-fade-in">
              <h1 className="font-bold text-lg text-foreground">Ebook Studio</h1>
              <p className="text-xs text-muted-foreground">Créateur IA</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-thin">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            
            const button = (
              <button
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "group relative w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200",
                  isActive 
                    ? "bg-gradient-to-r " + item.color + " text-white shadow-lg" 
                    : "hover:bg-muted/80 text-muted-foreground hover:text-foreground",
                  isCollapsed && "justify-center px-3"
                )}
              >
                {/* Glow effect for active item */}
                {isActive && (
                  <div className={cn(
                    "absolute inset-0 rounded-xl bg-gradient-to-r opacity-50 blur-lg -z-10",
                    item.color
                  )} />
                )}
                
                <Icon className={cn(
                  "w-5 h-5 shrink-0 transition-transform duration-200",
                  !isActive && "group-hover:scale-110"
                )} />
                
                {!isCollapsed && (
                  <span className={cn(
                    "font-medium text-sm truncate animate-fade-in",
                    isActive ? "text-white" : ""
                  )}>
                    {item.label}
                  </span>
                )}
                
                {/* Active indicator */}
                {isActive && !isCollapsed && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-white/80 animate-pulse" />
                )}
              </button>
            );

            if (isCollapsed) {
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    {button}
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return <div key={item.id}>{button}</div>;
          })}
        </nav>

        {/* Collapse Toggle */}
        <div className="p-4 border-t border-border/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className={cn(
              "w-full flex items-center gap-2 text-muted-foreground hover:text-foreground",
              isCollapsed && "justify-center"
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm">Réduire</span>
              </>
            )}
          </Button>
        </div>

        {/* Decorative gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-violet-500/5 to-transparent pointer-events-none" />
      </aside>
    </TooltipProvider>
  );
};

export default ModernSidebar;
