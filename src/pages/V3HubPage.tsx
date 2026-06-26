import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Sparkles, Crown, Compass, Lock, ArrowRight, Wand2, CheckCircle2, Layers, Infinity as InfinityIcon, ShieldCheck, Save, Image as ImageIcon, BookOpen, GraduationCap, Gem, Map as MapIcon, type LucideIcon } from 'lucide-react';
import {
  V3_MODULES, V3_PILLAR_META, getModuleAccess, getModuleById, type V3Pillar, type V3Module,
} from '@/data/roadmapV3';
import { isModuleClickable, V3ModuleDialog } from '@/components/admin/v3ModuleRegistry';
import { V3HubTour } from '@/components/admin/V3HubTour';
import useV3Entitlement from '@/hooks/useV3Entitlement';
import CreateBookHub from '@/components/admin/CreateBookHub';
import V2V3Compare from '@/components/admin/V2V3Compare';
import V3PricingTiers from '@/components/admin/V3PricingTiers';
import V3Workflow30 from '@/components/admin/V3Workflow30';
import V3AccessRecap from '@/components/admin/V3AccessRecap';
import V3GuidesSection from '@/components/admin/V3GuidesSection';
import V3RoadmapTab from '@/components/admin/V3RoadmapTab';
import MaisonEditionTab from '@/components/admin/MaisonEditionTab';
import pillarIa from '@/assets/v3/pillar-ia.jpg';
import pillarPublier from '@/assets/v3/pillar-publier.jpg';
import pillarMonetiser from '@/assets/v3/pillar-monetiser.jpg';
import pillarMarketing from '@/assets/v3/pillar-marketing.jpg';

