
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link2, Globe, Search, Loader2, Network, AlertTriangle, BarChart3, Users, Clock, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface LinkResults {
  totalPages: number;
  totalLinks: number;
  orphanedPages: number;
  averageDepth: number;
  recommendations: string[];
  linkDistribution: {
    navigation: number;
    content: number;
    footer: number;
    sidebar: number;
  };
}

const WorkingInternalLinksPage = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<LinkResults | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast.error("Veuillez entrer une URL valide");
      return;
    }

    setIsLoading(true);
    toast.info("Analyse du maillage interne en cours...");

    setTimeout(() => {
      const mockData: LinkResults = {
        totalPages: 28,
        totalLinks: 187,
        orphanedPages: 4,
        averageDepth: 2.6,
        linkDistribution: {
          navigation: 42,
          content: 98,
          footer: 28,
          sidebar: 19
        },
        recommendations: [
          "Créer des liens vers les 4 pages orphelines détectées",
          "Améliorer la structure de navigation principale",
          "Ajouter plus de liens contextuels dans le contenu",
          "Optimiser la répartition des liens internes",
          "Créer des pages piliers pour structurer le contenu"
        ]
      };
      
      setResults(mockData);
      setIsLoading(false);
      toast.success("Analyse terminée avec succès !");
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour
              </Button>
              <h1 className="text-xl font-bold text-gray-900">Analyse des Liens Internes</h1>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Optimisation du Maillage Interne</h1>
          <p className="text-gray-600">Analysez et améliorez la structure de liens internes de votre site web</p>
        </div>

        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Link2 className="mr-2 h-5 w-5 text-blue-600" />
            Analyser votre site
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">URL du site à analyser</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://example.com"
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
              Prêt à analyser votre maillage interne
            </h3>
            <p className="text-gray-600">
              Entrez l'URL de votre site pour découvrir les opportunités d'amélioration.
            </p>
          </Card>
        )}

        {results && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-600">Pages analysées</div>
                    <div className="text-2xl font-bold text-blue-600">{results.totalPages}</div>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-600">Liens internes</div>
                    <div className="text-2xl font-bold text-green-600">{results.totalLinks}</div>
                  </div>
                  <Link2 className="h-8 w-8 text-green-500" />
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-600">Pages orphelines</div>
                    <div className="text-2xl font-bold text-red-600">{results.orphanedPages}</div>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-600">Profondeur moyenne</div>
                    <div className="text-2xl font-bold text-purple-600">{results.averageDepth}</div>
                  </div>
                  <Clock className="h-8 w-8 text-purple-500" />
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BarChart3 className="mr-2 h-5 w-5 text-blue-500" />
                Répartition des liens
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{results.linkDistribution.navigation}</div>
                  <div className="text-sm text-gray-600 font-medium">Navigation</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">{results.linkDistribution.content}</div>
                  <div className="text-sm text-gray-600 font-medium">Contenu</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{results.linkDistribution.footer}</div>
                  <div className="text-sm text-gray-600 font-medium">Pied de page</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-3xl font-bold text-orange-600 mb-2">{results.linkDistribution.sidebar}</div>
                  <div className="text-sm text-gray-600 font-medium">Barre latérale</div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
                Recommandations d'amélioration
              </h3>
              <div className="space-y-4">
                {results.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-gray-800 font-medium">{rec}</p>
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

export default WorkingInternalLinksPage;
