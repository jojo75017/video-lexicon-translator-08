import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Sparkles, Library, Users, BookOpen, User, Settings,
  Wand2, Palette, Package, ChevronLeft, ChevronRight,
  Compass, GraduationCap, Gem, Map as MapIcon, Clock, FileText, Bot, Download, Lock,
  LifeBuoy, Mail, HelpCircle,
} from 'lucide-react';
import { useState } from 'react';
import useV3Entitlement from '@/hooks/useV3Entitlement';

// `paid: true` = module premium (upsell). Verrouillé pour tout le monde sauf l'admin.
type NavItem = { to: string; label: string; icon: any; end?: boolean; paid?: boolean };
type NavSection = {
  section: string;
  color: string;      // pastille + label
  activeBg: string;   // bg de l'item actif
  items: NavItem[];
};

const NAV: NavSection[] = [
  { section: 'Écrire', color: '#F59E0B', activeBg: '#F59E0B', items: [
    { to: '/v3', label: 'Accueil', icon: Home, end: true },
    { to: '/v3/create', label: 'Créer un livre', icon: Sparkles },
    { to: '/v3/library', label: 'Ma bibliothèque', icon: Library },
  ]},
  { section: 'Hub 30 agents', color: '#0EA5A4', activeBg: '#0EA5A4', items: [
    { to: '/v3/hub?tab=parcours', label: 'Parcours', icon: Compass },
    { to: '/v3/hub?tab=outils', label: 'Outils V3', icon: Wand2 },
    { to: '/v3/outils', label: 'Tous les outils', icon: Package },
    { to: '/v3/hub?tab=documentation', label: 'Documentation Studio', icon: Sparkles, paid: true },
    { to: '/v3/hub?tab=livres', label: 'Mes livres', icon: BookOpen },
    { to: '/v3/hub?tab=offres', label: 'Offres & Packs', icon: Gem },
    { to: '/v3/hub?tab=roadmap', label: 'Roadmap', icon: MapIcon },
    { to: '/v3/hub?tab=pending', label: 'En attente', icon: Clock },
    { to: '/v3/hub?tab=assistant', label: "Parler avec l'IA", icon: Bot },
    { to: '/v3/hub?tab=bookperfect', label: 'BookPerfect AI', icon: BookOpen, paid: true },
    { to: '/v3/hub?tab=export', label: 'Exporter le livre', icon: Download, paid: true },
  ]},
  { section: 'Livres spéciaux', color: '#8B5CF6', activeBg: '#8B5CF6', items: [
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
  { section: 'Formation & Guides', color: '#3B82F6', activeBg: '#3B82F6', items: [
    { to: '/formation', label: 'Formation vidéo', icon: GraduationCap },
    { to: '/blog', label: 'Guides & Blog', icon: FileText },
    { to: '/v3/hub?tab=script', label: 'Script vidéo', icon: FileText },
    { to: '/v3/hub?tab=guides', label: 'Guides Hub', icon: GraduationCap },
  ]},
  { section: 'Communauté', color: '#10B981', activeBg: '#10B981', items: [
    { to: '/v3/gallery', label: 'Galerie communauté', icon: Users },
    { to: '/v3/auteur', label: 'Ma page auteur', icon: User },
  ]},
  { section: 'Support', color: '#0284C7', activeBg: '#0284C7', items: [
    { to: '/contact-support', label: 'Contact', icon: Mail },
    { to: '/faq', label: 'FAQ / Aide', icon: HelpCircle },
    { to: '/assistance', label: 'Assistance', icon: LifeBuoy },
  ]},
  { section: 'Compte', color: '#64748B', activeBg: '#64748B', items: [
    { to: '/v3/parametres', label: 'Paramètres', icon: Settings },
    { to: '/subscription', label: 'Mon abonnement', icon: Gem },
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
        {!collapsed && (
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--v3-muted)]">
            Navigation
          </span>
        )}
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
              <div
                className="flex items-center gap-2 px-2 pb-1 text-[10px] font-bold uppercase tracking-wider"
                style={{ color: group.color }}
              >
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{ background: group.color }}
                />
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
                    : pathname === itPath || (itPath.length > 1 && pathname.startsWith(itPath + '/'));
                const Icon = it.icon;
                const locked = !!it.paid && !isAdmin;
                const title = locked ? `${it.label} — Réservé aux abonnés (voir Offres & Packs)` : it.label;

                const baseCls = `flex items-center gap-2 rounded-md px-2 py-2 text-[13px] transition-colors ${
                  locked ? 'text-[var(--v3-muted)] hover:bg-black/5' : 'text-[var(--v3-ink)] hover:bg-black/5'
                }`;
                const activeStyle = active
                  ? { background: group.activeBg, color: '#fff', fontWeight: 600 }
                  : undefined;

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
                        style={activeStyle}
                      >
                        {content}
                      </button>
                    ) : (
                      <NavLink
                        to={it.to}
                        end={(it as any).end}
                        title={title}
                        className={baseCls}
                        style={activeStyle}
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
