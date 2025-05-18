
import React, { useState } from 'react';
import UnifiedDashboard from '@/components/dashboard/UnifiedDashboard';
import { Card } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { LineChart, Info, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import RankingTracker from '@/components/seo/RankingTracker';
import { toast } from 'sonner';

const TrackingPage = () => {
  const [url, setUrl] = useState('https://example.com');
  const [isTracking, setIsTracking] = useState(false);
  
  const handleStartTracking = () => {
    if (!url.trim()) {
      toast.error("Veuillez entrer une URL à suivre");
      return;
    }
    
    // Démarrer le suivi des positions
    console.log("Démarrage du suivi pour:", url);
    setIsTracking(true);
    toast.success(`Suivi des positions démarré pour ${url}`);
  };
  
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
                Cette fonctionnalité vous permet de suivre l'évolution de vos positions pour vos mots-clés principaux et d'identifier les opportunités d'optimisation.
              </AlertDescription>
            </Alert>
            
            <div className="flex gap-2 my-4">
              <Input
                placeholder="Entrez l'URL de votre site"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleStartTracking} disabled={isTracking}>
                <Search className="h-4 w-4 mr-2" />
                {isTracking ? "Suivi en cours..." : "Démarrer le suivi"}
              </Button>
            </div>
            
            {isTracking ? (
              <RankingTracker url={url} />
            ) : (
              <div className="p-8 text-center border border-dashed border-gray-300 rounded-lg">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Entrez une URL pour commencer</h3>
                <p className="text-gray-600">
                  Démarrez le suivi pour voir l'évolution de vos positions dans les moteurs de recherche.
                  Vous pourrez analyser les tendances, identifier les mots-clés performants et découvrir 
                  des opportunités d'optimisation pour améliorer votre visibilité.
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </UnifiedDashboard>
  );
};

export default TrackingPage;
