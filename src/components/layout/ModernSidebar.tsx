import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, Users, Download, TrendingUp,
  LayoutDashboard, Palette, ChevronLeft, ChevronRight, ChevronDown,
  Sparkles, PenTool, FolderOpen,
  Bot, BookCopy, CreditCard, FileText,
  Crown, Search, Brain, GitBranch, Eye, Zap,
  RefreshCw, Fingerprint, Award, Rocket, Shield,
  Sun, Moon, X, Star,
  BarChart3, Library, Headphones,
  Globe,
  Layers,
  ListChecks, Play,
  Glasses, ClipboardCheck, Megaphone
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { useUserQuotas, getQuotaPercentage } from '@/hooks/useUserQuotas';
import { SIDEBAR_SUBSECTIONS } from './modernSidebarSections';

interface ModernSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onSwitchToTrello?: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  isLink?: boolean;
  href?: string;
  isNew?: boolean;
  isPro?: boolean;
  adminOnly?: boolean;
}

interface ToolGroup {
  label: string;
  emoji: string;
  color: string;
  items: MenuItem[];
}

interface GroupedItems {
  label: string;
  items: MenuItem[];
}

// ══════════════════════════════════════════════════════════════
//  ~44 OUTILS FONCTIONNELS — organisés en 5 catégories
// ══════════════════════════════════════════════════════════════

const allToolGroups: ToolGroup[] = [
  {
    label: '🤖 Workflow IA',
    emoji: '🤖',
    color: 'emerald',
    items: [
      { id: 'workflow-dashboard', label: '📊 Dashboard Pipeline', icon: BarChart3 },
      { id: 'complete-workflow', label: '🚀 Lancer le workflow', icon: Rocket, isPro: true },
      { id: 'editorial-director', label: 'P1 · Zyro — Niche', icon: Crown, isPro: true },
      { id: 'market-analysis', label: 'P2 · Jano — Marché', icon: Search, isPro: true },
      { id: 'content-architect', label: 'P3 · Kiro — Plan', icon: LayoutDashboard, isPro: true },
      { id: 'expert-writing', label: 'P4 · Alia — Rédaction', icon: PenTool, isPro: true },
      { id: 'natural-rewrite', label: 'P5 · Lexo — Réécriture', icon: Sparkles, isPro: true },
      { id: 'editorial-quality', label: 'P6 · Vero — Qualité', icon: FileText, isPro: true },
      { id: 'editorial-packaging', label: 'P7 · Kado — KDP', icon: FileText, isPro: true },
      { id: 'final-diagnosis', label: 'P8 · Conso — Diagnostic', icon: Shield, isPro: true },
      { id: 'editorial-memory', label: 'P9 · Emio — Voix', icon: Brain, isPro: true },
      { id: 'chapter-coherence', label: 'P10 · Mira — Transitions', icon: GitBranch, isPro: true },
      { id: 'self-critique', label: 'P11 · Beto — Lecteur test', icon: Eye, isPro: true },
      { id: 'iterative-loop', label: 'P12 · Nexa — Corrections', icon: RefreshCw, isPro: true },
      { id: 'style-signature', label: 'P13 · Huma — Style', icon: Fingerprint, isPro: true },
      { id: 'ultimate-verdict', label: 'P14 · Tila — Verdict', icon: Award, isPro: true },
      { id: 'humanize-anti-ia', label: 'P15 · Orin — Anti-IA', icon: Shield, isPro: true },
    ]
  },
  {
    label: '✍️ Écriture',
    emoji: '✍️',
    color: 'violet',
    items: [
      { id: 'planner', label: 'Plan de l\'ebook', icon: ListChecks },
      { id: 'writing', label: 'Écrire les chapitres', icon: PenTool },
      { id: 'aichat', label: 'Assistant IA', icon: Bot },
      { id: 'characters', label: 'Personnages', icon: Users },
      { id: 'series', label: 'Série / Saga', icon: BookCopy },
      { id: 'atlas', label: 'Atlas', icon: Globe },
      { id: 'encyclopedia', label: 'Encyclopédie', icon: Library },
      { id: 'coloring', label: 'Livre de Coloriage', icon: Palette },
      { id: 'documentary', label: 'Documentaire', icon: FileText },
      { id: 'doc-transform', label: 'Importer Word', icon: FileText },
      { id: 'url-import', label: 'Importer URL', icon: Globe },
      { id: 'templates', label: 'Modèles / Templates', icon: Layers },
      { id: 'strict-proofread', label: 'Relecture Stricte', icon: Glasses },
    ]
  },
  {
    label: '📦 Publier',
    emoji: '📦',
    color: 'blue',
    items: [
      { id: 'export', label: 'Exporter (PDF, Word)', icon: Download },
      { id: 'workflow-export', label: 'Export Global Workflow', icon: Download },
      { id: 'calibre-epub', label: 'Export ePub (Calibre)', icon: Download },
      { id: 'cover-design-editor', label: 'Éditeur Couverture', icon: Palette, isNew: true },
      { id: 'cover', label: 'Couverture IA', icon: Sparkles },
      { id: 'backcover', label: '4e de Couverture', icon: FileText },
      { id: 'kdp', label: 'Description KDP', icon: TrendingUp },
      { id: 'kdp-prepublish-checklist', label: 'Checklist KDP', icon: ClipboardCheck },
      { id: 'audiobook', label: 'Livre Audio', icon: Headphones },
      { id: 'audio-express', label: 'Audio Express', icon: Play },
    ]
  },
  {
    label: '📣 Vendre',
    emoji: '📣',
    color: 'orange',
    items: [
      { id: 'marketing', label: 'Posts Réseaux Sociaux', icon: Megaphone },
      { id: 'launch-plan', label: 'Plan Lancement', icon: Rocket },
    ]
  },
  {
    label: '⚙️ Mon Compte',
    emoji: '⚙️',
    color: 'slate',
    items: [
      { id: 'projects', label: 'Mes Projets', icon: FolderOpen },
      { id: 'ebook-library', label: 'Ma Bibliothèque', icon: Library },
      { id: 'subscription', label: 'Abonnement', icon: CreditCard },
      { id: 'settings', label: 'Paramètres', icon: Settings },
      { id: 'admin', label: 'Admin Panel', icon: Shield, isLink: true, href: '/admin', adminOnly: true },
      { id: 'admin-panel', label: 'Gestion Admin', icon: Shield, isLink: true, href: '/admin', adminOnly: true },
    ]
  },
];
// ─── Theme hook ───
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

