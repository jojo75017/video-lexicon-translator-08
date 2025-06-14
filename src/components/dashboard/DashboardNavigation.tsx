
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
        {location.pathname === '/keyword-meta' && 'Titres et Meta'}
        {location.pathname === '/newsletter' && 'Newsletter'}
        {location.pathname === '/tracking' && 'Suivi des Positions'}
        {location.pathname === '/' && 'Dashboard'}
      </div>
    </div>
  );
};

export default DashboardNavigation;
