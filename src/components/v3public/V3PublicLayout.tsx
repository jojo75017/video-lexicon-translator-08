import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import '@/styles/v3-public.css';
import V3Header from './V3Header';
import V3Footer from './V3Footer';

export default function V3PublicLayout() {
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setIsAuthed(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setIsAuthed(!!session));
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <div className="v3pub min-h-screen flex flex-col">
      <V3Header isAuthed={isAuthed} />
      <main className="flex-1">
        <Outlet />
      </main>
      <V3Footer />
    </div>
  );
}
