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
        
        // Données enrichies en mode IA
        result.redactionProblems = [
          { title: 'Meta description générée par IA', description: 'L\'IA suggère une meta description optimisée pour le CTR', priority: 'Haute', aiGenerated: true },
          { title: 'Titre H1 optimisé par IA', description: 'L\'IA propose une version plus percutante du titre principal', priority: 'Moyenne', aiGenerated: true },
          { title: 'Contenu dupliqué détecté', description: 'L\'IA a identifié du contenu similaire sur 2 pages', priority: 'Haute', aiGenerated: true }
        ];
        
        result.optimisationOpportunities = [
          { title: 'Mots-clés LSI suggérés par IA', priority: 'Haute', impact: 'Fort', aiGenerated: true },
          { title: 'Structure de contenu optimisée', priority: 'Haute', impact: 'Fort', aiGenerated: true },
          { title: 'Stratégie de maillage intelligent', priority: 'Moyenne', impact: 'Moyen', aiGenerated: true },
          { title: 'Optimisation sémantique avancée', priority: 'Moyenne', impact: 'Moyen', aiGenerated: true },
          { title: 'Cluster de mots-clés', priority: 'Basse', impact: 'Moyen', aiGenerated: true },
          { title: 'Analyse concurrentielle IA', priority: 'Moyenne', impact: 'Fort', aiGenerated: true },
          { title: 'Recommandations UX/SEO', priority: 'Haute', impact: 'Fort', aiGenerated: true },
          { title: 'Optimisation vocale', priority: 'Basse', impact: 'Moyen', aiGenerated: true },
          { title: 'Intent utilisateur avancé', priority: 'Moyenne', impact: 'Fort', aiGenerated: true },
          { title: 'Score E-A-T amélioré', priority: 'Haute', impact: 'Fort', aiGenerated: true },
          { title: 'Featured snippets potentiels', priority: 'Moyenne', impact: 'Moyen', aiGenerated: true },
          { title: 'Entités nommées manquantes', priority: 'Basse', impact: 'Faible', aiGenerated: true }
        ];
        
        toast.success('Analyse IA terminée - Recommandations personnalisées générées');
      } else {
        // Mode Standard : Données de base
        result.redactionProblems = [
          { title: 'Meta description manquante', description: 'La page d\'accueil n\'a pas de meta description', priority: 'Moyenne', aiGenerated: false },
          { title: 'Titre H1 trop long', description: 'Le titre H1 de la page Services dépasse 60 caractères', priority: 'Faible', aiGenerated: false }
        ];
        
        result.optimisationOpportunities = [
          { title: 'Optimiser les images', priority: 'Haute', impact: 'Fort', aiGenerated: false },
          { title: 'Améliorer la vitesse', priority: 'Haute', impact: 'Fort', aiGenerated: false },
          { title: 'Mots-clés longue traîne', priority: 'Moyenne', impact: 'Moyen', aiGenerated: false },
          { title: 'Maillage interne', priority: 'Moyenne', impact: 'Moyen', aiGenerated: false },
          { title: 'Schema markup', priority: 'Basse', impact: 'Faible', aiGenerated: false },
          { title: 'Compression GZIP', priority: 'Moyenne', impact: 'Moyen', aiGenerated: false },
          { title: 'Mise en cache browser', priority: 'Basse', impact: 'Moyen', aiGenerated: false },
          { title: 'Redirections 301', priority: 'Faible', impact: 'Faible', aiGenerated: false },
          { title: 'Sitemap optimization', priority: 'Basse', impact: 'Faible', aiGenerated: false }
        ];
        
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
                    <TabsTrigger value="optimisation" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
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
                  
                  {/* Statistiques de la structure */}
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-6 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">1</div>
                      <div className="text-xs text-blue-600">H1</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">8</div>
                      <div className="text-xs text-green-600">H2</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <div className="text-lg font-bold text-yellow-600">9</div>
                      <div className="text-xs text-yellow-600">H3</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-lg font-bold text-purple-600">8</div>
                      <div className="text-xs text-purple-600">H4</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <div className="text-lg font-bold text-red-600">0</div>
                      <div className="text-xs text-red-600">H5</div>
                    </div>
                    <div className="text-center p-3 bg-indigo-50 rounded-lg">
                      <div className="text-lg font-bold text-indigo-600">0</div>
                      <div className="text-xs text-indigo-600">H6</div>
                    </div>
                  </div>

                  {/* Analyse de la hiérarchie */}
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="font-medium text-green-800">Structure hiérarchique valide</span>
                    </div>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Un seul H1 par page ✓</li>
                      <li>• Hiérarchie logique respectée ✓</li>
                      <li>• Profondeur maximale de 4 niveaux ✓</li>
                      <li>• Titres descriptifs et optimisés ✓</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Rédaction */}
            <TabsContent value="redaction" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="h-5 w-5 text-orange-500" />
                      Problèmes de Rédaction (2)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analysisResult.redactionProblems?.map((problem: any, index: number) => (
                        <div key={index} className={`p-3 border rounded-lg ${
                          problem.aiGenerated ? 'border-purple-200 bg-purple-50' : 'border-orange-200 bg-orange-50'
                        }`}>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className={`font-medium ${
                                  problem.aiGenerated ? 'text-purple-800' : 'text-orange-800'
                                }`}>
                                  {problem.title}
                                </h4>
                                {problem.aiGenerated && (
                                  <Badge variant="outline" className="text-purple-700 border-purple-300 text-xs">
                                    IA
                                  </Badge>
                                )}
                              </div>
                              <p className={`text-sm ${
                                problem.aiGenerated ? 'text-purple-700' : 'text-orange-700'
                              }`}>
                                {problem.description}
                              </p>
                              <div className={`text-xs mt-1 ${
                                problem.aiGenerated ? 'text-purple-600' : 'text-orange-600'
                              }`}>
                                Priorité: {problem.priority}
                              </div>
                            </div>
                            <Badge variant="outline" className={
                              problem.aiGenerated ? 'text-purple-700 border-purple-300' : 'text-orange-700 border-orange-300'
                            }>
                              {problem.aiGenerated ? 'IA Suggéré' : 'À corriger'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TreePine className="h-5 w-5 text-primary" />
                      Structure des Titres
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(analysisResult.headings || {}).map(([level, headings]: [string, any[]]) => (
                        <div key={level} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {level.toUpperCase()}
                            </Badge>
                            <span className="text-sm">{headings.length} titre{headings.length > 1 ? 's' : ''}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {headings.length === 1 && level === 'h1' ? 
                              <CheckCircle className="h-4 w-4 text-green-500" /> : 
                              headings.length > 1 && level === 'h1' ?
                              <AlertTriangle className="h-4 w-4 text-orange-500" /> :
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            }
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Onglet Optimisation */}
            <TabsContent value="optimisation" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                      Opportunités SEO (9)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {analysisResult.optimisationOpportunities?.slice(0, useAI ? 12 : 9).map((item: any, index: number) => (
                        <div key={index} className={`flex items-center justify-between p-2 border rounded ${
                          item.aiGenerated ? 'border-purple-200 bg-purple-50' : 'border-gray-200'
                        }`}>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{item.title}</span>
                            {item.aiGenerated && (
                              <Badge variant="outline" className="text-purple-700 border-purple-300 text-xs">
                                IA
                              </Badge>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <Badge variant={
                              item.priority === 'Haute' ? 'destructive' : 
                              item.priority === 'Moyenne' ? 'secondary' : 'outline'
                            } className="text-xs">
                              {item.priority}
                            </Badge>
                            {item.aiGenerated && (
                              <Badge variant="default" className="text-xs bg-purple-600">
                                Impact: {item.impact}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      Performance Scores
                      {analysisResult.aiInsights && (
                        <Badge variant="outline" className="text-purple-700 border-purple-300 text-xs">
                          IA Enhanced
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">SEO Score {analysisResult.aiInsights ? '(IA)' : ''}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className={`h-2 rounded-full ${analysisResult.aiInsights ? 'bg-purple-600' : 'bg-blue-600'}`} 
                                 style={{width: analysisResult.aiInsights ? '89%' : '78%'}}></div>
                          </div>
                          <span className="text-sm font-medium">{analysisResult.aiInsights ? '89%' : '78%'}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Performance {analysisResult.aiInsights ? '(Optimisée)' : ''}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className={`h-2 rounded-full ${analysisResult.aiInsights ? 'bg-green-600' : 'bg-orange-600'}`} 
                                 style={{width: analysisResult.aiInsights ? '82%' : '65%'}}></div>
                          </div>
                          <span className="text-sm font-medium">{analysisResult.aiInsights ? '82%' : '65%'}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Accessibilité {analysisResult.aiInsights ? '(Analysée)' : ''}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{width: analysisResult.aiInsights ? '96%' : '92%'}}></div>
                          </div>
                          <span className="text-sm font-medium">{analysisResult.aiInsights ? '96%' : '92%'}</span>
                        </div>
                      </div>
                      {analysisResult.aiInsights && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Intent Matching (IA)</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div className="bg-purple-600 h-2 rounded-full" style={{width: '91%'}}></div>
                            </div>
                            <span className="text-sm font-medium">91%</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Actions Recommandées</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Compresser les images</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Minifier le CSS/JS</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        <span>Optimiser les fonts</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        <span>Mise en cache browser</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Onglet Configuration */}
            <TabsContent value="configuration" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-yellow-500" />
                      Configuration Technique (2)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 border border-yellow-200 bg-yellow-50 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-yellow-800 mb-1">Robots.txt manquant</h4>
                            <p className="text-sm text-yellow-700">Aucun fichier robots.txt détecté</p>
                          </div>
                          <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                            À configurer
                          </Badge>
                        </div>
                      </div>
                      <div className="p-3 border border-yellow-200 bg-yellow-50 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-yellow-800 mb-1">Sitemap non optimisé</h4>
                            <p className="text-sm text-yellow-700">Le sitemap XML pourrait être amélioré</p>
                          </div>
                          <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                            À optimiser
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      Sécurité & Headers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">HTTPS</span>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Security Headers</span>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">SSL Certificate</span>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Onglet Liens */}
            <TabsContent value="liens" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-500" />
                      Liens Cassés (1)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analysisResult.brokenLinks?.map((link: any, index: number) => (
                        <div key={index} className="p-3 border border-red-200 bg-red-50 rounded-lg">
                          <div className="font-medium text-sm text-red-800">{link.target}</div>
                          <div className="text-xs text-red-600">Source: {link.source}</div>
                          <Badge variant="destructive" className="text-xs mt-1">
                            {link.error}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Link className="h-5 w-5 text-primary" />
                      Analyse des Liens
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Liens internes</span>
                        <Badge variant="secondary">{analysisResult.performance?.totalInternalLinks}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Liens externes</span>
                        <Badge variant="secondary">{analysisResult.performance?.totalExternalLinks}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Liens nofollow</span>
                        <Badge variant="outline">5</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Onglet Images */}
            <TabsContent value="images" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-purple-500" />
                      Problèmes Images (2)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analysisResult.images?.filter((img: any) => !img.hasAlt).map((img: any, index: number) => (
                        <div key={index} className="p-3 border border-purple-200 bg-purple-50 rounded-lg">
                          <div className="font-medium text-sm text-purple-800">Attribut ALT manquant</div>
                          <div className="text-xs text-purple-600">{img.src}</div>
                          <Badge variant="outline" className="text-purple-700 border-purple-300 text-xs mt-1">
                            Accessibilité
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5 text-primary" />
                      Optimisation Images
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm">
                        <div className="flex justify-between mb-2">
                          <span>Images avec ALT</span>
                          <span className="font-medium">2/4</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{width: '50%'}}></div>
                        </div>
                      </div>
                      <div className="text-sm">
                        <div className="flex justify-between mb-2">
                          <span>Images avec titre</span>
                          <span className="font-medium">3/4</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{width: '75%'}}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Onglet Données structurées */}
            <TabsContent value="donnees-structurees" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-green-500" />
                      Schema.org Détecté (2)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analysisResult.technicalSeo?.schemaOrg?.map((schema: string, index: number) => (
                        <div key={index} className="p-3 border border-green-200 bg-green-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-green-800">{schema}</div>
                              <div className="text-xs text-green-600">Correctement implémenté</div>
                            </div>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="h-5 w-5 text-primary" />
                      Open Graph & Twitter
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Open Graph</span>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Twitter Cards</span>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Meta Tags</span>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Onglet HTTP & réseau */}
            <TabsContent value="http-reseau" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Network className="h-5 w-5 text-indigo-500" />
                      Problèmes Réseau (1)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 border border-indigo-200 bg-indigo-50 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-indigo-800 mb-1">Temps de réponse élevé</h4>
                            <p className="text-sm text-indigo-700">Le serveur met plus de 2 secondes à répondre</p>
                          </div>
                          <Badge variant="outline" className="text-indigo-700 border-indigo-300">
                            Performance
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gauge className="h-5 w-5 text-primary" />
                      Métriques Réseau
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Temps de réponse</span>
                        <Badge variant="secondary">{analysisResult.performance?.avgLoadTime}s</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Compression GZIP</span>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Keep-Alive</span>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="structure" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Informations de la page */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Code className="h-4 w-4 text-primary" />
                      Informations Page
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div>
                      <div className="font-medium mb-1">Titre (Title)</div>
                      <div className="text-muted-foreground text-xs p-2 bg-muted/50 rounded">
                        {analysisResult.pageStructure?.title || 'Non défini'}
                      </div>
                    </div>
                    
                    <div>
                      <div className="font-medium mb-1">Meta Description</div>
                      <div className="text-muted-foreground text-xs p-2 bg-muted/50 rounded">
                        {analysisResult.pageStructure?.metaDescription || 'Non définie'}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="font-medium">Langue:</span>
                        <div className="text-muted-foreground">{analysisResult.pageStructure?.lang}</div>
                      </div>
                      <div>
                        <span className="font-medium">Robots:</span>
                        <div className="text-muted-foreground">{analysisResult.pageStructure?.robots}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Structure des titres */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <TreePine className="h-4 w-4 text-primary" />
                      Hiérarchie Titres
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(analysisResult.headings || {}).map(([level, headings]: [string, any[]]) => (
                      <div key={level} className="space-y-1">
                        <div className="font-medium text-sm flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {level.toUpperCase()}
                          </Badge>
                          <span>{headings.length}</span>
                        </div>
                        <div className="space-y-1">
                          {headings.map((heading, index) => (
                            <div key={index} className="text-xs p-2 bg-muted/30 rounded border-l-2 border-primary/20">
                              {heading.text}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Métriques techniques */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Database className="h-4 w-4 text-primary" />
                      Métriques Techniques
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-2 bg-primary/5 rounded">
                        <div className="text-lg font-bold text-primary">{analysisResult.performance?.totalPages}</div>
                        <div className="text-xs text-muted-foreground">Pages totales</div>
                      </div>
                      <div className="text-center p-2 bg-primary/5 rounded">
                        <div className="text-lg font-bold text-primary">{analysisResult.performance?.totalInternalLinks}</div>
                        <div className="text-xs text-muted-foreground">Liens internes</div>
                      </div>
                      <div className="text-center p-2 bg-primary/5 rounded">
                        <div className="text-lg font-bold text-primary">{analysisResult.performance?.avgDepth}</div>
                        <div className="text-xs text-muted-foreground">Profondeur moy.</div>
                      </div>
                      <div className="text-center p-2 bg-primary/5 rounded">
                        <div className="text-lg font-bold text-primary">{analysisResult.performance?.crawlability}%</div>
                        <div className="text-xs text-muted-foreground">Crawlabilité</div>
                      </div>
                    </div>
                    
                    {analysisResult.technicalSeo && (
                      <div className="space-y-2 pt-2 border-t">
                        <div className="font-medium">SEO Technique</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center gap-1">
                            {analysisResult.technicalSeo.https ? 
                              <CheckCircle className="h-3 w-3 text-green-500" /> : 
                              <XCircle className="h-3 w-3 text-red-500" />
                            }
                            HTTPS
                          </div>
                          <div className="flex items-center gap-1">
                            {analysisResult.technicalSeo.mobileFriendly ? 
                              <CheckCircle className="h-3 w-3 text-green-500" /> : 
                              <XCircle className="h-3 w-3 text-red-500" />
                            }
                            Mobile
                          </div>
                          <div className="flex items-center gap-1">
                            {analysisResult.technicalSeo.structured ? 
                              <CheckCircle className="h-3 w-3 text-green-500" /> : 
                              <XCircle className="h-3 w-3 text-red-500" />
                            }
                            Schema.org
                          </div>
                          <div className="flex items-center gap-1">
                            {analysisResult.technicalSeo.openGraph ? 
                              <CheckCircle className="h-3 w-3 text-green-500" /> : 
                              <XCircle className="h-3 w-3 text-red-500" />
                            }
                            Open Graph
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Section complète des liens */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Liens internes */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Link className="h-5 w-5 text-primary" />
                      Liens Internes ({analysisResult.internalLinks?.length || 0})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {analysisResult.internalLinks?.map((link: any, index: number) => (
                        <div key={index} className="p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="font-medium text-sm mb-1">{link.text}</div>
                              <div className="text-xs text-muted-foreground mb-1">{link.url}</div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {link.context}
                                </Badge>
                                {link.anchor && (
                                  <Badge variant="secondary" className="text-xs">
                                    #{link.anchor}
                                  </Badge>
                                )}
                                {link.nofollow && (
                                  <Badge variant="destructive" className="text-xs">
                                    nofollow
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Liens externes */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Globe className="h-5 w-5 text-primary" />
                      Liens Externes ({analysisResult.externalLinks?.length || 0})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {analysisResult.externalLinks?.map((link: any, index: number) => (
                        <div key={index} className="p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                          <div className="font-medium text-sm mb-1">{link.text}</div>
                          <div className="text-xs text-muted-foreground mb-1">{link.url}</div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {link.context}
                            </Badge>
                            {link.nofollow ? (
                              <Badge variant="secondary" className="text-xs">
                                nofollow
                              </Badge>
                            ) : (
                              <Badge variant="destructive" className="text-xs">
                                dofollow
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Structure DOM */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TreePine className="h-5 w-5 text-primary" />
                    Structure DOM de la Page
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysisResult.structure?.map((section: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4 hover:bg-muted/20 transition-colors">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="default" className="text-xs">
                            {section.type}
                          </Badge>
                          <span className="font-medium">{section.name}</span>
                        </div>
                        <div className="space-y-2">
                          {section.elements?.map((element: any, elemIndex: number) => (
                            <div key={elemIndex} className="flex items-center gap-3 text-sm">
                              <Badge variant="outline" className="text-xs min-w-fit">
                                {element.tag}
                              </Badge>
                              <span className="text-muted-foreground flex-1">{element.content}</span>
                              {element.links && (
                                <Badge variant="secondary" className="text-xs">
                                  {element.links} liens
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Performance */}
            <TabsContent value="performance" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{analysisResult.performance?.totalPages}</div>
                      <div className="text-sm text-muted-foreground">Pages totales</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{analysisResult.performance?.avgLoadTime}s</div>
                      <div className="text-sm text-muted-foreground">Temps de charge moyen</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{analysisResult.performance?.crawlability}%</div>
                      <div className="text-sm text-muted-foreground">Crawlabilité</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{analysisResult.performance?.indexability}%</div>
                      <div className="text-sm text-muted-foreground">Indexabilité</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Onglet Problèmes */}
            <TabsContent value="issues" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-500" />
                      Liens Cassés
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analysisResult.brokenLinks?.map((link: any, index: number) => (
                        <div key={index} className="p-3 border border-red-200 bg-red-50 rounded-lg">
                          <div className="font-medium text-sm">{link.target}</div>
                          <div className="text-xs text-muted-foreground">Source: {link.source}</div>
                          <Badge variant="destructive" className="text-xs mt-1">
                            {link.error}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      Images sans ALT
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analysisResult.images?.filter((img: any) => !img.hasAlt).map((img: any, index: number) => (
                        <div key={index} className="p-3 border border-yellow-200 bg-yellow-50 rounded-lg">
                          <div className="font-medium text-sm">{img.src}</div>
                          <div className="text-xs text-muted-foreground">
                            {img.hasTitle ? `Titre: ${img.title}` : 'Aucun titre défini'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Onglet Pages Orphelines */}
            <TabsContent value="orphans" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Pages Orphelines Détectées
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysisResult.orphanPages?.map((page: any, index: number) => (
                      <div key={index} className="p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium mb-1">{page.name}</div>
                            <div className="text-sm text-muted-foreground mb-2">{page.path}</div>
                            <div className="text-xs text-muted-foreground">
                              Dernier accès: {page.lastAccess}
                            </div>
                            {page.recommendations && (
                              <div className="mt-3 space-y-1">
                                <div className="text-sm font-medium">Recommandations:</div>
                                {page.recommendations.map((rec: string, recIndex: number) => (
                                  <div key={recIndex} className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Target className="h-3 w-3" />
                                    {rec}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <Badge variant="outline">
                            Orpheline
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Recommandations */}
            <TabsContent value="recommendations" className="space-y-4">
              <div className="space-y-4">
                {analysisResult.recommendations?.map((rec: any, index: number) => (
                  <Card key={index} className={`border-l-4 ${
                    rec.type === 'error' ? 'border-l-red-500 bg-red-50' :
                    rec.type === 'warning' ? 'border-l-yellow-500 bg-yellow-50' :
                    'border-l-green-500 bg-green-50'
                  }`}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        {rec.type === 'error' ? <XCircle className="h-5 w-5 text-red-500 mt-0.5" /> :
                         rec.type === 'warning' ? <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" /> :
                         <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />}
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{rec.title}</h3>
                          <p className="text-sm text-muted-foreground">{rec.description}</p>
                        </div>
                        <Badge variant={
                          rec.type === 'error' ? 'destructive' :
                          rec.type === 'warning' ? 'secondary' :
                          'default'
                        }>
                          {rec.type === 'error' ? 'Critique' :
                           rec.type === 'warning' ? 'Important' :
                           'Optimisé'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Onglet IA Insights (si disponible) */}
            {analysisResult.aiInsights && (
              <TabsContent value="ai-insights" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="border-2 border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Brain className="h-5 w-5 text-primary" />
                        Analyse de Contenu
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {analysisResult.aiInsights.contentAnalysis}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <MapPin className="h-5 w-5 text-primary" />
                        Parcours Utilisateur
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {analysisResult.aiInsights.userJourney}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        SEO Technique
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {analysisResult.aiInsights.technicalSeo}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            )}
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default HierarchyPage;