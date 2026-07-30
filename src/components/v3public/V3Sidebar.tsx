import { NavLink, useLocation } from 'react-router-dom';
import {
  Home, Sparkles, Library, BookOpen, Settings,
  ChevronLeft, ChevronRight,
  GraduationCap, Gem, FileText, User,
  LifeBuoy, Mail, HelpCircle, FolderOpen, Video, ListTree, Award,
  Search, Target, BarChart3, Image as ImageIcon,
} from 'lucide-react';
import { useState } from 'react';

/**
 * Sidebar V3 — espace personnel uniquement (jamais les catégories du header).
 * Style Émeraude Prestige : fond blanc, actif = fond or doux + barre or.
 */
type NavItem = { to: string; label: string; icon: any; end?: boolean; external?: boolean; badge?: string };
type NavSection = { section: string; items: NavItem[] };

const NAV: NavSection[] = [
  {
    section: 'Recherche KDP',
    items: [
      { to: '/v3/recherche', label: 'Studio Recherche KDP', icon: Search, badge: 'Hub' },
      { to: '/v3/create', label: 'Écrire un livre', icon: Sparkles, badge: 'Start' },
      { to: '/v3/nouveautes', label: '✨ Nouveautés V3', icon: Sparkles, badge: 'NEW' },
      { to: '/v3/outils/offerts', label: '🎁 Outils offerts', icon: Search, badge: 'Offert' },
      { to: '/v3/outils/royalties', label: 'Calculateur royalties', icon: BarChart3, badge: 'Offert' },
      { to: '/v3/outils/humanizer', label: 'Humaniseur IA', icon: Sparkles, badge: 'NEW' },
      { to: '/v3/outils/mockup-3d', label: 'Mockups 3D', icon: ImageIcon, badge: 'NEW' },
      { to: '/v3/outils/audiobook', label: 'Audiobook TTS', icon: Video, badge: 'NEW' },
      { to: '/v3/outils/editeur', label: 'Éditeur WYSIWYG', icon: FileText, badge: 'NEW' },
      { to: '/kdp-keywords', label: 'Recherche mots-clés', icon: Search },
      { to: '/kdp-keywords?tab=spy', label: 'Espion Amazon (ASIN)', icon: Target },
      { to: '/kdp-keywords?tab=longtail', label: 'Longue traîne', icon: BarChart3 },
      { to: '/kdp-keywords?tab=backend7', label: '7 mots-clés backend', icon: Search },
      { to: '/v3/recherche?tab=desc', label: 'Description KDP', icon: FileText },
      { to: '/v3/recherche?tab=cat', label: '3 Catégories KDP', icon: ListTree },
      { to: '/v3/recherche?tab=bio', label: 'Bio auteur', icon: User },
      { to: '/v3/recherche?tab=aplus', label: 'Contenu A+ Amazon', icon: Award, badge: 'Pro' },
      { to: '/audit-pilot', label: 'KDP Pilot — Audit', icon: Award },
      { to: '/niches', label: 'Niches rentables', icon: BarChart3 },
      { to: '/niches-600', label: '600 niches', icon: BarChart3, badge: 'Base' },
      { to: '/couverture-kdp', label: 'Couverture KDP', icon: ImageIcon },
      { to: '/v3/cover-studio-pro', label: 'Cover Studio Pro', icon: ImageIcon, badge: 'PRO' },
    ],
  },
  {
    section: 'Mon espace',
    items: [
      { to: '/v3', label: 'Accueil V3', icon: Home, end: true },
      { to: '/v3/create/illustre?preset=maternelle-3-6', label: 'Album maternelle 3-6 ans', icon: Sparkles, badge: 'Livré' },
      { to: '/v3/create/illustre?preset=histoires-du-soir-3-7', label: 'Histoires du soir 3-7 ans', icon: BookOpen, badge: 'Livré' },



      { to: '/v3/library', label: 'Ma bibliothèque', icon: Library },
      { to: '/v3/mes-livres', label: 'Mes livres', icon: BookOpen },
      { to: '/v3/hub?tab=livres', label: 'Brouillons', icon: FolderOpen },
      { to: '/v3/pourquoi', label: 'Pourquoi EbookStudio', icon: Award },
      { to: '/v3/realite-kdp', label: 'Combien gagnent les auteurs KDP', icon: BookOpen },

      { to: '/communaute', label: 'Communauté (Q&R)', icon: Award, badge: '220+' },
      { to: '/v3/script-heygen', label: 'Script vidéo HeyGen', icon: Video, badge: 'Pour vous' },
      { to: '/v3/outils', label: 'Tous les outils', icon: ListTree },
    ],
  },
  {
    section: 'Formation',
    items: [
      { to: 'https://ebookstudio.blog/#accueil', label: 'Blog EbookStudio', icon: FileText, external: true, badge: 'Nouveau' } as any,
      { to: '/formation', label: 'Formation vidéo', icon: GraduationCap },
      { to: '/masterclass', label: 'Masterclass', icon: Video },
    ],
  },
  {
    section: 'Compte',
    items: [
      { to: '/v3/compte', label: 'Mon compte', icon: User },
      { to: '/v3/forfaits', label: 'Forfaits & tarifs', icon: Gem },
      { to: '/v3/auteur', label: 'Profil auteur', icon: User },
      { to: '/subscription', label: 'Mon abonnement', icon: Gem },
      { to: '/v3/parametres', label: 'Paramètres', icon: Settings },
    ],
  },
  {
    section: 'Support',
    items: [
      { to: '/v3/contact', label: 'Contact', icon: Mail },
      { to: '/faq', label: 'FAQ / Aide', icon: HelpCircle },
      { to: '/assistance', label: 'Assistance', icon: LifeBuoy },
    ],
  },
];

