
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
  ExternalLink,
  Lightbulb,
  Eye,
  ArrowUp,
  ArrowDown,
  Minus
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
      toast.loading("Analyse complète en cours...", { id: "triple-analysis" });

      // Simulation réaliste d'analyse SEO complète
      await new Promise(resolve => setTimeout(resolve, 6000));

      const mockResult: CompetitorComparison = {
        yourSite: generateSiteAnalysis(yourSite, 'your'),
        competitor1: generateSiteAnalysis(competitor1, 'comp1'),
        competitor2: generateSiteAnalysis(competitor2, 'comp2'),
        comparison: {
          keywordGaps: generateKeywordGaps(yourSite),
          strengthComparison: [
            { site: yourSite, strength: Math.floor(Math.random() * 25) + 55 },
            { site: competitor1, strength: Math.floor(Math.random() * 25) + 70 },
            { site: competitor2, strength: Math.floor(Math.random() * 25) + 60 }
          ],
          positionAnalysis: generatePositionAnalysis(),
          opportunities: generateOpportunities(yourSite)
        }
      };

      setAnalysisResult(mockResult);
      setProgress(100);
      clearInterval(progressInterval);
      
      toast.success("Analyse terminée ! Découvrez comment surpasser vos concurrents", { 
        id: "triple-analysis",
        duration: 5000
      });
    } catch (error) {
      toast.error("Erreur lors de l'analyse", { id: "triple-analysis" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateSiteAnalysis = (url: string, type: 'your' | 'comp1' | 'comp2'): CompetitorAnalysisResult => {
    const isTravel = url.toLowerCase().includes('voyage') || url.toLowerCase().includes('travel');
    const domain = url.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    
    const baseScores = { your: 58, comp1: 85, comp2: 76 };
    const baseTraffic = { your: 5500, comp1: 28000, comp2: 19500 };
    
    const travelKeywords = [
      { keyword: 'voyage organisé', position: Math.floor(Math.random() * 15) + 1, volume: 18500 },
      { keyword: 'destination voyage', position: Math.floor(Math.random() * 20) + 1, volume: 12400 },
      { keyword: 'séjour all inclusive', position: Math.floor(Math.random() * 25) + 1, volume: 9800 },
      { keyword: 'réservation hotel', position: Math.floor(Math.random() * 18) + 1, volume: 15200 },
      { keyword: 'guide voyage', position: Math.floor(Math.random() * 12) + 1, volume: 8900 }
    ];

    const genericKeywords = [
      { keyword: 'service principal', position: Math.floor(Math.random() * 20) + 1, volume: 12000 },
      { keyword: 'solution experte', position: Math.floor(Math.random() * 20) + 1, volume: 8900 },
      { keyword: 'conseil professionnel', position: Math.floor(Math.random() * 20) + 1, volume: 6500 },
      { keyword: 'accompagnement', position: Math.floor(Math.random() * 20) + 1, volume: 4200 },
      { keyword: 'expertise', position: Math.floor(Math.random() * 20) + 1, volume: 3800 }
    ];
    
    return {
      site: url,
      domain: domain,
      seoScore: baseScores[type] + Math.floor(Math.random() * 15),
      topKeywords: isTravel ? travelKeywords : genericKeywords,
      totalKeywords: Math.floor(Math.random() * 800) + 350,
      organicTraffic: baseTraffic[type] + Math.floor(Math.random() * 8000),
      backlinksCount: Math.floor(Math.random() * 3500) + 800,
      domainAuthority: Math.floor(Math.random() * 35) + 45,
      technicalSeo: {
        loadSpeed: Math.floor(Math.random() * 40) + 50,
        mobileOptimization: Math.floor(Math.random() * 25) + 70,
        sslCertificate: Math.random() > 0.1,
        structuredData: Math.random() > 0.2
      }
    };
  };

  const generateKeywordGaps = (yourSite: string) => {
    const isTravel = yourSite.toLowerCase().includes('voyage') || yourSite.toLowerCase().includes('travel');
    
    if (isTravel) {
      return [
        'voyage dernière minute',
        'croisière méditerranée',
        'circuit organisé asie',
        'weekend romantique',
        'séjour spa détente',
        'voyage groupe famille',
        'excursion locale'
      ];
    }
    
    return [
      'solution avancée',
      'expertise technique',
      'conseil stratégique',
      'accompagnement personnalisé',
      'formation spécialisée'
    ];
  };

  const generatePositionAnalysis = () => [
    { keyword: 'mot-clé principal 1', yourPosition: 18, comp1Position: 4, comp2Position: 9 },
    { keyword: 'mot-clé principal 2', yourPosition: 25, comp1Position: 6, comp2Position: 14 },
    { keyword: 'mot-clé principal 3', yourPosition: 12, comp1Position: 15, comp2Position: 7 },
    { keyword: 'mot-clé principal 4', yourPosition: 8, comp1Position: 3, comp2Position: 21 },
    { keyword: 'mot-clé principal 5', yourPosition: 32, comp1Position: 11, comp2Position: 16 }
  ];

  const generateOpportunities = (yourSite: string) => {
    const isTravel = yourSite.toLowerCase().includes('voyage') || yourSite.toLowerCase().includes('travel');
    
    if (isTravel) {
      return [
        'Créer du contenu sur les voyages dernière minute pour capturer 18k recherches/mois',
        'Optimiser les pages destinations avec des guides locaux détaillés',
        'Développer une section avis clients pour améliorer la confiance',
        'Améliorer le maillage interne entre destinations similaires',
        'Créer des landing pages saisonnières (été, hiver, printemps)',
        'Optimiser pour la recherche locale "voyage + ville"',
        'Développer du contenu vidéo pour les réseaux sociaux'
      ];
    }
    
    return [
      'Améliorer le contenu existant avec les mots-clés gaps identifiés',
      'Créer une stratégie de backlinks plus agressive',
      'Optimiser la vitesse de chargement (gain potentiel +15 positions)',
      'Développer du contenu longue traîne sur votre expertise',
      'Améliorer l\'UX mobile pour réduire le taux de rebond'
    ];
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

  const getPositionTrend = (yourPos: number, compPos: number) => {
    if (yourPos < compPos) return { icon: ArrowUp, color: 'text-green-600', text: 'Vous êtes devant' };
    if (yourPos > compPos) return { icon: ArrowDown, color: 'text-red-600', text: 'Vous êtes derrière' };
    return { icon: Minus, color: 'text-gray-600', text: 'Position égale' };
  };

  return (
    <div className="space-y-6">
      <Card className="border-t-4 border-purple-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6 text-purple-600" />
            Analyse Concurrentielle Complète
          </CardTitle>
          <p className="text-gray-600">
            Analysez votre site vs 2 concurrents pour identifier toutes les opportunités de dépassement
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
                placeholder="https://votre-site-voyage.com"
                value={yourSite}
                onChange={(e) => setYourSite(e.target.value)}
                className="border-green-200 focus:border-green-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-red-700 mb-2 block">
                <Target className="h-4 w-4 inline mr-1" />
                Concurrent principal
              </label>
              <Input
                placeholder="https://concurrent-leader.com"
                value={competitor1}
                onChange={(e) => setCompetitor1(e.target.value)}
                className="border-red-200 focus:border-red-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-blue-700 mb-2 block">
                <Target className="h-4 w-4 inline mr-1" />
                Concurrent secondaire
              </label>
              <Input
                placeholder="https://concurrent-2.com"
                value={competitor2}
                onChange={(e) => setCompetitor2(e.target.value)}
                className="border-blue-200 focus:border-blue-500"
              />
            </div>
          </div>

          {isAnalyzing && (
            <div className="space-y-3 p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between text-sm font-medium">
                <span>Analyse SEO approfondie en cours...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-3" />
              <div className="text-xs text-gray-600 space-y-1">
                <p>• Analyse des mots-clés et positions</p>
                <p>• Évaluation de la force SEO technique</p>
                <p>• Identification des opportunités de dépassement</p>
                <p>• Génération de recommandations stratégiques</p>
              </div>
            </div>
          )}

          <Button 
            onClick={handleAnalysis}
            disabled={isAnalyzing || !yourSite || !competitor1 || !competitor2}
            className="w-full bg-purple-600 hover:bg-purple-700 h-12 text-lg"
            size="lg"
          >
            {isAnalyzing ? "Analyse en cours..." : "🚀 Analyser et trouver comment les surpasser"}
          </Button>
        </CardContent>
      </Card>

      {analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              Votre Plan de Bataille SEO
            </CardTitle>
            <p className="text-gray-600">
              Découvrez exactement comment surpasser vos concurrents
            </p>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-5 w-full">
                <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                <TabsTrigger value="keywords">Mots-clés</TabsTrigger>
                <TabsTrigger value="positions">Positions</TabsTrigger>
                <TabsTrigger value="opportunities">Opportunités</TabsTrigger>
                <TabsTrigger value="action-plan">Plan d'action</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { data: analysisResult.yourSite, color: 'green', label: 'Votre site', status: 'À améliorer' },
                    { data: analysisResult.competitor1, color: 'red', label: 'Concurrent leader', status: 'À rattraper' },
                    { data: analysisResult.competitor2, color: 'blue', label: 'Concurrent 2', status: 'Dépassable' }
                  ].map((site, index) => (
                    <Card key={index} className={`border-${site.color}-200 relative overflow-hidden`}>
                      <div className={`absolute top-0 left-0 w-full h-1 bg-${site.color}-500`}></div>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-medium text-${site.color}-700`}>{site.label}</h4>
                          <Badge className={getScoreColor(site.data.seoScore)}>
                            {site.data.seoScore}/100
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 truncate">{site.data.domain}</p>
                        <Badge variant="outline" className="text-xs">
                          {site.status}
                        </Badge>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="p-2 bg-gray-50 rounded">
                            <span className="text-gray-500">Trafic mensuel:</span>
                            <div className="font-bold text-sm">{site.data.organicTraffic.toLocaleString()}</div>
                          </div>
                          <div className="p-2 bg-gray-50 rounded">
                            <span className="text-gray-500">Mots-clés:</span>
                            <div className="font-bold text-sm">{site.data.totalKeywords.toLocaleString()}</div>
                          </div>
                          <div className="p-2 bg-gray-50 rounded">
                            <span className="text-gray-500">Backlinks:</span>
                            <div className="font-bold text-sm">{site.data.backlinksCount.toLocaleString()}</div>
                          </div>
                          <div className="p-2 bg-gray-50 rounded">
                            <span className="text-gray-500">Autorité:</span>
                            <div className="font-bold text-sm">{site.data.domainAuthority}/100</div>
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
                            Analyser le site
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Eye className="h-6 w-6 text-purple-600" />
                      <h3 className="text-lg font-semibold">Analyse rapide</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {analysisResult.comparison.strengthComparison[0].strength < analysisResult.comparison.strengthComparison[1].strength ? 
                          (analysisResult.comparison.strengthComparison[1].strength - analysisResult.comparison.strengthComparison[0].strength) : 0}
                        </div>
                        <div className="text-sm text-gray-600">Points à rattraper sur le leader</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{analysisResult.comparison.keywordGaps.length}</div>
                        <div className="text-sm text-gray-600">Opportunités de mots-clés</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{analysisResult.comparison.opportunities.length}</div>
                        <div className="text-sm text-gray-600">Actions d'amélioration</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="keywords" className="space-y-4">
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Comparaison des top mots-clés
                  </h4>
                  {[
                    { data: analysisResult.yourSite, label: 'Votre site', color: 'green' },
                    { data: analysisResult.competitor1, label: 'Concurrent leader', color: 'red' },
                    { data: analysisResult.competitor2, label: 'Concurrent 2', color: 'blue' }
                  ].map((site, siteIndex) => (
                    <Card key={siteIndex} className="overflow-hidden">
                      <CardHeader className={`pb-3 bg-${site.color}-50`}>
                        <h5 className={`font-medium text-${site.color}-700 flex items-center gap-2`}>
                          {site.label}
                          {siteIndex === 0 && <Badge variant="outline">C'est vous</Badge>}
                        </h5>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          {site.data.topKeywords.map((keyword, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                              <div className="flex-1">
                                <span className="font-medium">{keyword.keyword}</span>
                                <div className="text-xs text-gray-500 mt-1">
                                  Volume: {keyword.volume.toLocaleString()} recherches/mois
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={getPositionColor(keyword.position)}>
                                  #{keyword.position}
                                </Badge>
                                {keyword.position <= 3 && <Trophy className="h-4 w-4 text-yellow-500" />}
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
                <h4 className="font-medium">Bataille des positions - Où vous situez-vous ?</h4>
                <div className="space-y-3">
                  {analysisResult.comparison.positionAnalysis.map((analysis, index) => {
                    const trend1 = getPositionTrend(analysis.yourPosition, analysis.comp1Position);
                    const trend2 = getPositionTrend(analysis.yourPosition, analysis.comp2Position);
                    
                    return (
                      <Card key={index} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="font-medium">{analysis.keyword}</h5>
                            <div className="text-xs text-gray-500">Positions actuelles</div>
                          </div>
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                              <div className="text-xs text-gray-500 mb-1">Votre position</div>
                              <Badge className={getPositionColor(analysis.yourPosition)}>
                                #{analysis.yourPosition}
                              </Badge>
                            </div>
                            <div className="text-center p-3 bg-red-50 rounded-lg">
                              <div className="text-xs text-gray-500 mb-1">Concurrent leader</div>
                              <Badge className={getPositionColor(analysis.comp1Position)}>
                                #{analysis.comp1Position}
                              </Badge>
                            </div>
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                              <div className="text-xs text-gray-500 mb-1">Concurrent 2</div>
                              <Badge className={getPositionColor(analysis.comp2Position)}>
                                #{analysis.comp2Position}
                              </Badge>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className={`flex items-center gap-2 ${trend1.color}`}>
                              <trend1.icon className="h-4 w-4" />
                              <span>vs Leader: {trend1.text}</span>
                            </div>
                            <div className={`flex items-center gap-2 ${trend2.color}`}>
                              <trend2.icon className="h-4 w-4" />
                              <span>vs Concurrent 2: {trend2.text}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="opportunities" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-orange-600">
                        <AlertTriangle className="h-5 w-5" />
                        Mots-clés manqués (opportunités dorées)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {analysisResult.comparison.keywordGaps.map((gap, index) => (
                          <div key={index} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-orange-800">{gap}</span>
                              <Badge variant="outline" className="bg-white">
                                Opportunité
                              </Badge>
                            </div>
                            <p className="text-xs text-orange-600 mt-1">
                              Vos concurrents se positionnent dessus, pas vous !
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        Plan d'amélioration immédiate
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {analysisResult.comparison.opportunities.slice(0, 5).map((opportunity, index) => (
                          <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-start gap-2">
                              <Badge variant="outline" className="bg-white text-xs">
                                #{index + 1}
                              </Badge>
                              <span className="text-sm text-green-800 flex-1">{opportunity}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="action-plan" className="space-y-6">
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-700">
                      <Lightbulb className="h-5 w-5" />
                      Votre stratégie de dépassement en 30 jours
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader className="pb-3">
                          <h4 className="font-medium text-green-700">Semaine 1-2: Fondations</h4>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>Optimiser les 5 pages principales</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>Créer du contenu sur les gaps identifiés</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>Améliorer la vitesse de chargement</span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <h4 className="font-medium text-orange-700">Semaine 3: Contenu</h4>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-orange-600" />
                            <span>Publier 5 articles ciblés</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-orange-600" />
                            <span>Optimiser le maillage interne</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-orange-600" />
                            <span>Créer des pages piliers</span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <h4 className="font-medium text-blue-700">Semaine 4: Autorité</h4>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-blue-600" />
                            <span>Obtenir 10 backlinks de qualité</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-blue-600" />
                            <span>Améliorer les signaux sociaux</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-blue-600" />
                            <span>Suivre et ajuster</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="p-4 bg-white rounded-lg border">
                      <h5 className="font-medium mb-3 flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        Résultats attendus après 30 jours
                      </h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">+25%</div>
                          <div className="text-gray-600">Trafic organique</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">+5-10</div>
                          <div className="text-gray-600">Positions gagnées</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-600">+15</div>
                          <div className="text-gray-600">Score SEO</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-orange-600">Top 10</div>
                          <div className="text-gray-600">Nouveaux mots-clés</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-purple-600" />
                      Classement des priorités d'action
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analysisResult.comparison.opportunities.map((opportunity, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className={
                              index < 2 ? "bg-red-50 text-red-700" :
                              index < 5 ? "bg-orange-50 text-orange-700" :
                              "bg-green-50 text-green-700"
                            }>
                              {index < 2 ? "URGENT" : index < 5 ? "IMPORTANT" : "MOYEN TERME"}
                            </Badge>
                            <span className="text-sm">{opportunity}</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Impact: {index < 2 ? "Élevé" : index < 5 ? "Moyen" : "Progressif"}
                          </div>
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
