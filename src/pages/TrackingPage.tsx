
import React from 'react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { CrawlForm } from '@/components/CrawlForm';
import UnifiedDashboard from '@/components/dashboard/UnifiedDashboard';

const TrackingPage = () => {
  return (
    <UnifiedDashboard>
      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Suivi des positions</h2>
          <Alert className="mb-4">
            <Info className="h-4 w-4" />
            <AlertTitle>Suivez vos positions dans les moteurs de recherche</AlertTitle>
            <AlertDescription>
              Utilisez cet outil pour suivre l'évolution de vos positions dans les moteurs de recherche pour vos mots-clés importants.
            </AlertDescription>
          </Alert>
          <CrawlForm />
        </Card>
      </div>
    </UnifiedDashboard>
  );
};

export default TrackingPage;
