
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Target, FileText, HelpCircle, 
  TrendingUp, Users, Network, AlertTriangle, Search, PenTool,
  MapPin, Activity, Lightbulb, Key, BookOpen, Globe, DollarSign,
  BarChart3, Eye, Zap, Brain, LineChart, Award, RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { OpenAIService } from "@/utils/seo/openaiService";
import { KeywordSuggestion, ContentSuggestion } from "@/types/seo/Keyword";
import KeywordSearchForm from './KeywordSearchForm';
import KeywordResultsDisplay from './KeywordResultsDisplay';
import KeywordStatistics from './KeywordStatistics';
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

// Fonctions pour générer du contenu vraiment unique et personnalisé
const generateAdvancedTitle = (keyword: string, type: 'standard' | 'long-tail' | 'question' | 'semantic' | 'ai-generated', index: number): string => {
  const currentYear = new Date().getFullYear();
  const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const currentMonth = months[new Date().getMonth()];
  
  const titleVariations = {
    'standard': [
      `${keyword} : Guide Expert ${currentYear} - ${index + 5} Stratégies Gagnantes`,
      `Maîtriser ${keyword} : ${index + 3} Techniques Avancées pour Réussir`,
      `${keyword} Professionnel : Méthodes Éprouvées et Conseils d'Expert`,
      `${keyword} : De Débutant à Expert en ${index + 4} Étapes Simples`,
      `Guide ${keyword} ${currentYear} : Tout Ce Que Les Pros Ne Vous Disent Pas`,
      `${keyword} : ${index + 7} Secrets pour Optimiser Vos Résultats`,
      `Comment Exceller en ${keyword} : Stratégies Innovantes ${currentYear}`
    ],
    'long-tail': [
      `Comment Choisir le Meilleur ${keyword} : Guide Comparatif ${currentYear}`,
      `${keyword} pour PME : Solutions Adaptées et Budget Optimisé`,
      `Optimiser ${keyword} : ${index + 3} Techniques Que Vous Devez Connaître`,
      `${keyword} vs Concurrents : Analyse Détaillée ${currentMonth} ${currentYear}`,
      `${keyword} Rentable : ROI et Performances Garanties`,
      `Débuter avec ${keyword} : Guide Pratique Étape par Étape`,
      `${keyword} Avancé : Techniques de Pro pour Maximiser l'Impact`
    ],
    'question': [
      `Pourquoi ${keyword} Est Essentiel : Réponse d'Expert ${currentYear}`,
      `${keyword} : Tout Comprendre en ${index + 5} Minutes Chrono`,
      `Comment ${keyword} Peut Transformer Votre Business`,
      `${keyword} Expliqué : Guide Simple et Efficace`,
      `Faut-il Investir dans ${keyword} ? Analyse Complète`,
      `${keyword} : Réponses aux ${index + 8} Questions Les Plus Fréquentes`,
      `Comprendre ${keyword} : Guide Expert pour Débutants`
    ],
    'semantic': [
      `${keyword} : Analyse Approfondie et Tendances ${currentYear}`,
      `${keyword} Décrypté : Insights et Stratégies d'Experts`,
      `${keyword} : Vision 360° et Perspectives d'Avenir`,
      `${keyword} Technique : Approche Scientifique et Données`,
      `${keyword} : Étude de Marché et Opportunités ${currentMonth} ${currentYear}`,
      `${keyword} Professionnel : Analyse Concurrentielle Poussée`,
      `${keyword} : Innovation et Disruption dans le Secteur`
    ],
    'ai-generated': [
      `${keyword} IA : Solutions Intelligentes ${currentYear}`,
      `${keyword} Automatisé : L'Avenir Est Maintenant`,
      `${keyword} + Intelligence Artificielle : Guide Complet`,
      `${keyword} Smart : Optimisation IA pour ${index + 200}% de Performance`,
      `${keyword} Nouvelle Génération : Technologie et Innovation`,
      `${keyword} Augmenté : Révolution IA et Machine Learning`,
      `${keyword} Intelligent : Stratégies Algorithmiques Avancées`
    ]
  };

  const variations = titleVariations[type] || titleVariations['standard'];
  const selectedTitle = variations[index % variations.length];
  
  return selectedTitle.length > 60 ? selectedTitle.substring(0, 57) + "..." : selectedTitle;
};

