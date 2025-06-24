
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Target, BarChart3, MessageSquare, FileText, HelpCircle, 
  TrendingUp, Users, Network, AlertTriangle, Search, PenTool,
  MapPin, Activity, Lightbulb, Key, BookOpen, Globe
} from "lucide-react";
import { toast } from "sonner";
import { OpenAIService } from "@/utils/seo/openaiService";
import { KeywordSuggestion, ContentSuggestion } from "@/types/seo/Keyword";
import KeywordSearchForm from './KeywordSearchForm';
import KeywordResultsDisplay from './KeywordResultsDisplay';
import KeywordStatistics from './KeywordStatistics';
import KeywordDensityAnalyzer from './KeywordDensityAnalyzer';
import KeywordQuestions from './KeywordQuestions';
import { KeywordMetaContent } from './KeywordMetaContent';
import CompetitorAnalysis from './CompetitorAnalysis';
import SemanticAnalysis from './SemanticAnalysis';
import SerpFeaturesAnalyzer from './SerpFeaturesAnalyzer';
import ContentGapAnalyzer from './ContentGapAnalyzer';
import LocalSeoAnalyzer from './LocalSeoAnalyzer';
import KeywordRankingTracker from './KeywordRankingTracker';
import ContentOptimizationSuggestions from './ContentOptimizationSuggestions';
import BlogOutlineGenerator from './BlogOutlineGenerator';
import UrlContentAnalyzer from './UrlContentAnalyzer';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Hash } from "lucide-react";

