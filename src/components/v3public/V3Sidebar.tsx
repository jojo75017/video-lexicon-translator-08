import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Sparkles, Library, Users, BookOpen, User, Settings,
  Wand2, Palette, Package, ChevronLeft, ChevronRight,
  Compass, GraduationCap, Gem, Map as MapIcon, Clock, FileText, Bot, Download, Lock,
} from 'lucide-react';
import { useState } from 'react';
import useV3Entitlement from '@/hooks/useV3Entitlement';

// `paid: true` = module premium (upsell). Verrouillé pour tout le monde sauf l'admin.
type NavItem = { to: string; label: string; icon: any; end?: boolean; paid?: boolean };

const NAV: { section: string; items: NavItem[] }[] = [
  { section: 'Écrire', items: [
    { to: '/v3', label: 'Accueil', icon: Home, end: true },
    { to: '/v3/create', label: 'Créer un livre', icon: Sparkles },
    { to: '/v3/library', label: 'Ma bibliothèque', icon: Library },
  ]},
  { section: 'Hub 30 agents', items: [
    { to: '/v3/hub?tab=parcours', label: 'Parcours', icon: Compass },
    { to: '/v3/hub?tab=outils', label: 'Outils V3', icon: Wand2 },
    { to: '/v3/hub?tab=toolsV2', label: 'Tous les outils (V2)', icon: Package },
    { to: '/v3/hub?tab=documentation', label: 'Documentation Studio', icon: Sparkles, paid: true },
    { to: '/v3/hub?tab=livres', label: 'Mes livres', icon: BookOpen },
    { to: '/v3/hub?tab=guides', label: 'Guides', icon: GraduationCap },
    { to: '/v3/hub?tab=offres', label: 'Offres & Packs', icon: Gem },
    { to: '/v3/hub?tab=roadmap', label: 'Roadmap', icon: MapIcon },
    { to: '/v3/hub?tab=pending', label: 'En attente', icon: Clock },
    { to: '/v3/hub?tab=script', label: 'Script vidéo', icon: FileText },
    { to: '/v3/hub?tab=assistant', label: "Parler avec l'IA", icon: Bot },
    { to: '/v3/hub?tab=bookperfect', label: 'BookPerfect AI', icon: BookOpen, paid: true },
    { to: '/v3/hub?tab=export', label: 'Exporter le livre', icon: Download, paid: true },
  ]},
  { section: 'Livres spéciaux', items: [
    { to: '/v3/livres/roman', label: 'Roman', icon: BookOpen, paid: true },
    { to: '/v3/livres/cuisine', label: 'Cuisine', icon: Palette, paid: true },
    { to: '/v3/livres/voyage', label: 'Voyage', icon: Package, paid: true },
    { to: '/v3/livres/coloriage', label: 'Coloriage', icon: Palette, paid: true },
    { to: '/v3/livres/bd', label: 'BD / Manga', icon: BookOpen, paid: true },
    { to: '/v3/livres/documentaire', label: 'Documentaire', icon: FileText, paid: true },
    { to: '/v3/livres/atlas', label: 'Atlas', icon: MapIcon, paid: true },
    { to: '/v3/livres/encyclopedie', label: 'Encyclopédie', icon: BookOpen, paid: true },
    { to: '/v3/livres/agenda', label: 'Agenda', icon: Clock, paid: true },
    { to: '/v3/livres/journal', label: 'Journal', icon: FileText, paid: true },
    { to: '/v3/livres/scolaire', label: 'Scolaire', icon: GraduationCap, paid: true },
    { to: '/v3/livres/aquariophilie', label: 'Aquariophilie', icon: Sparkles, paid: true },
    { to: '/v3/livres/oiseaux', label: 'Fiches oiseaux', icon: Sparkles, paid: true },
    { to: '/v3/livres/saga', label: 'Saga multi-tomes', icon: BookOpen, paid: true },
  ]},

  { section: 'Communauté', items: [
    { to: '/v3/gallery', label: 'Galerie communauté', icon: Users },
  ]},
  { section: 'Compte', items: [
    { to: '/v3/auteur', label: 'Georges Boubet', icon: User },
    { to: '/v3/settings', label: 'Version V2', icon: Settings },
  ]},
];

export default function V3Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const currentTab = new URLSearchParams(search).get('tab');
  const { isAdmin } = useV3Entitlement();

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
                const [itPath, itQuery] = it.to.split('?');
                const itTab = itQuery ? new URLSearchParams(itQuery).get('tab') : null;
                const active = it.end
                  ? pathname === itPath
                  : itTab
                    ? pathname === itPath && currentTab === itTab
                    : pathname.startsWith(itPath);
                const Icon = it.icon;
                const locked = !!it.paid && !isAdmin;
                const title = locked ? `${it.label} — Réservé aux abonnés (voir Offres & Packs)` : it.label;

                const baseCls = `flex items-center gap-2 rounded-md px-2 py-2 text-[13px] transition-colors ${
                  active
                    ? 'bg-[var(--v3-orange)] text-white font-semibold'
                    : locked
                      ? 'text-[var(--v3-muted)] hover:bg-black/5'
                      : 'text-[var(--v3-ink)] hover:bg-black/5'
                }`;

                const content = (
                  <>
                    <Icon className="w-4 h-4 shrink-0" />
                    {!collapsed && <span className="truncate flex-1">{it.label}</span>}
                    {!collapsed && locked && <Lock className="w-3 h-3 shrink-0 opacity-70" />}
                  </>
                );

                return (
                  <li key={it.to}>
                    {locked ? (
                      <button
                        type="button"
                        title={title}
                        onClick={() => navigate('/v3/hub?tab=offres')}
                        className={`${baseCls} w-full text-left`}
                      >
                        {content}
                      </button>
                    ) : (
                      <NavLink
                        to={it.to}
                        end={(it as any).end}
                        title={title}
                        className={baseCls}
                      >
                        {content}
                      </NavLink>
                    )}
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
