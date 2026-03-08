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
  Star,
  Lightbulb,
  Video,
  FlaskConical,
  Languages,
  Info,
  BarChart3,
  Ruler,
  Monitor,
  Library,
  Music,
  CalendarDays
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

// Couleurs pastels par catégorie (light / dark)
const categoryPastelColors: Record<string, { bg: string; border: string }> = {
  start: { bg: 'bg-violet-50 dark:bg-violet-950/30', border: 'border-violet-200/60 dark:border-violet-800/40' },
  redaction: { bg: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-200/60 dark:border-blue-800/40' },
  series: { bg: 'bg-indigo-50 dark:bg-indigo-950/30', border: 'border-indigo-200/60 dark:border-indigo-800/40' },
  workflow: { bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-200/60 dark:border-amber-800/40' },
  quality: { bg: 'bg-emerald-50 dark:bg-emerald-950/30', border: 'border-emerald-200/60 dark:border-emerald-800/40' },
  export: { bg: 'bg-orange-50 dark:bg-orange-950/30', border: 'border-orange-200/60 dark:border-orange-800/40' },
  research: { bg: 'bg-cyan-50 dark:bg-cyan-950/30', border: 'border-cyan-200/60 dark:border-cyan-800/40' },
  visuels: { bg: 'bg-teal-50 dark:bg-teal-950/30', border: 'border-teal-200/60 dark:border-teal-800/40' },
  special: { bg: 'bg-pink-50 dark:bg-pink-950/30', border: 'border-pink-200/60 dark:border-pink-800/40' },
  'marketing-cat': { bg: 'bg-green-50 dark:bg-green-950/30', border: 'border-green-200/60 dark:border-green-800/40' },
  productivity: { bg: 'bg-fuchsia-50 dark:bg-fuchsia-950/30', border: 'border-fuchsia-200/60 dark:border-fuchsia-800/40' },
  audio: { bg: 'bg-indigo-50 dark:bg-indigo-950/30', border: 'border-indigo-200/60 dark:border-indigo-800/40' },
  bibliotheque: { bg: 'bg-emerald-50 dark:bg-emerald-950/30', border: 'border-emerald-200/60 dark:border-emerald-800/40' },
  compte: { bg: 'bg-slate-50 dark:bg-slate-950/30', border: 'border-slate-200/60 dark:border-slate-800/40' },
};

const categories: Category[] = [
  // ========== 1. DÉMARRAGE ==========
  {
    id: 'start',
    label: 'Démarrage',
    emoji: '🚀',
    color: 'from-violet-500 to-purple-500',
    items: [
      { id: 'presentation', label: 'Découvrir KDP Studio', icon: Info },
      { id: 'global-dashboard', label: 'Vue d\'ensemble', icon: LayoutDashboard, isNew: true },
      { id: 'onboarding', label: 'Par où commencer ?', icon: BookOpen },
      { id: 'complete-workflow', label: 'Créer un livre (1 clic)', icon: Rocket, isPro: true },
      { id: 'workflow-dashboard', label: 'Tableau de Bord', icon: BarChart3 },
      { id: 'niche-templates', label: 'Templates par Niche', icon: Library, isNew: true },
      { id: 'niches', label: 'Niches Rentables', icon: Lightbulb, isLink: true, href: '/niches' },
    ]
  },
  // ========== 2. RÉDACTION ==========
  {
    id: 'redaction',
    label: 'Rédaction',
    emoji: '✍️',
    color: 'from-blue-500 to-indigo-500',
    items: [
      { id: 'focus-mode', label: 'Mode Focus / Zen', icon: Eye, isNew: true },
      { id: 'draft-mode', label: 'Brouillon Rapide', icon: Zap },
      { id: 'rich-editor', label: 'Éditeur Enrichi', icon: PenTool },
      { id: 'writing', label: 'Écrire les Chapitres', icon: PenTool },
      { id: 'aichat', label: 'Assistant IA', icon: Bot },
      { id: 'writing-intelligence', label: 'Assistant Intelligent', icon: Brain },
      { id: 'prompt-library', label: 'Bibliothèque Prompts', icon: Library },
      { id: 'prompt-chain-generator', label: 'Chaînes de Prompts', icon: Zap },
      { id: 'characters', label: 'Personnages', icon: Users },
      { id: 'voice', label: 'Dictée Vocale', icon: Volume2 },
    ]
  },
  // ========== 3. SÉRIES & TOMES ==========
  {
    id: 'series',
    label: 'Séries & Tomes',
    emoji: '📚',
    color: 'from-indigo-500 to-blue-500',
    items: [
      { id: 'series', label: 'Série / Saga', icon: BookCopy },
      { id: 'multi-tome-hub', label: 'Hub Multi-Tomes', icon: BookCopy },
      { id: 'series-tomes', label: 'Tomes de Séries', icon: Library, isLink: true, href: '/series-tomes' },
    ]
  },
  // ========== 4. WORKFLOW IA (P1-P15) ==========
  {
    id: 'workflow',
    label: 'Workflow IA (P1-P15)',
    emoji: '⚡',
    color: 'from-amber-500 to-orange-500',
    items: [
      { id: 'editorial-director', label: 'P1 — Directeur Éditorial', icon: Crown, isPro: true },
      { id: 'market-analysis', label: 'P2 — Analyse Marché', icon: Search, isPro: true },
      { id: 'content-architect', label: 'P3 — Architecte', icon: LayoutDashboard, isPro: true },
      { id: 'expert-writing', label: 'P4 — Rédaction Expert', icon: PenTool, isPro: true },
      { id: 'natural-rewrite', label: 'P5 — Réécriture', icon: Sparkles, isPro: true },
      { id: 'editorial-quality', label: 'P6 — Qualité', icon: FileEdit, isPro: true },
      { id: 'editorial-packaging', label: 'P7 — Packaging', icon: FileText, isPro: true },
      { id: 'final-diagnosis', label: 'P8 — Diagnostic', icon: Shield, isPro: true },
      { id: 'editorial-memory', label: 'P9 — Mémoire', icon: Brain, isPro: true },
      { id: 'chapter-coherence', label: 'P10 — Cohérence', icon: GitBranch, isPro: true },
      { id: 'self-critique', label: 'P11 — Critique', icon: Eye, isPro: true },
      { id: 'iterative-loop', label: 'P12 — Boucle', icon: RefreshCw, isPro: true },
      { id: 'style-signature', label: 'P13 — Style', icon: Fingerprint, isPro: true },
      { id: 'ultimate-verdict', label: 'P14 — Verdict', icon: Award, isPro: true },
      { id: 'humanize-anti-ia', label: 'P15 — Humanisation Anti-IA', icon: Shield, isPro: true },
    ]
  },
  // ========== 5. QUALITÉ & RELECTURE ==========
  {
    id: 'quality',
    label: 'Qualité & Relecture',
    emoji: '✅',
    color: 'from-emerald-500 to-green-500',
    items: [
      { id: 'manuscript-dashboard', label: 'Dashboard Manuscrit', icon: BarChart3 },
      { id: 'ai-detector', label: 'Détecteur Anti-IA', icon: Shield },
      { id: 'humanizer', label: 'Humaniseur IA', icon: Shield },
      { id: 'plagiarism-validator', label: 'Anti-Plagiat', icon: Shield },
      { id: 'title-ab-test', label: 'A/B Test Titres', icon: FlaskConical, isNew: true },
      { id: 'beta-reader-hub', label: 'Hub Bêta-Lecteurs', icon: Users },
      { id: 'back-matter-generator', label: 'Générateur Back Matter', icon: FileText, isNew: true },
    ]
  },
  // ========== 6. EXPORT & PUBLICATION ==========
  {
    id: 'export',
    label: 'Export & Publication',
    emoji: '📦',
    color: 'from-orange-500 to-red-500',
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
    ]
  },
  // ========== 7. RECHERCHE & MARCHÉ ==========
  {
    id: 'research',
    label: 'Recherche & Marché',
    emoji: '🔍',
    color: 'from-cyan-500 to-teal-500',
    items: [
      { id: 'niche-analysis', label: 'Analyse de Niche', icon: Search },
      { id: 'kdp-research', label: 'Recherche Niche', icon: Search },
      { id: 'competitor-dashboard', label: 'Tableau Concurrentiel', icon: Search },
      { id: 'competitor-spy', label: 'Espion Concurrentiel', icon: Eye, isNew: true },
      { id: 'kdp-keywords', label: 'Mots-Clés KDP Pro', icon: Search, isLink: true, href: '/kdp-keywords' },
      { id: 'kdp', label: 'Description KDP', icon: TrendingUp },
      { id: 'description-magnet', label: 'Description Magnet', icon: FileText },
      { id: 'trend-predictor', label: 'Prédicteur Tendances', icon: TrendingUp },
      { id: 'amazon-simulator', label: 'Simulateur Amazon', icon: Eye },
      { id: 'kdp-explosive', label: 'Simulateur Explosif', icon: Zap },
      { id: 'bsr-tracker', label: 'BSR Multi-Pays', icon: BarChart3 },
      { id: 'price-studio', label: 'Price Master', icon: TrendingUp },
    ]
  },
  // ========== 8. VISUELS & COUVERTURES ==========
  {
    id: 'visuels',
    label: 'Visuels & Couvertures',
    emoji: '🖼️',
    color: 'from-teal-500 to-cyan-500',
    items: [
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
  // ========== 9. LIVRES SPÉCIAUX ==========
  {
    id: 'special',
    label: 'Livres Spéciaux',
    emoji: '🎨',
    color: 'from-pink-500 to-rose-500',
    items: [
      { id: 'practical-sheets', label: 'Fiches Bien-être & Santé', icon: FileText, isLink: true, href: '/fiches-pratiques' },
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
  // ========== 10. MARKETING & VENTES ==========
  {
    id: 'marketing-cat',
    label: 'Marketing & Ventes',
    emoji: '📣',
    color: 'from-green-500 to-emerald-500',
    items: [
      { id: 'marketing', label: 'Posts Réseaux Sociaux', icon: MessageSquare },
      { id: 'seo-generator', label: 'Générateur SEO IA', icon: FileEdit, isLink: true, href: '/seo-generator' },
      { id: 'seo-articles', label: 'Articles SEO', icon: Globe },
      { id: 'amazon-ads', label: 'Amazon Ads', icon: Target },
      { id: 'launch-plan', label: 'Plan Lancement', icon: Rocket },
      { id: 'ab-testing', label: 'A/B Testing', icon: FlaskConical },
      { id: 'marketing-plan', label: 'Plan Marketing', icon: TrendingUp, isLink: true, href: '/plan-marketing' },
      { id: 'blog', label: 'Blog SEO', icon: FileText, isLink: true, href: '/blog' },
      { id: 'monetization', label: 'Monétisation', icon: DollarSign },
      { id: 'royalty-dashboard', label: 'Dashboard Revenus', icon: DollarSign },
      { id: 'direct-sales', label: 'Vente Directe', icon: DollarSign },
      { id: 'arc-manager', label: 'Gestionnaire ARC', icon: Users },
    ]
  },
  // ========== 11. PRODUCTIVITÉ ==========
  {
    id: 'productivity',
    label: 'Productivité',
    emoji: '⚡',
    color: 'from-fuchsia-500 to-purple-500',
    items: [
      { id: 'planner', label: 'Planificateur Projet', icon: BookOpen },
      { id: 'publication-planner', label: 'Planificateur Publication', icon: Target },
      { id: 'editorial-calendar', label: 'Calendrier Éditorial', icon: CalendarDays, isNew: true },
      { id: 'ux-center', label: 'Centre Productivité', icon: Zap },
      { id: 'multi-translator', label: 'Traduction Multi-Langues', icon: Languages },
      { id: 'pen-name', label: 'Nom de Plume', icon: PenTool },
    ]
  },
  // ========== 12. AUDIO ==========
  {
    id: 'audio',
    label: 'Audio',
    emoji: '🎧',
    color: 'from-indigo-500 to-violet-500',
    items: [
      { id: 'audiobook', label: 'Livre Audio', icon: Headphones },
      { id: 'audio-express', label: 'Audio Express', icon: Zap },
      { id: 'audiobook-library', label: 'Mes Livres Audio', icon: Music },
      { id: 'formation-audiobook-distribution', label: 'Formation Distribution', icon: BookOpen },
    ]
  },
  // ========== 13. BIBLIOTHÈQUE ==========
  {
    id: 'bibliotheque',
    label: 'Bibliothèque',
    emoji: '📚',
    color: 'from-emerald-500 to-green-500',
    items: [
      { id: 'ebook-library', label: 'Ma Bibliothèque', icon: Library },
      { id: 'projects', label: 'Mes Projets', icon: FolderOpen },
    ]
  },
  // ========== 14. MON COMPTE ==========
  {
    id: 'compte',
    label: 'Mon Compte',
    emoji: '⚙️',
    color: 'from-gray-500 to-slate-500',
    items: [
      { id: 'dashboard', label: 'Tableau de Bord', icon: LayoutDashboard },
      { id: 'marketing-dashboard', label: 'Dashboard Marketing', icon: TrendingUp, isLink: true, href: '/dashboard-marketing' },
      { id: 'admin-panel', label: 'Gestion Abonnés', icon: Shield, isLink: true, href: '/admin' },
      { id: 'prospect-manager', label: 'Prospects & Emails', icon: Target, isLink: true, href: '/gestion-prospects' },
      { id: 'social-marketing', label: 'Suite Marketing', icon: BarChart3, isLink: true, href: '/generateur-posts' },
      { id: 'subscription', label: 'Abonnement', icon: CreditCard },
      { id: 'parrainage', label: 'Parrainage', icon: Users, isLink: true, href: '/parrainage' },
      { id: 'communaute', label: 'Communauté', icon: MessageSquare, isLink: true, href: '/communaute' },
      { id: 'settings', label: 'Paramètres', icon: Settings },
      { id: 'formation-complete', label: 'Formation', icon: GraduationCap, isLink: true, href: '/formation' },
      { id: 'formation-videos', label: 'Formation Vidéo', icon: GraduationCap, isLink: true, href: '/formation-videos' },
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
            "bg-gradient-gold text-slate-900 hover:opacity-90 shadow-lg shadow-gold/25",
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
        <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-gold" />
              <span className="text-xs font-semibold text-white">Mon Plan</span>
            </div>
            <span className={cn(
              "text-[10px] font-bold px-2 py-0.5 rounded-full",
              quotas.plan === 'lifetime' ? 'bg-gold text-slate-900' :
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

export const ModernSidebar: React.FC<ModernSidebarProps> = ({
  activeTab,
  onTabChange,
  isCollapsed,
  onToggleCollapse
}) => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  // Check admin status
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem('is_admin') === 'true');
  
  React.useEffect(() => {
    const checkAdmin = () => setIsAdmin(sessionStorage.getItem('is_admin') === 'true');
    window.addEventListener('storage', checkAdmin);
    return () => window.removeEventListener('storage', checkAdmin);
  }, []);

  // Filtrer les items par recherche et par rôle
  const filteredCategories = useMemo(() => {
    let cats = categories.map(cat => ({
      ...cat,
      items: cat.items.filter(item => {
        // Hide admin-only items for non-admins
        if (item.id === 'admin-panel' && !isAdmin) return false;
        return true;
      })
    }));
    
    if (!searchQuery.trim()) return cats;
    
    const query = searchQuery.toLowerCase();
    return cats.map(cat => ({
      ...cat,
      items: cat.items.filter(item => 
        item.label.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query)
      )
    })).filter(cat => cat.items.length > 0);
  }, [searchQuery, isAdmin]);

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
          "bg-slate-950 border-r border-slate-800/50",
          isCollapsed ? "w-[72px]" : "w-72"
        )}
      >
        {/* Header */}
        <div className={cn(
          "flex items-center gap-3 p-4 border-b border-slate-800/50",
          isCollapsed && "justify-center p-3"
        )}>
          <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center shadow-lg shadow-gold">
            <Sparkles className="w-5 h-5 text-slate-900" />
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
                className="h-9 w-9 rounded-xl hover:bg-slate-800/50"
              >
                {isDark ? (
                  <Sun className="w-4 h-4 text-amber-500" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-400" />
                )}
              </Button>
            </>
          )}
        </div>

        {/* Recherche */}
        {!isCollapsed && (
          <div className="p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                type="text"
                placeholder="Rechercher un outil..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-8 h-10 text-sm bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-600 rounded-xl focus:border-gold/50 focus:ring-gold/20"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-800"
                >
                  <X className="w-3 h-3 text-slate-500" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
          {filteredCategories.map((category, catIndex) => {
            const isExpanded = expandedCategories.includes(category.id);
            const hasActiveItem = category.items.some(item => item.id === activeTab);

            // Séparateur "Outils complémentaires" avant les catégories secondaires
            const secondaryIds = ['visuels', 'special', 'marketing-cat', 'tools-2026', 'audio', 'compte'];
            const isFirstSecondary = secondaryIds.includes(category.id) && 
              (catIndex === 0 || !secondaryIds.includes(filteredCategories[catIndex - 1]?.id));
            
            return (
              <React.Fragment key={category.id}>
                {isFirstSecondary && !isCollapsed && (
                   <div className="mx-1 my-3 px-3 py-2.5 rounded-xl bg-gradient-gold-subtle border border-gold/20">
                    <div className="flex items-center gap-2 justify-center">
                      <div className="h-0.5 w-6 rounded-full bg-gold/40" />
                      <span className="text-xs font-bold uppercase tracking-widest text-gold">
                        ⚙️ Outils complémentaires
                      </span>
                      <div className="h-0.5 w-6 rounded-full bg-gold/40" />
                    </div>
                  </div>
                )}
                {isFirstSecondary && isCollapsed && (
                  <div className="flex justify-center py-3">
                    <div className="w-8 h-0.5 rounded-full bg-slate-400/60 dark:bg-slate-600/60" />
                  </div>
                )}
              <div 
                key={category.id} 
                className={cn(
                  "mb-3 rounded-2xl border transition-all",
                  hasActiveItem 
                    ? "border-gold/30 bg-slate-900/50 shadow-lg shadow-gold/5" 
                    : "border-slate-800/50 bg-slate-900/30 hover:bg-slate-900/50 hover:shadow-md",
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
                        : "hover:bg-slate-800/50"
                    )}
                  >
                    <span className={cn(
                      "text-sm font-semibold",
                      hasActiveItem ? "text-white" : "text-slate-300"
                    )}>
                      {category.label}
                    </span>
                    <ChevronDown className={cn(
                      "w-4 h-4 transition-transform",
                      hasActiveItem ? "text-white/80" : "text-slate-500",
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
                          : "hover:bg-slate-800/50"
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
                              item.label.includes('DÉBUTER ICI') && !isActive
                                ? "bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 ring-1 ring-cyan-500/20"
                                : isActive 
                                  ? "bg-slate-800 shadow-md border border-slate-700" 
                                  : "hover:bg-slate-800/50"
                            )}
                          >
                            <div className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                              isActive 
                                ? `bg-gradient-to-br ${category.color} shadow-sm` 
                                : "bg-slate-800/80 group-hover:bg-slate-700/80"
                            )}>
                              <Icon className={cn(
                                "w-4 h-4",
                                isActive ? "text-white" : "text-slate-400"
                              )} />
                            </div>
                            <span className={cn(
                              "text-sm font-medium flex-1",
                              isActive ? "text-white" : "text-slate-400"
                            )}>
                              {item.label}
                            </span>
                            
                            {item.isNew && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-gradient-to-r from-amber-400 to-orange-500 text-white">
                                NEW
                              </span>
                            )}
                            
                            {item.isPro && !item.isNew && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-cyan-500 text-slate-900 font-bold">
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
              </React.Fragment>
            );
          })}
        </nav>

        {/* Quota */}
        <div className="border-t border-slate-800/50">
          <QuotaDisplay isCollapsed={isCollapsed} />
        </div>

        {/* Footer */}
        <div className="p-2 border-t border-slate-800/50 flex gap-1">
          {isCollapsed && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="flex-1 h-10 rounded-xl hover:bg-slate-800/50"
                >
                  {isDark ? (
                    <Sun className="w-4 h-4 text-amber-500" />
                  ) : (
                    <Moon className="w-4 h-4 text-slate-400" />
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
              "h-10 flex items-center gap-2 rounded-xl hover:bg-slate-800/50",
              isCollapsed ? "flex-1 justify-center" : "w-full"
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-slate-500" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4 text-slate-500" />
                <span className="text-xs text-slate-500">Réduire le menu</span>
              </>
            )}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  );
};

export default ModernSidebar;
