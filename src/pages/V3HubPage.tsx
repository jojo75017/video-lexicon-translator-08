import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Sparkles, Compass, Lock, ArrowRight, Wand2, CheckCircle2, Layers, Bot, Infinity as InfinityIcon, ShieldCheck, Save, Image as ImageIcon, BookOpen, GraduationCap, Gem, Map as MapIcon, FileText, Copy, Check, Menu, X, PanelLeftClose, PanelLeftOpen, Gauge, type LucideIcon } from 'lucide-react';
import {
  V3_MODULES, V3_PILLAR_META, getModuleAccess, getModuleById, type V3Pillar, type V3Module,
} from '@/data/roadmapV3';
import { isModuleClickable, V3ModuleDialog } from '@/components/admin/v3ModuleRegistry';
import { V3HubTour } from '@/components/admin/V3HubTour';
import useV3Entitlement from '@/hooks/useV3Entitlement';
import CreateBookHub from '@/components/admin/CreateBookHub';
import V2V3Compare from '@/components/admin/V2V3Compare';
import V3PricingTiers from '@/components/admin/V3PricingTiers';
import EditionWorkflow from '@/components/admin/EditionWorkflow';
import V3AccessRecap from '@/components/admin/V3AccessRecap';
import V3LaunchLinks from '@/components/admin/V3LaunchLinks';
import V3GuidesSection from '@/components/admin/V3GuidesSection';
import V3RoadmapTab from '@/components/admin/V3RoadmapTab';
import MaisonEditionTab from '@/components/admin/MaisonEditionTab';
import HubAiChat from '@/components/admin/HubAiChat';
import DocumentationStudio from '@/components/documentation-studio/DocumentationStudio';
import { DELIVERABLE_GROUPS, DOC_TEMPLATES, PRODUCT_TYPES } from '@/components/documentation-studio/constants';
const DS_CREAM = '#FBF6EC';
const ALL_DELIVERABLE_COUNT = DELIVERABLE_GROUPS.reduce((n, g) => n + g.items.length, 0);
import hubBackgroundAsset from '@/assets/v3/hub-v3-background.jpg';
import pillarIa from '@/assets/v3/pillar-ia.jpg';
import pillarPublier from '@/assets/v3/pillar-publier.jpg';
import pillarMonetiser from '@/assets/v3/pillar-monetiser.jpg';
import pillarMarketing from '@/assets/v3/pillar-marketing.jpg';
import videoOctoberScript from '../../SCRIPT_VIDEO_OCTOBRE_V3.md?raw';
import brandBookPdf from '@/assets/brandbook/brandbook-pdf.asset.json';
import brandBookDocx from '@/assets/brandbook/brandbook-docx.asset.json';

const PILLAR_IMG: Record<V3Pillar, string> = {
  ia: pillarIa,
  publier: pillarPublier,
  monetiser: pillarMonetiser,
  marketing: pillarMarketing,
  edition: pillarPublier,
  distribution: pillarMarketing,
  promotion: pillarMarketing,
  data: pillarMarketing,
};

const TOUR_KEY = 'v3hub_tour_done';

// Palette « Clair Ambre » — locale à cette page uniquement (inspirée du blog EbookStudio).
const AMBER = '#E8951E';        // ambre principal
const AMBER_DEEP = '#C97A14';   // ambre profond (texte accent)
const AMBER_SOFT = '#FFF3DF';   // pastille douce
const CREAM = '#FBF6EC';        // fond crème
const INK = '#2A2118';          // texte sombre chaud
const SERIF = "'Instrument Serif', Georgia, 'Times New Roman', serif";
const SANS = "'Inter', system-ui, sans-serif";

// L'écriture/rédaction (STUDIO de création) vit dans « IA avancée » : c'est le 1er palier.
const PILLAR_ORDER: V3Pillar[] = ['ia', 'publier', 'data', 'monetiser', 'marketing', 'edition', 'distribution', 'promotion'];

// Phrase d'intro par pilier : donne un fil conducteur clair dans l'onglet Outils.
const PILLAR_INTRO: Record<V3Pillar, string> = {
  ia: 'Commencez ici : trouvez votre idée et rédigez votre livre avec l\'IA.',
  publier: 'Mettez en forme et publiez votre livre sur Amazon KDP sans stress.',
  monetiser: 'Transformez votre livre en revenus : audiobooks, formats premium.',
  marketing: 'Faites connaître votre livre et déclenchez vos premières ventes.',
  edition: 'Passez au niveau maison d\'édition : finitions et qualité pro.',
  distribution: 'Élargissez votre diffusion au-delà d\'Amazon.',
  promotion: 'Boostez la visibilité avec des campagnes et de la presse.',
  data: 'Étudiez le marché Amazon : niches rentables, ventes estimées et mots-clés.',
};




/** Carte module premium claire avec léger tilt + halo ambré au survol. */
function ModuleCard({
  module,
  index,
  onOpen,
  isFirst,
  unlocked,
}: {
  module: V3Module;
  index: number;
  onOpen: (m: V3Module) => void;
  isFirst?: boolean;
  /** L'abonné a-t-il réellement débloqué ce module (selon son achat) ? */
  unlocked?: boolean;
}) {
  const ref = React.useRef<HTMLButtonElement>(null);
  const clickable = isModuleClickable(module.id);
  const access = getModuleAccess(module.id);


  const statusColor = module.status === 'done' ? '#1f9d6b'
    : module.status === 'in_progress' ? AMBER_DEEP : '#a18a6c';
  const statusLabel = module.status === 'done' ? 'Prêt'
    : module.status === 'in_progress' ? 'En cours' : 'Bientôt';

  return (
    <button
      ref={ref}
      data-tour={isFirst ? 'card' : undefined}
      onClick={() => clickable && onOpen(module)}
      disabled={!clickable}
      style={{ animationDelay: `${Math.min(index * 40, 600)}ms` }}
      className={`group relative animate-fade-in text-left rounded-2xl border border-[#eadfc9] bg-white transition-all duration-300 overflow-hidden
        ${clickable ? 'cursor-pointer hover:-translate-y-0.5 hover:border-[#E8951E]/50 hover:shadow-[0_10px_30px_-18px_rgba(232,149,30,0.45)]' : 'opacity-55 cursor-not-allowed'}`}
    >
      {/* liseré ambré supérieur */}
      <span className="pointer-events-none absolute inset-x-6 top-0 h-px opacity-50 group-hover:opacity-100 transition-opacity"
        style={{ background: `linear-gradient(90deg, transparent, ${AMBER}, transparent)` }} />
      {/* bannière illustrée du pilier */}
      <div className="relative h-24 overflow-hidden">
        <img
          src={PILLAR_IMG[module.pillar]}
          alt=""
          loading="lazy"
          width={768}
          height={512}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(255,255,255,0.85) 100%)' }} />
      </div>
      <div className="relative rounded-b-2xl p-4 -mt-1">
        <div className="flex items-center justify-between mb-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl text-lg border border-[#eadfc9] bg-[#FCF8F0] group-hover:border-[#E8951E]/40 transition-colors">
            {V3_PILLAR_META[module.pillar].emoji}
          </span>
          <div className="flex flex-wrap items-center justify-end gap-1.5">
            {/* Badge d'accès : Inclus 197€ vs Option payante */}
            {access === 'included' ? (
              <span className="inline-flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full px-2 py-0.5"
                style={{ background: '#e8f7ef', color: '#0b6e4c', border: '1px solid #0f8a5f55' }}>
                <CheckCircle2 className="h-2.5 w-2.5" /> Inclus 197€
              </span>
            ) : (
              <span className="inline-flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full px-2 py-0.5"
                style={{ background: AMBER_SOFT, color: AMBER_DEEP, border: `1px solid ${AMBER}55` }}>
                <Lock className="h-2.5 w-2.5" /> Pack
              </span>
            )}
            {/* Statut de déblocage selon l'achat réel */}
            {unlocked ? (
              <span className="inline-flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full px-2 py-0.5"
                style={{ background: '#e8f7ef', color: '#0b6e4c' }}>
                <ShieldCheck className="h-2.5 w-2.5" /> Débloqué
              </span>
            ) : access === 'pack' ? (
              <span className="inline-flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full px-2 py-0.5"
                style={{ background: '#f3ece0', color: '#a18a6c' }}>
                À débloquer
              </span>
            ) : null}
            <span data-tour={isFirst ? 'status' : undefined} className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider rounded-full px-2 py-0.5"
              style={{ background: `${statusColor}18`, color: statusColor }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: statusColor }} />
              {statusLabel}
            </span>
          </div>
        </div>
        <div className="text-[15px] font-semibold leading-tight mb-1" style={{ fontFamily: SERIF, color: INK }}>
          {module.title}
        </div>
        <p className="text-[11px] leading-snug line-clamp-3" style={{ color: '#7c6b54' }}>{module.description}</p>
        {clickable && (
          <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold transition-colors" style={{ color: '#b29a72' }}>
            <span className="group-hover:text-[#C97A14] transition-colors">Ouvrir l'outil</span>
            <ArrowRight className="h-3 w-3 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all group-hover:text-[#C97A14]" />
          </span>
        )}
      </div>
    </button>
  );
}


