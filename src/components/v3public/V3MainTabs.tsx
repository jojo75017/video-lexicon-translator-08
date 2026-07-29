import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, LayoutGrid, Menu, X, ArrowRight } from 'lucide-react';
import { V3_HEADER_MENU, type MenuCategory } from '@/data/v3HeaderMenu';

/**
 * Ligne 2 du header — mega-menu premium.
 * Fond papier, filet or, typo sérif pour les catégories, panels 3 colonnes.
 */
export default function V3MainTabs() {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const { pathname, search } = useLocation();

  const scheduleClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenKey(null), 160);
  };
  const cancelClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  };

  useEffect(() => {
    setOpenKey(null);
    setMobileOpen(false);
  }, [pathname, search]);

  const isCatActive = (cat: MenuCategory) =>
    cat.links.some((l) => {
      const [p] = l.to.split('?');
      return pathname === p || (p.length > 1 && pathname.startsWith(p + '/'));
    });

  // Split links in 2 or 3 columns for a balanced mega-panel
  const columnize = (links: MenuCategory['links'], cols: number) => {
    const rows = Math.ceil(links.length / cols);
    return Array.from({ length: cols }, (_, i) => links.slice(i * rows, (i + 1) * rows));
  };

  return (
    <div
      className="sticky top-16 z-30 overflow-x-clip"
      style={{
        background: 'var(--v3-paper)',
        borderBottom: '1px solid var(--v3-line)',
      }}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-14 flex items-center gap-1">
        {/* Desktop (≥ lg) */}
        <nav className="hidden lg:flex items-center gap-0.5 flex-1 min-w-0">
          <NavLink
            to="/v3"
            end
            className={({ isActive }) =>
              `v3-btn text-[12px] ml-1 mr-1 ${isActive ? 'v3-btn-gold' : 'v3-btn-outline'}`
            }
            style={({ isActive }) =>
              isActive ? {} : { borderColor: 'var(--v3-gold)', color: 'var(--v3-emerald)' }
            }
          >
            <span aria-hidden className="text-[15px]">🏠</span>
            <span>Accueil</span>
          </NavLink>


          {V3_HEADER_MENU.map((cat) => {
            const active = openKey === cat.key || isCatActive(cat);
            const cols = cat.links.length > 8 ? 3 : cat.links.length > 4 ? 2 : 1;
            const columns = columnize(cat.links, cols);

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
                  data-active={active ? 'true' : 'false'}
                  className="v3-nav-item flex items-center gap-1.5 px-3 py-2 text-[13.5px] v3-serif font-semibold"
                  style={{ color: active ? 'var(--v3-emerald)' : 'var(--v3-ink)' }}
                >
                  <span aria-hidden className="text-[15px]">{cat.emoji}</span>
                  <span>{cat.label}</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </button>

                {openKey === cat.key && (
                  <div
                    className="absolute left-0 top-full pt-2"
                    onMouseEnter={cancelClose}
                    onMouseLeave={scheduleClose}
                  >
                    <div
                      className="rounded-2xl bg-white overflow-hidden"
                      style={{
                        minWidth: cols === 1 ? 320 : cols === 2 ? 560 : 780,
                        boxShadow: 'var(--v3-shadow-menu)',
                        border: '1px solid var(--v3-line)',
                      }}
                    >
                      <div className="v3-gold-rule" />
                      <div className="px-5 pt-4 pb-2">
                        <div className="text-[10px] uppercase tracking-[0.22em] font-semibold" style={{ color: 'var(--v3-gold-600)' }}>
                          {cat.tagline ?? cat.label}
                        </div>
                        <div className="v3-serif text-[18px] font-semibold mt-0.5" style={{ color: 'var(--v3-emerald)' }}>
                          {cat.emoji} {cat.label}
                        </div>
                      </div>
                      <div className={`px-3 pb-3 grid gap-1`} style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
                        {columns.map((col, ci) => (
                          <ul key={ci} className="space-y-0.5">
                            {col.map((l) => (
                              <li key={l.to + l.label}>
                                <NavLink
                                  to={l.to}
                                  className="flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors group"
                                  style={{ color: 'var(--v3-ink)' }}
                                  onMouseOver={(e) => (e.currentTarget as HTMLElement).style.background = 'var(--v3-gold-soft)'}
                                  onMouseOut={(e) => (e.currentTarget as HTMLElement).style.background = ''}
                                >
                                  <span className="flex-1 min-w-0">
                                    <span className="flex items-center gap-2 text-[13px] font-semibold">
                                      <span>{l.label}</span>
                                      {l.badge && <span className="v3-badge">{l.badge}</span>}
                                    </span>
                                    {l.desc && (
                                      <span className="block text-[11.5px] mt-0.5 leading-snug" style={{ color: 'var(--v3-muted)' }}>
                                        {l.desc}
                                      </span>
                                    )}
                                  </span>
                                  <ArrowRight className="w-3.5 h-3.5 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--v3-emerald)' }} />
                                </NavLink>
                              </li>
                            ))}
                          </ul>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <div className="ml-auto">
            <Link
              to="/v3/outils"
              className="v3-btn v3-btn-primary text-[12.5px]"
              style={{ padding: '8px 16px' }}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Tous les outils
            </Link>
          </div>
        </nav>

        {/* Mobile & tablette (< lg) — wrapper qui applique bien lg:hidden */}
        <div className="lg:hidden flex items-center gap-2 flex-1">
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-[13px] font-semibold"
            style={{ color: 'var(--v3-emerald)' }}
            aria-label="Ouvrir le menu des catégories"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            Catégories
          </button>
          <Link
            to="/v3/outils"
            className="ml-auto v3-btn v3-btn-primary text-[12px] whitespace-nowrap"
            style={{ padding: '7px 14px' }}
          >
            <LayoutGrid className="w-3.5 h-3.5" /> Tous les outils
          </Link>
        </div>
      </div>

      {/* Accordéon mobile & tablette */}
      {mobileOpen && (
        <div className="lg:hidden border-t bg-white max-h-[70vh] overflow-y-auto" style={{ borderColor: 'var(--v3-line)' }}>
          <div className="px-4 py-3 space-y-2">
            {V3_HEADER_MENU.map((cat) => (
              <details key={cat.key} className="rounded-xl" style={{ border: '1px solid var(--v3-line)' }}>
                <summary
                  className="flex items-center gap-2 px-3 py-2.5 cursor-pointer v3-serif text-[14px] font-semibold"
                  style={{ color: 'var(--v3-emerald)' }}
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
                        className="block px-3 py-2 rounded-md text-[13px]"
                        style={{ color: 'var(--v3-ink)' }}
                      >
                        <span className="flex items-center gap-2">
                          {l.label}
                          {l.badge && <span className="v3-badge">{l.badge}</span>}
                        </span>
                        {l.desc && (
                          <span className="block text-[11px] mt-0.5" style={{ color: 'var(--v3-muted)' }}>
                            {l.desc}
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
