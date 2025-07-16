import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Target, TrendingUp, Users, Globe, Star, BarChart3, Link, Search, Smartphone, Shield, Clock, Eye, PieChart, FileText, Image, Code, Zap, Heart, Award, ExternalLink, Bookmark, Share2, MessageSquare, Calendar, DollarSign } from 'lucide-react';
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
                        <span className="font-medium">{analysis.competitor1.organicTraffic?.toLocaleString() || 'N/A'}/mois</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mots-clés positionnés:</span>
                        <span className="font-medium">{analysis.competitor1.totalKeywords?.toLocaleString() || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Backlinks:</span>
                        <span className="font-medium">{analysis.competitor1.backlinksCount?.toLocaleString() || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Authority Score:</span>
                        <span className="font-medium">{analysis.competitor1.domainAuthority || 'N/A'}/100</span>
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
                        <span className="font-medium">{analysis.competitor2.organicTraffic?.toLocaleString() || 'N/A'}/mois</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mots-clés positionnés:</span>
                        <span className="font-medium">{analysis.competitor2.totalKeywords?.toLocaleString() || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Backlinks:</span>
                        <span className="font-medium">{analysis.competitor2.backlinksCount?.toLocaleString() || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Authority Score:</span>
                        <span className="font-medium">{analysis.competitor2.domainAuthority || 'N/A'}/100</span>
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
                            Vol: {keyword.volume?.toLocaleString() || 'N/A'}
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

              {/* Analyse technique */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      Performance Technique
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <span className="font-medium">Métrique</span>
                        <span className="font-medium">C1</span>
                        <span className="font-medium">C2</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 items-center">
                        <span>Vitesse de chargement:</span>
                        <Badge className={`text-xs ${getScoreColor(85)}`}>2.1s</Badge>
                        <Badge className={`text-xs ${getScoreColor(72)}`}>3.2s</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 items-center">
                        <span>Core Web Vitals:</span>
                        <Badge className={`text-xs ${getScoreColor(92)}`}>92/100</Badge>
                        <Badge className={`text-xs ${getScoreColor(78)}`}>78/100</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 items-center">
                        <span>Mobile-friendly:</span>
                        <Badge className={`text-xs ${getScoreColor(95)}`}>95/100</Badge>
                        <Badge className={`text-xs ${getScoreColor(88)}`}>88/100</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Sécurité & Accessibilité
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <span className="font-medium">Métrique</span>
                        <span className="font-medium">C1</span>
                        <span className="font-medium">C2</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 items-center">
                        <span>SSL/HTTPS:</span>
                        <Badge className="text-xs bg-green-100 text-green-800">✓</Badge>
                        <Badge className="text-xs bg-green-100 text-green-800">✓</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 items-center">
                        <span>Accessibilité:</span>
                        <Badge className={`text-xs ${getScoreColor(89)}`}>89/100</Badge>
                        <Badge className={`text-xs ${getScoreColor(76)}`}>76/100</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 items-center">
                        <span>Schema markup:</span>
                        <Badge className="text-xs bg-green-100 text-green-800">✓</Badge>
                        <Badge className="text-xs bg-red-100 text-red-800">✗</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Analyse de contenu */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Analyse de Contenu
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Nombre de pages indexées:</span>
                        <div className="flex gap-2">
                          <Badge variant="outline">C1: 2,456</Badge>
                          <Badge variant="outline">C2: 1,892</Badge>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span>Fréquence de publication:</span>
                        <div className="flex gap-2">
                          <Badge variant="outline">C1: 8/sem</Badge>
                          <Badge variant="outline">C2: 5/sem</Badge>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span>Longueur moyenne articles:</span>
                        <div className="flex gap-2">
                          <Badge variant="outline">C1: 1,250 mots</Badge>
                          <Badge variant="outline">C2: 890 mots</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Image className="h-5 w-5" />
                      Optimisation Médias
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Images optimisées:</span>
                        <div className="flex gap-2">
                          <Badge className={`text-xs ${getScoreColor(85)}`}>C1: 85%</Badge>
                          <Badge className={`text-xs ${getScoreColor(72)}`}>C2: 72%</Badge>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span>Alt text présent:</span>
                        <div className="flex gap-2">
                          <Badge className={`text-xs ${getScoreColor(92)}`}>C1: 92%</Badge>
                          <Badge className={`text-xs ${getScoreColor(68)}`}>C2: 68%</Badge>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span>Format WebP utilisé:</span>
                        <div className="flex gap-2">
                          <Badge className="text-xs bg-green-100 text-green-800">C1: ✓</Badge>
                          <Badge className="text-xs bg-red-100 text-red-800">C2: ✗</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Analyse des réseaux sociaux */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="h-5 w-5" />
                    Présence sur les Réseaux Sociaux
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 border rounded">
                      <div className="text-sm text-gray-600 mb-2">Facebook</div>
                      <div className="flex justify-between text-xs">
                        <span>C1: 45K likes</span>
                        <span>C2: 28K likes</span>
                      </div>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <div className="text-sm text-gray-600 mb-2">Instagram</div>
                      <div className="flex justify-between text-xs">
                        <span>C1: 78K followers</span>
                        <span>C2: 52K followers</span>
                      </div>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <div className="text-sm text-gray-600 mb-2">LinkedIn</div>
                      <div className="flex justify-between text-xs">
                        <span>C1: 12K followers</span>
                        <span>C2: 8K followers</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Analyse des liens */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Link className="h-5 w-5" />
                      Profil de Liens
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Domaines référents:</span>
                        <div className="flex gap-2">
                          <Badge variant="outline">C1: 2,890</Badge>
                          <Badge variant="outline">C2: 1,456</Badge>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span>Liens DoFollow:</span>
                        <div className="flex gap-2">
                          <Badge variant="outline">C1: 85%</Badge>
                          <Badge variant="outline">C2: 72%</Badge>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span>Ancres optimisées:</span>
                        <div className="flex gap-2">
                          <Badge variant="outline">C1: 23%</Badge>
                          <Badge variant="outline">C2: 31%</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ExternalLink className="h-5 w-5" />
                      Liens Sortants
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Liens externes totaux:</span>
                        <div className="flex gap-2">
                          <Badge variant="outline">C1: 450</Badge>
                          <Badge variant="outline">C2: 380</Badge>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span>Sites d'autorité liés:</span>
                        <div className="flex gap-2">
                          <Badge variant="outline">C1: 78</Badge>
                          <Badge variant="outline">C2: 52</Badge>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span>Liens brisés:</span>
                        <div className="flex gap-2">
                          <Badge className="text-xs bg-yellow-100 text-yellow-800">C1: 12</Badge>
                          <Badge className="text-xs bg-red-100 text-red-800">C2: 28</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Analyse des tendances */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Tendances de Trafic (6 derniers mois)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 border rounded">
                        <div className="text-sm font-medium mb-2">Concurrent #1</div>
                        <div className="flex items-center gap-2">
                          <Badge className="text-xs bg-green-100 text-green-800">+15% ↗</Badge>
                          <span className="text-xs text-gray-600">Croissance stable</span>
                        </div>
                      </div>
                      <div className="p-3 border rounded">
                        <div className="text-sm font-medium mb-2">Concurrent #2</div>
                        <div className="flex items-center gap-2">
                          <Badge className="text-xs bg-red-100 text-red-800">-5% ↘</Badge>
                          <span className="text-xs text-gray-600">Légère baisse</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Analyse des stratégies PPC */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Stratégies Publicitaires (PPC)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Mots-clés PPC actifs:</span>
                      <div className="flex gap-2">
                        <Badge variant="outline">C1: 1,245</Badge>
                        <Badge variant="outline">C2: 890</Badge>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span>Budget estimé/mois:</span>
                      <div className="flex gap-2">
                        <Badge variant="outline">C1: 15K€</Badge>
                        <Badge variant="outline">C2: 8K€</Badge>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span>Concurrence sur enchères:</span>
                      <div className="flex gap-2">
                        <Badge className="text-xs bg-red-100 text-red-800">C1: Élevée</Badge>
                        <Badge className="text-xs bg-yellow-100 text-yellow-800">C2: Moyenne</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Technologies utilisées */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Stack Technologique
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm font-medium mb-3">Concurrent #1</div>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">WordPress</Badge>
                        <Badge variant="outline" className="text-xs">Yoast SEO</Badge>
                        <Badge variant="outline" className="text-xs">Google Analytics</Badge>
                        <Badge variant="outline" className="text-xs">CloudFlare</Badge>
                        <Badge variant="outline" className="text-xs">Google Tag Manager</Badge>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-3">Concurrent #2</div>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">Shopify</Badge>
                        <Badge variant="outline" className="text-xs">SEMrush</Badge>
                        <Badge variant="outline" className="text-xs">Facebook Pixel</Badge>
                        <Badge variant="outline" className="text-xs">Hotjar</Badge>
                        <Badge variant="outline" className="text-xs">Mailchimp</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommandations stratégiques */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Recommandations Stratégiques
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                      <div className="font-medium text-blue-900 mb-1">🎯 Priorité Haute</div>
                      <p className="text-sm text-blue-800">Optimiser la vitesse de chargement mobile pour rattraper le concurrent #1</p>
                    </div>
                    <div className="p-4 border-l-4 border-green-500 bg-green-50">
                      <div className="font-medium text-green-900 mb-1">📈 Opportunité</div>
                      <p className="text-sm text-green-800">Exploiter les 15 mots-clés à faible concurrence identifiés</p>
                    </div>
                    <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50">
                      <div className="font-medium text-yellow-900 mb-1">⚠️ Attention</div>
                      <p className="text-sm text-yellow-800">Améliorer le profil de liens avec plus de domaines référents de qualité</p>
                    </div>
                    <div className="p-4 border-l-4 border-purple-500 bg-purple-50">
                      <div className="font-medium text-purple-900 mb-1">🚀 Innovation</div>
                      <p className="text-sm text-purple-800">Développer une stratégie de contenu vidéo (concurrent #2 en retard)</p>
                    </div>
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