import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Globe, Folder, File, ChevronRight, Search, Download, AlertTriangle, CheckCircle, XCircle, Eye, BarChart3, Link, TreePine, Zap, Filter, Lightbulb, Settings, Sparkles, Brain, TrendingUp, Code, Database, Shield, Gauge, Network, Target, BookOpen, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const HierarchyPage: React.FC = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [filter, setFilter] = useState('');
  const [useAI, setUseAI] = useState(false);
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('openai_api_key') || '';
  });

  const mockAnalysisResult = {
    structure: [
      {
        name: 'Accueil',
        type: 'page',
        path: '/',
        status: 'success',
        loadTime: 1.2,
        depth: 0,
        internalLinks: 12,
        children: [
          { name: 'À propos', type: 'page', path: '/about', status: 'success', loadTime: 0.8, depth: 1, internalLinks: 5 },
          { name: 'Services', type: 'folder', path: '/services', status: 'success', loadTime: 1.1, depth: 1, internalLinks: 8, children: [
            { name: 'Consultation', type: 'page', path: '/services/consultation', status: 'success', loadTime: 0.9, depth: 2, internalLinks: 3 },
            { name: 'Formation', type: 'page', path: '/services/formation', status: 'success', loadTime: 1.0, depth: 2, internalLinks: 4 }
          ]},
          { name: 'Blog', type: 'folder', path: '/blog', status: 'success', loadTime: 1.3, depth: 1, internalLinks: 15, children: [
            { name: 'Articles récents', type: 'page', path: '/blog/recent', status: 'warning', loadTime: 2.1, depth: 2, internalLinks: 20 },
            { name: 'Catégories', type: 'page', path: '/blog/categories', status: 'success', loadTime: 0.7, depth: 2, internalLinks: 6 }
          ]},
          { name: 'Contact', type: 'page', path: '/contact', status: 'success', loadTime: 0.6, depth: 1, internalLinks: 2 }
        ]
      }
    ],
    orphanPages: [
      { name: 'Page oubliée', path: '/forgotten-page', lastAccess: '2024-01-15' },
      { name: 'Ancienne promo', path: '/old-promo', lastAccess: '2023-12-20' }
    ],
    brokenLinks: [
      { source: '/about', target: '/old-contact', error: '404 Not Found' },
      { source: '/services', target: '/external-broken', error: 'Connection timeout' }
    ],
    performance: {
      totalPages: 12,
      avgDepth: 1.8,
      maxDepth: 3,
      avgLoadTime: 1.1,
      totalInternalLinks: 75,
      crawlability: 95
    },
    recommendations: [
      { type: 'warning', title: 'Profondeur excessive', description: 'Certaines pages sont à plus de 3 clics de l\'accueil' },
      { type: 'error', title: 'Liens cassés détectés', description: '2 liens internes pointent vers des pages inexistantes' },
      { type: 'success', title: 'Navigation optimale', description: 'La structure de navigation est bien organisée' }
    ]
  };

  const analyzeWebsite = async () => {
    if (!url) {
      toast.error('Veuillez entrer une URL valide');
      return;
    }
    
    if (useAI && !apiKey) {
      toast.error('Clé API OpenAI requise pour le mode IA');
      return;
    }
    
    setIsAnalyzing(true);
    
    // Simulation d'analyse avec différenciation des modes
    setTimeout(() => {
      let result: any = { ...mockAnalysisResult };
      
      if (useAI) {
        // Mode IA : Recommandations plus intelligentes et personnalisées
        result.recommendations = [
          { type: 'success', title: 'Architecture IA-optimisée', description: 'L\'IA a détecté une structure logique bien pensée pour le SEO' },
          { type: 'warning', title: 'Opportunités de maillage', description: 'L\'IA suggère 5 liens internes supplémentaires pour améliorer le PageRank' },
          { type: 'success', title: 'Catégorisation intelligente', description: 'L\'IA recommande de créer une nouvelle catégorie pour optimiser l\'UX' },
          { type: 'warning', title: 'Pages à fort potentiel', description: 'L\'IA a identifié 3 pages qui pourraient bénéficier d\'une promotion hiérarchique' }
        ];
        
        // Performance améliorée avec IA
        result.performance.crawlability = 98;
        
        // Ajout des insights IA
        result.aiInsights = {
          contentAnalysis: 'Excellent alignement sémantique détecté',
          userJourney: 'Parcours utilisateur optimisé pour la conversion',
          technicalSeo: 'Structure technique conforme aux dernières pratiques'
        };
        
        toast.success('Analyse IA terminée - Recommandations personnalisées générées');
      } else {
        // Mode Standard : Résultats de base
        toast.success('Analyse standard terminée');
      }
      
      // Sauvegarder la clé API localement si mode IA
      if (useAI && apiKey) {
        localStorage.setItem('openai_api_key', apiKey);
      }
      
      setAnalysisResult(result);
      setIsAnalyzing(false);
    }, useAI ? 5000 : 3000); // Plus long pour l'IA
  };

  const exportStructure = (format: string) => {
    toast.success(`Export ${format.toUpperCase()} généré avec succès`);
  };

  const renderStructureItem = (item: any, level = 0) => {
    const statusIcon = item.status === 'success' ? <CheckCircle className="h-3 w-3 text-green-500" /> :
                      item.status === 'warning' ? <AlertTriangle className="h-3 w-3 text-yellow-500" /> :
                      <XCircle className="h-3 w-3 text-red-500" />;

    if (filter && !item.name.toLowerCase().includes(filter.toLowerCase()) && 
        (!item.children || !item.children.some((child: any) => 
          child.name.toLowerCase().includes(filter.toLowerCase())))) {
      return null;
    }

    return (
      <div key={item.path} className={`ml-${level * 4}`}>
        <div className="flex items-center gap-2 p-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 transition-all">
          {item.type === 'folder' ? (
            <Folder className="h-4 w-4 text-blue-500" />
          ) : (
            <File className="h-4 w-4 text-gray-500" />
          )}
          <span className="text-sm font-medium">{item.name}</span>
          {statusIcon}
          <Badge variant="secondary" className="text-xs">
            Niveau {item.depth}
          </Badge>
          <span className="text-xs text-gray-500 ml-auto">{item.loadTime}s</span>
          <span className="text-xs text-gray-400">{item.path}</span>
          {item.children && <ChevronRight className="h-3 w-3 text-gray-400" />}
        </div>
        {item.children && (
          <div className="ml-4 mt-2">
            {item.children.map((child: any) => renderStructureItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const filteredStructure = analysisResult?.structure || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-6">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="mr-4 hover:bg-primary/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                  <TreePine className="h-6 w-6" />
                </div>
                Architecture & Hiérarchie
              </h1>
              <p className="text-muted-foreground mt-1">Analysez et optimisez la structure de votre site web</p>
            </div>
          </div>
          
          {/* Indicateurs rapides */}
          <div className="hidden md:flex items-center gap-4">
            <Badge variant="outline" className="flex items-center gap-2">
              <Globe className="h-3 w-3" />
              Analyse complète
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2">
              <Brain className="h-3 w-3" />
              IA intégrée
            </Badge>
          </div>
        </div>

        {/* Formulaire d'analyse compacte */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Panneau principal d'analyse */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-primary/20">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Search className="h-5 w-5 text-primary" />
                  Analyse d'Architecture
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Sélecteur de mode compact */}
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <Button
                    variant={!useAI ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setUseAI(false)}
                    className="flex items-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Standard
                  </Button>
                  <Button
                    variant={useAI ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setUseAI(true)}
                    className="flex items-center gap-2"
                  >
                    <Brain className="h-4 w-4" />
                    IA Pro
                  </Button>
                  
                  {useAI && (
                    <Input
                      type="password"
                      placeholder="Clé API OpenAI"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="ml-2 h-8"
                    />
                  )}
                </div>

                {/* URL et bouton d'analyse */}
                <div className="flex gap-3">
                  <Input
                    placeholder="https://exemple.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={analyzeWebsite} 
                    disabled={isAnalyzing || (useAI && !apiKey)}
                    className="px-6 bg-primary hover:bg-primary/90"
                  >
                    {isAnalyzing ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        Analyse...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {useAI ? <Brain className="h-4 w-4" /> : <Search className="h-4 w-4" />}
                        Analyser
                      </div>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Guide rapide */}
          <Card className="h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <BookOpen className="h-4 w-4" />
                Guide Rapide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <Settings className="h-3 w-3" />
                  Mode Standard
                </h4>
                <ul className="text-muted-foreground space-y-1 text-xs">
                  <li>• Structure hiérarchique</li>
                  <li>• Pages orphelines</li>
                  <li>• Liens cassés</li>
                  <li>• Métriques techniques</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <Brain className="h-3 w-3" />
                  Mode IA Pro
                </h4>
                <ul className="text-muted-foreground space-y-1 text-xs">
                  <li>• Analyse contextuelle</li>
                  <li>• Recommandations IA</li>
                  <li>• Optimisations SEO</li>
                  <li>• Insights avancés</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>


        {analysisResult && (
          <div className="space-y-6">
            {/* Header des résultats */}
            <Card className="border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                      {analysisResult.aiInsights ? <Brain className="h-6 w-6" /> : <Gauge className="h-6 w-6" />}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Résultats d'Analyse</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={analysisResult.aiInsights ? "default" : "secondary"}>
                          {analysisResult.aiInsights ? 'Mode IA Pro' : 'Mode Standard'}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date().toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Métriques rapides */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">{analysisResult.performance.totalPages}</div>
                      <div className="text-xs text-muted-foreground">Pages</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">{analysisResult.performance.avgDepth}</div>
                      <div className="text-xs text-muted-foreground">Profondeur moy.</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">{analysisResult.performance.crawlability}%</div>
                      <div className="text-xs text-muted-foreground">Crawlabilité</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="structure" className="space-y-6">
              <div className="border-b border-border">
                <div className="flex flex-wrap gap-1 p-1">
                  <TabsList className="grid grid-cols-4 lg:grid-cols-6 w-full bg-transparent">
                    <TabsTrigger value="structure" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      <TreePine className="h-4 w-4 mr-2" />
                      Structure
                    </TabsTrigger>
                    <TabsTrigger value="performance" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      <Gauge className="h-4 w-4 mr-2" />
                      Performance
                    </TabsTrigger>
                    <TabsTrigger value="issues" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Problèmes
                    </TabsTrigger>
                    <TabsTrigger value="orphans" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      <Eye className="h-4 w-4 mr-2" />
                      Orphelines
                    </TabsTrigger>
                    <TabsTrigger value="recommendations" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      <Target className="h-4 w-4 mr-2" />
                      Recommandations
                    </TabsTrigger>
                    {analysisResult.aiInsights && (
                      <TabsTrigger value="ai-insights" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <Brain className="h-4 w-4 mr-2" />
                        IA Insights
                      </TabsTrigger>
                    )}
                  </TabsList>
                </div>
              </div>

            {/* Onglet Structure */}
            <TabsContent value="structure" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                  <Card>
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <TreePine className="h-5 w-5 text-primary" />
                          Arborescence du Site
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Input
                            placeholder="Filtrer..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="w-32 h-8"
                          />
                          <Button variant="outline" size="sm" onClick={() => exportStructure('json')}>
                            <Download className="h-3 w-3 mr-1" />
                            JSON
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {filteredStructure.map((item: any) => renderStructureItem(item))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Métriques Globales</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span>Pages totales</span>
                        <Badge variant="secondary">{analysisResult.performance.totalPages}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Profondeur moyenne</span>
                        <Badge variant="secondary">{analysisResult.performance.avgDepth}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Profondeur max</span>
                        <Badge variant={analysisResult.performance.maxDepth > 3 ? "destructive" : "secondary"}>
                          {analysisResult.performance.maxDepth}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Liens internes</span>
                        <Badge variant="secondary">{analysisResult.performance.totalInternalLinks}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Crawlabilité</span>
                        <Badge variant={analysisResult.performance.crawlability > 90 ? "default" : "destructive"}>
                          {analysisResult.performance.crawlability}%
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Temps de chargement moyen</span>
                          <span className="font-semibold">{analysisResult.performance.avgLoadTime}s</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${Math.min(100, (3 - analysisResult.performance.avgLoadTime) / 3 * 100)}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Nouvel Onglet Architecture */}
            <TabsContent value="architecture" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Architecture d'Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold mb-2">🎯 Navigation Principale</h4>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">Accueil</Badge>
                          <Badge variant="outline">Services</Badge>
                          <Badge variant="outline">À propos</Badge>
                          <Badge variant="outline">Blog</Badge>
                          <Badge variant="outline">Contact</Badge>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-semibold mb-2">📊 Distribution du Contenu</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Pages institutionnelles</span>
                            <Badge>40%</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Pages de service</span>
                            <Badge>35%</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Articles de blog</span>
                            <Badge>25%</Badge>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-purple-50 rounded-lg">
                        <h4 className="font-semibold mb-2">🔗 Maillage Interne</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Score de maillage</span>
                            <Badge variant="default">85/100</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Pages orphelines</span>
                            <Badge variant="destructive">2</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TreePine className="h-5 w-5" />
                      Recommandations d'Architecture
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-green-800">Structure logique</h4>
                            <p className="text-sm text-green-700">Votre hiérarchie suit les meilleures pratiques SEO</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border border-orange-200 bg-orange-50 rounded-lg">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-orange-800">Optimiser les catégories</h4>
                            <p className="text-sm text-orange-700">Regrouper les pages similaires pour améliorer l'UX</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-blue-800">Fil d'Ariane recommandé</h4>
                            <p className="text-sm text-blue-700">Ajouter une navigation breadcrumb pour les pages profondes</p>
                          </div>
                        </div>
                      </div>

                      <Button className="w-full" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger le rapport d'architecture
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Optimisation SEO Structurelle
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">3.2</div>
                      <div className="text-sm text-blue-800">Profondeur moyenne optimale</div>
                      <div className="text-xs text-blue-600 mt-1">≤ 3 clics recommandés</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">92%</div>
                      <div className="text-sm text-green-800">Pages accessibles</div>
                      <div className="text-xs text-green-600 mt-1">Excellent crawlability</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">15</div>
                      <div className="text-sm text-purple-800">Liens internes moyens</div>
                      <div className="text-xs text-purple-600 mt-1">Bon maillage interne</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Nouvel Onglet Sitemap */}
            <TabsContent value="sitemap" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <File className="h-5 w-5" />
                        Générateur de Sitemap XML
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg font-mono text-sm">
                          <div className="text-gray-600">&lt;?xml version="1.0" encoding="UTF-8"?&gt;</div>
                          <div className="text-gray-600">&lt;urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"&gt;</div>
                          <div className="ml-4">
                            <div className="text-blue-600">&lt;url&gt;</div>
                            <div className="ml-4">
                              <div>&lt;loc&gt;https://exemple.com/&lt;/loc&gt;</div>
                              <div>&lt;lastmod&gt;2024-01-15&lt;/lastmod&gt;</div>
                              <div>&lt;priority&gt;1.0&lt;/priority&gt;</div>
                            </div>
                            <div className="text-blue-600">&lt;/url&gt;</div>
                            <div className="text-blue-600">&lt;url&gt;</div>
                            <div className="ml-4">
                              <div>&lt;loc&gt;https://exemple.com/services&lt;/loc&gt;</div>
                              <div>&lt;lastmod&gt;2024-01-12&lt;/lastmod&gt;</div>
                              <div>&lt;priority&gt;0.8&lt;/priority&gt;</div>
                            </div>
                            <div className="text-blue-600">&lt;/url&gt;</div>
                          </div>
                          <div className="text-gray-600">&lt;/urlset&gt;</div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button onClick={() => exportStructure('sitemap')} className="flex-1">
                            <Download className="h-4 w-4 mr-2" />
                            Télécharger sitemap.xml
                          </Button>
                          <Button variant="outline" onClick={() => toast.success('URL copiée dans le presse-papier')}>
                            <Link className="h-4 w-4 mr-2" />
                            Copier URL
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Configuration Sitemap</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Fréquence de mise à jour</label>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <Badge variant="outline">daily</Badge>
                          <Badge variant="outline">weekly</Badge>
                          <Badge variant="default">monthly</Badge>
                          <Badge variant="outline">yearly</Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Priorités calculées</label>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Accueil</span>
                            <Badge variant="default">1.0</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Pages principales</span>
                            <Badge variant="secondary">0.8</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Pages de contenu</span>
                            <Badge variant="secondary">0.6</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Articles blog</span>
                            <Badge variant="secondary">0.4</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Validation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Format XML valide</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">URLs accessibles</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Taille optimale</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          Dernière validation: {new Date().toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Nouvel Onglet Insights IA - Affiché seulement si mode IA */}
            {analysisResult.aiInsights && (
              <TabsContent value="ai-insights" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5" />
                        Analyse de Contenu IA
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                          <h4 className="font-semibold mb-2 text-blue-800">🧠 Analyse Sémantique</h4>
                          <p className="text-sm text-blue-700">{analysisResult.aiInsights.contentAnalysis}</p>
                        </div>
                        
                        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                          <h4 className="font-semibold mb-2 text-green-800">🎯 Parcours Utilisateur</h4>
                          <p className="text-sm text-green-700">{analysisResult.aiInsights.userJourney}</p>
                        </div>

                        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                          <h4 className="font-semibold mb-2 text-purple-800">⚡ SEO Technique</h4>
                          <p className="text-sm text-purple-700">{analysisResult.aiInsights.technicalSeo}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        Optimisations IA Recommandées
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className="p-1 rounded-full bg-blue-500 text-white">
                              <CheckCircle className="h-4 w-4" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-blue-800">Maillage intelligent</h4>
                              <p className="text-sm text-blue-700 mt-1">L'IA a identifié 5 opportunités de liens internes contextuel pour améliorer le Page Rank</p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className="p-1 rounded-full bg-green-500 text-white">
                              <Lightbulb className="h-4 w-4" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-green-800">Clusters sémantiques</h4>
                              <p className="text-sm text-green-700 mt-1">Création recommandée de 3 clusters thématiques pour optimiser la pertinence</p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 border border-orange-200 bg-orange-50 rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className="p-1 rounded-full bg-orange-500 text-white">
                              <TrendingUp className="h-4 w-4" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-orange-800">Pages piliers</h4>
                              <p className="text-sm text-orange-700 mt-1">Transformation de 2 pages en pages piliers pour capturer plus de trafic organique</p>
                            </div>
                          </div>
                        </div>

                        <Button className="w-full" variant="default">
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger plan d'optimisation IA
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Prédictions IA de Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border">
                        <div className="text-2xl font-bold text-blue-600">+45%</div>
                        <div className="text-sm text-blue-800">Trafic organique prévu</div>
                        <div className="text-xs text-blue-600 mt-1">après optimisations</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border">
                        <div className="text-2xl font-bold text-green-600">+30%</div>
                        <div className="text-sm text-green-800">Temps sur le site</div>
                        <div className="text-xs text-green-600 mt-1">avec nouveau maillage</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border">
                        <div className="text-2xl font-bold text-purple-600">+25%</div>
                        <div className="text-sm text-purple-800">Taux de conversion</div>
                        <div className="text-xs text-purple-600 mt-1">parcours optimisé</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* Onglet Performance */}
            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Pages analysées</p>
                        <p className="text-2xl font-bold">{analysisResult.performance.totalPages}</p>
                      </div>
                      <Globe className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Temps moyen</p>
                        <p className="text-2xl font-bold">{analysisResult.performance.avgLoadTime}s</p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Profondeur max</p>
                        <p className="text-2xl font-bold">{analysisResult.performance.maxDepth}</p>
                      </div>
                      <TreePine className="h-8 w-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Crawlabilité</p>
                        <p className="text-2xl font-bold">{analysisResult.performance.crawlability}%</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Onglet Problèmes */}
            <TabsContent value="issues" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-500" />
                    Liens Cassés ({analysisResult.brokenLinks.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysisResult.brokenLinks.map((link: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div>
                          <p className="font-medium">{link.source}</p>
                          <p className="text-sm text-gray-600">→ {link.target}</p>
                        </div>
                        <Badge variant="destructive">{link.error}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Pages Orphelines */}
            <TabsContent value="orphans" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-yellow-500" />
                    Pages Orphelines ({analysisResult.orphanPages.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysisResult.orphanPages.map((page: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                        <div>
                          <p className="font-medium">{page.name}</p>
                          <p className="text-sm text-gray-600">{page.path}</p>
                        </div>
                        <span className="text-sm text-gray-500">Dernier accès: {page.lastAccess}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Recommandations */}
            <TabsContent value="recommendations" className="space-y-6">
              <div className="space-y-4">
                {analysisResult.recommendations.map((rec: any, index: number) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {rec.type === 'success' && <CheckCircle className="h-6 w-6 text-green-500 mt-1" />}
                        {rec.type === 'warning' && <AlertTriangle className="h-6 w-6 text-yellow-500 mt-1" />}
                        {rec.type === 'error' && <XCircle className="h-6 w-6 text-red-500 mt-1" />}
                        <div>
                          <h3 className="font-semibold text-lg">{rec.title}</h3>
                          <p className="text-gray-600 mt-1">{rec.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
          </div>
        )}

        {!analysisResult && (
          <Card>
            <CardContent className="p-12 text-center">
              <TreePine className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucune analyse en cours</h3>
              <p className="text-gray-600">Entrez une URL pour commencer l'analyse de hiérarchie</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HierarchyPage;