// ─── Quota Display ───
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
            "bg-gradient-gold text-background hover:opacity-90 shadow-lg shadow-gold/25",
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
            <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center border border-gold/20">
              <Zap className="w-4 h-4 text-gold" />
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
        <div className="p-3 rounded-xl bg-card border border-border">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-gold" />
              <span className="text-xs font-semibold text-foreground">Mon Plan</span>
            </div>
            <span className={cn(
              "text-[10px] font-bold px-2 py-0.5 rounded-full",
              quotas.plan === 'lifetime' ? 'bg-gold text-background' :
              quotas.plan === 'pro' ? 'bg-amber-500 text-white' :
              'bg-emerald-500 text-white'
            )}>
              {quotas.plan.toUpperCase()}
            </span>
          </div>
          {isUnlimited ? (
            <div className="text-center py-1">
              <span className="text-sm font-bold text-gold">∞ Accès illimité</span>
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

// ─── Color map ───
const colorMap: Record<string, { bg: string; bgActive: string; border: string; text: string; icon: string; iconBg: string; dot: string }> = {
  emerald: {
    bg: 'bg-emerald-500/10', bgActive: 'bg-gradient-to-r from-emerald-500/10 to-emerald-400/5',
    border: 'border-primary/20', text: 'text-kdp-orange', icon: 'text-emerald-600',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-emerald-600', dot: 'bg-emerald-500',
  },
  violet: {
    bg: 'bg-violet-500/10', bgActive: 'bg-gradient-to-r from-violet-500/10 to-violet-400/5',
    border: 'border-primary/20', text: 'text-kdp-orange', icon: 'text-violet-600',
    iconBg: 'bg-gradient-to-br from-violet-500 to-violet-600', dot: 'bg-violet-500',
  },
  blue: {
    bg: 'bg-blue-500/10', bgActive: 'bg-gradient-to-r from-blue-500/10 to-blue-400/5',
    border: 'border-blue-500/20', text: 'text-kdp-orange', icon: 'text-blue-600',
    iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600', dot: 'bg-blue-500',
  },
  orange: {
    bg: 'bg-orange-500/10', bgActive: 'bg-gradient-to-r from-orange-500/10 to-orange-400/5',
    border: 'border-orange-500/20', text: 'text-kdp-orange', icon: 'text-orange-600',
    iconBg: 'bg-gradient-to-br from-orange-500 to-orange-600', dot: 'bg-orange-500',
  },
  slate: {
    bg: 'bg-muted/50', bgActive: 'bg-gradient-to-r from-muted/60 to-muted/30',
    border: 'border-border', text: 'text-kdp-orange', icon: 'text-foreground',
    iconBg: 'bg-gradient-to-br from-slate-500 to-slate-600', dot: 'bg-muted-foreground',
  },
};

// ─── Menu item button ───
const MenuItemButton: React.FC<{
  item: MenuItem;
  isActive: boolean;
  onClick: () => void;
  isCollapsed: boolean;
  groupColor?: string;
}> = ({ item, isActive, onClick, isCollapsed, groupColor = 'blue' }) => {
  const Icon = item.icon;
  const colors = colorMap[groupColor] || colorMap.blue;

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            className={cn(
              "w-full flex items-center justify-center p-2.5 rounded-xl transition-all",
              isActive
                ? cn(colors.iconBg, "text-white shadow-md")
                : "hover:bg-card text-muted-foreground"
            )}
          >
            <Icon className="w-4 h-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" className="font-medium">{item.label}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all text-left group",
        isActive
          ? cn(colors.bgActive, "border", colors.border, "shadow-sm")
          : "hover:bg-card/80"
      )}
    >
      <Icon className={cn("w-4 h-4 flex-shrink-0", isActive ? colors.icon : "text-muted-foreground")} />
      <span className={cn(
        "text-sm flex-1 truncate",
        isActive ? cn("font-semibold", colors.text) : "text-foreground group-hover:text-kdp-orange"
      )}>
        {item.label}
      </span>
      {item.isNew && <span className={cn("w-2 h-2 rounded-full flex-shrink-0", colors.dot)} />}
      {item.isPro && (
        <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0", colors.bg, colors.text)}>
          PRO
        </span>
      )}
    </button>
  );
};

