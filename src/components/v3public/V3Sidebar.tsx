import { NavLink, useLocation } from 'react-router-dom';
import {
  Home, Sparkles, Library, Users, BookOpen, User, Settings,
  Wand2, Palette, Package, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

const NAV = [
  { section: 'Écrire', items: [
    { to: '/v3', label: 'Accueil', icon: Home, end: true },
    { to: '/v3/create', label: 'Créer un livre', icon: Sparkles },
    { to: '/v3/library', label: 'Ma bibliothèque', icon: Library },
  ]},
  { section: 'Outils', items: [
    { to: '/v3/books', label: 'Mes livres publiés', icon: BookOpen },
    { to: '/hub-v3', label: 'Studio 30 agents', icon: Wand2 },
    { to: '/v3/gallery', label: 'Galerie communauté', icon: Users },
  ]},
  { section: 'Livres spéciaux', items: [
    { to: '/v3/special/roman', label: 'Roman', icon: BookOpen },
    { to: '/v3/special/cuisine', label: 'Cuisine', icon: Palette },
    { to: '/v3/special/voyage', label: 'Voyage', icon: Package },
    { to: '/v3/special/jeunesse', label: 'Jeunesse', icon: Sparkles },
  ]},
  { section: 'Compte', items: [
    { to: '/v3/auteur', label: 'Georges Boubet', icon: User },
    { to: '/v3/settings', label: 'Paramètres auteur', icon: Settings },
  ]},
];

export default function V3Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();

  return (
    <aside
      className={`shrink-0 border-r border-black/10 bg-white transition-all duration-200 ${collapsed ? 'w-14' : 'w-60'}`}
      style={{ position: 'sticky', top: 0, alignSelf: 'flex-start', height: '100vh', overflowY: 'auto' }}
    >
      <div className="flex items-center justify-between px-3 py-3 border-b border-black/5">
        {!collapsed && <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--v3-muted)]">Navigation</span>}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="ml-auto rounded p-1 hover:bg-black/5 text-[var(--v3-muted)]"
          aria-label={collapsed ? 'Déplier' : 'Replier'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <nav className="p-2 space-y-4">
        {NAV.map((group) => (
          <div key={group.section}>
            {!collapsed && (
              <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-[var(--v3-muted)]">
                {group.section}
              </div>
            )}
            <ul className="space-y-0.5">
              {group.items.map((it) => {
                const active = it.end ? pathname === it.to : pathname.startsWith(it.to);
                const Icon = it.icon;
                return (
                  <li key={it.to}>
                    <NavLink
                      to={it.to}
                      end={(it as any).end}
                      title={it.label}
                      className={`flex items-center gap-2 rounded-md px-2 py-2 text-[13px] transition-colors ${
                        active
                          ? 'bg-[var(--v3-orange)] text-white font-semibold'
                          : 'text-[var(--v3-ink)] hover:bg-black/5'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {!collapsed && <span className="truncate">{it.label}</span>}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
