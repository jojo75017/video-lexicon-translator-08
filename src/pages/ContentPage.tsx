
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';

const ContentPage = () => {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-6">
        <Link to="/">
          <Button variant="outline" className="gap-2">
            <ArrowLeft size={16} />
            Retour au tableau de bord
          </Button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Analyse de contenu</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-center gap-4 mb-6">
          <FileText size={40} className="text-blue-500" />
          <h2 className="text-2xl font-bold">Optimisation de contenu</h2>
        </div>
        
        <p className="mb-4 text-gray-700">
          Cet outil vous permet d'analyser et d'optimiser le contenu de votre site web pour le référencement.
        </p>
        
        <div className="p-4 bg-blue-50 rounded-md mb-6 border border-blue-100">
          <p className="text-blue-800">
            Cette fonctionnalité sera bientôt disponible. Revenez prochainement !
          </p>
        </div>
        
        <Link to="/word-count">
          <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
            <FileText className="mr-2" />
            Accéder au compteur de mots
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ContentPage;
