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
  Award
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

// Items du workflow IA éditorial avec style premium
interface PremiumMenuItem extends MenuItem {
  isPremium?: boolean;
  promptNumber?: number;
}

interface PremiumCategory extends Omit<Category, 'items'> {
  items: PremiumMenuItem[];
  isPremiumCategory?: boolean;
}

const categories: PremiumCategory[] = [
  {
    id: 'workflow-ia',
    label: 'Workflow IA Éditorial',
    icon: '🚀',
    color: 'from-amber-400 via-orange-500 to-red-500',
    isPremiumCategory: true,
    items: [
      { id: 'editorial-director', label: '1. Directeur Éditorial', icon: Crown, color: 'text-amber-500', bgColor: 'bg-amber-500/10', activeGradient: 'from-amber-400 to-orange-500', isPremium: true, promptNumber: 1 },
      { id: 'market-analysis', label: '2. Analyse Marché', icon: Search, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10', activeGradient: 'from-emerald-400 to-teal-500', isPremium: true, promptNumber: 2 },
      { id: 'content-architect', label: '3. Architecte Contenu', icon: LayoutDashboard, color: 'text-violet-500', bgColor: 'bg-violet-500/10', activeGradient: 'from-violet-400 to-purple-500', isPremium: true, promptNumber: 3 },
      { id: 'expert-writing', label: '4. Rédaction Experte', icon: PenTool, color: 'text-blue-500', bgColor: 'bg-blue-500/10', activeGradient: 'from-blue-400 to-cyan-500', isPremium: true, promptNumber: 4 },
      { id: 'natural-rewrite', label: '5. Réécriture Naturelle', icon: Sparkles, color: 'text-pink-500', bgColor: 'bg-pink-500/10', activeGradient: 'from-pink-400 to-rose-500', isPremium: true, promptNumber: 5 },
      { id: 'editorial-quality', label: '6. Cohérence & Qualité', icon: FileEdit, color: 'text-teal-500', bgColor: 'bg-teal-500/10', activeGradient: 'from-teal-400 to-cyan-500', isPremium: true, promptNumber: 6 },
      { id: 'editorial-packaging', label: '7. Packaging Éditorial', icon: FileText, color: 'text-green-500', bgColor: 'bg-green-500/10', activeGradient: 'from-green-400 to-emerald-500', isPremium: true, promptNumber: 7 },
      { id: 'final-diagnosis', label: '8. Diagnostic Final', icon: Shield, color: 'text-purple-500', bgColor: 'bg-purple-500/10', activeGradient: 'from-purple-400 to-fuchsia-500', isPremium: true, promptNumber: 8 },
    ]
  },
  {
    id: 'moteur-v2',
    label: 'Moteur IA V2',
    icon: '🧬',
    color: 'from-purple-400 via-violet-500 to-indigo-600',
    isPremiumCategory: true,
    items: [
      { id: 'editorial-memory', label: '9. Mémoire Éditoriale', icon: Brain, color: 'text-purple-500', bgColor: 'bg-purple-500/10', activeGradient: 'from-purple-400 to-violet-500', isPremium: true, promptNumber: 9 },
      { id: 'chapter-coherence', label: '10. Cohérence Inter-Chap', icon: GitBranch, color: 'text-indigo-500', bgColor: 'bg-indigo-500/10', activeGradient: 'from-indigo-400 to-blue-500', isPremium: true, promptNumber: 10 },
      { id: 'self-critique', label: '11. Auto-Critique IA', icon: Eye, color: 'text-rose-500', bgColor: 'bg-rose-500/10', activeGradient: 'from-rose-400 to-pink-500', isPremium: true, promptNumber: 11 },
      { id: 'iterative-loop', label: '12. Amélioration Loop', icon: RefreshCw, color: 'text-cyan-500', bgColor: 'bg-cyan-500/10', activeGradient: 'from-cyan-400 to-teal-500', isPremium: true, promptNumber: 12 },
      { id: 'style-signature', label: '13. Signature Style', icon: Fingerprint, color: 'text-amber-500', bgColor: 'bg-amber-500/10', activeGradient: 'from-amber-400 to-orange-500', isPremium: true, promptNumber: 13 },
      { id: 'ultimate-verdict', label: '14. Verdict Ultime', icon: Award, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10', activeGradient: 'from-yellow-400 to-amber-500', isPremium: true, promptNumber: 14 },
    ]
  },
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
      { id: 'encyclopedia', label: 'Encyclopédie', icon: BookMarked, color: 'text-amber-500', bgColor: 'bg-amber-500/10', activeGradient: 'from-amber-500 to-orange-500' },
      { id: 'atlas', label: 'Atlas', icon: Map, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10', activeGradient: 'from-emerald-500 to-teal-500' },
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
      { id: 'editor-audit', label: 'Audit Éditeur', icon: FileEdit, color: 'text-violet-500', bgColor: 'bg-violet-500/10', activeGradient: 'from-violet-500 to-purple-500' },
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

// Composant d'affichage des quotas compact
const QuotaDisplay: React.FC<{ isCollapsed: boolean }> = ({ isCollapsed }) => {
  const navigate = useNavigate();
  const { quotas, isLoading, hasSubscription } = useUserQuotas();

  if (isLoading) {
    return null;
  }

  if (!hasSubscription || !quotas) {
    return (
      <div className={cn(
        "border-t border-border/50 p-2",
        isCollapsed && "flex justify-center"
      )}>
        {isCollapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/offres')}
                className="w-8 h-8 p-0"
              >
                <Crown className="w-4 h-4 text-amber-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="text-xs">Souscrire à une offre</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/offres')}
            className="w-full justify-start text-xs text-amber-500 hover:text-amber-600"
          >
            <Crown className="w-3.5 h-3.5 mr-2" />
            Souscrire à une offre
          </Button>
        )}
      </div>
    );
  }

  const ebookPercentage = getQuotaPercentage(quotas.ebook_plans);
  const isUnlimited = quotas.ebook_plans.limit === -1;

  return (
    <div className={cn(
      "border-t border-border/50 p-2",
      isCollapsed && "flex justify-center"
    )}>
      {isCollapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center cursor-pointer" onClick={() => navigate('/offres')}>
              <Zap className="w-4 h-4 text-primary" />
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" className="text-xs">
            <p className="font-medium">{quotas.plan.toUpperCase()}</p>
            <p>{isUnlimited ? '∞ Illimité' : `${quotas.ebook_plans.remaining} ebooks restants`}</p>
          </TooltipContent>
        </Tooltip>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-medium text-muted-foreground">Quotas</span>
            </div>
            <span className={cn(
              "text-[10px] font-semibold px-1.5 py-0.5 rounded",
              quotas.plan === 'lifetime' ? 'bg-purple-500/20 text-purple-500' :
              quotas.plan === 'pro' ? 'bg-amber-500/20 text-amber-500' :
              'bg-green-500/20 text-green-500'
            )}>
              {quotas.plan.toUpperCase()}
            </span>
          </div>
          
          {isUnlimited ? (
            <div className="text-[10px] text-center py-1 bg-purple-500/10 rounded text-purple-500 font-medium">
              ∞ Accès illimité
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-muted-foreground">Ebooks</span>
                <span className="font-medium">{quotas.ebook_plans.remaining}/{quotas.ebook_plans.limit}</span>
              </div>
              <Progress value={ebookPercentage} className="h-1" />
            </>
          )}
          
          {quotas.plan !== 'lifetime' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/offres')}
              className="w-full h-6 text-[10px] text-primary hover:text-primary/80"
            >
              <Crown className="w-3 h-3 mr-1" />
              Upgrade
            </Button>
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
            const isPremium = category.isPremiumCategory;
            
            return (
              <div key={category.id} className={cn(
                "mb-1",
                isPremium && !isCollapsed && "mx-2 mb-3 rounded-xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-red-500/10 border border-amber-500/20 overflow-hidden"
              )}>
                {/* Category Header */}
                {!isCollapsed ? (
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 text-xs font-semibold transition-all duration-200",
                      isPremium 
                        ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400"
                        : hasActiveItem 
                          ? "text-foreground" 
                          : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{category.icon}</span>
                      <span>{category.label}</span>
                      {isPremium && (
                        <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-gradient-to-r from-amber-500 to-orange-500 text-white uppercase tracking-wider">
                          PRO
                        </span>
                      )}
                      {hasActiveItem && !isPremium && (
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
                        "flex justify-center py-2 mb-1 relative",
                        hasActiveItem && "border-l-2 border-primary",
                        isPremium && "bg-gradient-to-r from-amber-500/20 to-orange-500/20"
                      )}>
                        <span className="text-sm">{category.icon}</span>
                        {isPremium && (
                          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="font-medium text-xs">
                      {category.label} {isPremium && '⭐'}
                    </TooltipContent>
                  </Tooltip>
                )}

                {/* Category Items */}
                <div className={cn(
                  "overflow-hidden transition-all duration-200",
                  !isCollapsed && !isExpanded && "max-h-0",
                  !isCollapsed && isExpanded && "max-h-[500px]",
                  !isCollapsed && !isPremium && "px-2"
                )}>
                  <div className={cn(
                    "space-y-0.5",
                    !isCollapsed && isExpanded && "pb-2 max-h-[280px] overflow-y-auto scrollbar-thin scrollbar-thumb-border/50 scrollbar-track-transparent pr-1",
                    isPremium && "px-2"
                  )}>
                    {category.items.map((item) => {
                      const isActive = activeTab === item.id;
                      const Icon = item.icon;
                      const premiumItem = item as PremiumMenuItem;
                      
                      const button = (
                        <button
                          onClick={() => handleItemClick(item)}
                          className={cn(
                            "group relative w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all duration-200",
                            isActive 
                              ? `bg-gradient-to-r ${item.activeGradient} text-white shadow-md` 
                              : premiumItem.isPremium
                                ? `hover:bg-amber-500/10 ${item.color}`
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
                              "text-xs font-medium truncate flex items-center gap-1",
                              isActive ? "text-white" : ""
                            )}>
                              {item.label}
                              {item.isLink && <span className="ml-1 text-[10px] opacity-60">↗</span>}
                            </span>
                          )}
                          
                          {/* Indicateur de numéro pour les prompts premium */}
                          {premiumItem.isPremium && premiumItem.promptNumber && !isCollapsed && !isActive && (
                            <span className="ml-auto text-[9px] font-bold text-amber-500/60">
                              P{premiumItem.promptNumber}
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
                              {premiumItem.isPremium && `${premiumItem.promptNumber}. `}{item.label}
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

        {/* Quota Display */}
        <QuotaDisplay isCollapsed={isCollapsed} />

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
