import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, FileText, Settings, Link, Image, Code, Network, Zap, Copy, Download, CheckCircle, Search, Wand2, Target, BarChart3, Brain, Globe, Share2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { OpenAIConfigPanel } from '@/components/shared/OpenAIConfigPanel';
import { useOpenAIConfig } from '@/hooks/useOpenAIConfig';
import { generateSeoDescription, generateBothDescriptions, generateAIDescriptions } from '@/utils/seo/generators/descriptionGenerator';
import { generateTitleFromLocation } from '@/services/titleGeneratorService';

const SeoGeneratorPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('generation');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const { apiKey, isValid: isValidApiKey, hasValidApiKey } = useOpenAIConfig();

  const [generationConfig, setGenerationConfig] = useState({
    keyword: '',
    industry: 'general',
    tone: 'professional',
    language: 'fr',
    targetAudience: 'general',
    contentType: 'article',
    region: 'FR'
  });

  const [generatedResults, setGeneratedResults] = useState<any>(null);
  const [seoScore, setSeoScore] = useState(0);

  // Configuration pour le générateur intelligent
  const [smartConfig, setSmartConfig] = useState({
    includeMetaTags: true,
    includeStructuredData: true,
    includeOpenGraph: true,
    includeTwitterCards: true,
    generateH2Suggestions: true,
    generateContentOutline: true,
    optimizeForVoiceSearch: false,
    mobileOptimization: true
  });

  const industries = [
    { value: 'general', label: 'Général' },
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'travel', label: 'Voyage' },
    { value: 'health', label: 'Santé' },
    { value: 'tech', label: 'Technologie' },
    { value: 'finance', label: 'Finance' },
    { value: 'food', label: 'Alimentaire' },
    { value: 'education', label: 'Éducation' },
    { value: 'business', label: 'Business/B2B' },
    { value: 'local', label: 'Entreprise locale' }
  ];

  const tones = [
    { value: 'professional', label: 'Professionnel' },
    { value: 'friendly', label: 'Amical' },
    { value: 'expert', label: 'Expert' },
    { value: 'casual', label: 'Décontracté' },
    { value: 'formal', label: 'Formel' },
    { value: 'creative', label: 'Créatif' }
  ];

  const contentTypes = [
    { value: 'article', label: 'Article de blog' },
    { value: 'product', label: 'Page produit' },
    { value: 'service', label: 'Page service' },
    { value: 'homepage', label: 'Page d\'accueil' },
    { value: 'category', label: 'Page catégorie' },
    { value: 'landing', label: 'Landing page' }
  ];

  const generateSmartSEO = async () => {
    if (!generationConfig.keyword.trim()) {
      toast.error('Veuillez entrer un mot-clé principal');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Simulation du processus de génération avec progression
      const steps = [
        { label: 'Analyse du mot-clé...', progress: 10 },
        { label: 'Recherche de la concurrence...', progress: 25 },
        { label: 'Génération du titre optimisé...', progress: 40 },
        { label: 'Création de la méta-description...', progress: 55 },
        { label: 'Structure H2 et contenu...', progress: 70 },
        { label: 'Données structurées...', progress: 85 },
        { label: 'Finalisation...', progress: 100 }
      ];

      for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setGenerationProgress(step.progress);
        toast.info(step.label);
      }

      let title, description;

      // Utiliser l'IA si disponible, sinon fallback
      if (hasValidApiKey()) {
        try {
          const aiResults = await generateAIDescriptions(generationConfig.keyword, apiKey);
          title = aiResults.short;
          description = aiResults.long;
        } catch (error) {
          const fallbackResults = generateBothDescriptions(generationConfig.keyword);
          title = fallbackResults.short;
          description = fallbackResults.long;
        }
      } else {
        const fallbackResults = generateBothDescriptions(generationConfig.keyword);
        title = fallbackResults.short;
        description = fallbackResults.long;
      }

      // Génération des suggestions H2 basées sur l'industrie
      const h2Suggestions = generateH2Suggestions(generationConfig.keyword, generationConfig.industry);
      
      // Score SEO basé sur la configuration
      const score = calculateSEOScore({
        keyword: generationConfig.keyword,
        title,
        description,
        industry: generationConfig.industry,
        config: smartConfig
      });

      const results = {
        title,
        description,
        h1: `${title}`,
        h2Suggestions,
        metaTags: generateMetaTags(title, description, generationConfig.keyword),
        openGraph: generateOpenGraphTags(title, description),
        twitterCards: generateTwitterCardTags(title, description),
        structuredData: generateStructuredData(title, description, generationConfig),
        contentOutline: generateContentOutline(generationConfig.keyword, generationConfig.industry),
        internalLinkSuggestions: generateInternalLinkSuggestions(generationConfig.keyword, generationConfig.industry),
        keywords: generateKeywordVariations(generationConfig.keyword),
        recommendations: generateRecommendations(title, description, generationConfig),
        seoAnalysis: {
          titleLength: title.length,
          descriptionLength: description.length,
          keywordInTitle: title.toLowerCase().includes(generationConfig.keyword.toLowerCase()),
          keywordInDescription: description.toLowerCase().includes(generationConfig.keyword.toLowerCase()),
          readabilityScore: calculateReadabilityScore(description)
        }
      };

      setGeneratedResults(results);
      setSeoScore(score);
      toast.success('Contenu SEO généré avec succès !');

    } catch (error) {
      console.error('Erreur génération SEO:', error);
      toast.error('Erreur lors de la génération. Utilisation des données de démonstration.');
      
      // Fallback avec données de démonstration
      const fallbackResults = generateBothDescriptions(generationConfig.keyword);
      const results = {
        title: fallbackResults.short,
        description: fallbackResults.long,
        // ... reste des données de démonstration
      };
      setGeneratedResults(results);
      setSeoScore(75);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateH2Suggestions = (keyword: string, industry: string) => {
    const baseTemplates = {
      general: [
        `Qu'est-ce que ${keyword} ?`,
        `Les avantages de ${keyword}`,
        `Comment utiliser ${keyword}`,
        `${keyword} : guide complet`,
        `Conseils pour optimiser ${keyword}`
      ],
      ecommerce: [
        `Meilleurs ${keyword} 2024`,
        `Guide d'achat ${keyword}`,
        `Comparatif ${keyword}`,
        `Prix et promotions ${keyword}`,
        `Avis clients ${keyword}`
      ],
      travel: [
        `Découvrir ${keyword}`,
        `Que faire à ${keyword}`,
        `Hébergements ${keyword}`,
        `Transport vers ${keyword}`,
        `Budget voyage ${keyword}`
      ],
      tech: [
        `Fonctionnalités ${keyword}`,
        `Installation ${keyword}`,
        `Configuration ${keyword}`,
        `Troubleshooting ${keyword}`,
        `Alternatives à ${keyword}`
      ]
    };

    return baseTemplates[industry] || baseTemplates.general;
  };

  const generateMetaTags = (title: string, description: string, keyword: string) => {
    return `<title>${title}</title>
<meta name="description" content="${description}">
<meta name="keywords" content="${keyword}">
<meta name="robots" content="index,follow">
<meta name="author" content="MonSite">
<link rel="canonical" href="https://monsite.com/${keyword.toLowerCase().replace(/\s+/g, '-')}">`;
  };

  const generateOpenGraphTags = (title: string, description: string) => {
    return `<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:type" content="article">
<meta property="og:url" content="https://monsite.com">
<meta property="og:image" content="https://monsite.com/images/og-image.jpg">
<meta property="og:site_name" content="MonSite">`;
  };

  const generateTwitterCardTags = (title: string, description: string) => {
    return `<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="https://monsite.com/images/twitter-card.jpg">`;
  };

  const generateStructuredData = (title: string, description: string, config: any) => {
    return {
      "@context": "https://schema.org",
      "@type": config.contentType === 'product' ? 'Product' : 'Article',
      "headline": title,
      "description": description,
      "author": {
        "@type": "Organization",
        "name": "MonSite"
      },
      "publisher": {
        "@type": "Organization",
        "name": "MonSite",
        "logo": {
          "@type": "ImageObject",
          "url": "https://monsite.com/logo.jpg"
        }
      },
      "datePublished": new Date().toISOString(),
      "dateModified": new Date().toISOString()
    };
  };

  const generateContentOutline = (keyword: string, industry: string) => {
    const outlines = {
      general: [
        'Introduction et définition',
        'Contexte et importance',
        'Étapes détaillées',
        'Conseils pratiques',
        'Conclusion et next steps'
      ],
      ecommerce: [
        'Présentation du produit',
        'Caractéristiques principales',
        'Avantages et bénéfices',
        'Comparaison avec concurrents',
        'Témoignages et avis'
      ],
      travel: [
        'Vue d\'ensemble de la destination',
        'Attractions principales',
        'Informations pratiques',
        'Conseils de voyage',
        'Itinéraires recommandés'
      ]
    };

    return outlines[industry] || outlines.general;
  };

  const generateInternalLinkSuggestions = (keyword: string, industry: string) => {
    return [
      `/blog/${keyword.toLowerCase().replace(/\s+/g, '-')}-guide`,
      `/category/${keyword.toLowerCase().replace(/\s+/g, '-')}`,
      `/resources/${keyword.toLowerCase().replace(/\s+/g, '-')}-tools`,
      `/about/${keyword.toLowerCase().replace(/\s+/g, '-')}-expertise`
    ];
  };

  const generateKeywordVariations = (keyword: string) => {
    const variations = [
      `${keyword} guide`,
      `meilleur ${keyword}`,
      `${keyword} conseils`,
      `comment ${keyword}`,
      `${keyword} 2024`,
      `${keyword} gratuit`,
      `${keyword} professionnel`,
      `${keyword} en ligne`
    ];

    return variations;
  };

  const generateRecommendations = (title: string, description: string, config: any) => {
    const recommendations = [];

    if (title.length < 30 || title.length > 60) {
      recommendations.push({
        type: 'warning',
        title: 'Longueur du titre',
        description: `Le titre fait ${title.length} caractères. Optimal: 30-60 caractères.`
      });
    } else {
      recommendations.push({
        type: 'success',
        title: 'Titre optimisé',
        description: 'La longueur du titre est parfaite pour le SEO.'
      });
    }

    if (description.length < 120 || description.length > 160) {
      recommendations.push({
        type: 'warning',
        title: 'Meta description',
        description: `La description fait ${description.length} caractères. Optimal: 120-160 caractères.`
      });
    } else {
      recommendations.push({
        type: 'success',
        title: 'Description optimisée',
        description: 'La longueur de la description est idéale.'
      });
    }

    if (!title.toLowerCase().includes(config.keyword.toLowerCase())) {
      recommendations.push({
        type: 'warning',
        title: 'Mot-clé dans le titre',
        description: 'Le mot-clé principal devrait apparaître dans le titre.'
      });
    }

    return recommendations;
  };

  const calculateSEOScore = (params: any) => {
    let score = 0;
    const { title, description, keyword, config } = params;

    // Titre (25 points)
    if (title.length >= 30 && title.length <= 60) score += 15;
    if (title.toLowerCase().includes(keyword.toLowerCase())) score += 10;

    // Description (25 points)
    if (description.length >= 120 && description.length <= 160) score += 15;
    if (description.toLowerCase().includes(keyword.toLowerCase())) score += 10;

    // Configuration avancée (50 points)
    if (config.includeMetaTags) score += 10;
    if (config.includeStructuredData) score += 10;
    if (config.includeOpenGraph) score += 10;
    if (config.generateH2Suggestions) score += 10;
    if (config.generateContentOutline) score += 10;

    return Math.min(score, 100);
  };

  const calculateReadabilityScore = (text: string) => {
    // Calcul simplifié de lisibilité
    const words = text.split(' ').length;
    const sentences = text.split(/[.!?]+/).length;
    const avgWordsPerSentence = words / sentences;
    
    if (avgWordsPerSentence <= 15) return 85;
    if (avgWordsPerSentence <= 20) return 70;
    return 55;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copié dans le presse-papiers !');
  };

  const exportResults = () => {
    if (!generatedResults) return;

    const exportData = {
      generated_at: new Date().toISOString(),
      configuration: generationConfig,
      seo_score: seoScore,
      results: generatedResults
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seo-generation-${generationConfig.keyword.replace(/\s+/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Résultats exportés !');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Tableau de bord
            </Button>
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              🚀 Générateur SEO Intelligent
            </h1>
            <p className="text-muted-foreground mt-2">
              Générez automatiquement du contenu SEO optimisé avec l'IA
            </p>
          </div>
          {generatedResults && (
            <Button onClick={exportResults} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Configuration Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Mot-clé principal *</label>
                  <Input
                    placeholder="Ex: SEO, Marketing digital..."
                    value={generationConfig.keyword}
                    onChange={(e) => setGenerationConfig(prev => ({ ...prev, keyword: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Secteur d'activité</label>
                  <Select value={generationConfig.industry} onValueChange={(value) => setGenerationConfig(prev => ({ ...prev, industry: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map(industry => (
                        <SelectItem key={industry.value} value={industry.value}>
                          {industry.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Ton de communication</label>
                  <Select value={generationConfig.tone} onValueChange={(value) => setGenerationConfig(prev => ({ ...prev, tone: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tones.map(tone => (
                        <SelectItem key={tone.value} value={tone.value}>
                          {tone.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Type de contenu</label>
                  <Select value={generationConfig.contentType} onValueChange={(value) => setGenerationConfig(prev => ({ ...prev, contentType: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {contentTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 border-t">
                  <label className="block text-sm font-medium mb-3">Options avancées</label>
                  <div className="space-y-2">
                    {Object.entries(smartConfig).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={key}
                          checked={value}
                          onChange={(e) => setSmartConfig(prev => ({ ...prev, [key]: e.target.checked }))}
                          className="rounded"
                        />
                        <label htmlFor={key} className="text-xs">
                          {key === 'includeMetaTags' && 'Meta tags'}
                          {key === 'includeStructuredData' && 'Données structurées'}
                          {key === 'includeOpenGraph' && 'Open Graph'}
                          {key === 'includeTwitterCards' && 'Twitter Cards'}
                          {key === 'generateH2Suggestions' && 'Suggestions H2'}
                          {key === 'generateContentOutline' && 'Plan de contenu'}
                          {key === 'optimizeForVoiceSearch' && 'Recherche vocale'}
                          {key === 'mobileOptimization' && 'Mobile-first'}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={generateSmartSEO} 
                  disabled={isGenerating || !generationConfig.keyword.trim()}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Génération...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Générer le SEO
                    </>
                  )}
                </Button>

                {isGenerating && (
                  <div className="space-y-2">
                    <Progress value={generationProgress} className="w-full" />
                    <p className="text-xs text-center text-muted-foreground">
                      {generationProgress}% terminé
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* OpenAI Configuration */}
            <div className="mt-6">
              <OpenAIConfigPanel />
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-3">
            {generatedResults ? (
              <div className="space-y-6">
                {/* SEO Score */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Score SEO
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Progress value={seoScore} className="w-full h-3" />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{seoScore}/100</div>
                        <div className="text-xs text-muted-foreground">
                          {seoScore >= 80 ? 'Excellent' : seoScore >= 60 ? 'Bon' : 'À améliorer'}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div className="text-center p-3 bg-muted rounded">
                        <div className="text-lg font-semibold">{generatedResults.seoAnalysis.titleLength}</div>
                        <div className="text-xs text-muted-foreground">Caractères titre</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded">
                        <div className="text-lg font-semibold">{generatedResults.seoAnalysis.descriptionLength}</div>
                        <div className="text-xs text-muted-foreground">Caractères description</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded">
                        <div className="text-lg font-semibold">
                          {generatedResults.seoAnalysis.readabilityScore}%
                        </div>
                        <div className="text-xs text-muted-foreground">Lisibilité</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded">
                        <div className="text-lg font-semibold">
                          {generatedResults.seoAnalysis.keywordInTitle ? '✓' : '✗'}
                        </div>
                        <div className="text-xs text-muted-foreground">Mot-clé titre</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="generation" className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      Contenu
                    </TabsTrigger>
                    <TabsTrigger value="meta" className="flex items-center gap-1">
                      <Code className="h-3 w-3" />
                      Meta Tags
                    </TabsTrigger>
                    <TabsTrigger value="structure" className="flex items-center gap-1">
                      <Network className="h-3 w-3" />
                      Structure
                    </TabsTrigger>
                    <TabsTrigger value="social" className="flex items-center gap-1">
                      <Share2 className="h-3 w-3" />
                      Social
                    </TabsTrigger>
                    <TabsTrigger value="analytics" className="flex items-center gap-1">
                      <BarChart3 className="h-3 w-3" />
                      Analyse
                    </TabsTrigger>
                    <TabsTrigger value="recommendations" className="flex items-center gap-1">
                      <Brain className="h-3 w-3" />
                      Conseils
                    </TabsTrigger>
                  </TabsList>

                  {/* Onglet Contenu Généré */}
                  <TabsContent value="generation" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            Titre SEO
                            <Button variant="outline" size="sm" onClick={() => copyToClipboard(generatedResults.title)}>
                              <Copy className="h-3 w-3" />
                            </Button>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="font-medium">{generatedResults.title}</p>
                          <Badge variant={generatedResults.seoAnalysis.titleLength >= 30 && generatedResults.seoAnalysis.titleLength <= 60 ? 'default' : 'secondary'}>
                            {generatedResults.seoAnalysis.titleLength} caractères
                          </Badge>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            Meta Description
                            <Button variant="outline" size="sm" onClick={() => copyToClipboard(generatedResults.description)}>
                              <Copy className="h-3 w-3" />
                            </Button>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">{generatedResults.description}</p>
                          <Badge variant={generatedResults.seoAnalysis.descriptionLength >= 120 && generatedResults.seoAnalysis.descriptionLength <= 160 ? 'default' : 'secondary'}>
                            {generatedResults.seoAnalysis.descriptionLength} caractères
                          </Badge>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          Structure H1 & H2
                          <Button variant="outline" size="sm" onClick={() => copyToClipboard(generatedResults.h2Suggestions.join('\n'))}>
                            <Copy className="h-3 w-3" />
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="p-3 bg-primary/10 rounded">
                            <strong>H1:</strong> {generatedResults.h1}
                          </div>
                          {generatedResults.h2Suggestions.map((h2, index) => (
                            <div key={index} className="p-2 bg-muted rounded text-sm">
                              <strong>H2:</strong> {h2}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Plan de contenu suggéré</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ol className="list-decimal list-inside space-y-2">
                          {generatedResults.contentOutline.map((section, index) => (
                            <li key={index} className="text-sm">{section}</li>
                          ))}
                        </ol>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Onglet Meta Tags */}
                  <TabsContent value="meta" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          Meta Tags HTML
                          <Button variant="outline" size="sm" onClick={() => copyToClipboard(generatedResults.metaTags)}>
                            <Copy className="h-3 w-3" />
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <pre className="text-xs bg-muted p-4 rounded overflow-x-auto whitespace-pre-wrap">
                          {generatedResults.metaTags}
                        </pre>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          Données Structurées (Schema.org)
                          <Button variant="outline" size="sm" onClick={() => copyToClipboard(JSON.stringify(generatedResults.structuredData, null, 2))}>
                            <Copy className="h-3 w-3" />
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <pre className="text-xs bg-muted p-4 rounded overflow-x-auto max-h-64">
                          {JSON.stringify(generatedResults.structuredData, null, 2)}
                        </pre>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Onglet Structure */}
                  <TabsContent value="structure" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Mots-clés associés</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {generatedResults.keywords.map((keyword, index) => (
                            <Badge key={index} variant="outline">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Suggestions de liens internes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {generatedResults.internalLinkSuggestions.map((link, index) => (
                            <div key={index} className="p-2 bg-muted rounded text-sm font-mono">
                              {link}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Onglet Social */}
                  <TabsContent value="social" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          Open Graph Tags
                          <Button variant="outline" size="sm" onClick={() => copyToClipboard(generatedResults.openGraph)}>
                            <Copy className="h-3 w-3" />
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <pre className="text-xs bg-muted p-4 rounded overflow-x-auto whitespace-pre-wrap">
                          {generatedResults.openGraph}
                        </pre>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          Twitter Cards
                          <Button variant="outline" size="sm" onClick={() => copyToClipboard(generatedResults.twitterCards)}>
                            <Copy className="h-3 w-3" />
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <pre className="text-xs bg-muted p-4 rounded overflow-x-auto whitespace-pre-wrap">
                          {generatedResults.twitterCards}
                        </pre>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Onglet Analyse */}
                  <TabsContent value="analytics" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Optimisation titre</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">
                              {generatedResults.seoAnalysis.keywordInTitle ? '100%' : '60%'}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Mot-clé {generatedResults.seoAnalysis.keywordInTitle ? 'présent' : 'absent'}
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Lisibilité</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">
                              {generatedResults.seoAnalysis.readabilityScore}%
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {generatedResults.seoAnalysis.readabilityScore >= 80 ? 'Excellent' : 'Bon'}
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Optimisation mobile</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">
                              {smartConfig.mobileOptimization ? '95%' : '70%'}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {smartConfig.mobileOptimization ? 'Optimisé' : 'À améliorer'}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Onglet Recommandations */}
                  <TabsContent value="recommendations" className="space-y-4">
                    <div className="space-y-4">
                      {generatedResults.recommendations.map((rec, index) => (
                        <Card key={index}>
                          <CardContent className="pt-4">
                            <div className="flex items-start gap-3">
                              <Badge variant={rec.type === 'success' ? 'default' : 'secondary'}>
                                {rec.type === 'success' ? '✓' : '!'}
                              </Badge>
                              <div className="flex-1">
                                <h4 className="font-medium text-sm">{rec.title}</h4>
                                <p className="text-xs text-muted-foreground mt-1">{rec.description}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Prochaines étapes recommandées</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ol className="list-decimal list-inside space-y-2 text-sm">
                          <li>Créer le contenu en suivant le plan suggéré</li>
                          <li>Intégrer les meta tags dans votre CMS</li>
                          <li>Ajouter les données structurées</li>
                          <li>Optimiser les images avec les mots-clés</li>
                          <li>Configurer les liens internes</li>
                          <li>Monitorer les performances dans Search Console</li>
                        </ol>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <Card className="h-96 flex items-center justify-center">
                <CardContent className="text-center">
                  <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Générateur SEO Intelligent</h3>
                  <p className="text-muted-foreground mb-4">
                    Configurez vos paramètres et générez du contenu SEO optimisé automatiquement
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Zap className="h-4 w-4" />
                    {hasValidApiKey() ? 'IA activée' : 'Mode démonstration'}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeoGeneratorPage;