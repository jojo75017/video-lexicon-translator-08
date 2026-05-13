import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowLeft, LogOut, Sparkles, LayoutGrid, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EspaceHeaderProps {
  projectTitle?: string | null;
  currentStepLabel?: string | null;
  onLogout?: () => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

type FamilyId = 'planner' | 'writing' | 'images' | 'export' | 'marketing';

const PLANNER_TABS: Array<{ id: FamilyId; label: string; match: string[] }> = [
  { id: 'planner', label: 'Plan', match: ['planner', 'characters', 'templates', 'workflow-dashboard', 'url-import', 'doc-transform', 'projects', 'ebook-library', 'series'] },
  { id: 'writing', label: 'Écrire', match: ['writing', 'strict-proofread', 'toc', 'aichat', 'complete-workflow', 'humanize-anti-ia', 'natural-rewrite', 'expert-writing', 'multi-translator', 'tools', 'atlas', 'encyclopedia', 'documentary', 'agenda', 'scolaire', 'content-architect'] },
  { id: 'images', label: 'Habiller', match: ['images', 'cover', 'cover-design-editor', 'back-cover', 'backcover', 'images-cover', 'images-generator', 'images-library', 'editorial-packaging'] },
  { id: 'export', label: 'Publier', match: ['export', 'kdp', 'kdp-prepublish-checklist', 'workflow-export', 'calibre-epub', 'audiobook', 'audio-express', 'audio', 'audit-pilot', 'kdp-keywords-pro'] },
  { id: 'marketing', label: 'Vendre', match: ['marketing', 'monetization', 'advanced', 'launch-plan', 'editorial-quality', 'final-diagnosis', 'kdp-ads-guide', 'chrome-extension'] },
];

const HIDE_TABBAR_ON = new Set([
  'onboarding',
  'coloring',
  'bd-studio',
  'settings',
  'subscription',
]);

// Sous-onglets contextuels par famille (les outils courants).
const PLANNER_SUBTABS: Record<FamilyId, Array<{ id: string; label: string }>> = {
  planner: [
    { id: 'workflow-dashboard', label: 'Tableau de bord IA' },
    { id: 'planner', label: 'Plan du livre' },
    { id: 'characters', label: 'Personnages' },
    { id: 'templates', label: 'Modèles' },
    { id: 'doc-transform', label: 'Importer un doc' },
    { id: 'projects', label: 'Mes projets' },
  ],
  writing: [
    { id: 'complete-workflow', label: 'Workflow complet' },
    { id: 'writing', label: 'Chapitre par chapitre' },
    { id: 'aichat', label: 'AI Chat' },
    { id: 'strict-proofread', label: 'Proofread strict' },
    { id: 'humanize-anti-ia', label: 'Anti-IA / humaniser' },
    { id: 'multi-translator', label: 'Traduction' },
  ],
  images: [
    { id: 'images-cover', label: 'Studio image' },
    { id: 'cover', label: 'Couverture IA' },
    { id: 'cover-design-editor', label: 'Éditeur de couverture' },
    { id: 'backcover', label: '4ᵉ de couverture' },
    { id: 'images-library', label: 'Bibliothèque' },
  ],
  export: [
    { id: 'kdp', label: 'Export KDP' },
    { id: 'kdp-prepublish-checklist', label: 'Checklist KDP' },
    { id: 'calibre-epub', label: 'Export EPUB' },
    { id: 'audiobook', label: 'Audiobook' },
    { id: 'audio-express', label: 'Audio Express' },
  ],
  marketing: [
    { id: 'marketing', label: 'Plan marketing' },
    { id: 'launch-plan', label: 'Plan de lancement' },
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

  return (
    <header
      className="sticky top-0 z-40 w-full backdrop-blur-md"
      style={{
        backgroundColor: 'rgba(250,250,250,0.85)',
        borderBottom: '1px solid hsl(var(--joy-ink) / 0.08)',
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
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
          {projectTitle && (
            <>
              <span className="text-joy-ink/30 text-base">›</span>
              <span
                className="truncate font-serif italic text-joy-ink/90"
                title={projectTitle}
              >
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

      {showTabBar && (
        <>
          {/* Rangée principale : familles + Tous les outils */}
          <nav
            className="border-t border-joy-ink/5 bg-white/60"
            aria-label="Étapes du livre"
          >
            <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-3 py-2 sm:px-6 scrollbar-thin">
              <div className="flex items-center gap-1 flex-1 min-w-0">
                {PLANNER_TABS.map((tab) => {
                  const active = isFamilyActive(tab);
                  return (
                    <button
                      key={tab.id}
                      onClick={() => onTabChange?.(tab.id)}
                      className={cn(
                        'flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-all',
                        active
                          ? 'text-white shadow-sm'
                          : 'text-joy-ink/70 hover:bg-joy-cream hover:text-joy-ink',
                      )}
                      style={
                        active
                          ? { backgroundColor: 'hsl(var(--joy-teal))' }
                          : undefined
                      }
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <Popover open={allToolsOpen} onOpenChange={setAllToolsOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full text-joy-ink/75 hover:text-joy-ink hover:bg-joy-cream gap-1.5 px-3 flex-shrink-0"
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline text-xs font-semibold">Tous les outils</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  className="w-[min(92vw,860px)] p-0 rounded-2xl overflow-hidden"
                >
                  <div className="p-3 border-b border-joy-ink/8 bg-joy-cream/30">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-joy-ink/40" />
                      <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Rechercher un outil…"
                        className="pl-8 h-9 rounded-full bg-white border-joy-ink/10 text-sm"
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-0 max-h-[60vh] overflow-y-auto">
                    {filteredTools.map((group) => (
                      <div
                        key={group.family}
                        className="p-3 border-r border-b border-joy-ink/5 last:border-r-0"
                      >
                        <div className="text-[10px] font-bold uppercase tracking-widest text-joy-ink/55 mb-2 px-1">
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
                                    'w-full text-left text-sm rounded-lg px-2 py-1.5 transition-colors',
                                    active
                                      ? 'bg-joy-teal/10 text-joy-ink font-semibold'
                                      : 'text-joy-ink/75 hover:bg-joy-cream hover:text-joy-ink',
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
                      <div className="col-span-full p-6 text-center text-sm text-joy-ink/55">
                        Aucun outil ne correspond à « {search} ».
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </nav>

          {/* Sous-barre contextuelle */}
          {currentFamily && PLANNER_SUBTABS[currentFamily]?.length > 0 && (
            <nav
              className="border-t border-joy-ink/5 bg-white/40"
              aria-label="Outils de l'étape"
            >
              <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-3 py-1.5 sm:px-6 scrollbar-thin">
                {PLANNER_SUBTABS[currentFamily].map((sub) => {
                  const active = isSubActive(sub.id);
                  return (
                    <button
                      key={sub.id}
                      onClick={() => onTabChange?.(sub.id)}
                      className={cn(
                        'flex-shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-all',
                        active
                          ? 'bg-joy-teal/10 text-joy-ink font-semibold'
                          : 'text-joy-ink/60 hover:text-joy-ink hover:bg-joy-cream',
                      )}
                      style={active ? { color: '#008296' } : undefined}
                    >
                      {sub.label}
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
