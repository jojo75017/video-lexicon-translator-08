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
  X,
  Star
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
  isLink?: boolean;
  href?: string;
  isNew?: boolean;
  isPro?: boolean;
}

interface Category {
  id: string;
  label: string;
  emoji: string;
  color: string;
  items: MenuItem[];
}

const categories: Category[] = [
  // ========== 1. DÉMARRAGE RAPIDE ==========
  {
    id: 'start',
    label: '🚀 Démarrage Rapide',
    emoji: '🚀',
    color: 'from-violet-500 to-purple-500',
    items: [
      { id: 'complete-workflow', label: '⚡ Livre Complet (1 clic)', icon: Rocket, isPro: true },
      { id: 'planner', label: '📋 Planificateur', icon: BookOpen },
    ]
  },
  // ========== 2. RÉDACTION ==========
  {
    id: 'redaction',
    label: '✍️ Rédaction',
    emoji: '✍️',
    color: 'from-blue-500 to-indigo-500',
    items: [
      { id: 'writing', label: '✏️ Écrire les Chapitres', icon: PenTool },
      { id: 'aichat', label: '💬 Assistant IA', icon: Bot },
      { id: 'characters', label: '👥 Personnages', icon: Users },
      { id: 'series', label: '📚 Série / Saga', icon: BookCopy },
      { id: 'voice', label: '🎤 Dictée Vocale', icon: Volume2 },
    ]
  },
  // ========== 3. WORKFLOW P1-P8 ==========
  {
    id: 'workflow-p1-p8',
    label: '⚡ Workflow IA (P1-P8)',
    emoji: '⚡',
    color: 'from-amber-500 to-orange-500',
    items: [
      { id: 'editorial-director', label: 'P1 👑 Directeur', icon: Crown, isPro: true },
      { id: 'market-analysis', label: 'P2 📊 Marché', icon: Search, isPro: true },
      { id: 'content-architect', label: 'P3 🏗️ Architecte', icon: LayoutDashboard, isPro: true },
      { id: 'expert-writing', label: 'P4 ✍️ Rédaction', icon: PenTool, isPro: true },
      { id: 'natural-rewrite', label: 'P5 ✨ Réécriture', icon: Sparkles, isPro: true },
      { id: 'editorial-quality', label: 'P6 ✅ Qualité', icon: FileEdit, isPro: true },
      { id: 'editorial-packaging', label: 'P7 📦 Packaging', icon: FileText, isPro: true },
      { id: 'final-diagnosis', label: 'P8 🔍 Diagnostic', icon: Shield, isPro: true },
    ]
  },
  // ========== 4. MOTEUR IA V2 (P9-P14) ==========
  {
    id: 'workflow-p9-p14',
    label: '🧬 Moteur IA V2 (P9-P14)',
    emoji: '🧬',
    color: 'from-green-500 to-teal-500',
    items: [
      { id: 'editorial-memory', label: 'P9 🧠 Mémoire', icon: Brain, isPro: true },
      { id: 'chapter-coherence', label: 'P10 🔗 Cohérence', icon: GitBranch, isPro: true },
      { id: 'self-critique', label: 'P11 👁️ Critique', icon: Eye, isPro: true },
      { id: 'iterative-loop', label: 'P12 🔄 Boucle', icon: RefreshCw, isPro: true },
      { id: 'style-signature', label: 'P13 🎨 Style', icon: Fingerprint, isPro: true },
      { id: 'ultimate-verdict', label: 'P14 🏆 Verdict', icon: Award, isPro: true },
    ]
  },
  // ========== 4. LIVRES SPÉCIAUX ==========
  {
    id: 'special',
    label: '🎨 Livres Spéciaux',
    emoji: '🎨',
    color: 'from-pink-500 to-rose-500',
    items: [
      { id: 'coloring-book', label: '🖍️ Livre Coloriage', icon: Palette },
      { id: 'comic-book', label: '💬 Bande Dessinée', icon: LayoutTemplate },
      { id: 'diary-generator', label: '📔 Journal / Agenda', icon: BookHeart },
      { id: 'documentary', label: '🎬 Documentaire', icon: BookMarked },
      { id: 'encyclopedia', label: '📚 Encyclopédie', icon: BookMarked },
      { id: 'atlas', label: '🗺️ Atlas', icon: Map },
      { id: 'url-import', label: '🔗 Créer depuis URL', icon: Link },
      { id: 'doc-transform', label: '📄 Importer Word', icon: FileText },
    ]
  },
  // ========== 5. VISUELS ==========
  {
    id: 'visuels',
    label: '🖼️ Couvertures & Images',
    emoji: '🖼️',
    color: 'from-teal-500 to-cyan-500',
    items: [
      { id: 'cover', label: '📕 Couverture Avant', icon: Palette },
      { id: 'backcover', label: '📖 Couverture Arrière', icon: BookCopy },
      { id: 'images', label: '🎨 Images Chapitres', icon: Image },
      { id: 'imagebank', label: '🏦 Banque Images', icon: ImagePlus },
    ]
  },
  // ========== 6. AMAZON KDP ==========
  {
    id: 'amazon',
    label: '🛒 Amazon KDP',
    emoji: '🛒',
    color: 'from-orange-500 to-red-500',
    items: [
      { id: 'export', label: '💾 Exporter (PDF, Word)', icon: Download },
      { id: 'kdp', label: '📝 Description KDP', icon: TrendingUp },
      { id: 'amazon-simulator', label: '👀 Simulateur Amazon', icon: Eye },
      { id: 'kdp-research', label: '🔍 Recherche Niche', icon: Search },
      { id: 'plagiarism-validator', label: '🛡️ Anti-Plagiat', icon: Shield },
    ]
  },
  // ========== 7. MARKETING ==========
  {
    id: 'marketing-cat',
    label: '📱 Marketing',
    emoji: '📱',
    color: 'from-green-500 to-emerald-500',
    items: [
      { id: 'marketing', label: '📱 Posts Réseaux Sociaux', icon: MessageSquare },
      { id: 'seo-articles', label: '🌐 Articles SEO', icon: Globe },
      { id: 'amazon-ads', label: '🎯 Amazon Ads', icon: Target },
      { id: 'launch-plan', label: '🚀 Plan Lancement', icon: Rocket },
      { id: 'monetization', label: '💵 Monétisation', icon: DollarSign },
    ]
  },
  // ========== 8. AUDIO ==========
  {
    id: 'audio',
    label: '🎧 Audio',
    emoji: '🎧',
    color: 'from-indigo-500 to-violet-500',
    items: [
      { id: 'audiobook', label: '🎙️ Livre Audio', icon: Headphones },
    ]
  },
  // ========== 9. MON COMPTE ==========
  {
    id: 'compte',
    label: '⚙️ Mon Compte',
    emoji: '⚙️',
    color: 'from-gray-500 to-slate-500',
    items: [
      { id: 'projects', label: '📁 Mes Projets', icon: FolderOpen },
      { id: 'dashboard', label: '📊 Tableau de Bord', icon: LayoutDashboard },
      { id: 'subscription', label: '💳 Abonnement', icon: CreditCard },
      { id: 'settings', label: '⚙️ Paramètres', icon: Settings },
      { id: 'formation-complete', label: '🎓 Formation', icon: GraduationCap, isLink: true, href: '/formation' },
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
      <div className={cn("p-3", isCollapsed && "flex justify-center")}>
        <Button
          variant="default"
          size="sm"
          onClick={() => navigate('/offres')}
          className={cn(
            "bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:from-violet-600 hover:to-purple-600 shadow-lg shadow-violet-500/25",
            isCollapsed ? "w-10 h-10 p-0 rounded-xl" : "w-full rounded-xl"
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
    <div className={cn("p-3", isCollapsed && "flex justify-center")}>
      {isCollapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 dark:from-violet-500/30 dark:to-purple-500/30 flex items-center justify-center border border-violet-300/30 dark:border-violet-600/30">
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
        <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 dark:from-violet-500/20 dark:to-purple-500/20 border border-violet-200/50 dark:border-violet-700/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-violet-500" />
              <span className="text-xs font-semibold text-foreground">Mon Plan</span>
            </div>
            <span className={cn(
              "text-[10px] font-bold px-2 py-0.5 rounded-full",
              quotas.plan === 'lifetime' ? 'bg-violet-500 text-white' :
              quotas.plan === 'pro' ? 'bg-amber-500 text-white' :
              'bg-emerald-500 text-white'
            )}>
              {quotas.plan.toUpperCase()}
            </span>
          </div>
          {isUnlimited ? (
            <div className="text-center py-1">
              <span className="text-sm font-bold text-violet-600 dark:text-violet-400">∞ Accès illimité</span>
            </div>
          ) : (
            <>
              <div className="flex justify-between text-xs mb-1">
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
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    categories.map(c => c.id) // Toutes les catégories ouvertes par défaut
  );

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
          "bg-gradient-to-b from-violet-50 via-purple-50/80 to-fuchsia-50/60 border-r border-violet-200/60",
          "dark:from-[#0d0a14] dark:via-[#0a0810] dark:to-[#08060c] dark:border-violet-900/40",
          isCollapsed ? "w-[72px]" : "w-72"
        )}
      >
        {/* Header */}
        <div className={cn(
          "flex items-center gap-3 p-4 border-b border-violet-200/50 dark:border-violet-900/30",
          isCollapsed && "justify-center p-3"
        )}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <>
              <div className="min-w-0 flex-1">
                <h1 className="font-bold text-foreground">EbookStudio</h1>
                <p className="text-xs text-muted-foreground">Pro Edition 2026</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="h-9 w-9 rounded-xl hover:bg-violet-100 dark:hover:bg-violet-900/30"
              >
                {isDark ? (
                  <Sun className="w-4 h-4 text-amber-500" />
                ) : (
                  <Moon className="w-4 h-4 text-violet-600" />
                )}
              </Button>
            </>
          )}
        </div>

        {/* Recherche */}
        {!isCollapsed && (
          <div className="p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-400" />
              <Input
                type="text"
                placeholder="Rechercher un outil..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-8 h-10 text-sm bg-white/60 dark:bg-white/5 border-violet-200/60 dark:border-violet-800/40 rounded-xl focus:border-violet-400 focus:ring-violet-400/20"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-violet-100 dark:hover:bg-violet-900/30"
                >
                  <X className="w-3 h-3 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
          {filteredCategories.map((category) => {
            const isExpanded = expandedCategories.includes(category.id);
            const hasActiveItem = category.items.some(item => item.id === activeTab);

            return (
              <div 
                key={category.id} 
                className={cn(
                  "mb-3 rounded-2xl border-2 transition-all",
                  hasActiveItem 
                    ? "border-violet-400/60 dark:border-violet-500/50 bg-gradient-to-br from-violet-50/50 to-purple-50/30 dark:from-violet-950/30 dark:to-purple-950/20 shadow-lg shadow-violet-500/10" 
                    : "border-violet-200/40 dark:border-violet-800/30 bg-white/30 dark:bg-white/5 hover:border-violet-300/60 dark:hover:border-violet-700/50",
                  isCollapsed ? "p-1" : "p-2"
                )}
              >
                {/* Titre catégorie */}
                {!isCollapsed ? (
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group",
                      hasActiveItem 
                        ? `bg-gradient-to-r ${category.color} text-white shadow-md` 
                        : "hover:bg-violet-100/80 dark:hover:bg-violet-900/30"
                    )}
                  >
                    <span className={cn(
                      "text-sm font-semibold",
                      hasActiveItem ? "text-white" : "text-foreground"
                    )}>
                      {category.label}
                    </span>
                    <ChevronDown className={cn(
                      "w-4 h-4 transition-transform",
                      hasActiveItem ? "text-white/80" : "text-muted-foreground",
                      isExpanded ? "rotate-0" : "-rotate-90"
                    )} />
                  </button>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className={cn(
                        "flex justify-center py-2 mb-1 rounded-xl cursor-pointer",
                        hasActiveItem 
                          ? `bg-gradient-to-r ${category.color} shadow-md` 
                          : "hover:bg-violet-100/80 dark:hover:bg-violet-900/30"
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
                    isExpanded ? "max-h-[800px] opacity-100 mt-1" : "max-h-0 opacity-0"
                  )}>
                    <div className="space-y-0.5 pl-1">
                      {category.items.map(item => {
                        const isActive = activeTab === item.id;
                        const Icon = item.icon;
                        
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleItemClick(item)}
                            className={cn(
                              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left group",
                              isActive 
                                ? "bg-white dark:bg-white/10 shadow-md border border-violet-200/60 dark:border-violet-700/40" 
                                : "hover:bg-white/60 dark:hover:bg-white/5"
                            )}
                          >
                            <div className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                              isActive 
                                ? `bg-gradient-to-br ${category.color} shadow-sm` 
                                : "bg-violet-100/80 dark:bg-violet-900/40 group-hover:bg-violet-200/80 dark:group-hover:bg-violet-800/40"
                            )}>
                              <Icon className={cn(
                                "w-4 h-4",
                                isActive ? "text-white" : "text-violet-600 dark:text-violet-400"
                              )} />
                            </div>
                            <span className={cn(
                              "text-sm font-medium flex-1",
                              isActive ? "text-foreground" : "text-foreground/80"
                            )}>
                              {item.label}
                            </span>
                            
                            {item.isNew && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-gradient-to-r from-amber-400 to-orange-500 text-white">
                                NEW
                              </span>
                            )}
                            
                            {item.isPro && !item.isNew && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-violet-500 text-white">
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
                  <div className="space-y-1">
                    {category.items.map(item => {
                      const isActive = activeTab === item.id;
                      const Icon = item.icon;
                      
                      return (
                        <Tooltip key={item.id}>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => handleItemClick(item)}
                              className={cn(
                                "w-full flex items-center justify-center p-2.5 rounded-xl transition-all",
                                isActive 
                                  ? `bg-gradient-to-br ${category.color} text-white shadow-md` 
                                  : "hover:bg-violet-100/80 dark:hover:bg-violet-900/30 text-violet-600 dark:text-violet-400"
                              )}
                            >
                              <Icon className="w-4 h-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="font-medium">
                            {item.label}
                            {item.isNew && <span className="ml-2 text-amber-500 text-xs">NEW</span>}
                            {item.isPro && !item.isNew && <span className="ml-2 text-violet-400 text-xs">PRO</span>}
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
        <div className="border-t border-violet-200/50 dark:border-violet-900/30">
          <QuotaDisplay isCollapsed={isCollapsed} />
        </div>

        {/* Footer */}
        <div className="p-2 border-t border-violet-200/50 dark:border-violet-900/30 flex gap-1">
          {isCollapsed && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="flex-1 h-10 rounded-xl hover:bg-violet-100 dark:hover:bg-violet-900/30"
                >
                  {isDark ? (
                    <Sun className="w-4 h-4 text-amber-500" />
                  ) : (
                    <Moon className="w-4 h-4 text-violet-600" />
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
              "h-10 flex items-center gap-2 rounded-xl hover:bg-violet-100 dark:hover:bg-violet-900/30",
              isCollapsed ? "flex-1 justify-center" : "w-full"
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Réduire le menu</span>
              </>
            )}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  );
};

export default ModernSidebar;
