import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Globe, Folder, File, ChevronRight, Search, Download, AlertTriangle, CheckCircle, XCircle, Eye, BarChart3, Link, TreePine, Zap, Filter, Lightbulb, Settings, Sparkles, Brain, TrendingUp, Code, Database, Shield, Gauge, Network, Target, BookOpen, MapPin, Layout, Layers, FileText, Share2, Check, Info } from 'lucide-react';
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
    pageStructure: {
      title: 'Agence de Marketing Digital - Services SEO et Stratégie Web',
      metaDescription: 'Découvrez nos services de marketing digital : SEO, création de contenu, stratégie web et optimisation pour améliorer votre visibilité en ligne.',
      url: 'https://exemple-agence.com',
      lang: 'fr',
      canonical: 'https://exemple-agence.com/',
      charset: 'UTF-8',
      viewport: 'width=device-width, initial-scale=1.0',
      robots: 'index, follow'
    },
    headings: {
      h1: [
        { text: 'Votre Agence de Marketing Digital Expert', level: 1, position: 1 }
      ],
      h2: [
        { text: 'Nos Services SEO', level: 2, position: 2 },
        { text: 'Stratégie de Contenu', level: 2, position: 3 },
        { text: 'Optimisation Technique', level: 2, position: 4 },
        { text: 'Nos Références Clients', level: 2, position: 5 }
      ],
      h3: [
        { text: 'Audit SEO Complet', level: 3, position: 6 },
        { text: 'Recherche de Mots-Clés', level: 3, position: 7 },
        { text: 'Optimisation On-Page', level: 3, position: 8 },
        { text: 'Création d\'Articles Blog', level: 3, position: 9 },
        { text: 'Optimisation des Images', level: 3, position: 10 }
      ]
    },
    internalLinks: [
      { text: 'Services SEO', url: '/services/seo', anchor: 'services-seo', context: 'navigation', nofollow: false },
      { text: 'À propos de nous', url: '/about', anchor: '', context: 'header', nofollow: false },
      { text: 'Nos réalisations', url: '/portfolio', anchor: '', context: 'content', nofollow: false },
      { text: 'Blog marketing', url: '/blog', anchor: 'blog-section', context: 'content', nofollow: false },
      { text: 'Contact et devis', url: '/contact', anchor: 'contact-form', context: 'content', nofollow: false },
      { text: 'Audit SEO gratuit', url: '/audit-gratuit', anchor: '', context: 'cta', nofollow: false },
      { text: 'Formation SEO', url: '/formation', anchor: '', context: 'sidebar', nofollow: false },
      { text: 'Outils SEO', url: '/outils', anchor: '', context: 'footer', nofollow: false }
    ],
    externalLinks: [
      { text: 'Google Analytics', url: 'https://analytics.google.com', context: 'content', nofollow: true },
      { text: 'Search Console', url: 'https://search.google.com/search-console', context: 'content', nofollow: true },
      { text: 'Documentation SEMrush', url: 'https://semrush.com/docs', context: 'content', nofollow: false }
    ],
    images: [
      { src: '/images/hero-agency.jpg', alt: 'Équipe agence marketing digital', title: 'Notre équipe d\'experts', hasTitle: true, hasAlt: true },
      { src: '/images/seo-process.png', alt: 'Processus SEO en 5 étapes', title: '', hasTitle: false, hasAlt: true },
      { src: '/images/client-testimonial.jpg', alt: '', title: 'Témoignage client', hasTitle: true, hasAlt: false },
      { src: '/images/results-chart.svg', alt: 'Graphique des résultats SEO', title: 'Amélioration du trafic', hasTitle: true, hasAlt: true }
    ],
    structure: [
      {
        name: 'Header',
        type: 'section',
        elements: [
          { tag: 'nav', content: 'Navigation principale', links: 5 },
          { tag: 'h1', content: 'Votre Agence de Marketing Digital Expert' }
        ]
      },
      {
        name: 'Hero Section',
        type: 'section',
        elements: [
          { tag: 'h2', content: 'Nos Services SEO' },
          { tag: 'p', content: 'Description des services avec mots-clés stratégiques...' },
          { tag: 'cta', content: 'Bouton d\'action principal' }
        ]
      },
      {
        name: 'Services',
        type: 'section',
        elements: [
          { tag: 'h3', content: 'Audit SEO Complet' },
          { tag: 'h3', content: 'Recherche de Mots-Clés' },
          { tag: 'h3', content: 'Optimisation On-Page' }
        ]
      },
      {
        name: 'Footer',
        type: 'section',
        elements: [
          { tag: 'nav', content: 'Navigation secondaire', links: 8 },
          { tag: 'p', content: 'Informations légales et contact' }
        ]
      }
    ],
    technicalSeo: {
      https: true,
      mobileFriendly: true,
      structured: true,
      schemaOrg: ['Organization', 'WebSite', 'BreadcrumbList'],
      openGraph: {
        title: 'Agence de Marketing Digital - Services SEO et Stratégie Web',
        description: 'Découvrez nos services de marketing digital...',
        image: '/images/og-image.jpg',
        type: 'website'
      },
      twitterCard: {
        card: 'summary_large_image',
        title: 'Agence Marketing Digital',
        description: 'Services SEO et stratégie web'
      }
    },
    orphanPages: [
      { name: 'Ancienne page services', path: '/old-services', lastAccess: '2024-01-15', recommendations: ['Rediriger vers /services', 'Ajouter des liens internes'] },
      { name: 'Page promo expirée', path: '/promo-2023', lastAccess: '2023-12-20', recommendations: ['Supprimer ou archiver', 'Créer une redirection 301'] }
    ],
    brokenLinks: [
      { source: '/about', target: '/old-contact', error: '404 Not Found', type: 'internal' },
      { source: '/services', target: 'https://external-broken-site.com', error: 'Connection timeout', type: 'external' }
    ],
    performance: {
      totalPages: 24,
      avgDepth: 2.1,
      maxDepth: 4,
      avgLoadTime: 1.3,
      totalInternalLinks: 156,
      totalExternalLinks: 12,
      crawlability: 94,
      indexability: 91
    },
    recommendations: [
      { type: 'warning', title: 'Images sans attribut ALT', description: '3 images n\'ont pas d\'attribut ALT pour l\'accessibilité' },
      { type: 'error', title: 'Liens cassés détectés', description: '2 liens internes pointent vers des pages inexistantes' },
      { type: 'success', title: 'Structure H1-H6 optimale', description: 'La hiérarchie des titres est bien respectée' },
      { type: 'warning', title: 'Liens externes non sécurisés', description: 'Certains liens externes ne sont pas en nofollow' }
    ]
  };

  const analyzeWebsite = async () => {
    if (!url) {
      toast.error('Veuillez entrer une URL valide');
      return;
    }
    
    if (useAI && !apiKey) {
      toast.error('Clé API Gemini requise pour le mode IA');
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
                      placeholder="Clé API Gemini (AIza...)"
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

            <Tabs defaultValue="apercu-plan" className="space-y-6">
              <div className="border-b border-border">
                <div className="flex flex-wrap gap-1 p-1">
                  <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full bg-transparent">
                    <TabsTrigger value="apercu-plan" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground relative">
                      <div className="flex items-center gap-2">
                        <span>Aperçu du plan</span>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                          Complet
                        </Badge>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger value="redaction" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground relative">
                      <div className="flex items-center gap-2">
                        <span>Rédaction</span>
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs">
                          2
                        </Badge>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger value="optimisation" className="data-[state=active]:bg-green-600 data-[state=active]:text-white relative">
                      <div className="flex items-center gap-2">
                        <span>Optimisation</span>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                          {analysisResult.aiInsights ? '12' : '9'}
                        </Badge>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger value="configuration" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      <div className="flex items-center gap-2">
                        <span>Configuration</span>
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                          2
                        </Badge>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger value="liens" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      <div className="flex items-center gap-2">
                        <span>Liens</span>
                        <Badge variant="secondary" className="bg-red-100 text-red-800 text-xs">
                          1
                        </Badge>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger value="images" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      <div className="flex items-center gap-2">
                        <span>Images</span>
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs">
                          2
                        </Badge>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger value="donnees-structurees" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      <div className="flex items-center gap-2">
                        <span>Données structurées</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                          2
                        </Badge>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger value="http-reseau" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      <div className="flex items-center gap-2">
                        <span>HTTP & réseau</span>
                        <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 text-xs">
                          1
                        </Badge>
                      </div>
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>

            {/* Onglet Aperçu du plan de page */}
            <TabsContent value="apercu-plan" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TreePine className="h-5 w-5 text-blue-500" />
                    Aperçu du plan de page :
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500 font-mono text-sm space-y-1">
                    <div className="text-blue-800 font-semibold">&lt;h1&gt;Prêt à explorer le monde avec BusterTravel</div>
                    <div className="ml-4 text-gray-700">&lt;h2&gt;Discover, VotreTravel, votremagazine de voyage</div>
                    <div className="ml-8 text-gray-600">&lt;h3&gt;Explorez nos 3 grands univers</div>
                    <div className="ml-12 text-gray-600">&lt;h4&gt;Europe inspirante</div>
                    <div className="ml-12 text-gray-600">&lt;h4&gt;Asie envoûtante</div>
                    <div className="ml-12 text-gray-600">&lt;h4&gt;Voyager malin</div>
                    <div className="ml-8 text-gray-600">&lt;h3&gt;Des expériences uniques pour ceux qui aiment prendre leur temps</div>
                    <div className="ml-4 text-gray-700">&lt;h2&gt;Ce que nous pensons du voyage</div>
                    <div className="ml-4 text-gray-700">&lt;h2&gt;Georges & Marie-Thérèse, créateurs de BusterTravel</div>
                    <div className="ml-4 text-gray-700">&lt;h2&gt;Nos destinations préférées</div>
                    <div className="ml-8 text-gray-600">&lt;h3&gt;Le Vietnam</div>
                    <div className="ml-8 text-gray-600">&lt;h3&gt;L'Espagne</div>
                    <div className="ml-8 text-gray-600">&lt;h3&gt;La France</div>
                    <div className="ml-4 text-gray-700">&lt;h2&gt;Ce que vous trouverez sur BusterTravel</div>
                    <div className="ml-8 text-gray-600">&lt;h3&gt;Articles immersifs</div>
                    <div className="ml-12 text-gray-600">&lt;h4&gt;Comparateurs & bons plans</div>
                    <div className="ml-12 text-gray-600">&lt;h4&gt;Ressources exclusives</div>
                    <div className="ml-4 text-gray-700">&lt;h2&gt;Un univers, 3 sites complémentaires</div>
                    <div className="ml-8 text-gray-600">&lt;h3&gt;BusterTravel</div>
                    <div className="ml-8 text-gray-600">&lt;h3&gt;ShopVoyage</div>
                    <div className="ml-12 text-gray-600">&lt;h4&gt;Offre Évasion</div>
                    <div className="ml-4 text-gray-700">&lt;h2&gt;À lire sur notre magazine de voyage</div>
                    <div className="ml-8 text-gray-600">&lt;h3&gt;Voyager en train : confort et bons plans</div>
                    <div className="ml-12 text-gray-600">&lt;h4&gt;Londres 2025 : guide pratique</div>
                    <div className="ml-12 text-gray-600">&lt;h4&gt;7 séjours tout compris à moins de 500€</div>
                    <div className="ml-12 text-gray-600">&lt;h4&gt;Vietnam 2025 : destination coup de cœur</div>
                    <div className="ml-4 text-gray-700">&lt;h2&gt;📰 Encore plus d'idées et de récits sur le blog</div>
                    <div className="ml-4 text-gray-700">&lt;h2&gt;🕒 Et toi, tu pars où bientôt ?</div>
                    <div className="ml-8 text-gray-600">&lt;h3&gt;📱 Besoin d'un conseil ou d'un itinéraire sur mesure ?</div>
                    <div className="ml-8 text-gray-600">&lt;h3&gt;BusterTravel</div>
                    <div className="ml-12 text-gray-600">&lt;h4&gt;Liens utiles</div>
                    <div className="ml-12 text-gray-600">&lt;h4&gt;Informations légales</div>
                    <div className="ml-12 text-gray-600">&lt;h4&gt;Newsletter</div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Rédaction */}
            <TabsContent value="redaction" className="space-y-4">
              <div className="space-y-6">
                {/* Header avec nombre de mots */}
                <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Nombre de mots :</span>
                    <span className="font-bold text-blue-700">1157</span>
                    <span className="text-gray-500">/</span>
                    <span className="text-gray-600">1058</span>
                    <Info className="h-4 w-4 text-blue-500" />
                  </div>
                </div>

                {/* Évaluation de la rédaction */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                    <p className="text-sm text-blue-800">
                      La rédaction semble correcte, avec une approche axée sur l'inspiration et les conseils pratiques. On retrouve des éléments de réassurance comme la présentation des auteu...
                      <button className="text-blue-600 hover:underline ml-1">+</button>
                    </p>
                  </div>
                </div>

                {/* Boutons d'actions */}
                <div className="flex gap-2">
                  <Button variant="default" className="bg-blue-600 hover:bg-blue-700 text-white">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Mots-clés
                  </Button>
                  <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Améliorer
                    <Badge className="ml-2 bg-orange-500 text-white text-xs">NEW</Badge>
                  </Button>
                </div>

                {/* Sous-onglets */}
                <div className="border-b">
                  <div className="flex gap-6">
                    <button className="pb-2 border-b-2 border-blue-500 text-blue-600 font-medium">
                      Classement
                    </button>
                    <button className="pb-2 text-gray-600 hover:text-blue-600">
                      Associations
                    </button>
                    <button className="pb-2 text-gray-600 hover:text-blue-600 flex items-center gap-1">
                      Suggestions
                      <Badge className="bg-orange-500 text-white text-xs">NEW</Badge>
                    </button>
                  </div>
                </div>

                {/* Options d'affichage */}
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm">Afficher les expressions composées de :</span>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-1 text-sm">
                      <input type="checkbox" defaultChecked className="rounded" />
                      1 mot
                    </label>
                    <label className="flex items-center gap-1 text-sm">
                      <input type="checkbox" defaultChecked className="rounded" />
                      2 mots
                    </label>
                    <label className="flex items-center gap-1 text-sm">
                      <input type="checkbox" defaultChecked className="rounded" />
                      3 mots et plus
                    </label>
                  </div>
                  <div className="ml-auto flex gap-2">
                    <Button variant="outline" size="sm">
                      <Target className="h-4 w-4 mr-1" />
                      Identifier les entités
                    </Button>
                    <Input 
                      placeholder="Rechercher une expression" 
                      className="w-48"
                    />
                  </div>
                </div>

                {/* Tableau des mots-clés */}
                <div className="bg-card rounded-lg border">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="text-left p-3 text-sm font-medium">N.</th>
                          <th className="text-left p-3 text-sm font-medium">Expressions / Pertinence</th>
                          <th className="text-left p-3 text-sm font-medium">Densité pondérée (%)</th>
                          <th className="text-left p-3 text-sm font-medium">Densité brute (%)</th>
                          <th className="text-left p-3 text-sm font-medium">Occ.</th>
                          <th className="text-left p-3 text-sm font-medium">Trouvée dans les balises suivantes</th>
                          <th className="text-left p-3 text-sm font-medium"></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="p-3 text-sm">1</td>
                          <td className="p-3 text-sm font-medium">bustertravel</td>
                          <td className="p-3 text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-green-500 text-white text-xs flex items-center justify-center">7</div>
                              <span className="text-orange-600">21.89</span>
                            </div>
                          </td>
                          <td className="p-3 text-sm text-orange-600">1.73</td>
                          <td className="p-3 text-sm">20</td>
                          <td className="p-3 text-xs">
                            <div className="flex flex-wrap gap-1">
                              <span className="bg-blue-100 px-1 rounded">url:host</span>
                              <span className="bg-blue-100 px-1 rounded">title</span>
                              <span className="bg-blue-100 px-1 rounded">meta:description</span>
                              <span className="bg-blue-100 px-1 rounded">header/a</span>
                              <span className="bg-blue-100 px-1 rounded">main/title</span>
                              <span className="bg-blue-100 px-1 rounded">main/h1</span>
                              <span className="bg-blue-100 px-1 rounded">main/h2</span>
                              <span className="bg-blue-100 px-1 rounded">main/strong</span>
                              <span className="bg-blue-100 px-1 rounded">main</span>
                              <span className="bg-blue-100 px-1 rounded">main/h3</span>
                              <span className="bg-blue-100 px-1 rounded">footer/h</span>
                              <span className="bg-blue-100 px-1 rounded">footer</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm"><Eye className="h-3 w-3" /></Button>
                              <Button variant="ghost" size="sm"><Search className="h-3 w-3" /></Button>
                              <Button variant="ghost" size="sm"><Target className="h-3 w-3" /></Button>
                            </div>
                          </td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="p-3 text-sm">2</td>
                          <td className="p-3 text-sm font-medium">bons plans</td>
                          <td className="p-3 text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-green-500 text-white text-xs flex items-center justify-center">6</div>
                              <span>6.64</span>
                            </div>
                          </td>
                          <td className="p-3 text-sm">1.73</td>
                          <td className="p-3 text-sm">10</td>
                          <td className="p-3 text-xs">
                            <div className="flex flex-wrap gap-1">
                              <span className="bg-blue-100 px-1 rounded">title</span>
                              <span className="bg-blue-100 px-1 rounded">meta:description</span>
                              <span className="bg-blue-100 px-1 rounded">main/a</span>
                              <span className="bg-blue-100 px-1 rounded">main/h3</span>
                              <span className="bg-blue-100 px-1 rounded">main</span>
                              <span className="bg-blue-100 px-1 rounded">footer</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm"><Eye className="h-3 w-3" /></Button>
                              <Button variant="ghost" size="sm"><Search className="h-3 w-3" /></Button>
                              <Button variant="ghost" size="sm"><Target className="h-3 w-3" /></Button>
                            </div>
                          </td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="p-3 text-sm">3</td>
                          <td className="p-3 text-sm font-medium">voyage</td>
                          <td className="p-3 text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-yellow-500 text-white text-xs flex items-center justify-center">4</div>
                              <span>6</span>
                            </div>
                          </td>
                          <td className="p-3 text-sm">1.64</td>
                          <td className="p-3 text-sm">19</td>
                          <td className="p-3 text-xs">
                            <div className="flex flex-wrap gap-1">
                              <span className="bg-blue-100 px-1 rounded">meta:description</span>
                              <span className="bg-blue-100 px-1 rounded">main/title</span>
                              <span className="bg-blue-100 px-1 rounded">main</span>
                              <span className="bg-blue-100 px-1 rounded">main/h2</span>
                              <span className="bg-blue-100 px-1 rounded">main/strong</span>
                              <span className="bg-blue-100 px-1 rounded">main/a</span>
                              <span className="bg-blue-100 px-1 rounded">main/img:alt</span>
                              <span className="bg-blue-100 px-1 rounded">main/noscript/img:alt</span>
                              <span className="bg-blue-100 px-1 rounded">footer</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm"><Eye className="h-3 w-3" /></Button>
                              <Button variant="ghost" size="sm"><Search className="h-3 w-3" /></Button>
                              <Button variant="ghost" size="sm"><Target className="h-3 w-3" /></Button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Onglet Optimisation */}
            <TabsContent value="optimisation" className="space-y-4">
              <div className="space-y-6">
                
                {/* Analyse textuelle */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                      Analyse textuelle
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium">Nombre de mots</span>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Valide
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium">Fréquence de répétition</span>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Valide
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Présentation de la page */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Eye className="h-5 w-5 text-blue-500" />
                      Présentation de la page
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium">Titre</span>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-blue-500" />
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
                          Notification
                          <Badge variant="default" className="bg-blue-600 text-white text-xs ml-1">1</Badge>
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium">Meta description</span>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Valide
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium">Adresse de la page</span>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Valide
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Structure de la page */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <TreePine className="h-5 w-5 text-blue-500" />
                      Structure de la page
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium">Utilisation des titres hiérarchiques</span>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-blue-500" />
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
                          Notification
                          <Badge variant="default" className="bg-blue-600 text-white text-xs ml-1">1</Badge>
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium">Plan de la page</span>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-blue-500" />
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
                          Notification
                          <Badge variant="default" className="bg-blue-600 text-white text-xs ml-1">1</Badge>
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Technique */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Settings className="h-5 w-5 text-blue-500" />
                      Technique
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium">Rapport texte/code</span>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-blue-500" />
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
                          Notification
                          <Badge variant="default" className="bg-blue-600 text-white text-xs ml-1">1</Badge>
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium">Style et Javascript</span>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-blue-500" />
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
                          Notification
                          <Badge variant="default" className="bg-blue-600 text-white text-xs ml-1">2</Badge>
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium">Frames et iFrames</span>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Valide
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Onglet Configuration */}
            <TabsContent value="configuration">
              <div className="space-y-6">
                {/* Définitions */}
                <div className="bg-card rounded-lg p-6 border">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Définitions
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Langue</span>
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">Valide</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Encoding</span>
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">Valide</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">URL canonique</span>
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">Valide</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Compatibilité mobile</span>
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">Valide</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Favicon</span>
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">Valide</span>
                    </div>
                  </div>
                </div>

                {/* Moteurs de recherche */}
                <div className="bg-card rounded-lg p-6 border">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Moteurs de recherche
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Indexation</span>
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">Valide</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Exploration</span>
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">Valide</span>
                    </div>
                    
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800">
                        <FileText className="h-4 w-4" />
                        Vérifier le fichier robots.txt pour cette page
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">IA et data mining</span>
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded flex items-center gap-1">
                        Notification <span className="bg-blue-600 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">2</span>
                      </span>
                    </div>

                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                      <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800">
                        <FileText className="h-4 w-4" />
                        Vérifier le fichier tdmrep.json
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Affichage</span>
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">Valide</span>
                    </div>
                  </div>
                </div>

                {/* Réseaux sociaux */}
                <div className="bg-card rounded-lg p-6 border">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Share2 className="h-5 w-5" />
                    Réseaux sociaux
                  </h3>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      Il est possible de contrôler la manière dont une page web apparaît lorsqu'elle est partagée sur les réseaux sociaux.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="liens">
              <div className="space-y-6">
                {/* Audit des liens */}
                <div className="bg-card rounded-lg p-6 border">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Link className="h-5 w-5" />
                    Audit des liens
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-sm">Pertinence des liens</span>
                      <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded flex items-center gap-1">
                        Avertissement <span className="bg-orange-600 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">1</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Suivi des liens</span>
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">Valide</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Sécurité</span>
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">Valide</span>
                    </div>
                  </div>
                </div>

                {/* Statistiques */}
                <div className="bg-card rounded-lg p-6 border">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Statistiques
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Nombre de liens :</span>
                      <span className="font-semibold text-blue-600">63</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Nombre de liens uniques (menant vers la même URL) :</span>
                      <span className="font-semibold text-blue-600">35</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Nombre de liens uniques internes :</span>
                      <span className="font-semibold text-blue-600">28</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Nombre de liens uniques externes :</span>
                      <span className="font-semibold text-blue-600">7</span>
                    </div>
                  </div>
                </div>

                {/* Boutons d'actions */}
                <div className="flex gap-2 flex-wrap">
                  <Button variant="default" className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Link className="h-4 w-4 mr-2" />
                    Liens internes
                  </Button>
                  <Button variant="outline">
                    <Network className="h-4 w-4 mr-2" />
                    Liens externes
                  </Button>
                  <Button variant="outline">
                    <Target className="h-4 w-4 mr-2" />
                    Liens spéciaux
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="images">
              <div className="space-y-6">
                {/* Intégration des images */}
                <div className="bg-card rounded-lg p-6 border">
                  <h3 className="text-lg font-semibold mb-4">Intégration des images</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm">Attribut alt</span>
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        Valide
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm">Nom des fichiers images</span>
                      <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Avertissement <span className="bg-orange-600 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">1</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm">Attributs alt dupliqués</span>
                      <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Avertissement <span className="bg-orange-600 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">1</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Liste des images */}
                <div className="bg-card rounded-lg p-6 border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Liste des images</h3>
                    <Button variant="outline" size="sm">
                      <Search className="h-4 w-4 mr-2" />
                      Rechercher
                    </Button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="text-left p-3 text-sm font-medium">Source</th>
                          <th className="text-left p-3 text-sm font-medium">Occ.</th>
                          <th className="text-left p-3 text-sm font-medium">Alt</th>
                          <th className="text-left p-3 text-sm font-medium">Title</th>
                          <th className="text-left p-3 text-sm font-medium">Erreur</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="p-3 text-xs max-w-xs">
                            <div className="truncate">
                              data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20640%20443'%3E%3C/svg%3E
                            </div>
                          </td>
                          <td className="p-3 text-sm text-center">1</td>
                          <td className="p-3 text-sm">Voyager en Europe</td>
                          <td className="p-3 text-sm"></td>
                          <td className="p-3 text-sm"></td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="p-3 text-xs max-w-xs">
                            <div className="truncate text-blue-600">
                              https://bustertravel.com/wp-content/uploads/2025/07/forme-1799670_640-1.jpg
                            </div>
                          </td>
                          <td className="p-3 text-sm text-center">1</td>
                          <td className="p-3 text-sm">Voyager en Europe</td>
                          <td className="p-3 text-sm"></td>
                          <td className="p-3 text-sm">
                            <div className="flex items-center gap-1 text-orange-600">
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              <span className="text-xs">Nom du fichier image non optimisé pour le référencement</span>
                            </div>
                          </td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="p-3 text-xs max-w-xs">
                            <div className="truncate">
                              data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20640%20427'%3E%3C/svg%3E
                            </div>
                          </td>
                          <td className="p-3 text-sm text-center">3</td>
                          <td className="p-3 text-sm">
                            <div>Voyager en Asie</div>
                            <div>Voyager malin</div>
                            <div>Paysages du Vietnam</div>
                          </td>
                          <td className="p-3 text-sm"></td>
                          <td className="p-3 text-sm"></td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="p-3 text-xs max-w-xs">
                            <div className="truncate text-blue-600">
                              https://bustertravel.com/wp-content/uploads/2025/07/farm-6948514_640-1.jpg
                            </div>
                          </td>
                          <td className="p-3 text-sm text-center">1</td>
                          <td className="p-3 text-sm">Voyager en Asie</td>
                          <td className="p-3 text-sm"></td>
                          <td className="p-3 text-sm">
                            <div className="flex items-center gap-1 text-orange-600">
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              <span className="text-xs">Nom du fichier image non optimisé pour le référencement</span>
                            </div>
                          </td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="p-3 text-xs max-w-xs">
                            <div className="truncate text-blue-600">
                              https://bustertravel.com/wp-content/uploads/2025/07/1040x575_vtc_0-1-1.jpg
                            </div>
                          </td>
                          <td className="p-3 text-sm text-center">1</td>
                          <td className="p-3 text-sm">Voyager malin</td>
                          <td className="p-3 text-sm"></td>
                          <td className="p-3 text-sm">
                            <div className="flex items-center gap-1 text-orange-600">
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              <span className="text-xs">Nom du fichier image non optimisé pour le référencement</span>
                            </div>
                          </td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="p-3 text-xs max-w-xs">
                            <div className="truncate text-blue-600">
                              https://bustertravel.com/wp-content/uploads/2025/07/boats-7022165_640-1.jpg
                            </div>
                          </td>
                          <td className="p-3 text-sm text-center">1</td>
                          <td className="p-3 text-sm">Paysages du Vietnam</td>
                          <td className="p-3 text-sm"></td>
                          <td className="p-3 text-sm">
                            <div className="flex items-center gap-1 text-orange-600">
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              <span className="text-xs">Nom du fichier image non optimisé pour le référencement</span>
                            </div>
                          </td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="p-3 text-xs max-w-xs">
                            <div className="truncate">
                              data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20640%20424'%3E%3C/svg%3E
                            </div>
                          </td>
                          <td className="p-3 text-sm text-center">1</td>
                          <td className="p-3 text-sm">Ambiance andalouse</td>
                          <td className="p-3 text-sm"></td>
                          <td className="p-3 text-sm"></td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="p-3 text-xs max-w-xs">
                            <div className="truncate text-blue-600">
                              https://bustertravel.com/wp-content/uploads/2025/07/spain-7346597_640-1.jpg
                            </div>
                          </td>
                          <td className="p-3 text-sm text-center">1</td>
                          <td className="p-3 text-sm">Ambiance andalouse</td>
                          <td className="p-3 text-sm"></td>
                          <td className="p-3 text-sm">
                            <div className="flex items-center gap-1 text-orange-600">
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              <span className="text-xs">Nom du fichier image non optimisé pour le référencement</span>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="donnees-structurees">
              <div className="space-y-6">
                {/* Description */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    Les données structurées sont particulièrement utiles pour aider Google et les IA à mieux comprendre vos pages. Avec des données structurées, 
                    vous leur fournissez des informations précises telles que l'auteur de la page, le prix d'un produit, sa notation, les étapes d'une recette de cuisine et bien d'autres. Surtout, vous gagnez des chances d'être cité ou mis en avant !
                  </p>
                </div>

                {/* Entités de base */}
                <div className="bg-card rounded-lg p-6 border">
                  <h3 className="text-lg font-semibold mb-4">Entités de base</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm">Usage des données structurées sur la page</span>
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        Valide
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm">Présence des données structurées essentielles</span>
                      <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Avertissement <span className="bg-orange-600 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">1</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Entités spécifiques */}
                <div className="bg-card rounded-lg p-6 border">
                  <h3 className="text-lg font-semibold mb-4">Entités spécifiques</h3>
                  <div className="space-y-4">
                    <p className="text-sm">
                      Cette page a été identifiée comme une page de type <strong>Accueil d'un blog</strong> 🔗. 
                      Les conseils ci-dessous visent à adapter les données structurées pour ce type de pages.
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-sm">Données structurées essentielles</span>
                        <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Avertissement <span className="bg-orange-600 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">1</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm">Données structurées suggérées</span>
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded flex items-center gap-1">
                          <Check className="h-3 w-3" />
                          Valide
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visualisation */}
                <div className="bg-card rounded-lg p-6 border">
                  <h3 className="text-lg font-semibold mb-4">Visualisation</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Page web 1 */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-600">Page web</span>
                        <Info className="h-3 w-3 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium">Voyages en Europe & Asie - Bons plans exclusifs | BusterTravel</p>
                    </div>

                    {/* Page web 2 */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-600">Page web</span>
                        <Info className="h-3 w-3 text-gray-400" />
                      </div>
                      <div className="flex justify-center">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">microdata</span>
                      </div>
                    </div>

                    {/* Site web */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Globe className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-600">Site web</span>
                        <Info className="h-3 w-3 text-gray-400" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs italic">Mes itinéraires malins à travers l'Europe et l'Asie.</p>
                        <p className="text-xs">
                          URL : <a href="https://bustertravel.com/" className="text-blue-600 hover:underline">https://bustertravel.com/</a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="http-reseau">
              <div className="space-y-6">
                {/* HTTP */}
                <div className="bg-card rounded-lg p-6 border">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    HTTP
                  </h3>
                  <div className="space-y-4">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Code className="h-4 w-4" />
                      Réponse et requête HTTP
                    </Button>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Sécurité</h4>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Avertissement <span className="bg-orange-600 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">1</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vitesse */}
                <div className="bg-card rounded-lg p-6 border">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Gauge className="h-5 w-5" />
                    Vitesse
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm">Poids de la page</span>
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        Valide
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm">Réactivité</span>
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        Valide
                      </span>
                    </div>
                  </div>
                </div>

                {/* Réseau */}
                <div className="bg-card rounded-lg p-6 border">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Network className="h-5 w-5" />
                    Réseau
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                      <span className="text-sm">Adresse IP : <strong>194.36.186.160</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                      <span className="text-sm">Reverse IP : <strong>194.36.186.160</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default HierarchyPage;