export default function V3Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname, search } = useLocation();
  const currentTab = new URLSearchParams(search).get('tab');

  return (
    <aside
      className={`shrink-0 transition-all duration-200 ${collapsed ? 'w-14' : 'w-60'}`}
      style={{
        background: '#fff',
        borderRight: '1px solid var(--v3-line)',
        position: 'sticky',
        top: 0,
        alignSelf: 'flex-start',
        height: '100vh',
        overflowY: 'auto',
      }}
    >
      <div
        className="flex items-center justify-between px-3 py-3"
        style={{ borderBottom: '1px solid var(--v3-line)' }}
      >
        {!collapsed && (
          <span
            className="text-[10px] font-bold uppercase tracking-[0.22em]"
            style={{ color: 'var(--v3-gold-600)' }}
          >
            Espace auteur
          </span>
        )}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="ml-auto rounded p-1 hover:bg-black/5"
          style={{ color: 'var(--v3-muted)' }}
          aria-label={collapsed ? 'Déplier' : 'Replier'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <nav className="p-2 space-y-5">
        {NAV.map((group) => (
          <div key={group.section}>
            {!collapsed && (
              <div
                className="flex items-center gap-2 px-2 pb-2 text-[10px] font-bold uppercase tracking-[0.22em]"
                style={{ color: 'var(--v3-emerald)' }}
              >
                <span
                  className="inline-block w-1 h-1 rounded-full"
                  style={{ background: 'var(--v3-gold)' }}
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

                return (
                  <li key={it.to}>
                    {it.external ? (
                      <a
                        href={it.to}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={it.label}
                        className="relative flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] transition-colors"
                        style={{ color: 'var(--v3-emerald)', fontWeight: 600, background: 'rgba(201,168,76,0.10)' }}
                      >
                        <span
                          aria-hidden
                          className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r"
                          style={{ background: 'var(--v3-gold)' }}
                        />
                        <Icon className="w-4 h-4 shrink-0" />
                        {!collapsed && (
                          <>
                            <span className="truncate flex-1">{it.label}</span>
                            {it.badge && (
                              <span
                                className="text-[9px] font-bold uppercase tracking-[0.15em] px-1.5 py-0.5 rounded"
                                style={{ background: '#C97A14', color: '#fff' }}
                              >
                                {it.badge}
                              </span>
                            )}
                          </>
                        )}
                      </a>
                    ) : (
                    <NavLink
                      to={it.to}
                      end={(it as any).end}
                      title={it.label}
                      className="relative flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] transition-colors"
                      style={
                        active
                          ? {
                              background: 'var(--v3-gold-soft)',
                              color: 'var(--v3-emerald)',
                              fontWeight: 600,
                            }
                          : { color: 'var(--v3-ink)' }
                      }
                      onMouseOver={(e) => {
                        if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(6,78,59,0.04)';
                      }}
                      onMouseOut={(e) => {
                        if (!active) (e.currentTarget as HTMLElement).style.background = '';
                      }}
                    >
                      {active && (
                        <span
                          aria-hidden
                          className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r"
                          style={{ background: 'var(--v3-gold)' }}
                        />
                      )}
                      <Icon className="w-4 h-4 shrink-0" />
                      {!collapsed && (
                        <>
                          <span className="truncate flex-1">{it.label}</span>
                          {it.badge && (
                            <span
                              className="text-[9px] font-bold uppercase tracking-[0.15em] px-1.5 py-0.5 rounded"
                              style={{ background: '#C97A14', color: '#fff' }}
                            >
                              {it.badge}
                            </span>
                          )}
                        </>
                      )}
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
