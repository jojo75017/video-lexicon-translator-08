
import React from 'react';
import UnifiedDashboard from '@/components/dashboard/UnifiedDashboard';
import { Card } from '@/components/ui/card';
import { Link } from 'lucide-react';

const InternalLinksPage = () => {
  return (
    <UnifiedDashboard>
      <div className="container mx-auto py-4">
        <Card className="p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <Link className="h-5 w-5 mr-2 text-purple-600" />
            Analyse des Liens Internes
          </h2>
          
          <div className="space-y-6">
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h3 className="font-medium text-purple-800 mb-2">Optimisation des Liens Internes</h3>
              <p className="text-purple-700 text-sm">
                Améliorez votre structure de liens internes pour optimiser le maillage de votre site et renforcer votre référencement.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-2">Pages Populaires</h4>
                <p className="text-gray-600 text-sm">
                  Identifiez les pages les plus liées de votre site.
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-2">Pages Orphelines</h4>
                <p className="text-gray-600 text-sm">
                  Trouvez les pages qui n'ont aucun lien interne pointant vers elles.
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-2">Suggestions de Liens</h4>
                <p className="text-gray-600 text-sm">
                  Recevez des recommandations pour améliorer votre maillage interne.
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-2">Analyse des Ancres</h4>
                <p className="text-gray-600 text-sm">
                  Optimisez le texte d'ancrage de vos liens internes.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </UnifiedDashboard>
  );
};

export default InternalLinksPage;
