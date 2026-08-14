import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import '@/styles/v3-public.css';
import V3Header from './V3Header';
import V3MainTabs from './V3MainTabs';
import V3Footer from './V3Footer';
import V3Sidebar from './V3Sidebar';
import V3ContemplationMode from '@/components/v3/V3ContemplationMode';
import V3AdminQuickAccess from './V3AdminQuickAccess';

export default function V3PublicLayout() {
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setIsAuthed(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setIsAuthed(!!session));
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <V3ContemplationMode>
      <div className="v3pub min-h-screen flex flex-col">
        <V3Header isAuthed={isAuthed} />
        <V3MainTabs />
        <V3AdminQuickAccess />
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


