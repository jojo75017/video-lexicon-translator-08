import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart3, 
  CreditCard, 
  Settings, 
  Users,
  BookOpen,
  Zap,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
  Search,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  badge?: string;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

interface SaasLayoutProps {
  userRole?: 'free' | 'pro' | 'admin';
}

const mainNavItems: NavItem[] = [
  { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard, path: '/saas' },
  { id: 'analytics', label: 'Analytiques', icon: BarChart3, path: '/saas/analytics' },
  { id: 'projects', label: 'Projets', icon: BookOpen, path: '/saas/projects' },
  { id: 'users', label: 'Utilisateurs', icon: Users, path: '/saas/users', badge: 'Pro' },
  { id: 'billing', label: 'Facturation', icon: CreditCard, path: '/saas/billing' },
];

const secondaryNavItems: NavItem[] = [
  { id: 'settings', label: 'Paramètres', icon: Settings, path: '/saas/settings' },
  { id: 'help', label: 'Aide & Support', icon: HelpCircle, path: '/saas/help' },
];

export const SaasLayout: React.FC<SaasLayoutProps> = ({ userRole = 'free' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActivePath = (path: string) => {
    if (path === '/saas') {
      return location.pathname === '/saas';
    }
    return location.pathname.startsWith(path);
  };

  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive = isActivePath(item.path);
    const Icon = item.icon;

    return (
      <button
        onClick={() => {
          navigate(item.path);
          setMobileMenuOpen(false);
        }}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
          isActive
            ? "bg-primary text-primary-foreground shadow-md"
            : "text-muted-foreground hover:text-foreground hover:bg-accent"
        )}
      >
        <Icon className="h-5 w-5" />
        {sidebarOpen && (
          <>
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge && (
              <Badge 
                variant={item.badgeVariant || 'secondary'} 
                className="text-[10px] px-1.5"
              >
                {item.badge}
              </Badge>
            )}
          </>
        )}
      </button>
    );
  };

  const UserDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder.svg" alt="Avatar" />
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
              JD
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-background border" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Jean Dupont</p>
            <p className="text-xs leading-none text-muted-foreground">jean@exemple.com</p>
            <Badge variant="secondary" className="w-fit mt-2 text-xs">
              {userRole === 'admin' ? 'Admin' : userRole === 'pro' ? 'Pro' : 'Gratuit'}
            </Badge>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/saas/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          Paramètres
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/saas/billing')}>
          <CreditCard className="mr-2 h-4 w-4" />
          Facturation
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/saas/login')} className="text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r bg-card transition-all duration-300 ease-in-out",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 p-4 border-b">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          {sidebarOpen && (
            <div>
              <h1 className="font-bold text-lg">SaaS Studio</h1>
              <p className="text-xs text-muted-foreground">Plateforme Entreprise</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-6">
          <div className="space-y-1">
            {sidebarOpen && (
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-3">
                Principal
              </p>
            )}
            {mainNavItems.map((item) => (
              <NavLink key={item.id} item={item} />
            ))}
          </div>

          <div className="space-y-1">
            {sidebarOpen && (
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-3">
                Système
              </p>
            )}
            {secondaryNavItems.map((item) => (
              <NavLink key={item.id} item={item} />
            ))}
          </div>
        </nav>

        {/* Collapse Button */}
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full justify-center"
          >
            {sidebarOpen ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-300 lg:hidden",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="font-bold text-lg">SaaS Studio</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="p-4 space-y-6">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-3">
              Principal
            </p>
            {mainNavItems.map((item) => (
              <NavLink key={item.id} item={item} />
            ))}
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-3">
              Système
            </p>
            {secondaryNavItems.map((item) => (
              <NavLink key={item.id} item={item} />
            ))}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 px-4 py-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="hidden md:flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2 w-64">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="bg-transparent border-none outline-none text-sm flex-1"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </Button>
            <UserDropdown />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SaasLayout;
