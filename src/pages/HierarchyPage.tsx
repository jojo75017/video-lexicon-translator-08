import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Globe, Folder, File, ChevronRight, Search, Download, AlertTriangle, CheckCircle, XCircle, Eye, BarChart3, Link, TreePine, Zap, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const HierarchyPage: React.FC = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [filter, setFilter] = useState('');

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
    
    setIsAnalyzing(true);
    // Simulation d'analyse
    setTimeout(() => {
      setAnalysisResult(mockAnalysisResult);
      setIsAnalyzing(false);
      toast.success('Analyse terminée avec succès');
    }, 3000);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-red-50/30 p-6">
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            🌐 Analyse de Hiérarchie
          </h1>
        </div>

        {/* Formulaire d'analyse */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Analyser un site web
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="https://exemple.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={analyzeWebsite} 
                disabled={isAnalyzing}
                className="px-6"
              >
                {isAnalyzing ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Analyse...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Analyser
                  </div>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {analysisResult && (
          <Tabs defaultValue="structure" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="structure" className="flex items-center gap-2">
                <TreePine className="h-4 w-4" />
                Structure
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Performance
              </TabsTrigger>
              <TabsTrigger value="issues" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Problèmes
              </TabsTrigger>
              <TabsTrigger value="orphans" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Pages Orphelines
              </TabsTrigger>
              <TabsTrigger value="recommendations" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Recommandations
              </TabsTrigger>
            </TabsList>

            {/* Onglet Structure */}
            <TabsContent value="structure" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <TreePine className="h-5 w-5" />
                          Arborescence du Site
                        </CardTitle>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Filtrer..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="w-40"
                          />
                          <Button variant="outline" size="sm" onClick={() => exportStructure('json')}>
                            <Download className="h-4 w-4 mr-1" />
                            JSON
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => exportStructure('xml')}>
                            <Download className="h-4 w-4 mr-1" />
                            XML
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