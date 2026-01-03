import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Settings, 
  BarChart3, 
  Bell, 
  Search,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Zap,
  Shield,
  HelpCircle,
  BookOpen,
  Palette
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  badge?: string;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

const mainNavItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/saas' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/saas/analytics' },
  { id: 'projects', label: 'Projects', icon: BookOpen, path: '/saas/projects' },
  { id: 'users', label: 'Users', icon: Users, path: '/saas/users', badge: 'Pro' },
  { id: 'billing', label: 'Billing', icon: CreditCard, path: '/saas/billing' },
];

const secondaryNavItems: NavItem[] = [
  { id: 'settings', label: 'Settings', icon: Settings, path: '/saas/settings' },
  { id: 'help', label: 'Help & Support', icon: HelpCircle, path: '/saas/help' },
];

interface SaasLayoutProps {
  children?: React.ReactNode;
  userRole?: 'free' | 'pro' | 'admin';
  userEmail?: string;
}

export const SaasLayout: React.FC<SaasLayoutProps> = ({ 
  children, 
  userRole = 'free',
  userEmail = 'user@example.com'
}) => {
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

  const getRoleBadge = () => {
    switch (userRole) {
      case 'admin':
        return <Badge className="bg-red-500 hover:bg-red-600">Admin</Badge>;
      case 'pro':
        return <Badge className="bg-gradient-to-r from-amber-500 to-orange-500">Pro</Badge>;
      default:
        return <Badge variant="secondary">Free</Badge>;
    }
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

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full bg-card border-r border-border transition-all duration-300 ease-in-out",
          sidebarOpen ? "w-64" : "w-20",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className={cn(
          "flex items-center gap-3 px-4 py-5 border-b border-border",
          !sidebarOpen && "justify-center"
        )}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          {sidebarOpen && (
            <div>
              <h1 className="font-bold text-lg">SaaS Studio</h1>
              <p className="text-xs text-muted-foreground">Enterprise Platform</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="space-y-1">
            {mainNavItems.map((item) => (
              <NavLink key={item.id} item={item} />
            ))}
          </div>

          <div className="my-4 border-t border-border" />

          <div className="space-y-1">
            {secondaryNavItems.map((item) => (
              <NavLink key={item.id} item={item} />
            ))}
          </div>
        </nav>

        {/* User Section */}
        <div className={cn(
          "p-3 border-t border-border",
          !sidebarOpen && "flex justify-center"
        )}>
          {sidebarOpen ? (
            <div className="flex items-center gap-3 p-2 rounded-lg bg-accent/50">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {userEmail.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{userEmail}</p>
                <div className="flex items-center gap-2">
                  {getRoleBadge()}
                </div>
              </div>
            </div>
          ) : (
            <Avatar className="h-9 w-9">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                {userEmail.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
        </div>

        {/* Collapse Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-5 -right-4 h-8 w-8 rounded-full border border-border bg-background shadow-md hidden lg:flex"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className={cn("h-4 w-4 transition-transform", !sidebarOpen && "rotate-180")} />
        </Button>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          "min-h-screen transition-all duration-300",
          sidebarOpen ? "lg:pl-64" : "lg:pl-20"
        )}
      >
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
          <div className="flex items-center justify-between px-4 py-3 lg:px-6">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Search */}
            <div className="hidden md:flex items-center flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search..." 
                  className="pl-9 bg-muted/50 border-0 focus-visible:ring-1"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {userEmail.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{userEmail}</span>
                      <span className="text-xs text-muted-foreground font-normal">
                        {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Plan
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/saas/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/saas/billing')}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-6">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
};

export default SaasLayout;
