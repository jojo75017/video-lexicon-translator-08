import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Target, TrendingUp, Users, Globe, Star, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { RealCompetitorAnalysisService } from '@/services/realCompetitorAnalysisService';
import { createMockAnalysisResult } from '@/utils/competitorAnalysisUtils';

const CompetitorAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const [yourSite, setYourSite] = useState('');
  const [competitor1, setCompetitor1] = useState('');
  const [competitor2, setCompetitor2] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const analyzeCompetitors = async () => {
    if (!yourSite.trim() || !competitor1.trim() || !competitor2.trim()) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);
    
    try {
      // Utilisation du service d'analyse concurrentielle avec des données simulées avancées
      const result = createMockAnalysisResult(yourSite, competitor1, competitor2);
      setAnalysis(result);
      toast.success('Analyse concurrentielle terminée !');
    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
      toast.error('Erreur lors de l\'analyse');
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getPositionColor = (position: number) => {
    if (position <= 3) return 'text-green-600 bg-green-50';
    if (position <= 10) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30 p-6">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            🎯 Analyse Concurrentielle Ultra Perfectionnée
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Votre site web</label>
                <Input
                  placeholder="https://monsite.com"
                  value={yourSite}
                  onChange={(e) => setYourSite(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Concurrent #1</label>
                <Input
                  placeholder="https://concurrent1.com"
                  value={competitor1}
                  onChange={(e) => setCompetitor1(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Concurrent #2</label>
                <Input
                  placeholder="https://concurrent2.com"
                  value={competitor2}
                  onChange={(e) => setCompetitor2(e.target.value)}
                />
              </div>

              <Button onClick={analyzeCompetitors} disabled={isLoading} className="w-full">
                {isLoading ? 'Analyse en cours...' : 'Analyser les concurrents'}
              </Button>
            </CardContent>
          </Card>

          {analysis && (
            <div className="lg:col-span-3 space-y-6">
              {/* Scores globaux */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Scores SEO Globaux
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Votre site</div>
                      <div className={`text-2xl font-bold p-2 rounded ${getScoreColor(analysis.yourSite.seoScore)}`}>
                        {analysis.yourSite.seoScore}/100
                      </div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Concurrent #1</div>
                      <div className={`text-2xl font-bold p-2 rounded ${getScoreColor(analysis.competitor1.seoScore)}`}>
                        {analysis.competitor1.seoScore}/100
                      </div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Concurrent #2</div>
                      <div className={`text-2xl font-bold p-2 rounded ${getScoreColor(analysis.competitor2.seoScore)}`}>
                        {analysis.competitor2.seoScore}/100
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Analyse détaillée */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Concurrent #1 - {analysis.competitor1.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Trafic organique:</span>
                        <span className="font-medium">{analysis.competitor1.organicTraffic.toLocaleString()}/mois</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mots-clés positionnés:</span>
                        <span className="font-medium">{analysis.competitor1.totalKeywords.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Backlinks:</span>
                        <span className="font-medium">{analysis.competitor1.backlinks.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Authority Score:</span>
                        <span className="font-medium">{analysis.competitor1.authorityScore}/100</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Concurrent #2 - {analysis.competitor2.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Trafic organique:</span>
                        <span className="font-medium">{analysis.competitor2.organicTraffic.toLocaleString()}/mois</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mots-clés positionnés:</span>
                        <span className="font-medium">{analysis.competitor2.totalKeywords.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Backlinks:</span>
                        <span className="font-medium">{analysis.competitor2.backlinks.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Authority Score:</span>
                        <span className="font-medium">{analysis.competitor2.authorityScore}/100</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Mots-clés en commun */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Mots-clés Communs
                    <Badge variant="outline">{analysis.commonKeywords.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analysis.commonKeywords.slice(0, 10).map((keyword: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{keyword.keyword}</span>
                          <Badge variant="outline">
                            Vol: {keyword.searchVolume.toLocaleString()}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`px-2 py-1 rounded text-xs ${getPositionColor(keyword.yourPosition)}`}>
                            Vous: #{keyword.yourPosition}
                          </div>
                          <div className={`px-2 py-1 rounded text-xs ${getPositionColor(keyword.competitor1Position)}`}>
                            C1: #{keyword.competitor1Position}
                          </div>
                          <div className={`px-2 py-1 rounded text-xs ${getPositionColor(keyword.competitor2Position)}`}>
                            C2: #{keyword.competitor2Position}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Opportunités */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Opportunités Identifiées
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysis.opportunities.slice(0, 8).map((opp: any, index: number) => (
                      <div key={index} className="p-3 border rounded-lg bg-blue-50">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-blue-900">{opp.keyword}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-blue-100 text-blue-800">
                              {opp.difficulty}/100
                            </Badge>
                            <Badge variant="outline" className="bg-green-100 text-green-800">
                              {opp.potential}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-blue-700 mt-1">{opp.reason}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompetitorAnalysisPage;