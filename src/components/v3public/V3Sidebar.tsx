import { NavLink, useLocation } from 'react-router-dom';
import {
  Home, Sparkles, BookOpen, Settings,
  ChevronLeft, ChevronRight, ChevronDown,
  GraduationCap, Gem, FileText, User,
  LifeBuoy, Mail, HelpCircle, Video, ListTree, Award,
  Rocket, Crown, Search, Target, BarChart3, Image as ImageIcon, LayoutGrid, Star, Wand2, Layers, Megaphone, Puzzle, Lock, Film,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import useV3Entitlement from '@/hooks/useV3Entitlement';
import useIsAdmin from '@/hooks/useIsAdmin';
import useTrialAccess from '@/hooks/useTrialAccess';
import { isTrialLockedPath } from '@/lib/trialLockedPaths';
import { countUnseenNouveautes, isRouteNouveau } from '@/data/v3Nouveautes';
import ThemeToggle from './ThemeToggle';

/**
 * Sidebar V3 — espace personnel, organisée en sections repliables.
 * Seule la section correspondant à la page courante est ouverte : la barre
 * reste lisible même avec tous les outils disponibles.
 */
type NavItem = { to: string; label: string; icon: any; end?: boolean; external?: boolean; badge?: string };
type NavSection = { section: string; items: NavItem[] };

const ADMIN_SECTION: NavSection = {
  section: 'Admin — Lancement',
  items: [
    { to: '/admin/lancement', label: 'Pilotage du lancement', icon: Rocket, end: true, badge: 'Admin' },
    { to: '/gestion-prospects', label: 'Base emails & envois', icon: Mail, end: true, badge: 'Admin' },
    { to: '/apercu-emails', label: 'Aperçu des emails', icon: FileText, end: true, badge: 'Admin' },
    { to: '/message', label: 'Message audio (MP3)', icon: Video, end: true },
  ],
};

const NAV: NavSection[] = [
  {
    section: 'Lancement',
    items: [
      { to: '/v3/upsells', label: 'UPSELLS — packs & compléments', icon: Sparkles, badge: '18 tarifs' },
      { to: '/essai', label: '🎁 Essai gratuit — chapitre 1', icon: Rocket, end: true, badge: 'Gratuit' },
      { to: '/v3/attente', label: '👑 Salon des membres fondateurs', icon: Crown, end: true, badge: '1er mois' },
      { to: '/commander', label: '47 € à vie — jusqu’au 30 septembre', icon: Gem, end: true, badge: '30 septembre' },
    ],
  },
  {
    section: 'Démarrer',
    items: [
      { to: '/v3/commence-ici', label: '🚀 Commence ici — 25 agents', icon: Rocket, end: true, badge: 'Start' },
      { to: '/v3', label: 'Accueil V3', icon: Home, end: true },
      { to: '/v3/fonctionnalites', label: 'Fonctionnalités (12 modules)', icon: LayoutGrid, end: true, badge: 'Hub' },
      { to: '/v3/workflow', label: '🤖 Workflow 15 Agents — écrire mon livre', icon: Layers, end: true, badge: 'Pipeline' },
      { to: '/v3/kit-demarrage', label: '📘 Kit de démarrage (PDF)', icon: GraduationCap },
      { to: '/v3/nouveautes', label: '✨ Nouveautés V3', icon: Sparkles },
    ],
  },
  {
    section: 'Créer un livre',
    items: [
      { to: '/v3/lancer', label: '🚀 Lancer mon livre (fiche + 15 agents)', icon: Layers, end: true, badge: 'Direct' },
      { to: '/v3/biographie', label: '📖 Biographie — Le récit de votre vie', icon: BookOpen },
      { to: '/v3/create', label: 'Ebookstudio-Génie', icon: Sparkles, badge: 'IA' },
      { to: '/v3/create?sommaire=ia', label: 'Sommaire IA — dialogue (récit / votre vie)', icon: ListTree, badge: 'IA' },
      { to: '/v3/outils/sommaire-ultime', label: 'Table des matières (sommaire seul)', icon: ListTree },
      { to: '/v3/workflow?genre=roman', label: '📕 Roman / Thriller — workflow 15 agents', icon: Layers, badge: 'Workflow' },
      { to: '/v3/studio', label: 'Studio Pro (Gemini + ChatGPT)', icon: Gem, badge: 'Pro' },
      { to: '/v3/contentstudio', label: '🎬 ContentStudio Engine (livre → vidéo)', icon: Film },
      { to: '/v3/livres/jeux-enigmes', label: '🧩 Livres de Jeux & Énigmes', icon: Puzzle, badge: 'Pro' },
      { to: '/v3/livres/cherche-trouve', label: '🔍 Coloriages Cherche & Trouve', icon: Search, badge: 'Pro' },
      { to: '/v3/livres/histoires-illustrees', label: '📖 Histoires Courtes & Contes', icon: BookOpen, badge: 'Pro' },
      { to: '/v3/create/illustre?preset=maternelle-3-6', label: 'Album maternelle 3-6 ans', icon: Sparkles },
      { to: '/v3/create/illustre?preset=histoires-du-soir-3-7', label: 'Histoires du soir 3-7 ans', icon: BookOpen },
      { to: '/v3/corriger', label: 'Corriger mon livre', icon: Wand2 },
      { to: '/v3/outils/humanizer', label: 'Humaniseur IA', icon: Sparkles },
      { to: '/v3/outils/editeur', label: 'Éditeur WYSIWYG', icon: FileText },
      { to: '/v3/outils/traduction', label: 'Traduction 10 langues', icon: ListTree },
    ],
  },
  {
    section: 'Recherche KDP',
    items: [
      { to: '/v3/recherche', label: 'Studio Recherche KDP', icon: Search, badge: 'Hub' },
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
      { to: '/niches-600', label: '600 niches', icon: BarChart3 },
    ],
  },
  {
    section: 'Habiller & exporter',
    items: [
      { to: '/v3/cover-studio-pro', label: 'Cover Studio Pro', icon: ImageIcon, badge: 'PRO' },
      { to: '/couverture-kdp', label: 'Couverture KDP', icon: ImageIcon },
      { to: '/v3/outils/mockup-3d', label: 'Mockups 3D', icon: ImageIcon },
      { to: '/v3/outils/audiobook', label: 'Audiobook TTS', icon: Video },
      { to: '/v3/outils/royalties', label: 'Calculateur royalties', icon: BarChart3 },
      { to: '/v3/outils/offerts', label: '🎁 Outils offerts', icon: Search, badge: 'Offert' },
      { to: '/v3/outils', label: 'Tous les outils', icon: ListTree },
    ],
  },
  {
    section: 'Mes livres',
    items: [
      { to: '/v3/mes-livres', label: 'Mes livres', icon: BookOpen },
      { to: '/v3/livres-corriges', label: 'Livres corrigés', icon: Wand2 },
    ],
  },
  {
    section: 'Vendre',
    items: [
      { to: '/v3/acquisition', label: '🚀 Plan 14 jours — trouver des lecteurs', icon: Megaphone },
      { to: '/v3/posts', label: '📣 Posts — 30 jours prêts', icon: Megaphone },
      { to: '/v3/avis', label: '⭐ Obtenir des avis clients', icon: Star, badge: 'Marche à suivre' },
      { to: '/mon-parrainage', label: '🤝 Parrainage — 30 % de commission', icon: Gem },
      { to: '/v3/script-heygen', label: 'Script vidéo HeyGen', icon: Video },
      { to: '/v3/pourquoi', label: 'Pourquoi EbookStudio', icon: Award },
      { to: '/v3/realite-kdp', label: 'Combien gagnent les auteurs KDP', icon: BookOpen },
    ],
  },
  {
    section: 'Apprendre',
    items: [
      { to: 'https://ebookstudio.blog/#accueil', label: 'Blog EbookStudio', icon: FileText, external: true, badge: 'Nouveau' },
      { to: '/formation', label: 'Formation vidéo', icon: GraduationCap },
      { to: '/masterclass', label: 'Masterclass', icon: Video },
      { to: '/communaute', label: 'Communauté (Q&R)', icon: Award, badge: '220+' },
    ],
  },
  {
    section: 'Mon compte',
    items: [
      { to: '/v3/compte', label: 'Mon compte & abonnement', icon: User },
      { to: '/v3/forfaits', label: 'Forfaits & tarifs', icon: Gem },
      
      { to: '/v3/auteur', label: 'Profil auteur', icon: User },
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
  const { hasV2 } = useV3Entitlement();
  const { isAdmin } = useIsAdmin();
  const { isTrial } = useTrialAccess();
  const trialRestricted = isTrial && isAdmin !== true;

  const { pathname, search } = useLocation();
  const currentTab = new URLSearchParams(search).get('tab');

  const sections = useMemo(() => (isAdmin ? [ADMIN_SECTION, ...NAV] : NAV), [isAdmin]);

  /** Section contenant la page courante (ouverte par défaut). */
  const activeSection = useMemo(() => {
    const match = sections.find((g) =>
      g.items.some((it) => {
        if (it.external) return false;
        const [itPath] = it.to.split('?');
        return pathname === itPath || (itPath.length > 1 && pathname.startsWith(itPath + '/'));
      }),
    );
    return match?.section ?? sections[0].section;
  }, [pathname, sections]);

  const [open, setOpen] = useState<Record<string, boolean>>({ [activeSection]: true });

  // Nouveautés non vues : recalculé à chaque navigation (la page /v3/nouveautes remet à 0).
  const unseenNouveautes = useMemo(() => countUnseenNouveautes(), [pathname]);

  /** Badge affiché : « NOUVEAU » automatique (< 30 jours) ou badge défini dans NAV. */
  const badgeFor = (it: NavItem): string | undefined => {
    if (it.to === '/v3/nouveautes') return unseenNouveautes > 0 ? `${unseenNouveautes} new` : undefined;
    if (!it.external && isRouteNouveau(it.to)) return 'Nouveau';
    return it.badge;
  };

  useEffect(() => {
    setOpen((prev) => (prev[activeSection] ? prev : { ...prev, [activeSection]: true }));
  }, [activeSection]);


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

      {hasV2 && (
        <div className="px-2 pt-2">
          <NavLink
            to="/v3/migration"
            title="Ancien client V2 — -20 % à vie"
            className="relative flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] font-semibold"
            style={{ background: 'rgba(180,83,9,0.10)', color: '#b45309' }}
          >
            <Gem className="w-4 h-4 shrink-0" />
            {!collapsed && (
              <>
                <span className="truncate flex-1">Ancien client V2</span>
                <span
                  className="text-[9px] font-bold uppercase tracking-[0.15em] px-1.5 py-0.5 rounded"
                  style={{ background: '#b45309', color: '#fff' }}
                >
                  -20 %
                </span>
              </>
            )}
          </NavLink>
        </div>
      )}

      <nav className="p-2 space-y-2">
        {sections.map((group) => {
          const isOpen = collapsed || !!open[group.section];
          return (
            <div key={group.section}>
              {!collapsed && (
                <button
                  type="button"
                  onClick={() => setOpen((prev) => ({ ...prev, [group.section]: !prev[group.section] }))}
                  aria-expanded={isOpen}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-[0.22em] hover:bg-black/[0.04]"
                  style={{ color: 'var(--v3-emerald)' }}
                >
                  <span
                    className="inline-block w-1 h-1 rounded-full shrink-0"
                    style={{ background: 'var(--v3-gold)' }}
                  />
                  <span className="flex-1 text-left">{group.section}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${isOpen ? '' : '-rotate-90'}`}
                    style={{ color: 'var(--v3-muted)' }}
                  />
                </button>
              )}
              {isOpen && (
                <ul className="space-y-0.5 mt-0.5">
                  {group.items.map((it) => {
                    const [itPath, itQuery] = it.to.split('?');
                    const itTab = itQuery ? new URLSearchParams(itQuery).get('tab') : null;
                    const active = it.external
                      ? false
                      : it.end
                        ? pathname === itPath
                        : itTab
                          ? pathname === itPath && currentTab === itTab
                          : pathname === itPath || (itPath.length > 1 && pathname.startsWith(itPath + '/'));
                    const Icon = it.icon;
                    const trialLocked = trialRestricted && !it.external && isTrialLockedPath(it.to);

                    return (
                      <li key={it.to}>
                        {it.external ? (
                          <a
                            href={it.to}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={trialLocked ? `${it.label} — réservé aux abonnés` : it.label}
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
                            end={it.end}
                            title={trialLocked ? `${it.label} — réservé aux abonnés` : it.label}
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
                                {trialLocked ? (
                                  <Lock className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--v3-muted)' }} />
                                ) : it.badge ? (
                                  <span
                                    className="text-[9px] font-bold uppercase tracking-[0.15em] px-1.5 py-0.5 rounded"
                                    style={{ background: '#C97A14', color: '#fff' }}
                                  >
                                    {it.badge}
                                  </span>
                                ) : null}
                              </>
                            )}
                          </NavLink>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>

      {/* Thème clair / sombre / automatique, toujours accessible. */}
      <div className="px-2 pb-4 pt-1" style={{ borderTop: '1px solid var(--v3-line)' }}>
        <ThemeToggle variant="plain" showLabel={!collapsed} className="w-full justify-center mt-3" />
      </div>
    </aside>

  );
}
