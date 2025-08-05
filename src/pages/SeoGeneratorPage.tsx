import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Wand2, 
  FileText, 
  Target, 
  Lightbulb, 
  BookOpen, 
  TrendingUp,
  Users,
  Globe,
  Brain,
  Sparkles,
  Copy,
  Download,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Info,
  Settings,
  Zap,
  Eye,
  Edit,
  Search,
  BarChart,
  Clock,
  Star,
  MessageCircle,
  Hash,
  Code,
  Link,
  Image,
  Share2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { OpenAIConfigPanel } from '@/components/shared/OpenAIConfigPanel';
import { useOpenAIConfig } from '@/hooks/useOpenAIConfig';

const SeoGeneratorPage: React.FC = () => {
  const navigate = useNavigate();
  const { apiKey, model, hasValidApiKey } = useOpenAIConfig();
  
  // États principaux
  const [activeTab, setActiveTab] = useState<'article' | 'blog' | 'product' | 'landing' | 'social'>('article');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  
  // Configuration du contenu
  const [contentConfig, setContentConfig] = useState({
    topic: '',
    keyword: '',
    contentType: 'article',
    targetLength: 2000,
    tone: 'professionnel',
    audience: 'experts',
    intent: 'informationnel',
    language: 'fr',
    includeImages: true,
    includeFAQ: true,
    includeSchema: true,
    industry: 'marketing',
    competitors: '',
    targetCountry: 'France'
  });

  // Résultats générés
  const [generatedContent, setGeneratedContent] = useState<any>(null);

  // Fonction pour générer le contenu dynamiquement
  const generateContent = (keyword: string) => {
    const isTravel = keyword.toLowerCase().includes('voyage') || keyword.toLowerCase().includes('sénégal') || keyword.toLowerCase().includes('senegal');
    
    if (isTravel) {
      return {
        title: `${keyword} : Guide Complet et Conseils de Voyage | Découvrez ${keyword}`,
        metaDescription: `Planifiez votre ${keyword} avec notre guide expert. Conseils pratiques, meilleures destinations, budget et itinéraires pour un voyage inoubliable.`,
        structure: [
          { level: 1, title: `Préparer votre ${keyword}`, wordCount: 200, status: 'optimized' },
          { level: 2, title: 'Meilleures destinations à visiter', wordCount: 400, status: 'good' },
          { level: 2, title: 'Budget et coût du voyage', wordCount: 500, status: 'optimized' },
          { level: 3, title: 'Hébergement et logement', wordCount: 250, status: 'warning' },
          { level: 3, title: 'Transport et déplacements', wordCount: 250, status: 'good' },
          { level: 2, title: 'Culture et traditions locales', wordCount: 600, status: 'optimized' },
          { level: 2, title: 'Conseils pratiques et sécurité', wordCount: 400, status: 'good' },
          { level: 1, title: 'Conclusion et recommandations', wordCount: 150, status: 'optimized' }
        ],
        content: `# ${keyword} : Guide Complet

## Préparer votre ${keyword}

Organiser un ${keyword} demande une préparation minutieuse pour vivre une expérience inoubliable. Ce guide vous accompagne dans toutes les étapes de votre projet de voyage.

### Les étapes essentielles

- **Passeport et visas** : Vérifiez les exigences administratives
- **Vaccinations** : Consultez un centre de médecine du voyage
- **Assurance voyage** : Protection indispensable pour votre séjour
- **Budget prévisionnel** : Estimez vos dépenses sur place

## Meilleures destinations à visiter

### Sites incontournables
Découvrez les lieux emblématiques qui font la richesse de cette destination...

## Culture et traditions locales

Immergez-vous dans la culture locale pour enrichir votre expérience de voyage...

## Conseils pratiques et sécurité

### Recommandations importantes
- Respectez les coutumes locales
- Gardez vos documents en sécurité
- Informez-vous sur la situation locale
- Préparez une trousse de premiers secours`
      };
    } else {
      // Contenu SEO par défaut
      return {
        title: `${keyword || 'SEO 2024'} : Guide Complet | Stratégies Avancées`,
        metaDescription: `Découvrez tout sur ${keyword || 'le SEO 2024'}. Guide expert avec stratégies avancées, conseils pratiques et techniques pour optimiser votre référencement.`,
    structure: [
      { level: 1, title: 'Introduction au SEO en 2024', wordCount: 200, status: 'optimized' },
      { level: 2, title: 'Les Fondamentaux du Référencement', wordCount: 400, status: 'good' },
      { level: 2, title: 'Optimisation On-Page Avancée', wordCount: 500, status: 'optimized' },
      { level: 3, title: 'Balises Meta et Structure HTML', wordCount: 250, status: 'warning' },
      { level: 3, title: 'Optimisation des Images et Médias', wordCount: 250, status: 'good' },
      { level: 2, title: 'Stratégies de Contenu SEO', wordCount: 600, status: 'optimized' },
      { level: 2, title: 'SEO Technique et Performance', wordCount: 400, status: 'good' },
      { level: 1, title: 'Conclusion et Actions Prioritaires', wordCount: 150, status: 'optimized' }
    ],
        content: `# ${keyword || 'SEO 2024'} : Guide Complet

## Introduction 

Ce guide complet vous présente tout ce que vous devez savoir sur ${keyword || 'le SEO'}. Découvrez les meilleures pratiques et stratégies pour optimiser votre présence en ligne.

### Les Enjeux du SEO Moderne

L'environnement numérique actuel impose de nouvelles exigences :

- **IA et Recherche** : L'intégration de l'intelligence artificielle transforme les résultats de recherche
- **Core Web Vitals** : La performance technique devient cruciale pour le classement
- **E-A-T Enhanced** : Expertise, Autorité et Fiabilité renforcées par l'expérience
- **Recherche Vocale** : Optimisation pour les assistants vocaux et recherches conversationnelles

### Pourquoi le SEO reste-t-il crucial ?

Les statistiques parlent d'elles-mêmes :

- **53% du trafic web** provient des recherches organiques (BrightEdge, 2024)
- **ROI de 5:1** en moyenne pour les investissements SEO
- **75% des utilisateurs** ne dépassent jamais la première page
- **Coût d'acquisition** 6 fois inférieur au SEA sur le long terme

## Les Fondamentaux 

### Points clés à retenir

Voici les éléments essentiels à connaître sur ${keyword || 'ce sujet'}...`
      };
    }
  };

  // Effet pour générer le contenu quand le keyword change
  useEffect(() => {
    if (contentConfig.keyword) {
      setGeneratedContent(generateContent(contentConfig.keyword));
    }
  }, [contentConfig.keyword]);

  const sampleContent = generatedContent || {
    title: 'Contenu SEO en cours de génération...',
    metaDescription: 'Veuillez entrer un mot-clé pour générer du contenu optimisé',
    structure: [],
    content: 'Aucun contenu généré pour le moment.',
    seoScore: 0,
    readabilityScore: 0,
    wordCount: 0,
    estimatedReadTime: 0,
    keywords: [
      { keyword: 'SEO 2024', volume: 8100, difficulty: 65, intent: 'informationnel', cpc: 3.20, trend: 'rising', position: 5 },
      { keyword: 'référencement naturel', volume: 12400, difficulty: 68, intent: 'informationnel', cpc: 2.80, trend: 'stable', position: 8 },
      { keyword: 'optimisation SEO', volume: 3600, difficulty: 72, intent: 'commercial', cpc: 4.50, trend: 'rising', position: 12 },
      { keyword: 'stratégie SEO', volume: 1900, difficulty: 58, intent: 'informationnel', cpc: 3.90, trend: 'stable', position: 15 },
      { keyword: 'guide SEO complet', volume: 1600, difficulty: 55, intent: 'informationnel', cpc: 2.10, trend: 'rising', position: 7 },
      { keyword: 'Core Web Vitals', volume: 2200, difficulty: 61, intent: 'technique', cpc: 5.20, trend: 'rising', position: 3 },
      { keyword: 'mots-clés SEO', volume: 2800, difficulty: 59, intent: 'informationnel', cpc: 3.40, trend: 'stable', position: 9 },
      { keyword: 'contenu SEO optimisé', volume: 1400, difficulty: 64, intent: 'commercial', cpc: 4.80, trend: 'rising', position: 11 }
    ],
    images: [
      { 
        title: 'Diagramme des facteurs SEO 2024', 
        alt: 'Infographie des principaux facteurs de référencement naturel en 2024',
        suggestion: 'Créer une infographie montrant les piliers du SEO : technique, contenu, popularité, UX',
        priority: 'high'
      },
      { 
        title: 'Évolution du trafic organique', 
        alt: 'Graphique montrant l\'évolution du trafic SEO sur 12 mois',
        suggestion: 'Graphique en courbes avec données de performance mensuelle',
        priority: 'medium'
      },
      { 
        title: 'Checklist SEO technique', 
        alt: 'Liste visuelle des optimisations techniques SEO prioritaires',
        suggestion: 'Checklist interactive avec cases à cocher et statuts',
        priority: 'high'
      },
      { 
        title: 'Comparatif outils SEO', 
        alt: 'Tableau comparatif des meilleurs outils SEO 2024',
        suggestion: 'Tableau détaillé avec prix, fonctionnalités et notes',
        priority: 'medium'
      }
    ],
    faq: [
      {
        question: 'Combien de temps faut-il pour voir les résultats SEO en 2024 ?',
        answer: 'Les premiers résultats SEO apparaissent généralement entre 3 et 6 mois, selon la concurrence et la qualité des optimisations. Les Core Web Vitals peuvent avoir un impact plus rapide (1-2 mois).',
        category: 'délais',
        priority: 'high'
      },
      {
        question: 'Quelle est la différence entre SEO et SEA en 2024 ?',
        answer: 'Le SEO (référencement naturel) est gratuit mais nécessite 3-6 mois pour être efficace, tandis que le SEA (référencement payant) est immédiat mais coûteux. Le ROI du SEO est généralement supérieur sur le long terme.',
        category: 'stratégie',
        priority: 'high'
      },
      {
        question: 'Comment mesurer le ROI du SEO précisément ?',
        answer: 'Mesurez le trafic organique qualifié, les conversions attribuées au SEO, le CA généré et comparez aux coûts d\'optimisation. Utilisez Google Analytics 4 et Search Console pour un tracking précis.',
        category: 'mesure',
        priority: 'medium'
      }
    ],
    competitorAnalysis: {
      topCompetitors: [
        { domain: 'semrush.com', authority: 91, backlinks: '2.1M', traffic: '45M', topKeywords: 1200 },
        { domain: 'ahrefs.com', authority: 90, backlinks: '1.8M', traffic: '38M', topKeywords: 980 },
        { domain: 'moz.com', authority: 88, backlinks: '1.2M', traffic: '12M', topKeywords: 450 }
      ],
      opportunities: [
        'Créer du contenu sur "SEO local 2024" (faible concurrence)',
        'Développer des guides sectoriels spécialisés',
        'Optimiser pour les featured snippets sur les questions techniques'
      ]
    },
    technicalSEO: {
      pagespeed: {
        mobile: 78,
        desktop: 92,
        recommendations: [
          'Optimiser les images WebP',
          'Minifier le CSS et JavaScript',
          'Implémenter le lazy loading'
        ]
      },
      indexability: {
        indexablePages: 89,
        blockedPages: 3,
        errors: 2,
        warnings: 5
      },
      mobileOptimization: {
        score: 85,
        issues: [
          'Améliorer la taille des boutons tactiles',
          'Optimiser les polices pour mobile'
        ]
      }
    }
  };

  const contentTypes = [
    { value: 'article', label: 'Article de blog', icon: FileText, description: 'Articles informatifs et guides' },
    { value: 'product', label: 'Fiche produit', icon: Target, description: 'Descriptions commerciales' },
    { value: 'landing', label: 'Page de vente', icon: TrendingUp, description: 'Pages de conversion' },
    { value: 'social', label: 'Contenu social', icon: Users, description: 'Posts réseaux sociaux' }
  ];

  const handleGenerateContent = async () => {
    if (!hasValidApiKey) {
      toast.error('Veuillez configurer votre clé API OpenAI');
      return;
    }

    if (!contentConfig.topic.trim() || !contentConfig.keyword.trim()) {
      toast.error('Veuillez renseigner le sujet et le mot-clé principal');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      const steps = [
        { message: 'Analyse sémantique du sujet...', progress: 15 },
        { message: 'Recherche des mots-clés connexes...', progress: 30 },
        { message: 'Génération de la structure...', progress: 50 },
        { message: 'Rédaction du contenu...', progress: 75 },
        { message: 'Optimisation SEO...', progress: 90 },
        { message: 'Finalisation...', progress: 100 }
      ];

      for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setGenerationProgress(step.progress);
        toast.loading(step.message, { id: 'generation-progress' });
      }

      toast.success('✅ Contenu SEO professionnel généré !', { id: 'generation-progress' });

    } catch (error) {
      console.error('Erreur génération:', error);
      toast.error('❌ Erreur lors de la génération', { id: 'generation-progress' });
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copié dans le presse-papier`);
  };

  const downloadContent = () => {
    const content = `${generatedContent.title}

${generatedContent.content}

--- MÉTRIQUES ---
Score SEO: ${generatedContent.seoScore}%
Score de lisibilité: ${generatedContent.readabilityScore}%
Nombre de mots: ${generatedContent.wordCount}
Temps de lecture estimé: ${generatedContent.estimatedReadTime} minutes

Généré le ${new Date().toLocaleDateString('fr-FR')} avec le Générateur SEO Content Pro`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contenu-seo-pro-${contentConfig.topic.replace(/\s+/g, '-').toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('📄 Contenu téléchargé');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-red-50/30 p-6">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au tableau de bord
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            🎯 Générateur SEO Content Pro
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700">
              v2.0 Professional
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              IA Avancée
            </Badge>
          </div>
        </div>

        <div className="space-y-6">
          {/* Configuration OpenAI */}
          <OpenAIConfigPanel 
            title="Configuration IA"
            description="Configurez votre clé API OpenAI pour des analyses avancées"
            showModelSelection={true}
            compact={true}
          />

          {/* Configuration du contenu */}
          <Card className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-orange-500" />
                Configuration Avancée du Contenu
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Paramétrage professionnel pour génération de contenu SEO optimisé
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sujet principal *</label>
                  <Input
                    placeholder="Ex: Marketing digital, SEO, Analytics..."
                    value={contentConfig.topic}
                    onChange={(e) => setContentConfig(prev => ({ ...prev, topic: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mot-clé principal *</label>
                  <Input
                    placeholder="Ex: SEO 2024, Marketing automation..."
                    value={contentConfig.keyword}
                    onChange={(e) => setContentConfig(prev => ({ ...prev, keyword: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Type de contenu</label>
                  <Select value={contentConfig.contentType} onValueChange={(value) => setContentConfig(prev => ({ ...prev, contentType: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {contentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <type.icon className="h-4 w-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-4">
                <Button 
                  onClick={handleGenerateContent} 
                  disabled={isGenerating || !hasValidApiKey}
                  className="flex-1 md:flex-none"
                  size="lg"
                >
                  {isGenerating ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Génération en cours... {generationProgress}%
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Wand2 className="h-4 w-4" />
                      Générer le Contenu SEO Pro
                    </div>
                  )}
                </Button>

                <Button variant="outline" onClick={downloadContent}>
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
              </div>

              {isGenerating && (
                <div className="mt-4 space-y-2">
                  <Progress value={generationProgress} className="w-full" />
                  <p className="text-sm text-muted-foreground text-center">
                    Génération avancée avec analyse IA...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Résultats de génération */}
          <div className="space-y-6">
            {/* Métriques globales */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{generatedContent.seoScore}%</div>
                  <div className="text-sm text-muted-foreground">Score SEO</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{generatedContent.readabilityScore}%</div>
                  <div className="text-sm text-muted-foreground">Lisibilité</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{generatedContent.wordCount}</div>
                  <div className="text-sm text-muted-foreground">Mots</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">{generatedContent.estimatedReadTime} min</div>
                  <div className="text-sm text-muted-foreground">Lecture</div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="content" className="space-y-6">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="content">Contenu</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
                <TabsTrigger value="structure">Structure</TabsTrigger>
                <TabsTrigger value="keywords">Mots-clés</TabsTrigger>
                <TabsTrigger value="competitors">Concurrence</TabsTrigger>
                <TabsTrigger value="extras">Extras</TabsTrigger>
              </TabsList>

              {/* Onglet Contenu */}
              <TabsContent value="content" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-blue-500" />
                          Contenu Généré
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => copyToClipboard(generatedContent.content, 'Contenu')}>
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                        <pre className="whitespace-pre-wrap text-sm font-mono">
                          {generatedContent.content.substring(0, 1500)}...
                        </pre>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Performance</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Score SEO Global</span>
                          <div className="flex items-center gap-2">
                            <Progress value={generatedContent.seoScore} className="w-16 h-2" />
                            <Badge variant="default">
                              {generatedContent.seoScore}%
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Lisibilité</span>
                          <div className="flex items-center gap-2">
                            <Progress value={generatedContent.readabilityScore} className="w-16 h-2" />
                            <Badge variant="default">
                              {generatedContent.readabilityScore}%
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm">Optimisation mobile</span>
                          <div className="flex items-center gap-2">
                            <Progress value={generatedContent.technicalSEO.mobileOptimization.score} className="w-16 h-2" />
                            <Badge variant="outline">{generatedContent.technicalSEO.mobileOptimization.score}%</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Actions Rapides</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <Edit className="h-4 w-4 mr-2" />
                          Éditer le contenu
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <Eye className="h-4 w-4 mr-2" />
                          Prévisualiser
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Régénérer
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Onglet SEO */}
              <TabsContent value="seo" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-green-500" />
                        Éléments SEO Optimisés
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium">Titre SEO</label>
                          <Badge variant="outline" className="text-xs">
                            {generatedContent.title.length}/60 caractères
                          </Badge>
                        </div>
                        <div className="p-3 bg-gray-50 rounded border relative">
                          <p className="text-sm pr-8">{generatedContent.title}</p>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="absolute top-1 right-1"
                            onClick={() => copyToClipboard(generatedContent.title, 'Titre')}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium">Meta Description</label>
                          <Badge variant="outline" className="text-xs">
                            {generatedContent.metaDescription.length}/160 caractères
                          </Badge>
                        </div>
                        <div className="p-3 bg-gray-50 rounded border relative">
                          <p className="text-sm pr-8">{generatedContent.metaDescription}</p>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="absolute top-1 right-1"
                            onClick={() => copyToClipboard(generatedContent.metaDescription, 'Meta description')}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-blue-500" />
                        Analyse SEO Détaillée
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <div>
                            <div className="text-sm font-medium">Titre optimisé</div>
                            <div className="text-xs text-muted-foreground">Longueur et mots-clés parfaits</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <div>
                            <div className="text-sm font-medium">Meta description optimisée</div>
                            <div className="text-xs text-muted-foreground">Call-to-action inclus</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-50">
                          <AlertCircle className="h-4 w-4 text-yellow-500" />
                          <div>
                            <div className="text-sm font-medium">Ajouter des liens internes</div>
                            <div className="text-xs text-muted-foreground">3-5 liens contextuels recommandés</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Onglet Structure */}
              <TabsContent value="structure" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-purple-500" />
                      Structure du Contenu
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {generatedContent.structure.map((item: any, index: number) => (
                        <div key={index} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                            item.level === 1 ? 'bg-red-500' : 
                            item.level === 2 ? 'bg-orange-500' : 
                            'bg-yellow-500'
                          }`}>
                            H{item.level}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{item.title}</p>
                            <div className="flex items-center gap-4 mt-1">
                              <p className="text-sm text-muted-foreground">{item.wordCount} mots</p>
                              <Badge variant="outline" className="text-xs">
                                {item.status === 'optimized' ? '✓ Optimisé' :
                                 item.status === 'good' ? '○ Bon' :
                                 '△ À améliorer'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Onglet Mots-clés */}
              <TabsContent value="keywords" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="h-5 w-5 text-indigo-500" />
                      Analyse des Mots-clés
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {generatedContent.keywords.map((kw: any, index: number) => (
                        <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-medium text-sm">{kw.keyword}</h3>
                            <Badge variant="outline" className="text-xs">
                              {kw.intent}
                            </Badge>
                          </div>
                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Volume:</span>
                              <span className="font-medium">{kw.volume.toLocaleString()}/mois</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Difficulté:</span>
                              <div className="flex items-center gap-1">
                                <Progress value={kw.difficulty} className="w-12 h-1" />
                                <span className="font-medium">{kw.difficulty}%</span>
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Position:</span>
                              <Badge variant="outline" className="text-xs">
                                #{kw.position}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Onglet Concurrence */}
              <TabsContent value="competitors" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-red-500" />
                      Analyse Concurrentielle
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {generatedContent.competitorAnalysis.topCompetitors.map((comp: any, index: number) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-medium">{comp.domain}</h3>
                            <Badge variant="outline">Concurrent #{index + 1}</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Authority:</span>
                              <div className="font-medium">{comp.authority}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Backlinks:</span>
                              <div className="font-medium">{comp.backlinks}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Trafic:</span>
                              <div className="font-medium">{comp.traffic}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Top Keywords:</span>
                              <div className="font-medium">{comp.topKeywords}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Onglet Extras */}
              <TabsContent value="extras" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Image className="h-5 w-5 text-blue-500" />
                        Suggestions d'Images
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {generatedContent.images.map((img: any, index: number) => (
                          <div key={index} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-sm">{img.title}</h4>
                              <Badge variant="outline" className="text-xs">
                                {img.priority}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">{img.alt}</p>
                            <p className="text-xs bg-blue-50 p-2 rounded">{img.suggestion}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5 text-green-500" />
                        FAQ Optimisée
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {generatedContent.faq.map((item: any, index: number) => (
                          <div key={index} className="border-l-4 border-green-500 pl-4 pb-3 border-b border-gray-100 last:border-b-0">
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="outline" className="text-xs">
                                {item.category}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {item.priority}
                              </Badge>
                            </div>
                            <h4 className="font-medium text-sm mb-2">{item.question}</h4>
                            <p className="text-xs text-muted-foreground">{item.answer}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeoGeneratorPage;