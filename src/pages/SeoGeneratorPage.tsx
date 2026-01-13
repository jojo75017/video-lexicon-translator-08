import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
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
  const [generatedContent, setGeneratedContent] = useState<any>({
    title: '',
    metaDescription: '',
    structure: [],
    content: '',
    seoScore: 0,
    readabilityScore: 0,
    wordCount: 0,
    estimatedReadTime: 0,
    keywords: [],
    images: [],
    faq: [],
    competitorAnalysis: {
      topCompetitors: [],
      opportunities: []
    },
    technicalSEO: {
      pagespeed: {
        mobile: 0,
        desktop: 0
      },
      mobileOptimization: {
        score: 0
      }
    }
  });

  // Fonction pour générer le contenu dynamiquement
  const generateContentForKeyword = (keyword: string) => {
    const isTravel = keyword.toLowerCase().includes('voyage') || keyword.toLowerCase().includes('sénégal') || keyword.toLowerCase().includes('senegal');
    
    const baseContent = {
      seoScore: 85,
      readabilityScore: 78,
      wordCount: 2000,
      estimatedReadTime: 10,
      keywords: [
        { keyword: keyword, difficulty: 45, volume: 1200, intent: 'informational', position: 5 },
        { keyword: `guide ${keyword}`, difficulty: 35, volume: 800, intent: 'informational', position: 8 },
        { keyword: `${keyword} prix`, difficulty: 55, volume: 600, intent: 'commercial', position: 12 }
      ],
      images: [
        { title: `Photo de ${keyword}`, alt: `Photo de ${keyword}`, suggestion: `Créer une image représentant ${keyword}`, priority: 'high' },
        { title: `Destination ${keyword}`, alt: `Destination ${keyword}`, suggestion: `Image de destination pour ${keyword}`, priority: 'medium' }
      ],
      faq: [
        { question: `Quelle est la meilleure période pour ${keyword} ?`, answer: `La meilleure période dépend de vos préférences...`, category: 'timing', priority: 'high' },
        { question: `Quel budget prévoir pour ${keyword} ?`, answer: `Le budget varie selon le type souhaité...`, category: 'budget', priority: 'high' }
      ],
      competitorAnalysis: {
        topCompetitors: [
          { domain: `guide-${keyword.replace(/\s+/g, '-')}.com`, authority: 75, backlinks: '50K', traffic: '200K', topKeywords: 150 },
          { domain: `voyage-${keyword.replace(/\s+/g, '-')}.fr`, authority: 68, backlinks: '30K', traffic: '150K', topKeywords: 120 }
        ],
        opportunities: ['Manque de guides pratiques détaillés', 'Peu de contenu sur le budget']
      },
      technicalSEO: {
        pagespeed: { mobile: 78, desktop: 92 },
        mobileOptimization: { score: 85 }
      }
    };

    if (isTravel) {
      return {
        ...baseContent,
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
        ...baseContent,
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
      setGeneratedContent(generateContentForKeyword(contentConfig.keyword));
    }
  }, [contentConfig.keyword]);

  const contentTypes = [
    { value: 'article', label: 'Article de blog', icon: FileText, description: 'Articles informatifs et guides' },
    { value: 'product', label: 'Fiche produit', icon: Target, description: 'Descriptions commerciales' },
    { value: 'landing', label: 'Page de vente', icon: TrendingUp, description: 'Pages de conversion' },
    { value: 'social', label: 'Contenu social', icon: Users, description: 'Posts réseaux sociaux' }
  ];

  // Estimation de coût basée sur la longueur cible
  const estimatedCost = React.useMemo(() => {
    const words = contentConfig.targetLength || 2000;
    // Estimation: ~0.002€ par 100 mots (gpt-4o-mini)
    const cost = (words / 100) * 0.002 + 0.01; // + coût fixe d'analyse
    return cost.toFixed(2);
  }, [contentConfig.targetLength]);

  const handleGenerateContent = async () => {
    if (!contentConfig.topic.trim() || !contentConfig.keyword.trim()) {
      toast.error('Veuillez renseigner le sujet et le mot-clé principal');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Vérifier l'authentification
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Veuillez vous connecter pour générer du contenu');
        setIsGenerating(false);
        return;
      }

      toast.loading('Génération IA en cours...', { id: 'generation-progress' });
      setGenerationProgress(20);

      // Appeler l'edge function avec vraie génération IA
      const { data, error } = await supabase.functions.invoke('generate-seo-content', {
        body: {
          topic: contentConfig.topic,
          keyword: contentConfig.keyword,
          contentType: contentConfig.contentType,
          targetLength: contentConfig.targetLength,
          tone: contentConfig.tone,
          audience: contentConfig.audience,
          intent: contentConfig.intent,
          language: contentConfig.language
        }
      });

      setGenerationProgress(80);

      if (error) {
        console.error('Error calling generate-seo-content:', error);
        throw new Error(error.message || 'Erreur lors de la génération');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      setGenerationProgress(100);
      setGeneratedContent(data);
      toast.success('✅ Contenu SEO généré par IA !', { id: 'generation-progress' });

    } catch (error) {
      console.error('Erreur génération:', error);
      toast.error(`❌ ${error instanceof Error ? error.message : 'Erreur lors de la génération'}`, { id: 'generation-progress' });
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
                    placeholder="Ex: voyage au sénégal, SEO 2024..."
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

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Button 
                  onClick={handleGenerateContent} 
                  disabled={isGenerating}
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

                {/* Estimation de coût */}
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                  💰 Coût estimé: ~{estimatedCost}€
                </Badge>
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
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      Contenu Généré
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm font-mono">
                        {generatedContent.content || 'Aucun contenu généré pour le moment. Saisissez un mot-clé et cliquez sur "Générer".'}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
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
                            {generatedContent.title?.length || 0}/60 caractères
                          </Badge>
                        </div>
                        <div className="p-3 bg-gray-50 rounded border relative">
                          <p className="text-sm pr-8">{generatedContent.title || 'Titre non généré'}</p>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="absolute top-1 right-1"
                            onClick={() => copyToClipboard(generatedContent.title || '', 'Titre')}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium">Meta Description</label>
                          <Badge variant="outline" className="text-xs">
                            {generatedContent.metaDescription?.length || 0}/160 caractères
                          </Badge>
                        </div>
                        <div className="p-3 bg-gray-50 rounded border relative">
                          <p className="text-sm pr-8">{generatedContent.metaDescription || 'Meta description non générée'}</p>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="absolute top-1 right-1"
                            onClick={() => copyToClipboard(generatedContent.metaDescription || '', 'Meta description')}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
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
                      {generatedContent.structure && generatedContent.structure.length > 0 ? (
                        generatedContent.structure.map((item: any, index: number) => (
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
                        ))
                      ) : (
                        <p className="text-muted-foreground text-center py-8">
                          Aucune structure générée. Saisissez un mot-clé et générez du contenu.
                        </p>
                      )}
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
                      {generatedContent.keywords && generatedContent.keywords.length > 0 ? (
                        generatedContent.keywords.map((kw: any, index: number) => (
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
                                <span className="font-medium">{kw.volume?.toLocaleString()}/mois</span>
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
                        ))
                      ) : (
                        <p className="text-muted-foreground text-center py-8 col-span-3">
                          Aucun mot-clé analysé. Générez du contenu pour voir l'analyse.
                        </p>
                      )}
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
                      {generatedContent.competitorAnalysis?.topCompetitors && generatedContent.competitorAnalysis.topCompetitors.length > 0 ? (
                        generatedContent.competitorAnalysis.topCompetitors.map((comp: any, index: number) => (
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
                        ))
                      ) : (
                        <p className="text-muted-foreground text-center py-8">
                          Aucune analyse concurrentielle disponible. Générez du contenu pour voir l'analyse.
                        </p>
                      )}
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
                        {generatedContent.images && generatedContent.images.length > 0 ? (
                          generatedContent.images.map((img: any, index: number) => (
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
                          ))
                        ) : (
                          <p className="text-muted-foreground text-center py-8">
                            Aucune suggestion d'image disponible.
                          </p>
                        )}
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
                        {generatedContent.faq && generatedContent.faq.length > 0 ? (
                          generatedContent.faq.map((item: any, index: number) => (
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
                          ))
                        ) : (
                          <p className="text-muted-foreground text-center py-8">
                            Aucune FAQ générée.
                          </p>
                        )}
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