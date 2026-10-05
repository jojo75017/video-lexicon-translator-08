import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, LayoutGrid, Menu, X, ArrowRight, Sparkles } from 'lucide-react';
import { isRouteNouveau } from '@/data/v3Nouveautes';
import { V3_HEADER_MENU, type MenuCategory } from '@/data/v3HeaderMenu';
import useV3Open from '@/hooks/useV3Open';
import useIsAdmin from '@/hooks/useIsAdmin';
import { isPreviewingAsSubscriber } from '@/components/v3/V3ContemplationMode';
import AgentPortrait from '@/components/v3public/AgentPortrait';

/** Couleur « voyant robot » + spécialiste référent par catégorie du menu. */
const ROBOT_THEME: Record<string, { color: string; agent: string; name: string; role: string }> = {
  creer: { color: '#0F766E', agent: 'camille', name: 'Camille', role: 'Lance votre livre et son sommaire' },
  ecrire: { color: '#1D4ED8', agent: 'victor', name: 'Victor', role: 'Rédige chapitre par chapitre' },
  habiller: { color: '#EC4899', agent: 'iris', name: 'Iris', role: 'Signe vos couvertures' },
  kdp: { color: '#4D7C5B', agent: 'gaspard', name: 'Gaspard', role: 'Repère les niches Amazon' },
  publier: { color: '#0891B2', agent: 'timothee', name: 'Timothée', role: 'Traduit et prépare la voix' },
  vendre: { color: '#CA8A04', agent: 'solene', name: 'Solène', role: 'Optimise votre fiche KDP' },
  livres: { color: '#9333EA', agent: 'prune', name: 'Prune', role: 'Crée les livres spéciaux' },
  plans: { color: '#D97706', agent: 'aurele', name: 'Aurèle', role: 'Vous guide vers la bonne formule' },
};

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
  const { open: v3Open } = useV3Open();
  const { isAdmin } = useIsAdmin();
  // Avant l'ouverture, un visiteur (non admin) contemple la V3 sans pouvoir
  // ouvrir les onglets : la barre reste visible mais totalement inactive.
  const tabsLocked = v3Open === false && (isAdmin === false || (isAdmin === true && isPreviewingAsSubscriber()));

  const openCat = (key: string, el: HTMLElement) => {
    if (tabsLocked) return;
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

  // Panneau ouvert : positionné hors de la rangée scrollable, jamais coupé à droite
  const openCatData = openKey ? V3_HEADER_MENU.find((c) => c.key === openKey) ?? null : null;
  const openCols = openCatData ? (openCatData.links.length > 8 ? 3 : openCatData.links.length > 4 ? 2 : 1) : 1;
  const openPanelWidth = openCols === 1 ? 320 : openCols === 2 ? 560 : 780;
  const viewportW = typeof window !== 'undefined' ? window.innerWidth : 1600;
  const panelLeft = Math.max(8, Math.min(anchorLeft, viewportW - openPanelWidth - 16));


  return (
    <div data-v3-nav=""
      className="sticky top-16 z-30 relative overflow-x-clip"
      style={{
        background: 'var(--v3-paper)',
        borderBottom: '1px solid var(--v3-line)',
      }}
      aria-disabled={tabsLocked || undefined}
    >
      {tabsLocked && (
        <div
          className="text-center text-[11px] font-semibold py-1"
          style={{ background: 'var(--v3-gold-soft)', color: 'var(--v3-emerald)', borderBottom: '1px solid var(--v3-line)' }}
        >
          🔒 Aperçu de la V3 — les onglets s'ouvrent le 1ᵉʳ octobre 2026
        </div>
      )}
      <div className={`max-w-[1600px] mx-auto pl-4 md:pl-6 pr-2 md:pr-3 h-14 flex items-center gap-1 ${tabsLocked ? 'pointer-events-none select-none opacity-70' : ''}`}>
        {/* Desktop (≥ xl) — rangée scrollable : aucun onglet n'est coupé */}
        <nav className="hidden xl:flex items-center gap-0.5 min-[1440px]:gap-1 flex-1 min-w-0 overflow-x-auto v3-no-scrollbar font-sans">
          <NavLink
            to="/v3"
            end
            className="v3-btn h-9 rounded-full text-[12px] ml-1 shrink-0 transition-transform"
            style={({ isActive }) => ({
              padding: '8px 10px', gap: 6,
              background: '#1D4ED8',
              color: '#ffffff',
              border: '1px solid #1e40af',
              fontWeight: 700,
              textShadow: 'none',
              ...(isActive ? { boxShadow: '0 0 0 2px rgba(29,78,216,0.35)' } : {}),
            })}
          >
            <span aria-hidden className="text-[15px] hidden min-[1440px]:inline">🏠</span>
            <span>Accueil</span>
          </NavLink>
          <NavLink
            to="/v3/offre"
            className={({ isActive }) =>
              `v3-btn h-9 rounded-full text-[12px] shrink-0 ${isActive ? 'v3-btn-gold' : ''}`
            }
            style={{
              background: 'linear-gradient(135deg,#FF9E2D 0%,#fbbf24 100%)',
              color: '#1f2937',
              border: '1px solid #f59e0b',
              fontWeight: 700,
              textShadow: 'none',
              padding: '8px 10px',
              gap: 6,
            }}
          >
            <span aria-hidden>✨</span>
            <span>Offre à vie · 15 oct.</span>
          </NavLink>
          <NavLink
            to={pathname === '/v3' ? '/v3#v3-upsells' : '/v3/upsells'}
            onClick={
              pathname === '/v3'
                ? (e) => {
                    e.preventDefault();
                    document.getElementById('v3-upsells')?.scrollIntoView({ behavior: 'smooth' });
                  }
                : undefined
            }
            className="v3-btn h-9 rounded-full text-[12px] shrink-0"
            style={({ isActive }) => ({
              background: isActive ? 'var(--v3-gold)' : 'var(--v3-gold-soft)',
              color: 'var(--v3-emerald)',
              border: '1px solid var(--v3-gold)',
              fontWeight: 700,
              textShadow: 'none',
              padding: '8px 10px',
              gap: 6,
            })}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>UPSELLS</span>
            <span className="v3-badge hidden min-[1440px]:inline">6</span>
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
                  className="v3-btn v3-robot-tab flex h-9 items-center gap-1 rounded-full text-[11.5px] min-[1440px]:text-[12px] font-sans font-semibold whitespace-nowrap transition-colors"
                  style={(() => {
                    const c = ROBOT_THEME[cat.key]?.color ?? '#0F766E';
                    return {
                      ['--robot' as string]: c,
                      padding: window.innerWidth < 1440 ? '8px 5px' : '8px 10px',
                      color: active ? c : 'var(--v3-ink)',
                      borderColor: active ? c : `${c}55`,
                      background: active ? `${c}1F` : `${c}0D`,
                    };
                  })()}
                >
                  <span
                    aria-hidden
                    className="hidden min-[1440px]:inline-block w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: ROBOT_THEME[cat.key]?.color, boxShadow: `0 0 6px ${ROBOT_THEME[cat.key]?.color}` }}
                  />
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
            className="v3-btn h-9 rounded-full text-[12px] whitespace-nowrap font-semibold transition-colors hover:opacity-90"
            style={{ padding: '8px 16px', background: '#1E2536', color: '#F8F5EE', border: '1px solid #1E2536' }}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Tous les outils
          </Link>
        </div>

        {/* Mobile & tablette (< xl) — menu « Catégories » */}
        <div className="xl:hidden flex items-center gap-2 flex-1">
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="flex h-9 items-center gap-2 rounded-full px-3 py-2 font-sans text-[13px] font-semibold"
            style={{ color: 'var(--v3-emerald)' }}
            aria-label="Ouvrir le menu des catégories"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            Catégories
          </button>
          <Link
            to="/v3/outils"
            className="ml-auto v3-btn v3-btn-primary h-9 rounded-full text-[12px] whitespace-nowrap"
            style={{ padding: '7px 14px' }}
          >
            <LayoutGrid className="w-3.5 h-3.5" /> Tous les outils
          </Link>
        </div>
      </div>

      {/* Mega-panneau desktop — rendu hors de la rangée scrollable */}
      {openCatData && (
        <div
          className="hidden xl:block absolute top-full pt-2 z-50"
          style={{ left: panelLeft }}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          <div
            className="rounded-2xl bg-white overflow-hidden"
            style={{
              minWidth: openPanelWidth,
              boxShadow: 'var(--v3-shadow-menu)',
              border: '1px solid var(--v3-line)',
            }}
          >
            <div style={{ height: 3, background: ROBOT_THEME[openCatData.key]?.color ?? 'var(--v3-gold)' }} />
            <div className="px-5 pt-4 pb-2 flex items-center gap-3">
              {ROBOT_THEME[openCatData.key] && (
                <div
                  className="w-11 h-11 rounded-full overflow-hidden shrink-0 [&_img]:w-full [&_img]:h-full [&_img]:object-cover"
                  style={{ boxShadow: `0 0 0 2px ${ROBOT_THEME[openCatData.key].color}` }}
                >
                  <AgentPortrait id={ROBOT_THEME[openCatData.key].agent} name={ROBOT_THEME[openCatData.key].name} />
                </div>
              )}
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-[0.22em] font-semibold" style={{ color: ROBOT_THEME[openCatData.key]?.color ?? 'var(--v3-gold-600)' }}>
                  {openCatData.tagline ?? openCatData.label}
                </div>
                <div className="v3-serif text-[18px] font-semibold mt-0.5" style={{ color: 'var(--v3-emerald)' }}>
                  {openCatData.emoji} {openCatData.label}
                </div>
                {ROBOT_THEME[openCatData.key] && (
                  <div className="text-[11.5px]" style={{ color: 'var(--v3-muted)' }}>
                    Avec {ROBOT_THEME[openCatData.key].name} · {ROBOT_THEME[openCatData.key].role}
                  </div>
                )}
              </div>
            </div>
            <div className="px-3 pb-3 grid gap-1" style={{ gridTemplateColumns: `repeat(${openCols}, minmax(0, 1fr))` }}>
              {columnize(openCatData.links, openCols).map((col, ci) => (
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
                            {(isRouteNouveau(l.to) ? 'Nouveau' : l.badge) && <span className="v3-badge">{isRouteNouveau(l.to) ? 'Nouveau' : l.badge}</span>}
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

      {/* Accordéon mobile & tablette */}
      {mobileOpen && (
        <div className="xl:hidden border-t bg-white max-h-[70vh] overflow-y-auto" style={{ borderColor: 'var(--v3-line)' }}>
          <div className="px-4 py-3 space-y-2">
            <NavLink
              to="/v3"
              end
              onClick={() => setMobileOpen(false)}
              className="v3-btn v3-btn-gold h-10 w-full justify-center rounded-full font-sans text-[13px]"
            >
              <span aria-hidden className="text-[15px]">🏠</span> Accueil
            </NavLink>
            <NavLink
              to="/v3/offre"
              onClick={() => setMobileOpen(false)}
              className="v3-btn h-10 w-full justify-center rounded-full font-sans text-[13px]"
              style={{
                background: 'linear-gradient(135deg,#FF9E2D,#fbbf24)',
                color: '#1f2937',
                border: '1px solid #f59e0b',
                fontWeight: 700,
                textShadow: 'none',
              }}
            >
              ✨ Offre à vie · 15 oct.
            </NavLink>
            <NavLink
              to="/v3/upsells"
              onClick={() => setMobileOpen(false)}
              className="v3-btn h-10 w-full justify-center rounded-full font-sans text-[13px]"
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
              <details key={cat.key} className="rounded-2xl" style={{ border: '1px solid var(--v3-line)' }}>
                <summary
                  className="flex items-center gap-2 px-3 py-2.5 cursor-pointer font-sans text-[14px] font-semibold"
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
