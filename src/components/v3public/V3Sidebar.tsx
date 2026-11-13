import { NavLink, useLocation } from 'react-router-dom';
import {
  FilePen, Home, Sparkles, BookOpen, BookPlus, LibraryBig, Settings,
  ChevronLeft, ChevronRight, ChevronDown,
  GraduationCap, Gem, FileText, User,
  LifeBuoy, Mail, HelpCircle, Video, ListTree, Award,
  Rocket, Crown, Search, Plus, Minus, Target, BarChart3, Image as ImageIcon, LayoutGrid, Star, Wand2, Layers, Megaphone, Puzzle, Lock, Film, KeyRound,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import useV3Entitlement from '@/hooks/useV3Entitlement';
import useIsAdmin from '@/hooks/useIsAdmin';
import useTrialAccess from '@/hooks/useTrialAccess';
import { isTrialLockedPath } from '@/lib/trialLockedPaths';
import { countUnseenNouveautes, isRouteNouveau } from '@/data/v3Nouveautes';
import { setSpaceChoice } from '@/lib/v3OpenState';
import { SUBSCRIBER_HOME_PATH } from '@/lib/authDestination';
import { V3_HEADER_MENU } from '@/data/v3HeaderMenu';
import { ROBOT_THEME } from './V3MainTabs';

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
  ],
};

const NAV: NavSection[] = [
  {
    section: 'Lancement',
    items: [
      { to: '/v3/offre-version-longue', label: '📚 Ebook Version Longue — 47 €', icon: BookOpen, end: true, badge: 'V4' },
      { to: '/v3/offre-micro-series', label: '🎬 Studio Micro-Séries — 67 €', icon: Film, end: true, badge: 'Bientôt V4' },
      { to: '/v3/version-longue', label: '✍️ Outil Version Longue', icon: BookOpen, badge: 'V4' },
      { to: '/v3/upsells', label: 'UPSELLS — packs & compléments', icon: Sparkles, badge: '6 compléments' },
      { to: '/essai', label: '🎁 Essai gratuit — chapitre 1', icon: Rocket, end: true, badge: 'Gratuit' },
      { to: '/v3/attente', label: '👑 Salon des membres fondateurs', icon: Crown, end: true, badge: '1er mois' },
      { to: '/v3/forfaits', label: '👑 Formules dès 19 €/mois', icon: Gem, end: true, badge: 'Nouveau' },
    ],
  },
  {
    section: 'Démarrer',
    items: [
      { to: '/v3/fonctionnalites/cles', label: 'Clés API — première étape', icon: KeyRound, end: true },
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
      { to: '/v3/create/album-illustre', label: '🧸 Album illustré 3-6 ans (histoire continue)', icon: BookOpen, badge: 'VIP' },
      { to: '/v3/livres/histoires-illustrees', label: '📖 Histoires Courtes & Contes', icon: BookOpen, badge: 'Pro' },
      { to: '/v3/create/illustre?preset=maternelle-3-6', label: 'Album maternelle 3-6 ans', icon: Sparkles },
      { to: '/v3/create/illustre?preset=histoires-du-soir-3-7', label: 'Histoires du soir 3-7 ans', icon: BookOpen },
      { to: '/v3/corriger', label: 'Corriger mon livre', icon: Wand2 },
      { to: '/v3/outils/humanizer', label: 'HumanizeAI', icon: Wand2, badge: 'Nouveau' },
  { to: '/v3/tutoriels-v3', label: 'Tutoriels V3 (25)', icon: Video, badge: 'Nouveau' },
      { to: '/v3/outils/editeur', label: 'Éditeur WYSIWYG', icon: FileText },
      { to: '/v3/outils/traduction', label: 'Traduction 10 à 15 langues', icon: ListTree },
    ],
  },
  {
    section: 'Livres spéciaux',
    items: [
      { to: '/v3/vc-books/apercu', label: 'VC Books — livres humoristiques', icon: BookOpen, end: true },
      { to: '/v3/vc-books/creer', label: 'VC Books — créer un livre', icon: BookPlus, badge: 'Nouveau' },
      { to: '/v3/vc-books/bibliotheque', label: 'VC Books — ma bibliothèque', icon: LibraryBig, badge: 'Nouveau' },
      { to: '/v3/guides-illustres', label: 'Guides illustrés de A à Z', icon: BookPlus, badge: 'Nouveau' },
      { to: '/v3/vc-books/images', label: 'VC Books — studio de couverture', icon: ImageIcon },
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
      { to: '/v3/kdp-pilot', label: 'KDP Pilot — aller plus loin', icon: BarChart3, badge: '-15 %' },
      { to: '/niches', label: 'Niches rentables', icon: BarChart3 },
      { to: '/niches-600', label: '600 niches', icon: BarChart3 },
    ],
  },
  {
    section: 'Habiller & exporter',
    items: [
      { to: '/v3/studio-v4', label: 'Studio de couverture', icon: ImageIcon, badge: 'V4' },
      { to: '/v3/studio-v4', label: 'Mes couvertures', icon: ImageIcon },
      { to: '/v3/outils/mockup-3d', label: 'Mockups 3D', icon: ImageIcon },
      { to: '/v3/outils/audiobook', label: 'Audiobook TTS', icon: Video },
      { to: '/v3/version-audio', label: 'Version audio · 9,99 €', icon: Video },
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
      { to: '/mon-parrainage', label: '🤝 Parrainage', icon: Gem, badge: 'Bientôt' },
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
      { to: '/communaute', label: 'Communauté (Q&R)', icon: Award, badge: 'Bientôt' },
    ],
  },
  {
    section: 'Mon compte',
    items: [
      { to: '/v3/compte', label: 'Mon compte & accès', icon: User },
      { to: '/v3/forfaits', label: 'Formules & options', icon: Gem },
      { to: '/v3/plans', label: 'Comparer les 3 formules', icon: Rocket, badge: 'dès 19 €/mois' },
      
      { to: '/v3/auteur', label: 'Profil auteur', icon: User },
      { to: '/v3/parametres', label: 'Paramètres', icon: Settings },
    ],
  },
  {
    section: 'Support',
    items: [
      { to: '/v3/contact', label: 'Contact', icon: Mail },
      { to: '/v3/fonctionnalites/questions', label: 'FAQ — 539 questions', icon: HelpCircle, badge: '539' },
      { to: '/faq', label: 'FAQ / Aide (V2)', icon: HelpCircle },
      { to: '/assistance', label: 'Assistance', icon: LifeBuoy },
    ],
  },
];

