import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import '@/styles/v3-public.css';
import { SUBSCRIBER_HOME_PATH } from '@/lib/authDestination';
import V3Header from './V3Header';
import V3MainTabs from './V3MainTabs';
import V3Footer from './V3Footer';
import V3Sidebar from './V3Sidebar';
import V3ContemplationMode from '@/components/v3/V3ContemplationMode';
import V3AdminQuickAccess from './V3AdminQuickAccess';

type V3PublicLayoutProps = {
  isAdmin: boolean;
  isAdminChecking: boolean;
  /** Abonné V2 connecté (hors admin) : la V3 ne lui est pas destinée. */
  isSubscriber?: boolean;
};

/** Seule page V3 ouverte aux abonnés V2 : leur offre « Ancien client V2 ». */
const SUBSCRIBER_ALLOWED_V3_PATHS = new Set(['/v3/migration']);

export default function V3PublicLayout({ isAdmin, isAdminChecking, isSubscriber = false }: V3PublicLayoutProps) {
  const [isAuthed, setIsAuthed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setIsAuthed(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setIsAuthed(!!session));
    return () => sub.subscription.unsubscribe();
  }, []);

  // Statut admin encore inconnu : on ne redirige jamais (évite d'éjecter un admin
  // dont la session se restaure). Une fois le statut connu, un abonné non-admin
  // repart sur sa V2, sauf sur la page « Ancien client V2 ».
  const currentPath = location.pathname.replace(/\/+$/, '') || '/v3';
  if (!isAdminChecking && !isAdmin && isSubscriber && !SUBSCRIBER_ALLOWED_V3_PATHS.has(currentPath)) {
    return <Navigate to={SUBSCRIBER_HOME_PATH} replace />;
  }

  return (
    <V3ContemplationMode>
      <div className="v3pub min-h-screen flex flex-col">
        <V3Header isAuthed={isAuthed} isAdmin={isAdmin} />
        <V3MainTabs />
        <V3AdminQuickAccess isAdmin={isAdmin} isAdminChecking={isAdminChecking} />

        <div className="flex flex-1 w-full">
          <V3Sidebar />
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
        <V3Footer />
      </div>
    </V3ContemplationMode>
  );
}


