import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { V2_TOOLS, V2_TOOL_CATEGORIES } from '@/data/v2ToolsRegistry';
import { Search } from 'lucide-react';

export default function V3ToolsIndexPage() {
  const [q, setQ] = useState('');
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return V2_TOOLS;
    return V2_TOOLS.filter(
      (t) =>
        t.label.toLowerCase().includes(s) ||
        t.description.toLowerCase().includes(s),
    );
  }, [q]);

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--v3-ink)]">
            Tous les outils EbookStudio V3
          </h1>
          <p className="text-[var(--v3-muted)] text-sm mt-1">
            {V2_TOOLS.length} outils disponibles — cliquez pour ouvrir.
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--v3-muted)]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher un outil…"
            className="w-full pl-9 pr-3 py-2 rounded-full border border-black/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--v3-orange)]/40"
          />
        </div>
      </div>

      {V2_TOOL_CATEGORIES.map((cat) => {
        const tools = filtered.filter((t) => t.category === cat.id);
        if (tools.length === 0) return null;
        return (
          <section key={cat.id} className="mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--v3-muted)] mb-3">
              {cat.emoji} {cat.label}
              <span className="ml-2 text-[var(--v3-muted)]/70 normal-case tracking-normal">
                ({tools.length})
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.id}
                    to={tool.route}
                    className="group flex gap-3 p-4 rounded-xl border border-black/5 bg-white hover:border-[var(--v3-orange)] hover:shadow-md transition-all"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[var(--v3-orange-50)] flex items-center justify-center shrink-0 group-hover:bg-[var(--v3-orange)] transition-colors">
                      <Icon className="w-5 h-5 text-[var(--v3-orange-600)] group-hover:text-white transition-colors" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-[var(--v3-ink)] text-sm truncate">
                          {tool.label}
                        </h3>
                        {tool.badge && (
                          <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-500 text-white shrink-0">
                            {tool.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--v3-muted)] mt-1 line-clamp-2">
                        {tool.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}

      {filtered.length === 0 && (
        <div className="text-center py-16 text-[var(--v3-muted)]">
          Aucun outil ne correspond à « {q} ».
        </div>
      )}
    </div>
  );
}