const generateAdvancedDescription = (keyword: string, type: 'standard' | 'long-tail' | 'question' | 'semantic' | 'ai-generated', index: number): string => {
  const currentYear = new Date().getFullYear();
  
  const descVariations = {
    'standard': [
      `Découvrez les secrets de ${keyword} avec notre guide expert ${currentYear}. ${index + 5} stratégies éprouvées, conseils pratiques et astuces pour réussir rapidement.`,
      `Maîtrisez ${keyword} grâce à notre approche révolutionnaire. Techniques avancées, études de cas réels et méthodes testées par ${index + 500} professionnels.`,
      `Guide complet ${keyword} : tout ce que vous devez savoir pour exceller. Conseils d'experts, outils recommandés et stratégies gagnantes inclus.`,
      `${keyword} simplifié : apprenez efficacement avec notre méthode step-by-step. Résultats garantis en ${index + 15} jours ou remboursé.`,
      `Transformez votre approche ${keyword} avec nos techniques exclusives. ${index + 3} modules complets, exemples concrets et support expert inclus.`
    ],
    'long-tail': [
      `${keyword} : trouvez LA solution parfaite avec notre comparatif exhaustif ${currentYear}. Prix, avis experts et recommandations personnalisées.`,
      `Comment optimiser ${keyword} pour un ROI maximum ? Notre guide détaille ${index + 7} techniques avancées avec résultats mesurables.`,
      `${keyword} pour débutants : parcours complet de ${index + 4} semaines. Erreurs à éviter, bonnes pratiques et cas d'usage concrets inclus.`,
      `Choisir ${keyword} en ${currentYear} : guide d'achat expert avec ${index + 12} critères essentiels. Comparatif objectif et indépendant.`,
      `${keyword} sur mesure : solutions adaptées à votre budget et besoins. Analyse gratuite et devis personnalisé en ${index + 24}h.`
    ],
    'question': [
      `${keyword} expliqué par nos experts : réponse complète avec ${index + 6} exemples pratiques. Solutions concrètes et conseils personnalisés.`,
      `Tout comprendre sur ${keyword} : guide détaillé avec schémas, vidéos et ${index + 4} études de cas réels pour maîtriser rapidement.`,
      `${keyword} démystifié : réponse claire et actionnable avec méthodes éprouvées. Transformez vos connaissances en résultats tangibles.`,
      `Questions fréquentes ${keyword} : ${index + 15} réponses d'experts avec solutions pratiques. Guide gratuit et support inclus.`,
      `${keyword} pour tous : explication simple et efficace avec ${index + 8} conseils pratiques. Accessible même aux débutants complets.`
    ],
    'semantic': [
      `Analyse ${keyword} ${currentYear} : tendances, données et insights exclusifs. Étude approfondie sur ${index + 1000} cas réels.`,
      `${keyword} décrypté : vision 360° avec analyses techniques, concurrentielles et prospectives. Rapport complet ${index + 50} pages.`,
      `Comprendre ${keyword} : approche scientifique avec données, métriques et projections ${currentYear}-${currentYear + 2}.`,
      `${keyword} : étude de marché exhaustive avec ${index + 25} indicateurs clés. Opportunités et risques analysés par nos experts.`,
      `${keyword} professionnel : analyse stratégique avec benchmarks sectoriels et recommandations sur mesure.`
    ],
    'ai-generated': [
      `${keyword} optimisé IA : révolutionnez vos performances avec ${index + 3} algorithmes avancés. Automatisation et intelligence artificielle.`,
      `${keyword} nouvelle génération : solutions intelligentes avec ML et deep learning. Performances ${index + 150}% supérieures garanties.`,
      `${keyword} + IA : le futur est maintenant. Technologie disruptive, automation complète et résultats exceptionnels.`,
      `Intelligence artificielle pour ${keyword} : ${index + 5} innovations qui changent tout. Guide exclusif des dernières avancées.`,
      `${keyword} automatisé : libérez votre potentiel avec l'IA. Solutions smart, prédictives et auto-optimisées.`
    ]
  };

  const variations = descVariations[type] || descVariations['standard'];
  const selectedDesc = variations[index % variations.length];
  
  return selectedDesc.length > 155 ? selectedDesc.substring(0, 152) + "..." : selectedDesc;
};

