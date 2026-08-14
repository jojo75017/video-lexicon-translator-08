import { useEffect, useState } from 'react';
import { BookOpen, Mail, Shield, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getIsCurrentSessionAdmin } from '@/lib/adminAccess';
import { supabase } from '@/integrations/supabase/client';
import { ADMIN_HOME_PATH } from '@/config/adminRoutes';

const ACCESS_LINKS = [
  { label: 'V2 — Générateur', path: '/ebook-planner', icon: BookOpen },
  { label: 'Prospects', path: '/gestion-prospects', icon: Users },
  { label: 'Emails', path: '/apercu-emails', icon: Mail },
  { label: 'Admin', path: ADMIN_HOME_PATH, icon: Shield },
];

export default function V3AdminQuickAccess() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let active = true;
    const verify = async () => {
      const allowed = await getIsCurrentSessionAdmin();
      if (active) setIsAdmin(allowed);
    };

    void verify();
    const { data } = supabase.auth.onAuthStateChange(() => void verify());
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  if (!isAdmin) return null;

  return (
    <aside className="sticky top-[7.5rem] z-20 border-b border-border bg-card/95 px-3 py-2 shadow-sm backdrop-blur" aria-label="Accès rapides administrateur">
      <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto">
        {ACCESS_LINKS.map(({ label, path, icon: Icon }) => (
          <Button
            key={path}
            type="button"
            size="sm"
            variant={path === '/ebook-planner' ? 'default' : 'outline'}
            className="shrink-0"
            onClick={() => navigate(path)}
          >
            <Icon className="mr-1.5 h-4 w-4" />
            {label}
          </Button>
        ))}
      </div>
    </aside>
  );
}