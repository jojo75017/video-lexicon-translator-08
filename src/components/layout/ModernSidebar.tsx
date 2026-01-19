import React, { useState, useMemo } from 'react';
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
  Target
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
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
      { id: 'complete-workflow', label: 'Livre Complet IA', icon: Rocket, color: 'text-orange-600', isPremium: true, isNew2026: true },
      { id: 'comic-book', label: 'Bande Dessinée', icon: LayoutTemplate, color: 'text-amber-600', isNew2026: true },
      { id: 'coloring-book', label: 'Livre Coloriage', icon: Palette, color: 'text-pink-600', isNew2026: true },
      { id: 'documentary', label: 'Documentaire', icon: BookMarked, color: 'text-blue-600', isNew2026: true },
      { id: 'diary-generator', label: 'Agenda / Journal', icon: BookHeart, color: 'text-rose-600', isNew2026: true },
    ]
  },
  {
    id: 'workflow',
    label: 'Workflow IA (P1-P8)',
    emoji: '⚡',
    items: [
      { id: 'editorial-director', label: 'P1 Directeur', icon: Crown, color: 'text-amber-600', isPremium: true },
      { id: 'market-analysis', label: 'P2 Marché', icon: Search, color: 'text-emerald-600', isPremium: true },
      { id: 'content-architect', label: 'P3 Architecte', icon: LayoutDashboard, color: 'text-violet-600', isPremium: true },
      { id: 'expert-writing', label: 'P4 Rédaction', icon: PenTool, color: 'text-blue-600', isPremium: true },
      { id: 'natural-rewrite', label: 'P5 Réécriture', icon: Sparkles, color: 'text-pink-600', isPremium: true },
      { id: 'editorial-quality', label: 'P6 Qualité', icon: FileEdit, color: 'text-teal-600', isPremium: true },
      { id: 'editorial-packaging', label: 'P7 Packaging', icon: FileText, color: 'text-green-600', isPremium: true },
      { id: 'final-diagnosis', label: 'P8 Diagnostic', icon: Shield, color: 'text-purple-600', isPremium: true },
    ]
  },
  {
    id: 'moteur',
    label: 'Moteur V2 (P9-P14)',
    emoji: '🧬',
    items: [
      { id: 'editorial-memory', label: 'P9 Mémoire', icon: Brain, color: 'text-purple-600', isPremium: true },
      { id: 'chapter-coherence', label: 'P10 Cohérence', icon: GitBranch, color: 'text-indigo-600', isPremium: true },
      { id: 'self-critique', label: 'P11 Critique', icon: Eye, color: 'text-rose-600', isPremium: true },
      { id: 'iterative-loop', label: 'P12 Boucle', icon: RefreshCw, color: 'text-cyan-600', isPremium: true },
      { id: 'style-signature', label: 'P13 Style', icon: Fingerprint, color: 'text-amber-600', isPremium: true },
      { id: 'ultimate-verdict', label: 'P14 Verdict', icon: Award, color: 'text-yellow-600', isPremium: true },
    ]
  },
  {
    id: 'creation',
    label: 'Création',
    emoji: '✍️',
    items: [
      { id: 'url-import', label: 'Import URL', icon: Link, color: 'text-violet-600', isNew2026: true },
      { id: 'doc-transform', label: 'Import Word', icon: FileText, color: 'text-blue-600', isNew2026: true },
      { id: 'planner', label: 'Planificateur', icon: BookOpen, color: 'text-fuchsia-600' },
      { id: 'writing', label: 'Rédaction', icon: PenTool, color: 'text-blue-600' },
      { id: 'aichat', label: 'Chat IA', icon: Bot, color: 'text-orange-600' },
      { id: 'characters', label: 'Personnages', icon: Users, color: 'text-emerald-600' },
      { id: 'encyclopedia', label: 'Encyclopédie', icon: BookMarked, color: 'text-amber-600' },
      { id: 'atlas', label: 'Atlas', icon: Map, color: 'text-emerald-600' },
      { id: 'series', label: 'Série / Saga', icon: BookCopy, color: 'text-indigo-600' },
    ]
  },
  {
    id: 'visuels',
    label: 'Visuels',
    emoji: '🎨',
    items: [
      { id: 'cover', label: 'Couverture', icon: Palette, color: 'text-rose-600' },
      { id: 'backcover', label: '4e Couverture', icon: BookCopy, color: 'text-red-600' },
      { id: 'images', label: 'Images IA', icon: Image, color: 'text-amber-600' },
      { id: 'imagebank', label: 'Banque Images', icon: ImagePlus, color: 'text-lime-600' },
    ]
  },
  {
    id: 'publication',
    label: 'Publication',
    emoji: '📤',
    items: [
      { id: 'kdp-research', label: 'Recherche KDP', icon: Search, color: 'text-amber-600', isNew2026: true },
      { id: 'amazon-simulator', label: 'Simulateur Amazon', icon: Eye, color: 'text-orange-600', isNew2026: true },
      { id: 'plagiarism-validator', label: 'Anti-Plagiat', icon: Shield, color: 'text-red-600', isNew2026: true },
      { id: 'export', label: 'Exporter', icon: Download, color: 'text-teal-600' },
      { id: 'kdp', label: 'Amazon KDP', icon: TrendingUp, color: 'text-sky-600' },
    ]
  },
  {
    id: 'marketing',
    label: 'Marketing',
    emoji: '💰',
    items: [
      { id: 'amazon-ads', label: 'Amazon Ads', icon: Target, color: 'text-orange-600', isNew2026: true },
      { id: 'launch-plan', label: 'Plan Lancement', icon: Rocket, color: 'text-violet-600', isNew2026: true },
      { id: 'seo-articles', label: 'Articles SEO', icon: Globe, color: 'text-emerald-600', isNew2026: true },
      { id: 'marketing', label: 'Social Media', icon: MessageSquare, color: 'text-pink-600' },
      { id: 'monetization', label: 'Monétisation', icon: DollarSign, color: 'text-green-600' },
    ]
  },
  {
    id: 'audio',
    label: 'Audio & Formation',
    emoji: '🎧',
    items: [
      { id: 'audiobook', label: 'Livre Audio', icon: Headphones, color: 'text-purple-600' },
      { id: 'formation-complete', label: 'Formation', icon: GraduationCap, color: 'text-emerald-600', isLink: true, href: '/formation' },
      { id: 'voice', label: 'Dictée Vocale', icon: Volume2, color: 'text-rose-600' },
    ]
  },
  {
    id: 'outils',
    label: 'Outils',
    emoji: '⚙️',
    items: [
      { id: 'projects', label: 'Mes Projets', icon: FolderOpen, color: 'text-violet-600' },
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-cyan-600' },
      { id: 'settings', label: 'Paramètres', icon: Settings, color: 'text-slate-600' },
      { id: 'subscription', label: 'Abonnement', icon: CreditCard, color: 'text-purple-600', isLink: true, href: '/subscription' },
      { id: 'offres', label: 'Offres', icon: Sparkles, color: 'text-amber-600', isLink: true, href: '/offres' },
    ]
  },
];