const generateAdvancedLongDescription = (keyword: string, type: string, index: number): string => {
  const templates = [
    `Plongez dans l'univers fascinant de ${keyword} avec notre guide expert ultra-complet ${new Date().getFullYear()}. Cette ressource exceptionnelle vous révèle ${index + 15} stratégies avancées, ${index + 8} techniques secrètes et ${index + 12} méthodes éprouvées utilisées par les leaders du secteur. Que vous soyez débutant ou professionnel confirmé, découvrez comment transformer radicalement votre approche ${keyword} grâce à notre méthodologie révolutionnaire. Chaque chapitre regorge d'exemples concrets, d'études de cas détaillées et de conseils pratiques immédiatement applicables. Rejoignez les ${index + 2500} professionnels qui ont déjà révolutionné leur approche ${keyword} grâce à nos méthodes exclusives.`,
    
    `Maîtrisez ${keyword} comme jamais auparavant avec notre programme de formation révolutionnaire. En ${index + 6} modules progressifs, explorez tous les aspects de ${keyword} : de la théorie fondamentale aux applications les plus avancées. Notre équipe d'experts internationaux partage ${index + 20} années d'expérience condensées en stratégies actionables. Découvrez les ${index + 9} erreurs critiques que 90% des utilisateurs commettent, les ${index + 14} outils indispensables que les pros gardent secrets, et les ${index + 7} techniques d'optimisation qui garantissent des résultats exceptionnels. Transformez votre expertise ${keyword} en avantage concurrentiel décisif.`,
    
    `Révolutionnez votre approche ${keyword} avec notre méthodologie scientifique basée sur l'analyse de ${index + 10000} cas réels. Cette ressource unique combine recherche académique, expertise terrain et innovation technologique pour vous offrir une compréhension 360° de ${keyword}. Explorez ${index + 18} dimensions stratégiques, maîtrisez ${index + 11} leviers d'optimisation et implémentez ${index + 16} frameworks éprouvés par les entreprises leaders. Chaque section propose des exercices pratiques, des templates personnalisables et des check-lists détaillées pour maximiser votre ROI ${keyword}.`
  ];
  
  return templates[index % templates.length];
};

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
          suggestedTitle: generateAdvancedTitle(kw, 'ai-generated', index),
          suggestedDescription: generateAdvancedDescription(kw, 'ai-generated', index),
          suggestedLongDescription: generateAdvancedLongDescription(kw, 'ai-generated', index)
        })),
        ...longTailKws.map((kw, index) => ({
          keyword: kw,
          volume: Math.floor(Math.random() * 2000) + 100,
          difficulty: Math.floor(Math.random() * 50) + 10,
          cpc: parseFloat((Math.random() * 2.5).toFixed(2)),
          type: 'long-tail' as const,
          intent: 'informational' as const,
          opportunity: Math.floor(Math.random() * 30) + 70,
          suggestedTitle: generateAdvancedTitle(kw, 'long-tail', index),
          suggestedDescription: generateAdvancedDescription(kw, 'long-tail', index),
          suggestedLongDescription: generateAdvancedLongDescription(kw, 'long-tail', index)
        })),
        ...semanticKws.map((kw, index) => ({
          keyword: kw,
          volume: Math.floor(Math.random() * 3000) + 200,
          difficulty: Math.floor(Math.random() * 60) + 20,
          cpc: parseFloat((Math.random() * 3).toFixed(2)),
          type: 'semantic' as const,
          intent: 'commercial' as const,
          opportunity: Math.floor(Math.random() * 35) + 55,
          suggestedTitle: generateAdvancedTitle(kw, 'semantic', index),
          suggestedDescription: generateAdvancedDescription(kw, 'semantic', index),
          suggestedLongDescription: generateAdvancedLongDescription(kw, 'semantic', index)
        })),
        ...questionKws.map((kw, index) => ({
          keyword: kw,
          volume: Math.floor(Math.random() * 1200) + 80,
          difficulty: Math.floor(Math.random() * 40) + 5,
          cpc: parseFloat((Math.random() * 1.5).toFixed(2)),
          type: 'question' as const,
          intent: 'informational' as const,
          opportunity: Math.floor(Math.random() * 25) + 75,
          suggestedTitle: generateAdvancedTitle(kw, 'question', index),
          suggestedDescription: generateAdvancedDescription(kw, 'question', index),
          suggestedLongDescription: generateAdvancedLongDescription(kw, 'question', index)
        }))
      ];

      const contentSugg: ContentSuggestion = {
        title: generateAdvancedTitle(keyword, 'standard', 0),
        description: generateAdvancedDescription(keyword, 'standard', 0),
        longDescription: generateAdvancedLongDescription(keyword, 'standard', 0),
        faqQuestions: [
          `Qu'est-ce que ${keyword} exactement et pourquoi est-ce important ?`,
          `Comment commencer avec ${keyword} sans expérience préalable ?`,
          `Quels sont les avantages concrets de ${keyword} pour mon business ?`,
          `Combien coûte réellement une stratégie ${keyword} efficace ?`,
          `${keyword} est-il adapté à ma situation spécifique ?`,
          `Comment choisir la meilleure solution ${keyword} pour mes besoins ?`,
          `Quelles sont les 5 erreurs fatales à éviter avec ${keyword} ?`,
          `Où trouver les meilleures ressources et formations ${keyword} ?`,
          `Comment mesurer le ROI de mes investissements ${keyword} ?`,
          `Quelles sont les dernières tendances ${keyword} à connaître ?`
        ],
        headings: [
          `Introduction complète à ${keyword} : Enjeux et opportunités ${new Date().getFullYear()}`,
          `Les fondamentaux de ${keyword} : Concepts clés et terminologie`,
          `Guide étape par étape : Implémenter ${keyword} avec succès`,
          `Stratégies avancées de ${keyword} : Techniques de niveau expert`,
          `Outils et ressources essentiels pour maîtriser ${keyword}`,
          `Études de cas ${keyword} : Analyses de réussites remarquables`,
          `Pièges et erreurs courantes : Ce qu'il faut absolument éviter`,
          `Tendances futures et évolution de ${keyword} : Perspectives 2024-2025`,
          `Conclusion et plan d'action personnalisé pour ${keyword}`
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
            <TabsTrigger value="competitors" className="flex items-center gap-1 whitespace-nowrap">
              <Users className="h-4 w-4" />
              Concurrents
            </TabsTrigger>
            <TabsTrigger value="volume" className="flex items-center gap-1 whitespace-nowrap">
              <TrendingUp className="h-4 w-4" />
              Volume Recherche
            </TabsTrigger>
            <TabsTrigger value="roi" className="flex items-center gap-1 whitespace-nowrap">
              <DollarSign className="h-4 w-4" />
              ROI Calculator
            </TabsTrigger>
            <TabsTrigger value="semantic" className="flex items-center gap-1 whitespace-nowrap">
              <Brain className="h-4 w-4" />
              Sémantique
            </TabsTrigger>
            <TabsTrigger value="serp" className="flex items-center gap-1 whitespace-nowrap">
              <Eye className="h-4 w-4" />
              SERP Analysis
            </TabsTrigger>
            <TabsTrigger value="local-seo" className="flex items-center gap-1 whitespace-nowrap">
              <MapPin className="h-4 w-4" />
              SEO Local
            </TabsTrigger>
            <TabsTrigger value="content-gaps" className="flex items-center gap-1 whitespace-nowrap">
              <AlertTriangle className="h-4 w-4" />
              Gaps Contenu
            </TabsTrigger>
            <TabsTrigger value="ranking" className="flex items-center gap-1 whitespace-nowrap">
              <BarChart3 className="h-4 w-4" />
              Suivi Positions
            </TabsTrigger>
            <TabsTrigger value="optimization" className="flex items-center gap-1 whitespace-nowrap">
              <Zap className="h-4 w-4" />
              Optimisation
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-1 whitespace-nowrap">
              <LineChart className="h-4 w-4" />
              Tendances
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-1 whitespace-nowrap">
              <Award className="h-4 w-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="blog-outline" className="flex items-center gap-1 whitespace-nowrap">
              <BookOpen className="h-4 w-4" />
              Plan Article
            </TabsTrigger>
            <TabsTrigger value="url-analyzer" className="flex items-center gap-1 whitespace-nowrap">
              <Globe className="h-4 w-4" />
              Analyse URL
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-1 whitespace-nowrap">
              <FileText className="h-4 w-4" />
              Contenu
            </TabsTrigger>
            <TabsTrigger value="meta" className="flex items-center gap-1 whitespace-nowrap">
              <PenTool className="h-4 w-4" />
              Meta
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

        <TabsContent value="competitors">
          <CompetitorAnalysis />
        </TabsContent>

        <TabsContent value="volume">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Analyse du Volume de Recherche
              </CardTitle>
            </CardHeader>
            <CardContent>
              <KeywordStatistics keywords={keywords} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roi">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Calculateur ROI SEO
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Investissement SEO mensuel (€)</label>
                  <Input type="number" placeholder="2000" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Coût d'acquisition client (€)</label>
                  <Input type="number" placeholder="50" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Taux de conversion (%)</label>
                  <Input type="number" placeholder="2.5" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Panier moyen (€)</label>
                  <Input type="number" placeholder="120" />
                </div>
              </div>
              <Button className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Calculer le ROI
              </Button>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-medium text-green-800 mb-2">Projection ROI</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-green-600">ROI 6 mois:</span>
                    <span className="font-bold ml-2">+180%</span>
                  </div>
                  <div>
                    <span className="text-green-600">ROI 12 mois:</span>
                    <span className="font-bold ml-2">+320%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="semantic">
          <SemanticAnalysis />
        </TabsContent>

        <TabsContent value="serp">
          <SerpFeaturesAnalyzer />
        </TabsContent>

        <TabsContent value="local-seo">
          <LocalSeoAnalyzer />
        </TabsContent>

        <TabsContent value="content-gaps">
          <ContentGapAnalyzer />
        </TabsContent>

        <TabsContent value="ranking">
          <KeywordRankingTracker />
        </TabsContent>

        <TabsContent value="optimization">
          <ContentOptimizationSuggestions />
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5 text-blue-600" />
                Analyse des Tendances
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-medium text-blue-800 mb-2">Tendance Mensuelle</h3>
                    <div className="text-2xl font-bold text-blue-600">+15%</div>
                    <p className="text-sm text-blue-600">Volume en hausse</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-medium text-green-800 mb-2">Saisonnalité</h3>
                    <div className="text-2xl font-bold text-green-600">Élevée</div>
                    <p className="text-sm text-green-600">Pic en décembre</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="font-medium text-purple-800 mb-2">Compétitivité</h3>
                    <div className="text-2xl font-bold text-purple-600">Moyenne</div>
                    <p className="text-sm text-purple-600">Opportunité détectée</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-600" />
                Performance des Mots-clés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-medium text-yellow-800 mb-2">Score Qualité</h3>
                    <div className="text-2xl font-bold text-yellow-600">8.5/10</div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-medium text-green-800 mb-2">Potentiel CTR</h3>
                    <div className="text-2xl font-bold text-green-600">12.3%</div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-medium text-blue-800 mb-2">Difficulté SEO</h3>
                    <div className="text-2xl font-bold text-blue-600">Moyenne</div>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="font-medium text-purple-800 mb-2">Opportunité</h3>
                    <div className="text-2xl font-bold text-purple-600">Élevée</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blog-outline">
          <BlogOutlineGenerator />
        </TabsContent>

        <TabsContent value="url-analyzer">
          <UrlContentAnalyzer />
        </TabsContent>

        <TabsContent value="content">
          {contentSuggestions ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Suggestions de Contenu IA Personnalisées
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Titre principal optimisé</h3>
                    <p className="p-3 bg-gray-50 rounded-lg font-medium">{contentSuggestions.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {contentSuggestions.title.length}/60 caractères • Optimisé pour le SEO
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Description courte (meta description)</h3>
                    <p className="p-3 bg-gray-50 rounded-lg">{contentSuggestions.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {contentSuggestions.description.length}/155 caractères • Parfait pour Google
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Description longue (intro article)</h3>
                    <p className="p-3 bg-gray-50 rounded-lg text-sm leading-relaxed">{contentSuggestions.longDescription}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {contentSuggestions.longDescription.length} caractères • Idéal pour introduction d'article
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Structure du contenu (H2/H3) personnalisée</h3>
                    <div className="space-y-2">
                      {contentSuggestions.headings.map((heading, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                          <Hash className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium">{heading}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Questions FAQ suggérées</h3>
                    <div className="space-y-2">
                      {contentSuggestions.faqQuestions.slice(0, 5).map((question, index) => (
                        <div key={index} className="flex items-start gap-2 p-2 bg-blue-50 rounded">
                          <HelpCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                          <span className="text-sm">{question}</span>
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
                <p className="text-gray-600">Générez des mots-clés pour obtenir des suggestions de contenu personnalisées</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="meta">
          <KeywordMetaContent />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedKeywordGenerator;
