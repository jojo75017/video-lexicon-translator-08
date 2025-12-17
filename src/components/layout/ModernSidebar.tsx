import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Wand2, 
  Settings, 
  Image, 
  Users, 
  Download, 
  TrendingUp,
  LayoutDashboard,
  Palette,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Sparkles,
  PenTool,
  FolderOpen,
  MessageSquare,
  DollarSign,
  ImagePlus,
  Bot,
  BookCopy,
  CreditCard,
  Play,
  LayoutTemplate,
  FileEdit,
  Handshake,
  BarChart3,
  Volume2,
  Shield,
  Headphones,
  FileText,
  GraduationCap,
  LucideIcon
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

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  activeGradient: string;
  isLink?: boolean;
  href?: string;
}

interface Category {
  id: string;
  label: string;
  icon: string;
  color: string;
  items: MenuItem[];
}

const categories: Category[] = [
  {
    id: 'gestion',
    label: 'Gestion & Projet',
    icon: '📁',
    color: 'from-violet-500 to-purple-500',
    items: [
      { id: 'projects', label: 'Mes Projets', icon: FolderOpen, color: 'text-violet-500', bgColor: 'bg-violet-500/10', activeGradient: 'from-violet-500 to-purple-500' },
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-cyan-500', bgColor: 'bg-cyan-500/10', activeGradient: 'from-cyan-500 to-blue-500' },
      { id: 'analytics', label: 'Analytics Pro', icon: BarChart3, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10', activeGradient: 'from-emerald-500 to-teal-500' },
      { id: 'settings', label: 'Paramètres', icon: Settings, color: 'text-slate-500', bgColor: 'bg-slate-500/10', activeGradient: 'from-slate-500 to-gray-500' },
    ]
  },
  {
    id: 'creation',
    label: 'Création & Rédaction',
    icon: '✍️',
    color: 'from-fuchsia-500 to-pink-500',
    items: [
      { id: 'planner', label: 'Planificateur', icon: BookOpen, color: 'text-fuchsia-500', bgColor: 'bg-fuchsia-500/10', activeGradient: 'from-fuchsia-500 to-pink-500' },
      { id: 'templates', label: 'Templates', icon: LayoutTemplate, color: 'text-cyan-500', bgColor: 'bg-cyan-500/10', activeGradient: 'from-cyan-500 to-teal-500' },
      { id: 'writing', label: 'Rédaction', icon: PenTool, color: 'text-blue-500', bgColor: 'bg-blue-500/10', activeGradient: 'from-blue-500 to-cyan-500' },
      { id: 'assistant', label: 'Assistant IA', icon: FileEdit, color: 'text-purple-500', bgColor: 'bg-purple-500/10', activeGradient: 'from-purple-500 to-violet-500' },
      { id: 'aichat', label: 'Chat IA', icon: Bot, color: 'text-orange-500', bgColor: 'bg-orange-500/10', activeGradient: 'from-orange-500 to-amber-500' },
      { id: 'characters', label: 'Personnages', icon: Users, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10', activeGradient: 'from-emerald-500 to-teal-500' },
      { id: 'series', label: 'Série / Saga', icon: BookCopy, color: 'text-indigo-500', bgColor: 'bg-indigo-500/10', activeGradient: 'from-indigo-500 to-purple-500' },
      { id: 'voice', label: 'Dictée Vocale', icon: Volume2, color: 'text-rose-500', bgColor: 'bg-rose-500/10', activeGradient: 'from-rose-500 to-pink-500' },
    ]
  },
  {
    id: 'visuels',
    label: 'Visuels & Design',
    icon: '🎨',
    color: 'from-rose-500 to-red-500',
    items: [
      { id: 'cover', label: 'Couverture', icon: Palette, color: 'text-rose-500', bgColor: 'bg-rose-500/10', activeGradient: 'from-rose-500 to-red-500' },
      { id: 'backcover', label: '4e Couverture', icon: BookCopy, color: 'text-red-500', bgColor: 'bg-red-500/10', activeGradient: 'from-red-500 to-rose-500' },
      { id: 'images', label: 'Images IA', icon: Image, color: 'text-amber-500', bgColor: 'bg-amber-500/10', activeGradient: 'from-amber-500 to-orange-500' },
      { id: 'imagebank', label: 'Banque Images', icon: ImagePlus, color: 'text-lime-500', bgColor: 'bg-lime-500/10', activeGradient: 'from-lime-500 to-green-500' },
      { id: 'library', label: 'Bibliothèque', icon: FolderOpen, color: 'text-teal-500', bgColor: 'bg-teal-500/10', activeGradient: 'from-teal-500 to-cyan-500' },
    ]
  },
  {
    id: 'publication',
    label: 'Publication & Export',
    icon: '📤',
    color: 'from-teal-500 to-cyan-500',
    items: [
      { id: 'export', label: 'Exporter', icon: Download, color: 'text-teal-500', bgColor: 'bg-teal-500/10', activeGradient: 'from-teal-500 to-cyan-500' },
      { id: 'kdp', label: 'Amazon KDP', icon: TrendingUp, color: 'text-sky-500', bgColor: 'bg-sky-500/10', activeGradient: 'from-sky-500 to-blue-500' },
      { id: 'kdp-analytics', label: 'KDP Analytics', icon: TrendingUp, color: 'text-cyan-500', bgColor: 'bg-cyan-500/10', activeGradient: 'from-cyan-500 to-blue-500' },
      { id: 'market', label: 'Analyse Marché', icon: BarChart3, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10', activeGradient: 'from-emerald-500 to-green-500' },
      { id: 'statistics', label: 'Stats & Outils', icon: BarChart3, color: 'text-slate-500', bgColor: 'bg-slate-500/10', activeGradient: 'from-slate-500 to-gray-500' },
    ]
  },
  {
    id: 'marketing',
    label: 'Marketing & Monétisation',
    icon: '💰',
    color: 'from-green-500 to-emerald-500',
    items: [
      { id: 'marketing', label: 'Marketing', icon: MessageSquare, color: 'text-pink-500', bgColor: 'bg-pink-500/10', activeGradient: 'from-pink-500 to-rose-500' },
      { id: 'monetization', label: 'Monétisation', icon: DollarSign, color: 'text-green-500', bgColor: 'bg-green-500/10', activeGradient: 'from-green-500 to-emerald-500' },
      { id: 'price-estimator', label: 'Estimations Prix', icon: DollarSign, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10', activeGradient: 'from-yellow-500 to-amber-500' },
      { id: 'affiliation', label: 'Affiliation', icon: Handshake, color: 'text-amber-500', bgColor: 'bg-amber-500/10', activeGradient: 'from-amber-500 to-yellow-500' },
    ]
  },
  {
    id: 'audio',
    label: 'Audio & Formation',
    icon: '🎧',
    color: 'from-purple-500 to-violet-500',
    items: [
      { id: 'audiobook', label: 'Livre Audio', icon: Headphones, color: 'text-purple-500', bgColor: 'bg-purple-500/10', activeGradient: 'from-purple-500 to-violet-500' },
      { id: 'formation-complete', label: 'Formation Complète', icon: GraduationCap, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10', activeGradient: 'from-emerald-500 to-teal-500', isLink: true, href: '/formation' },
      { id: 'formation-pdf', label: 'Formation PDF', icon: FileText, color: 'text-orange-500', bgColor: 'bg-orange-500/10', activeGradient: 'from-orange-500 to-red-500' },
      { id: 'formation-audio', label: 'Formation Audio', icon: Headphones, color: 'text-purple-500', bgColor: 'bg-purple-500/10', activeGradient: 'from-purple-500 to-violet-500', isLink: true, href: '/formation-audio' },
    ]
  },
  {
    id: 'outils',
    label: 'Outils & Compte',
    icon: '🔧',
    color: 'from-indigo-500 to-violet-500',
    items: [
      { id: 'tools', label: 'Outils IA', icon: Wand2, color: 'text-indigo-500', bgColor: 'bg-indigo-500/10', activeGradient: 'from-indigo-500 to-violet-500' },
      { id: 'subscription', label: 'Mon Abonnement', icon: CreditCard, color: 'text-purple-500', bgColor: 'bg-purple-500/10', activeGradient: 'from-purple-500 to-pink-500', isLink: true, href: '/subscription' },
      { id: 'demo', label: 'Essai Gratuit', icon: Play, color: 'text-green-500', bgColor: 'bg-green-500/10', activeGradient: 'from-green-500 to-emerald-500', isLink: true, href: '/demo' },
      { id: 'offres', label: 'Voir les Offres', icon: Sparkles, color: 'text-amber-500', bgColor: 'bg-amber-500/10', activeGradient: 'from-yellow-500 to-orange-500', isLink: true, href: '/offres' },
      { id: 'admin', label: 'Admin / Abonnés', icon: Shield, color: 'text-red-500', bgColor: 'bg-red-500/10', activeGradient: 'from-red-500 to-orange-500' },
    ]
  },
];

export const ModernSidebar: React.FC<ModernSidebarProps> = ({
  activeTab,
  onTabChange,
  isCollapsed,
  onToggleCollapse
}) => {
  const navigate = useNavigate();
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    categories.map(c => c.id) // All expanded by default
  );

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.isLink && item.href) {
      navigate(item.href);
    } else {
      onTabChange(item.id);
    }
  };

  // Find which category contains the active tab
  const activeCategoryId = categories.find(cat => 
    cat.items.some(item => item.id === activeTab)
  )?.id;

  return (
    <TooltipProvider delayDuration={0}>
      <aside 
        className={cn(
          "relative flex flex-col h-screen bg-card border-r border-border/50 transition-all duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-60"
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

        {/* Navigation with Categories */}
        <nav className="flex-1 py-2 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          {categories.map((category) => {
            const isExpanded = expandedCategories.includes(category.id);
            const hasActiveItem = category.items.some(item => item.id === activeTab);
            
            return (
              <div key={category.id} className="mb-1">
                {/* Category Header */}
                {!isCollapsed ? (
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 text-xs font-semibold transition-all duration-200",
                      hasActiveItem 
                        ? "text-foreground" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{category.icon}</span>
                      <span>{category.label}</span>
                      {hasActiveItem && (
                        <span className={cn(
                          "w-1.5 h-1.5 rounded-full bg-gradient-to-r",
                          category.color
                        )} />
                      )}
                    </div>
                    <ChevronDown 
                      className={cn(
                        "w-3 h-3 transition-transform duration-200",
                        isExpanded ? "rotate-0" : "-rotate-90"
                      )} 
                    />
                  </button>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className={cn(
                        "flex justify-center py-2 mb-1",
                        hasActiveItem && "border-l-2 border-primary"
                      )}>
                        <span className="text-sm">{category.icon}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="font-medium text-xs">
                      {category.label}
                    </TooltipContent>
                  </Tooltip>
                )}

                {/* Category Items */}
                <div className={cn(
                  "overflow-hidden transition-all duration-200",
                  !isCollapsed && !isExpanded && "max-h-0",
                  !isCollapsed && isExpanded && "max-h-[500px]",
                  !isCollapsed && "px-2"
                )}>
                  <div className={cn(
                    "space-y-0.5",
                    !isCollapsed && isExpanded && "pb-2 max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-border/50 scrollbar-track-transparent pr-1"
                  )}>
                    {category.items.map((item) => {
                      const isActive = activeTab === item.id;
                      const Icon = item.icon;
                      
                      const button = (
                        <button
                          onClick={() => handleItemClick(item)}
                          className={cn(
                            "group relative w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all duration-200",
                            isActive 
                              ? `bg-gradient-to-r ${item.activeGradient} text-white shadow-md` 
                              : `hover:${item.bgColor} ${item.color}`,
                            isCollapsed && "justify-center px-2"
                          )}
                        >
                          <div className={cn(
                            "flex items-center justify-center w-6 h-6 rounded-md transition-all",
                            isActive ? "bg-white/20" : item.bgColor
                          )}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          
                          {!isCollapsed && (
                            <span className={cn(
                              "text-xs font-medium truncate",
                              isActive ? "text-white" : ""
                            )}>
                              {item.label}
                              {item.isLink && <span className="ml-1 text-[10px] opacity-60">↗</span>}
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
                  </div>
                </div>
              </div>
            );
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
