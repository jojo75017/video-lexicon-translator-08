import React, { useState, useMemo } from 'react';
import { Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, Settings, Image, Users, Download, TrendingUp,
  LayoutDashboard, Palette, ChevronLeft, ChevronRight, ChevronDown,
  Sparkles, PenTool, FolderOpen, MessageSquare, DollarSign,
  ImagePlus, Bot, BookCopy, CreditCard, LayoutTemplate, FileEdit,
  Volume2, BookHeart, Shield, Headphones, FileText, GraduationCap,
  Zap, Crown, BookMarked, Map, Search, Brain, GitBranch, Eye,
  RefreshCw, Fingerprint, Award, Rocket, Link, Globe, Target,
  Sun, Moon, X, Star, Lightbulb, Video, FlaskConical, Languages,
  Info, BarChart3, Ruler, Monitor, Library, Music, CalendarDays,
  Contact, Mail, Code, Activity, ChevronUp
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
  adminOnly?: boolean;
}

// ─── 5 robots mis en avant pour démarrer vite ───
const starterWorkflowAgents: MenuItem[] = [
  { id: 'editorial-director', label: 'Zyro — Trouver la niche', icon: Crown, isPro: true },
  { id: 'content-architect', label: 'Kiro — Construire le plan', icon: LayoutDashboard, isPro: true },
  { id: 'expert-writing', label: 'Alia — Écrire le livre', icon: PenTool, isPro: true },
  { id: 'cover-design-editor', label: 'Cova — Créer la couverture', icon: Palette, isNew: true },
  { id: 'kdp-keywords', label: 'Keyro — Trouver les mots-clés', icon: Search, isLink: true, href: '/kdp-keywords' },
];

// ─── Tous les outils (groupés pour "Voir tout") ───
interface ToolGroup {
  label: string;
  emoji: string;
  items: MenuItem[];
}

interface ToolGroup {
  label: string;
  emoji: string;
  color: string; // tailwind color key
  items: MenuItem[];
}

