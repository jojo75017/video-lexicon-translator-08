import { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  BookOpen, PenLine, Palette, Rocket, Heart, Search, Users, Layers,
  ChevronDown, LayoutDashboard, FileText, Upload, FolderOpen, GraduationCap,
} from 'lucide-react';
import { V2_TOOLS, V2_TOOL_CATEGORIES } from '@/data/v2ToolsRegistry';

/** Onglets principaux V3 — style Vivlio */
const PRIMARY_TABS = [
  { to: '/v3/create',       label: 'Plan',       emoji: '📘', icon: BookOpen },
  { to: '/ebook-planner',   label: 'Écrire',     emoji: '✍️', icon: PenLine },
  { to: '/couverture-kdp',  label: 'Habiller',   emoji: '🎨', icon: Palette },
  { to: '/audit-pilot',     label: 'Publier',    emoji: '🚀', icon: Rocket },
  { to: '/plan-marketing',  label: 'Vendre',     emoji: '💛', icon: Heart },
  { to: '/kdp-keywords',    label: 'Audit ASIN', icon: Search },
  { to: '/offres',          label: 'Communauté', icon: Users, badge: 'NEW' },
  { to: '/niches-600',      label: '600 Niches', icon: Layers, badge: 'NEW' },
];

/** Ligne 2 : accès rapide */
const QUICK_TOOLS = [
  { to: '/kdp-keywords',   label: 'Mots-clés Amazon (KDSpy)', icon: Search, emoji: '🔍' },
  { to: '/ebookbot',       label: 'Tableau de bord IA',        icon: LayoutDashboard },
  { to: '/v3/create',      label: 'Plan du livre',             icon: BookOpen },
  { to: '/v3/create?step=3', label: 'Personnages',             icon: Users },
  { to: '/fiches-pratiques', label: 'Modèles',                 icon: FileText },
  { to: '/v3/create?import=1', label: 'Importer un doc',       icon: Upload },
  { to: '/v3/library',     label: 'Mes projets',               icon: FolderOpen },
  { to: '/formation',      label: 'Guides',                    icon: GraduationCap },
];

export default function V3MainTabs() {
  const [openAll, setOpenAll] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpenAll(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const tabCls = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-1.5 px-3 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors ${
      isActive
        ? 'bg-[var(--v3-orange)] text-white'
        : 'text-[var(--v3-ink)] hover:bg-[var(--v3-orange-50)] hover:text-[var(--v3-orange-600)]'
    }`;

  return (
    <div ref={ref} className="border-t border-black/5 bg-white/85 backdrop-blur">
      {/* Ligne principale */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-2 flex items-center gap-1 overflow-x-auto">
        {PRIMARY_TABS.map((t) => (
          <NavLink key={t.to + t.label} to={t.to} className={tabCls} end>
            {t.emoji ? <span>{t.emoji}</span> : <t.icon className="w-4 h-4" />}
            <span>{t.label}</span>
            {t.badge && (
              <span className="ml-1 text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-500 text-white">
                {t.badge}
              </span>
            )}
          </NavLink>
        ))}

        {/* + Tous les outils */}
        <div className="relative shrink-0 ml-1">
          <button
            onClick={() => setOpenAll((o) => !o)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-[13px] font-semibold whitespace-nowrap border transition-colors ${
              openAll
                ? 'border-[var(--v3-orange)] bg-[var(--v3-orange-50)] text-[var(--v3-orange-600)]'
                : 'border-[var(--v3-orange)]/40 text-[var(--v3-orange-600)] hover:bg-[var(--v3-orange-50)]'
            }`}
          >
            + Tous les outils
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openAll ? 'rotate-180' : ''}`} />
          </button>

          {openAll && (
            <div className="absolute right-0 top-full mt-2 w-[560px] max-h-[70vh] overflow-y-auto bg-white rounded-xl border border-black/5 shadow-2xl z-50 p-3 grid grid-cols-2 gap-2">
              {V2_TOOL_CATEGORIES.map((cat) => {
                const tools = V2_TOOLS.filter((t) => t.category === cat.id);
                return (
                  <div key={cat.id} className="col-span-2">
                    <div className="text-[10px] uppercase tracking-wider text-[var(--v3-muted)] px-2 py-1">
                      {cat.emoji} {cat.label}
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      {tools.map((tool) => {
                        const Icon = tool.icon;
                        return (
                          <Link
                            key={tool.id}
                            to={tool.route}
                            onClick={() => setOpenAll(false)}
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-[var(--v3-orange-50)] transition-colors"
                          >
                            <Icon className="w-4 h-4 text-[var(--v3-orange-600)] shrink-0" />
                            <span className="text-[12px] font-medium text-[var(--v3-ink)] truncate">
                              {tool.label}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Ligne 2 — accès rapide */}
      <div className="border-t border-black/5">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-1.5 flex items-center gap-1 overflow-x-auto">
          {QUICK_TOOLS.map((q) => (
            <Link
              key={q.label}
              to={q.to}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[12px] text-[var(--v3-muted)] hover:text-[var(--v3-orange-600)] hover:bg-[var(--v3-orange-50)] whitespace-nowrap transition-colors"
            >
              {q.emoji ? <span>{q.emoji}</span> : <q.icon className="w-3.5 h-3.5" />}
              <span>{q.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
