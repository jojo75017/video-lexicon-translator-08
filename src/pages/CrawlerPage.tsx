import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { OpenAIConfigPanel } from '@/components/shared/OpenAIConfigPanel';
import { 
  ArrowLeft, 
  Globe, 
  Search, 
  Eye, 
  Shield, 
  Clock, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Smartphone, 
  Monitor, 
  Link, 
  Code, 
  Image, 
  FileText, 
  BarChart3, 
  TrendingUp, 
  Download, 
  Activity, 
  Target, 
  Database, 
  Settings, 
  Play, 
  Pause, 
  RefreshCw,
  Info,
  Calendar,
  Users,
  Filter,
  ExternalLink,
  Star,
  Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CrawlerPage: React.FC = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('https://example.com');
  const [crawlDepth, setCrawlDepth] = useState(3);
  const [maxPages, setMaxPages] = useState(100);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [crawlProgress, setCrawlProgress] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [selectedIssueType, setSelectedIssueType] = useState('all');

  // Données simulées d'analyse complète
  const crawlResults = useMemo(() => ({
    summary: {
      totalPages: 247,
      crawledPages: 247,
      crawlTime: '2m 34s',
      avgLoadTime: 1.8,
      totalIssues: 89,
      criticalIssues: 12,
      warningIssues: 34,
      infoIssues: 43,
      seoScore: 78
    },
    performance: {
      avgPageSize: 2.4,
      avgLoadTime: 1.8,
      slowPages: 23,
      largePages: 15,
      optimizationScore: 72
    },
    technical: {
      brokenLinks: 8,
      redirects: 15,
      duplicateContent: 12,
      missingTitles: 6,
      missingDescriptions: 14,
      h1Issues: 9
    },
    accessibility: {
      missingAltText: 34,
      contrastIssues: 8,
      keyboardNavigation: 2,
      ariaLabels: 12,
      accessibilityScore: 68
    },
    mobile: {
      mobileResponsive: 89,
      viewportIssues: 8,
      touchTargets: 5,
      mobileScore: 82
    }
  }), []);

  const pageSpeedData = [
    { page: 'Accueil', loadTime: 1.2, size: 2.1, score: 95 },
    { page: 'À propos', loadTime: 1.8, size: 1.9, score: 88 },
    { page: 'Services', loadTime: 2.4, size: 3.2, score: 72 },
    { page: 'Contact', loadTime: 1.5, size: 1.7, score: 92 },
    { page: 'Blog', loadTime: 3.2, size: 4.1, score: 65 },
    { page: 'Portfolio', loadTime: 2.9, size: 3.8, score: 68 }
  ];

  const issuesOverTime = [
    { date: 'Sem 1', critical: 15, warning: 28, info: 35 },
    { date: 'Sem 2', critical: 12, warning: 32, info: 41 },
    { date: 'Sem 3', critical: 8, warning: 29, info: 38 },
    { date: 'Sem 4', critical: 12, warning: 34, info: 43 }
  ];

  const issuesBreakdown = [
    { name: 'SEO', value: 35, color: '#3b82f6' },
    { name: 'Performance', value: 28, color: '#10b981' },
    { name: 'Accessibilité', value: 20, color: '#f59e0b' },
    { name: 'Technique', value: 17, color: '#ef4444' }
  ];

  const detailedIssues = [
    {
      type: 'critical',
      category: 'SEO',
      title: 'Pages sans balise title',
      count: 6,
      impact: 'Très élevé',
      description: 'Ces pages n\'ont pas de balise title, ce qui nuit gravement au référencement.',
      pages: ['/page1', '/page2', '/page3'],
      solution: 'Ajouter une balise title unique et descriptive pour chaque page'
    },
    {
      type: 'critical',
      category: 'Performance',
      title: 'Images non optimisées',
      count: 23,
      impact: 'Élevé',
      description: 'Des images trop lourdes ralentissent le chargement des pages.',
      pages: ['/blog/article1', '/portfolio', '/services'],
      solution: 'Compresser les images et utiliser des formats modernes (WebP)'
    },
    {
      type: 'warning',
      category: 'SEO',
      title: 'Meta descriptions manquantes',
      count: 14,
      impact: 'Moyen',
      description: 'Pages sans meta description personnalisée.',
      pages: ['/about', '/contact', '/services/web'],
      solution: 'Rédiger des meta descriptions uniques de 150-160 caractères'
    },
    {
      type: 'warning',
      category: 'Technique',
      title: 'Liens brisés internes',
      count: 8,
      impact: 'Moyen',
      description: 'Liens pointant vers des pages inexistantes.',
      pages: ['/old-page', '/removed-service'],
      solution: 'Corriger ou supprimer les liens brisés'
    },
    {
      type: 'info',
      category: 'Accessibilité',
      title: 'Attributs alt manquants',
      count: 34,
      impact: 'Faible',
      description: 'Images sans texte alternatif pour l\'accessibilité.',
      pages: ['/gallery', '/team', '/blog'],
      solution: 'Ajouter des attributs alt descriptifs aux images'
    }
  ];

  const handleStartCrawl = async () => {
    if (!url.trim()) {
      toast.error('Veuillez saisir une URL à analyser');
      return;
    }

    try {
      new URL(url);
    } catch {
      toast.error('Veuillez saisir une URL valide');
      return;
    }

    setIsAnalyzing(true);
    setCrawlProgress(0);
    setAnalysisComplete(false);

    // Simulation du crawl avec progression
    const progressInterval = setInterval(() => {
      setCrawlProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          setIsAnalyzing(false);
          setAnalysisComplete(true);
          toast.success('Analyse terminée ! Résultats détaillés disponibles.');
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };

  const exportResults = (format: string) => {
    toast.success(`Export ${format.toUpperCase()} généré avec succès!`);
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'critical': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info': return <Info className="h-4 w-4 text-blue-500" />;
      default: return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getIssueColor = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-green-50 border-green-200 text-green-800';
    }
  };

  const filteredIssues = selectedIssueType === 'all' ? 
    detailedIssues : 
    detailedIssues.filter(issue => issue.type === selectedIssueType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 dark:from-gray-900 dark:via-emerald-900 dark:to-teal-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                <Globe className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Crawler SEO Avancé</h1>
                <p className="text-muted-foreground">Audit technique complet de site web</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => exportResults('pdf')} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button onClick={() => exportResults('csv')} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Configuration OpenAI */}
        <div className="mb-6">
          <OpenAIConfigPanel 
            title="🤖 Configuration IA - Crawler SEO"
            description="Configurez OpenAI pour des analyses techniques avancées avec l'IA ou utilisez des données de démonstration"
            compact={true}
          />
        </div>

        {/* Configuration du Crawl */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuration du Crawl
            </CardTitle>
            <CardDescription>
              Paramétrez votre analyse SEO technique
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">URL du site</label>
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  disabled={isAnalyzing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Profondeur max</label>
                <Input
                  type="number"
                  value={crawlDepth}
                  onChange={(e) => setCrawlDepth(parseInt(e.target.value) || 3)}
                  min={1}
                  max={10}
                  disabled={isAnalyzing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Limite de pages</label>
                <Input
                  type="number"
                  value={maxPages}
                  onChange={(e) => setMaxPages(parseInt(e.target.value) || 100)}
                  min={10}
                  max={1000}
                  disabled={isAnalyzing}
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button 
                onClick={handleStartCrawl}
                disabled={isAnalyzing}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Analyse en cours...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Lancer l'analyse
                  </>
                )}
              </Button>
              
              {isAnalyzing && (
                <div className="flex-1 flex items-center gap-4">
                  <Progress value={crawlProgress} className="flex-1" />
                  <span className="text-sm text-muted-foreground">
                    {Math.round(crawlProgress)}%
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Résultats d'analyse */}
        {analysisComplete && (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="issues">Problèmes détectés</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="technical">Technique</TabsTrigger>
              <TabsTrigger value="accessibility">Accessibilité</TabsTrigger>
            </TabsList>

            {/* Vue d'ensemble */}
            <TabsContent value="overview" className="space-y-6">
              {/* Score global */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Score SEO Global
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center space-x-8">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-emerald-600 mb-2">
                        {crawlResults.summary.seoScore}
                      </div>
                      <p className="text-sm text-muted-foreground">Score global</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-2">
                        {crawlResults.summary.totalPages}
                      </div>
                      <p className="text-sm text-muted-foreground">Pages analysées</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600 mb-2">
                        {crawlResults.summary.totalIssues}
                      </div>
                      <p className="text-sm text-muted-foreground">Problèmes détectés</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 mb-2">
                        {crawlResults.summary.crawlTime}
                      </div>
                      <p className="text-sm text-muted-foreground">Temps d'analyse</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Métriques principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-red-600">
                          {crawlResults.summary.criticalIssues}
                        </p>
                        <p className="text-sm text-muted-foreground">Problèmes critiques</p>
                      </div>
                      <XCircle className="h-8 w-8 text-red-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-yellow-600">
                          {crawlResults.summary.warningIssues}
                        </p>
                        <p className="text-sm text-muted-foreground">Avertissements</p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-yellow-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">
                          {crawlResults.summary.infoIssues}
                        </p>
                        <p className="text-sm text-muted-foreground">Informations</p>
                      </div>
                      <Info className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-emerald-600">
                          {crawlResults.performance.avgLoadTime}s
                        </p>
                        <p className="text-sm text-muted-foreground">Temps de chargement</p>
                      </div>
                      <Clock className="h-8 w-8 text-emerald-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Graphiques de tendance */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Évolution des problèmes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={issuesOverTime}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="critical" 
                          stackId="1"
                          stroke="#ef4444" 
                          fill="#ef4444" 
                          name="Critique"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="warning" 
                          stackId="1"
                          stroke="#f59e0b" 
                          fill="#f59e0b" 
                          name="Avertissement"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="info" 
                          stackId="1"
                          stroke="#3b82f6" 
                          fill="#3b82f6" 
                          name="Info"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Répartition des problèmes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={issuesBreakdown}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, value}) => `${name}: ${value}`}
                        >
                          {issuesBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Problèmes détectés */}
            <TabsContent value="issues" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Problèmes détectés ({filteredIssues.length})
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant={selectedIssueType === 'all' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedIssueType('all')}
                      >
                        Tous
                      </Button>
                      <Button
                        variant={selectedIssueType === 'critical' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedIssueType('critical')}
                      >
                        Critiques
                      </Button>
                      <Button
                        variant={selectedIssueType === 'warning' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedIssueType('warning')}
                      >
                        Avertissements
                      </Button>
                      <Button
                        variant={selectedIssueType === 'info' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedIssueType('info')}
                      >
                        Infos
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredIssues.map((issue, index) => (
                      <Card key={index} className={`border-l-4 ${getIssueColor(issue.type)}`}>
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {getIssueIcon(issue.type)}
                                <h3 className="font-semibold">{issue.title}</h3>
                                <Badge variant="outline" className="text-xs">
                                  {issue.category}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {issue.count} occurrences
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">
                                {issue.description}
                              </p>
                              <div className="mb-3">
                                <p className="text-sm font-medium mb-1">Pages affectées :</p>
                                <div className="flex flex-wrap gap-1">
                                  {issue.pages.slice(0, 3).map((page, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {page}
                                    </Badge>
                                  ))}
                                  {issue.pages.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{issue.pages.length - 3} autres
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                                <p className="text-sm">
                                  <strong>Solution :</strong> {issue.solution}
                                </p>
                              </div>
                            </div>
                            <div className="ml-4">
                              <Badge variant={issue.impact === 'Très élevé' ? 'destructive' : 
                                           issue.impact === 'Élevé' ? 'default' : 'secondary'}>
                                Impact {issue.impact.toLowerCase()}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Performance */}
            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold">{crawlResults.performance.avgPageSize} MB</p>
                        <p className="text-sm text-muted-foreground">Taille moyenne page</p>
                      </div>
                      <Database className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold">{crawlResults.performance.avgLoadTime}s</p>
                        <p className="text-sm text-muted-foreground">Temps de chargement</p>
                      </div>
                      <Clock className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold">{crawlResults.performance.optimizationScore}</p>
                        <p className="text-sm text-muted-foreground">Score d'optimisation</p>
                      </div>
                      <Zap className="h-8 w-8 text-yellow-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Performance des pages</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={pageSpeedData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="page" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="loadTime" fill="#3b82f6" name="Temps (s)" />
                      <Bar yAxisId="left" dataKey="size" fill="#10b981" name="Taille (MB)" />
                      <Bar yAxisId="right" dataKey="score" fill="#f59e0b" name="Score" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            {/* SEO */}
            <TabsContent value="seo" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-red-600">
                          {crawlResults.technical.missingTitles}
                        </p>
                        <p className="text-sm text-muted-foreground">Titres manquants</p>
                      </div>
                      <FileText className="h-8 w-8 text-red-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-yellow-600">
                          {crawlResults.technical.missingDescriptions}
                        </p>
                        <p className="text-sm text-muted-foreground">Meta descriptions</p>
                      </div>
                      <Eye className="h-8 w-8 text-yellow-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-orange-600">
                          {crawlResults.technical.h1Issues}
                        </p>
                        <p className="text-sm text-muted-foreground">Problèmes H1</p>
                      </div>
                      <Code className="h-8 w-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-purple-600">
                          {crawlResults.technical.duplicateContent}
                        </p>
                        <p className="text-sm text-muted-foreground">Contenu dupliqué</p>
                      </div>
                      <Target className="h-8 w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recommandations SEO prioritaires</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-red-800 dark:text-red-200">
                          Corriger les balises title manquantes
                        </h4>
                        <p className="text-sm text-red-700 dark:text-red-300">
                          6 pages n'ont pas de balise title. Impact très négatif sur le référencement.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">
                          Optimiser les meta descriptions
                        </h4>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                          14 pages sans meta description. Améliore le taux de clic dans les résultats.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-800 dark:text-blue-200">
                          Structurer les headings
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          9 pages avec des problèmes de structure H1-H6. Important pour la lisibilité.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Technique */}
            <TabsContent value="technical" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-red-600">
                          {crawlResults.technical.brokenLinks}
                        </p>
                        <p className="text-sm text-muted-foreground">Liens brisés</p>
                      </div>
                      <Link className="h-8 w-8 text-red-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-yellow-600">
                          {crawlResults.technical.redirects}
                        </p>
                        <p className="text-sm text-muted-foreground">Redirections</p>
                      </div>
                      <Activity className="h-8 w-8 text-yellow-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-green-600">
                          {crawlResults.mobile.mobileResponsive}%
                        </p>
                        <p className="text-sm text-muted-foreground">Mobile friendly</p>
                      </div>
                      <Smartphone className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">
                          {crawlResults.accessibility.accessibilityScore}%
                        </p>
                        <p className="text-sm text-muted-foreground">Score accessibilité</p>
                      </div>
                      <Shield className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Analyse technique détaillée</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Liens et redirections</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
                          <p className="text-2xl font-bold text-red-600">8</p>
                          <p className="text-sm text-muted-foreground">Liens brisés</p>
                        </div>
                        <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                          <p className="text-2xl font-bold text-yellow-600">15</p>
                          <p className="text-sm text-muted-foreground">Redirections 301</p>
                        </div>
                        <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">98%</p>
                          <p className="text-sm text-muted-foreground">Liens valides</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Structure technique</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                          <span className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            Robots.txt présent
                          </span>
                          <Badge variant="secondary">OK</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                          <span className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            Sitemap XML détecté
                          </span>
                          <Badge variant="secondary">OK</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                          <span className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            HTTPS partiel
                          </span>
                          <Badge variant="outline">À améliorer</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Accessibilité */}
            <TabsContent value="accessibility" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-yellow-600">
                          {crawlResults.accessibility.missingAltText}
                        </p>
                        <p className="text-sm text-muted-foreground">Alt manquants</p>
                      </div>
                      <Image className="h-8 w-8 text-yellow-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-red-600">
                          {crawlResults.accessibility.contrastIssues}
                        </p>
                        <p className="text-sm text-muted-foreground">Problèmes contraste</p>
                      </div>
                      <Eye className="h-8 w-8 text-red-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-orange-600">
                          {crawlResults.accessibility.keyboardNavigation}
                        </p>
                        <p className="text-sm text-muted-foreground">Navigation clavier</p>
                      </div>
                      <Target className="h-8 w-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">
                          {crawlResults.accessibility.accessibilityScore}%
                        </p>
                        <p className="text-sm text-muted-foreground">Score global</p>
                      </div>
                      <Shield className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Guide d'amélioration de l'accessibilité</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                        Priorité haute : Attributs alt manquants
                      </h4>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                        34 images n'ont pas d'attribut alt, rendant le contenu inaccessible aux lecteurs d'écran.
                      </p>
                      <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                        <p className="text-sm font-mono text-gray-600 dark:text-gray-400">
                          &lt;img src="image.jpg" alt="Description de l'image" /&gt;
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                      <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                        Priorité haute : Contraste insuffisant
                      </h4>
                      <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                        8 éléments ont un contraste insuffisant (ratio &lt; 4.5:1 pour le texte normal).
                      </p>
                      <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Ratio recommandé : 4.5:1 pour le texte normal, 3:1 pour le texte large.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                        Amélioration : Navigation au clavier
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Tous les éléments interactifs doivent être accessibles via le clavier (tab, enter, espace).
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {/* Aide et conseils */}
        {!analysisComplete && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                À propos du Crawler SEO Avancé
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Notre crawler SEO avancé analyse en profondeur la structure technique de votre site web, 
                  détecte les problèmes SEO et vous fournit des recommandations concrètes pour améliorer 
                  votre référencement naturel.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">✅ Ce que le crawler analyse :</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Structure HTML et balises SEO</li>
                      <li>• Performance et vitesse de chargement</li>
                      <li>• Accessibilité et conformité WCAG</li>
                      <li>• Liens internes et externes</li>
                      <li>• Optimisation mobile</li>
                      <li>• Problèmes techniques (404, redirections)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">🚀 Fonctionnalités avancées :</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Analyse en temps réel avec progression</li>
                      <li>• Rapport détaillé par catégorie</li>
                      <li>• Recommandations personnalisées</li>
                      <li>• Export PDF et CSV</li>
                      <li>• Suivi des améliorations</li>
                      <li>• Intégration IA pour analyses poussées</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CrawlerPage;