import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
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
  LayoutTemplate,
  FileEdit,
  Volume2,
  BookHeart,
  Shield,
  Headphones,
  FileText,
  GraduationCap,
  Zap,
  Crown,
  BookMarked,
  Map,
  Search,
  Brain,
  GitBranch,
  Eye,
  RefreshCw,
  Fingerprint,
  Award,
  Rocket,
  Link,
  Globe,
  Target,
  Sun,
  Moon,
  X
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { useUserQuotas, getQuotaPercentage } from '@/hooks/useUserQuotas';

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
  isLink?: boolean;
  href?: string;
  isNew2026?: boolean;
  isPremium?: boolean;
}

interface Category {
  id: string;
  label: string;
  emoji: string;
  items: MenuItem[];
}

const categories: Category[] = [
  {
    id: 'generateurs',
    label: 'Générateurs',
    emoji: '🚀',
    items: [
      { id: 'complete-workflow', label: 'Livre Complet IA', icon: Rocket, color: 'text-orange-500', isPremium: true, isNew2026: true },
      { id: 'comic-book', label: 'Bande Dessinée', icon: LayoutTemplate, color: 'text-amber-500', isNew2026: true },
      { id: 'coloring-book', label: 'Livre Coloriage', icon: Palette, color: 'text-pink-500', isNew2026: true },
      { id: 'documentary', label: 'Documentaire', icon: BookMarked, color: 'text-blue-500', isNew2026: true },
      { id: 'diary-generator', label: 'Agenda / Journal', icon: BookHeart, color: 'text-rose-500', isNew2026: true },
    ]
  },
  {
    id: 'workflow',
    label: 'Workflow IA (P1-P8)',
    emoji: '⚡',
    items: [
      { id: 'editorial-director', label: 'P1 Directeur', icon: Crown, color: 'text-amber-500', isPremium: true },
      { id: 'market-analysis', label: 'P2 Marché', icon: Search, color: 'text-emerald-500', isPremium: true },
      { id: 'content-architect', label: 'P3 Architecte', icon: LayoutDashboard, color: 'text-violet-500', isPremium: true },
      { id: 'expert-writing', label: 'P4 Rédaction', icon: PenTool, color: 'text-blue-500', isPremium: true },
      { id: 'natural-rewrite', label: 'P5 Réécriture', icon: Sparkles, color: 'text-pink-500', isPremium: true },
      { id: 'editorial-quality', label: 'P6 Qualité', icon: FileEdit, color: 'text-teal-500', isPremium: true },
      { id: 'editorial-packaging', label: 'P7 Packaging', icon: FileText, color: 'text-green-500', isPremium: true },
      { id: 'final-diagnosis', label: 'P8 Diagnostic', icon: Shield, color: 'text-purple-500', isPremium: true },
    ]
  },
  {
    id: 'moteur',
    label: 'Moteur V2 (P9-P14)',
    emoji: '🧬',
    items: [
      { id: 'editorial-memory', label: 'P9 Mémoire', icon: Brain, color: 'text-purple-500', isPremium: true },
      { id: 'chapter-coherence', label: 'P10 Cohérence', icon: GitBranch, color: 'text-indigo-500', isPremium: true },
      { id: 'self-critique', label: 'P11 Critique', icon: Eye, color: 'text-rose-500', isPremium: true },
      { id: 'iterative-loop', label: 'P12 Boucle', icon: RefreshCw, color: 'text-cyan-500', isPremium: true },
      { id: 'style-signature', label: 'P13 Style', icon: Fingerprint, color: 'text-amber-500', isPremium: true },
      { id: 'ultimate-verdict', label: 'P14 Verdict', icon: Award, color: 'text-yellow-500', isPremium: true },
    ]
  },
  {
    id: 'creation',
    label: 'Création',
    emoji: '✍️',
    items: [
      { id: 'url-import', label: 'Import URL', icon: Link, color: 'text-violet-500', isNew2026: true },
      { id: 'doc-transform', label: 'Import Word', icon: FileText, color: 'text-blue-500', isNew2026: true },
      { id: 'planner', label: 'Planificateur', icon: BookOpen, color: 'text-fuchsia-500' },
      { id: 'writing', label: 'Rédaction', icon: PenTool, color: 'text-blue-500' },
      { id: 'aichat', label: 'Chat IA', icon: Bot, color: 'text-orange-500' },
      { id: 'characters', label: 'Personnages', icon: Users, color: 'text-emerald-500' },
      { id: 'encyclopedia', label: 'Encyclopédie', icon: BookMarked, color: 'text-amber-500' },
      { id: 'atlas', label: 'Atlas', icon: Map, color: 'text-emerald-500' },
      { id: 'series', label: 'Série / Saga', icon: BookCopy, color: 'text-indigo-500' },
    ]
  },
  {
    id: 'visuels',
    label: 'Visuels',
    emoji: '🎨',
    items: [
      { id: 'cover', label: 'Couverture', icon: Palette, color: 'text-rose-500' },
      { id: 'backcover', label: '4e Couverture', icon: BookCopy, color: 'text-red-500' },
      { id: 'images', label: 'Images IA', icon: Image, color: 'text-amber-500' },
      { id: 'imagebank', label: 'Banque Images', icon: ImagePlus, color: 'text-lime-500' },
    ]
  },
  {
    id: 'publication',
    label: 'Publication',
    emoji: '📤',
    items: [
      { id: 'kdp-research', label: 'Recherche KDP', icon: Search, color: 'text-amber-500', isNew2026: true },
      { id: 'amazon-simulator', label: 'Simulateur Amazon', icon: Eye, color: 'text-orange-500', isNew2026: true },
      { id: 'plagiarism-validator', label: 'Anti-Plagiat', icon: Shield, color: 'text-red-500', isNew2026: true },
      { id: 'export', label: 'Exporter', icon: Download, color: 'text-teal-500' },
      { id: 'kdp', label: 'Amazon KDP', icon: TrendingUp, color: 'text-sky-500' },
    ]
  },
  {
    id: 'marketing',
    label: 'Marketing',
    emoji: '💰',
    items: [
      { id: 'amazon-ads', label: 'Amazon Ads', icon: Target, color: 'text-orange-500', isNew2026: true },
      { id: 'launch-plan', label: 'Plan Lancement', icon: Rocket, color: 'text-violet-500', isNew2026: true },
      { id: 'seo-articles', label: 'Articles SEO', icon: Globe, color: 'text-emerald-500', isNew2026: true },
      { id: 'marketing', label: 'Social Media', icon: MessageSquare, color: 'text-pink-500' },
      { id: 'monetization', label: 'Monétisation', icon: DollarSign, color: 'text-green-500' },
    ]
  },
  {
    id: 'audio',
    label: 'Audio & Formation',
    emoji: '🎧',
    items: [
      { id: 'audiobook', label: 'Livre Audio', icon: Headphones, color: 'text-purple-500' },
      { id: 'formation-complete', label: 'Formation', icon: GraduationCap, color: 'text-emerald-500', isLink: true, href: '/formation' },
      { id: 'voice', label: 'Dictée Vocale', icon: Volume2, color: 'text-rose-500' },
    ]
  },
  {
    id: 'outils',
    label: 'Outils',
    emoji: '⚙️',
    items: [
      { id: 'projects', label: 'Mes Projets', icon: FolderOpen, color: 'text-violet-500' },
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-cyan-500' },
      { id: 'settings', label: 'Paramètres', icon: Settings, color: 'text-slate-500' },
      { id: 'subscription', label: 'Abonnement', icon: CreditCard, color: 'text-purple-500', isLink: true, href: '/subscription' },
      { id: 'offres', label: 'Offres', icon: Sparkles, color: 'text-amber-500', isLink: true, href: '/offres' },
    ]
  },
];

