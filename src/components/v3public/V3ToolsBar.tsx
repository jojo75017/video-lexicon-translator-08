import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { V2_TOOLS, V2_TOOL_CATEGORIES } from '@/data/v2ToolsRegistry';

export default function V3ToolsBar() {
  const [openCat, setOpenCat] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpenCat(null);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div className="border-t border-black/5 bg-white/80" ref={ref}>
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-11 flex items-center gap-1 overflow-x-auto v3-scroll-x relative">
        <span className="text-[11px] uppercase tracking-wider text-[var(--v3-muted)] mr-3 shrink-0">
          Tous les outils
        </span>
        {V2_TOOL_CATEGORIES.map((cat) => {
          const tools = V2_TOOLS.filter((t) => t.category === cat.id);
          const isOpen = openCat === cat.id;
          return (
            <div key={cat.id} className="relative shrink-0">
              <button
                onClick={() => setOpenCat(isOpen ? null : cat.id)}
                onMouseEnter={() => setOpenCat(cat.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[13px] font-medium transition-colors ${
                  isOpen
                    ? 'bg-[var(--v3-orange-50)] text-[var(--v3-orange-600)]'
                    : 'text-[var(--v3-ink)] hover:bg-[var(--v3-orange-50)] hover:text-[var(--v3-orange-600)]'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                <span className="ml-1 text-[10px] text-[var(--v3-muted)]">({tools.length})</span>
              </button>

              {isOpen && (
                <div
                  onMouseLeave={() => setOpenCat(null)}
                  className="absolute left-0 top-full mt-1 w-[340px] max-h-[70vh] overflow-y-auto bg-white rounded-xl border border-black/5 shadow-xl z-50 p-2"
                >
                  {tools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <Link
                        key={tool.id}
                        to={tool.route}
                        onClick={() => setOpenCat(null)}
                        className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-[var(--v3-orange-50)] transition-colors group"
                      >
                        <span className="w-8 h-8 rounded-lg bg-[var(--v3-orange-50)] grid place-items-center text-[var(--v3-orange-600)] shrink-0">
                          <Icon className="w-4 h-4" />
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="flex items-center gap-2">
                            <span className="text-[13px] font-semibold text-[var(--v3-ink)] group-hover:text-[var(--v3-orange-600)]">
                              {tool.label}
                            </span>
                            {tool.badge && (
                              <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[var(--v3-orange)] text-white">
                                {tool.badge}
                              </span>
                            )}
                          </span>
                          <span className="block text-[11px] text-[var(--v3-muted)] leading-snug mt-0.5">
                            {tool.description}
                          </span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
