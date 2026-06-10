import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Sparkles, Crown, Compass, Lock, ArrowRight, Wand2, CheckCircle2, Layers, Infinity as InfinityIcon } from 'lucide-react';
import {
  V3_MODULES, V3_PILLAR_META, getModuleTier, type V3Pillar, type V3Module,
} from '@/data/roadmapV3';
import { isModuleClickable, V3ModuleDialog } from '@/components/admin/v3ModuleRegistry';
import { V3HubTour } from '@/components/admin/V3HubTour';
import CreateBookHub from '@/components/admin/CreateBookHub';
import V2V3Compare from '@/components/admin/V2V3Compare';
import V3PricingTiers from '@/components/admin/V3PricingTiers';

const TOUR_KEY = 'v3hub_tour_done';

// Palette « Noir & Or luxe » — locale à cette page uniquement.
const GOLD = '#c9a84c';
const GOLD_LIGHT = '#f0d78c';

// L'écriture/rédaction (STUDIO de création) vit dans « IA avancée » : c'est le 1er palier.
const PILLAR_ORDER: V3Pillar[] = ['ia', 'publier', 'monetiser', 'marketing'];


/** Carte module premium avec tilt 3D + halo doré au survol. */
function ModuleCard({
  module,
  index,
  onOpen,
  isFirst,
}: {
  module: V3Module;
  index: number;
  onOpen: (m: V3Module) => void;
  isFirst?: boolean;
}) {
  const ref = React.useRef<HTMLButtonElement>(null);
  const [tilt, setTilt] = useState('');
  const clickable = isModuleClickable(module.id);

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt(`perspective(800px) rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 6).toFixed(2)}deg) translateY(-4px)`);
  };

  const statusColor = module.status === 'done' ? '#34d399'
    : module.status === 'in_progress' ? GOLD_LIGHT : '#94a3b8';
  const statusLabel = module.status === 'done' ? 'Prêt'
    : module.status === 'in_progress' ? 'En cours' : 'Bientôt';

  return (
    <button
      ref={ref}
      data-tour={isFirst ? 'card' : undefined}
      onClick={() => clickable && onOpen(module)}
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt('')}
      disabled={!clickable}
      style={{ transform: tilt, transitionProperty: 'transform, box-shadow, border-color', animationDelay: `${Math.min(index * 40, 600)}ms` }}
      className={`group relative animate-fade-in text-left rounded-2xl p-px border border-[#c9a84c22] transition-all duration-300 overflow-hidden
        ${clickable ? 'cursor-pointer hover:border-[#c9a84c]/80 hover:shadow-[0_18px_50px_-18px_rgba(201,168,76,0.55)]' : 'opacity-50 cursor-not-allowed'}`}
    >
      {/* liseré doré supérieur */}
      <span className="pointer-events-none absolute inset-x-6 top-0 h-px opacity-40 group-hover:opacity-100 transition-opacity"
        style={{ background: `linear-gradient(90deg, transparent, ${GOLD_LIGHT}, transparent)` }} />
      {/* halo doré au survol */}
      <div className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `radial-gradient(160px 110px at 50% 0%, ${GOLD}26, transparent 70%)` }} />
      <div className="relative h-full rounded-2xl p-4 bg-gradient-to-b from-[#1a1a1a] to-[#121212]">
        <div className="flex items-center justify-between mb-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl text-lg border border-[#c9a84c22] bg-[#0d0d0d] group-hover:border-[#c9a84c]/50 transition-colors">
            {V3_PILLAR_META[module.pillar].emoji}
          </span>
          <div className="flex items-center gap-1.5">
            {getModuleTier(module.id) === 'upsell' && (
              <span className="inline-flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full px-2 py-0.5"
                style={{ background: `${GOLD}1f`, color: GOLD_LIGHT, border: `1px solid ${GOLD}55` }}>
                <Lock className="h-2.5 w-2.5" /> Option
              </span>
            )}
            <span data-tour={isFirst ? 'status' : undefined} className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider rounded-full px-2 py-0.5"
              style={{ background: `${statusColor}1f`, color: statusColor }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: statusColor }} />
              {statusLabel}
            </span>
          </div>
        </div>
        <div className="text-sm font-semibold leading-tight mb-1"
          style={{ background: `linear-gradient(90deg, ${GOLD_LIGHT}, #ffffff)`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
          {module.title}
        </div>
        <p className="text-[11px] text-white/55 leading-snug line-clamp-3">{module.description}</p>
        {clickable && (
          <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-white/35 group-hover:text-[#f0d78c] transition-colors">
            Ouvrir l'outil
            <ArrowRight className="h-3 w-3 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
          </span>
        )}
      </div>
    </button>
  );
}


const V3HubPage: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [pillar, setPillar] = useState<V3Pillar | 'all' | 'create'>('all');
  const [selected, setSelected] = useState<V3Module | null>(null);
  const [studioSource, setStudioSource] = useState<string | null>(null);
  const [tourOpen, setTourOpen] = useState(false);

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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return V3_MODULES.filter((m) => {
      if (pillar !== 'all' && m.pillar !== pillar) return false;
      if (!q) return true;
      return m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q);
    });
  }, [query, pillar]);

  const readyCount = useMemo(() => V3_MODULES.filter((m) => isModuleClickable(m.id)).length, []);
  const upsellCount = useMemo(() => V3_MODULES.filter((m) => getModuleTier(m.id) === 'upsell').length, []);

  const stats = [
    { icon: CheckCircle2, value: readyCount, label: 'Outils prêts' },
    { icon: Wand2, value: V3_MODULES.length, label: 'Modules V3' },
    { icon: Layers, value: PILLAR_ORDER.length, label: 'Piliers' },
    { icon: InfinityIcon, value: '197€', label: 'Accès à vie' },
  ];

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Fond aurora doré global */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-1/4 left-1/2 -translate-x-1/2 h-[55vh] w-[80vw] rounded-full blur-[120px] v3-aurora-a"
          style={{ background: `radial-gradient(circle, ${GOLD}22, transparent 60%)` }} />
        <div className="absolute top-1/3 -left-1/4 h-[40vh] w-[50vw] rounded-full blur-[130px] v3-aurora-b"
          style={{ background: `radial-gradient(circle, ${GOLD}14, transparent 60%)` }} />
        <div className="absolute inset-0 v3-grid-overlay" />
      </div>

      <div className="relative z-10">
      {/* Hero */}
      <header className="relative overflow-hidden border-b border-[#c9a84c22]" data-tour="hero">
        {/* particules dorées */}
        <div className="pointer-events-none absolute inset-0">
          {Array.from({ length: 22 }).map((_, i) => (
            <span
              key={i}
              className="absolute rounded-full animate-pulse"
              style={{
                left: `${(i * 53) % 100}%`,
                top: `${(i * 37) % 100}%`,
                width: `${2 + (i % 3)}px`,
                height: `${2 + (i % 3)}px`,
                background: i % 2 ? GOLD : GOLD_LIGHT,
                opacity: 0.4,
                animationDelay: `${(i % 6) * 0.4}s`,
                animationDuration: `${3 + (i % 4)}s`,
              }}
            />
          ))}
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:py-16">
          <div className="flex items-center justify-between mb-8">
            <button
              data-tour="back"
              onClick={() => navigate('/admin-cockpit')}
              className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-[#f0d78c] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Retour au cockpit
            </button>
            <button
              onClick={() => setTourOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-colors hover:bg-[#c9a84c11]"
              style={{ borderColor: `${GOLD}66`, color: GOLD_LIGHT }}
            >
              <Compass className="h-4 w-4" /> Visite guidée
            </button>
          </div>

          <div className="v3-rise inline-flex items-center gap-2 mb-5 rounded-full border px-4 py-1.5"
            style={{ borderColor: `${GOLD}44`, background: `${GOLD}0d` }}>
            <Crown className="h-4 w-4" style={{ color: GOLD }} />
            <span className="text-[11px] font-bold uppercase tracking-[0.35em]" style={{ color: GOLD_LIGHT }}>
              Publication Assistée Pro
            </span>
          </div>
          <h1 className="v3-rise text-4xl sm:text-6xl font-black leading-[1.05] max-w-4xl tracking-tight v3-sheen"
            style={{ animationDelay: '0.08s', background: `linear-gradient(100deg, #ffffff 0%, ${GOLD_LIGHT} 45%, ${GOLD} 60%, #ffffff 90%)`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
            Le cockpit V3 de l'auteur à succès
          </h1>
          <p className="v3-rise mt-5 text-base sm:text-lg text-white/60 max-w-2xl leading-relaxed" style={{ animationDelay: '0.16s' }}>
            {readyCount} outils premium pour écrire, publier, monétiser et vendre vos livres —
            réunis dans une seule expérience taillée pour l'excellence.
          </p>

          <div className="v3-rise mt-8 flex flex-wrap items-center gap-3" style={{ animationDelay: '0.24s' }}>
            <button
              onClick={() => setPillar('create')}
              className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_40px_-12px_rgba(201,168,76,0.7)]"
              style={{ background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`, color: '#1a1a1a' }}>
              <Wand2 className="h-4 w-4" /> Créer un livre
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <a href="#tarifs" data-tour="price" className="inline-flex items-center gap-1.5 rounded-full px-5 py-3 text-sm font-semibold border transition-colors hover:bg-[#c9a84c11]"
              style={{ borderColor: `${GOLD}55`, color: GOLD_LIGHT }}>
              <Sparkles className="h-4 w-4" /> Dès 197€ à vie · 3× ou 6×
            </a>
          </div>

          {/* Barre de statistiques premium */}
          <div className="v3-rise mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-3xl" style={{ animationDelay: '0.32s' }}>
            {stats.map((s) => (
              <div key={s.label} className="relative rounded-2xl border border-[#c9a84c22] bg-gradient-to-b from-[#161616] to-[#0f0f0f] px-4 py-4 overflow-hidden">
                <span className="pointer-events-none absolute inset-x-5 top-0 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${GOLD}66, transparent)` }} />
                <s.icon className="h-4 w-4 mb-2" style={{ color: GOLD }} />
                <div className="text-2xl font-black leading-none"
                  style={{ background: `linear-gradient(90deg, #ffffff, ${GOLD_LIGHT})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                  {s.value}
                </div>
                <div className="mt-1 text-[11px] uppercase tracking-wider text-white/40">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </header>


      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Recherche + filtres */}
        <div className="sticky top-0 z-10 -mx-4 px-4 py-3 bg-[#0d0d0d]/80 backdrop-blur-md mb-6">
          <div className="relative max-w-md mb-3" data-tour="search">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un outil…"
              className="w-full rounded-full bg-[#1a1a1a] border border-[#c9a84c33] pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#c9a84c] transition-colors"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2" data-tour="filters">
            <CreateBookChip active={pillar === 'create'} onClick={() => setPillar('create')} />
            <span className="mx-1 h-6 w-px self-center" style={{ background: `${GOLD}33` }} aria-hidden />
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
        </div>

        {/* Onglet spécial : hub de création */}
        {pillar === 'create' ? (
          <CreateBookHub onSelectSource={openStudio} />
        ) : filtered.length === 0 ? (
          <div className="text-center text-white/40 py-20 text-sm">Aucun outil ne correspond à « {query} ».</div>
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
                    <h2 className="text-lg font-bold" style={{ color: GOLD_LIGHT }}>{V3_PILLAR_META[p].label}</h2>
                    <span className="text-xs text-white/30">{items.length}</span>
                    <div className="flex-1 h-px ml-2" style={{ background: `linear-gradient(90deg, ${GOLD}33, transparent)` }} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {items.map((m, i) => (
                      <ModuleCard key={m.id} module={m} index={i} onOpen={setSelected} isFirst={p === firstPillarWithItems && i === 0} />
                    ))}
                  </div>
                </section>
              );
            });
          })()
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map((m, i) => (
              <ModuleCard key={m.id} module={m} index={i} onOpen={setSelected} isFirst={i === 0} />
            ))}
          </div>
        )}

        <V3PricingTiers />
        <V2V3Compare />
      </main>


      <V3ModuleDialog
        module={selected}
        onClose={() => { setSelected(null); setStudioSource(null); }}
        toolProps={selected?.id === 'book-creation-studio' ? { initialSource: studioSource } : undefined}
      />
      <V3HubTour isOpen={tourOpen} onClose={finishTour} onComplete={finishTour} />
    </div>
  );
};

function FilterChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-all"
      style={{
        borderColor: active ? GOLD : '#ffffff1a',
        background: active ? `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})` : 'transparent',
        color: active ? '#1a1a1a' : 'rgba(255,255,255,0.6)',
      }}
    >
      {label}
    </button>
  );
}

/** Chip spécial mis en évidence pour l'onglet de création (toujours doré + halo animé). */
function CreateBookChip({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold border transition-all hover:-translate-y-0.5"
      style={{
        borderColor: GOLD,
        background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`,
        color: '#1a1a1a',
        boxShadow: active
          ? `0 0 0 2px ${GOLD}66, 0 0 24px -4px ${GOLD}`
          : `0 0 18px -6px ${GOLD}`,
      }}
    >
      <span
        className="pointer-events-none absolute -inset-1 rounded-full animate-pulse"
        style={{ background: `radial-gradient(60% 60% at 50% 50%, ${GOLD}55, transparent 70%)`, opacity: 0.7 }}
        aria-hidden
      />
      <Sparkles className="relative h-3.5 w-3.5" />
      <span className="relative">Créer un livre</span>
      <span className="relative ml-0.5 rounded-full bg-[#1a1a1a] px-1.5 py-0.5 text-[9px] font-extrabold tracking-wider text-[#f0d78c]">
        NEW
      </span>
    </button>
  );
}


export default V3HubPage;
