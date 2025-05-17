
import React from 'react';
import UnifiedDashboard from '@/components/dashboard/UnifiedDashboard';
import { Card } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { LineChart, Info } from 'lucide-react';

const TrackingPage = () => {
  return (
    <UnifiedDashboard>
      <div className="container mx-auto py-4">
        <Card className="p-6 shadow-sm">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <LineChart className="h-5 w-5 mr-2 text-blue-600" />
              Suivi des positions
            </h2>
            
            <Alert className="bg-blue-50 border-blue-100">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800">Suivi des classements</AlertTitle>
              <AlertDescription className="text-blue-700">
                Suivez ici l'évolution de vos positions dans les moteurs de recherche pour vos mots-clés principaux.
              </AlertDescription>
            </Alert>
            
            <div className="p-8 text-center">
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Outil de suivi en cours de chargement
              </h3>
              <p className="text-gray-500">
                Les données de suivi des positions sont en cours de récupération.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </UnifiedDashboard>
  );
};

export default TrackingPage;
