
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  LayoutDashboard, 
  Search, 
  BarChart,
  ArrowLeft
} from 'lucide-react';

const DashboardNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    {
      name: 'Accueil',
      path: '/',
      icon: Home,
      description: 'Retour à l\'accueil'
    },
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      description: 'Tableau de bord principal'
    },
    {
      name: 'Mots-clés',
      path: '/keyword-generator',
      icon: Search,
      description: 'Générateur de mots-clés'
    }
  ];

  const currentPath = location.pathname;

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-900">
              {currentPath === '/keyword-generator' ? 'Générateur de Mots-Clés' : 
               currentPath === '/dashboard' ? 'Dashboard SEO' : 
               'Plateforme SEO'}
            </h1>
          </div>
          
          <nav className="flex items-center gap-2">
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                variant={currentPath === item.path ? "default" : "ghost"}
                size="sm"
                onClick={() => navigate(item.path)}
                className="flex items-center gap-2"
                title={item.description}
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.name}</span>
              </Button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default DashboardNavigation;
