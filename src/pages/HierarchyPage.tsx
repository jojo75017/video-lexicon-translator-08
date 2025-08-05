import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Globe, Folder, File, ChevronRight, Search, Download, AlertTriangle, CheckCircle, XCircle, Eye, BarChart3, Link, TreePine, Zap, Filter, Lightbulb } from 'lucide-react';
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
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="structure" className="flex items-center gap-2">
                <TreePine className="h-4 w-4" />
                Structure
              </TabsTrigger>
              <TabsTrigger value="architecture" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Architecture
              </TabsTrigger>
              <TabsTrigger value="sitemap" className="flex items-center gap-2">
                <File className="h-4 w-4" />
                Sitemap
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