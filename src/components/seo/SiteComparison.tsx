import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SeoAnalysis } from '@/types/seo';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChevronRight, Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';
import { toast } from "sonner";
import { createDataForSEOService } from '@/services/dataForSeoService';

interface KeywordSuggestion {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc: number;
  competition: number;
}

interface SiteComparisonProps {
  site1: {
    url: string;
    analysis: SeoAnalysis;
  };
  site2?: {
    url: string;
    analysis: SeoAnalysis;
  };
  onCompare: (url: string) => void;
}

const SiteComparison = ({ site1, site2, onCompare }: SiteComparisonProps) => {
  const [competitorUrl, setCompetitorUrl] = React.useState('');
  const [keywordSuggestions, setKeywordSuggestions] = React.useState<KeywordSuggestion[]>([]);
  const [isLoadingKeywords, setIsLoadingKeywords] = React.useState(false);
  const [useRealData, setUseRealData] = React.useState(false);
  const [apiCredentials, setApiCredentials] = React.useState({
    login: '',
    password: ''
  });

  const getComparisonData = () => {
    if (!site2) return [];
    
    return [
      {
        metric: 'Score SEO',
        site1: site1.analysis.readabilityScore,
        site2: site2.analysis.readabilityScore,
      },
      {
        metric: 'Performance',
        site1: site1.analysis.performance.score,
        site2: site2.analysis.performance.score,
      },
      {
        metric: 'Temps de chargement (s)',
        site1: Math.round(site1.analysis.performance.loadTime / 1000 * 10) / 10,
        site2: Math.round(site2.analysis.performance.loadTime / 1000 * 10) / 10,
      },
      {
        metric: 'Mots clés',
        site1: (site1.analysis.keywords || []).length,
        site2: (site2.analysis.keywords || []).length,
      },
      {
        metric: 'Liens internes',
        site1: site1.analysis.internalLinks,
        site2: site2.analysis.internalLinks,
      },
      {
        metric: 'Liens externes',
        site1: site1.analysis.externalLinks,
        site2: site2.analysis.externalLinks,
      },
      {
        metric: 'Score Mobile',
        site1: site1.analysis.mobileAnalysis?.score || 0,
        site2: site2.analysis.mobileAnalysis?.score || 0,
      },
      {
        metric: 'Images sans alt',
        site1: site1.analysis.imgWithoutAlt,
        site2: site2.analysis.imgWithoutAlt,
      },
      {
        metric: 'Backlinks',
        site1: Array.isArray(site1.analysis.backlinks) ? site1.analysis.backlinks.length : 0,
        site2: Array.isArray(site2.analysis.backlinks) ? site2.analysis.backlinks.length : 0,
      },
      {
        metric: 'Nombre de titres',
        site1: site1.analysis.h1Count + site1.analysis.h2Count + site1.analysis.h3Count,
        site2: site2.analysis.h1Count + site2.analysis.h2Count + site2.analysis.h3Count,
      }
    ];
  };

  const fetchKeywordData = async (keyword: string): Promise<KeywordSuggestion> => {
    if (useRealData && apiCredentials.login && apiCredentials.password) {
      const service = createDataForSEOService(apiCredentials.login, apiCredentials.password);
      return service.getKeywordData(keyword);
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      keyword,
      volume: Math.floor(Math.random() * 10000),
      difficulty: Math.floor(Math.random() * 100),
      cpc: parseFloat((Math.random() * 5).toFixed(2)),
      competition: Math.random()
    };
  };

  const getKeywordSuggestions = async () => {
    setIsLoadingKeywords(true);
    try {
      const baseKeywords = site1.analysis.keywords || [];
      const keywords = baseKeywords.slice(0, 5);
      
      const suggestions = await Promise.all(
        keywords.map(kw => {
          const keyword = typeof kw === 'string' 
            ? kw 
            : (kw && typeof kw === 'object' && 'keyword' in kw) 
              ? String((kw as { keyword: string }).keyword)
              : String(kw);
              
          return fetchKeywordData(keyword);
        })
      );
      
      setKeywordSuggestions(suggestions);
    } catch (error) {
      console.error('Erreur lors de la récupération des données de mots-clés:', error);
      toast.error("Erreur lors de la récupération des suggestions de mots-clés");
    } finally {
      setIsLoadingKeywords(false);
    }
  };

  React.useEffect(() => {
    if (site1.analysis.keywords?.length) {
      getKeywordSuggestions();
    }
  }, [site1.analysis.keywords]);

  const handleApiCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiCredentials.login && apiCredentials.password) {
      setUseRealData(true);
      toast.success("Identifiants DataForSEO enregistrés");
      getKeywordSuggestions();
    }
  };

  const handleCompare = (e: React.FormEvent) => {
    e.preventDefault();
    if (competitorUrl) {
      onCompare(competitorUrl);
      setCompetitorUrl('');
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Comparaison de sites</h2>
      </div>

      {!site2 ? (
        <form onSubmit={handleCompare} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="competitor-url" className="text-sm font-medium text-gray-700">
              URL du site concurrent
            </label>
            <div className="flex gap-2">
              <Input
                id="competitor-url"
                type="url"
                value={competitorUrl}
                onChange={(e) => setCompetitorUrl(e.target.value)}
                placeholder="https://concurrent.com"
                className="flex-1"
              />
              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90">
                Comparer
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <Tabs defaultValue="comparison" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="comparison">Comparaison</TabsTrigger>
            <TabsTrigger value="keywords">Suggestions de mots-clés</TabsTrigger>
          </TabsList>

          <TabsContent value="comparison">
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <div className="text-blue-800 font-semibold mb-1">Votre site</div>
                  <div className="text-lg font-bold text-blue-900 break-all">{site1.url}</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                  <div className="text-green-800 font-semibold mb-1">Site concurrent</div>
                  <div className="text-lg font-bold text-green-900 break-all">{site2.url}</div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onCompare('')}
                    className="mt-2 text-sm text-green-700 hover:text-green-800 hover:bg-green-100"
                  >
                    Changer de concurrent
                  </Button>
                </div>
              </div>
            </div>

            <div className="h-[600px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getComparisonData()} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="metric" type="category" width={150} />
                  <Tooltip 
                    formatter={(value) => [value, '']}
                    labelStyle={{ color: '#111' }}
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      padding: '8px'
                    }}
                  />
                  <Bar dataKey="site1" fill="#3b82f6" name="Votre site" />
                  <Bar dataKey="site2" fill="#22c55e" name="Site concurrent" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 text-sm text-gray-600 flex items-center justify-center space-x-6">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span>Votre site</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>Site concurrent</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="keywords">
            <div className="space-y-6">
              {!useRealData && (
                <form onSubmit={handleApiCredentialsSubmit} className="space-y-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium text-blue-800">Configuration DataForSEO</h3>
                  </div>
                  <p className="text-sm text-blue-700 mb-4">
                    Pour obtenir des données réelles, veuillez entrer vos identifiants DataForSEO.
                    Vous pouvez créer un compte sur{' '}
                    <a 
                      href="https://app.dataforseo.com/register" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="underline hover:text-blue-900"
                    >
                      DataForSEO
                    </a>
                  </p>
                  <div className="grid gap-4">
                    <Input
                      type="text"
                      placeholder="Login DataForSEO"
                      value={apiCredentials.login}
                      onChange={(e) => setApiCredentials(prev => ({ ...prev, login: e.target.value }))}
                    />
                    <Input
                      type="password"
                      placeholder="Mot de passe DataForSEO"
                      value={apiCredentials.password}
                      onChange={(e) => setApiCredentials(prev => ({ ...prev, password: e.target.value }))}
                    />
                    <Button type="submit" className="w-full">
                      Configurer l'API
                    </Button>
                  </div>
                </form>
              )}

              {isLoadingKeywords ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Chargement des suggestions...</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {keywordSuggestions.map((suggestion, index) => (
                    <div 
                      key={index} 
                      className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-400 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Sparkles className="h-5 w-5 text-blue-500" />
                          <h3 className="font-semibold text-lg">{suggestion.keyword}</h3>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                            CPC: {suggestion.cpc}€
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <div className="text-sm text-gray-500 flex items-center">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            Volume mensuel
                          </div>
                          <div className="font-semibold">{suggestion.volume}</div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="text-sm text-gray-500">Difficulté</div>
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${suggestion.difficulty}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{suggestion.difficulty}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="text-sm text-gray-500">Compétition</div>
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{ width: `${suggestion.competition * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">
                              {Math.round(suggestion.competition * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!useRealData && (
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    Vous visualisez actuellement des données simulées. Pour obtenir des données réelles,
                    veuillez configurer vos identifiants DataForSEO ci-dessus.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </Card>
  );
};

export default SiteComparison;