// Composant Quota compact style clair
const QuotaDisplay: React.FC<{ isCollapsed: boolean }> = ({ isCollapsed }) => {
  const navigate = useNavigate();
  const { quotas, isLoading, hasSubscription } = useUserQuotas();

  if (isLoading || !hasSubscription || !quotas) {
    return (
      <div className={cn("border-t border-border/50 p-3 bg-muted/30", isCollapsed && "flex justify-center")}>
        <Button
          variant="default"
          size="sm"
          onClick={() => navigate('/offres')}
          className={cn(
            "bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700 shadow-md",
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
    <div className={cn("border-t border-border/50 p-3 bg-muted/30", isCollapsed && "flex justify-center")}>
      {isCollapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 flex items-center justify-center border border-violet-200 dark:border-violet-700">
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
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">Plan actif</span>
            <span className={cn(
              "text-xs font-bold px-2 py-0.5 rounded-full",
              quotas.plan === 'lifetime' ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300' :
              quotas.plan === 'pro' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300' :
              'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
            )}>
              {quotas.plan.toUpperCase()}
            </span>
          </div>
          {isUnlimited ? (
            <div className="text-center py-2 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-lg border border-violet-200/50 dark:border-violet-700/30">
              <span className="text-xs font-semibold text-violet-700 dark:text-violet-300">∞ Accès illimité</span>
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
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['generateurs']);

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
          "bg-card border-r border-border",
          isCollapsed ? "w-[72px]" : "w-64"
        )}
      >
        {/* Header avec Logo */}
        <div className={cn(
          "flex items-center gap-3 p-4 border-b border-border",
          isCollapsed && "justify-center p-3"
        )}>
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <h1 className="font-bold text-foreground text-sm">EbookStudio</h1>
              <p className="text-[11px] text-muted-foreground">Pro 2026</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2 px-2">
          {categories.map((category) => {
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
                      "hover:bg-muted/80",
                      hasActiveItem ? "bg-muted/60" : ""
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
                        "flex justify-center py-2 mb-1 rounded-xl cursor-pointer hover:bg-muted/80",
                        hasActiveItem && "bg-muted/60"
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
                                ? "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 shadow-sm" 
                                : "hover:bg-muted/60 text-foreground/80 hover:text-foreground"
                            )}
                          >
                            <Icon className={cn("w-4 h-4 flex-shrink-0", isActive ? "text-violet-600 dark:text-violet-400" : item.color)} />
                            <span className="text-sm font-medium truncate flex-1">{item.label}</span>
                            
                            {item.isNew2026 && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm">
                                2026
                              </span>
                            )}
                            
                            {item.isPremium && !item.isNew2026 && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300">
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
                                  ? "bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400" 
                                  : "hover:bg-muted/60 text-muted-foreground hover:text-foreground"
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

        {/* Toggle */}
        <div className="p-2 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className={cn(
              "w-full h-9 flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-xl",
              isCollapsed && "justify-center"
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