// ─── Main Component ───
export const ModernSidebar: React.FC<ModernSidebarProps> = ({
  activeTab,
  onTabChange,
  isCollapsed,
  onToggleCollapse,
  onSwitchToTrello
}) => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['🤖 Workflow IA']);
  const [expandedSections, setExpandedSections] = useState<string[]>(['🤖 Workflow IA:Pipeline', '🤖 Workflow IA:Créer']);

  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem('is_admin') === 'true');
  React.useEffect(() => {
    const checkAdmin = () => setIsAdmin(sessionStorage.getItem('is_admin') === 'true');
    window.addEventListener('storage', checkAdmin);
    return () => window.removeEventListener('storage', checkAdmin);
  }, []);

  const handleItemClick = (item: MenuItem) => {
    if (item.isLink && item.href) {
      navigate(item.href);
    } else {
      onTabChange(item.id);
    }
    if (searchQuery) setSearchQuery('');
  };

  const toggleGroup = (label: string) => {
    setExpandedGroups(prev =>
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );
  };

  const toggleSection = (key: string) => {
    setExpandedSections(prev =>
      prev.includes(key) ? prev.filter(section => section !== key) : [...prev, key]
    );
  };

  const filterAdmin = (item: MenuItem) => {
    if (item.adminOnly && !isAdmin) return false;
    return true;
  };

  // Auto-expand group of active tab
  React.useEffect(() => {
    for (const group of allToolGroups) {
      if (group.items.some(i => i.id === activeTab)) {
        setExpandedGroups(prev => prev.includes(group.label) ? prev : [...prev, group.label]);
        break;
      }
    }
  }, [activeTab]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return allToolGroups
      .flatMap(g => g.items)
      .filter(item => !item.adminOnly || isAdmin)
      .filter(item => item.label.toLowerCase().includes(q) || item.id.toLowerCase().includes(q))
      .slice(0, 15);
  }, [searchQuery, isAdmin]);

  const getSectionedItems = (group: ToolGroup, visibleItems: MenuItem[]): GroupedItems[] => {
    const config = SIDEBAR_SUBSECTIONS[group.label] ?? [];
    const itemMap = new globalThis.Map(visibleItems.map(item => [item.id, item]));

    const configuredSections = config
      .map(section => ({
        label: section.label,
        items: section.itemIds.map(itemId => itemMap.get(itemId)).filter(Boolean) as MenuItem[],
      }))
      .filter(section => section.items.length > 0);

    const configuredIds = new Set(config.flatMap(section => section.itemIds));
    const remainingItems = visibleItems.filter(item => !configuredIds.has(item.id));

    return remainingItems.length > 0
      ? [...configuredSections, { label: 'Autres', items: remainingItems }]
      : configuredSections;
  };

  React.useEffect(() => {
    for (const group of allToolGroups) {
      const sections = SIDEBAR_SUBSECTIONS[group.label] ?? [];
      const activeSection = sections.find(section => section.itemIds.includes(activeTab));

      if (activeSection) {
        const sectionKey = `${group.label}:${activeSection.label}`;
        setExpandedSections(prev => prev.includes(sectionKey) ? prev : [...prev, sectionKey]);
        break;
      }
    }
  }, [activeTab]);

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "relative flex flex-col h-screen transition-all duration-300 ease-out",
          "bg-background border-r border-border",
          isCollapsed ? "w-[72px]" : "w-72"
        )}
      >
        {/* Header */}
        <div className={cn(
          "flex items-center gap-3 p-4 border-b border-border",
          isCollapsed && "justify-center p-3"
        )}>
          <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center shadow-lg shadow-gold">
            <Sparkles className="w-5 h-5 text-background" />
          </div>
          {!isCollapsed && (
            <>
              <div className="min-w-0 flex-1">
                <h1 className="font-bold text-gradient-gold">EbookStudio</h1>
                <p className="text-xs text-gold-muted">Pro Edition 2026</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="h-9 w-9 rounded-xl hover:bg-card"
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-muted-foreground" />}
              </Button>
            </>
          )}
        </div>

        {/* Search */}
        {!isCollapsed && (
          <div className="p-3 pb-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-8 h-9 text-sm bg-card border-border placeholder:text-muted-foreground rounded-xl focus:border-gold/50 focus:ring-gold/20"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted"
                >
                  <X className="w-3 h-3 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
          {searchQuery.trim() && !isCollapsed ? (
            <div className="space-y-1">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-2 mb-2">
                {searchResults.length} résultat{searchResults.length !== 1 ? 's' : ''}
              </p>
              {searchResults.map(item => (
                <MenuItemButton
                  key={item.id}
                  item={item}
                  isActive={activeTab === item.id}
                  onClick={() => handleItemClick(item)}
                  isCollapsed={false}
                />
              ))}
              {searchResults.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-6">Aucun outil trouvé</p>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              {allToolGroups.map(group => {
                const isExpanded = expandedGroups.includes(group.label);
                const visibleItems = group.items.filter(filterAdmin);
                const hasActive = visibleItems.some(i => i.id === activeTab);
                const colors = colorMap[group.color] || colorMap.blue;

                if (isCollapsed) {
                  return (
                    <Tooltip key={group.label}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => {
                            onToggleCollapse();
                            setTimeout(() => setExpandedGroups([group.label]), 300);
                          }}
                          className={cn(
                            "w-full flex items-center justify-center p-2.5 rounded-xl transition-all",
                            hasActive
                              ? cn(colors.bg, "border", colors.border)
                              : "hover:bg-card text-muted-foreground"
                          )}
                        >
                          <span className="text-base">{group.emoji}</span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="font-medium">
                        {group.label}
                      </TooltipContent>
                    </Tooltip>
                  );
                }

                return (
                  <div key={group.label}>
                    <button
                      onClick={() => toggleGroup(group.label)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all",
                        hasActive ? colors.bg : "hover:bg-card/60"
                      )}
                    >
                      <span className={cn(
                        "text-sm font-semibold",
                        hasActive ? colors.text : "text-foreground"
                      )}>
                        {group.label}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className={cn(
                          "text-[10px] font-medium px-1.5 py-0.5 rounded-full",
                          colors.bg, colors.text
                        )}>
                          {visibleItems.length}
                        </span>
                        <ChevronDown className={cn(
                          "w-3.5 h-3.5 transition-transform duration-200",
                          isExpanded ? "rotate-0" : "-rotate-90",
                          hasActive ? colors.text : "text-muted-foreground"
                        )} />
                      </div>
                    </button>
                    {isExpanded && (
                      <div className={cn("ml-2 pl-2 border-l-2 space-y-2 mt-1 pb-1", colors.border)}>
                        {getSectionedItems(group, visibleItems).map(section => {
                          const sectionKey = `${group.label}:${section.label}`;
                          const sectionExpanded = expandedSections.includes(sectionKey);
                          const sectionHasActive = section.items.some(item => item.id === activeTab);

                          return (
                            <div key={sectionKey} className="space-y-1">
                              <button
                                onClick={() => toggleSection(sectionKey)}
                                className={cn(
                                  "w-full flex items-center justify-between rounded-lg px-2 py-1.5 text-left transition-all",
                                  sectionHasActive ? colors.bg : "hover:bg-card/60"
                                )}
                              >
                                <span className={cn(
                                  "text-xs font-semibold",
                                  sectionHasActive ? colors.text : "text-muted-foreground"
                                )}>
                                  {section.label}
                                </span>
                                <div className="flex items-center gap-1.5">
                                  <span className={cn(
                                    "text-[10px] font-medium px-1.5 py-0.5 rounded-full",
                                    colors.bg,
                                    sectionHasActive ? colors.text : "text-muted-foreground"
                                  )}>
                                    {section.items.length}
                                  </span>
                                  <ChevronDown className={cn(
                                    "w-3 h-3 transition-transform duration-200",
                                    sectionExpanded ? "rotate-0" : "-rotate-90",
                                    sectionHasActive ? colors.text : "text-muted-foreground"
                                  )} />
                                </div>
                              </button>

                              {sectionExpanded && (
                                <div className="space-y-0.5 pl-1">
                                  {section.items.map(item => (
                                    <MenuItemButton
                                      key={item.id}
                                      item={item}
                                      isActive={activeTab === item.id}
                                      onClick={() => handleItemClick(item)}
                                      isCollapsed={false}
                                      groupColor={group.color}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </nav>

        {/* Quota */}
        <div className="border-t border-border">
          <QuotaDisplay isCollapsed={isCollapsed} />
        </div>

        <div className="p-2 border-t border-border flex flex-col gap-1">
          {onSwitchToTrello && !isCollapsed && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSwitchToTrello}
              className="w-full h-9 flex items-center gap-2 rounded-xl hover:bg-card text-xs"
            >
              <LayoutDashboard className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">Mode Tableau</span>
            </Button>
          )}
          <div className="flex gap-1">
            {isCollapsed && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleTheme}
                    className="flex-1 h-10 rounded-xl hover:bg-card"
                  >
                    {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-muted-foreground" />}
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
                "h-10 flex items-center gap-2 rounded-xl hover:bg-card",
                isCollapsed ? "flex-1 justify-center" : "w-full"
              )}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              ) : (
                <>
                  <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Réduire</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
};

export default ModernSidebar;
