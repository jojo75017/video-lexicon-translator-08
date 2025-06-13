
import React from 'react';
import UnifiedDashboard from '@/components/dashboard/UnifiedDashboard';
import { Card } from '@/components/ui/card';
import { LineChart, TrendingUp } from 'lucide-react';

const TrackingPage = () => {
  return (
    <UnifiedDashboard>
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <LineChart className="h-6 w-6 text-purple-500" />
            <h1 className="text-2xl font-bold">Suivi des Positions</h1>
          </div>
          <p className="text-gray-600 mb-6">
            Suivez l'évolution de vos positions dans les moteurs de recherche.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <h3 className="font-semibold">Mots-clés suivis</h3>
              </div>
              <p className="text-2xl font-bold">127</p>
              <p className="text-sm text-green-600">+12 ce mois</p>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <LineChart className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold">Position moyenne</h3>
              </div>
              <p className="text-2xl font-bold">8.4</p>
              <p className="text-sm text-blue-600">Amélioration de 2.1</p>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                <h3 className="font-semibold">Top 10</h3>
              </div>
              <p className="text-2xl font-bold">45%</p>
              <p className="text-sm text-purple-600">+8% ce mois</p>
            </Card>
          </div>
        </Card>
      </div>
    </UnifiedDashboard>
  );
};

export default TrackingPage;
