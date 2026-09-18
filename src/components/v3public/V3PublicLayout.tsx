import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import '@/styles/v3-public.css';
import { SUBSCRIBER_HOME_PATH } from '@/lib/authDestination';
import useV3Open from '@/hooks/useV3Open';
import V3Header from './V3Header';
import V3MainTabs from './V3MainTabs';
import V3Footer from './V3Footer';
import V3Sidebar from './V3Sidebar';
import V3ContemplationMode from '@/components/v3/V3ContemplationMode';
import V3AdminQuickAccess from './V3AdminQuickAccess';
import V3TrialBanner from './V3TrialBanner';
import V3UpsellReturnBar from './V3UpsellReturnBar';
import { setPreviewingAsSubscriber } from '@/components/v3/V3ContemplationMode';

type V3PublicLayoutProps = {
  isAdmin: boolean;
  isAdminChecking: boolean;
  /** Abonné V2 connecté (hors admin) : la V3 ne lui est pas destinée. */
  isSubscriber?: boolean;
};

/** Seule page V3 ouverte aux abonnés V2 : leur offre « Ancien client V2 ». */
const SUBSCRIBER_ALLOWED_V3_PATHS = new Set(['/v3/migration', '/v3/bienvenue']);

/** Préférence « barre latérale visible » : mémorisée d'une visite à l'autre. */
const SIDEBAR_PREF_KEY = 'v3:sidebar-visible';

function readSidebarPref(): boolean | null {
  try {
    const raw = localStorage.getItem(SIDEBAR_PREF_KEY);
    return raw === null ? null : raw === '1';
  } catch {
    return null;
  }
}

export default function V3PublicLayout({ isAdmin, isAdminChecking, isSubscriber = false }: V3PublicLayoutProps) {
  const [isAuthed, setIsAuthed] = useState(false);
  const location = useLocation();
  const { open: v3Open } = useV3Open();

  // Accueil V3 : page dégagée, sans barre latérale, sauf si le visiteur l'a
  // demandée. Les autres pages gardent la barre par défaut (espace de travail).
  const isHome = (location.pathname.replace(/\/+$/, '') || '/v3') === '/v3';
  const [showSidebar, setShowSidebar] = useState(() => readSidebarPref() ?? !isHome);

  useEffect(() => {
    const pref = readSidebarPref();
    setShowSidebar(pref ?? !isHome);
  }, [isHome]);

  const toggleSidebar = () => {
    setShowSidebar((prev) => {
      const next = !prev;
      try { localStorage.setItem(SIDEBAR_PREF_KEY, next ? '1' : '0'); } catch { /* stockage indisponible */ }
      return next;
    });
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setIsAuthed(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setIsAuthed(!!session));
    return () => sub.subscription.unsubscribe();
  }, []);

  // Une nouvelle entrée dans la V3 avec un rôle admin confirmé doit toujours
  // démarrer en mode admin. L'ancien aperçu abonné ne survit plus aux retours
  // ou actualisations et ne peut donc plus réafficher le verrou du 1er octobre.
  useEffect(() => {
    if (!isAdmin || isAdminChecking) return;
    setPreviewingAsSubscriber(false);
  }, [isAdmin, isAdminChecking]);

  // Statut admin encore inconnu : on ne redirige jamais (évite d'éjecter un admin
  // dont la session se restaure). Une fois le statut connu, un abonné non-admin
  // repart sur sa V2, sauf sur la page « Ancien client V2 ».
  const currentPath = location.pathname.replace(/\/+$/, '') || '/v3';
  // V3 ouverte : l'abonné reste dans la V3 (il l'a choisie). Fermée : il repart
  // sur sa V2, sauf sur les pages qui lui sont ouvertes.
  if (v3Open === false && !isAdminChecking && !isAdmin && isSubscriber && !SUBSCRIBER_ALLOWED_V3_PATHS.has(currentPath)) {
    return <Navigate to={SUBSCRIBER_HOME_PATH} replace />;
  }

  return (
    <V3ContemplationMode>
      <div className="v3pub min-h-screen flex flex-col">
        <V3Header isAuthed={isAuthed} isAdmin={isAdmin} />
        <V3TrialBanner />
        <V3MainTabs />
        <V3AdminQuickAccess isAdmin={isAdmin} isAdminChecking={isAdminChecking} />

        {/* Interrupteur du menu latéral : toujours visible en haut de page. */}
        <div className="hidden border-b px-3 py-2 md:block" style={{ borderColor: 'var(--v3-line)', background: 'var(--v3-cream)' }}>
          <button
            type="button"
            onClick={toggleSidebar}
            aria-expanded={showSidebar}
            className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors"
            style={{ borderColor: 'var(--v3-line)', background: 'var(--v3-surface)', color: 'var(--v3-ink)' }}
          >
            {showSidebar ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
            {showSidebar ? 'Masquer le menu' : 'Afficher le menu'}
          </button>
        </div>

        <div className="flex flex-1 w-full">
          {showSidebar && (
            // Avant l'ouverture, le menu latéral reste visible mais inactif
            // pour les visiteurs : ils contemplent, ils ne cliquent pas.
            <div className={v3Open === false && !isAdmin ? 'pointer-events-none select-none opacity-70' : ''}>
              <V3Sidebar />
            </div>
          )}
          <main className="flex-1 min-w-0">
            <V3UpsellReturnBar />
            <Outlet />
          </main>
        </div>
        <V3Footer />
      </div>
    </V3ContemplationMode>
  );
}


