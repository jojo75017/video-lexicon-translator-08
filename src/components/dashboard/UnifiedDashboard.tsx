
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Settings, ArrowLeft } from 'lucide-react';

const UnifiedDashboard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-primary hover:text-primary/80 flex items-center">
              <Home className="h-5 w-5 mr-2" />
              <span className="font-medium">Accueil</span>
            </Link>
            <h1 className="text-xl font-bold hidden sm:block">Dashboard SEO</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/outils-seo">
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <Settings className="h-4 w-4 mr-1" />
                Outils SEO
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Retour
            </Button>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto p-4 space-y-6 py-6">
        <Card className="p-4 bg-white shadow-sm border border-gray-200 mb-4">
          <nav className="flex flex-wrap gap-2">
            <Link to="/">
              <Button 
                variant={currentPath === '/' ? "default" : "outline"} 
                size="sm"
                className={currentPath === '/' ? "bg-blue-600 hover:bg-blue-700" : ""}
              >
                Accueil
              </Button>
            </Link>
            <Link to="/keyword-meta">
              <Button 
                variant={currentPath === '/keyword-meta' ? "default" : "outline"} 
                size="sm"
                className={currentPath === '/keyword-meta' ? "bg-blue-600 hover:bg-blue-700" : ""}
              >
                Title & Meta
              </Button>
            </Link>
            <Link to="/internal-linking">
              <Button 
                variant={currentPath === '/internal-linking' ? "default" : "outline"} 
                size="sm"
                className={currentPath === '/internal-linking' ? "bg-blue-600 hover:bg-blue-700" : ""}
              >
                Liens Internes
              </Button>
            </Link>
            <Link to="/tracking">
              <Button 
                variant={currentPath === '/tracking' ? "default" : "outline"} 
                size="sm"
                className={currentPath === '/tracking' ? "bg-blue-600 hover:bg-blue-700" : ""}
              >
                Suivi Positions
              </Button>
            </Link>
          </nav>
        </Card>
        
        {children}
      </div>
    </div>
  );
};

export default UnifiedDashboard;
