
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link2, Globe, Search, Loader2, Network, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import DashboardNavigation from '@/components/dashboard/DashboardNavigation';

const InternalLinkingPage = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast.error("Veuillez entrer une URL valide");
      return;
    }

    setIsLoading(true);
    toast.info("Analyse du maillage interne en cours...");

    // Simuler une analyse
    setTimeout(() => {
      const mockData = {
        totalPages: 25,
        totalLinks: 156,
        orphanedPages: 3,
        averageDepth: 2.4,
        recommendations: [
          "Créer des liens vers les pages orphelines",
          "Améliorer la structure de navigation",
          "Ajouter des liens contextuels dans le contenu"
        ]
      };
      
      setResults(mockData);
      setIsLoading(false);
      toast.success("Analyse terminée");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavigation />
      
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analyse des Liens Internes</h1>
          <p className="text-gray-600">Optimisez votre maillage interne pour améliorer votre SEO</p>
        </div>

        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Link2 className="mr-2 h-5 w-5 text-blue-600" />
            Analyser un site
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">URL du site à analyser</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://exemple.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={isLoading}
                    className="pl-10"
                  />
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                <Button 
                  type="submit"
                  disabled={isLoading || !url.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyse...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Analyser
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Card>

        {!results && !isLoading && (
          <Card className="p-8 text-center">
            <Network className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Entrez l'URL de votre site pour lancer l'analyse
            </h3>
            <p className="text-gray-600">
              L'outil analysera la structure de liens internes et vous fournira des suggestions d'amélioration.
            </p>
          </Card>
        )}

        {results && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="text-sm font-medium text-gray-600">Pages totales</div>
                <div className="text-2xl font-bold">{results.totalPages}</div>
              </Card>
              
              <Card className="p-4">
                <div className="text-sm font-medium text-gray-600">Liens internes</div>
                <div className="text-2xl font-bold">{results.totalLinks}</div>
              </Card>
              
              <Card className="p-4">
                <div className="text-sm font-medium text-gray-600">Pages orphelines</div>
                <div className="text-2xl font-bold text-red-600">{results.orphanedPages}</div>
              </Card>
              
              <Card className="p-4">
                <div className="text-sm font-medium text-gray-600">Profondeur moyenne</div>
                <div className="text-2xl font-bold">{results.averageDepth}</div>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
                Recommandations
              </h3>
              <div className="space-y-3">
                {results.recommendations.map((rec: string, index: number) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700">{rec}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default InternalLinkingPage;
