import { BarChart3, BookOpen, Contact, Mail, MessageSquare, Shield, User, Users } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type AdminNavItem = {
  label: string;
  path: string;
  icon: typeof Shield;
  exact?: boolean;
};

const adminNavItems: AdminNavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: BarChart3, exact: true },
  { label: 'Abonnés', path: '/admin', icon: Shield, exact: true },
  { label: 'Profil', path: '/admin/profile', icon: User, exact: true },
  { label: 'Prospects', path: '/gestion-prospects', icon: Users, exact: true },
  { label: 'Emails', path: '/apercu-emails', icon: Mail, exact: true },
  { label: 'Posts', path: '/generateur-posts', icon: MessageSquare, exact: true },
  { label: 'Marketing', path: '/dashboard-marketing', icon: BarChart3, exact: true },
  { label: 'CRM', path: '/crm', icon: Contact, exact: true },
];

interface AdminPanelNavProps {
  className?: string;
}

export function AdminPanelNav({ className }: AdminPanelNavProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isActive = (item: AdminNavItem) =>
    item.exact ? pathname === item.path : pathname.startsWith(item.path);

  return (
    <div className={cn('rounded-2xl border border-border bg-card/80 p-3 shadow-sm', className)}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Navigation admin
          </p>
          <h2 className="text-sm font-semibold text-foreground md:text-base">
            Tous les onglets utiles + retour rapide au générateur
          </h2>
        </div>

        <Button type="button" onClick={() => navigate('/ebook-planner')} className="rounded-xl">
          <BookOpen className="mr-2 h-4 w-4" />
          Retour au générateur
        </Button>
      </div>

      <div className="mt-3 overflow-x-auto">
        <div className="flex min-w-max flex-wrap gap-2">
          {adminNavItems.map((item) => {
            const Icon = item.icon;

            return (
              <Button
                key={item.path}
                type="button"
                variant={isActive(item) ? 'default' : 'outline'}
                onClick={() => navigate(item.path)}
                className="rounded-xl"
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AdminPanelNav;