const allToolGroups: ToolGroup[] = [
  {
    label: 'Créer',
    emoji: '✍️',
    color: 'emerald',
    items: [
      { id: 'presentation', label: 'Découvrir KDP Studio', icon: Info },
      { id: 'onboarding', label: 'Commencer ici', icon: BookOpen },
      { id: 'workflow-dashboard', label: 'Pipeline robots', icon: BarChart3 },
      { id: 'niche-templates', label: 'Templates par Niche', icon: Library },
      { id: 'niches', label: 'Niches Rentables', icon: Lightbulb, isLink: true, href: '/niches' },
      { id: 'complete-workflow', label: 'Lancer le workflow guidé', icon: Rocket, isPro: true },
      { id: 'focus-mode', label: 'Mode Focus / Zen', icon: Eye },
      { id: 'draft-mode', label: 'Brouillon Rapide', icon: Zap },
      { id: 'rich-editor', label: 'Éditeur Enrichi', icon: PenTool },
      { id: 'writing', label: 'Écrire les Chapitres', icon: PenTool },
      { id: 'aichat', label: 'Assistant IA', icon: Bot },
      { id: 'writing-intelligence', label: 'Assistant Intelligent', icon: Brain },
      { id: 'prompt-library', label: 'Bibliothèque Prompts', icon: Library },
      { id: 'prompt-chain-generator', label: 'Chaînes de Prompts', icon: Zap },
      { id: 'characters', label: 'Personnages', icon: Users },
      { id: 'voice', label: 'Dictée Vocale', icon: Volume2 },
      { id: 'series', label: 'Série / Saga', icon: BookCopy },
      { id: 'multi-tome-hub', label: 'Hub Multi-Tomes', icon: BookCopy },
      { id: 'series-tomes', label: 'Tomes de Séries', icon: Library, isLink: true, href: '/series-tomes' },
      { id: 'practical-sheets', label: 'Fiches Bien-être', icon: FileText, isLink: true, href: '/fiches-pratiques' },
      { id: 'travel-guide', label: 'Guide de Voyage', icon: Globe },
      { id: 'recipe-book', label: 'Livre de Recettes', icon: BookOpen },
      { id: 'aquarium-guide', label: 'Aquariophilie', icon: BookOpen },
      { id: 'bird-guide', label: 'Oiseaux', icon: BookOpen },
      { id: 'coloring-book', label: 'Livre Coloriage', icon: Palette },
      { id: 'comic-book', label: 'Bande Dessinée', icon: LayoutTemplate, isLink: true, href: '/bd-studio' },
      { id: 'diary-generator', label: 'Journal / Agenda', icon: BookHeart },
      { id: 'documentary', label: 'Documentaire', icon: BookMarked },
      { id: 'encyclopedia', label: 'Encyclopédie', icon: BookMarked },
      { id: 'atlas', label: 'Atlas', icon: Map },
      { id: 'url-import', label: 'Créer depuis URL', icon: Link },
      { id: 'doc-transform', label: 'Importer Word', icon: FileText },
    ]
  },
  {
    label: 'Optimiser',
    emoji: '⚡',
    color: 'violet',
    items: [
      { id: 'editorial-director', label: 'P1 — Zyro • Niche', icon: Crown, isPro: true },
      { id: 'market-analysis', label: 'P2 — Jano • Marché', icon: Search, isPro: true },
      { id: 'content-architect', label: 'P3 — Kiro • Plan', icon: LayoutDashboard, isPro: true },
      { id: 'expert-writing', label: 'P4 — Alia • Rédaction', icon: PenTool, isPro: true },
      { id: 'natural-rewrite', label: 'P5 — Lexo • Réécriture', icon: Sparkles, isPro: true },
      { id: 'editorial-quality', label: 'P6 — Vero • Qualité', icon: FileEdit, isPro: true },
      { id: 'editorial-packaging', label: 'P7 — Kado • Publication', icon: FileText, isPro: true },
      { id: 'final-diagnosis', label: 'P8 — Conso • Diagnostic', icon: Shield, isPro: true },
      { id: 'editorial-memory', label: 'P9 — Emio • Voix auteur', icon: Brain, isPro: true },
      { id: 'chapter-coherence', label: 'P10 — Mira • Fluidité', icon: GitBranch, isPro: true },
      { id: 'self-critique', label: 'P11 — Beto • Lecteur test', icon: Eye, isPro: true },
      { id: 'iterative-loop', label: 'P12 — Nexa • Corrections', icon: RefreshCw, isPro: true },
      { id: 'style-signature', label: 'P13 — Huma • Humaniser', icon: Fingerprint, isPro: true },
      { id: 'ultimate-verdict', label: 'P14 — Tila • Verdict', icon: Award, isPro: true },
      { id: 'humanize-anti-ia', label: 'P15 — Orin • Anti-IA', icon: Shield, isPro: true },
      { id: 'manuscript-dashboard', label: 'Dashboard Manuscrit', icon: BarChart3 },
      { id: 'readability-analyzer', label: 'Analyseur Lisibilité', icon: BookOpen },
      { id: 'chapter-word-count', label: 'Mots par Chapitre', icon: BarChart3 },
      { id: 'kindle-preview', label: 'Prévisualisation Kindle', icon: Monitor },
      { id: 'consistency-detector', label: 'Détecteur Cohérence', icon: Search },
      { id: 'rhythm-analyzer', label: 'Analyseur Rythme', icon: Activity },
      { id: 'ai-detector', label: 'Détecteur Anti-IA', icon: Shield },
      { id: 'humanizer', label: 'Humaniseur IA', icon: Shield },
      { id: 'plagiarism-validator', label: 'Anti-Plagiat', icon: Shield },
      { id: 'title-ab-test', label: 'A/B Test Titres', icon: FlaskConical },
      { id: 'beta-reader-hub', label: 'Hub Bêta-Lecteurs', icon: Users },
      { id: 'back-matter-generator', label: 'Générateur Back Matter', icon: FileText },
      { id: 'cover-design-editor', label: 'Éditeur Couverture', icon: Palette, isNew: true },
      { id: 'cover', label: 'Couverture Avant', icon: Palette },
      { id: 'ai-cover-studio', label: 'Couverture IA Pro', icon: Sparkles },
      { id: 'backcover', label: 'Couverture Arrière', icon: BookCopy },
      { id: 'kdp-cover-studio', label: 'Studio Couverture KDP', icon: Ruler },
      { id: 'images', label: 'Images Chapitres', icon: Image },
      { id: 'imagebank', label: 'Banque Images', icon: ImagePlus },
      { id: 'library', label: 'Bibliothèque d\'images', icon: FolderOpen },
      { id: 'mockup-studio', label: 'Mockup Studio', icon: Monitor },
    ]
  },
  {
    label: 'Publier',
    emoji: '📦',
    color: 'blue',
    items: [
      { id: 'export', label: 'Exporter (PDF, Word)', icon: Download },
      { id: 'advanced-export', label: 'Export Multi-Format', icon: Download },
      { id: 'workflow-export', label: 'Export Global Workflow', icon: Download },
      { id: 'export-guide', label: 'Guide Export', icon: GraduationCap },
      { id: 'pdf-reformatter', label: 'Reformateur PDF', icon: FileEdit },
      { id: 'pdf-analyzer', label: 'Analyseur PDF', icon: Ruler },
      { id: 'calibre-epub', label: 'Calibre Studio EPUB', icon: BookOpen },
      { id: 'kdp-prepublish-checklist', label: 'Checklist Pré-Publication', icon: Shield },
      { id: 'kdp-guide', label: 'Guide KDP Officiel', icon: Shield },
      { id: 'kdp-amazon-research', label: 'Recherche KDP Amazon', icon: Search },
      { id: 'niche-analysis', label: 'Analyse de Niche', icon: Search },
      { id: 'kdp-research', label: 'Recherche Niche', icon: Search },
      { id: 'competitor-dashboard', label: 'Tableau Concurrentiel', icon: Search },
      { id: 'competitor-spy', label: 'Espion Concurrentiel', icon: Eye },
      { id: 'kdp-keywords', label: 'Mots-Clés KDP Pro', icon: Search, isLink: true, href: '/kdp-keywords' },
      { id: 'kdp', label: 'Description KDP', icon: TrendingUp },
      { id: 'description-magnet', label: 'Description Magnet', icon: FileText },
      { id: 'trend-predictor', label: 'Prédicteur Tendances', icon: TrendingUp },
      { id: 'amazon-simulator', label: 'Simulateur Amazon', icon: Eye },
      { id: 'kdp-explosive', label: 'Simulateur Explosif', icon: Zap },
      { id: 'bsr-tracker', label: 'BSR Multi-Pays', icon: BarChart3 },
      { id: 'price-studio', label: 'Price Master', icon: TrendingUp },
      { id: 'audiobook', label: 'Livre Audio', icon: Headphones },
      { id: 'audio-express', label: 'Audio Express', icon: Zap },
      { id: 'video-creator', label: 'Vidéo YouTube', icon: Video },
      { id: 'audiobook-library', label: 'Mes Livres Audio', icon: Music },
      { id: 'elementor-export', label: 'Export Elementor', icon: Code },
      { id: 'formation-audiobook-distribution', label: 'Formation Distribution', icon: BookOpen },
    ]
  },
  {
    label: 'Vendre',
    emoji: '📣',
    color: 'orange',
    items: [
      { id: 'marketing', label: 'Posts Réseaux Sociaux', icon: MessageSquare },
      { id: 'seo-generator', label: 'Générateur SEO IA', icon: FileEdit, isLink: true, href: '/seo-generator' },
      { id: 'seo-articles', label: 'Articles SEO', icon: Globe },
      { id: 'amazon-ads', label: 'Amazon Ads', icon: Target },
      { id: 'launch-plan', label: 'Plan Lancement', icon: Rocket },
      { id: 'ab-testing', label: 'A/B Testing', icon: FlaskConical },
      { id: 'marketing-plan', label: 'Plan Marketing', icon: TrendingUp, isLink: true, href: '/plan-marketing' },
      { id: 'blog', label: 'Blog SEO', icon: FileText, isLink: true, href: '/blog' },
      { id: 'arc-manager', label: 'Gestionnaire ARC', icon: Users },
      { id: 'landing-page-generator', label: 'Landing Page', icon: Globe },
      { id: 'monetization', label: 'Monétisation', icon: DollarSign },
      { id: 'kdp-revenue-simulator', label: 'Simulateur Revenus KDP', icon: DollarSign },
      { id: 'royalty-dashboard', label: 'Dashboard Revenus', icon: DollarSign },
      { id: 'direct-sales', label: 'Vente Directe', icon: DollarSign },
      { id: 'planner', label: 'Planificateur Projet', icon: BookOpen },
      { id: 'publication-planner', label: 'Planificateur Publication', icon: Target },
      { id: 'editorial-calendar', label: 'Calendrier Éditorial', icon: CalendarDays },
      { id: 'ux-center', label: 'Centre Productivité', icon: Zap },
      { id: 'multi-translator', label: 'Traduction Multi-Langues', icon: Languages },
      { id: 'pen-name', label: 'Nom de Plume', icon: PenTool },
    ]
  },
  {
    label: 'Mon Compte',
    emoji: '⚙️',
    color: 'slate',
    items: [
      { id: 'ebook-library', label: 'Ma Bibliothèque', icon: Library },
      { id: 'projects', label: 'Mes Projets', icon: FolderOpen },
      { id: 'dashboard', label: 'Tableau de Bord', icon: LayoutDashboard },
      { id: 'marketing-dashboard', label: 'Dashboard Marketing', icon: TrendingUp, isLink: true, href: '/dashboard-marketing', adminOnly: true },
      { id: 'admin-panel', label: 'Gestion Abonnés', icon: Shield, isLink: true, href: '/admin', adminOnly: true },
      { id: 'crm-page', label: 'CRM', icon: Contact, isLink: true, href: '/crm', adminOnly: true },
      { id: 'email-preview', label: 'Aperçu Emails', icon: Mail, isLink: true, href: '/apercu-emails', adminOnly: true },
      { id: 'prospect-manager', label: 'Prospects & Emails', icon: Target, isLink: true, href: '/gestion-prospects', adminOnly: true },
      { id: 'social-marketing', label: 'Suite Marketing', icon: BarChart3, isLink: true, href: '/generateur-posts', adminOnly: true },
      { id: 'subscription', label: 'Abonnement', icon: CreditCard },
      { id: 'parrainage', label: 'Parrainage', icon: Users, isLink: true, href: '/parrainage' },
      { id: 'communaute', label: 'Communauté', icon: MessageSquare, isLink: true, href: '/communaute' },
      { id: 'settings', label: 'Paramètres', icon: Settings },
      { id: 'formation-complete', label: 'Formation', icon: GraduationCap, isLink: true, href: '/formation' },
      { id: 'formation-videos', label: 'Formation Vidéo', icon: GraduationCap, isLink: true, href: '/formation-videos' },
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

// ─── Color map for category theming ───
const colorMap: Record<string, { bg: string; bgActive: string; border: string; text: string; icon: string; iconBg: string; dot: string }> = {
  emerald: {
    bg: 'bg-emerald-500/10',
    bgActive: 'bg-gradient-to-r from-emerald-500/15 to-emerald-400/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    icon: 'text-emerald-300',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    dot: 'bg-emerald-400',
  },
  violet: {
    bg: 'bg-violet-500/10',
    bgActive: 'bg-gradient-to-r from-violet-500/15 to-violet-400/10',
    border: 'border-violet-500/30',
    text: 'text-violet-400',
    icon: 'text-violet-300',
    iconBg: 'bg-gradient-to-br from-violet-500 to-violet-600',
    dot: 'bg-violet-400',
  },
  blue: {
    bg: 'bg-blue-500/10',
    bgActive: 'bg-gradient-to-r from-blue-500/15 to-blue-400/10',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    icon: 'text-blue-300',
    iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
    dot: 'bg-blue-400',
  },
  orange: {
    bg: 'bg-orange-500/10',
    bgActive: 'bg-gradient-to-r from-orange-500/15 to-orange-400/10',
    border: 'border-orange-500/30',
    text: 'text-orange-400',
    icon: 'text-orange-300',
    iconBg: 'bg-gradient-to-br from-orange-500 to-orange-600',
    dot: 'bg-orange-400',
  },
  slate: {
    bg: 'bg-slate-500/10',
    bgActive: 'bg-gradient-to-r from-slate-500/15 to-slate-400/10',
    border: 'border-slate-500/30',
    text: 'text-slate-400',
    icon: 'text-slate-300',
    iconBg: 'bg-gradient-to-br from-slate-500 to-slate-600',
    dot: 'bg-slate-400',
  },
};

// ─── Single menu item renderer ───
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
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left group",
        isActive
          ? cn(colors.bgActive, "border", colors.border, "shadow-sm")
          : "hover:bg-card/80"
      )}
    >
      <div className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all",
        isActive
          ? cn(colors.iconBg, "shadow-sm")
          : "bg-muted/50 group-hover:bg-muted"
      )}>
        <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-muted-foreground")} />
      </div>
      <span className={cn(
        "text-sm font-medium flex-1",
        isActive ? cn("font-semibold", colors.text) : "text-muted-foreground"
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
  onToggleCollapse
}) => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  // Admin check
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

  // Filter items based on admin role
  const filterAdmin = (item: MenuItem) => {
    if (item.adminOnly && !isAdmin) return false;
    return true;
  };

  // Auto-expand the group containing the active tab
  React.useEffect(() => {
    for (const group of allToolGroups) {
      if (group.items.some(i => i.id === activeTab)) {
        setExpandedGroups(prev => prev.includes(group.label) ? prev : [...prev, group.label]);
        break;
      }
    }
  }, [activeTab]);

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return allToolGroups
      .flatMap(g => g.items)
      .filter(filterAdmin)
      .filter(item => item.label.toLowerCase().includes(q) || item.id.toLowerCase().includes(q))
      .slice(0, 15);
  }, [searchQuery, isAdmin]);

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

        {/* Search (always visible when expanded) */}
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

        {/* Main navigation area */}
        <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-1">

          {/* ── Search results ── */}
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
            <div className="space-y-3">
              {!isCollapsed && (
                <div className="rounded-2xl border border-border bg-card/80 p-2.5 shadow-sm">
                  <div className="flex items-center justify-between gap-3 px-1 pb-2">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Démarrage rapide
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        5 robots pour créer ton ebook
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onTabChange('workflow-dashboard')}
                      className="text-xs font-semibold text-primary transition-opacity hover:opacity-80"
                    >
                      Voir le pipeline
                    </button>
                  </div>

                  <div className="space-y-1">
                    {starterWorkflowAgents.map(item => (
                      <MenuItemButton
                        key={item.id}
                        item={item}
                        isActive={activeTab === item.id}
                        onClick={() => handleItemClick(item)}
                        isCollapsed={false}
                        groupColor="blue"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
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
                          {group.label} ({visibleItems.length})
                        </TooltipContent>
                      </Tooltip>
                    );
                  }

                  return (
                    <div key={group.label} className="rounded-xl overflow-hidden">
                      <button
                        onClick={() => toggleGroup(group.label)}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all",
                          hasActive ? colors.bg : "hover:bg-card/60"
                        )}
                      >
                        <span className="flex items-center gap-2.5">
                          <span className={cn(
                            "w-7 h-7 rounded-lg flex items-center justify-center text-sm",
                            isExpanded || hasActive ? colors.iconBg : "bg-muted/50"
                          )}>
                            <span className="text-white text-xs">{group.emoji}</span>
                          </span>
                          <span className={cn(
                            "text-sm font-semibold",
                            hasActive ? colors.text : "text-foreground"
                          )}>
                            {group.label}
                          </span>
                          <span className={cn(
                            "text-[10px] font-medium px-1.5 py-0.5 rounded-full",
                            colors.bg, colors.text
                          )}>
                            {visibleItems.length}
                          </span>
                        </span>
                        <ChevronDown className={cn(
                          "w-3.5 h-3.5 transition-transform duration-200",
                          isExpanded ? "rotate-0" : "-rotate-90",
                          hasActive ? colors.text : "text-muted-foreground"
                        )} />
                      </button>
                      {isExpanded && (
                        <div className={cn("pl-1 pr-1 pb-1 space-y-0.5 mt-0.5 ml-2 border-l-2", colors.border)}>
                          {visibleItems.map(item => (
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
            </div>
          )}
        </nav>

        {/* Quota */}
        <div className="border-t border-border">
          <QuotaDisplay isCollapsed={isCollapsed} />
        </div>

        {/* Install App */}
        <div className="px-3 py-2 border-t border-border">
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/install')}
                  className="w-full h-10 rounded-xl hover:bg-amber-500/10"
                >
                  <Smartphone className="w-5 h-5 text-amber-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Installer l'App Mobile</TooltipContent>
            </Tooltip>
          ) : (
            <Button
              onClick={() => navigate('/install')}
              className="w-full h-10 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 hover:from-amber-600 hover:via-yellow-600 hover:to-orange-600 text-white font-semibold shadow-md shadow-amber-500/20 gap-2"
            >
              <Smartphone className="w-4 h-4" />
              Installer l'App Mobile
            </Button>
          )}
        </div>

        {/* Footer */}
        <div className="p-2 border-t border-border flex gap-1">
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