type HubTab = 'parcours' | 'outils' | 'documentation' | 'livres' | 'guides' | 'offres' | 'roadmap' | 'script' | 'assistant' | 'bookperfect' | 'export';

const HUB_TABS: { id: HubTab; label: string; icon: LucideIcon }[] = [
  { id: 'parcours', label: 'Parcours', icon: Compass },
  { id: 'outils', label: 'Outils', icon: Wand2 },
  { id: 'documentation', label: 'Documentation Studio', icon: Sparkles },
  { id: 'livres', label: 'Mes livres', icon: BookOpen },
  { id: 'guides', label: 'Guides', icon: GraduationCap },
  { id: 'offres', label: 'Offres & Packs', icon: Gem },
  { id: 'roadmap', label: 'Roadmap', icon: MapIcon },
  { id: 'script', label: 'Script vidéo', icon: FileText },
  { id: 'assistant', label: "Parler avec l'IA", icon: Bot },
  { id: 'bookperfect', label: 'BookPerfect AI', icon: BookOpen },
  { id: 'export', label: 'Exporter le livre', icon: Download },
];

const TAB_STORAGE_KEY = 'v3hub_active_tab';

const V3HubPage: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [pillar, setPillar] = useState<V3Pillar | 'all' | 'mine'>('all');
  const [activeTab, setActiveTab] = useState<HubTab>(() => {
    const fromUrl = new URLSearchParams(window.location.search).get('tab') as HubTab | null;
    if (fromUrl && HUB_TABS.some((t) => t.id === fromUrl)) return fromUrl;
    const stored = localStorage.getItem(TAB_STORAGE_KEY) as HubTab | null;
    if (stored && HUB_TABS.some((t) => t.id === stored)) return stored;
    return 'parcours';
  });
  const [selected, setSelected] = useState<V3Module | null>(null);
  const [studioSource, setStudioSource] = useState<string | null>(null);
  const [tourOpen, setTourOpen] = useState(false);
  const [scriptCopied, setScriptCopied] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(
    () => localStorage.getItem('v3hub_sidebar_collapsed') === '1',
  );
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { hasBase, hasFull, isAdmin } = useV3Entitlement();

  // Aperçu admin : simuler la vue d'un acheteur d'un palier (sans quitter ses droits réels).
  // 'real' = mes droits · 'base' = vue 197€ · 'full' = vue Pack Pro 347€.
  const [previewTier, setPreviewTier] = useState<'real' | 'base' | 'full'>('real');
  const previewing = isAdmin && previewTier !== 'real';

  // Persiste l'état réduit de la sidebar.
  useEffect(() => {
    localStorage.setItem('v3hub_sidebar_collapsed', sidebarCollapsed ? '1' : '0');
  }, [sidebarCollapsed]);

  // Persiste l'onglet actif (URL + localStorage).
  useEffect(() => {
    localStorage.setItem(TAB_STORAGE_KEY, activeTab);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', activeTab);
    window.history.replaceState({}, '', url);
  }, [activeTab]);

  // Rend le body transparent sur cette page pour que le fond illustré soit visible.
  useEffect(() => {
    const originalBg = document.body.style.background;
    document.body.style.background = 'transparent';
    return () => { document.body.style.background = originalBg; };
  }, []);

  // Un module est "débloqué" si l'abonné a la formule correspondante.
  const isUnlocked = React.useCallback((m: V3Module) => {
    // Mode aperçu admin : on simule le palier choisi (197€ ou 347€).
    if (previewing) {
      const isPremium = getModuleAccess(m.id) === 'pack';
      return previewTier === 'full' ? true : !isPremium;
    }
    if (isAdmin) return true;
    return getModuleAccess(m.id) === 'pack' ? hasFull : hasBase;
  }, [isAdmin, hasBase, hasFull, previewing, previewTier]);


  useEffect(() => {
    if (!localStorage.getItem(TOUR_KEY)) {
      const t = setTimeout(() => setTourOpen(true), 1000);
      return () => clearTimeout(t);
    }
  }, []);

  const finishTour = () => {
    localStorage.setItem(TOUR_KEY, 'true');
    setTourOpen(false);
  };

  // Ouvre le STUDIO V3 (BookCreationStudio) sans quitter le Hub V3, avec la source pré-sélectionnée.
  const openStudio = (sourceId: string) => {
    const studio = V3_MODULES.find((m) => m.id === 'book-creation-studio');
    if (studio) {
      setStudioSource(sourceId);
      setSelected(studio);
    }
  };

  const openModule = (id: string) => {
    const mod = getModuleById(id);
    if (mod) setSelected(mod);
  };

  const copyVideoScript = async () => {
    await navigator.clipboard.writeText(videoOctoberScript);
    setScriptCopied(true);
    window.setTimeout(() => setScriptCopied(false), 1800);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return V3_MODULES.filter((m) => {
      if (pillar === 'mine' && !isUnlocked(m)) return false;
      if (pillar !== 'all' && pillar !== 'mine' && m.pillar !== pillar) return false;
      if (!q) return true;
      return m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q);
    });
  }, [query, pillar, isUnlocked]);

  const readyCount = useMemo(() => V3_MODULES.filter((m) => isModuleClickable(m.id)).length, []);
  const myToolsCount = useMemo(() => V3_MODULES.filter(isUnlocked).length, [isUnlocked]);

  const stats = [
    { icon: CheckCircle2, value: readyCount, label: 'Outils prêts' },
    { icon: Wand2, value: V3_MODULES.length, label: 'Modules V3' },
    { icon: Layers, value: PILLAR_ORDER.length, label: 'Piliers' },
    { icon: InfinityIcon, value: '197€', label: 'Livres illimités inclus' },
  ];

  // Liste de navigation partagée (sidebar desktop + tiroir mobile).
  const navList = (collapsed: boolean, onNavigate?: () => void) => (
    <div className="flex flex-col gap-1">
      {HUB_TABS.map((t) => {
        const active = activeTab === t.id;
        const Icon = t.icon;
        return (
          <button
            key={t.id}
            onClick={() => { setActiveTab(t.id); onNavigate?.(); }}
            title={collapsed ? t.label : undefined}
            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${collapsed ? 'justify-center' : ''}`}
            style={{
              background: active ? AMBER_SOFT : 'transparent',
              color: active ? INK : '#9a8666',
              border: active ? `1px solid ${AMBER}44` : '1px solid transparent',
            }}
          >
            <Icon className="h-[18px] w-[18px] shrink-0" style={{ color: active ? AMBER_DEEP : '#b29a72' }} />
            {!collapsed && <span>{t.label}</span>}
          </button>
        );
      })}
    </div>
  );

  const createBtn = (collapsed: boolean, onNavigate?: () => void) => (
    <button
      onClick={() => { setActiveTab('livres'); onNavigate?.(); }}
      title={collapsed ? 'Créer un livre' : undefined}
      className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-12px_rgba(232,149,30,0.6)]`}
      style={{ background: `linear-gradient(90deg, ${AMBER}, #FFB44D)` }}
    >
      <Wand2 className="h-4 w-4 shrink-0" />
      {!collapsed && <span>Créer un livre</span>}
    </button>
  );

  return (
    <div className="relative min-h-screen" style={{ color: INK, fontFamily: SANS }}>
      {/* Fond illustré jovial fixé au viewport */}
      <div
        className="pointer-events-none fixed inset-0 bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${hubBackgroundAsset})`, backgroundPosition: 'center bottom' }}
        aria-hidden="true"
      />
      {/* Overlay crème équilibré : lisibilité globale + image visible */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{ background: 'linear-gradient(180deg, rgba(251,246,236,0.62) 0%, rgba(251,246,236,0.38) 45%, rgba(251,246,236,0.38) 55%, rgba(251,246,236,0.62) 100%)' }}
        aria-hidden="true"
      />
      <div className="relative z-10 flex">
      {/* ===================== SIDEBAR (desktop) ===================== */}
      <aside
        className="hidden lg:flex sticky top-0 h-screen shrink-0 flex-col border-r border-[#eadfc9] transition-[width] duration-300"
        style={{ width: sidebarCollapsed ? 76 : 244, background: 'rgba(251,246,236,0.96)' }}
      >
        <div className="flex items-center gap-2 px-4 py-5">
          {!sidebarCollapsed && (
            <span className="text-xl font-medium leading-none" style={{ fontFamily: SERIF, color: INK }}>
              Hub <span className="italic" style={{ color: AMBER_DEEP }}>V3</span>
            </span>
          )}
          <button
            onClick={() => setSidebarCollapsed((c) => !c)}
            className="ml-auto grid h-8 w-8 place-items-center rounded-lg border transition-colors hover:bg-[#FFF3DF]"
            style={{ borderColor: '#eadfc9', color: AMBER_DEEP }}
            aria-label={sidebarCollapsed ? 'Déplier le menu' : 'Réduire le menu'}
          >
            {sidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-3">{navList(sidebarCollapsed)}</div>
        <div className="border-t border-[#eadfc9] p-3">{createBtn(sidebarCollapsed)}</div>
      </aside>

      {/* ===================== TIROIR (mobile) ===================== */}
      {mobileNavOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileNavOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 max-w-[80%] flex flex-col shadow-2xl" style={{ background: CREAM }}>
            <div className="flex items-center justify-between px-4 py-5 border-b border-[#eadfc9]">
              <span className="text-xl font-medium" style={{ fontFamily: SERIF, color: INK }}>
                Hub <span className="italic" style={{ color: AMBER_DEEP }}>V3</span>
              </span>
              <button
                onClick={() => setMobileNavOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-lg border transition-colors hover:bg-[#FFF3DF]"
                style={{ borderColor: '#eadfc9', color: AMBER_DEEP }}
                aria-label="Fermer le menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-3">{navList(false, () => setMobileNavOpen(false))}</div>
            <div className="border-t border-[#eadfc9] p-3">{createBtn(false, () => setMobileNavOpen(false))}</div>
          </div>
        </div>
      )}

      {/* ===================== COLONNE DE CONTENU ===================== */}
      <div className="flex-1 min-w-0">
      {/* Barre supérieure mobile avec hamburger */}
      <div className="lg:hidden sticky top-0 z-30 flex items-center gap-3 border-b border-[#eadfc9] px-4 py-3 backdrop-blur-md" style={{ background: 'rgba(251,246,236,0.9)' }}>
        <button
          onClick={() => setMobileNavOpen(true)}
          className="grid h-9 w-9 place-items-center rounded-lg border transition-colors hover:bg-[#FFF3DF]"
          style={{ borderColor: '#eadfc9', color: AMBER_DEEP }}
          aria-label="Ouvrir le menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="text-lg font-medium" style={{ fontFamily: SERIF, color: INK }}>
          {HUB_TABS.find((t) => t.id === activeTab)?.label ?? 'Hub V3'}
        </span>
      </div>
      {/* Hero */}
      <header className="relative overflow-hidden border-b border-[#eadfc9]" data-tour="hero">
        {/* Overlay local : le texte prime, l'image reste riche sur les zones libres */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 92% 140% at 18% 50%, rgba(251,246,236,0.94) 0%, rgba(251,246,236,0.76) 42%, rgba(251,246,236,0.44) 72%, rgba(251,246,236,0.08) 100%)',
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:py-16">
          <div className="flex items-center justify-between mb-8">
            <button
              data-tour="back"
              onClick={() => navigate('/admin-cockpit')}
              className="inline-flex items-center gap-1.5 text-xs transition-all duration-300 hover:text-[#C97A14] hover:-translate-y-0.5"
              style={{ color: '#9a8666' }}
            >
              <ArrowLeft className="h-4 w-4" /> Retour au cockpit
            </button>
            <div className="flex items-center gap-2">
              {isAdmin && (
                <button
                  onClick={() => navigate('/business-center')}
                  className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-all duration-300 hover:bg-[#FFF3DF] hover:border-[#E8951E] hover:-translate-y-0.5 hover:shadow-sm"
                  style={{ borderColor: `${AMBER}66`, color: AMBER_DEEP }}
                >
                  <Gauge className="h-4 w-4" /> Business Center
                </button>
              )}
              <button
                onClick={() => setTourOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-all duration-300 hover:bg-[#FFF3DF] hover:border-[#E8951E] hover:-translate-y-0.5 hover:shadow-sm"
                style={{ borderColor: `${AMBER}66`, color: AMBER_DEEP }}
              >
                <Compass className="h-4 w-4" /> Visite guidée
              </button>
            </div>
          </div>

          <div className="v3-rise inline-flex items-center gap-2 mb-5 rounded-full border px-3 py-1"
            style={{ borderColor: `${AMBER}33`, background: `${AMBER}14` }}>
            <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: AMBER }} />
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: AMBER_DEEP }}>
              Publication Assistée Pro
            </span>
          </div>
          <h1 className="v3-rise text-5xl sm:text-7xl font-semibold leading-[1.05] max-w-4xl tracking-tight"
            style={{ animationDelay: '0.08s', fontFamily: SERIF, color: INK, textShadow: '0 2px 28px rgba(251,246,236,0.85)' }}>
            Votre <span className="italic" style={{ color: AMBER_DEEP }}>maison d'édition numérique</span> commence ici.
          </h1>
          <p className="v3-rise mt-5 text-base sm:text-lg max-w-2xl leading-relaxed" style={{ animationDelay: '0.16s', color: '#6f5e47' }}>
            98 outils professionnels pour écrire, illustrer, publier, narrer et vendre vos livres depuis une seule plateforme.
          </p>

          <div className="v3-rise mt-8 flex flex-wrap items-center gap-3" style={{ animationDelay: '0.24s' }}>
            <button
              onClick={() => setActiveTab('livres')}
              className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_20px_45px_-14px_rgba(232,149,30,0.55)] active:translate-y-0 active:scale-[0.99]"
              style={{ background: `linear-gradient(90deg, ${AMBER}, #FFB44D)`, color: '#fff' }}>
              <Wand2 className="h-4 w-4" /> Créer un livre
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <button onClick={() => openModule('library')}
              className="inline-flex items-center gap-1.5 rounded-full px-5 py-3 text-sm font-bold border transition-all duration-300 ease-out hover:bg-[#FFF8F0] hover:border-[#E8951E] hover:-translate-y-1 hover:shadow-md active:translate-y-0 active:scale-[0.99]"
              style={{ borderColor: `${AMBER}66`, color: AMBER_DEEP }}>
              <Save className="h-4 w-4" /> Mes sauvegardes
            </button>
            <button onClick={() => openModule('cover-studio-pro')}
              className="inline-flex items-center gap-1.5 rounded-full px-5 py-3 text-sm font-bold border transition-all duration-300 ease-out hover:bg-[#FFF8F0] hover:border-[#E8951E] hover:-translate-y-1 hover:shadow-md active:translate-y-0 active:scale-[0.99]"
              style={{ borderColor: `${AMBER}66`, color: AMBER_DEEP }}>
              <ImageIcon className="h-4 w-4" /> Image / Couverture
            </button>
            <button onClick={() => setActiveTab('offres')} data-tour="price" className="inline-flex items-center gap-1.5 rounded-full px-5 py-3 text-sm font-semibold border transition-all duration-300 ease-out hover:bg-[#FFF8F0] hover:border-[#E8951E] hover:-translate-y-1 hover:shadow-md active:translate-y-0 active:scale-[0.99]"
              style={{ borderColor: `${AMBER}66`, color: AMBER_DEEP }}>
              <Sparkles className="h-4 w-4" /> Dès 197€ à vie · 3× ou 6×
            </button>
            <button onClick={() => setActiveTab('script')} className="inline-flex items-center gap-1.5 rounded-full px-5 py-3 text-sm font-bold border transition-all duration-300 ease-out hover:bg-[#FFF8F0] hover:border-[#E8951E] hover:-translate-y-1 hover:shadow-md active:translate-y-0 active:scale-[0.99]"
              style={{ borderColor: `${AMBER}66`, color: AMBER_DEEP }}>
              <FileText className="h-4 w-4" /> Voir le script vidéo
            </button>
            <button
              onClick={() => setActiveTab('assistant')}
              className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_20px_45px_-14px_rgba(232,149,30,0.55)] active:translate-y-0 active:scale-[0.99]"
              style={{ background: `linear-gradient(90deg, ${AMBER_DEEP}, ${AMBER})`, color: '#fff' }}>
              <Bot className="h-4 w-4" /> Parler avec l'IA
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>

          {/* Barre de statistiques premium */}
          <div className="v3-rise mt-12 grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-3xl" style={{ animationDelay: '0.32s' }}>
            {stats.map((s) => (
              <div key={s.label} className="group rounded-2xl border px-6 py-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_12px_32px_-12px_rgba(232,149,30,0.22)]" style={{ background: CREAM, borderColor: `${AMBER}22` }}>
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105" style={{ background: AMBER_SOFT }}>
                  <s.icon className="h-5 w-5" style={{ color: AMBER_DEEP }} />
                </div>
                <div className="text-3xl font-semibold leading-none tabular-nums" style={{ fontFamily: SERIF, color: INK }}>
                  {s.value}
                </div>
                <div className="mt-2 text-[11px] uppercase tracking-wider font-medium" style={{ color: '#a18a6c' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* ===================== ONGLET PARCOURS ===================== */}
        {activeTab === 'parcours' && (
          <>
            {/* Extension Scanner KDP — GRATUITE pour tous (non gated) */}
            <button
              onClick={() => navigate('/extension-chrome')}
              className="group w-full text-left mb-6 rounded-2xl border p-5 flex flex-wrap items-center gap-4 transition-all hover:-translate-y-0.5"
              style={{ background: AMBER_SOFT, borderColor: `${AMBER}55` }}
            >
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl"
                style={{ background: '#fff', border: `1px solid ${AMBER}33` }}
              >
                🧩
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="font-bold" style={{ color: INK }}>Extension Scanner KDP</span>
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-white" style={{ background: '#1f9d6b' }}>
                    Gratuit pour tous
                  </span>
                </span>
                <span className="mt-1 block text-[13px]" style={{ color: '#8a7860' }}>
                  Analyse n'importe quelle fiche Amazon Kindle en 1 clic : score /100, BSR, ventes & revenus estimés (données officielles), concurrence, mots-clés et pépites.
                </span>
              </span>
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold text-white transition-colors"
                style={{ background: AMBER_DEEP }}
              >
                <Sparkles className="h-4 w-4" /> Installer <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>

            {/* Parcours guidé V3 — entrée principale du Hub V3 */}
            <EditionWorkflow onOpenModule={setSelected} />
          </>
        )}

        {/* ===================== ONGLET OUTILS ===================== */}
        {activeTab === 'outils' && (
          <>
            {/* Aide : les outils suivent l'ordre logique des étapes */}
            <div className="mb-4 rounded-xl border p-3 text-[13px]" style={{ background: AMBER_SOFT, borderColor: `${AMBER}44`, color: '#6f5e47' }}>
              <span className="font-semibold" style={{ color: AMBER_DEEP }}>💡 Suivez les étapes numérotées</span> — les outils sont rangés dans l'ordre logique&nbsp;: écrire → publier → monétiser → faire connaître. Pas sûr par où commencer&nbsp;? Ouvrez l'onglet <span className="font-semibold">Parcours</span>.
            </div>
            {/* Aperçu admin : simuler la vue d'un acheteur 197€ / 347€ (QA sans payer) */}
            {isAdmin && (
              <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border p-3" style={{ background: '#fff', borderColor: `${AMBER}44` }}>
                <span className="text-[12px] font-bold" style={{ color: AMBER_DEEP }}>🧪 Aperçu acheteur (admin) :</span>
                {[
                  { id: 'real', label: 'Mes droits (admin)' },
                  { id: 'base', label: 'Vue 197€ (base)' },
                  { id: 'full', label: 'Vue 347€ (Pack Pro)' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setPreviewTier(opt.id as 'real' | 'base' | 'full')}
                    className="rounded-full px-3 py-1.5 text-[12px] font-semibold border transition-colors"
                    style={previewTier === opt.id
                      ? { background: AMBER, color: '#fff', borderColor: AMBER }
                      : { background: 'transparent', color: '#6f5e47', borderColor: '#eadfc9' }}
                  >
                    {opt.label}
                  </button>
                ))}
                {previewing && (
                  <span className="text-[11px]" style={{ color: '#a18a6c' }}>
                    Simulation : {myToolsCount}/{V3_MODULES.length} outils débloqués pour ce palier.
                  </span>
                )}
              </div>
            )}
            {/* Recherche + filtres par pilier */}
            <div className="-mx-4 px-4 py-3 mb-6">


              <div className="relative max-w-md mb-3" data-tour="search">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#b29a72' }} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Rechercher un outil…"
                  className="w-full rounded-full bg-white border border-[#eadfc9] pl-9 pr-4 py-2.5 text-sm placeholder:text-[#b29a72] focus:outline-none focus:border-[#E8951E] transition-colors"
                  style={{ color: INK }}
                />
              </div>
              <div className="flex flex-wrap items-center gap-2" data-tour="filters">
                <FilterChip active={pillar === 'mine'} onClick={() => setPillar('mine')} label={`✅ Mes outils (${myToolsCount})`} />
                <FilterChip active={pillar === 'all'} onClick={() => setPillar('all')} label={`Tous (${V3_MODULES.length})`} />
                {PILLAR_ORDER.map((p) => (
                  <FilterChip
                    key={p}
                    active={pillar === p}
                    onClick={() => setPillar(p)}
                    label={`${V3_PILLAR_META[p].emoji} ${V3_PILLAR_META[p].label}`}
                  />
                ))}
              </div>
              {/* Légende des droits */}
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]" style={{ color: '#8a7860' }}>
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" style={{ color: '#0f8a5f' }} /> Inclus dans la base 197€ (livres & ebooks illimités)
                </span>
                <span className="inline-flex items-center gap-1">
                  <Lock className="h-3 w-3" style={{ color: AMBER }} /> Disponible en pack premium (audiobooks, marketing, couvertures pro…)
                </span>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20 text-sm" style={{ color: '#a18a6c' }}>
                {pillar === 'mine'
                  ? 'Aucun outil débloqué pour le moment. Démarrez avec la base 197€ pour accéder à la création de livres illimités.'
                  : `Aucun outil ne correspond à « ${query} ».`}
              </div>
            ) : pillar === 'all' ? (
              (() => {
                const firstPillarWithItems = PILLAR_ORDER.find((p) => filtered.some((m) => m.pillar === p));
                return PILLAR_ORDER.map((p) => {
                  const items = filtered.filter((m) => m.pillar === p);
                  if (items.length === 0) return null;
                  const stepNo = PILLAR_ORDER.filter((pp) => filtered.some((m) => m.pillar === pp)).indexOf(p) + 1;
                  return (
                    <section key={p} className="mb-10">
                      <div className="flex items-center gap-3 mb-1.5">
                        <span
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black text-white"
                          style={{ background: AMBER_DEEP }}
                        >
                          {stepNo}
                        </span>
                        <span className="text-xl">{V3_PILLAR_META[p].emoji}</span>
                        <h2 className="text-lg font-bold" style={{ fontFamily: SERIF, color: INK }}>{V3_PILLAR_META[p].label}</h2>
                        <span className="text-xs" style={{ color: '#b29a72' }}>{items.length}</span>
                        <div className="flex-1 h-px ml-2" style={{ background: `linear-gradient(90deg, ${AMBER}44, transparent)` }} />
                      </div>
                      <p className="mb-4 ml-10 text-[13px]" style={{ color: '#8a7860' }}>{PILLAR_INTRO[p]}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {items.map((m, i) => (
                          <ModuleCard key={m.id} module={m} index={i} onOpen={setSelected} unlocked={isUnlocked(m)} isFirst={p === firstPillarWithItems && i === 0} />
                        ))}
                      </div>
                    </section>
                  );
                });
              })()
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {filtered.map((m, i) => (
                  <ModuleCard key={m.id} module={m} index={i} onOpen={setSelected} unlocked={isUnlocked(m)} isFirst={i === 0} />
                ))}
              </div>
            )}
          </>
        )}

        {/* ===================== ONGLET DOCUMENTATION STUDIO ===================== */}
        {activeTab === 'documentation' && (
          <DocumentationStudio />
        )}

        {/* ===================== ONGLET MES LIVRES ===================== */}
        {activeTab === 'livres' && (
          <CreateBookHub onSelectSource={openStudio} />
        )}

        {/* ===================== ONGLET GUIDES ===================== */}
        {activeTab === 'guides' && (
          <section className="space-y-5">
            <div
              className="relative overflow-hidden rounded-2xl border p-6 sm:p-8"
              style={{ background: `linear-gradient(135deg, ${AMBER_SOFT} 0%, #ffffff 55%)`, borderColor: `${AMBER}55` }}
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-sm"
                    style={{ background: '#fff', border: `1px solid ${AMBER}44`, color: AMBER_DEEP }}
                  >
                    <BookOpen className="h-7 w-7" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-wider" style={{ background: '#fff', borderColor: `${AMBER}44`, color: AMBER_DEEP }}>
                      <Gem className="h-3.5 w-3.5" /> Document fondateur
                    </div>
                    <h2 className="mt-3 text-3xl sm:text-4xl font-medium leading-tight" style={{ fontFamily: SERIF, color: INK }}>
                      Brand Book — EbookStudio Publisher Suite
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: '#6f5e47' }}>
                      L'ouvrage de référence (85 pages) : vision, produit, 10 agents IA, design system, blueprint et prompt studio. Prêt à consulter, ici même — pas besoin d'aller le chercher.
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 flex-col gap-2 sm:min-w-[190px]">
                  <a
                    href={brandBookPdf.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5"
                    style={{ background: AMBER_DEEP }}
                  >
                    <FileText className="h-4 w-4" /> Télécharger le PDF
                  </a>
                  <a
                    href={brandBookDocx.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="inline-flex items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-all hover:-translate-y-0.5"
                    style={{ background: '#fff', borderColor: `${AMBER}55`, color: AMBER_DEEP }}
                  >
                    <FileText className="h-4 w-4" /> Version DOCX
                  </a>
                </div>
              </div>
            </div>

            {/* Brochure commerciale Documentation Studio AI */}
            <div
              className="relative overflow-hidden rounded-2xl border p-6 sm:p-8"
              style={{ background: `linear-gradient(135deg, #201912 0%, #2A2118 60%)`, borderColor: `${AMBER}55` }}
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-sm"
                    style={{ background: '#fff', border: `1px solid ${AMBER}44`, color: AMBER_DEEP }}
                  >
                    <Sparkles className="h-7 w-7" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-wider" style={{ background: 'rgba(255,255,255,0.06)', borderColor: `${AMBER}55`, color: '#F6C67D' }}>
                      <Gem className="h-3.5 w-3.5" /> Brochure commerciale
                    </div>
                    <h2 className="mt-3 text-3xl sm:text-4xl font-medium leading-tight text-white" style={{ fontFamily: SERIF }}>
                      Documentation Studio AI — Présentation
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: '#cbb9a0' }}>
                      Le document de présentation premium (30 pages) : vision, bénéfices, les 14 livrables, templates, cas d'usage, comparatif et tarifs. Idéal pour découvrir, partager ou vendre le module.
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 flex-col gap-2 sm:min-w-[190px]">
                  <button
                    onClick={async () => {
                      try {
                        const res = await fetch('/Documentation-Studio-AI-Presentation.pdf', { credentials: 'same-origin' });
                        if (!res.ok) throw new Error('fetch failed');
                        const blob = await res.blob();
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'Documentation-Studio-AI-Presentation.pdf';
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                        setTimeout(() => URL.revokeObjectURL(url), 2000);
                      } catch {
                        window.open('/Documentation-Studio-AI-Presentation.pdf', '_blank');
                      }
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5"
                    style={{ background: AMBER_DEEP }}
                  >
                    <FileText className="h-4 w-4" /> Télécharger le PDF
                  </button>
                  <button
                    onClick={() => setActiveTab('documentation')}
                    className="inline-flex items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-all hover:-translate-y-0.5"
                    style={{ background: 'rgba(255,255,255,0.06)', borderColor: `${AMBER}55`, color: '#F6C67D' }}
                  >
                    <Sparkles className="h-4 w-4" /> Ouvrir le module
                  </button>
                </div>
              </div>
            </div>

            {/* ---- Contenu détaillé de la brochure Documentation Studio AI ---- */}
            <div className="rounded-2xl border bg-white p-6 sm:p-8 space-y-10" style={{ borderColor: '#eadfc9' }}>

              {/* Le concept */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-wider" style={{ background: AMBER_SOFT, borderColor: `${AMBER}44`, color: AMBER_DEEP }}>
                  <Sparkles className="h-3.5 w-3.5" /> Le concept
                </div>
                <h3 className="mt-3 text-2xl sm:text-3xl font-medium leading-tight" style={{ fontFamily: SERIF, color: INK }}>
                  Un seul brief → toute la documentation de votre produit
                </h3>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed" style={{ color: '#6f5e47' }}>
                  Documentation Studio AI transforme une simple description en un écosystème complet de documents professionnels :
                  documentation produit, supports marketing et publications de communication. Vous décrivez votre produit une seule
                  fois, l'IA rédige, structure et met en page. Vous validez, ajustez et exportez au format de votre choix.
                </p>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { icon: '✨', t: 'Génération intelligente', d: 'Décrivez en langage naturel, l\'IA remplit chaque section. Vous gardez le contrôle total.' },
                    { icon: '🤖', t: 'Documentation Copilot', d: 'Un assistant flottant vous aide à améliorer, compléter et enrichir tout au long du parcours.' },
                    { icon: '🔄', t: 'Mise à jour intelligente', d: 'Un module change ? Seuls les documents concernés sont régénérés, pas tout le reste.' },
                  ].map((c) => (
                    <div key={c.t} className="rounded-xl border p-4" style={{ borderColor: '#eadfc9', background: DS_CREAM }}>
                      <div className="text-2xl">{c.icon}</div>
                      <div className="mt-2 text-sm font-bold" style={{ color: INK }}>{c.t}</div>
                      <p className="mt-1 text-[13px] leading-snug" style={{ color: '#8a7860' }}>{c.d}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Les 19 livrables */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-wider" style={{ background: AMBER_SOFT, borderColor: `${AMBER}44`, color: AMBER_DEEP }}>
                  <Layers className="h-3.5 w-3.5" /> Les livrables
                </div>
                <h3 className="mt-3 text-2xl sm:text-3xl font-medium leading-tight" style={{ fontFamily: SERIF, color: INK }}>
                  {ALL_DELIVERABLE_COUNT} documents générés à partir d'un seul brief
                </h3>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed" style={{ color: '#6f5e47' }}>
                  Répartis en trois familles : documentation, marketing et communication. Choisissez ceux dont vous avez besoin.
                </p>
                <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {DELIVERABLE_GROUPS.map((g) => (
                    <div key={g.id} className="rounded-xl border p-4" style={{ borderColor: '#eadfc9' }}>
                      <div className="flex items-center gap-2 text-sm font-bold" style={{ color: INK }}>
                        <span className="text-lg">{g.icon}</span> {g.label}
                        <span className="ml-auto text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: AMBER_SOFT, color: AMBER_DEEP }}>{g.items.length}</span>
                      </div>
                      <ul className="mt-3 space-y-2">
                        {g.items.map((it) => (
                          <li key={it.id} className="flex items-start gap-2 text-[13px]" style={{ color: '#6f5e47' }}>
                            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: AMBER }} />
                            <span><span className="font-semibold" style={{ color: INK }}>{it.label}</span> — {it.desc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Templates */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-wider" style={{ background: AMBER_SOFT, borderColor: `${AMBER}44`, color: AMBER_DEEP }}>
                  <ImageIcon className="h-3.5 w-3.5" /> Modèles premium
                </div>
                <h3 className="mt-3 text-2xl sm:text-3xl font-medium leading-tight" style={{ fontFamily: SERIF, color: INK }}>
                  8 templates de design inspirés des meilleures marques
                </h3>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {DOC_TEMPLATES.map((t) => (
                    <div key={t.id} className="rounded-xl border p-3" style={{ borderColor: '#eadfc9' }}>
                      <div className="flex gap-1">
                        {t.swatch.map((c, i) => (
                          <span key={i} className="h-5 w-5 rounded-full border" style={{ background: c, borderColor: '#00000012' }} />
                        ))}
                      </div>
                      <div className="mt-2 text-sm font-bold" style={{ color: INK }}>{t.label}</div>
                      <p className="text-[12px] leading-snug" style={{ color: '#8a7860' }}>{t.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Types de produits */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-wider" style={{ background: AMBER_SOFT, borderColor: `${AMBER}44`, color: AMBER_DEEP }}>
                  <Compass className="h-3.5 w-3.5" /> Pour qui ?
                </div>
                <h3 className="mt-3 text-2xl sm:text-3xl font-medium leading-tight" style={{ fontFamily: SERIF, color: INK }}>
                  Conçu pour tous les produits numériques
                </h3>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed" style={{ color: '#6f5e47' }}>
                  L'IA adapte automatiquement ses questions et ses modèles au type de produit sélectionné.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {PRODUCT_TYPES.map((p) => (
                    <span key={p.id} className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-medium" style={{ borderColor: '#eadfc9', color: '#6f5e47', background: DS_CREAM }}>
                      <span>{p.icon}</span> {p.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Formats d'export */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-wider" style={{ background: AMBER_SOFT, borderColor: `${AMBER}44`, color: AMBER_DEEP }}>
                  <FileText className="h-3.5 w-3.5" /> Exports
                </div>
                <h3 className="mt-3 text-2xl sm:text-3xl font-medium leading-tight" style={{ fontFamily: SERIF, color: INK }}>
                  Exportez dans le format qui vous convient
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {['📝 Word (.docx)', '📄 PDF Premium', '🌐 HTML', '⬇️ Markdown', '📊 PowerPoint'].map((f) => (
                    <span key={f} className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold" style={{ background: AMBER_SOFT, color: AMBER_DEEP }}>
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Le problème que ça résout */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-wider" style={{ background: AMBER_SOFT, borderColor: `${AMBER}44`, color: AMBER_DEEP }}>
                  <ShieldCheck className="h-3.5 w-3.5" /> Le problème
                </div>
                <h3 className="mt-3 text-2xl sm:text-3xl font-medium leading-tight" style={{ fontFamily: SERIF, color: INK }}>
                  Documenter un produit prend des semaines. Pas ici.
                </h3>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed" style={{ color: '#6f5e47' }}>
                  Rédiger un manuel utilisateur, une documentation technique, une FAQ, une landing page, un kit média et
                  des posts pour les réseaux : c'est des dizaines d'heures de travail, souvent repoussées ou bâclées faute de temps.
                  Résultat : des produits excellents mais mal présentés, difficiles à comprendre et compliqués à vendre.
                  Documentation Studio AI supprime ce goulot d'étranglement. Vous décrivez votre produit une fois,
                  et vous obtenez en quelques minutes un ensemble cohérent, professionnel et prêt à publier.
                </p>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { icon: '⏱️', t: 'Des semaines → des minutes', d: 'Ce qui prenait des jours de rédaction est généré et mis en page automatiquement.' },
                    { icon: '🎯', t: 'Zéro page blanche', d: 'L\'IA propose une première version complète : vous corrigez au lieu de partir de rien.' },
                    { icon: '🧩', t: 'Tout est cohérent', d: 'Même ton, même identité, même vocabulaire sur tous vos documents et supports.' },
                  ].map((c) => (
                    <div key={c.t} className="rounded-xl border p-4" style={{ borderColor: '#eadfc9', background: DS_CREAM }}>
                      <div className="text-2xl">{c.icon}</div>
                      <div className="mt-2 text-sm font-bold" style={{ color: INK }}>{c.t}</div>
                      <p className="mt-1 text-[13px] leading-snug" style={{ color: '#8a7860' }}>{c.d}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Avant / Après */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-wider" style={{ background: AMBER_SOFT, borderColor: `${AMBER}44`, color: AMBER_DEEP }}>
                  <ArrowRight className="h-3.5 w-3.5" /> Avant / Après
                </div>
                <h3 className="mt-3 text-2xl sm:text-3xl font-medium leading-tight" style={{ fontFamily: SERIF, color: INK }}>
                  La différence est immédiate
                </h3>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border p-5" style={{ borderColor: '#e6d3d0', background: '#fdf4f2' }}>
                    <div className="text-sm font-black" style={{ color: '#b4443a' }}>❌ Sans Documentation Studio</div>
                    <ul className="mt-3 space-y-2 text-[13px]" style={{ color: '#7a5a56' }}>
                      {[
                        'Documentation reportée pendant des semaines',
                        'Textes incohérents écrits à la va-vite',
                        'Pas de kit marketing ni de supports de vente',
                        'Chaque mise à jour = tout réécrire à la main',
                        'Rendu amateur qui inspire peu confiance',
                      ].map((x) => <li key={x} className="flex items-start gap-2"><span>•</span><span>{x}</span></li>)}
                    </ul>
                  </div>
                  <div className="rounded-xl border p-5" style={{ borderColor: '#cfe6d6', background: '#f2faf5' }}>
                    <div className="text-sm font-black" style={{ color: '#1f9d6b' }}>✅ Avec Documentation Studio</div>
                    <ul className="mt-3 space-y-2 text-[13px]" style={{ color: '#4c6f5c' }}>
                      {[
                        'Documentation complète générée en minutes',
                        'Ton et identité cohérents sur tous les documents',
                        'Marketing, kit média et posts réseaux inclus',
                        'Mise à jour intelligente : seuls les docs concernés changent',
                        'Rendu premium prêt à publier et à vendre',
                      ].map((x) => <li key={x} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: '#1f9d6b' }} /><span>{x}</span></li>)}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Cas d'usage */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-wider" style={{ background: AMBER_SOFT, borderColor: `${AMBER}44`, color: AMBER_DEEP }}>
                  <Compass className="h-3.5 w-3.5" /> Cas d'usage
                </div>
                <h3 className="mt-3 text-2xl sm:text-3xl font-medium leading-tight" style={{ fontFamily: SERIF, color: INK }}>
                  Ce que vous pouvez produire dès aujourd'hui
                </h3>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { t: 'Lancer un SaaS', d: 'Générez le manuel utilisateur, la doc technique, la FAQ, la landing page et les emails de lancement — le tout aligné, prêt pour le jour J.' },
                    { t: 'Vendre un plugin ou une app', d: 'Kit média, page produit, fiche AppSumo / Product Hunt et posts LinkedIn pour maximiser vos ventes dès la sortie.' },
                    { t: 'Structurer un outil IA', d: 'Documentez vos agents, leurs missions, leurs prompts et leurs cas d\'usage dans un Brand Book professionnel.' },
                    { t: 'Recruter des affiliés & partenaires', d: 'Kit affiliés, kit partenaires et présentation commerciale pour développer votre réseau de distribution.' },
                  ].map((c) => (
                    <div key={c.t} className="rounded-xl border p-4" style={{ borderColor: '#eadfc9' }}>
                      <div className="flex items-center gap-2 text-sm font-bold" style={{ color: INK }}>
                        <CheckCircle2 className="h-4 w-4" style={{ color: AMBER }} /> {c.t}
                      </div>
                      <p className="mt-1.5 text-[13px] leading-snug" style={{ color: '#8a7860' }}>{c.d}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comment ça marche */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-wider" style={{ background: AMBER_SOFT, borderColor: `${AMBER}44`, color: AMBER_DEEP }}>
                  <Wand2 className="h-3.5 w-3.5" /> Comment ça marche
                </div>
                <h3 className="mt-3 text-2xl sm:text-3xl font-medium leading-tight" style={{ fontFamily: SERIF, color: INK }}>
                  Quatre étapes, un résultat professionnel
                </h3>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { n: '1', t: 'Décrivez', d: 'Renseignez votre produit ou laissez la génération intelligente pré-remplir tout à partir de quelques phrases.' },
                    { n: '2', t: 'Enrichissez', d: 'Modules, fonctionnalités, agents, identité visuelle : le Copilot vous aide à compléter chaque section.' },
                    { n: '3', t: 'Générez', d: 'Sélectionnez vos livrables. L\'IA rédige et met en page chaque document, un par un.' },
                    { n: '4', t: 'Exportez', d: 'Téléchargez en Word, PDF, HTML, Markdown ou PowerPoint, prêt à publier et à partager.' },
                  ].map((c) => (
                    <div key={c.n} className="rounded-xl border p-4" style={{ borderColor: '#eadfc9', background: DS_CREAM }}>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-black text-white" style={{ background: AMBER_DEEP }}>{c.n}</div>
                      <div className="mt-2 text-sm font-bold" style={{ color: INK }}>{c.t}</div>
                      <p className="mt-1 text-[13px] leading-snug" style={{ color: '#8a7860' }}>{c.d}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-wider" style={{ background: AMBER_SOFT, borderColor: `${AMBER}44`, color: AMBER_DEEP }}>
                  <BookOpen className="h-3.5 w-3.5" /> Questions fréquentes
                </div>
                <h3 className="mt-3 text-2xl sm:text-3xl font-medium leading-tight" style={{ fontFamily: SERIF, color: INK }}>
                  Tout ce que vous devez savoir
                </h3>
                <div className="mt-4 space-y-3">
                  {[
                    { q: 'Ai-je besoin de compétences techniques ?', a: 'Non. Vous décrivez votre produit en français courant, l\'IA s\'occupe de la rédaction, de la structure et de la mise en page.' },
                    { q: 'Puis-je modifier le contenu généré ?', a: 'Oui. Vous gardez le contrôle total : chaque section est éditable avant et après génération, et le Copilot vous aide à affiner.' },
                    { q: 'Les documents sont-ils à mon image ?', a: 'Oui. Choisissez parmi 8 templates premium, définissez vos couleurs, typographies et logo pour un rendu cohérent avec votre marque.' },
                    { q: 'Que se passe-t-il si mon produit évolue ?', a: 'La mise à jour intelligente régénère uniquement les documents concernés par le changement, sans tout refaire.' },
                    { q: 'Puis-je essayer avant d\'acheter ?', a: 'Oui. Une première génération courte est offerte pour découvrir la qualité du rendu, sans engagement.' },
                  ].map((f) => (
                    <div key={f.q} className="rounded-xl border p-4" style={{ borderColor: '#eadfc9' }}>
                      <div className="text-sm font-bold" style={{ color: INK }}>{f.q}</div>
                      <p className="mt-1.5 text-[13px] leading-relaxed" style={{ color: '#8a7860' }}>{f.a}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tarif + CTA */}
              <div className="rounded-2xl border p-6 sm:p-8 text-center" style={{ background: `linear-gradient(135deg, ${AMBER_SOFT}, #fff)`, borderColor: `${AMBER}55` }}>
                <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-wider" style={{ background: '#fff', borderColor: `${AMBER}44`, color: AMBER_DEEP }}>
                  <Gem className="h-3.5 w-3.5" /> Pack Premium
                </div>
                <div className="mt-3 flex items-end justify-center gap-2">
                  <span className="text-5xl font-bold" style={{ color: INK }}>197€</span>
                  <span className="mb-1.5 text-sm" style={{ color: '#8a7860' }}>paiement unique</span>
                </div>
                <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed" style={{ color: '#6f5e47' }}>
                  Accès complet au module, tous les livrables, tous les templates, tous les formats d'export et la bibliothèque de
                  projets. Essayez gratuitement avec une première génération courte, sans engagement.
                </p>
                <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-2">
                  <button
                    onClick={() => setActiveTab('documentation')}
                    className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5"
                    style={{ background: AMBER_DEEP }}
                  >
                    <Sparkles className="h-4 w-4" /> Essayer gratuitement
                  </button>
                  <button
                    onClick={() => setActiveTab('offres')}
                    className="inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5"
                    style={{ background: '#fff', borderColor: `${AMBER}55`, color: AMBER_DEEP }}
                  >
                    <Gem className="h-4 w-4" /> Voir les offres
                  </button>
                </div>
              </div>

            </div>

            <V3GuidesSection />
          </section>
        )}

        {/* ===================== ONGLET OFFRES & PACKS ===================== */}
        {activeTab === 'offres' && (
          <>
            <V3LaunchLinks />
            <V3AccessRecap onOpenModule={setSelected} />
            <V3PricingTiers />
            <MaisonEditionTab onOpenModule={(id) => { const m = getModuleById(id); if (m) setSelected(m); }} />
            <V2V3Compare />
          </>
        )}

        {/* ===================== ONGLET ROADMAP ===================== */}
        {activeTab === 'roadmap' && (
          <V3RoadmapTab />
        )}

        {/* ===================== ONGLET SCRIPT VIDÉO ===================== */}
        {activeTab === 'script' && (
          <section className="space-y-5">
            <div className="rounded-2xl border p-5 sm:p-6" style={{ background: '#fff', borderColor: `${AMBER}44` }}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-wider" style={{ background: AMBER_SOFT, borderColor: `${AMBER}44`, color: AMBER_DEEP }}>
                    <FileText className="h-3.5 w-3.5" /> Script visible
                  </div>
                  <h2 className="mt-4 text-3xl sm:text-4xl font-medium leading-tight" style={{ fontFamily: SERIF, color: INK }}>
                    Grand script vidéo — octobre V3
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: '#6f5e47' }}>
                    Version longue prête à lire au prompteur pour expliquer la fin de la bêta, le prix actuel à 67€ et l'arrivée de Publication Assistée Pro en octobre.
                  </p>
                </div>
                <button
                  onClick={copyVideoScript}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition-all hover:-translate-y-0.5"
                  style={{ background: scriptCopied ? '#1f9d6b' : AMBER_DEEP, color: '#fff' }}
                >
                  {scriptCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {scriptCopied ? 'Copié' : 'Copier le script'}
                </button>
              </div>
            </div>

            <article className="rounded-2xl border bg-white p-5 sm:p-8" style={{ borderColor: '#eadfc9' }}>
              <pre className="whitespace-pre-wrap break-words text-[15px] leading-7" style={{ color: INK, fontFamily: SANS }}>
                {videoOctoberScript}
              </pre>
            </article>
          </section>
        )}

        {/* ===================== ONGLET PARLER AVEC L'IA ===================== */}
        {activeTab === 'assistant' && (
          <section className="space-y-5">
            <div className="rounded-2xl border p-5 sm:p-6" style={{ background: '#fff', borderColor: `${AMBER}44` }}>
              <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-wider" style={{ background: AMBER_SOFT, borderColor: `${AMBER}44`, color: AMBER_DEEP }}>
                <Bot className="h-3.5 w-3.5" /> Assistant IA
              </div>
              <h2 className="mt-4 text-3xl sm:text-4xl font-medium leading-tight" style={{ fontFamily: SERIF, color: INK }}>
                Parler avec l'IA
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: '#6f5e47' }}>
                Posez vos questions sur la création, la publication et la vente de vos livres. L'IA vous répond en direct.
              </p>
            </div>
            <div className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: '#eadfc9' }}>
              <HubAiChat />
            </div>

            {/* Accès BookPerfect AI — directeur éditorial */}
            <div className="rounded-2xl border p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4" style={{ background: '#fff', borderColor: `${AMBER}44` }}>
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-wider" style={{ background: AMBER_SOFT, borderColor: `${AMBER}44`, color: AMBER_DEEP }}>
                  <BookOpen className="h-3.5 w-3.5" /> Nouveau · Premium
                </div>
                <h3 className="mt-3 text-2xl font-medium leading-tight" style={{ fontFamily: SERIF, color: INK }}>
                  BookPerfect AI — Directeur éditorial
                </h3>
                <p className="mt-1 max-w-2xl text-sm leading-relaxed" style={{ color: '#6f5e47' }}>
                  Analysez votre roman Word chapitre par chapitre : traces d'IA, orthographe, style, contrôle Amazon KDP et export Word corrigé.
                </p>
              </div>
              <button
                onClick={() => navigate('/bookperfect')}
                className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white whitespace-nowrap"
                style={{ background: `linear-gradient(90deg, ${AMBER}, #FFB44D)` }}
              >
                Ouvrir BookPerfect AI <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </section>
        )}

        {/* ===================== ONGLET BOOKPERFECT AI ===================== */}
        {activeTab === 'bookperfect' && (
          <section className="space-y-5">
            <div className="rounded-2xl border p-5 sm:p-6" style={{ background: '#fff', borderColor: `${AMBER}44` }}>
              <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-wider" style={{ background: AMBER_SOFT, borderColor: `${AMBER}44`, color: AMBER_DEEP }}>
                <BookOpen className="h-3.5 w-3.5" /> Nouveau · Premium
              </div>
              <h2 className="mt-4 text-3xl sm:text-4xl font-medium leading-tight" style={{ fontFamily: SERIF, color: INK }}>
                BookPerfect AI — Directeur éditorial
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: '#6f5e47' }}>
                Analysez votre roman Word chapitre par chapitre : traces d'IA, orthographe, style,
                contrôle Amazon KDP et export Word corrigé — sans jamais altérer votre texte original.
              </p>
              <p className="mt-3 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-semibold" style={{ background: AMBER_SOFT, color: AMBER_DEEP }}>
                97€ · offre de lancement 67€ · module premium à acheter séparément
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate('/bookperfect')}
                  className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white whitespace-nowrap"
                  style={{ background: `linear-gradient(90deg, ${AMBER}, #FFB44D)` }}
                >
                  Ouvrir BookPerfect AI <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => navigate('/bookperfect-offre')}
                  className="inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3 text-sm font-bold whitespace-nowrap"
                  style={{ borderColor: `${AMBER}66`, color: AMBER_DEEP, background: '#fff' }}
                >
                  Voir la page de vente
                </button>
              </div>

            </div>
          </section>
        )}
      </main>
      </div>
      {/* fin colonne de contenu */}

      <V3ModuleDialog
        module={selected}
        onClose={() => { setSelected(null); setStudioSource(null); }}
        toolProps={selected?.id === 'book-creation-studio' ? { initialSource: studioSource } : undefined}
      />
      <V3HubTour isOpen={tourOpen} onClose={finishTour} onComplete={finishTour} />
      </div>
    </div>
  );
};

function FilterChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-all"
      style={{
        borderColor: active ? AMBER : '#eadfc9',
        background: active ? `linear-gradient(90deg, ${AMBER}, #FFB44D)` : '#fff',
        color: active ? '#fff' : '#7c6b54',
      }}
    >
      {label}
    </button>
  );
}

export default V3HubPage;
