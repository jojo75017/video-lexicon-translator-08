import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Sparkles, Crown } from 'lucide-react';
import {
  V3_MODULES, V3_PILLAR_META, type V3Pillar, type V3Module,
} from '@/data/roadmapV3';
import { isModuleClickable, V3ModuleDialog } from '@/components/admin/v3ModuleRegistry';

// Palette « Noir & Or luxe » — locale à cette page uniquement.
const GOLD = '#c9a84c';
const GOLD_LIGHT = '#f0d78c';

const PILLAR_ORDER: V3Pillar[] = ['publier', 'monetiser', 'marketing', 'ia'];

/** Carte module premium avec tilt 3D + halo doré au survol. */
function ModuleCard({
  module,
  index,
  onOpen,
}: {
  module: V3Module;
  index: number;
  onOpen: (m: V3Module) => void;
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
      onClick={() => clickable && onOpen(module)}
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt('')}
      disabled={!clickable}
      style={{ transform: tilt, transitionProperty: 'transform, box-shadow, border-color', animationDelay: `${Math.min(index * 40, 600)}ms` }}
      className={`group relative animate-fade-in text-left rounded-2xl p-4 border bg-[#161616] border-[#c9a84c22] transition-all duration-300 overflow-hidden
        ${clickable ? 'cursor-pointer hover:border-[#c9a84c] hover:shadow-[0_0_30px_-6px_rgba(201,168,76,0.45)]' : 'opacity-50 cursor-not-allowed'}`}
    >
      {/* halo doré au survol */}
      <div className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `radial-gradient(120px 80px at 50% 0%, ${GOLD}22, transparent 70%)` }} />
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg">{V3_PILLAR_META[module.pillar].emoji}</span>
          <span className="text-[9px] font-bold uppercase tracking-wider rounded-full px-2 py-0.5"
            style={{ background: `${statusColor}1f`, color: statusColor }}>
            {statusLabel}
          </span>
        </div>
        <div className="text-sm font-semibold leading-tight mb-1"
          style={{ background: `linear-gradient(90deg, ${GOLD_LIGHT}, #ffffff)`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
          {module.title}
        </div>
        <p className="text-[11px] text-white/55 leading-snug line-clamp-3">{module.description}</p>
      </div>
    </button>
  );
}

const V3HubPage: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [pillar, setPillar] = useState<V3Pillar | 'all'>('all');
  const [selected, setSelected] = useState<V3Module | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return V3_MODULES.filter((m) => {
      if (pillar !== 'all' && m.pillar !== pillar) return false;
      if (!q) return true;
      return m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q);
    });
  }, [query, pillar]);

  const readyCount = useMemo(() => V3_MODULES.filter((m) => isModuleClickable(m.id)).length, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d0d0d] via-[#121212] to-[#0d0d0d] text-white">
      {/* Hero */}
      <header className="relative overflow-hidden border-b border-[#c9a84c22]">
        {/* particules dorées */}
        <div className="pointer-events-none absolute inset-0">
          {Array.from({ length: 18 }).map((_, i) => (
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
        <div className="relative mx-auto max-w-7xl px-4 py-10">
          <button
            onClick={() => navigate('/admin-cockpit')}
            className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-[#f0d78c] transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Retour au cockpit
          </button>

          <div className="flex items-center gap-2 mb-3">
            <Crown className="h-6 w-6" style={{ color: GOLD }} />
            <span className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: GOLD }}>
              Publication Assistée Pro
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight max-w-3xl"
            style={{ background: `linear-gradient(100deg, #ffffff 0%, ${GOLD_LIGHT} 55%, ${GOLD} 100%)`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
            Le cockpit V3 de l'auteur à succès
          </h1>
          <p className="mt-4 text-white/60 max-w-2xl">
            {readyCount} outils premium pour écrire, publier, monétiser et vendre vos livres — réunis dans une seule expérience.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-bold"
              style={{ background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`, color: '#1a1a1a' }}>
              <Sparkles className="h-4 w-4" /> 197€ à vie
            </span>
            <span className="text-xs text-white/40">{V3_MODULES.length} modules au total</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Recherche + filtres */}
        <div className="sticky top-0 z-10 -mx-4 px-4 py-3 bg-[#0d0d0d]/80 backdrop-blur-md mb-6">
          <div className="relative max-w-md mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un outil…"
              className="w-full rounded-full bg-[#1a1a1a] border border-[#c9a84c33] pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#c9a84c] transition-colors"
            />
          </div>
          <div className="flex flex-wrap gap-2">
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

        {/* Grille */}
        {filtered.length === 0 ? (
          <div className="text-center text-white/40 py-20 text-sm">Aucun outil ne correspond à « {query} ».</div>
        ) : pillar === 'all' ? (
          PILLAR_ORDER.map((p) => {
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
                    <ModuleCard key={m.id} module={m} index={i} onOpen={setSelected} />
                  ))}
                </div>
              </section>
            );
          })
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map((m, i) => (
              <ModuleCard key={m.id} module={m} index={i} onOpen={setSelected} />
            ))}
          </div>
        )}
      </main>

      <V3ModuleDialog module={selected} onClose={() => setSelected(null)} />
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

export default V3HubPage;
