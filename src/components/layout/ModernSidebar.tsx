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
  Target,
  Star,
  Clock
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
  bgColor: string;
  activeGradient: string;
  isLink?: boolean;
  href?: string;
  isNew2026?: boolean;
  isPremium?: boolean;
  promptNumber?: number;
}

interface Category {
  id: string;
  label: string;
  icon: string;
  color: string;
  items: MenuItem[];
  isPremiumCategory?: boolean;
}

const categories: Category[] = [
  {
    id: 'quick-actions',
    label: '⚡ Actions Rapides',
    icon: '⚡',
    color: 'from-violet-500 to-purple-600',
    isPremiumCategory: true,
    items: [
      { id: 'complete-workflow', label: 'Générer Livre Complet', icon: Rocket, color: 'text-orange-500', bgColor: 'bg-gradient-to-r from-orange-500/20 to-amber-500/20', activeGradient: 'from-orange-500 via-amber-500 to-yellow-500', isPremium: true, isNew2026: true },
      { id: 'comic-book', label: 'Bande Dessinée', icon: LayoutTemplate, color: 'text-amber-500', bgColor: 'bg-amber-500/15', activeGradient: 'from-amber-500 to-orange-500', isPremium: true, isNew2026: true },
      { id: 'coloring-book', label: 'Livre Coloriage', icon: Palette, color: 'text-pink-500', bgColor: 'bg-pink-500/15', activeGradient: 'from-pink-500 to-rose-500', isPremium: true, isNew2026: true },
      { id: 'documentary', label: 'Documentaires', icon: BookMarked, color: 'text-blue-500', bgColor: 'bg-blue-500/15', activeGradient: 'from-blue-500 to-indigo-500', isPremium: true, isNew2026: true },
      { id: 'diary-generator', label: 'Agendas & Journaux', icon: BookHeart, color: 'text-rose-500', bgColor: 'bg-rose-500/15', activeGradient: 'from-rose-500 to-pink-500', isPremium: true, isNew2026: true },
    ]
  },
  {
    id: 'workflow-ia',
    label: 'Workflow Éditorial',
    icon: '🚀',
    color: 'from-amber-400 to-orange-500',
    isPremiumCategory: true,
    items: [
      { id: 'editorial-director', label: 'P1. Directeur Éditorial', icon: Crown, color: 'text-amber-500', bgColor: 'bg-amber-500/10', activeGradient: 'from-amber-400 to-orange-500', isPremium: true, promptNumber: 1 },
      { id: 'market-analysis', label: 'P2. Analyse Marché', icon: Search, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10', activeGradient: 'from-emerald-400 to-teal-500', isPremium: true, promptNumber: 2 },
      { id: 'content-architect', label: 'P3. Architecte Contenu', icon: LayoutDashboard, color: 'text-violet-500', bgColor: 'bg-violet-500/10', activeGradient: 'from-violet-400 to-purple-500', isPremium: true, promptNumber: 3 },
      { id: 'expert-writing', label: 'P4. Rédaction Experte', icon: PenTool, color: 'text-blue-500', bgColor: 'bg-blue-500/10', activeGradient: 'from-blue-400 to-cyan-500', isPremium: true, promptNumber: 4 },
      { id: 'natural-rewrite', label: 'P5. Réécriture', icon: Sparkles, color: 'text-pink-500', bgColor: 'bg-pink-500/10', activeGradient: 'from-pink-400 to-rose-500', isPremium: true, promptNumber: 5 },
      { id: 'editorial-quality', label: 'P6. Qualité', icon: FileEdit, color: 'text-teal-500', bgColor: 'bg-teal-500/10', activeGradient: 'from-teal-400 to-cyan-500', isPremium: true, promptNumber: 6 },
      { id: 'editorial-packaging', label: 'P7. Packaging', icon: FileText, color: 'text-green-500', bgColor: 'bg-green-500/10', activeGradient: 'from-green-400 to-emerald-500', isPremium: true, promptNumber: 7 },
      { id: 'final-diagnosis', label: 'P8. Diagnostic', icon: Shield, color: 'text-purple-500', bgColor: 'bg-purple-500/10', activeGradient: 'from-purple-400 to-fuchsia-500', isPremium: true, promptNumber: 8 },
    ]
  },
  {
    id: 'moteur-v2',
    label: 'Moteur IA V2',
    icon: '🧬',
    color: 'from-purple-400 to-violet-600',
    isPremiumCategory: true,
    items: [
      { id: 'editorial-memory', label: 'P9. Mémoire', icon: Brain, color: 'text-purple-500', bgColor: 'bg-purple-500/10', activeGradient: 'from-purple-400 to-violet-500', isPremium: true, promptNumber: 9 },
      { id: 'chapter-coherence', label: 'P10. Cohérence', icon: GitBranch, color: 'text-indigo-500', bgColor: 'bg-indigo-500/10', activeGradient: 'from-indigo-400 to-blue-500', isPremium: true, promptNumber: 10 },
      { id: 'self-critique', label: 'P11. Auto-Critique', icon: Eye, color: 'text-rose-500', bgColor: 'bg-rose-500/10', activeGradient: 'from-rose-400 to-pink-500', isPremium: true, promptNumber: 11 },
      { id: 'iterative-loop', label: 'P12. Amélioration', icon: RefreshCw, color: 'text-cyan-500', bgColor: 'bg-cyan-500/10', activeGradient: 'from-cyan-400 to-teal-500', isPremium: true, promptNumber: 12 },
      { id: 'style-signature', label: 'P13. Style', icon: Fingerprint, color: 'text-amber-500', bgColor: 'bg-amber-500/10', activeGradient: 'from-amber-400 to-orange-500', isPremium: true, promptNumber: 13 },
      { id: 'ultimate-verdict', label: 'P14. Verdict', icon: Award, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10', activeGradient: 'from-yellow-400 to-amber-500', isPremium: true, promptNumber: 14 },
    ]
  },
  {
    id: 'creation',
    label: 'Création',
    icon: '✍️',
    color: 'from-fuchsia-500 to-pink-500',
    items: [
      { id: 'url-import', label: 'Import URL', icon: Link, color: 'text-violet-500', bgColor: 'bg-violet-500/10', activeGradient: 'from-violet-500 to-purple-500', isNew2026: true },
      { id: 'doc-transform', label: 'Import Word', icon: FileText, color: 'text-blue-500', bgColor: 'bg-blue-500/10', activeGradient: 'from-blue-500 to-cyan-500', isNew2026: true },
      { id: 'planner', label: 'Planificateur', icon: BookOpen, color: 'text-fuchsia-500', bgColor: 'bg-fuchsia-500/10', activeGradient: 'from-fuchsia-500 to-pink-500' },
      { id: 'writing', label: 'Rédaction', icon: PenTool, color: 'text-blue-500', bgColor: 'bg-blue-500/10', activeGradient: 'from-blue-500 to-cyan-500' },
      { id: 'aichat', label: 'Chat IA', icon: Bot, color: 'text-orange-500', bgColor: 'bg-orange-500/10', activeGradient: 'from-orange-500 to-amber-500' },
      { id: 'characters', label: 'Personnages', icon: Users, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10', activeGradient: 'from-emerald-500 to-teal-500' },
      { id: 'encyclopedia', label: 'Encyclopédie', icon: BookMarked, color: 'text-amber-500', bgColor: 'bg-amber-500/10', activeGradient: 'from-amber-500 to-orange-500' },
      { id: 'atlas', label: 'Atlas', icon: Map, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10', activeGradient: 'from-emerald-500 to-teal-500' },
      { id: 'series', label: 'Série / Saga', icon: BookCopy, color: 'text-indigo-500', bgColor: 'bg-indigo-500/10', activeGradient: 'from-indigo-500 to-purple-500' },
    ]
  },
  {
    id: 'visuels',
    label: 'Visuels',
    icon: '🎨',
    color: 'from-rose-500 to-orange-500',
    items: [
      { id: 'cover', label: 'Couverture', icon: Palette, color: 'text-rose-500', bgColor: 'bg-rose-500/10', activeGradient: 'from-rose-500 to-red-500' },
      { id: 'backcover', label: '4e Couverture', icon: BookCopy, color: 'text-red-500', bgColor: 'bg-red-500/10', activeGradient: 'from-red-500 to-rose-500' },
      { id: 'images', label: 'Images IA', icon: Image, color: 'text-amber-500', bgColor: 'bg-amber-500/10', activeGradient: 'from-amber-500 to-orange-500' },
      { id: 'imagebank', label: 'Banque Images', icon: ImagePlus, color: 'text-lime-500', bgColor: 'bg-lime-500/10', activeGradient: 'from-lime-500 to-green-500' },
    ]
  },
  {
    id: 'publication',
    label: 'Publication',
    icon: '📤',
    color: 'from-teal-500 to-cyan-500',
    items: [
      { id: 'kdp-research', label: 'Recherche KDP', icon: Search, color: 'text-amber-500', bgColor: 'bg-amber-500/10', activeGradient: 'from-amber-500 to-orange-500', isNew2026: true },
      { id: 'amazon-simulator', label: 'Simulateur Amazon', icon: Eye, color: 'text-orange-500', bgColor: 'bg-orange-500/10', activeGradient: 'from-orange-500 to-amber-500', isNew2026: true },
      { id: 'plagiarism-validator', label: 'Anti-Plagiat', icon: Shield, color: 'text-red-500', bgColor: 'bg-red-500/10', activeGradient: 'from-red-500 to-rose-500', isNew2026: true },
      { id: 'export', label: 'Exporter', icon: Download, color: 'text-teal-500', bgColor: 'bg-teal-500/10', activeGradient: 'from-teal-500 to-cyan-500' },
      { id: 'kdp', label: 'Amazon KDP', icon: TrendingUp, color: 'text-sky-500', bgColor: 'bg-sky-500/10', activeGradient: 'from-sky-500 to-blue-500' },
    ]
  },
  {
    id: 'marketing',
    label: 'Marketing',
    icon: '💰',
    color: 'from-green-500 to-emerald-500',
    items: [
      { id: 'amazon-ads', label: 'Amazon Ads', icon: Target, color: 'text-orange-500', bgColor: 'bg-orange-500/10', activeGradient: 'from-orange-500 to-amber-500', isNew2026: true },
      { id: 'launch-plan', label: 'Plan Lancement', icon: Rocket, color: 'text-violet-500', bgColor: 'bg-violet-500/10', activeGradient: 'from-violet-500 to-purple-500', isNew2026: true },
      { id: 'seo-articles', label: 'Articles SEO', icon: Globe, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10', activeGradient: 'from-emerald-500 to-teal-500', isNew2026: true },
      { id: 'marketing', label: 'Marketing', icon: MessageSquare, color: 'text-pink-500', bgColor: 'bg-pink-500/10', activeGradient: 'from-pink-500 to-rose-500' },
      { id: 'monetization', label: 'Monétisation', icon: DollarSign, color: 'text-green-500', bgColor: 'bg-green-500/10', activeGradient: 'from-green-500 to-emerald-500' },
    ]
  },
  {
    id: 'audio',
    label: 'Audio & Formation',
    icon: '🎧',
    color: 'from-purple-500 to-violet-500',
    items: [
      { id: 'audiobook', label: 'Livre Audio', icon: Headphones, color: 'text-purple-500', bgColor: 'bg-purple-500/10', activeGradient: 'from-purple-500 to-violet-500' },
      { id: 'formation-complete', label: 'Formation', icon: GraduationCap, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10', activeGradient: 'from-emerald-500 to-teal-500', isLink: true, href: '/formation' },
      { id: 'voice', label: 'Dictée Vocale', icon: Volume2, color: 'text-rose-500', bgColor: 'bg-rose-500/10', activeGradient: 'from-rose-500 to-pink-500' },
    ]
  },
  {
    id: 'outils',
    label: 'Outils',
    icon: '⚙️',
    color: 'from-slate-500 to-gray-500',
    items: [
      { id: 'projects', label: 'Mes Projets', icon: FolderOpen, color: 'text-violet-500', bgColor: 'bg-violet-500/10', activeGradient: 'from-violet-500 to-purple-500' },
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-cyan-500', bgColor: 'bg-cyan-500/10', activeGradient: 'from-cyan-500 to-blue-500' },
      { id: 'settings', label: 'Paramètres', icon: Settings, color: 'text-slate-500', bgColor: 'bg-slate-500/10', activeGradient: 'from-slate-500 to-gray-500' },
      { id: 'subscription', label: 'Abonnement', icon: CreditCard, color: 'text-purple-500', bgColor: 'bg-purple-500/10', activeGradient: 'from-purple-500 to-pink-500', isLink: true, href: '/subscription' },
      { id: 'offres', label: 'Offres', icon: Sparkles, color: 'text-amber-500', bgColor: 'bg-amber-500/10', activeGradient: 'from-yellow-500 to-orange-500', isLink: true, href: '/offres' },
    ]
  },
];

// Composant Quota compact
const QuotaDisplay: React.FC<{ isCollapsed: boolean }> = ({ isCollapsed }) => {
  const navigate = useNavigate();
  const { quotas, isLoading, hasSubscription } = useUserQuotas();

  if (isLoading || !hasSubscription || !quotas) {
    return (
      <div className={cn("border-t border-white/10 p-3", isCollapsed && "flex justify-center")}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/offres')}
          className={cn(
            "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600",
            isCollapsed ? "w-8 h-8 p-0" : "w-full"
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
    <div className={cn("border-t border-white/10 p-3", isCollapsed && "flex justify-center")}>
      {isCollapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-violet-400" />
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
            <span className="text-xs text-white/60">Plan</span>
            <span className={cn(
              "text-xs font-bold px-2 py-0.5 rounded-full",
              quotas.plan === 'lifetime' ? 'bg-violet-500/30 text-violet-300' :
              quotas.plan === 'pro' ? 'bg-amber-500/30 text-amber-300' :
              'bg-emerald-500/30 text-emerald-300'
            )}>
              {quotas.plan.toUpperCase()}
            </span>
          </div>
          {isUnlimited ? (
            <div className="text-center py-1.5 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-lg">
              <span className="text-xs font-medium text-violet-300">∞ Accès illimité</span>
            </div>
          ) : (
            <>
              <div className="flex justify-between text-xs">
                <span className="text-white/60">Ebooks</span>
                <span className="text-white/90">{quotas.ebook_plans.remaining}/{quotas.ebook_plans.limit}</span>
              </div>
              <Progress value={ebookPercentage} className="h-1.5 bg-white/10" />
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
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['quick-actions']);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('sidebar-favorites');
    return saved ? JSON.parse(saved) : ['complete-workflow', 'comic-book', 'coloring-book'];
  });

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

  // Favoris avec données complètes
  const favoriteItems = useMemo(() => {
    const allItems = categories.flatMap(c => c.items);
    return favorites.map(id => allItems.find(item => item.id === id)).filter(Boolean) as MenuItem[];
  }, [favorites]);

  const toggleFavorite = (itemId: string) => {
    const newFavorites = favorites.includes(itemId)
      ? favorites.filter(id => id !== itemId)
      : [...favorites, itemId];
    setFavorites(newFavorites);
    localStorage.setItem('sidebar-favorites', JSON.stringify(newFavorites));
  };

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

  const renderMenuItem = (item: MenuItem, showFavoriteButton = false) => {
    const isActive = activeTab === item.id;
    const isFavorite = favorites.includes(item.id);
    const Icon = item.icon;

    return (
      <div key={item.id} className="group relative">
        <button
          onClick={() => handleItemClick(item)}
          className={cn(
            "w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-200",
            isActive 
              ? `bg-gradient-to-r ${item.activeGradient} text-white shadow-lg shadow-black/20` 
              : "hover:bg-white/5 text-white/70 hover:text-white",
            isCollapsed && "justify-center px-2"
          )}
        >
          <div className={cn(
            "flex items-center justify-center w-7 h-7 rounded-lg transition-all",
            isActive ? "bg-white/20" : `${item.bgColor}`
          )}>
            <Icon className={cn("w-4 h-4", isActive ? "text-white" : item.color)} />
          </div>
          
          {!isCollapsed && (
            <>
              <span className="text-sm font-medium truncate flex-1 text-left">
                {item.label}
              </span>
              
              {item.isNew2026 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-gradient-to-r from-amber-400 to-orange-500 text-white">
                  2026
                </span>
              )}
              
              {item.isPremium && !item.isNew2026 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-violet-500/30 text-violet-300">
                  PRO
                </span>
              )}
            </>
          )}
        </button>
        
        {/* Bouton favori */}
        {showFavoriteButton && !isCollapsed && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(item.id);
            }}
            className={cn(
              "absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-white/10",
              isFavorite && "opacity-100"
            )}
          >
            <Star className={cn(
              "w-3.5 h-3.5",
              isFavorite ? "fill-amber-400 text-amber-400" : "text-white/40"
            )} />
          </button>
        )}
      </div>
    );
  };

  return (
    <TooltipProvider delayDuration={0}>
      <aside 
        className={cn(
          "relative flex flex-col h-screen transition-all duration-300 ease-out",
          "bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950",
          "border-r border-white/5",
          isCollapsed ? "w-[72px]" : "w-64"
        )}
      >
        {/* Header avec Logo */}
        <div className={cn(
          "flex items-center gap-3 p-4 border-b border-white/5",
          isCollapsed && "justify-center p-3"
        )}>
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <h1 className="font-bold text-white text-sm">EbookStudio</h1>
              <p className="text-[11px] text-white/50">Pro Edition 2026</p>
            </div>
          )}
        </div>

        {/* Barre de recherche */}
        {!isCollapsed && (
          <div className="px-3 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <Input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 h-9 text-sm bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:bg-white/10 focus:border-violet-500/50"
              />
            </div>
          </div>
        )}

        {/* Favoris */}
        {!isCollapsed && favoriteItems.length > 0 && !searchQuery && (
          <div className="px-3 pb-2">
            <div className="flex items-center gap-2 px-2 mb-2">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-xs font-medium text-white/50 uppercase tracking-wider">Favoris</span>
            </div>
            <div className="space-y-0.5">
              {favoriteItems.slice(0, 4).map(item => renderMenuItem(item, false))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {filteredCategories.map((category) => {
            const isExpanded = expandedCategories.includes(category.id);
            const hasActiveItem = category.items.some(item => item.id === activeTab);

            return (
              <div key={category.id} className="px-2 mb-1">
                {/* Header catégorie */}
                {!isCollapsed ? (
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-2 py-2 rounded-xl transition-all",
                      "hover:bg-white/5 text-white/60 hover:text-white/90",
                      hasActiveItem && "text-white/90"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{category.icon}</span>
                      <span className="text-xs font-semibold uppercase tracking-wider">{category.label}</span>
                      {category.isPremiumCategory && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-gradient-to-r from-violet-500 to-purple-500 text-white">
                          PRO
                        </span>
                      )}
                    </div>
                    <ChevronDown className={cn(
                      "w-4 h-4 transition-transform",
                      isExpanded ? "rotate-0" : "-rotate-90"
                    )} />
                  </button>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className={cn(
                        "flex justify-center py-2 mb-1 rounded-xl",
                        hasActiveItem && "bg-white/10"
                      )}>
                        <span className="text-lg">{category.icon}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p className="font-medium">{category.label}</p>
                    </TooltipContent>
                  </Tooltip>
                )}

                {/* Items */}
                {!isCollapsed && (
                  <div className={cn(
                    "overflow-hidden transition-all duration-200 pl-2",
                    isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                  )}>
                    <div className="space-y-0.5 py-1">
                      {category.items.map(item => renderMenuItem(item, true))}
                    </div>
                  </div>
                )}

                {isCollapsed && (
                  <div className="space-y-1">
                    {category.items.map(item => (
                      <Tooltip key={item.id}>
                        <TooltipTrigger asChild>
                          {renderMenuItem(item, false)}
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p className="font-medium">{item.label}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Quota */}
        <QuotaDisplay isCollapsed={isCollapsed} />

        {/* Toggle */}
        <div className="p-2 border-t border-white/5">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className={cn(
              "w-full h-9 flex items-center gap-2 text-white/50 hover:text-white hover:bg-white/5 rounded-xl",
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
