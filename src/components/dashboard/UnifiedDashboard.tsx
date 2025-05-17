
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, FileText, LinkIcon, LineChart, FilePenLine, LayoutGrid } from 'lucide-react';
import { toast } from 'sonner';

const UnifiedDashboard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const handleBackButton = () => {
    window.history.back();
    toast.info("Retour à la page précédente");
  };
  
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
          {currentPath !== '/' && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleBackButton}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
          )}
        </div>
      </header>
      
      <div className="container mx-auto p-4 space-y-6 py-6">
        {currentPath === '/' && (
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
              <Link to="/pinterest">
                <Button 
                  variant={currentPath === '/pinterest' ? "default" : "outline"} 
                  size="sm"
                  className={currentPath === '/pinterest' ? "bg-red-600 hover:bg-red-700" : ""}
                >
                  Pinterest
                </Button>
              </Link>
              <Link to="/signature">
                <Button 
                  variant={currentPath === '/signature' ? "default" : "outline"} 
                  size="sm"
                  className={currentPath === '/signature' ? "bg-blue-600 hover:bg-blue-700" : ""}
                >
                  Signature Email
                </Button>
              </Link>
              <Link to="/structure">
                <Button 
                  variant={currentPath === '/structure' ? "default" : "outline"} 
                  size="sm"
                  className={currentPath === '/structure' ? "bg-purple-600 hover:bg-purple-700" : ""}
                >
                  Structure Site
                </Button>
              </Link>
            </nav>
          </Card>
        )}
        
        {children}
      </div>
    </div>
  );
};

export default UnifiedDashboard;