type SidebarGroup = { key: string; label: string; color: string; items: NavItem[] };

/** Parcours de révision, placé sous « Bibliothèque / Mes livres », hors des ateliers. */
const REVISION_GROUP: SidebarGroup = {
  key: 'revision-editoriale',
  label: '📝 Révision éditoriale',
  color: '#2563EB',
  items: [
    { to: '/v3/mes-livres', label: '1. Choisir ou importer mon livre', icon: LayoutGrid },
    { to: '/v3/corriger', label: '2. Corriger mon livre', icon: LayoutGrid, badge: 'Rapport' },
    { to: '/bookperfect', label: '3. Polir le style (BookPerfect)', icon: LayoutGrid },
    { to: '/v3/outils/humanizer', label: '4. Humaniser (HumanizeAI)', icon: LayoutGrid },
    { to: '/v3/studio-v4', label: '5. Couverture et 4e', icon: LayoutGrid },
    { to: '/v3/outils/traduction', label: '6. Traduire mon livre', icon: LayoutGrid },
  ],
};

/** Accès directs en tête de barre, comme sur la maquette du 5 novembre. */
const DIRECT_LINKS = [
  { to: '/v3', label: 'Accueil V3', icon: Home, color: '#3F3A37' },
  { to: '/v3/fonctionnalites/cles', label: 'Clés API · première étape', icon: KeyRound, color: 'var(--v3-api-nav)' },
  { to: '/v3/commence-ici', label: 'Commence ici', icon: Rocket, color: '#EA580C' },
  { to: '/v3/mes-livres', label: 'Bibliothèque / Mes livres', icon: LibraryBig, color: '#2563EB' },
  { to: '/v3/cadeaux', label: '🎁 Mes cadeaux', icon: Video, color: '#D97706' },
  { to: '/v3/tutoriels-v3', label: 'Tutoriels de A à Z', icon: Video, color: '#0891B2' },
  { to: '/v3/outils', label: 'Tous les outils V3', icon: ListTree, color: '#7C3AED' },
];

