import React, { useState, useMemo, useEffect } from 'react';
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
  Glasses, ClipboardCheck, Megaphone,
  ChevronsUpDown, Plus, Minus
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { useUserQuotas, getQuotaPercentage } from '@/hooks/useUserQuotas';
import { ToolsGuideButton } from '@/components/layout/ToolsGuideButton';
import { ESSENTIAL_TOOL_IDS } from './modernSidebarSections';
import { useSidebarFavorites } from '@/hooks/useSidebarFavorites';
import { SidebarFavorites } from './SidebarFavorites';
import { SidebarHeader, type RecentProject } from './SidebarHeader';
import { useEbookDatabase } from '@/hooks/useEbookDatabase';
import { useWorkflowResults } from '@/hooks/useWorkflowResults';

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
      { id: 'multi-translator', label: 'Traduction Multi-Langues', icon: Globe },
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
      { id: 'kdp-ads-guide', label: 'Guide KDP Ads', icon: TrendingUp },
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
      { id: 'admin-subscribers', label: '👥 Mes Abonnés', icon: Users, isLink: true, href: '/admin', adminOnly: true },
      { id: 'admin', label: 'Admin Panel', icon: Shield, isLink: true, href: '/admin', adminOnly: true },
    ]
  },
];

// Flat lookup for favorites/recent
const ALL_ITEMS_FLAT: MenuItem[] = allToolGroups.flatMap(g => g.items);

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

  useEffect(() => {
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

// Map workflow step IDs (P1..P15) to tool IDs in the sidebar
const WORKFLOW_STEP_TO_TAB: Record<string, string> = {
  P1: 'editorial-director', P2: 'market-analysis', P3: 'content-architect', P4: 'expert-writing',
  P5: 'natural-rewrite', P6: 'editorial-quality', P7: 'editorial-packaging', P8: 'final-diagnosis',
  P9: 'editorial-memory', P10: 'chapter-coherence', P11: 'self-critique', P12: 'iterative-loop',
  P13: 'style-signature', P14: 'ultimate-verdict', P15: 'humanize-anti-ia',
};

// ─── Menu item button (with star) ───
const MenuItemButton: React.FC<{
  item: MenuItem;
  isActive: boolean;
  onClick: () => void;
  isCollapsed: boolean;
  groupColor?: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  inProgress?: boolean;
}> = ({ item, isActive, onClick, isCollapsed, groupColor = 'blue', isFavorite, onToggleFavorite, inProgress }) => {
  const Icon = item.icon;
  const colors = colorMap[groupColor] || colorMap.blue;

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            className={cn(
              "w-full flex items-center justify-center p-2.5 rounded-xl transition-all relative",
              isActive
                ? cn(colors.iconBg, "text-white shadow-md")
                : "hover:bg-card text-muted-foreground"
            )}
          >
            <Icon className="w-4 h-4" />
            {inProgress && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" className="font-medium">{item.label}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div
      className={cn(
        "group/item w-full flex items-center gap-1 rounded-lg transition-all",
        isActive ? cn(colors.bgActive, "border", colors.border, "shadow-sm") : "hover:bg-card/80"
      )}
    >
      <button
        onClick={onClick}
        className="flex-1 flex items-center gap-2.5 px-3 py-2 text-left min-w-0"
      >
        <Icon className={cn("w-4 h-4 flex-shrink-0", isActive ? colors.icon : "text-muted-foreground")} />
        <span className={cn(
          "text-sm flex-1 truncate",
          isActive ? cn("font-semibold", colors.text) : "text-foreground group-hover/item:text-kdp-orange"
        )}>
          {item.label}
        </span>
        {inProgress && (
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 flex-shrink-0">
            EN COURS
          </span>
        )}
        {item.isNew && !inProgress && <span className={cn("w-2 h-2 rounded-full flex-shrink-0", colors.dot)} />}
        {item.isPro && !inProgress && (
          <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0", colors.bg, colors.text)}>
            PRO
          </span>
        )}
      </button>
      {onToggleFavorite && (
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
          className={cn(
            "p-1.5 rounded-md mr-1 transition-opacity flex-shrink-0",
            isFavorite ? "opacity-100" : "opacity-0 group-hover/item:opacity-100",
            "hover:bg-background/60"
          )}
          aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <Star
            className={cn(
              "w-3.5 h-3.5",
              isFavorite ? "text-kdp-orange fill-kdp-orange" : "text-muted-foreground"
            )}
          />
        </button>
      )}
    </div>
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
  // Accordéon EXCLUSIF — un seul groupe ouvert à la fois
  const [openGroup, setOpenGroup] = useState<string | null>('🤖 Workflow IA');
  // Toggle "essentiel vs avancé" par groupe (true = avancés visibles)
  const [showAdvanced, setShowAdvanced] = useState<Record<string, boolean>>({});

  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem('is_admin') === 'true');
  useEffect(() => {
    const checkAdmin = () => setIsAdmin(sessionStorage.getItem('is_admin') === 'true');
    window.addEventListener('storage', checkAdmin);
    return () => window.removeEventListener('storage', checkAdmin);
  }, []);

  // Favoris
  const { favorites, isFavorite, toggleFavorite } = useSidebarFavorites();
  const favoriteItems = useMemo(
    () => favorites
      .map(id => ALL_ITEMS_FLAT.find(i => i.id === id))
      .filter((i): i is MenuItem => Boolean(i) && (!i!.adminOnly || isAdmin)),
    [favorites, isAdmin]
  );

  // Projets récents pour le sélecteur
  const { loadAllProjects } = useEbookDatabase();
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
  const [currentProjectTitle, setCurrentProjectTitle] = useState<string | null>(null);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const projects = await loadAllProjects();
        if (!mounted) return;
        setRecentProjects(projects.slice(0, 3).map((p: any) => ({ id: p.id, title: p.title })));
      } catch {
        /* ignore */
      }
    })();
    try {
      const raw = localStorage.getItem('ebook_planner_data');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.ebookTitle) setCurrentProjectTitle(parsed.ebookTitle);
      }
    } catch { /* ignore */ }
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Étape Workflow IA "en cours" = dernière étape P* qui a un résultat
  const { results } = useWorkflowResults();
  const inProgressTabId = useMemo(() => {
    const completed = Object.keys(results).filter(k => results[k as keyof typeof results]);
    if (completed.length === 0) return null;
    // dernière étape réalisée (max P{n})
    const maxStep = completed
      .map(k => parseInt(k.replace('P', ''), 10))
      .filter(n => !Number.isNaN(n))
      .sort((a, b) => b - a)[0];
    if (!maxStep) return null;
    return WORKFLOW_STEP_TO_TAB[`P${maxStep}`] ?? null;
  }, [results]);

  // Compteur projets non finalisés (status !== 'completed' ou non défini)
  const unfinishedProjectsCount = useMemo(() => {
    return recentProjects.length;
  }, [recentProjects]);

  const handleItemClick = (item: MenuItem) => {
    if (item.isLink && item.href) {
      navigate(item.href);
    } else {
      onTabChange(item.id);
    }
    if (searchQuery) setSearchQuery('');
  };

  const handleFavoriteClick = (id: string) => {
    const item = ALL_ITEMS_FLAT.find(i => i.id === id);
    if (item) handleItemClick(item);
  };

  const toggleGroup = (label: string) => {
    setOpenGroup(prev => (prev === label ? null : label));
  };

  const toggleAdvanced = (label: string) => {
    setShowAdvanced(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const collapseAll = () => setOpenGroup(null);

  const filterAdmin = (item: MenuItem) => !item.adminOnly || isAdmin;

  // Auto-open group of active tab (and force essentials override if active is advanced)
  useEffect(() => {
    for (const group of allToolGroups) {
      if (group.items.some(i => i.id === activeTab)) {
        setOpenGroup(group.label);
        const essentials = ESSENTIAL_TOOL_IDS[group.label] ?? [];
        if (!essentials.includes(activeTab)) {
          setShowAdvanced(prev => ({ ...prev, [group.label]: true }));
        }
        break;
      }
    }
  }, [activeTab]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return ALL_ITEMS_FLAT
      .filter(item => !item.adminOnly || isAdmin)
      .filter(item => item.label.toLowerCase().includes(q) || item.id.toLowerCase().includes(q))
      .slice(0, 15);
  }, [searchQuery, isAdmin]);

  // Décompose les items d'un groupe en (essentiels visibles, avancés visibles si toggle)
  const partitionItems = (group: ToolGroup) => {
    const visible = group.items.filter(filterAdmin);
    const essentialIds = ESSENTIAL_TOOL_IDS[group.label] ?? [];
    const essentials = visible.filter(i => essentialIds.includes(i.id));
    const advanced = visible.filter(i => !essentialIds.includes(i.id));
    return { essentials, advanced, total: visible.length };
  };

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "relative flex flex-col h-screen transition-all duration-300 ease-out",
          "bg-background border-r border-border",
          isCollapsed ? "w-[72px]" : "w-72"
        )}
      >
        {/* Header logo */}
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

        {/* CHANTIER 1 — Header opérationnel: projet actif + nouveau */}
        <SidebarHeader
          recentProjects={recentProjects}
          currentProjectTitle={currentProjectTitle}
          onSelectProject={() => onTabChange('projects')}
          onNewProject={() => onTabChange('planner')}
          onOpenAllProjects={() => onTabChange('projects')}
          isCollapsed={isCollapsed}
        />

        {/* Search bar */}
        {!isCollapsed && (
          <div className="p-3 pb-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Rechercher un outil..."
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

        {/* Tools Guide button */}
        <div className={cn('px-2 pt-2', isCollapsed && 'px-2')}>
          <ToolsGuideButton isCollapsed={isCollapsed} />
        </div>

        {/* CHANTIER 2 — Favoris */}
        <SidebarFavorites
          items={favoriteItems}
          activeTab={activeTab}
          onItemClick={handleFavoriteClick}
          isCollapsed={isCollapsed}
        />

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
                  isFavorite={isFavorite(item.id)}
                  onToggleFavorite={() => toggleFavorite(item.id)}
                  inProgress={inProgressTabId === item.id}
                />
              ))}
              {searchResults.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-6">Aucun outil trouvé</p>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              {allToolGroups.map(group => {
                const isExpanded = openGroup === group.label;
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
                            setTimeout(() => setOpenGroup(group.label), 300);
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

                const { essentials, advanced, total } = partitionItems(group);
                const advancedShown = showAdvanced[group.label] ?? false;
                const groupHasInProgress = inProgressTabId
                  ? visibleItems.some(i => i.id === inProgressTabId)
                  : false;

                // CHANTIER 5 — badge contextuel
                const groupBadge = (() => {
                  if (group.label === '⚙️ Mon Compte' && unfinishedProjectsCount > 0) {
                    return String(unfinishedProjectsCount);
                  }
                  return String(total);
                })();

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
                        "text-sm font-semibold flex items-center gap-2",
                        hasActive ? colors.text : "text-foreground"
                      )}>
                        {group.label}
                        {groupHasInProgress && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        )}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className={cn(
                          "text-[10px] font-medium px-1.5 py-0.5 rounded-full",
                          colors.bg, colors.text
                        )}>
                          {groupBadge}
                        </span>
                        <ChevronDown className={cn(
                          "w-3.5 h-3.5 transition-transform duration-200",
                          isExpanded ? "rotate-0" : "-rotate-90",
                          hasActive ? colors.text : "text-muted-foreground"
                        )} />
                      </div>
                    </button>

                    {isExpanded && (
                      <div className={cn("ml-2 pl-2 border-l-2 space-y-0.5 mt-1 pb-1", colors.border)}>
                        {/* CHANTIER 3 — essentiels d'abord */}
                        {essentials.map(item => (
                          <MenuItemButton
                            key={item.id}
                            item={item}
                            isActive={activeTab === item.id}
                            onClick={() => handleItemClick(item)}
                            isCollapsed={false}
                            groupColor={group.color}
                            isFavorite={isFavorite(item.id)}
                            onToggleFavorite={() => toggleFavorite(item.id)}
                            inProgress={inProgressTabId === item.id}
                          />
                        ))}

                        {advanced.length > 0 && (
                          <>
                            <button
                              onClick={() => toggleAdvanced(group.label)}
                              className="w-full flex items-center gap-1.5 px-3 py-1.5 mt-1 rounded-md text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-card/60 transition-all"
                            >
                              {advancedShown ? (
                                <Minus className="w-3 h-3" />
                              ) : (
                                <Plus className="w-3 h-3" />
                              )}
                              <span>
                                {advancedShown
                                  ? `Masquer ${advanced.length} outil${advanced.length > 1 ? 's' : ''} avancé${advanced.length > 1 ? 's' : ''}`
                                  : `Voir ${advanced.length} outil${advanced.length > 1 ? 's' : ''} avancé${advanced.length > 1 ? 's' : ''}`}
                              </span>
                            </button>

                            {advancedShown && (
                              <div className="space-y-0.5 pt-1">
                                {advanced.map(item => (
                                  <MenuItemButton
                                    key={item.id}
                                    item={item}
                                    isActive={activeTab === item.id}
                                    onClick={() => handleItemClick(item)}
                                    isCollapsed={false}
                                    groupColor={group.color}
                                    isFavorite={isFavorite(item.id)}
                                    onToggleFavorite={() => toggleFavorite(item.id)}
                                    inProgress={inProgressTabId === item.id}
                                  />
                                ))}
                              </div>
                            )}
                          </>
                        )}

                        {essentials.length === 0 && advanced.length === 0 && (
                          <p className="text-xs text-muted-foreground px-3 py-2">Aucun outil</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* CHANTIER 4 — Tout replier */}
              {openGroup && !isCollapsed && (
                <button
                  onClick={collapseAll}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 mt-2 rounded-lg text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-card/60 transition-all"
                >
                  <ChevronsUpDown className="w-3 h-3" />
                  Tout replier
                </button>
              )}
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
