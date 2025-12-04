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
  ChevronLeft,
  ChevronRight,
  Sparkles,
  PenTool,
  FolderOpen,
  MessageSquare,
  DollarSign,
  ImagePlus
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
    color: 'text-violet-500',
    bgColor: 'bg-violet-500/10',
    activeGradient: 'from-violet-500 to-purple-500'
  },
  { 
    id: 'planner', 
    label: 'Planificateur', 
    icon: BookOpen,
    color: 'text-fuchsia-500',
    bgColor: 'bg-fuchsia-500/10',
    activeGradient: 'from-fuchsia-500 to-pink-500'
  },
  { 
    id: 'writing', 
    label: 'Rédaction', 
    icon: PenTool,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    activeGradient: 'from-blue-500 to-cyan-500'
  },
  { 
    id: 'characters', 
    label: 'Personnages', 
    icon: Users,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    activeGradient: 'from-emerald-500 to-teal-500'
  },
  { 
    id: 'images', 
    label: 'Images IA', 
    icon: Image,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    activeGradient: 'from-amber-500 to-orange-500'
  },
  { 
    id: 'imagebank', 
    label: 'Banque Images', 
    icon: ImagePlus,
    color: 'text-lime-500',
    bgColor: 'bg-lime-500/10',
    activeGradient: 'from-lime-500 to-green-500'
  },
  { 
    id: 'cover', 
    label: 'Couverture', 
    icon: Palette,
    color: 'text-rose-500',
    bgColor: 'bg-rose-500/10',
    activeGradient: 'from-rose-500 to-red-500'
  },
  { 
    id: 'tools', 
    label: 'Outils IA', 
    icon: Wand2,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10',
    activeGradient: 'from-indigo-500 to-violet-500'
  },
  { 
    id: 'marketing', 
    label: 'Marketing', 
    icon: MessageSquare,
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
    activeGradient: 'from-pink-500 to-rose-500'
  },
  { 
    id: 'monetization', 
    label: 'Monétisation', 
    icon: DollarSign,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    activeGradient: 'from-green-500 to-emerald-500'
  },
  { 
    id: 'kdp', 
    label: 'Amazon KDP', 
    icon: TrendingUp,
    color: 'text-sky-500',
    bgColor: 'bg-sky-500/10',
    activeGradient: 'from-sky-500 to-blue-500'
  },
  { 
    id: 'export', 
    label: 'Exporter', 
    icon: Download,
    color: 'text-teal-500',
    bgColor: 'bg-teal-500/10',
    activeGradient: 'from-teal-500 to-cyan-500'
  },
  { 
    id: 'settings', 
    label: 'Paramètres', 
    icon: Settings,
    color: 'text-slate-500',
    bgColor: 'bg-slate-500/10',
    activeGradient: 'from-slate-500 to-gray-500'
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
          "relative flex flex-col h-screen bg-card border-r border-border/50 transition-all duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-56"
        )}
      >
        {/* Header */}
        <div className={cn(
          "flex items-center gap-2 px-3 py-4 border-b border-border/50",
          isCollapsed && "justify-center"
        )}>
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>
          {!isCollapsed && (
            <div className="animate-fade-in min-w-0">
              <h1 className="font-bold text-sm text-foreground truncate">Ebook Studio</h1>
              <p className="text-[10px] text-muted-foreground">Créateur IA</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-2 px-2 space-y-0.5 overflow-y-auto scrollbar-thin">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            
            const button = (
              <button
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "group relative w-full flex items-center gap-2 px-2 py-2 rounded-lg transition-all duration-200",
                  isActive 
                    ? `bg-gradient-to-r ${item.activeGradient} text-white shadow-md` 
                    : `hover:${item.bgColor} ${item.color}`,
                  isCollapsed && "justify-center px-2"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center w-7 h-7 rounded-lg transition-all",
                  isActive ? "bg-white/20" : item.bgColor
                )}>
                  <Icon className="w-4 h-4" />
                </div>
                
                {!isCollapsed && (
                  <span className={cn(
                    "text-xs font-medium truncate",
                    isActive ? "text-white" : ""
                  )}>
                    {item.label}
                  </span>
                )}
              </button>
            );

            if (isCollapsed) {
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    {button}
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-medium text-xs">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return <div key={item.id}>{button}</div>;
          })}
        </nav>

        {/* Collapse Toggle */}
        <div className="p-2 border-t border-border/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className={cn(
              "w-full h-8 flex items-center gap-2 text-muted-foreground hover:text-foreground text-xs",
              isCollapsed && "justify-center"
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Réduire</span>
              </>
            )}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  );
};

export default ModernSidebar;