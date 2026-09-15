import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, LayoutGrid, Menu, X, ArrowRight, Sparkles } from 'lucide-react';
import { isRouteNouveau } from '@/data/v3Nouveautes';
import { V3_HEADER_MENU, type MenuCategory } from '@/data/v3HeaderMenu';

/**
 * Ligne 2 du header — mega-menu premium.
 * Fond papier, filet or, typo sérif pour les catégories, panels 3 colonnes.
 */
export default function V3MainTabs() {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [anchorLeft, setAnchorLeft] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const { pathname, search } = useLocation();

  const openCat = (key: string, el: HTMLElement) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setAnchorLeft(el.getBoundingClientRect().left);
    setOpenKey(key);
  };

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
      className="sticky top-16 z-30 relative overflow-x-clip"
      style={{
        background: 'var(--v3-paper)',
        borderBottom: '1px solid var(--v3-line)',
      }}
    >
      <div className="max-w-7xl mx-auto pl-5 md:pl-8 pr-2 md:pr-4 h-14 flex items-center gap-1">
        {/* Desktop (≥ xl) — rangée scrollable : aucun onglet n'est coupé */}
        <nav className="hidden xl:flex items-center gap-0.5 flex-1 min-w-0 overflow-x-auto v3-no-scrollbar">
          <NavLink
            to="/v3"
            end
            className={({ isActive }) =>
              `v3-btn text-[12px] ml-1 mr-1 shrink-0 ${isActive ? 'v3-btn-gold' : 'v3-btn-outline'}`
            }
            style={({ isActive }) =>
              isActive ? {} : { borderColor: 'var(--v3-gold)', color: 'var(--v3-emerald)' }
            }
          >
            <span aria-hidden className="text-[15px]">🏠</span>
            <span>Accueil</span>
          </NavLink>
          <NavLink
            to="/v3/offre"
            className={({ isActive }) =>
              `v3-btn text-[12px] mr-1 shrink-0 ${isActive ? 'v3-btn-gold' : ''}`
            }
            style={{
              background: 'linear-gradient(135deg,#FF9E2D 0%,#fbbf24 100%)',
              color: '#1f2937',
              border: '1px solid #f59e0b',
              fontWeight: 700,
              textShadow: 'none',
            }}
          >
            <span aria-hidden>✨</span>
            <span>Offre V3 · 1er oct.</span>
          </NavLink>
          <NavLink
            to="/v3/upsells"
            className="v3-btn text-[12px] mr-1 shrink-0"
            style={({ isActive }) => ({
              background: isActive ? 'var(--v3-gold)' : 'var(--v3-gold-soft)',
              color: 'var(--v3-emerald)',
              border: '1px solid var(--v3-gold)',
              fontWeight: 700,
              textShadow: 'none',
            })}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>UPSELLS</span>
            <span className="v3-badge">6 compléments</span>
          </NavLink>





          {V3_HEADER_MENU.map((cat) => {
            const active = openKey === cat.key || isCatActive(cat);

            return (
              <div
                key={cat.key}
                className="shrink-0"
                onMouseEnter={(e) => openCat(cat.key, e.currentTarget)}
                onMouseLeave={scheduleClose}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    if (openKey === cat.key) setOpenKey(null);
                    else openCat(cat.key, e.currentTarget);
                  }}
                  data-active={active ? 'true' : 'false'}
                  className="v3-nav-item flex items-center gap-1.5 px-3 py-2 text-[13.5px] v3-serif font-semibold whitespace-nowrap"
                  style={{ color: active ? 'var(--v3-emerald)' : 'var(--v3-ink)' }}
                >
                  <span aria-hidden className="text-[15px]">{cat.emoji}</span>
                  <span>{cat.label}</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </button>
              </div>
            );
          })}
        </nav>

        {/* « Tous les outils » reste visible à droite, hors de la zone scrollable */}
        <div className="hidden xl:block shrink-0 pl-2 ml-1" style={{ borderLeft: '1px solid var(--v3-line)' }}>
          <Link
            to="/v3/outils"
            className="v3-btn v3-btn-primary text-[12.5px] whitespace-nowrap"
            style={{ padding: '8px 16px' }}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Tous les outils
          </Link>
        </div>

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
            <NavLink
              to="/v3"
              end
              onClick={() => setMobileOpen(false)}
              className="v3-btn v3-btn-gold w-full justify-center text-[13px]"
            >
              <span aria-hidden className="text-[15px]">🏠</span> Accueil
            </NavLink>
            <NavLink
              to="/v3/offre"
              onClick={() => setMobileOpen(false)}
              className="v3-btn w-full justify-center text-[13px]"
              style={{
                background: 'linear-gradient(135deg,#FF9E2D,#fbbf24)',
                color: '#1f2937',
                border: '1px solid #f59e0b',
                fontWeight: 700,
                textShadow: 'none',
              }}
            >
              ✨ Offre V3 · 1er octobre
            </NavLink>
            <NavLink
              to="/v3/upsells"
              onClick={() => setMobileOpen(false)}
              className="v3-btn w-full justify-center text-[13px]"
              style={{
                background: 'var(--v3-gold-soft)',
                color: 'var(--v3-emerald)',
                border: '1px solid var(--v3-gold)',
                fontWeight: 700,
                textShadow: 'none',
              }}
            >
              <Sparkles className="w-4 h-4" /> UPSELLS — packs &amp; compléments
            </NavLink>


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
                          {(isRouteNouveau(l.to) ? 'Nouveau' : l.badge) && <span className="v3-badge">{isRouteNouveau(l.to) ? 'Nouveau' : l.badge}</span>}
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
