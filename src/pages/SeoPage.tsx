import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Search, Target, Link, FileText, Globe, Hash, Type, FileSearch, AlertTriangle, CheckCircle, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const SeoPage: React.FC = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const mockAnalysisResult = {
    headings: {
      h1: [
        { text: 'Titre Principal de la Page', id: 'main-title', position: 1 },
        { text: 'Deuxième H1 (Problème SEO)', id: 'second-h1', position: 15 }
      ],
      h2: [
        { text: 'Introduction aux Services', id: 'intro-services', position: 3 },
        { text: 'Nos Solutions Digitales', id: 'solutions', position: 8 },
        { text: 'Pourquoi Nous Choisir', id: 'why-us', position: 12 }
      ],
      h3: [
        { text: 'Développement Web', id: 'dev-web', position: 4 },
        { text: 'Marketing Digital', id: 'marketing', position: 6 },
        { text: 'SEO et Référencement', id: 'seo', position: 9 },
        { text: 'Support Client 24/7', id: 'support', position: 13 }
      ],
      h4: [
        { text: 'React & TypeScript', id: 'react-ts', position: 5 },
        { text: 'WordPress & PHP', id: 'wp-php', position: 7 },
        { text: 'Google Ads', id: 'google-ads', position: 10 },
        { text: 'Analytics & Tracking', id: 'analytics', position: 11 }
      ],
      h5: [
        { text: 'Responsive Design', id: 'responsive', position: 14 }
      ],
      h6: []
    },
    paragraphs: [
      {
        text: 'Nous sommes une agence digitale spécialisée dans la création de sites web modernes et performants. Notre équipe d\'experts vous accompagne dans tous vos projets numériques.',
        position: 2,
        wordCount: 28,
        keywordDensity: { 'agence digitale': 1, 'sites web': 1, 'experts': 1 }
      },
      {
        text: 'Notre approche combine créativité et technique pour livrer des solutions sur mesure qui répondent parfaitement à vos besoins business et marketing.',
        position: 16,
        wordCount: 23,
        keywordDensity: { 'solutions': 1, 'marketing': 1, 'business': 1 }
      },
      {
        text: 'Grâce à notre expertise en développement React, nous créons des applications web rapides et intuitives qui offrent une expérience utilisateur exceptionnelle.',
        position: 17,
        wordCount: 24,
        keywordDensity: { 'React': 1, 'applications web': 1, 'expérience utilisateur': 1 }
      }
    ],
    analysis: {
      h1Count: 2,
      h2Count: 3,
      h3Count: 4,
      h4Count: 4,
      h5Count: 1,
      h6Count: 0,
      totalHeadings: 14,
      hierarchyIssues: [
        { type: 'error', message: 'Plusieurs balises H1 détectées', severity: 'high' },
        { type: 'warning', message: 'Aucune balise H6 utilisée', severity: 'low' }
      ],
      paragraphCount: 3,
      totalWords: 75,
      avgWordsPerParagraph: 25
    },
    recommendations: [
      { type: 'error', title: 'H1 Multiple', description: 'Une seule balise H1 par page est recommandée' },
      { type: 'success', title: 'Structure Cohérente', description: 'La hiérarchie H2-H4 est bien structurée' },
      { type: 'warning', title: 'Contenu Court', description: 'Considérez ajouter plus de contenu textuel' }
    ]
  };

  const seoTools = [
    {
      title: 'Analyse des Mots-clés',
      description: 'Trouvez les meilleurs mots-clés pour votre contenu',
      icon: Search,
      status: 'Disponible',
      route: '/keyword-generator'
    },
    {
      title: 'Suggestions de Mots-clés',
      description: 'Générez des suggestions de mots-clés',
      icon: Target,
      status: 'Disponible',
      route: '/suggestions'
    },
    {
      title: 'Compteur de Mots',
      description: 'Analysez la densité de vos mots-clés',
      icon: FileText,
      status: 'Disponible',
      route: '/wordcount'
    },
    {
      title: 'Hiérarchie du Site',
      description: 'Visualisez la structure de votre site',
      icon: Link,
      status: 'Disponible',
      route: '/hierarchy'
    }
  ];

  const analyzeUrl = async () => {
    if (!url) {
      toast.error('Veuillez entrer une URL valide');
      return;
    }
    
    setIsAnalyzing(true);
    // Simulation d'analyse
    setTimeout(() => {
      setAnalysisResult(mockAnalysisResult);
      setIsAnalyzing(false);
      toast.success('Analyse SEO terminée');
    }, 2500);
  };

  const exportAnalysis = (format: string) => {
    toast.success(`Rapport ${format.toUpperCase()} généré avec succès`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/30 p-6">
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            🚀 Analyse SEO Complète
          </h1>
        </div>

        {/* Formulaire d'analyse URL */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Analyser une URL
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
                onClick={analyzeUrl} 
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
                    <FileSearch className="h-4 w-4" />
                    Analyser SEO
                  </div>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {analysisResult && (
          <Tabs defaultValue="headings" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="headings" className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Titres (H1-H6)
              </TabsTrigger>
              <TabsTrigger value="paragraphs" className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                Paragraphes
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex items-center gap-2">
                <FileSearch className="h-4 w-4" />
                Analyse
              </TabsTrigger>
              <TabsTrigger value="recommendations" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Recommandations
              </TabsTrigger>
            </TabsList>

            {/* Onglet Titres */}
            <TabsContent value="headings" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Structure des Titres</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => exportAnalysis('json')}>
                    <Download className="h-4 w-4 mr-1" />
                    JSON
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => exportAnalysis('csv')}>
                    <Download className="h-4 w-4 mr-1" />
                    CSV
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {Object.entries(analysisResult.headings).map(([level, headings]: [string, any[]]) => (
                    <Card key={level}>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <Hash className="h-4 w-4" />
                            {level.toUpperCase()} ({headings.length})
                          </span>
                          <Badge variant={
                            level === 'h1' && headings.length > 1 ? 'destructive' :
                            headings.length === 0 ? 'secondary' : 'default'
                          }>
                            {headings.length === 0 ? 'Aucun' :
                             level === 'h1' && headings.length > 1 ? 'Problème' : 'OK'}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {headings.length === 0 ? (
                            <p className="text-muted-foreground text-sm">Aucune balise {level.toUpperCase()} trouvée</p>
                          ) : (
                            headings.map((heading, index) => (
                              <div key={index} className="p-3 border rounded-lg">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1">
                                    <p className="font-medium text-sm">{heading.text}</p>
                                    {heading.id && (
                                      <p className="text-xs text-muted-foreground mt-1">ID: {heading.id}</p>
                                    )}
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    Pos. {heading.position}
                                  </Badge>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Résumé des Titres</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">{analysisResult.analysis.h1Count}</p>
                          <p className="text-sm text-blue-600">H1</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">{analysisResult.analysis.h2Count}</p>
                          <p className="text-sm text-green-600">H2</p>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                          <p className="text-2xl font-bold text-yellow-600">{analysisResult.analysis.h3Count}</p>
                          <p className="text-sm text-yellow-600">H3</p>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <p className="text-2xl font-bold text-purple-600">{analysisResult.analysis.h4Count}</p>
                          <p className="text-sm text-purple-600">H4</p>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <div className="flex justify-between text-sm">
                          <span>Total des titres:</span>
                          <span className="font-semibold">{analysisResult.analysis.totalHeadings}</span>
                        </div>
                      </div>

                      {analysisResult.analysis.hierarchyIssues.length > 0 && (
                        <div className="pt-4 border-t">
                          <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                            Problèmes Détectés
                          </h4>
                          <div className="space-y-2">
                            {analysisResult.analysis.hierarchyIssues.map((issue: any, index: number) => (
                              <div key={index} className={`p-2 rounded text-xs ${
                                issue.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'
                              }`}>
                                {issue.message}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Onglet Paragraphes */}
            <TabsContent value="paragraphs" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Analyse des Paragraphes</h2>
                <Badge variant="secondary">
                  {analysisResult.paragraphs.length} paragraphes trouvés
                </Badge>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  {analysisResult.paragraphs.map((paragraph: any, index: number) => (
                    <Card key={index}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Paragraphe #{index + 1}</CardTitle>
                          <div className="flex gap-2">
                            <Badge variant="outline">Pos. {paragraph.position}</Badge>
                            <Badge variant="secondary">{paragraph.wordCount} mots</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm leading-relaxed mb-4">{paragraph.text}</p>
                        
                        {paragraph.keywordDensity && Object.keys(paragraph.keywordDensity).length > 0 && (
                          <div>
                            <h4 className="font-semibold text-sm mb-2">Mots-clés détectés:</h4>
                            <div className="flex flex-wrap gap-1">
                              {Object.entries(paragraph.keywordDensity).map(([keyword, count]) => (
                                <Badge key={keyword} variant="outline" className="text-xs">
                                  {keyword} ({String(count)})
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Statistiques du Contenu</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{analysisResult.analysis.paragraphCount}</p>
                        <p className="text-sm text-blue-600">Paragraphes</p>
                      </div>
                      
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{analysisResult.analysis.totalWords}</p>
                        <p className="text-sm text-green-600">Mots Total</p>
                      </div>
                      
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">{analysisResult.analysis.avgWordsPerParagraph}</p>
                        <p className="text-sm text-purple-600">Mots/Paragraphe</p>
                      </div>

                      <div className="pt-4 border-t">
                        <h4 className="font-semibold text-sm mb-3">Qualité du Contenu</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Longueur:</span>
                            <Badge variant={analysisResult.analysis.totalWords > 100 ? 'default' : 'secondary'}>
                              {analysisResult.analysis.totalWords > 100 ? 'Suffisant' : 'Court'}
                            </Badge>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Lisibilité:</span>
                            <Badge variant="default">Bonne</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Onglet Analyse */}
            <TabsContent value="analysis" className="space-y-6">
              <h2 className="text-2xl font-bold">Analyse SEO Globale</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6 text-center">
                    <Hash className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <p className="text-2xl font-bold">{analysisResult.analysis.totalHeadings}</p>
                    <p className="text-sm text-muted-foreground">Titres Total</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <Type className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <p className="text-2xl font-bold">{analysisResult.analysis.paragraphCount}</p>
                    <p className="text-sm text-muted-foreground">Paragraphes</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                    <p className="text-2xl font-bold">{analysisResult.analysis.totalWords}</p>
                    <p className="text-sm text-muted-foreground">Mots Total</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                    <p className="text-2xl font-bold">
                      {analysisResult.analysis.hierarchyIssues.filter((i: any) => i.type === 'error').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Erreurs</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Onglet Recommandations */}
            <TabsContent value="recommendations" className="space-y-6">
              <h2 className="text-2xl font-bold">Recommandations SEO</h2>
              
              <div className="space-y-4">
                {analysisResult.recommendations.map((rec: any, index: number) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {rec.type === 'success' && <CheckCircle className="h-6 w-6 text-green-500 mt-1" />}
                        {rec.type === 'warning' && <AlertTriangle className="h-6 w-6 text-yellow-500 mt-1" />}
                        {rec.type === 'error' && <AlertTriangle className="h-6 w-6 text-red-500 mt-1" />}
                        <div>
                          <h3 className="font-semibold text-lg">{rec.title}</h3>
                          <p className="text-muted-foreground mt-1">{rec.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Outils SEO existants */}
        {!analysisResult && (
          <>
            <h2 className="text-2xl font-bold mb-6">Outils SEO Disponibles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {seoTools.map((tool) => (
                <Card key={tool.title} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                        <tool.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="group-hover:text-primary transition-colors">
                          {tool.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {tool.description}
                        </p>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs ${
                        tool.status === 'Disponible' ? 'bg-green-100 text-green-800' :
                        tool.status === 'En cours' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {tool.status}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full"
                      variant="outline"
                      disabled={tool.status !== 'Disponible'}
                      onClick={() => tool.route && navigate(tool.route)}
                    >
                      {tool.status === 'Disponible' ? 'Utiliser' : 'Bientôt disponible'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {!analysisResult && (
          <Card className="mt-8">
            <CardContent className="p-12 text-center">
              <FileSearch className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Analysez votre contenu SEO</h3>
              <p className="text-muted-foreground">Entrez une URL pour analyser les titres H1-H6 et les paragraphes</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SeoPage;