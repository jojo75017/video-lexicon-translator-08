
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
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <LineChart className="h-6 w-6 text-blue-600" />
              Suivi des Positions
            </h2>
            
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertTitle>Suivi des positions dans les moteurs de recherche</AlertTitle>
              <AlertDescription>
                Cette fonctionnalité vous permet de suivre l'évolution de vos positions pour vos mots-clés principaux.
              </AlertDescription>
            </Alert>
            
            <div className="p-8 text-center border border-dashed border-gray-300 rounded-lg">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Fonctionnalité en cours de développement</h3>
              <p className="text-gray-600">
                Le suivi des positions sera bientôt disponible. Vous pourrez suivre l'évolution de votre référencement au fil du temps.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </UnifiedDashboard>
  );
};

export default TrackingPage;
