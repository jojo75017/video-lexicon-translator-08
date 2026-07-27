import { Link, NavLink } from 'react-router-dom';
import {
  BookOpen, PenLine, Palette, Rocket, Heart, Search, Users, Layers,
  LayoutDashboard, FileText, Upload, FolderOpen, GraduationCap, LayoutGrid,
} from 'lucide-react';

/** Onglets principaux V3 — style Vivlio */
const PRIMARY_TABS = [
  { to: '/v3/create',       label: 'Plan',       emoji: '📘' },
  { to: '/ebook-planner',   label: 'Écrire',     emoji: '✍️' },
  { to: '/couverture-kdp',  label: 'Habiller',   emoji: '🎨' },
  { to: '/audit-pilot',     label: 'Publier',    emoji: '🚀' },
  { to: '/v3/gallery',      label: 'Vendre',     emoji: '💛' },
  { to: '/kdp-keywords',    label: 'Audit ASIN', icon: Search },
  { to: '/v3/auteur',       label: 'Communauté', icon: Users, badge: 'NEW' },
  { to: '/niches-600',      label: '600 Niches', icon: Layers, badge: 'NEW' },
];

/** Ligne 2 : accès rapide */
const QUICK_TOOLS = [
  { to: '/kdp-keywords',      label: 'Mots-clés Amazon (KDSpy)', icon: Search, emoji: '🔍' },
  { to: '/v3/hub',            label: 'Tableau de bord IA',        icon: LayoutDashboard },
  { to: '/v3/create',         label: 'Plan du livre',             icon: BookOpen },
  { to: '/v3/create?step=3',  label: 'Personnages',               icon: Users },
  { to: '/fiches-pratiques',  label: 'Modèles',                   icon: FileText },
  { to: '/v3/create?import=1', label: 'Importer un doc',          icon: Upload },
  { to: '/v3/library',        label: 'Mes projets',               icon: FolderOpen },
  { to: '/blog',              label: 'Guides',                    icon: GraduationCap },
];

export default function V3MainTabs() {
  const tabCls = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-1.5 px-3 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors ${
      isActive
        ? 'bg-[var(--v3-orange)] text-white'
        : 'text-[var(--v3-ink)] hover:bg-[var(--v3-orange-50)] hover:text-[var(--v3-orange-600)]'
    }`;

  return (
    <div className="border-t border-black/5 bg-white/85 backdrop-blur">
      {/* Ligne principale — wrap, pas d'ascenseur horizontal */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-2 flex flex-wrap items-center gap-1.5">
        {PRIMARY_TABS.map((t) => (
          <NavLink key={t.to + t.label} to={t.to} className={tabCls} end>
            {t.emoji ? <span>{t.emoji}</span> : t.icon ? <t.icon className="w-4 h-4" /> : null}
            <span>{t.label}</span>
            {t.badge && (
              <span className="ml-1 text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-500 text-white">
                {t.badge}
              </span>
            )}
          </NavLink>
        ))}

        <Link
          to="/v3/outils"
          className="flex items-center gap-1.5 px-3 py-2 rounded-full text-[13px] font-semibold whitespace-nowrap border border-[var(--v3-orange)] bg-[var(--v3-orange)] text-white hover:bg-[var(--v3-orange-600)] transition-colors"
        >
          <LayoutGrid className="w-4 h-4" />
          Tous les outils
        </Link>
      </div>

      {/* Ligne 2 — accès rapide (wrap aussi) */}
      <div className="border-t border-black/5">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-1.5 flex flex-wrap items-center gap-1">
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
