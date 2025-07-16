
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="p-8 text-center max-w-md">
        <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">404</h1>
        <h2 className="text-xl font-semibold mb-4">Page non trouvée</h2>
        <p className="text-gray-600 mb-6">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <Button asChild>
          <Link to="/" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Retour à l'accueil
          </Link>
        </Button>
      </Card>
    </div>
  );
};

export default NotFound;