const PILLAR_IMG: Record<V3Pillar, string> = {
  ia: pillarIa,
  publier: pillarPublier,
  monetiser: pillarMonetiser,
  marketing: pillarMarketing,
  edition: pillarPublier,
  distribution: pillarMarketing,
  promotion: pillarMarketing,
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
const PILLAR_ORDER: V3Pillar[] = ['ia', 'publier', 'monetiser', 'marketing', 'edition', 'distribution', 'promotion'];


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


type HubTab = 'parcours' | 'outils' | 'livres' | 'guides' | 'offres' | 'roadmap';

const HUB_TABS: { id: HubTab; label: string; icon: LucideIcon }[] = [
  { id: 'parcours', label: 'Parcours', icon: Compass },
  { id: 'outils', label: 'Outils', icon: Wand2 },
  { id: 'livres', label: 'Mes livres', icon: BookOpen },
  { id: 'guides', label: 'Guides', icon: GraduationCap },
  { id: 'offres', label: 'Offres & Packs', icon: Gem },
  { id: 'roadmap', label: 'Roadmap', icon: MapIcon },
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
  const { hasBase, hasFull, isAdmin } = useV3Entitlement();

  // Persiste l'onglet actif (URL + localStorage).
  useEffect(() => {
    localStorage.setItem(TAB_STORAGE_KEY, activeTab);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', activeTab);
    window.history.replaceState({}, '', url);
  }, [activeTab]);

  // Un module est "débloqué" si l'abonné a la formule correspondante.
  const isUnlocked = React.useCallback((m: V3Module) => {
    if (isAdmin) return true;
    return getModuleAccess(m.id) === 'pack' ? hasFull : hasBase;
  }, [isAdmin, hasBase, hasFull]);

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

  return (
    <div className="relative min-h-screen" style={{ background: CREAM, color: INK, fontFamily: SANS }}>
      <div className="relative z-10">
      {/* Hero */}
      <header className="relative overflow-hidden border-b border-[#eadfc9]" data-tour="hero">

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:py-16">
          <div className="flex items-center justify-between mb-8">
            <button
              data-tour="back"
              onClick={() => navigate('/admin-cockpit')}
              className="inline-flex items-center gap-1.5 text-xs transition-colors hover:text-[#C97A14]"
              style={{ color: '#9a8666' }}
            >
              <ArrowLeft className="h-4 w-4" /> Retour au cockpit
            </button>
            <button
              onClick={() => setTourOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-colors hover:bg-[#FFF3DF]"
              style={{ borderColor: `${AMBER}66`, color: AMBER_DEEP }}
            >
              <Compass className="h-4 w-4" /> Visite guidée
            </button>
          </div>

          <div className="v3-rise inline-flex items-center gap-2 mb-5 rounded-full border px-3 py-1"
            style={{ borderColor: `${AMBER}33`, background: `${AMBER}14` }}>
            <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: AMBER }} />
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: AMBER_DEEP }}>
              Publication Assistée Pro
            </span>
          </div>
          <h1 className="v3-rise text-5xl sm:text-7xl font-medium leading-[1.05] max-w-4xl tracking-tight"
            style={{ animationDelay: '0.08s', fontFamily: SERIF, color: INK }}>
            Le cockpit V3 de <span className="italic" style={{ color: AMBER_DEEP }}>l'auteur à succès</span>
          </h1>
          <p className="v3-rise mt-5 text-base sm:text-lg max-w-2xl leading-relaxed" style={{ animationDelay: '0.16s', color: '#6f5e47' }}>
            {readyCount} outils premium pour écrire, publier, monétiser et vendre vos livres —
            réunis dans une seule expérience taillée pour l'excellence.
          </p>

          <div className="v3-rise mt-8 flex flex-wrap items-center gap-3" style={{ animationDelay: '0.24s' }}>
            <button
              onClick={() => setActiveTab('livres')}
              className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_40px_-12px_rgba(232,149,30,0.6)]"
              style={{ background: `linear-gradient(90deg, ${AMBER}, #FFB44D)`, color: '#fff' }}>
              <Wand2 className="h-4 w-4" /> Créer un livre
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button onClick={() => openModule('library')}
              className="inline-flex items-center gap-1.5 rounded-full px-5 py-3 text-sm font-bold border transition-colors hover:bg-[#FFF3DF]"
              style={{ borderColor: `${AMBER}66`, color: AMBER_DEEP }}>
              <Save className="h-4 w-4" /> Mes sauvegardes
            </button>
            <button onClick={() => openModule('cover-studio-pro')}
              className="inline-flex items-center gap-1.5 rounded-full px-5 py-3 text-sm font-bold border transition-colors hover:bg-[#FFF3DF]"
              style={{ borderColor: `${AMBER}66`, color: AMBER_DEEP }}>
              <ImageIcon className="h-4 w-4" /> Image / Couverture
            </button>
            <button onClick={() => setActiveTab('offres')} data-tour="price" className="inline-flex items-center gap-1.5 rounded-full px-5 py-3 text-sm font-semibold border transition-colors hover:bg-[#FFF3DF]"
              style={{ borderColor: `${AMBER}66`, color: AMBER_DEEP }}>
              <Sparkles className="h-4 w-4" /> Dès 197€ à vie · 3× ou 6×
            </button>
          </div>

          {/* Barre de statistiques premium */}
          <div className="v3-rise mt-10 grid grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden border max-w-3xl" style={{ animationDelay: '0.32s', borderColor: `${AMBER}33`, background: `${AMBER}33` }}>
            {stats.map((s) => (
              <div key={s.label} className="px-5 py-5" style={{ background: CREAM }}>
                <s.icon className="h-4 w-4 mb-2.5" style={{ color: AMBER }} />
                <div className="text-3xl font-semibold leading-none tabular-nums" style={{ fontFamily: SERIF, color: INK }}>
                  {s.value}
                </div>
                <div className="mt-1.5 text-[11px] uppercase tracking-wider font-medium" style={{ color: '#a18a6c' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Barre d'onglets sticky */}
      <nav className="sticky top-0 z-30 border-b border-[#eadfc9] backdrop-blur-md" style={{ background: 'rgba(251,246,236,0.9)' }}>
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2.5">
            {HUB_TABS.map((t) => {
              const active = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className="shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold border transition-all"
                  style={{
                    borderColor: active ? AMBER : '#eadfc9',
                    background: active ? `linear-gradient(90deg, ${AMBER}, #FFB44D)` : '#fff',
                    color: active ? '#fff' : '#7c6b54',
                    boxShadow: active ? `0 8px 22px -10px ${AMBER}` : 'none',
                  }}
                >
                  <span>{t.emoji}</span> {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

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
            <V3Workflow30 onOpenModule={setSelected} />
          </>
        )}

        {/* ===================== ONGLET OUTILS ===================== */}
        {activeTab === 'outils' && (
          <>
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
                  return (
                    <section key={p} className="mb-10">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xl">{V3_PILLAR_META[p].emoji}</span>
                        <h2 className="text-lg font-bold" style={{ fontFamily: SERIF, color: INK }}>{V3_PILLAR_META[p].label}</h2>
                        <span className="text-xs" style={{ color: '#b29a72' }}>{items.length}</span>
                        <div className="flex-1 h-px ml-2" style={{ background: `linear-gradient(90deg, ${AMBER}44, transparent)` }} />
                      </div>
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

        {/* ===================== ONGLET MES LIVRES ===================== */}
        {activeTab === 'livres' && (
          <CreateBookHub onSelectSource={openStudio} />
        )}

        {/* ===================== ONGLET GUIDES ===================== */}
        {activeTab === 'guides' && (
          <V3GuidesSection />
        )}

        {/* ===================== ONGLET OFFRES & PACKS ===================== */}
        {activeTab === 'offres' && (
          <>
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
      </main>


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
