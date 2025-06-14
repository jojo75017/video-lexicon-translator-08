
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const DashboardNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    navigate(-1);
  };

  const handleHome = () => {
    navigate('/');
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/keyword-meta':
        return 'Titres et Meta';
      case '/newsletter':
        return 'Newsletter';
      case '/tracking':
        return 'Suivi des Positions';
      case '/structure':
        return 'Structure du Site';
      case '/internal-links':
        return 'Liens Internes';
      case '/signature':
        return 'Signature Email';
      case '/content-ideas':
        return 'Idées de Contenu';
      case '/ai-writer':
        return 'Rédacteur IA';
      case '/':
        return 'Dashboard';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="flex items-center gap-2 mb-4 p-4 bg-white border-b">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleHome}
        className="flex items-center gap-2"
      >
        <Home className="h-4 w-4" />
        Accueil
      </Button>
      
      <div className="ml-4 text-sm text-gray-600">
        {getPageTitle()}
      </div>
    </div>
  );
};

export default DashboardNavigation;
