
import React from 'react';
import UnifiedDashboard from '@/components/dashboard/UnifiedDashboard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Link2, Network, Info } from 'lucide-react';
import { toast } from 'sonner';

const InternalLinkingPage = () => {
  const handleAnalyze = () => {
    toast.info("Analyse en cours...");
    setTimeout(() => {
      toast.success("Analyse terminée");
    }, 2000);
  };

  return (
    <UnifiedDashboard>
      <div className="container mx-auto py-4">
        <Card className="p-6 shadow-sm">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Link2 className="h-6 w-6 text-blue-600" />
              Analyse des liens internes
            </h2>
            
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertTitle>Optimisez votre maillage interne</AlertTitle>
              <AlertDescription>
                Analysez et améliorez la structure des liens internes de votre site pour renforcer votre référencement.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="site-url" className="block text-sm font-medium text-gray-700 mb-1">
                  URL de votre site
                </label>
                <div className="flex gap-2">
                  <Input
                    id="site-url"
                    placeholder="https://example.com"
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleAnalyze}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Analyser
                  </Button>
                </div>
              </div>
              
              <div className="p-8 text-center border border-dashed border-gray-300 rounded-lg">
                <Network className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">Entrez l'URL de votre site pour lancer l'analyse</h3>
                <p className="text-gray-600">
                  L'outil analysera la structure de liens internes et vous fournira des recommandations d'optimisation.
                </p>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 shadow-sm mt-6">
          <h3 className="text-lg font-bold mb-4">Bonnes pratiques pour les liens internes</h3>
          
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
              <h4 className="font-medium">Créez une structure hiérarchique claire</h4>
              <p className="text-sm text-gray-600">Organisez votre contenu de manière logique avec des catégories et sous-catégories bien définies.</p>
            </div>
            
            <div className="p-4 border-l-4 border-green-500 bg-green-50">
              <h4 className="font-medium">Utilisez des ancres pertinentes</h4>
              <p className="text-sm text-gray-600">Évitez les ancres génériques comme "cliquez ici" et préférez des mots-clés descriptifs.</p>
            </div>
            
            <div className="p-4 border-l-4 border-purple-500 bg-purple-50">
              <h4 className="font-medium">Liez vos pages importantes</h4>
              <p className="text-sm text-gray-600">Assurez-vous que vos pages stratégiques reçoivent suffisamment de liens internes.</p>
            </div>
            
            <div className="p-4 border-l-4 border-amber-500 bg-amber-50">
              <h4 className="font-medium">Limitez la profondeur de navigation</h4>
              <p className="text-sm text-gray-600">Les pages importantes ne devraient pas être à plus de 3-4 clics de la page d'accueil.</p>
            </div>
          </div>
        </Card>
      </div>
    </UnifiedDashboard>
  );
};

export default InternalLinkingPage;