/** Position de « Bibliothèque / Mes livres » : la révision s'insère juste en dessous. */
const BIB_INDEX = Math.max(0, DIRECT_LINKS.findIndex((l) => l.to === '/v3/mes-livres'));

/** Couleur « robot » par section, en harmonie avec les onglets du menu principal. */
const SECTION_COLORS: Record<string, string> = {
  'Admin — Lancement': '#DC2626',
  Lancement: '#EA580C',
  Démarrer: '#EA580C',
  'Créer un livre': '#EA580C',
  'Recherche KDP': '#2563EB',
  'Livres spéciaux': '#7C3AED',
  'Mes livres': '#7C3AED',
  'Habiller & exporter': '#059669',
  Vendre: '#D97706',
  Apprendre: '#2563EB',
  'Mon compte': '#D97706',
  Support: '#64748B',
};

/** Libellés publics affichés dans la navigation, réutilisés sur l'accueil. */
export const V3_SIDEBAR_LABELS = NAV.flatMap((group) => group.items.map((item) => item.label));

export default function V3Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { hasV2 } = useV3Entitlement();
  const { isAdmin } = useIsAdmin();
  const { isTrial } = useTrialAccess();
  const trialRestricted = isTrial && isAdmin !== true;

  const { pathname, search } = useLocation();
  const currentTab = new URLSearchParams(search).get('tab');

  const groups = useMemo<SidebarGroup[]>(() => {
    const seen = new Set<string>(DIRECT_LINKS.map((l) => l.to));
    const header: SidebarGroup[] = V3_HEADER_MENU.map((c) => ({
      key: c.key,
      label: c.label,
      color: ROBOT_THEME[c.key]?.color ?? '#64748B',
      items: c.links.map((l) => {
        seen.add(l.to);
        return { to: l.to, label: l.label, icon: LayoutGrid, badge: l.badge };
      }),
    }));
    const others = NAV.flatMap((g) => g.items).filter((it) => {
      if (seen.has(it.to)) return false;
      seen.add(it.to);
      return true;
    });
    // « Compte, aide & autres » est réservé à l'administration : les abonnés ne le voient plus.
    // Les abonnés voient seulement leur abonnement, leur compte et l'aide.
    const accountItems = NAV.filter((g) => g.section === 'Mon compte' || g.section === 'Support').flatMap((g) => g.items);
    const accountPaths = new Set(accountItems.map((it) => it.to));
    const out = [...header, { key: 'compte', label: 'Mon abonnement & aide', color: '#475569', items: accountItems }];
    if (isAdmin) out.push({ key: 'admin', label: 'Administration', color: '#B91C1C', items: [...ADMIN_SECTION.items, ...others.filter((it) => !accountPaths.has(it.to))] });
    return out;
  }, [isAdmin]);

  const activeSection = useMemo(() => {
    const match = [REVISION_GROUP, ...groups].find((g) => g.items.some((it) => !it.external && pathname === it.to.split('?')[0]));
    return match?.key ?? '';
  }, [pathname, groups]);

  const [open, setOpen] = useState<Record<string, boolean>>({ 'revision-editoriale': true, [activeSection]: true });

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


  /** Rendu d'un groupe repliable de la barre latérale. */
  const renderGroup = (g: SidebarGroup) => {
          const isOpen = !!open[g.key];
          return (
            <div key={g.key}>
              <button
                type="button"
                onClick={() => setOpen((prev) => ({ ...prev, [g.key]: !prev[g.key] }))}
                aria-expanded={isOpen}
                title={g.label}
                className="v3-sb-tile w-full"
                style={{ background: g.color }}
              >
                <LayoutGrid className="h-4 w-4 shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1 truncate text-left">{g.label}</span>
                    {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                  </>
                )}
              </button>
              {isOpen && !collapsed && (
                <ul className="v3-sb-list" style={{ borderLeftColor: g.color, background: `${g.color}1f` }}>
                  {g.items.map((it) => {
                    const [itPath] = it.to.split('?');
                    const active = !it.external && pathname === itPath;
                    const locked = trialRestricted && !it.external && isTrialLockedPath(it.to);
                    const rawBadge = badgeFor(it);
                    const badge = rawBadge && rawBadge.length > 10 ? 'Nouveau' : rawBadge;
                    const inner = (
                      <>
                        <span className="flex-1 truncate">{it.label}</span>
                        {locked ? (
                          <Lock className="h-3.5 w-3.5 shrink-0" />
                        ) : badge ? (
                          <span className="v3-sb-badge" style={{ background: g.color }}>{badge}</span>
                        ) : null}
                      </>
                    );
                    return (
                      <li key={g.key + it.to + it.label}>
                        {it.external ? (
                          <a href={it.to} target="_blank" rel="noopener noreferrer" className="v3-sb-link" title={it.label}>{inner}</a>
                        ) : (
                          <NavLink
                            to={it.to}
                            className="v3-sb-link"
                            title={it.label}
                            style={active ? { background: `${g.color}55`, color: '#ffffff', fontWeight: 700 } : undefined}
                          >
                            {inner}
                          </NavLink>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );  };

  return (
    <aside
      className={`v3-sidebar-dark hidden shrink-0 transition-all duration-200 md:block ${collapsed ? 'w-14' : 'w-60'}`}
      style={{
        background: '#2A2624',
        borderRight: '1px solid #1E293B',
        position: 'sticky',
        top: 0,
        alignSelf: 'flex-start',
        height: '100vh',
        overflowY: 'auto',
      }}
    >
      <div
        className="flex items-center justify-between px-3 py-3"
        style={{ borderBottom: '1px solid #1E293B' }}
      >
        {!collapsed && (
          <span
            className="text-[10px] font-bold uppercase tracking-[0.22em]"
            style={{ color: '#F6BD2A' }}
          >
            Espace auteur
          </span>
        )}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="ml-auto rounded p-1 hover:bg-white/10"
          style={{ color: '#CBD5E1' }}
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

      <nav className="space-y-1.5 p-2" data-v3-nav>
        {DIRECT_LINKS.slice(0, BIB_INDEX + 1).map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end
            title={l.label}
            className="v3-sb-tile"
            style={{ background: l.color }}
          >
            <l.icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="truncate">{l.label}</span>}
          </NavLink>
        ))}

        <NavLink to="/v3/revision-editoriale" end title="Révision éditoriale" className="v3-sb-tile" style={{ background: '#1D4ED8' }}>
          <FilePen className="h-4 w-4 shrink-0" />
          {!collapsed && <span className="truncate">📝 Révision éditoriale</span>}
        </NavLink>

        <NavLink to="/v3/outils/traduction" end title="Traducteur d'Ebooks" className="v3-sb-tile" style={{ background: '#059669' }}>
          <span className="shrink-0">🌍</span>
          {!collapsed && <span className="truncate">Traducteur d'Ebooks</span>}
        </NavLink>

        <NavLink to="/v3/ebook-illustre" end title="Création d'eBook illustré" className="v3-sb-tile" style={{ background: '#0D9488' }}>
          <span className="shrink-0">🖼️</span>
          {!collapsed && <span className="truncate">eBook illustré</span>}
        </NavLink>

        <NavLink to="/v3/livres-audio" end title="Livres audio" className="v3-sb-tile" style={{ background: '#EA580C' }}>
          <span className="shrink-0">🎧</span>
          {!collapsed && <span className="truncate">Livres audio</span>}
        </NavLink>

        {DIRECT_LINKS.slice(BIB_INDEX + 1).map((l) => (
          <div key={l.to} className="space-y-1.5">
          <NavLink
            to={l.to}
            end
            title={l.label}
            className="v3-sb-tile"
            style={{ background: l.color }}
          >
            <l.icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="truncate">{l.label}</span>}
          </NavLink>
          {/* « Ebookstudio KDP » et ses sous-onglets juste sous « Tutoriels de A à Z ». */}
          {l.to === '/v3/tutoriels-v3' && groups.filter((g) => g.key === 'kdp').map((g) => renderGroup(g))}
          </div>
        ))}

        {/* Abonnement & aide juste sous « Tous les outils V3 », facile à trouver pour les abonnés. */}
        {groups.filter((g) => g.key === 'compte').map((g) => renderGroup(g))}

        {!collapsed && <p className="v3-sb-heading">Mes ateliers</p>}
        {groups.filter((g) => g.key !== 'compte' && g.key !== 'kdp').map((g) => renderGroup(g))}
      </nav>

    </aside>

  );
}
