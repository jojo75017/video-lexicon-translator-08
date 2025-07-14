
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Target, 
  TrendingUp, 
  BarChart3, 
  Search, 
  Globe,
  Trophy,
  AlertTriangle,
  CheckCircle,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import { CompetitorComparison, CompetitorAnalysisResult } from "@/types/seo/CompetitorData";

const TripleCompetitorAnalyzer: React.FC = () => {
  const [yourSite, setYourSite] = useState('');
  const [competitor1, setCompetitor1] = useState('');
  const [competitor2, setCompetitor2] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<CompetitorComparison | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const handleAnalysis = async () => {
    if (!yourSite || !competitor1 || !competitor2) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);
    
    // Simulation de progression
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 500);

    try {
      toast.loading("Analyse en cours des 3 sites...", { id: "triple-analysis" });

      // Simulation d'analyse complète
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Génération de données simulées réalistes
      const mockResult: CompetitorComparison = {
        yourSite: generateSiteAnalysis(yourSite, 'your'),
        competitor1: generateSiteAnalysis(competitor1, 'comp1'),
        competitor2: generateSiteAnalysis(competitor2, 'comp2'),
        comparison: {
          keywordGaps: [
            'marketing digital avancé',
            'seo technique',
            'stratégie contenu',
            'analyse concurrentielle',
            'optimisation conversion'
          ],
          strengthComparison: [
            { site: yourSite, strength: Math.floor(Math.random() * 30) + 50 },
            { site: competitor1, strength: Math.floor(Math.random() * 30) + 60 },
            { site: competitor2, strength: Math.floor(Math.random() * 30) + 55 }
          ],
          positionAnalysis: [
            { keyword: 'marketing digital', yourPosition: 15, comp1Position: 3, comp2Position: 8 },
            { keyword: 'seo technique', yourPosition: 25, comp1Position: 7, comp2Position: 12 },
            { keyword: 'stratégie contenu', yourPosition: 8, comp1Position: 15, comp2Position: 5 },
            { keyword: 'analyse web', yourPosition: 12, comp1Position: 4, comp2Position: 18 }
          ],
          opportunities: [
            'Améliorer le contenu sur "marketing digital avancé"',
            'Optimiser la vitesse de chargement',
            'Développer plus de backlinks de qualité',
            'Créer du contenu sur les gaps identifiés',
            'Améliorer la structure technique du site'
          ]
        }
      };

      setAnalysisResult(mockResult);
      setProgress(100);
      clearInterval(progressInterval);
      
      toast.success("Analyse comparative terminée!", { id: "triple-analysis" });
    } catch (error) {
      toast.error("Erreur lors de l'analyse", { id: "triple-analysis" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateSiteAnalysis = (url: string, type: 'your' | 'comp1' | 'comp2'): CompetitorAnalysisResult => {
    const baseScores = { your: 65, comp1: 78, comp2: 72 };
    const baseTraffic = { your: 8500, comp1: 25000, comp2: 18000 };
    
    return {
      site: url,
      domain: url.replace(/^https?:\/\//, '').replace(/\/.*$/, ''),
      seoScore: baseScores[type] + Math.floor(Math.random() * 15),
      topKeywords: [
        { keyword: 'marketing digital', position: Math.floor(Math.random() * 20) + 1, volume: 12000 },
        { keyword: 'seo technique', position: Math.floor(Math.random() * 20) + 1, volume: 8900 },
        { keyword: 'stratégie web', position: Math.floor(Math.random() * 20) + 1, volume: 6500 },
        { keyword: 'analyse concurrentielle', position: Math.floor(Math.random() * 20) + 1, volume: 4200 },
        { keyword: 'optimisation site', position: Math.floor(Math.random() * 20) + 1, volume: 3800 }
      ],
      totalKeywords: Math.floor(Math.random() * 500) + 200,
      organicTraffic: baseTraffic[type] + Math.floor(Math.random() * 5000),
      backlinksCount: Math.floor(Math.random() * 2000) + 500,
      domainAuthority: Math.floor(Math.random() * 30) + 50,
      technicalSeo: {
        loadSpeed: Math.floor(Math.random() * 30) + 60,
        mobileOptimization: Math.floor(Math.random() * 20) + 75,
        sslCertificate: Math.random() > 0.2,
        structuredData: Math.random() > 0.3
      }
    };
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getPositionColor = (position: number) => {
    if (position <= 3) return 'text-green-600 bg-green-50';
    if (position <= 10) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="space-y-6">
      <Card className="border-t-4 border-purple-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6 text-purple-600" />
            Analyse Comparative Triple
          </CardTitle>
          <p className="text-gray-600">
            Comparez votre site avec 2 concurrents sur tous les aspects SEO
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-green-700 mb-2 block">
                <Globe className="h-4 w-4 inline mr-1" />
                Votre site
              </label>
              <Input
                placeholder="https://votresite.com"
                value={yourSite}
                onChange={(e) => setYourSite(e.target.value)}
                className="border-green-200 focus:border-green-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-red-700 mb-2 block">
                <Target className="h-4 w-4 inline mr-1" />
                Concurrent 1
              </label>
              <Input
                placeholder="https://concurrent1.com"
                value={competitor1}
                onChange={(e) => setCompetitor1(e.target.value)}
                className="border-red-200 focus:border-red-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-blue-700 mb-2 block">
                <Target className="h-4 w-4 inline mr-1" />
                Concurrent 2
              </label>
              <Input
                placeholder="https://concurrent2.com"
                value={competitor2}
                onChange={(e) => setCompetitor2(e.target.value)}
                className="border-blue-200 focus:border-blue-500"
              />
            </div>
          </div>

          {isAnalyzing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Analyse en cours...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-gray-500">
                Analyse SEO, mots-clés, positions et performance technique...
              </p>
            </div>
          )}

          <Button 
            onClick={handleAnalysis}
            disabled={isAnalyzing || !yourSite || !competitor1 || !competitor2}
            className="w-full bg-purple-600 hover:bg-purple-700"
            size="lg"
          >
            {isAnalyzing ? "Analyse en cours..." : "Lancer l'analyse comparative"}
          </Button>
        </CardContent>
      </Card>

      {analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              Résultats de l'analyse comparative
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                <TabsTrigger value="keywords">Mots-clés</TabsTrigger>
                <TabsTrigger value="positions">Positions</TabsTrigger>
                <TabsTrigger value="opportunities">Opportunités</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { data: analysisResult.yourSite, color: 'green', label: 'Votre site' },
                    { data: analysisResult.competitor1, color: 'red', label: 'Concurrent 1' },
                    { data: analysisResult.competitor2, color: 'blue', label: 'Concurrent 2' }
                  ].map((site, index) => (
                    <Card key={index} className={`border-${site.color}-200`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-medium text-${site.color}-700`}>{site.label}</h4>
                          <Badge className={getScoreColor(site.data.seoScore)}>
                            Score: {site.data.seoScore}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 truncate">{site.data.domain}</p>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-gray-500">Trafic organique:</span>
                            <div className="font-medium">{site.data.organicTraffic.toLocaleString()}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Mots-clés:</span>
                            <div className="font-medium">{site.data.totalKeywords}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Backlinks:</span>
                            <div className="font-medium">{site.data.backlinksCount.toLocaleString()}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Autorité:</span>
                            <div className="font-medium">{site.data.domainAuthority}</div>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          asChild
                        >
                          <a href={site.data.site} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Visiter
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="keywords" className="space-y-4">
                <div className="space-y-4">
                  <h4 className="font-medium">Top mots-clés par site</h4>
                  {[
                    { data: analysisResult.yourSite, label: 'Votre site', color: 'green' },
                    { data: analysisResult.competitor1, label: 'Concurrent 1', color: 'red' },
                    { data: analysisResult.competitor2, label: 'Concurrent 2', color: 'blue' }
                  ].map((site, siteIndex) => (
                    <Card key={siteIndex}>
                      <CardHeader className="pb-3">
                        <h5 className={`font-medium text-${site.color}-700`}>{site.label}</h5>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {site.data.topKeywords.map((keyword, index) => (
                            <div key={index} className="flex items-center justify-between p-2 border rounded">
                              <span className="text-sm font-medium">{keyword.keyword}</span>
                              <div className="flex items-center gap-2">
                                <Badge className={getPositionColor(keyword.position)}>
                                  #{keyword.position}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  {keyword.volume.toLocaleString()} vol.
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="positions" className="space-y-4">
                <h4 className="font-medium">Comparaison des positions</h4>
                <div className="space-y-3">
                  {analysisResult.comparison.positionAnalysis.map((analysis, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-medium">{analysis.keyword}</h5>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="text-xs text-gray-500 mb-1">Votre position</div>
                            <Badge className={getPositionColor(analysis.yourPosition)}>
                              #{analysis.yourPosition}
                            </Badge>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500 mb-1">Concurrent 1</div>
                            <Badge className={getPositionColor(analysis.comp1Position)}>
                              #{analysis.comp1Position}
                            </Badge>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500 mb-1">Concurrent 2</div>
                            <Badge className={getPositionColor(analysis.comp2Position)}>
                              #{analysis.comp2Position}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="opportunities" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-orange-600">
                        <AlertTriangle className="h-5 w-5" />
                        Gaps de mots-clés
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {analysisResult.comparison.keywordGaps.map((gap, index) => (
                          <div key={index} className="p-2 bg-orange-50 border border-orange-200 rounded">
                            <span className="text-sm font-medium text-orange-800">{gap}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        Opportunités d'amélioration
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {analysisResult.comparison.opportunities.map((opportunity, index) => (
                          <div key={index} className="p-2 bg-green-50 border border-green-200 rounded">
                            <span className="text-sm text-green-800">{opportunity}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-purple-600" />
                      Classement par force SEO
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analysisResult.comparison.strengthComparison
                        .sort((a, b) => b.strength - a.strength)
                        .map((site, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded">
                            <div className="flex items-center gap-3">
                              <Badge variant="outline">#{index + 1}</Badge>
                              <span className="font-medium">{site.site}</span>
                            </div>
                            <Badge className={getScoreColor(site.strength)}>
                              {site.strength}/100
                            </Badge>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TripleCompetitorAnalyzer;