// Hook pour le thème
const useTheme = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  return { isDark, toggleTheme };
};

// Composant Quota compact
const QuotaDisplay: React.FC<{ isCollapsed: boolean }> = ({ isCollapsed }) => {
  const navigate = useNavigate();
  const { quotas, isLoading, hasSubscription } = useUserQuotas();

  if (isLoading || !hasSubscription || !quotas) {
    return (
      <div className={cn("border-t border-border/50 p-3", isCollapsed && "flex justify-center")}>
        <Button
          variant="default"
          size="sm"
          onClick={() => navigate('/offres')}
          className={cn(
            "bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:from-violet-600 hover:to-purple-600 shadow-md",
            isCollapsed ? "w-9 h-9 p-0" : "w-full"
          )}
        >
          {isCollapsed ? <Crown className="w-4 h-4" /> : (
            <>
              <Crown className="w-4 h-4 mr-2" />
              Débloquer PRO
            </>
          )}
        </Button>
      </div>
    );
  }

  const isUnlimited = quotas.ebook_plans.limit === -1;
  const ebookPercentage = getQuotaPercentage(quotas.ebook_plans);

  return (
    <div className={cn("border-t border-border/50 p-3", isCollapsed && "flex justify-center")}>
      {isCollapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/40 dark:to-purple-900/40 flex items-center justify-center border border-violet-200/50 dark:border-violet-700/50">
              <Zap className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p className="font-medium">{quotas.plan.toUpperCase()}</p>
            <p className="text-xs text-muted-foreground">
              {isUnlimited ? '∞ Illimité' : `${quotas.ebook_plans.remaining} restants`}
            </p>
          </TooltipContent>
        </Tooltip>
      ) : (
        <div className="space-y-2 p-2 rounded-xl bg-gradient-to-br from-violet-50/80 to-purple-50/80 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-100 dark:border-violet-800/30">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">Plan actif</span>
            <span className={cn(
              "text-[10px] font-bold px-2 py-0.5 rounded-full",
              quotas.plan === 'lifetime' ? 'bg-violet-200/80 text-violet-700 dark:bg-violet-800/60 dark:text-violet-200' :
              quotas.plan === 'pro' ? 'bg-amber-200/80 text-amber-700 dark:bg-amber-800/60 dark:text-amber-200' :
              'bg-emerald-200/80 text-emerald-700 dark:bg-emerald-800/60 dark:text-emerald-200'
            )}>
              {quotas.plan.toUpperCase()}
            </span>
          </div>
          {isUnlimited ? (
            <div className="text-center py-1.5">
              <span className="text-xs font-semibold text-violet-600 dark:text-violet-300">∞ Accès illimité</span>
            </div>
          ) : (
            <>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Ebooks</span>
                <span className="font-medium text-foreground">{quotas.ebook_plans.remaining}/{quotas.ebook_plans.limit}</span>
              </div>
              <Progress value={ebookPercentage} className="h-1.5" />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export const ModernSidebar: React.FC<ModernSidebarProps> = ({
  activeTab,
  onTabChange,
  isCollapsed,
  onToggleCollapse
}) => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['generateurs']);

  // Filtrer les items par recherche
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    
    const query = searchQuery.toLowerCase();
    return categories.map(cat => ({
      ...cat,
      items: cat.items.filter(item => 
        item.label.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query)
      )
    })).filter(cat => cat.items.length > 0);
  }, [searchQuery]);

  const activeCategoryId = categories.find(cat => 
    cat.items.some(item => item.id === activeTab)
  )?.id;

  React.useEffect(() => {
    if (activeCategoryId && !expandedCategories.includes(activeCategoryId)) {
      setExpandedCategories(prev => [...prev, activeCategoryId]);
    }
  }, [activeCategoryId]);

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

  return (
    <TooltipProvider delayDuration={0}>
      <aside 
        className={cn(
          "relative flex flex-col h-screen transition-all duration-300 ease-out",
          "bg-gradient-to-b from-violet-50/70 via-purple-50/50 to-fuchsia-50/40 dark:from-[#1a1525] dark:via-[#151220] dark:to-[#12101a] border-r border-violet-100/60 dark:border-violet-900/50",
          isCollapsed ? "w-[72px]" : "w-64"
        )}
      >
        {/* Header avec Logo et Theme Toggle */}
        <div className={cn(
          "flex items-center gap-3 p-4 border-b border-border/50",
          isCollapsed && "justify-center p-3"
        )}>
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-400/30 dark:shadow-violet-600/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>
          {!isCollapsed && (
            <>
              <div className="min-w-0 flex-1">
                <h1 className="font-bold text-foreground text-sm">EbookStudio</h1>
                <p className="text-[11px] text-muted-foreground">Pro 2026</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="h-8 w-8 rounded-lg hover:bg-muted/80"
              >
                {isDark ? (
                  <Sun className="w-4 h-4 text-amber-500" />
                ) : (
                  <Moon className="w-4 h-4 text-violet-500" />
                )}
              </Button>
            </>
          )}
        </div>

        {/* Barre de recherche */}
        {!isCollapsed && (
          <div className="px-3 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
              <Input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 h-9 text-sm bg-muted/50 border-border/50 text-foreground placeholder:text-muted-foreground/60 rounded-xl focus:bg-muted/80 focus:border-violet-400/50 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-muted"
                >
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2 px-2">
          {filteredCategories.map((category) => {
            const isExpanded = expandedCategories.includes(category.id);
            const hasActiveItem = category.items.some(item => item.id === activeTab);

            return (
              <div key={category.id} className="mb-1">
                {/* Header catégorie */}
                {!isCollapsed ? (
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all",
                      "hover:bg-muted/60",
                      hasActiveItem ? "bg-violet-50/80 dark:bg-violet-900/20" : ""
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{category.emoji}</span>
                      <span className="text-sm font-semibold text-foreground">{category.label}</span>
                    </div>
                    <ChevronDown className={cn(
                      "w-4 h-4 text-muted-foreground transition-transform",
                      isExpanded ? "rotate-0" : "-rotate-90"
                    )} />
                  </button>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className={cn(
                        "flex justify-center py-2 mb-1 rounded-xl cursor-pointer hover:bg-muted/60",
                        hasActiveItem && "bg-violet-50/80 dark:bg-violet-900/20"
                      )}>
                        <span className="text-lg">{category.emoji}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="font-medium">
                      {category.label}
                    </TooltipContent>
                  </Tooltip>
                )}

                {/* Items */}
                {!isCollapsed && (
                  <div className={cn(
                    "overflow-hidden transition-all duration-200",
                    isExpanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                  )}>
                    <div className="space-y-0.5 py-1 pl-2">
                      {category.items.map(item => {
                        const isActive = activeTab === item.id;
                        const Icon = item.icon;
                        
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleItemClick(item)}
                            className={cn(
                              "w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all text-left",
                              isActive 
                                ? "bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/50 dark:to-purple-900/50 text-violet-700 dark:text-violet-200 shadow-sm border border-violet-200/50 dark:border-violet-700/30" 
                                : "hover:bg-muted/50 text-foreground/80 hover:text-foreground"
                            )}
                          >
                            <Icon className={cn("w-4 h-4 flex-shrink-0", isActive ? "text-violet-500 dark:text-violet-400" : item.color)} />
                            <span className="text-sm font-medium truncate flex-1">{item.label}</span>
                            
                            {item.isNew2026 && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-sm">
                                2026
                              </span>
                            )}
                            
                            {item.isPremium && !item.isNew2026 && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-violet-100 text-violet-600 dark:bg-violet-800/50 dark:text-violet-300">
                                PRO
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Items collapsed */}
                {isCollapsed && (
                  <div className="space-y-1 px-1">
                    {category.items.map(item => {
                      const isActive = activeTab === item.id;
                      const Icon = item.icon;
                      
                      return (
                        <Tooltip key={item.id}>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => handleItemClick(item)}
                              className={cn(
                                "w-full flex items-center justify-center p-2 rounded-xl transition-all",
                                isActive 
                                  ? "bg-violet-100 dark:bg-violet-900/40 text-violet-500 dark:text-violet-400" 
                                  : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                              )}
                            >
                              <Icon className="w-4 h-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="font-medium">
                            {item.label}
                            {item.isNew2026 && <span className="ml-2 text-amber-500">2026</span>}
                            {item.isPremium && !item.isNew2026 && <span className="ml-2 text-violet-500">PRO</span>}
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Quota */}
        <QuotaDisplay isCollapsed={isCollapsed} />

        {/* Toggle + Theme (collapsed) */}
        <div className="p-2 border-t border-border/50 flex gap-1">
          {isCollapsed && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="flex-1 h-9 rounded-xl hover:bg-muted/60"
                >
                  {isDark ? (
                    <Sun className="w-4 h-4 text-amber-500" />
                  ) : (
                    <Moon className="w-4 h-4 text-violet-500" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                {isDark ? 'Mode clair' : 'Mode sombre'}
              </TooltipContent>
            </Tooltip>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className={cn(
              "h-9 flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-xl",
              isCollapsed ? "flex-1 justify-center" : "w-full"
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span className="text-xs">Réduire</span>
              </>
            )}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  );
};

export default ModernSidebar;
