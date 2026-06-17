import React, { useMemo } from 'react';
import {
  V3_MODULES, V3_PILLAR_META, type V3Pillar, type V3Module,
} from '@/data/roadmapV3';
import { CheckCircle2, Loader2, Circle, Layers } from 'lucide-react';

const INK = '#2A2118';
const SERIF = "'Georgia', 'Times New Roman', serif";

const STATUS_META = {
  done: { label: 'Prêt', color: '#1f9d6b', bg: '#e8f7ef', icon: CheckCircle2 },
  in_progress: { label: 'En cours', color: '#C97A14', bg: '#FFF3DF', icon: Loader2 },
  todo: { label: 'Bientôt', color: '#a18a6c', bg: '#f3ece0', icon: Circle },
};

const PILLAR_ORDER: V3Pillar[] = ['ia', 'publier', 'monetiser', 'marketing'];

export function V3RoadmapTab() {
  const stats = useMemo(() => {
    const total = V3_MODULES.length;
    const done = V3_MODULES.filter((m) => m.status === 'done').length;
    const inProgress = V3_MODULES.filter((m) => m.status === 'in_progress').length;
    const todo = V3_MODULES.filter((m) => m.status === 'todo').length;
    const pct = Math.round((done / total) * 100);
    return { total, done, inProgress, todo, pct };
  }, []);

  const byPillar = useMemo(() => {
    const map: Record<V3Pillar, V3Module[]> = { ia: [], publier: [], monetiser: [], marketing: [], edition: [], distribution: [], promotion: [] };
    for (const m of V3_MODULES) {
      map[m.pillar].push(m);
    }
    // tri par statut puis titre
    for (const p of PILLAR_ORDER) {
      map[p].sort((a, b) => {
        const order = { done: 0, in_progress: 1, todo: 2 };
        if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status];
        return a.title.localeCompare(b.title);
      });
    }
    return map;
  }, []);

  return (
    <div className="space-y-8">
      {/* En-tête avec progression globale */}
      <div className="rounded-2xl border border-[#eadfc9] bg-white p-5 shadow-[0_2px_14px_-8px_rgba(180,140,60,0.25)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold" style={{ fontFamily: SERIF, color: INK }}>
              Roadmap V3 — Publication Assistée Pro
            </h2>
            <p className="text-[12px] mt-1" style={{ color: '#7c6b54' }}>
              Suivi en temps réel des modules livrés, en construction et à venir.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StatBadge count={stats.done} label="Prêts" color="#1f9d6c" bg="#e8f7ef" />
            <StatBadge count={stats.inProgress} label="En cours" color="#C97A14" bg="#FFF3DF" />
            <StatBadge count={stats.todo} label="Bientôt" color="#a18a6c" bg="#f3ece0" />
          </div>
        </div>

        {/* Barre de progression */}
        <div className="relative h-3 rounded-full bg-[#f3ece0] overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
            style={{ width: `${stats.pct}%`, background: 'linear-gradient(90deg, #1f9d6c, #34d399)' }}
          />
        </div>
        <div className="flex justify-between mt-2 text-[11px] font-semibold" style={{ color: '#8a7860' }}>
          <span>{stats.done} / {stats.total} modules livrés</span>
          <span style={{ color: '#1f9d6c' }}>{stats.pct}% terminé</span>
        </div>
      </div>

      {/* Grille par pilier */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {PILLAR_ORDER.map((p) => {
          const items = byPillar[p];
          const meta = V3_PILLAR_META[p];
          const pillarDone = items.filter((m) => m.status === 'done').length;
          const pillarPct = Math.round((pillarDone / items.length) * 100);

          return (
            <section
              key={p}
              className="rounded-2xl border border-[#eadfc9] bg-white p-5 shadow-[0_2px_14px_-8px_rgba(180,140,60,0.25)]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{meta.emoji}</span>
                  <h3 className="text-base font-bold" style={{ fontFamily: SERIF, color: INK }}>
                    {meta.label}
                  </h3>
                  <span className="text-[11px] font-medium" style={{ color: '#b29a72' }}>
                    ({items.length})
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold" style={{ color: '#1f9d6c' }}>
                    {pillarPct}%
                  </span>
                </div>
              </div>

              {/* Mini barre pilier */}
              <div className="relative h-1.5 rounded-full bg-[#f3ece0] overflow-hidden mb-4">
                <div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ width: `${pillarPct}%`, background: meta.color }}
                />
              </div>

              <ul className="space-y-2">
                {items.map((m) => {
                  const s = STATUS_META[m.status];
                  const Icon = s.icon;
                  return (
                    <li
                      key={m.id}
                      className="flex items-start gap-2.5 rounded-lg px-2.5 py-2 transition-colors hover:bg-[#FCF8F0]"
                    >
                      <span
                        className="mt-0.5 shrink-0 rounded-full p-0.5"
                        style={{ background: s.bg }}
                      >
                        <Icon className="h-3.5 w-3.5" style={{ color: s.color }} />
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-semibold leading-tight" style={{ color: INK }}>
                          {m.title}
                        </div>
                        <p className="text-[11px] leading-snug mt-0.5 line-clamp-2" style={{ color: '#7c6b54' }}>
                          {m.description}
                        </p>
                      </div>
                      <span
                        className="shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider self-start"
                        style={{ background: s.bg, color: s.color }}
                      >
                        {s.label}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function StatBadge({ count, label, color, bg }: { count: number; label: string; color: string; bg: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5" style={{ background: bg }}>
      <span className="text-sm font-black" style={{ color }}>{count}</span>
      <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color }}>{label}</span>
    </div>
  );
}

export default V3RoadmapTab;