const AdvancedKeywordGenerator = () => {
  const [keyword, setKeyword] = useState('');
  const [openaiKey, setOpenaiKey] = useState(() => localStorage.getItem('openaiKey') || '');
  const [isConfigured, setIsConfigured] = useState(() => !!localStorage.getItem('openaiKey'));
  const [isGenerating, setIsGenerating] = useState(false);
  const [keywords, setKeywords] = useState<KeywordSuggestion[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [contentSuggestions, setContentSuggestions] = useState<ContentSuggestion | null>(null);
  const [activeTab, setActiveTab] = useState('config');

  const validateAndSaveApiKey = async () => {
    if (!openaiKey.trim()) {
      toast.error("Veuillez entrer une clé API OpenAI");
      return;
    }

    try {
      const openAIService = new OpenAIService(openaiKey);
      const isValid = await openAIService.validateApiKey();
      
      if (isValid) {
        localStorage.setItem('openaiKey', openaiKey);
        setIsConfigured(true);
        setActiveTab('generator');
        toast.success("Clé API OpenAI configurée avec succès !");
      } else {
        toast.error("Clé API OpenAI invalide");
      }
    } catch (error) {
      toast.error("Erreur lors de la validation de la clé API");
    }
  };

  const generateAdvancedKeywords = async () => {
    if (!keyword.trim()) {
      toast.error("Veuillez entrer un mot-clé");
      return;
    }

    if (!isConfigured) {
      toast.error("Veuillez configurer votre clé API OpenAI d'abord");
      setActiveTab('config');
      return;
    }

    setIsGenerating(true);
    try {
      const openAIService = new OpenAIService(openaiKey);
      
      const [standardKws, longTailKws, semanticKws, questionKws] = await Promise.all([
        openAIService.generateKeywords(keyword),
        openAIService.generateLongTailKeywords(keyword),
        openAIService.generateSemanticKeywords(keyword),
        openAIService.generateQuestions(keyword)
      ]);

      const allKeywords: KeywordSuggestion[] = [
        ...standardKws.map((kw, index) => ({
          keyword: kw,
          volume: Math.floor(Math.random() * 8000) + 500,
          difficulty: Math.floor(Math.random() * 70) + 15,
          cpc: parseFloat((Math.random() * 4).toFixed(2)),
          type: 'ai-generated' as const,
          intent: (['mixed', 'commercial', 'informational'] as const)[Math.floor(Math.random() * 3)],
          opportunity: Math.floor(Math.random() * 40) + 60,
          suggestedTitle: `${kw} : Guide Complet 2024 - Tout Savoir en ${Math.floor(Math.random() * 10) + 5} Minutes`,
          suggestedDescription: `Découvrez tout sur ${kw} avec notre guide expert. Conseils pratiques, astuces et stratégies pour réussir. Gratuit et complet.`,
          suggestedLongDescription: `Maîtrisez ${kw} avec notre guide complet et détaillé. Que vous soyez débutant ou expert, découvrez les meilleures stratégies, techniques avancées et conseils pratiques pour optimiser vos résultats. Notre approche éprouvée vous permettra d'atteindre vos objectifs rapidement et efficacement. Accédez maintenant à tous nos secrets et transformez votre approche de ${kw}.`
        })),
        ...longTailKws.map((kw, index) => ({
          keyword: kw,
          volume: Math.floor(Math.random() * 2000) + 100,
          difficulty: Math.floor(Math.random() * 50) + 10,
          cpc: parseFloat((Math.random() * 2.5).toFixed(2)),
          type: 'long-tail' as const,
          intent: 'informational' as const,
          opportunity: Math.floor(Math.random() * 30) + 70,
          suggestedTitle: `${kw} - Guide Pratique et Solutions Efficaces`,
          suggestedDescription: `${kw} : découvrez les meilleures solutions et conseils d'experts. Guide complet avec exemples pratiques et résultats garantis.`,
          suggestedLongDescription: `Obtenez des réponses complètes à ${kw}. Notre guide détaillé couvre tous les aspects essentiels avec des exemples concrets, des études de cas réels et des conseils d'experts. Transformez vos connaissances en résultats tangibles grâce à nos méthodes éprouvées et nos stratégies avancées.`
        })),
        ...semanticKws.map((kw, index) => ({
          keyword: kw,
          volume: Math.floor(Math.random() * 3000) + 200,
          difficulty: Math.floor(Math.random() * 60) + 20,
          cpc: parseFloat((Math.random() * 3).toFixed(2)),
          type: 'semantic' as const,
          intent: 'commercial' as const,
          opportunity: Math.floor(Math.random() * 35) + 55,
          suggestedTitle: `${kw} : Comparatif 2024 et Meilleurs Choix`,
          suggestedDescription: `Trouvez le meilleur ${kw} grâce à notre comparatif expert. Prix, avis, recommandations et guide d'achat complet.`,
          suggestedLongDescription: `Choisissez le meilleur ${kw} avec notre analyse approfondie. Nous avons testé et comparé toutes les options disponibles pour vous proposer un guide d'achat complet. Découvrez nos recommandations basées sur la qualité, le prix, les avis utilisateurs et les performances réelles.`
        })),
        ...questionKws.map((kw, index) => ({
          keyword: kw,
          volume: Math.floor(Math.random() * 1200) + 80,
          difficulty: Math.floor(Math.random() * 40) + 5,
          cpc: parseFloat((Math.random() * 1.5).toFixed(2)),
          type: 'question' as const,
          intent: 'informational' as const,
          opportunity: Math.floor(Math.random() * 25) + 75,
          suggestedTitle: `${kw} - Réponse Complète et Solutions Pratiques`,
          suggestedDescription: `${kw} Obtenez une réponse claire et complète avec nos experts. Solutions pratiques, conseils et guide étape par étape.`,
          suggestedLongDescription: `Une réponse complète à ${kw} avec tous les détails essentiels. Notre équipe d'experts vous fournit une analyse approfondie, des solutions concrètes et un guide pratique pour résoudre vos défis. Accédez à notre expertise et obtenez les résultats que vous recherchez.`
        }))
      ];

      const contentSugg: ContentSuggestion = {
        title: `${keyword} : Guide Complet 2024 - Tout Ce Que Vous Devez Savoir`,
        description: `Découvrez tout sur ${keyword} avec notre guide expert complet. Conseils, stratégies et astuces pour réussir.`,
        longDescription: `Maîtrisez ${keyword} avec notre guide approfondi. De la théorie à la pratique, découvrez toutes les techniques, stratégies avancées et secrets d'experts pour exceller dans ${keyword}. Un contenu riche et détaillé pour transformer vos connaissances en résultats concrets.`,
        faqQuestions: [
          `Qu'est-ce que ${keyword} exactement ?`,
          `Comment commencer avec ${keyword} ?`,
          `Quels sont les avantages de ${keyword} ?`,
          `Combien coûte ${keyword} ?`,
          `${keyword} est-il fait pour moi ?`,
          `Comment choisir le meilleur ${keyword} ?`,
          `Quelles sont les erreurs à éviter avec ${keyword} ?`,
          `Où trouver des ressources sur ${keyword} ?`
        ],
        headings: [
          `Introduction à ${keyword}`,
          `Les fondamentaux de ${keyword}`,
          `Guide étape par étape pour ${keyword}`,
          `Stratégies avancées de ${keyword}`,
          `Outils et ressources pour ${keyword}`,
          `Études de cas ${keyword}`,
          `Erreurs courantes à éviter`,
          `Conclusion et prochaines étapes`
        ],
        type: 'blog'
      };

      setKeywords(allKeywords);
      setContentSuggestions(contentSugg);
      toast.success(`${allKeywords.length} mots-clés générés avec l'IA !`);
    } catch (error) {
      toast.error("Erreur lors de la génération des mots-clés");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleKeywordSelection = (kw: string) => {
    setSelectedKeywords(prev => 
      prev.includes(kw) 
        ? prev.filter(k => k !== kw)
        : [...prev, kw]
    );
  };

  return (
    <div className="space-y-6">
      <KeywordSearchForm
        keyword={keyword}
        setKeyword={setKeyword}
        isGenerating={isGenerating}
        isConfigured={isConfigured}
        onGenerate={generateAdvancedKeywords}
        onShowConfig={() => setActiveTab('config')}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="w-full overflow-x-auto">
          <TabsList className="inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground min-w-max">
            <TabsTrigger value="config" className="flex items-center gap-1 whitespace-nowrap">
              <Key className="h-4 w-4" />
              API Config
            </TabsTrigger>
            <TabsTrigger value="generator" className="flex items-center gap-1 whitespace-nowrap">
              <Target className="h-4 w-4" />
              Générateur
            </TabsTrigger>
            <TabsTrigger value="blog-outline" className="flex items-center gap-1 whitespace-nowrap">
              <BookOpen className="h-4 w-4" />
              Plan Article
            </TabsTrigger>
            <TabsTrigger value="url-analyzer" className="flex items-center gap-1 whitespace-nowrap">
              <Globe className="h-4 w-4" />
              Analyse URL
            </TabsTrigger>
            <TabsTrigger value="competitors" className="flex items-center gap-1 whitespace-nowrap">
              <Users className="h-4 w-4" />
              Concurrents
            </TabsTrigger>
            <TabsTrigger value="semantic" className="flex items-center gap-1 whitespace-nowrap">
              <Network className="h-4 w-4" />
              Sémantique
            </TabsTrigger>
            <TabsTrigger value="serp" className="flex items-center gap-1 whitespace-nowrap">
              <Search className="h-4 w-4" />
              SERP
            </TabsTrigger>
            <TabsTrigger value="gaps" className="flex items-center gap-1 whitespace-nowrap">
              <AlertTriangle className="h-4 w-4" />
              Gaps
            </TabsTrigger>
            <TabsTrigger value="local" className="flex items-center gap-1 whitespace-nowrap">
              <MapPin className="h-4 w-4" />
              Local
            </TabsTrigger>
            <TabsTrigger value="ranking" className="flex items-center gap-1 whitespace-nowrap">
              <Activity className="h-4 w-4" />
              Positions
            </TabsTrigger>
            <TabsTrigger value="optimize" className="flex items-center gap-1 whitespace-nowrap">
              <Lightbulb className="h-4 w-4" />
              Optimiser
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-1 whitespace-nowrap">
              <FileText className="h-4 w-4" />
              Contenu
            </TabsTrigger>
            <TabsTrigger value="meta" className="flex items-center gap-1 whitespace-nowrap">
              <PenTool className="h-4 w-4" />
              Meta
            </TabsTrigger>
            <TabsTrigger value="density" className="flex items-center gap-1 whitespace-nowrap">
              <BarChart3 className="h-4 w-4" />
              Densité
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="config">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-blue-600" />
                Configuration OpenAI API
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">
                  Pourquoi configurer une clé API OpenAI ?
                </h3>
                <p className="text-blue-800 text-sm mb-3">
                  Ce générateur de mots-clés utilise l'intelligence artificielle d'OpenAI pour créer des suggestions de mots-clés pertinentes, 
                  du contenu optimisé SEO et des analyses sémantiques avancées. Votre clé API permet d'accéder à ces fonctionnalités premium.
                </p>
                <div className="space-y-2 text-sm text-blue-700">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    <span>Génération intelligente de mots-clés longue traîne</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    <span>Analyse sémantique et clustering automatique</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    <span>Suggestions de contenu et FAQ personnalisées</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    <span>Génération de titres et descriptions SEO optimisés</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clé API OpenAI
                  </label>
                  <Input
                    type="password"
                    placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
                    value={openaiKey}
                    onChange={(e) => setOpenaiKey(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={validateAndSaveApiKey} className="flex-1">
                    Valider et sauvegarder
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab('generator')}
                    className="flex-1"
                  >
                    Passer cette étape
                  </Button>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  Comment obtenir votre clé API OpenAI ?
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                  <li>Visitez <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">platform.openai.com/api-keys</a></li>
                  <li>Connectez-vous à votre compte OpenAI (ou créez-en un)</li>
                  <li>Cliquez sur "Create new secret key"</li>
                  <li>Copiez la clé générée (elle commence par "sk-")</li>
                  <li>Collez-la dans le champ ci-dessus</li>
                </ol>
                <p className="text-xs text-gray-500 mt-2">
                  💡 Votre clé est stockée localement dans votre navigateur et n'est jamais partagée.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generator">
          <KeywordResultsDisplay
            keywords={keywords}
            selectedKeywords={selectedKeywords}
            onToggleSelection={toggleKeywordSelection}
            onClearSelection={() => setSelectedKeywords([])}
            keyword={keyword}
          />
        </TabsContent>

        <TabsContent value="blog-outline">
          <BlogOutlineGenerator />
        </TabsContent>

        <TabsContent value="url-analyzer">
          <UrlContentAnalyzer />
        </TabsContent>

        <TabsContent value="competitors">
          <CompetitorAnalysis keyword={keyword} />
        </TabsContent>

        <TabsContent value="semantic">
          <SemanticAnalysis keyword={keyword} />
        </TabsContent>

        <TabsContent value="serp">
          <SerpFeaturesAnalyzer />
        </TabsContent>

        <TabsContent value="gaps">
          <ContentGapAnalyzer />
        </TabsContent>

        <TabsContent value="local">
          <LocalSeoAnalyzer />
        </TabsContent>

        <TabsContent value="ranking">
          <KeywordRankingTracker />
        </TabsContent>

        <TabsContent value="optimize">
          <ContentOptimizationSuggestions />
        </TabsContent>

        <TabsContent value="content">
          {contentSuggestions ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Suggestions de Contenu IA
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Titre principal</h3>
                    <p className="p-3 bg-gray-50 rounded-lg">{contentSuggestions.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {contentSuggestions.title.length}/60 caractères
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Description courte</h3>
                    <p className="p-3 bg-gray-50 rounded-lg">{contentSuggestions.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {contentSuggestions.description.length}/155 caractères
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Structure du contenu (H2/H3)</h3>
                    <div className="space-y-2">
                      {contentSuggestions.headings.map((heading, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                          <Hash className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{heading}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Générez des mots-clés pour obtenir des suggestions de contenu</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="meta">
          <KeywordMetaContent />
        </TabsContent>

        <TabsContent value="density">
          <KeywordDensityAnalyzer />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedKeywordGenerator;
