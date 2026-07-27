import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ExternalLink, Lock, Check } from 'lucide-react';
import {
  V2_TOOLS,
  V2_TOOL_CATEGORIES,
  type V2ToolCategory,
} from '@/data/v2ToolsRegistry';
import { planForTool, PLAN_META, isUnlockedForPlan, type V3Plan } from '@/data/v3ToolPlans';

const AMBER = '#E8951E';
const AMBER_DEEP = '#C97A14';
const AMBER_SOFT = '#FFF3DF';
const INK = '#2A2118';
const SERIF = "'Instrument Serif', Georgia, 'Times New Roman', serif";

type Filter = 'all' | V2ToolCategory;
type PlanView = V3Plan;

/**
 * Onglet « Outils V2 » : launcher unifié qui affiche tous les outils
 * historiques (KDP, Cover Studio, Audiobook, BD, Marketing, etc.)
 * dans le Hub V3, pour que l'utilisateur n'ait plus à chercher.
 */
const V3AllToolsTab = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  // Vue par forfait : simule ce qui est débloqué pour chaque plan.
  const [planView, setPlanView] = useState<PlanView>('auteur');
  const [showLocked, setShowLocked] = useState(true);

  const withPlan = useMemo(
    () => V2_TOOLS.map((t) => ({ ...t, plan: planForTool(t) })),
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return withPlan.filter((t) => {
      if (filter !== 'all' && t.category !== filter) return false;
      if (!showLocked && !isUnlockedForPlan(t.plan, planView)) return false;
      if (!q) return true;
      return t.label.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
    });
  }, [query, filter, withPlan, planView, showLocked]);

  const counts = useMemo(() => {
    const c = { debutant: 0, expert: 0, auteur: 0 };
    for (const t of withPlan) {
      if (isUnlockedForPlan(t.plan, 'debutant')) c.debutant++;
      if (isUnlockedForPlan(t.plan, 'expert')) c.expert++;
      if (isUnlockedForPlan(t.plan, 'auteur')) c.auteur++;
    }
    return c;
  }, [withPlan]);

  const grouped = useMemo(() => {
    const map = new Map<V2ToolCategory, typeof filtered>();
    for (const t of filtered) {
      if (!map.has(t.category)) map.set(t.category, []);
      map.get(t.category)!.push(t);
    }
    return map;
  }, [filtered]);

  const badgeStyle = (badge?: string) => {
    if (badge === 'Populaire') return { background: '#e8f7ef', color: '#0b6e4c', border: '1px solid #0f8a5f55' };
    if (badge === 'Nouveau') return { background: AMBER_SOFT, color: AMBER_DEEP, border: `1px solid ${AMBER}55` };
    return { background: '#f3ece0', color: '#8a7860', border: '1px solid #eadfc9' };
  };

  return (
    <div>
      <div className="mb-4 rounded-xl border p-3 text-[13px]" style={{ background: AMBER_SOFT, borderColor: `${AMBER}44`, color: '#6f5e47' }}>
        <span className="font-semibold" style={{ color: AMBER_DEEP }}>🧰 Tous vos outils EbookStudio</span> — retrouvez ici l'ensemble des outils (KDP, couvertures, audiobook, BD, marketing, formation…) en un seul endroit. Un clic ouvre l'outil dans un nouvel onglet.
      </div>

      <div className="mb-4 flex flex-col gap-3">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#b29a72' }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un outil…"
            className="w-full rounded-full bg-white border border-[#eadfc9] pl-9 pr-4 py-2.5 text-sm placeholder:text-[#b29a72] focus:outline-none focus:border-[#E8951E] transition-colors"
            style={{ color: INK }}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className="rounded-full px-3 py-1.5 text-[12px] font-semibold border transition-colors"
            style={filter === 'all'
              ? { background: AMBER, color: '#fff', borderColor: AMBER }
              : { background: 'transparent', color: '#6f5e47', borderColor: '#eadfc9' }}
          >
            Tous ({V2_TOOLS.length})
          </button>
          {V2_TOOL_CATEGORIES.map((cat) => {
            const count = V2_TOOLS.filter((t) => t.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className="rounded-full px-3 py-1.5 text-[12px] font-semibold border transition-colors"
                style={filter === cat.id
                  ? { background: AMBER, color: '#fff', borderColor: AMBER }
                  : { background: 'transparent', color: '#6f5e47', borderColor: '#eadfc9' }}
              >
                {cat.emoji} {cat.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-sm" style={{ color: '#a18a6c' }}>
          Aucun outil ne correspond à « {query} ».
        </div>
      ) : (
        V2_TOOL_CATEGORIES.filter((c) => grouped.has(c.id)).map((cat) => {
          const items = grouped.get(cat.id)!;
          return (
            <section key={cat.id} className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xl">{cat.emoji}</span>
                <h2 className="text-lg font-bold" style={{ fontFamily: SERIF, color: INK }}>{cat.label}</h2>
                <span className="text-xs" style={{ color: '#b29a72' }}>{items.length}</span>
                <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${AMBER}44, transparent)` }} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {items.map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => navigate(t.route)}
                      className="group relative text-left rounded-2xl border border-[#eadfc9] bg-white p-4 transition-all cursor-pointer hover:-translate-y-0.5 hover:border-[#E8951E]/50 hover:shadow-[0_10px_30px_-18px_rgba(232,149,30,0.45)]"
                    >
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="grid h-10 w-10 place-items-center rounded-xl border border-[#eadfc9] bg-[#FCF8F0] group-hover:border-[#E8951E]/40 transition-colors">
                          <Icon className="h-5 w-5" style={{ color: AMBER_DEEP }} />
                        </span>
                        {t.badge && (
                          <span className="text-[9px] font-bold uppercase tracking-wider rounded-full px-2 py-0.5" style={badgeStyle(t.badge)}>
                            {t.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-[15px] font-semibold leading-tight mb-1" style={{ fontFamily: SERIF, color: INK }}>
                        {t.label}
                      </div>
                      <p className="text-[11px] leading-snug line-clamp-3" style={{ color: '#7c6b54' }}>{t.description}</p>
                      <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold" style={{ color: '#b29a72' }}>
                        <span className="group-hover:text-[#C97A14] transition-colors">Ouvrir</span>
                        <ExternalLink className="h-3 w-3 group-hover:text-[#C97A14] transition-colors" />
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
};

export default V3AllToolsTab;
