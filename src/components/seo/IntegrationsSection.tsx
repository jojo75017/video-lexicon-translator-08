
import React from 'react';
import { Card } from '@/components/ui/card';

const IntegrationsSection: React.FC = () => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Intégrations</h2>
      <p className="text-gray-600 mb-4">
        Cette section vous permet de connecter vos outils SEO préférés 
        et d'analyser les données consolidées.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
          <h3 className="font-semibold text-lg mb-2">Google Search Console</h3>
          <p className="text-sm text-gray-600">Connectez votre compte pour analyser les performances de recherche.</p>
          <button className="mt-3 text-sm text-purple-600 font-medium">Connecter</button>
        </div>
        <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
          <h3 className="font-semibold text-lg mb-2">Google Analytics</h3>
          <p className="text-sm text-gray-600">Intégrez vos statistiques de trafic et de comportement.</p>
          <button className="mt-3 text-sm text-purple-600 font-medium">Connecter</button>
        </div>
        <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
          <h3 className="font-semibold text-lg mb-2">Semrush</h3>
          <p className="text-sm text-gray-600">Importez vos données d'analyse concurrentielle.</p>
          <button className="mt-3 text-sm text-purple-600 font-medium">Connecter</button>
        </div>
      </div>
    </Card>
  );
};

export default IntegrationsSection;
