import { Send, Video, BarChart3, BookOpen, Contact, CreditCard, FileText, Gauge, Handshake, Mail, Megaphone, MessageSquare, Palette, Rocket, Shield, Snowflake, Table, Ticket, TrendingUp, User, Users, BookMarked } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ADMIN_HOME_PATH } from '@/config/adminRoutes';
import { openV3 } from '@/lib/openV3';

type AdminNavItem = {
  label: string;
  path: string;
  icon: typeof Shield;
  exact?: boolean;
  isNew?: boolean;
};

// Menu simplifié : trois entrées seulement. Les autres pages restent
// accessibles par leur adresse, mais n'encombrent plus la navigation.
const adminNavItems: AdminNavItem[] = [
  { label: 'Tableau de bord admin', path: ADMIN_HOME_PATH, icon: BarChart3, exact: true },
  { label: 'Essai gratuit & Leads', path: '/admin/essai-gratuit', icon: Mail, exact: true },
  { label: 'Ventes & Abonnements', path: '/admin/funnel', icon: CreditCard, exact: true },
  { label: 'Membres & Formules', path: '/admin/plans-v3', icon: Users, exact: true },
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

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => navigate(ADMIN_HOME_PATH)} className="rounded-xl">
            <Shield className="mr-2 h-4 w-4" />
            Tableau de bord admin
          </Button>
          <Button type="button" variant="outline" onClick={() => openV3(navigate)} className="rounded-xl border-teal-500 text-teal-700 hover:bg-teal-50">
            <Rocket className="mr-2 h-4 w-4" />
            Ouvrir V3
          </Button>
          <Button type="button" onClick={() => navigate('/ebook-planner')} className="rounded-xl">
            <BookOpen className="mr-2 h-4 w-4" />
            Ouvrir EbookStudio V2
          </Button>
        </div>
      </div>

      <div className="mt-3 overflow-x-auto">
        <div className="flex flex-wrap gap-2">
          {adminNavItems.map((item) => {
            const Icon = item.icon;

            return (
              <Button
                key={item.path}
                type="button"
                variant={isActive(item) ? 'default' : 'outline'}
                onClick={() => navigate(item.path)}
                className={cn(
                  'rounded-xl',
                  item.path === '/admin/essai-gratuit' && 'admin-trial-access',
                  item.isNew && 'border-2 border-emerald-700 bg-emerald-600 text-white font-semibold hover:bg-emerald-700 hover:text-white',
                  item.isNew && isActive(item) && 'ring-2 ring-emerald-500 ring-offset-2',
                )}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
                {item.isNew && (
                  <span className="ml-2 rounded-full bg-background/90 px-1.5 py-0.5 text-[10px] font-bold uppercase text-emerald-700">
                    Nouveau
                  </span>
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AdminPanelNav;