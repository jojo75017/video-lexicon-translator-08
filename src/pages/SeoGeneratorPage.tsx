import React, { useState } from 'react';
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
    topic: 'référencement naturel SEO',
    keyword: 'SEO 2024',
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

  // Résultats générés avec données de démonstration
  const [generatedContent] = useState<any>({
    title: 'SEO 2024 : Guide Complet du Référencement Naturel | Stratégies Avancées',
    metaDescription: 'Découvrez les meilleures techniques SEO 2024. Guide expert avec stratégies avancées, outils indispensables et conseils pratiques pour optimiser votre référencement naturel.',
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
    content: `# SEO 2024 : Guide Complet du Référencement Naturel

## Introduction au SEO en 2024

Le référencement naturel (SEO) évolue constamment avec les mises à jour des algorithmes de Google. En 2024, l'intelligence artificielle et l'expérience utilisateur sont devenues centrales dans les stratégies SEO efficaces.

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

## Les Fondamentaux du Référencement

### 1. Recherche de Mots-clés Nouvelle Génération

La recherche de mots-clés en 2024 va bien au-delà du volume de recherche :

#### Analyse Intentionnelle Avancée
- **Intention informationnelle** : Questions, guides, définitions
- **Intention navigationnelle** : Recherche de marques spécifiques
- **Intention commerciale** : Comparaisons, avis, "meilleur"
- **Intention transactionnelle** : Achat, réservation, contact

#### Métriques Essentielles
- **Keyword Difficulty (KD)** : Évaluation de la concurrence
- **Search Intent Match** : Correspondance avec l'intention utilisateur
- **SERP Features** : Présence de rich snippets, PAA, images
- **Seasonal Trends** : Variations saisonnières et tendances

### 2. Analyse Concurrentielle Intelligente

Une approche méthodique de l'analyse concurrentielle :

#### Audit des Concurrents Directs
1. **Identification des top performers** dans votre niche
2. **Analyse des gaps de contenu** et opportunités manquées
3. **Étude des backlinks** et stratégies de netlinking
4. **Benchmark des performances** techniques et UX

#### Outils d'Analyse Recommandés
- **Ahrefs/SEMrush** : Analyse complète des concurrents
- **SimilarWeb** : Données de trafic et audience
- **Screaming Frog** : Audit technique comparatif
- **PageSpeed Insights** : Performance et Core Web Vitals

## Optimisation On-Page Avancée

### Architecture de l'Information SEO

#### Structure HTML Optimisée
\`\`\`html
<!DOCTYPE html>
<html lang="fr">
<head>
    <title>Mot-clé Principal | Marque - Proposition de Valeur</title>
    <meta name="description" content="Description optimisée 150-160 caractères">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="canonical" href="https://example.com/page">
</head>
\`\`\`

#### Hiérarchie des Titres Logique
- **H1 unique** : Titre principal avec mot-clé
- **H2 thématiques** : Sections principales du contenu
- **H3-H6 structurants** : Sous-sections et détails

### Optimisation du Contenu

#### Densité et Distribution des Mots-clés
- **Mot-clé principal** : 1-2% de densité naturelle
- **Mots-clés secondaires** : Intégration sémantique
- **Synonymes et variantes** : Enrichissement du champ lexical
- **Questions fréquentes** : Optimisation pour Position 0

#### Longueur et Profondeur
- **Articles informatifs** : 1500-3000 mots minimum
- **Pages commerciales** : 800-1500 mots optimisés
- **Contenu pilier** : 3000-5000 mots complets
- **Mise à jour régulière** : Fraîcheur du contenu

## Stratégies de Contenu SEO

### Content Marketing Intégré

#### Création de Contenu E-A-T
Google privilégie les contenus démontrant :

1. **Expertise (E)** : Compétences reconnues dans le domaine
2. **Authoritativeness (A)** : Autorité et reconnaissance par les pairs
3. **Trustworthiness (T)** : Fiabilité et transparence
4. **Experience (E)** : Expérience pratique du sujet traité

#### Types de Contenu Performants
- **Guides complets** : Ressources exhaustives sur un sujet
- **Études de cas** : Preuves sociales et exemples concrets
- **Comparatifs détaillés** : Analyses objectives de solutions
- **Tutoriels step-by-step** : Instructions pratiques illustrées

### Optimisation Sémantique

#### Enrichissement du Contenu
- **Entités nommées** : Personnes, lieux, organisations liées
- **Cooccurrences** : Termes fréquemment associés
- **Graphe de connaissances** : Connexions thématiques
- **Intent clustering** : Regroupement d'intentions similaires

## SEO Technique et Performance

### Core Web Vitals Optimisés

#### Métriques Prioritaires 2024
1. **LCP (Largest Contentful Paint)** : < 2.5 secondes
2. **FID (First Input Delay)** : < 100 millisecondes  
3. **CLS (Cumulative Layout Shift)** : < 0.1
4. **INP (Interaction to Next Paint)** : < 200ms (nouveau métrique)

#### Optimisations Techniques
- **Lazy loading** : Chargement différé des images
- **Critical CSS** : Styles critiques inline
- **Code splitting** : Division du JavaScript
- **CDN global** : Distribution géographique du contenu

### Architecture et Maillage Interne

#### Structure Logique du Site
- **Profondeur maximale** : 3 clics depuis l'accueil
- **Liens contextuels** : Ancres optimisées et pertinentes
- **Breadcrumbs** : Navigation claire et indexable
- **Sitemap XML** : Plan de site à jour automatiquement

#### Stratégies de Maillage Interne
- **Topic clusters** : Organisation thématique du contenu
- **Pillar pages** : Pages principales comprehensive
- **Supporting content** : Contenu de support spécialisé
- **Internal link velocity** : Rythme de création de liens

## Conclusion et Perspectives

### Synthèse des Points Clés

Le SEO en 2024 nécessite une approche professionnelle alliant :

1. **Expertise technique** : Maîtrise des outils et méthodes
2. **Vision stratégique** : Alignement avec les objectifs business
3. **Exécution rigoureuse** : Respect des processus et standards
4. **Amélioration continue** : Optimisation permanente

### Tendances et Évolution

#### Évolutions Majeures à Anticiper
- **Intelligence artificielle** : Automatisation avancée
- **Analytics prédictifs** : Anticipation des besoins
- **Personnalisation** : Adaptation aux utilisateurs
- **Durabilité** : Optimisation énergétique

Le SEO en 2024 demande une approche holistique combinant expertise technique, créativité éditoriale et vision stratégique.`,
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
    seoScore: 94,
    readabilityScore: 82,
    wordCount: 2847,
    estimatedReadTime: 14,
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
  });

  const contentTypes = [
    { value: 'article', label: 'Article de blog', icon: FileText, description: 'Articles informatifs et guides' },
    { value: 'product', label: 'Fiche produit', icon: Target, description: 'Descriptions commerciales' },
    { value: 'landing', label: 'Page de vente', icon: TrendingUp, description: 'Pages de conversion' },
    { value: 'social', label: 'Contenu social', icon: Users, description: 'Posts réseaux sociaux' }
  ];

  const generateContent = async () => {
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
                  onClick={generateContent} 
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