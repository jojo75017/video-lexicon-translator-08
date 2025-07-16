
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import IndexabilityAnalyzer from '@/components/seo/IndexabilityAnalyzer';

const IndexabilityPage = () => {
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

      <h1 className="text-3xl font-bold mb-6">Analyse d'indexabilité</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Vérifier l'indexabilité de votre site</h2>
          <p className="text-gray-700 mb-4">
            Cet outil vous permet d'analyser si votre site est correctement indexable par les moteurs de recherche et de vérifier son accessibilité publique.
          </p>
        </div>
        
        <IndexabilityAnalyzer />
      </div>
    </div>
  );
};

export default IndexabilityPage;
