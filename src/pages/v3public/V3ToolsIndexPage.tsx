import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { V2_TOOLS, V2_TOOL_CATEGORIES } from '@/data/v2ToolsRegistry';
import { Search, ArrowRight } from 'lucide-react';

/**
 * Index premium de tous les outils EbookStudio V3.
 * Style Émeraude Prestige : fond papier, cartes blanches, badges or.
 */
export default function V3ToolsIndexPage() {
  const [params] = useSearchParams();
  const initial = params.get('q') ?? '';
  const [q, setQ] = useState(initial);
  const [activeCat, setActiveCat] = useState<string | null>(null);

  useEffect(() => {
    setQ(initial);
  }, [initial]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    let list = V2_TOOLS;
    if (activeCat) list = list.filter((t) => t.category === activeCat);
    if (s) {
      list = list.filter(
        (t) =>
          t.label.toLowerCase().includes(s) ||
          t.description.toLowerCase().includes(s),
      );
    }
    return list;
  }, [q, activeCat]);

  return (
    <div style={{ background: 'var(--v3-paper)' }} className="min-h-screen">
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #ecf5f1 0%, var(--v3-paper) 100%)',
          borderBottom: '1px solid var(--v3-line)',
        }}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-12">
          <div className="text-[10px] uppercase tracking-[0.24em] font-semibold" style={{ color: 'var(--v3-gold-600)' }}>
            L'atelier complet
          </div>
          <h1 className="v3-serif mt-1 text-4xl md:text-5xl font-bold" style={{ color: 'var(--v3-emerald)' }}>
            Tous les outils Ebookstudio V3
          </h1>
          <p className="mt-3 text-[14px] max-w-2xl" style={{ color: 'var(--v3-muted)' }}>
            {V2_TOOLS.length} outils premium pour créer, écrire, habiller, publier et vendre vos livres.
            Chaque outil est pensé pour un moment précis du parcours auteur.
          </p>

          {/* Search + filters */}
          <div className="mt-8 flex flex-col md:flex-row gap-3 md:items-center">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--v3-gold)' }} />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Rechercher un outil…"
                className="w-full pl-11 pr-4 py-3 rounded-full bg-white text-[14px] focus:outline-none focus:ring-2 transition"
                style={{
                  border: '1px solid var(--v3-line)',
                  boxShadow: '0 2px 8px -4px rgba(6,78,59,0.08)',
                }}
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setActiveCat(null)}
                className="px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition"
                style={
                  activeCat === null
                    ? { background: 'var(--v3-emerald)', color: '#fff' }
                    : { background: '#fff', color: 'var(--v3-ink)', border: '1px solid var(--v3-line)' }
                }
              >
                Tous
              </button>
              {V2_TOOL_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCat(cat.id === activeCat ? null : cat.id)}
                  className="px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition"
                  style={
                    activeCat === cat.id
                      ? { background: 'var(--v3-emerald)', color: '#fff' }
                      : { background: '#fff', color: 'var(--v3-ink)', border: '1px solid var(--v3-line)' }
                  }
                >
                  <span className="mr-1">{cat.emoji}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-10">
        {V2_TOOL_CATEGORIES.map((cat) => {
          const tools = filtered.filter((t) => t.category === cat.id);
          if (tools.length === 0) return null;
          return (
            <section key={cat.id} className="mb-12">
              <div className="flex items-baseline gap-3 mb-4">
                <h2 className="v3-serif text-[22px] font-semibold" style={{ color: 'var(--v3-emerald)' }}>
                  <span className="mr-2">{cat.emoji}</span>
                  {cat.label}
                </h2>
                <span className="text-[12px]" style={{ color: 'var(--v3-muted)' }}>
                  {tools.length} outil{tools.length > 1 ? 's' : ''}
                </span>
                <div className="flex-1 h-px ml-2" style={{ background: 'var(--v3-line)' }} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {tools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Link
                      key={tool.id}
                      to={tool.route}
                      className="group relative flex gap-3 p-4 rounded-2xl bg-white transition-all"
                      style={{
                        border: '1px solid var(--v3-line)',
                        boxShadow: '0 1px 2px rgba(6,78,59,0.03)',
                      }}
                      onMouseOver={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.borderColor = 'rgba(201,168,76,0.5)';
                        el.style.boxShadow = 'var(--v3-shadow-card)';
                        el.style.transform = 'translateY(-2px)';
                      }}
                      onMouseOut={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.borderColor = 'var(--v3-line)';
                        el.style.boxShadow = '0 1px 2px rgba(6,78,59,0.03)';
                        el.style.transform = '';
                      }}
                    >
                      <div
                        className="w-11 h-11 rounded-xl grid place-items-center shrink-0 transition-colors"
                        style={{ background: 'var(--v3-emerald-50)' }}
                      >
                        <Icon className="w-5 h-5" style={{ color: 'var(--v3-emerald)' }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-[13.5px] truncate" style={{ color: 'var(--v3-ink)' }}>
                            {tool.label}
                          </h3>
                          {tool.badge && <span className="v3-badge shrink-0">{tool.badge}</span>}
                        </div>
                        <p className="text-[11.5px] mt-1 line-clamp-2 leading-snug" style={{ color: 'var(--v3-muted)' }}>
                          {tool.description}
                        </p>
                      </div>
                      <ArrowRight
                        className="w-4 h-4 mt-1 opacity-0 group-hover:opacity-100 transition"
                        style={{ color: 'var(--v3-gold-600)' }}
                      />
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="v3-serif text-2xl" style={{ color: 'var(--v3-emerald)' }}>
              Aucun outil ne correspond
            </div>
            <p className="mt-2 text-[13px]" style={{ color: 'var(--v3-muted)' }}>
              Essayez un autre terme ou retirez les filtres.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
