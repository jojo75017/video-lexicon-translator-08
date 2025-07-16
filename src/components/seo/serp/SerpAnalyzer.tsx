import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Settings, 
  Globe, 
  ExternalLink, 
  BarChart3, 
  TrendingUp,
  Eye,
  Clock,
  Target,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { SerpApiService, SerpSearchResult, SerpApiConfig } from '@/services/serpApiService';

const SerpAnalyzer: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [serpResults, setSerpResults] = useState<SerpSearchResult[]>([]);
  const [showConfig, setShowConfig] = useState(false);
  const [config, setConfig] = useState<SerpApiConfig>(SerpApiService.getConfig());
  const [activeTab, setActiveTab] = useState('search');

  const handleConfigSave = () => {
    SerpApiService.setConfig(config);
    setShowConfig(false);
    toast.success('Configuration SERP sauvegardée');
  };

  const searchSerps = async () => {
    if (!keyword.trim()) {
      toast.error('Veuillez entrer un mot-clé');
      return;
    }

    setIsSearching(true);
    try {
      const results = await SerpApiService.searchAllEngines(keyword, 10);
      
      if (results.length === 0) {
        toast.warning('Aucun moteur de recherche configuré. Configurez au moins une API.');
        setShowConfig(true);
        return;
      }

      setSerpResults(results);
      setActiveTab('results');
      toast.success(`${results.length} recherches SERP effectuées avec succès`);
    } catch (error) {
      console.error('Erreur recherche SERP:', error);
      toast.error('Erreur lors de la recherche SERP');
    } finally {
      setIsSearching(false);
    }
  };

  const competitorAnalysis = serpResults.length > 0 ? SerpApiService.analyzeSerpCompetitors(serpResults) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-purple-500" />
                Analyseur SERP - Google & Bing
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Analysez les résultats de recherche et identifiez vos concurrents
              </p>
            </div>
            <Dialog open={showConfig} onOpenChange={setShowConfig}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Configurer APIs
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Configuration APIs SERP</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="googleApiKey">Google API Key</Label>
                    <Input
                      id="googleApiKey"
                      type="password"
                      placeholder="AIza..."
                      value={config.googleApiKey || ''}
                      onChange={(e) => setConfig({...config, googleApiKey: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="googleCseId">Google Custom Search Engine ID</Label>
                    <Input
                      id="googleCseId"
                      placeholder="cx:..."
                      value={config.googleCseId || ''}
                      onChange={(e) => setConfig({...config, googleCseId: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bingApiKey">Bing Search API Key</Label>
                    <Input
                      id="bingApiKey"
                      type="password"
                      placeholder="Bing API Key"
                      value={config.bingApiKey || ''}
                      onChange={(e) => setConfig({...config, bingApiKey: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="serpApiKey">SerpAPI Key (recommandé)</Label>
                    <Input
                      id="serpApiKey"
                      type="password"
                      placeholder="SerpAPI Key"
                      value={config.serpApiKey || ''}
                      onChange={(e) => setConfig({...config, serpApiKey: e.target.value})}
                    />
                  </div>
                  <Button onClick={handleConfigSave} className="w-full">
                    Sauvegarder la configuration
                  </Button>
                  <p className="text-xs text-gray-500">
                    Note: SerpAPI est recommandé pour sa fiabilité et ses quotas généreux
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Entrez un mot-clé à analyser..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchSerps()}
              className="flex-1"
            />
            <Button onClick={searchSerps} disabled={isSearching}>
              {isSearching ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Recherche...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Analyser SERP
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {serpResults.length > 0 && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="results">Résultats SERP</TabsTrigger>
            <TabsTrigger value="competitors">Analyse Concurrents</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunités</TabsTrigger>
          </TabsList>

          <TabsContent value="results" className="space-y-4">
            {serpResults.map((serpResult, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      {serpResult.source === 'google' && 'Google'}
                      {serpResult.source === 'bing' && 'Bing'}
                      {serpResult.source === 'serpapi' && 'SerpAPI'}
                      - "{serpResult.keyword}"
                    </CardTitle>
                    <div className="flex gap-2">
                      <Badge variant="outline">
                        <Clock className="h-3 w-3 mr-1" />
                        {serpResult.searchTime}s
                      </Badge>
                      <Badge variant="outline">
                        {serpResult.totalResults.toLocaleString()} résultats
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {serpResult.results.slice(0, 10).map((result, idx) => (
                      <div key={idx} className="border rounded-lg p-3 hover:bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="secondary" className="text-xs">
                                #{result.position}
                              </Badge>
                              <span className="text-xs text-gray-500">{result.domain}</span>
                            </div>
                            <h4 className="font-medium text-blue-600 hover:underline cursor-pointer text-sm">
                              {result.title}
                            </h4>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {result.description}
                            </p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => window.open(result.url, '_blank')}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="competitors" className="space-y-4">
            {competitorAnalysis && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Domaines Concurrents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {competitorAnalysis.topDomains.map((domain, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{domain.domain}</h4>
                          <p className="text-sm text-gray-600">
                            Position moyenne: {domain.avgPosition.toFixed(1)}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">
                            {domain.appearances} apparitions
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-4">
            {competitorAnalysis && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Opportunités de Positionnement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {competitorAnalysis.opportunities.slice(0, 10).map((opp, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-medium">"{opp.keyword}"</h4>
                            <p className="text-sm text-gray-600">Concurrent: {opp.competitor}</p>
                          </div>
                          <Badge 
                            variant={opp.position <= 5 ? "default" : "secondary"}
                          >
                            Position #{opp.position}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Analyse et Recommandations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{competitorAnalysis.analysis}</p>
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <h5 className="font-medium text-blue-900 mb-2">Recommandations:</h5>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Analysez le contenu des concurrents bien positionnés</li>
                        <li>• Créez du contenu plus complet pour les mots-clés ciblés</li>
                        <li>• Optimisez vos métadonnées et structure de page</li>
                        <li>• Surveillez régulièrement les changements de position</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default SerpAnalyzer;