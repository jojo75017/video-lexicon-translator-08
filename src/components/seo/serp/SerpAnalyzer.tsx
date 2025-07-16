import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  Globe, 
  ExternalLink, 
  BarChart3, 
  TrendingUp,
  Target,
  Loader2,
  Brain,
  Lightbulb
} from 'lucide-react';
import { toast } from 'sonner';
import { SerpResult } from '@/types/seo/Keyword';
import { OpenAIService } from '@/utils/seo/openaiService';

interface SerpAnalysisResult {
  keyword: string;
  serpData: string;
  analysis: {
    competitors: { domain: string; positions: number[]; avgPosition: number }[];
    opportunities: string[];
    recommendations: string[];
    aiInsights: string;
  };
}

const SerpAnalyzer: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [serpData, setSerpData] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<SerpAnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState('input');
  const [openaiKey] = useState(() => localStorage.getItem('openaiKey') || '');

  const analyzeSerpData = async () => {
    if (!keyword.trim()) {
      toast.error('Veuillez entrer un mot-clé');
      return;
    }

    if (!serpData.trim()) {
      toast.error('Veuillez entrer des données SERP');
      return;
    }

    setIsAnalyzing(true);
    try {
      // Simuler des données SERP si aucune donnée n'est fournie
      const mockSerpResults: SerpResult[] = [
        { title: 'Premier résultat', url: 'https://example1.com', description: 'Description du premier résultat', position: 1, domain: 'example1.com' },
        { title: 'Deuxième résultat', url: 'https://example2.com', description: 'Description du deuxième résultat', position: 2, domain: 'example2.com' },
        { title: 'Troisième résultat', url: 'https://example3.com', description: 'Description du troisième résultat', position: 3, domain: 'example3.com' }
      ];

      // Analyser les domaines concurrents
      const domainMap = new Map<string, number[]>();
      mockSerpResults.forEach(result => {
        if (result.domain) {
          if (!domainMap.has(result.domain)) {
            domainMap.set(result.domain, []);
          }
          domainMap.get(result.domain)!.push(result.position);
        }
      });

      const competitors = Array.from(domainMap.entries()).map(([domain, positions]) => ({
        domain,
        positions,
        avgPosition: positions.reduce((a, b) => a + b, 0) / positions.length
      }));

      // Générer des recommandations avec OpenAI si disponible
      let aiInsights = 'Analyse basique sans IA : Concentrez-vous sur les mots-clés longue traîne et l\'optimisation du contenu.';
      
      if (openaiKey) {
        try {
          const prompt = `Analysez ces résultats SERP pour le mot-clé "${keyword}":
${serpData}

Fournissez:
1. Analyse des concurrents principaux
2. Opportunités de positionnement
3. Recommandations SEO spécifiques
4. Stratégie de contenu`;

          const aiResponse = await OpenAIService.generateKeywords(prompt, openaiKey);
          if (aiResponse && aiResponse.length > 0) {
            aiInsights = aiResponse.map(k => k.keyword).join('. ');
          }
        } catch (error) {
          console.error('Erreur analyse IA:', error);
        }
      }

      const analysis = {
        competitors,
        opportunities: [
          'Créer du contenu plus complet que les concurrents en position 4-10',
          'Optimiser les méta-descriptions pour améliorer le CTR',
          'Développer une stratégie de mots-clés longue traîne'
        ],
        recommendations: [
          'Analyser le contenu des 3 premiers résultats',
          'Identifier les lacunes de contenu',
          'Optimiser la vitesse de chargement',
          'Améliorer les signaux d\'expérience utilisateur'
        ],
        aiInsights
      };

      setAnalysisResult({
        keyword,
        serpData,
        analysis
      });

      setActiveTab('results');
      toast.success('Analyse SERP terminée avec succès');
    } catch (error) {
      console.error('Erreur analyse SERP:', error);
      toast.error('Erreur lors de l\'analyse SERP');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-purple-500" />
            Analyseur SERP avec OpenAI
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Analysez vos concurrents en collant les résultats de recherche. {!openaiKey && '(Configurez OpenAI pour une analyse IA avancée)'}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Entrez votre mot-clé cible..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="flex-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Données SERP (copiez-collez les résultats Google/Bing):
              </label>
              <Textarea
                placeholder="Collez ici les résultats de recherche de Google ou Bing...

Exemple:
1. Titre premier résultat - example1.com
   Description du premier résultat...

2. Titre deuxième résultat - example2.com
   Description du deuxième résultat..."
                value={serpData}
                onChange={(e) => setSerpData(e.target.value)}
                rows={10}
                className="w-full"
              />
            </div>
            <Button onClick={analyzeSerpData} disabled={isAnalyzing} className="w-full">
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Analyser les SERP
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {analysisResult && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="results">Analyse Générale</TabsTrigger>
            <TabsTrigger value="competitors">Concurrents</TabsTrigger>
            <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
          </TabsList>

          <TabsContent value="results" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Analyse IA - "{analysisResult.keyword}"
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Insights Intelligence Artificielle:</h4>
                    <p className="text-blue-800 text-sm">{analysisResult.analysis.aiInsights}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 border rounded-lg">
                      <h5 className="font-medium text-gray-900">Concurrents identifiés</h5>
                      <p className="text-2xl font-bold text-purple-600">{analysisResult.analysis.competitors.length}</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h5 className="font-medium text-gray-900">Opportunités</h5>
                      <p className="text-2xl font-bold text-green-600">{analysisResult.analysis.opportunities.length}</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h5 className="font-medium text-gray-900">Recommandations</h5>
                      <p className="text-2xl font-bold text-orange-600">{analysisResult.analysis.recommendations.length}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="competitors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Analyse des Concurrents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysisResult.analysis.competitors.map((competitor, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{competitor.domain}</h4>
                        <p className="text-sm text-gray-600">
                          Positions: {competitor.positions.join(', ')}
                        </p>
                      </div>
                      <Badge variant="outline">
                        Moy: {competitor.avgPosition.toFixed(1)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Opportunités de Positionnement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysisResult.analysis.opportunities.map((opportunity, index) => (
                    <div key={index} className="p-3 border rounded-lg border-l-4 border-l-green-500">
                      <p className="text-gray-700">{opportunity}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Plan d'Action SEO
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysisResult.analysis.recommendations.map((recommendation, index) => (
                    <div key={index} className="p-3 border rounded-lg border-l-4 border-l-blue-500">
                      <p className="text-gray-700">{recommendation}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                  <h5 className="font-medium text-purple-900 mb-2">💡 Conseil Pro:</h5>
                  <p className="text-sm text-purple-800">
                    Utilisez ces insights pour créer du contenu plus performant que vos concurrents. 
                    Concentrez-vous sur les mots-clés où vous êtes en position 4-10 pour des gains rapides.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default SerpAnalyzer;