import { BookOpen, Crown, LayoutDashboard, Mail, Rocket, Users } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ADMIN_HOME_PATH } from '@/config/adminRoutes';

const LINKS = [
  { label: 'V2 — Générateur', path: '/ebook-planner', icon: BookOpen },
  { label: 'V3 — Tester', path: '/v3', icon: Rocket },
  { label: 'Dashboard admin', path: ADMIN_HOME_PATH, icon: LayoutDashboard },
  { label: 'Lancement V3', path: '/admin/lancement', icon: Crown },
  { label: 'Prospects', path: '/gestion-prospects', icon: Users },
  { label: 'Emails', path: '/apercu-emails', icon: Mail },
];


export default function AdminQuickNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isActive = (path: string) => {
    if (path === '/v3') return pathname === '/v3' || pathname.startsWith('/v3/');
    if (path === ADMIN_HOME_PATH) return pathname === ADMIN_HOME_PATH || pathname.startsWith('/admin/');
    if (path === '/ebook-planner') return pathname === path;
    return pathname === path;
  };

  return (
    <nav
      data-contemplation-allow="true"
      aria-label="Accès permanents administrateur"
      className="sticky top-0 z-[9997] flex w-full gap-2 overflow-x-auto border-b border-border bg-card/95 px-3 py-2 shadow-sm backdrop-blur"
    >
      {LINKS.map(({ label, path, icon: Icon }) => (
        <Button
          key={path}
          type="button"
          size="sm"
          variant={isActive(path) ? 'default' : 'outline'}
          className="shrink-0"
          onClick={() => navigate(path)}
        >
          <Icon className="mr-1.5 h-4 w-4" />
          {label}
        </Button>
      ))}
    </nav>
  );
}