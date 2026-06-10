import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, LogOut, Sparkles, LayoutGrid, Search, Shield, Settings, Target, ClipboardCheck, MessageCircle, BookOpen, FolderOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { getIsCurrentSessionAdmin } from '@/lib/adminAccess';
import { EbookSettingsPanel } from '@/components/ebook/EbookSettingsPanel';
import KdpPackButton from '@/components/shared/KdpPackButton';
import AITokenHeaderBadge from '@/components/shared/AITokenHeaderBadge';

interface EspaceHeaderProps {
  projectTitle?: string | null;
  currentStepLabel?: string | null;
  onLogout?: () => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

type FamilyId = 'planner' | 'writing' | 'images' | 'export' | 'marketing' | 'account';

const PLANNER_TABS: Array<{ id: FamilyId; label: string; emoji: string; bg: string; bgActive: string; ring: string; match: string[] }> = [
  { id: 'planner',   label: 'Plan',     emoji: '📘', bg: 'bg-[#DBEAFE] text-[#1E40AF] hover:bg-[#BFDBFE]',         bgActive: 'bg-[#3B82F6] text-white shadow-md shadow-[#3B82F6]/30',       ring: 'ring-[#3B82F6]/30', match: ['planner', 'characters', 'templates', 'workflow-dashboard', 'url-import', 'doc-transform', 'projects', 'ebook-library', 'series', 'kdp-keywords-pro'] },
  { id: 'writing',   label: 'Écrire',   emoji: '✍️', bg: 'bg-[#DCFCE7] text-[#166534] hover:bg-[#BBF7D0]',         bgActive: 'bg-[#22C55E] text-white shadow-md shadow-[#22C55E]/30',       ring: 'ring-[#22C55E]/30', match: ['writing', 'strict-proofread', 'toc', 'aichat', 'complete-workflow', 'humanize-anti-ia', 'natural-rewrite', 'expert-writing', 'multi-translator', 'tools', 'atlas', 'encyclopedia', 'documentary', 'agenda', 'scolaire', 'pedagogique', 'content-architect'] },
  { id: 'images',    label: 'Habiller', emoji: '🎨', bg: 'bg-[#EDE9FE] text-[#5B21B6] hover:bg-[#DDD6FE]',         bgActive: 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/30',       ring: 'ring-[#8B5CF6]/30', match: ['images', 'cover', 'cover-design-editor', 'back-cover', 'backcover', 'images-cover', 'images-generator', 'images-library', 'editorial-packaging'] },
  { id: 'export',    label: 'Publier',  emoji: '🚀', bg: 'bg-[#FFEDD5] text-[#9A3412] hover:bg-[#FED7AA]',         bgActive: 'bg-[#F97316] text-white shadow-md shadow-[#F97316]/30',       ring: 'ring-[#F97316]/30', match: ['export', 'kdp', 'kdp-prepublish-checklist', 'workflow-export', 'calibre-epub', 'audiobook', 'audio-express', 'audio', 'audit-pilot', 'kdp-keywords-pro'] },
  { id: 'marketing', label: 'Vendre',   emoji: '💛', bg: 'bg-[#FCE7F3] text-[#9F1239] hover:bg-[#FBCFE8]',         bgActive: 'bg-[#EC4899] text-white shadow-md shadow-[#EC4899]/30',       ring: 'ring-[#EC4899]/30', match: ['marketing', 'monetization', 'advanced', 'launch-plan', 'editorial-quality', 'final-diagnosis', 'kdp-ads-guide', 'chrome-extension'] },
];

const FAMILY_EMOJI: Record<FamilyId, string> = {
  planner: '📘', writing: '✍️', images: '🎨', export: '🚀', marketing: '💛', account: '⚙️',
};

const HIDE_TABBAR_ON = new Set([
  'onboarding',
  'coloring',
  'bd-studio',
  'settings',
  'subscription',
]);

// Sous-onglets contextuels par famille (les outils courants).
const PLANNER_SUBTABS: Partial<Record<FamilyId, Array<{ id: string; label: string; href?: string; isNew?: boolean }>>> = {
  planner: [
    { id: 'kdp-keywords-pro', label: '🔍 Mots-clés Amazon (KDSpy)' },
    { id: 'workflow-dashboard', label: 'Tableau de bord IA' },
    { id: 'planner', label: 'Plan du livre' },
    { id: 'characters', label: 'Personnages' },
    { id: 'templates', label: 'Modèles' },
    { id: 'doc-transform', label: 'Importer un doc' },
    { id: 'projects', label: 'Mes projets' },
    { id: 'guides', label: 'Guides', href: '/blog', isNew: true },
  ],
  writing: [
    { id: 'complete-workflow', label: 'Workflow complet' },
    { id: 'writing', label: 'Chapitre par chapitre' },
    { id: 'aichat', label: 'AI Chat' },
    { id: 'strict-proofread', label: 'Proofread strict' },
    { id: 'humanize-anti-ia', label: 'Anti-IA / humaniser' },
    { id: 'multi-translator', label: 'Traduction' },
    { id: 'tools', label: 'Boîte à outils' },
  ],
  images: [
    { id: 'images-cover', label: 'Studio image' },
    { id: 'cover', label: 'Couverture IA' },
    { id: 'cover-design-editor', label: 'Éditeur de couverture' },
    { id: 'backcover', label: '4ᵉ de couverture' },
    { id: 'images-library', label: 'Bibliothèque' },
  ],
  export: [
    // audit-pilot retiré ici : c'est une route /audit-pilot, accessible via le bouton "Audit ASIN" du header.
    { id: 'kdp', label: 'Export KDP' },
    { id: 'kdp-prepublish-checklist', label: 'Checklist KDP' },
    { id: 'kdp-keywords-pro', label: 'Mots-clés KDP' },
    { id: 'calibre-epub', label: 'Export EPUB' },
    { id: 'audiobook', label: 'Audiobook' },
    { id: 'audio-express', label: 'Audio Express' },
  ],
  marketing: [
    { id: 'marketing', label: 'Plan marketing' },
    { id: 'launch-plan', label: 'Plan de lancement' },
    { id: 'kdp-ads-guide', label: 'Amazon Ads' },
    { id: 'advanced', label: 'Stratégie avancée' },
  ],
};

// Annuaire complet (popover "Tous les outils").
const ALL_TOOLS: Array<{ family: FamilyId; familyLabel: string; tools: Array<{ id: string; label: string }> }> = [
  {
    family: 'planner',
    familyLabel: 'Plan',
    tools: [
      { id: 'workflow-dashboard', label: 'Tableau de bord IA' },
      { id: 'planner', label: 'Plan du livre' },
      { id: 'characters', label: 'Personnages' },
      { id: 'templates', label: 'Modèles' },
      { id: 'doc-transform', label: 'Importer un doc (.docx)' },
      { id: 'url-import', label: 'Importer depuis une URL' },
      { id: 'projects', label: 'Mes projets' },
      { id: 'ebook-library', label: "Bibliothèque d'ebooks" },
      { id: 'series', label: 'Séries / tomes' },
    ],
  },
  {
    family: 'writing',
    familyLabel: 'Écrire',
    tools: [
      { id: 'complete-workflow', label: 'Workflow complet' },
      { id: 'writing', label: 'Chapitre par chapitre' },
      { id: 'aichat', label: 'AI Chat' },
      { id: 'strict-proofread', label: 'Proofread strict' },
      { id: 'expert-writing', label: 'Rédaction experte' },
      { id: 'natural-rewrite', label: 'Réécriture naturelle' },
      { id: 'humanize-anti-ia', label: 'Anti-IA / humaniser' },
      { id: 'multi-translator', label: 'Traduction multilingue' },
      { id: 'editorial-memory', label: 'Mémoire éditoriale' },
      { id: 'chapter-coherence', label: 'Cohérence des chapitres' },
      { id: 'self-critique', label: 'Auto-critique' },
      { id: 'iterative-loop', label: 'Boucle itérative' },
      { id: 'style-signature', label: 'Signature de style' },
    ],
  },
  {
    family: 'images',
    familyLabel: 'Habiller',
    tools: [
      { id: 'images-cover', label: 'Studio image — couverture' },
      { id: 'images-generator', label: 'Studio image — générateur' },
      { id: 'images-library', label: 'Bibliothèque d\'images' },
      { id: 'cover', label: 'Couverture IA' },
      { id: 'cover-design-editor', label: 'Éditeur de couverture (Canva)' },
      { id: 'backcover', label: '4ᵉ de couverture' },
      { id: 'editorial-packaging', label: 'Packaging éditorial' },
    ],
  },
  {
    family: 'export',
    familyLabel: 'Publier',
    tools: [
      { id: 'kdp', label: 'Export KDP' },
      { id: 'kdp-prepublish-checklist', label: 'Checklist pré-publication' },
      { id: 'audit-pilot', label: 'Audit pré-publication' },
      { id: 'kdp-keywords-pro', label: 'Mots-clés KDP Pro' },
      { id: 'export', label: 'Export PDF/DOCX' },
      { id: 'calibre-epub', label: 'Export EPUB (Calibre)' },
      { id: 'workflow-export', label: 'Export workflow' },
      { id: 'audiobook', label: 'Audiobook' },
      { id: 'audio-express', label: 'Audio Express' },
      { id: 'final-diagnosis', label: 'Diagnostic final' },
      { id: 'editorial-quality', label: 'Qualité éditoriale' },
      { id: 'ultimate-verdict', label: 'Verdict ultime' },
    ],
  },
  {
    family: 'marketing',
    familyLabel: 'Vendre',
    tools: [
      { id: 'marketing', label: 'Plan marketing' },
      { id: 'launch-plan', label: 'Plan de lancement' },
      { id: 'advanced', label: 'Stratégie avancée' },
      { id: 'market-analysis', label: 'Analyse de marché' },
      { id: 'editorial-director', label: 'Directeur éditorial' },
      { id: 'kdp-ads-guide', label: 'Guide Amazon Ads' },
      { id: 'chrome-extension', label: 'Extension Chrome' },
    ],
  },
  {
    family: 'writing',
    familyLabel: '📚 Formats spéciaux',
    tools: [
      { id: 'pedagogique', label: '📖 Livres pédagogiques (encadrés, schémas, tableaux)' },
      { id: 'agenda', label: '🗓️ Agendas & Planners' },
      { id: 'scolaire', label: '🎓 Scolaire & Parascolaire' },
      { id: 'atlas', label: '🗺️ Atlas' },
      { id: 'encyclopedia', label: '📚 Encyclopédie' },
      { id: 'documentary', label: '🎬 Documentaire' },
      { id: 'coloring', label: '🎨 Livre de coloriage' },
      { id: 'series', label: '📚 Séries / Tomes' },
    ],
  },
  {
    family: 'account',
    familyLabel: 'Mon compte',
    tools: [
      { id: 'subscription', label: 'Mon abonnement' },
      { id: 'settings', label: 'Paramètres' },
      { id: 'parrainage', label: 'Parrainage' },
      { id: 'communaute', label: 'Communauté' },
      { id: 'admin', label: 'Admin' },
      { id: 'admin-subscribers', label: 'Admin — abonnés' },
    ],
  },
];

/**
 * Header commun aux pages abonnées.
 * - Retour rapide à /espace
 * - Onglet famille (Plan/Écrire/Habiller/Publier/Vendre)
 * - Sous-barre contextuelle par famille
 * - Popover "Tous les outils" pour accéder aux outils rares
 */
export const EspaceHeader: React.FC<EspaceHeaderProps> = ({
  projectTitle,
  currentStepLabel,
  onLogout,
  activeTab,
  onTabChange,
}) => {
  const [allToolsOpen, setAllToolsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    getIsCurrentSessionAdmin()
      .then((v) => { if (!cancelled) setIsAdmin(!!v); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const showTabBar =
    !!activeTab && !!onTabChange && !HIDE_TABBAR_ON.has(activeTab);

  const currentFamily: FamilyId | null = useMemo(() => {
    if (!activeTab) return null;
    const found = PLANNER_TABS.find(
      (t) => t.id === activeTab || t.match.includes(activeTab),
    );
    return found?.id ?? null;
  }, [activeTab]);

  const isFamilyActive = (tab: { id: FamilyId; match: string[] }) =>
    currentFamily === tab.id;

  const isSubActive = (subId: string) => activeTab === subId;

  const filteredTools = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ALL_TOOLS;
    return ALL_TOOLS.map((g) => ({
      ...g,
      tools: g.tools.filter(
        (t) =>
          t.label.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q),
      ),
    })).filter((g) => g.tools.length > 0);
  }, [search]);

  const handlePick = (id: string) => {
    onTabChange?.(id);
    setAllToolsOpen(false);
    setSearch('');
  };

  const [bannerDismissed, setBannerDismissed] = useState(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem('launch_vip_banner_dismissed_v1') === '1';
  });

  return (
    <header
      className="sticky top-0 z-40 w-full backdrop-blur-md"
      style={{
        backgroundColor: 'rgba(250,250,250,0.85)',
        borderBottom: '1px solid hsl(var(--joy-ink) / 0.08)',
      }}
    >
      {!bannerDismissed && (
        <div
          className="w-full text-white text-sm relative"
          style={{ backgroundColor: '#232F3E', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2 sm:px-6">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full bg-[#FF9E2D]"
              aria-hidden
            />
            <p className="flex-1 truncate text-[12px] tracking-tight" style={{ fontFamily: "'Work Sans', system-ui, sans-serif" }}>
              <span className="hidden sm:inline text-white/55 mr-1 uppercase tracking-[0.14em] text-[10px] font-semibold">Lancement 1ᵉʳ juillet 2026 ·</span>
              <strong className="text-white font-semibold">Tes 2 cadeaux abonné</strong>
              <span className="text-white/60"> : 30 min Zoom + −30 % à vie</span>
            </p>
            <Link
              to="/espace/lancement"
              className="border border-white/30 hover:border-[#FF9E2D] hover:text-[#FF9E2D] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] whitespace-nowrap transition-colors"
            >
              Voir mes cadeaux →
            </Link>
            <button
              onClick={() => {
                setBannerDismissed(true);
                try { localStorage.setItem('launch_vip_banner_dismissed_v1', '1'); } catch {}
              }}
              className="text-white/40 hover:text-white text-lg leading-none px-1 transition-colors"
              aria-label="Fermer"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">




        <div className="flex min-w-0 items-center gap-2 text-sm">
          <Link
            to="/espace"
            className="flex items-center gap-1.5 font-semibold text-joy-ink rounded-full px-2.5 py-1 -ml-2 transition-all hover:bg-joy-ink/5"
            title="Retour à mon espace"
          >
            <ArrowLeft className="h-4 w-4" style={{ color: '#008296' }} />
            <span className="hidden sm:inline tracking-tight">Mon espace</span>
            <Sparkles className="h-3.5 w-3.5 sm:hidden" style={{ color: '#008296' }} />
          </Link>
          <Link
            to="/contact-support"
            title="Contacter le support — Georges répond sous 48h"
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white shadow-md shadow-[#FF9E2D]/30 ring-1 ring-white/50 hover:brightness-110 transition"
            style={{ backgroundImage: 'linear-gradient(90deg,#FF9E2D 0%,#FF6B35 100%)' }}
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Contact</span>
          </Link>
          {/* Badge d'orientation — toujours visible pour savoir où l'on est */}
          <span
            className="hidden md:inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-extrabold tracking-wide text-white shadow-md shadow-[#FF9E2D]/30 ring-1 ring-white/40 whitespace-nowrap shrink-0"
            style={{ backgroundImage: 'linear-gradient(90deg,#008296 0%,#00A8B5 50%,#FF9E2D 100%)' }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Ebookstudio Pro V2
          </span>

          {/* Accès direct à mes projets — toujours visible, quelle que soit l'étape */}
          {onTabChange && (
            <button
              onClick={() => onTabChange('projects')}
              title="Voir tous mes projets"
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] transition-colors shrink-0',
                activeTab === 'projects'
                  ? 'bg-[#008296] text-white'
                  : 'border border-[#008296]/40 text-[#008296] hover:bg-[#008296]/10',
              )}
            >
              <FolderOpen className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Mes projets</span>
            </button>
          )}


          {projectTitle && (
            <>
              <span className="text-joy-ink/30 text-base">›</span>
              <span
                className="truncate font-serif italic text-joy-ink/90"
                title={projectTitle}
              >
                <span className="mr-1" aria-hidden>📖</span>
                {projectTitle}
              </span>
            </>
          )}
          {currentStepLabel && (
            <>
              <span className="hidden text-joy-ink/30 sm:inline">·</span>
              <span className="hidden truncate text-xs text-joy-ink/55 sm:inline">
                {currentStepLabel}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-1">
          <AITokenHeaderBadge />
          <KdpPackButton
            size="sm"
            label="Pack KDP"
            getOptions={() => {
              // Récupère les infos du projet courant depuis localStorage (best-effort)
              let ebookTitle = projectTitle || '';
              let authorName = '';
              let subtitle = '';
              let kdpDescription = '';
              let kdpKeywords = '';
              try {
                const raw = localStorage.getItem('ebook_current_project') || localStorage.getItem('ebookProject');
                if (raw) {
                  const p = JSON.parse(raw);
                  ebookTitle = p.ebookTitle || p.title || ebookTitle;
                  authorName = p.authorName || p.author || '';
                  subtitle = p.subtitle || '';
                  kdpDescription = p.kdpDescription || p.description || '';
                  kdpKeywords = p.kdpKeywords || (Array.isArray(p.keywords) ? p.keywords.join(', ') : '') || '';
                }
              } catch {}
              return { ebookTitle, authorName, subtitle, kdpDescription, kdpKeywords };
            }}
          />
          {isAdmin && (
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to="/admin-cockpit"
                    aria-label="Cockpit admin"
                    className="inline-flex items-center gap-1.5 border border-[#e8ecf1] hover:border-[#008296] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#232F3E] hover:text-[#008296] transition-colors"
                  >
                    <Shield className="h-3 w-3" />
                    <span className="hidden sm:inline">Cockpit admin</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="bottom">Cockpit admin</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Réglages avancés"
                      className="text-joy-ink/70 hover:text-joy-ink hover:bg-joy-ink/5 rounded-full h-9 w-9"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Réglages avancés</DialogTitle>
                    </DialogHeader>
                    <EbookSettingsPanel />
                  </DialogContent>
                </Dialog>
              </TooltipTrigger>
              <TooltipContent side="bottom">Réglages (rédaction, images, mise en page)</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {onLogout && (
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onLogout}
                    aria-label="Déconnexion"
                    className="text-joy-ink/70 hover:text-joy-ink hover:bg-joy-ink/5 rounded-full h-9 w-9"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Déconnexion</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      {projectTitle && (
        <div className="w-full border-t border-[#e8ecf1] bg-gradient-to-r from-[#008296]/5 to-[#FF9E2D]/5 py-3 px-4 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#232F3E] tracking-tight leading-tight truncate">
              <span className="mr-2" aria-hidden>📖</span>
              {projectTitle}
            </h1>
            {currentStepLabel && (
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#008296] mt-0.5 truncate">
                {currentStepLabel}
              </p>
            )}
          </div>
        </div>
      )}

      {showTabBar && (
        <>
          {/* Rangée principale : familles + outils (style éditorial magazine) */}
          <nav
            className="border-t border-[#e8ecf1] bg-[#fafbfc]"
            aria-label="Étapes du livre"
            style={{ fontFamily: "'Work Sans', system-ui, sans-serif" }}
          >
            <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 sm:px-6 scrollbar-thin">
              <div className="flex items-center flex-1 min-w-0">
                {PLANNER_TABS.map((tab) => {
                  const active = isFamilyActive(tab);
                  return (
                    <button
                      key={tab.id}
                      onClick={() => onTabChange?.(tab.id)}
                      className={cn(
                        'flex-shrink-0 inline-flex items-center gap-2 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] transition-colors border-b-2',
                        active
                          ? 'text-[#232F3E] border-[#FF9E2D]'
                          : 'text-[#232F3E]/55 border-transparent hover:text-[#008296]',
                      )}
                    >
                      <span className="text-xs opacity-60" aria-hidden>{tab.emoji}</span>
                      {tab.label}
                    </button>
                  );
                })}

                {/* Audit ASIN */}
                <button
                  onClick={() => navigate('/audit-pilot')}
                  title="Auditer une fiche produit Amazon par ASIN"
                  className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#232F3E]/55 border-b-2 border-transparent hover:text-[#008296] transition-colors"
                >
                  <ClipboardCheck className="h-3 w-3" />
                  <span className="hidden md:inline">Audit ASIN</span>
                </button>

                {/* Communauté */}
                <button
                  onClick={() => navigate('/communaute')}
                  title="Forum entre abonnés"
                  className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#232F3E]/55 border-b-2 border-transparent hover:text-[#008296] transition-colors"
                >
                  <MessageCircle className="h-3 w-3" />
                  <span className="hidden md:inline">Communauté</span>
                  <span className="text-[8px] font-bold tracking-widest px-1 bg-[#008296] text-white">NEW</span>
                </button>

                {/* 600 Niches */}
                <button
                  onClick={() => navigate('/niches-600')}
                  title="600 niches KDP rentables"
                  className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#232F3E]/55 border-b-2 border-transparent hover:text-[#008296] transition-colors"
                >
                  <Target className="h-3 w-3" />
                  <span>600 Niches</span>
                  <span className="text-[8px] font-bold tracking-widest px-1 bg-[#008296] text-white">NEW</span>
                </button>
              </div>

              <Popover open={allToolsOpen} onOpenChange={setAllToolsOpen}>
                <PopoverTrigger asChild>
                  <button
                    className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#008296] hover:text-[#FF9E2D] transition-colors"
                  >
                    <LayoutGrid className="h-3 w-3" />
                    <span className="hidden sm:inline">+ Tous les outils</span>
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  className="w-[min(92vw,860px)] p-0 rounded-none border border-[#e8ecf1] overflow-hidden"
                >
                  <div className="p-3 border-b border-[#e8ecf1] bg-[#fafbfc]">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#232F3E]/40" />
                      <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Rechercher un outil…"
                        className="pl-8 h-9 rounded-none bg-white border-[#e8ecf1] text-sm"
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-0 max-h-[60vh] overflow-y-auto">
                    {filteredTools.map((group) => (
                      <div
                        key={group.family}
                        className="p-3 border-r border-b border-[#e8ecf1] last:border-r-0"
                      >
                        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#008296] mb-2 px-1 flex items-center gap-1">
                          <span aria-hidden className="opacity-60">{FAMILY_EMOJI[group.family]}</span>
                          {group.familyLabel}
                        </div>
                        <ul className="space-y-0.5">
                          {group.tools.map((t) => {
                            const active = activeTab === t.id;
                            return (
                              <li key={t.id}>
                                <button
                                  onClick={() => handlePick(t.id)}
                                  className={cn(
                                    'w-full text-left text-sm px-2 py-1.5 transition-colors',
                                    active
                                      ? 'bg-[#e8ecf1] text-[#232F3E] font-semibold'
                                      : 'text-[#232F3E]/75 hover:bg-[#fafbfc] hover:text-[#008296]',
                                  )}
                                >
                                  {t.label}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                    {filteredTools.length === 0 && (
                      <div className="col-span-full p-6 text-center text-sm text-[#232F3E]/55">
                        Aucun outil ne correspond à « {search} ».
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </nav>

          {/* Sous-barre contextuelle (style éditorial) */}
          {currentFamily && PLANNER_SUBTABS[currentFamily]?.length > 0 && (
            <nav
              className="border-t border-[#e8ecf1] bg-[#fafbfc]"
              aria-label="Outils de l'étape"
              style={{ fontFamily: "'Work Sans', system-ui, sans-serif" }}
            >
              <div className="mx-auto flex max-w-7xl items-center justify-center gap-6 overflow-x-auto px-4 py-2.5 sm:px-6 scrollbar-thin">
                {PLANNER_SUBTABS[currentFamily]!.map((sub) => {
                  const active = isSubActive(sub.id);
                  return (
                    <button
                      key={sub.id}
                      onClick={() => (sub.href ? navigate(sub.href) : onTabChange?.(sub.id))}
                      className={cn(
                        'flex-shrink-0 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors',
                        active
                          ? 'text-[#008296]'
                          : 'text-[#232F3E]/55 hover:text-[#232F3E]',
                      )}
                    >
                      {active && <span className="w-1.5 h-1.5 rounded-full bg-[#008296]" aria-hidden />}
                      {sub.label}
                      {sub.isNew && (
                        <span className="text-[8px] font-bold tracking-widest px-1 bg-[#008296] text-white">NEW</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </nav>
          )}
        </>
      )}
    </header>
  );
};

export default EspaceHeader;
