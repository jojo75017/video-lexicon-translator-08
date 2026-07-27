import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, LayoutGrid, Menu, X } from 'lucide-react';
import { V3_HEADER_MENU, type MenuCategory } from '@/data/v3HeaderMenu';

/**
 * V3 mega-menu principal — 1 seule ligne de catégories, chacune ouvre un panneau
 * de sous-catégories au hover (desktop) ou click (mobile).
 */
export default function V3MainTabs() {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const { pathname, search } = useLocation();

  const scheduleClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenKey(null), 150);
  };
  const cancelClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  };

  // Ferme au changement de route
  useEffect(() => {
    setOpenKey(null);
    setMobileOpen(false);
  }, [pathname, search]);

  const isCatActive = (cat: MenuCategory) =>
    cat.links.some((l) => {
      const [p] = l.to.split('?');
      return pathname === p || (p.length > 1 && pathname.startsWith(p + '/'));
    });

  return (
    <div className="sticky top-16 z-30 border-t border-b border-black/5 bg-white/90 backdrop-blur">
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-12 flex items-center gap-1">
        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {V3_HEADER_MENU.map((cat) => {
            const active = openKey === cat.key || isCatActive(cat);
            return (
              <div
                key={cat.key}
                className="relative"
                onMouseEnter={() => { cancelClose(); setOpenKey(cat.key); }}
                onMouseLeave={scheduleClose}
              >
                <button
                  type="button"
                  onClick={() => setOpenKey((k) => (k === cat.key ? null : cat.key))}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full text-[13px] font-medium transition-colors"
                  style={
                    active
                      ? { background: cat.color, color: '#fff' }
                      : { color: 'var(--v3-ink)' }
                  }
                  onMouseOver={(e) => {
                    if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.04)';
                  }}
                  onMouseOut={(e) => {
                    if (!active) (e.currentTarget as HTMLElement).style.background = '';
                  }}
                >
                  <span aria-hidden>{cat.emoji}</span>
                  <span>{cat.label}</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </button>

                {openKey === cat.key && (
                  <div
                    className="absolute left-0 top-full pt-2"
                    onMouseEnter={cancelClose}
                    onMouseLeave={scheduleClose}
                  >
                    <div
                      className="min-w-[280px] max-w-[380px] rounded-xl border border-black/10 bg-white shadow-xl p-2"
                      style={{ borderTopColor: cat.color, borderTopWidth: 3 }}
                    >
                      <ul className="grid grid-cols-1 gap-0.5">
                        {cat.links.map((l) => (
                          <li key={l.to + l.label}>
                            <NavLink
                              to={l.to}
                              className="flex items-start gap-2 rounded-md px-3 py-2 text-[13px] text-[var(--v3-ink)] hover:bg-black/5 transition-colors"
                            >
                              <span className="flex-1 min-w-0">
                                <span className="font-medium flex items-center gap-1.5">
                                  {l.label}
                                  {l.badge && (
                                    <span
                                      className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full text-white"
                                      style={{ background: cat.color }}
                                    >
                                      {l.badge}
                                    </span>
                                  )}
                                </span>
                                {l.desc && (
                                  <span className="block text-[11px] text-[var(--v3-muted)] mt-0.5">
                                    {l.desc}
                                  </span>
                                )}
                              </span>
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <div className="ml-auto">
            <Link
              to="/v3/outils"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-semibold border border-[var(--v3-orange)] bg-[var(--v3-orange)] text-white hover:bg-[var(--v3-orange-600)] transition-colors"
            >
              <LayoutGrid className="w-4 h-4" />
              Tous les outils
            </Link>
          </div>
        </nav>

        {/* Mobile trigger */}
        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="md:hidden flex items-center gap-2 px-3 py-2 rounded-md text-[13px] font-medium text-[var(--v3-ink)] hover:bg-black/5"
          aria-label="Ouvrir le menu"
        >
          {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          Menu
        </button>
        <Link
          to="/v3/outils"
          className="md:hidden ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold border border-[var(--v3-orange)] bg-[var(--v3-orange)] text-white"
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          Outils
        </Link>
      </div>

      {/* Panneau mobile — accordéons */}
      {mobileOpen && (
        <div className="md:hidden border-t border-black/5 bg-white max-h-[70vh] overflow-y-auto">
          <div className="px-4 py-3 space-y-2">
            {V3_HEADER_MENU.map((cat) => (
              <details key={cat.key} className="rounded-lg border border-black/10">
                <summary
                  className="flex items-center gap-2 px-3 py-2 cursor-pointer text-[13px] font-semibold"
                  style={{ color: cat.color }}
                >
                  <span>{cat.emoji}</span>
                  <span className="flex-1">{cat.label}</span>
                  <ChevronDown className="w-4 h-4 opacity-60" />
                </summary>
                <ul className="px-2 pb-2 space-y-0.5">
                  {cat.links.map((l) => (
                    <li key={l.to + l.label}>
                      <NavLink
                        to={l.to}
                        className="block px-3 py-2 rounded-md text-[13px] text-[var(--v3-ink)] hover:bg-black/5"
                      >
                        {l.label}
                        {l.badge && (
                          <span
                            className="ml-2 text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full text-white"
                            style={{ background: cat.color }}
                          >
                            {l.badge}
                          </span>
                        )}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
